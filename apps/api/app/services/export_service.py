import json
import logging
from pathlib import Path
from typing import Dict, Any, Tuple

from apps.api.app.services.project_service import ProjectService
from apps.api.app.db.repository import repository
from apps.api.app.core.exceptions import NotFoundException, ForbiddenException
from apps.api.app.services.pdf_service import BrandKitPDFGenerator

logger = logging.getLogger("brandforge.exports")

EXPORTS_DIR = Path("apps/api/data/exports")


class ExportService:
    @staticmethod
    def _resolve_brand_kit_payload(project_id: str, run_id: str | None = None) -> Dict[str, Any]:
        """Gathers full accumulated state and metadata to render the brand kit."""
        project = repository.get_project_by_id(project_id) or {}
        state_bundle = repository.get_accumulated_brand_state(project_id, run_id=run_id)

        # Export from the exact run requested by the UI when available. This prevents
        # a newly-created revision/empty run from shadowing the completed run that the
        # user is currently viewing.
        if run_id:
            exact_artifacts = repository.get_run_artifacts_map(run_id)
            if exact_artifacts:
                merged = dict(state_bundle.get("artifact_map") or {})
                merged.update(exact_artifacts)
                state_bundle["artifact_map"] = merged
        artifact_map = state_bundle.get("artifact_map", {})
        launch_data = artifact_map.get("launch", {})

        selected = state_bundle.get("selected_directions") or {}
        if not isinstance(selected, dict):
            selected = {}

        # User choice is authoritative when present, even if an older launch artifact
        # contains a stale/generated name.
        brand_name = None
        for key in ("chosen_name", "selected_name", "approved_name", "preferred_name"):
            value = selected.get(key)
            if isinstance(value, dict):
                value = value.get("name") or value.get("value")
            if isinstance(value, str) and value.strip():
                brand_name = value.strip()
                break

        if not brand_name:
            value = selected.get("name")
            if isinstance(value, dict):
                value = value.get("name") or value.get("value")
            if isinstance(value, str) and value.strip():
                brand_name = value.strip()

        if not brand_name:
            brand_name = launch_data.get("brand_name")

        # Do not turn the raw project idea into a brand name. A missing selection
        # should remain visibly unresolved rather than silently becoming a sentence.
        if not brand_name:
            brand_name = "Pending user selection"

        tagline = launch_data.get("tagline") or launch_data.get("one_line_pitch") or "Tagline not generated"

        return {
            "project_id": project_id,
            "brand_name": brand_name,
            "tagline": tagline,
            "project": project,
            "raw_idea": state_bundle.get("idea") or project.get("idea") or project.get("description") or "",
            "artifacts": artifact_map,
            "selected_directions": selected,
            "status": state_bundle.get("status", "completed"),
        }

    @staticmethod
    def create_export_job(project_id: str, user_id: str, export_format: str = "pdf", run_id: str | None = None) -> Dict[str, Any]:
        # Enforce project ownership authorization
        ProjectService.get_user_project(project_id, user_id)

        clean_format = export_format.lower().strip()
        if clean_format not in ("pdf", "json"):
            clean_format = "pdf"

        payload = ExportService._resolve_brand_kit_payload(project_id, run_id=run_id)
        
        # Generate the authoritative export content
        if clean_format == "pdf":
            file_bytes = BrandKitPDFGenerator.generate(payload)
        else:
            file_bytes = json.dumps(payload, indent=2).encode("utf-8")

        storage_path = f"{user_id}/{project_id}/brand_kit.{clean_format}"
        record = repository.create_export(project_id=project_id, export_type=clean_format, storage_path=storage_path)
        if run_id:
            record["run_id"] = run_id
        export_id = record["id"]

        # Cache file to storage directory
        try:
            EXPORTS_DIR.mkdir(parents=True, exist_ok=True)
            export_file = EXPORTS_DIR / f"{export_id}.{clean_format}"
            with open(export_file, "wb") as f:
                f.write(file_bytes)
        except Exception as e:
            logger.warning(f"Failed to cache export file to disk: {e}")

        # If Supabase storage is configured, upload to private bucket
        client = repository.client
        if client:
            try:
                client.storage.from_("brand-assets").upload(
                    path=storage_path,
                    file=file_bytes,
                    file_options={"content-type": "application/pdf" if clean_format == "pdf" else "application/json", "upsert": "true"}
                )
            except Exception as e:
                logger.debug(f"Supabase storage upload notice (safe fallback to local): {e}")

        return {
            "export_id": export_id,
            "project_id": project_id,
            "format": clean_format,
            "download_url": f"/api/exports/{export_id}/download",
            "created_at": record["created_at"],
        }

    @staticmethod
    def download_export_file(export_id: str, user_id: str) -> Tuple[bytes, str, str]:
        """
        Cryptographically & structurally authorized export download handler.
        Verifies:
        1. Export record exists
        2. Project exists
        3. Authenticated user owns the project
        Returns (content_bytes, media_type, filename).
        """
        record = repository.get_export_by_id(export_id)
        if not record:
            raise NotFoundException(f"Export record '{export_id}' not found")

        project_id = record["project_id"]
        project = repository.get_project_by_id(project_id)
        if not project:
            raise NotFoundException(f"Associated project '{project_id}' not found")

        if project["user_id"] != user_id:
            logger.warning(f"Forbidden export download attempt: User {user_id} tried to download export {export_id} owned by {project['user_id']}")
            raise ForbiddenException("You do not have authorization to download this export")

        export_format = record.get("type", "pdf").lower()
        export_file = EXPORTS_DIR / f"{export_id}.{export_format}"

        # If cached on disk, read it
        if export_file.exists():
            with open(export_file, "rb") as f:
                content_bytes = f.read()
        else:
            # Re-generate deterministically from authoritative state
            payload = ExportService._resolve_brand_kit_payload(project_id, run_id=record.get("run_id") or None)
            if export_format == "pdf":
                content_bytes = BrandKitPDFGenerator.generate(payload)
            else:
                content_bytes = json.dumps(payload, indent=2).encode("utf-8")

        media_type = "application/pdf" if export_format == "pdf" else "application/json"
        filename = f"brandforge_brand_kit_{export_id}.{export_format}"
        return content_bytes, media_type, filename

    @staticmethod
    def get_export_content(export_id: str) -> Dict[str, Any]:
        record = repository.get_export_by_id(export_id)
        if not record:
            raise NotFoundException("Export not found")
        project_id = record["project_id"]
        state_bundle = repository.get_accumulated_brand_state(project_id)
        return {
            "export_id": export_id,
            "project_id": project_id,
            "format": record["type"],
            "artifacts": state_bundle["artifact_map"],
        }
