import os
import json
import uuid
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, List, Optional
from apps.api.app.core.config import settings
from apps.api.app.db.client import get_supabase_client

logger = logging.getLogger(__name__)

# Development/test fallback data directory (NOTE: Render Free has an ephemeral disk;
# Supabase PostgreSQL is the authoritative production database).
DATA_DIR = Path("apps/api/data")
STORE_FILE = DATA_DIR / "brandforge_store.json"


class DataRepository:
    """
    Data Repository handling persistence for projects, brand_runs, brand_artifacts,
    selected_directions, exports, and chat_messages.
    
    PERSISTENCE ARCHITECTURE:
    - Supabase PostgreSQL is the authoritative production database.
    - On Render (including Render Free without persistent disks), all data is persisted
      to Supabase PostgreSQL tables so that data is never lost across container restarts.
    - The local in-memory/JSON store is strictly a development and test fallback.
    """

    def __init__(self, use_supabase: bool = True):
        self.client = get_supabase_client() if use_supabase else None
        self._projects_db: Dict[str, Dict[str, Any]] = {}
        self._runs_db: Dict[str, Dict[str, Any]] = {}
        self._artifacts_db: List[Dict[str, Any]] = []
        self._selections_db: List[Dict[str, Any]] = []
        self._exports_db: Dict[str, Dict[str, Any]] = {}
        self._chat_db: List[Dict[str, Any]] = []
        
        # Check and log production persistence configuration
        self._verify_persistence_configuration()

        # Load development/test fallback store if available
        self._load_from_fallback_disk()

    def _verify_persistence_configuration(self) -> None:
        """Verify persistence configuration at startup."""
        env = (os.getenv("ENVIRONMENT") or "development").strip().lower()
        is_render = bool(os.getenv("RENDER") or os.getenv("RENDER_SERVICE_ID"))

        if self.client:
            logger.info("[PERSISTENCE] Supabase PostgreSQL connected. Supabase is the active production source of truth.")
        else:
            if env == "production" or is_render:
                raise RuntimeError(
                    "Production configuration error: Supabase client is not initialized. "
                    "Render Free instances have ephemeral filesystems and cannot persist data to local disk. "
                    "SUPABASE_SECRET_KEY and SUPABASE_URL must be configured in production."
                )
            logger.warning(
                "[PERSISTENCE WARNING] Supabase PostgreSQL client not configured. "
                "Running in local development/test fallback mode. "
                "NOTICE: Local disk/memory storage is for development/testing only and will NOT survive Render restarts."
            )

    def _load_from_fallback_disk(self) -> None:
        """Load fallback data from disk if present (for local dev/testing)."""
        try:
            if STORE_FILE.exists():
                with open(STORE_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self._projects_db = data.get("projects", {})
                    self._runs_db = data.get("runs", {})
                    self._artifacts_db = data.get("artifacts", [])
                    self._selections_db = data.get("selections", [])
                    self._exports_db = data.get("exports", {})
                    self._chat_db = data.get("chat", [])
                    logger.debug("Loaded development fallback state from disk.")
        except Exception as e:
            logger.debug(f"Could not load fallback state from disk: {e}")

    def _save_to_fallback_disk(self) -> None:
        """Save fallback data to disk (safe best-effort for local dev; does not crash if disk is ephemeral)."""
        try:
            DATA_DIR.mkdir(parents=True, exist_ok=True)
            with open(STORE_FILE, "w", encoding="utf-8") as f:
                json.dump({
                    "projects": self._projects_db,
                    "runs": self._runs_db,
                    "artifacts": self._artifacts_db,
                    "selections": self._selections_db,
                    "exports": self._exports_db,
                    "chat": self._chat_db,
                }, f, indent=2)
        except Exception as e:
            logger.debug(f"Could not save fallback state to disk (expected on read-only/ephemeral filesystems): {e}")

    # ==========================================
    # PROJECTS
    # ==========================================
    def create_project(self, user_id: str, name: str, idea: str, constraints: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        now_str = datetime.now(timezone.utc).isoformat()
        project_id = str(uuid.uuid4())
        record = {
            "id": project_id,
            "user_id": user_id,
            "name": name,
            "idea": idea,
            "constraints": constraints or {},
            "status": "created",
            "created_at": now_str,
            "updated_at": now_str,
        }

        # Write to Supabase (Production Source of Truth)
        if self.client:
            try:
                res = self.client.table("projects").insert({
                    "id": project_id,
                    "user_id": user_id,
                    "name": name,
                    "idea": idea,
                    "status": "created",
                    "created_at": now_str,
                    "updated_at": now_str,
                }).execute()
                if res and res.data and len(res.data) > 0:
                    record = {**record, **res.data[0]}
            except Exception as e:
                logger.warning(f"Supabase create_project write failed: {e}")

        # Update cache & fallback
        self._projects_db[project_id] = record
        self._save_to_fallback_disk()
        return record

    def list_projects_for_user(self, user_id: str) -> List[Dict[str, Any]]:
        # Read from Supabase (Production Source of Truth)
        if self.client:
            try:
                res = self.client.table("projects").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
                if res and res.data is not None:
                    for item in res.data:
                        self._projects_db[item["id"]] = item
                    return res.data
            except Exception as e:
                logger.warning(f"Supabase list_projects read failed: {e}")

        return [p for p in self._projects_db.values() if p.get("user_id") == user_id]

    def get_project_by_id(self, project_id: str) -> Optional[Dict[str, Any]]:
        # Read from Supabase (Production Source of Truth)
        if self.client:
            try:
                res = self.client.table("projects").select("*").eq("id", project_id).limit(1).execute()
                if res and res.data and len(res.data) > 0:
                    record = res.data[0]
                    self._projects_db[project_id] = record
                    return record
            except Exception as e:
                logger.warning(f"Supabase get_project_by_id read failed: {e}")

        return self._projects_db.get(project_id)

    # ==========================================
    # BRAND RUNS
    # ==========================================
    def create_brand_run(self, project_id: str) -> Dict[str, Any]:
        now_str = datetime.now(timezone.utc).isoformat()
        run_id = str(uuid.uuid4())
        existing_runs = self.list_runs_for_project(project_id)
        version = len(existing_runs) + 1
        
        record = {
            "id": run_id,
            "project_id": project_id,
            "version": version,
            "status": "pending",
            "started_at": now_str,
            "completed_at": None,
        }

        # Write to Supabase (Production Source of Truth)
        if self.client:
            try:
                res = self.client.table("brand_runs").insert(record).execute()
                if res and res.data and len(res.data) > 0:
                    record = res.data[0]
            except Exception as e:
                logger.warning(f"Supabase create_brand_run write failed: {e}")

        self._runs_db[run_id] = record
        self._save_to_fallback_disk()
        return record

    def update_brand_run_status(self, run_id: str, status: str) -> Optional[Dict[str, Any]]:
        record = self.get_brand_run_by_id(run_id)
        if not record:
            return None
        record["status"] = status
        if status in ("completed", "failed"):
            record["completed_at"] = datetime.now(timezone.utc).isoformat()

        # Update in Supabase (Production Source of Truth)
        if self.client:
            try:
                res = self.client.table("brand_runs").update({
                    "status": status,
                    "completed_at": record.get("completed_at")
                }).eq("id", run_id).execute()
                if res and res.data and len(res.data) > 0:
                    record = res.data[0]
            except Exception as e:
                logger.warning(f"Supabase update_brand_run_status write failed: {e}")

        self._runs_db[run_id] = record
        self._save_to_fallback_disk()
        return record

    def get_brand_run_by_id(self, run_id: str) -> Optional[Dict[str, Any]]:
        # Read from Supabase (Production Source of Truth)
        if self.client:
            try:
                res = self.client.table("brand_runs").select("*").eq("id", run_id).limit(1).execute()
                if res and res.data and len(res.data) > 0:
                    record = res.data[0]
                    self._runs_db[run_id] = record
                    return record
            except Exception as e:
                logger.warning(f"Supabase get_brand_run_by_id read failed: {e}")

        return self._runs_db.get(run_id)

    def list_runs_for_project(self, project_id: str) -> List[Dict[str, Any]]:
        # Read from Supabase (Production Source of Truth)
        if self.client:
            try:
                res = self.client.table("brand_runs").select("*").eq("project_id", project_id).order("version").execute()
                if res and res.data is not None:
                    for r in res.data:
                        self._runs_db[r["id"]] = r
                    return res.data
            except Exception as e:
                logger.warning(f"Supabase list_runs_for_project read failed: {e}")

        return [r for r in self._runs_db.values() if r.get("project_id") == project_id]

    # ==========================================
    # SELECTIONS
    # ==========================================
    def create_selection(self, project_id: str, direction_type: str, selected_value: Dict[str, Any]) -> Dict[str, Any]:
        now_str = datetime.now(timezone.utc).isoformat()
        selection_id = str(uuid.uuid4())
        record = {
            "id": selection_id,
            "project_id": project_id,
            "direction_type": direction_type,
            "selected_value": selected_value,
            "created_at": now_str,
        }

        # Write to Supabase (Production Source of Truth)
        if self.client:
            try:
                res = self.client.table("selected_directions").insert(record).execute()
                if res and res.data and len(res.data) > 0:
                    record = res.data[0]
            except Exception as e:
                logger.warning(f"Supabase create_selection write failed: {e}")

        self._selections_db.append(record)
        self._save_to_fallback_disk()
        return record

    def get_selections_for_project(self, project_id: str) -> List[Dict[str, Any]]:
        # Read from Supabase (Production Source of Truth)
        if self.client:
            try:
                res = self.client.table("selected_directions").select("*").eq("project_id", project_id).execute()
                if res and res.data is not None:
                    for item in res.data:
                        if not any(s["id"] == item["id"] for s in self._selections_db):
                            self._selections_db.append(item)
                    return res.data
            except Exception as e:
                logger.warning(f"Supabase get_selections_for_project read failed: {e}")

        return [s for s in self._selections_db if s.get("project_id") == project_id]

    # ==========================================
    # ARTIFACTS
    # ==========================================
    def create_artifact(self, run_id: str, stage: str, artifact_json: Dict[str, Any]) -> Dict[str, Any]:
        now_str = datetime.now(timezone.utc).isoformat()
        artifact_id = str(uuid.uuid4())
        record = {
            "id": artifact_id,
            "run_id": run_id,
            "stage": stage,
            "artifact_json": artifact_json,
            "created_at": now_str,
        }

        # Write to Supabase (Production Source of Truth)
        if self.client:
            try:
                res = self.client.table("brand_artifacts").insert(record).execute()
                if res and res.data and len(res.data) > 0:
                    record = res.data[0]
            except Exception as e:
                logger.warning(f"Supabase create_artifact write failed: {e}")

        # Update cache & fallback
        existing = [a for a in self._artifacts_db if a.get("run_id") == run_id and a.get("stage") == stage]
        if existing:
            existing[0]["artifact_json"] = artifact_json
            existing[0]["created_at"] = now_str
        else:
            self._artifacts_db.append(record)
        self._save_to_fallback_disk()
        return record

    def get_artifacts_for_run(self, run_id: str) -> List[Dict[str, Any]]:
        # Read from Supabase (Production Source of Truth)
        if self.client:
            try:
                res = self.client.table("brand_artifacts").select("*").eq("run_id", run_id).execute()
                if res and res.data is not None:
                    for item in res.data:
                        if not any(a["id"] == item["id"] for a in self._artifacts_db):
                            self._artifacts_db.append(item)
                    return res.data
            except Exception as e:
                logger.warning(f"Supabase get_artifacts_for_run read failed: {e}")

        return [a for a in self._artifacts_db if a.get("run_id") == run_id]

    def get_or_create_active_run(self, project_id: str) -> Dict[str, Any]:
        runs = self.list_runs_for_project(project_id)
        if runs:
            return runs[-1]
        return self.create_brand_run(project_id)

    # ==========================================
    # AUTHORITATIVE BRAND STATE
    # ==========================================
    def get_accumulated_brand_state(self, project_id: str) -> Dict[str, Any]:
        """
        Single authoritative source of truth for a project's BrandState.
        Accumulates across all runs for the project (latest runs take precedence for any stage).
        """
        project = self.get_project_by_id(project_id) or {}
        runs = self.list_runs_for_project(project_id)
        sorted_runs = sorted(runs, key=lambda r: r.get("version", 0))
        
        artifact_map: Dict[str, Any] = {}
        canonical_stages = [
            "discovery",
            "positioning",
            "personality",
            "naming",
            "visual",
            "critique",
            "consistency",
            "launch",
        ]
        
        for r in sorted_runs:
            for a in self.get_artifacts_for_run(r["id"]):
                stage = a.get("stage", "")
                if stage in ("visualize", "visual_direction"):
                    stage = "visual"
                artifact_map[stage] = a.get("artifact_json", {})

        # Ensure visual alias exists for consumers expecting visual_direction
        if "visual" in artifact_map:
            artifact_map["visual_direction"] = artifact_map["visual"]
        elif "visual_direction" in artifact_map:
            artifact_map["visual"] = artifact_map["visual_direction"]
            
        selections = self.get_selections_for_project(project_id)
        selected_dict = {s.get("direction_type"): s.get("selected_value") for s in selections}
        
        latest_run = sorted_runs[-1] if sorted_runs else None
        completed_stages = [s for s in canonical_stages if s in artifact_map]
        
        overall_status = "created"
        if len(completed_stages) == len(canonical_stages):
            overall_status = "completed"
        elif latest_run:
            overall_status = latest_run.get("status", "in_progress")
        elif completed_stages:
            overall_status = "in_progress"

        return {
            "project_id": project_id,
            "project": project,
            "latest_run": latest_run,
            "run_id": latest_run["id"] if latest_run else None,
            "artifact_map": artifact_map,
            "completed_stages": completed_stages,
            "total_stages": len(canonical_stages),
            "stages_completed_ratio": f"{len(completed_stages)}/{len(canonical_stages)}",
            "selected_directions": selected_dict,
            "status": overall_status,
            "revision_count": len(sorted_runs) - 1 if len(sorted_runs) > 1 else 0
        }

    # ==========================================
    # EXPORTS
    # ==========================================
    def create_export(self, project_id: str, export_type: str, storage_path: str) -> Dict[str, Any]:
        now_str = datetime.now(timezone.utc).isoformat()
        export_id = str(uuid.uuid4())
        record = {
            "id": export_id,
            "project_id": project_id,
            "type": export_type,
            "storage_path": storage_path,
            "created_at": now_str,
        }

        # Write to Supabase (Production Source of Truth)
        if self.client:
            try:
                res = self.client.table("exports").insert(record).execute()
                if res and res.data and len(res.data) > 0:
                    record = res.data[0]
            except Exception as e:
                logger.warning(f"Supabase create_export write failed: {e}")

        self._exports_db[export_id] = record
        self._save_to_fallback_disk()
        return record

    def get_export_by_id(self, export_id: str) -> Optional[Dict[str, Any]]:
        # Read from Supabase (Production Source of Truth)
        if self.client:
            try:
                res = self.client.table("exports").select("*").eq("id", export_id).limit(1).execute()
                if res and res.data and len(res.data) > 0:
                    record = res.data[0]
                    self._exports_db[export_id] = record
                    return record
            except Exception as e:
                logger.warning(f"Supabase get_export_by_id read failed: {e}")

        return self._exports_db.get(export_id)

    # ==========================================
    # CHAT MESSAGES
    # ==========================================
    def create_chat_message(
        self,
        project_id: str,
        role: str,
        content: str,
        tool_calls: Optional[List[Dict[str, Any]]] = None,
        mentor_data: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        now_str = datetime.now(timezone.utc).isoformat()
        msg_id = str(uuid.uuid4())
        record = {
            "id": msg_id,
            "project_id": project_id,
            "role": role,
            "content": content,
            "tool_calls": tool_calls or [],
            "mentor_data": mentor_data or {},
            "created_at": now_str,
        }

        # Write to Supabase (Production Source of Truth)
        if self.client:
            try:
                self.client.table("chat_messages").insert({
                    "id": msg_id,
                    "project_id": project_id,
                    "role": role,
                    "content": content,
                    "created_at": now_str,
                }).execute()
            except Exception as e:
                logger.warning(f"Supabase create_chat_message write failed: {e}")

        self._chat_db.append(record)
        self._save_to_fallback_disk()
        return record

    def list_chat_messages(self, project_id: str) -> List[Dict[str, Any]]:
        # Read from Supabase (Production Source of Truth)
        if self.client:
            try:
                res = self.client.table("chat_messages").select("*").eq("project_id", project_id).order("created_at").execute()
                if res and res.data is not None:
                    supabase_msgs = []
                    for item in res.data:
                        local_match = next((m for m in self._chat_db if m["id"] == item["id"]), None)
                        if local_match:
                            merged = {
                                **item,
                                "tool_calls": local_match.get("tool_calls", []),
                                "mentor_data": local_match.get("mentor_data", {})
                            }
                            supabase_msgs.append(merged)
                        else:
                            supabase_msgs.append(item)
                    return supabase_msgs
            except Exception as e:
                logger.warning(f"Supabase list_chat_messages read failed: {e}")

        return [m for m in self._chat_db if m.get("project_id") == project_id]


repository = DataRepository()
