import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from apps.api.app.db.client import get_supabase_client


class DataRepository:
    """
    Data Repository handling persistence for projects, brand_runs, brand_artifacts,
    selected_directions, and exports. Integrates Supabase with local fallback memory.
    """
    def __init__(self):
        self.client = get_supabase_client()
        self._projects_db: Dict[str, Dict[str, Any]] = {}
        self._runs_db: Dict[str, Dict[str, Any]] = {}
        self._artifacts_db: List[Dict[str, Any]] = []
        self._selections_db: List[Dict[str, Any]] = []
        self._exports_db: Dict[str, Dict[str, Any]] = {}

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
        self._projects_db[project_id] = record
        return record

    def list_projects_for_user(self, user_id: str) -> List[Dict[str, Any]]:
        return [p for p in self._projects_db.values() if p["user_id"] == user_id]

    def get_project_by_id(self, project_id: str) -> Optional[Dict[str, Any]]:
        return self._projects_db.get(project_id)

    def create_brand_run(self, project_id: str) -> Dict[str, Any]:
        now_str = datetime.now(timezone.utc).isoformat()
        run_id = str(uuid.uuid4())
        existing_runs = [r for r in self._runs_db.values() if r["project_id"] == project_id]
        version = len(existing_runs) + 1
        
        record = {
            "id": run_id,
            "project_id": project_id,
            "version": version,
            "status": "pending",
            "started_at": now_str,
            "completed_at": None,
        }
        self._runs_db[run_id] = record
        return record

    def get_brand_run_by_id(self, run_id: str) -> Optional[Dict[str, Any]]:
        return self._runs_db.get(run_id)

    def list_runs_for_project(self, project_id: str) -> List[Dict[str, Any]]:
        return [r for r in self._runs_db.values() if r["project_id"] == project_id]

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
        self._selections_db.append(record)
        return record

    def get_selections_for_project(self, project_id: str) -> List[Dict[str, Any]]:
        return [s for s in self._selections_db if s["project_id"] == project_id]

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
        self._artifacts_db.append(record)
        return record

    def get_artifacts_for_run(self, run_id: str) -> List[Dict[str, Any]]:
        return [a for a in self._artifacts_db if a["run_id"] == run_id]

    def get_or_create_active_run(self, project_id: str) -> Dict[str, Any]:
        runs = self.list_runs_for_project(project_id)
        if runs:
            return runs[-1]
        return self.create_brand_run(project_id)

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
                stage = a["stage"]
                if stage in ("visualize", "visual_direction"):
                    stage = "visual"
                artifact_map[stage] = a["artifact_json"]

        # Ensure visual alias exists for consumers expecting visual_direction
        if "visual" in artifact_map:
            artifact_map["visual_direction"] = artifact_map["visual"]
        elif "visual_direction" in artifact_map:
            artifact_map["visual"] = artifact_map["visual_direction"]
            
        selections = self.get_selections_for_project(project_id)
        selected_dict = {s["direction_type"]: s["selected_value"] for s in selections}
        
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
        self._exports_db[export_id] = record
        return record

    def get_export_by_id(self, export_id: str) -> Optional[Dict[str, Any]]:
        return self._exports_db.get(export_id)

    def create_chat_message(
        self,
        project_id: str,
        role: str,
        content: str,
        tool_calls: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        now_str = datetime.now(timezone.utc).isoformat()
        msg_id = str(uuid.uuid4())
        record = {
            "id": msg_id,
            "project_id": project_id,
            "role": role,
            "content": content,
            "tool_calls": tool_calls or [],
            "created_at": now_str,
        }
        if not hasattr(self, "_chat_db"):
            self._chat_db = []
        self._chat_db.append(record)
        return record

    def list_chat_messages(self, project_id: str) -> List[Dict[str, Any]]:
        if not hasattr(self, "_chat_db"):
            self._chat_db = []
        return [m for m in self._chat_db if m["project_id"] == project_id]


repository = DataRepository()
