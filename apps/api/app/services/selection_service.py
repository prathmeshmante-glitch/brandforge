from typing import Dict, Any
from apps.api.app.services.project_service import ProjectService
from apps.api.app.db.repository import repository


class SelectionService:
    @staticmethod
    def save_selection(project_id: str, user_id: str, direction_type: str, selected_value: dict) -> Dict[str, Any]:
        ProjectService.get_user_project(project_id, user_id)
        return repository.create_selection(project_id=project_id, direction_type=direction_type, selected_value=selected_value)

    @staticmethod
    def list_selections(project_id: str, user_id: str):
        ProjectService.get_user_project(project_id, user_id)
        return repository.get_selections_for_project(project_id)
