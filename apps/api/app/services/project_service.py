from typing import List, Dict, Any
from apps.api.app.db.repository import repository
from apps.api.app.core.exceptions import NotFoundException, ForbiddenException


class ProjectService:
    @staticmethod
    def create_project(user_id: str, name: str, idea: str, constraints: dict = None) -> Dict[str, Any]:
        return repository.create_project(user_id=user_id, name=name, idea=idea, constraints=constraints)

    @staticmethod
    def list_user_projects(user_id: str) -> List[Dict[str, Any]]:
        return repository.list_projects_for_user(user_id)

    @staticmethod
    def get_user_project(project_id: str, user_id: str) -> Dict[str, Any]:
        project = repository.get_project_by_id(project_id)
        if not project:
            raise NotFoundException(f"Project with ID '{project_id}' not found")
        if project["user_id"] != user_id:
            raise ForbiddenException("You do not have authorization to access this project")
        return project
