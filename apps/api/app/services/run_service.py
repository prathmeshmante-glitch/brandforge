from typing import Dict, Any, List
from apps.api.app.db.repository import repository
from apps.api.app.services.project_service import ProjectService
from apps.api.app.core.exceptions import NotFoundException


class RunService:
    @staticmethod
    def create_run(project_id: str, user_id: str) -> Dict[str, Any]:
        # Validate project ownership first
        ProjectService.get_user_project(project_id, user_id)
        return repository.create_brand_run(project_id)

    @staticmethod
    def get_run(run_id: str, project_id: str, user_id: str) -> Dict[str, Any]:
        ProjectService.get_user_project(project_id, user_id)
        run = repository.get_brand_run_by_id(run_id)
        if not run or run["project_id"] != project_id:
            raise NotFoundException(f"Brand run with ID '{run_id}' not found for this project")
        return run
