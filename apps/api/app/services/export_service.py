from typing import Dict, Any
from apps.api.app.services.project_service import ProjectService
from apps.api.app.db.repository import repository


class ExportService:
    @staticmethod
    def create_export_job(project_id: str, user_id: str, export_format: str = "pdf") -> Dict[str, Any]:
        ProjectService.get_user_project(project_id, user_id)
        storage_path = f"{user_id}/{project_id}/brand_kit.{export_format}"
        record = repository.create_export(project_id=project_id, export_type=export_format, storage_path=storage_path)
        
        return {
            "export_id": record["id"],
            "project_id": project_id,
            "format": export_format,
            "download_url": f"/api/exports/{record['id']}/download",
            "created_at": record["created_at"]
        }

    @staticmethod
    def get_export_content(export_id: str) -> Dict[str, Any]:
        record = repository.get_export_by_id(export_id)
        if not record:
            from apps.api.app.core.exceptions import NotFoundException
            raise NotFoundException("Export not found")
        project_id = record["project_id"]
        state_bundle = repository.get_accumulated_brand_state(project_id)
        return {
            "export_id": export_id,
            "project_id": project_id,
            "format": record["type"],
            "artifacts": state_bundle["artifact_map"],
        }
