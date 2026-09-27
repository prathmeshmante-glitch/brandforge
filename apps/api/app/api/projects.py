from fastapi import APIRouter, Depends, status
from typing import List, Dict, Any
from apps.api.app.core.security import get_current_user
from apps.api.app.schemas.project import ProjectCreate, ProjectResponse, ProjectDetailResponse
from apps.api.app.services.project_service import ProjectService
from apps.api.app.db.repository import repository

router = APIRouter(prefix="/api/projects", tags=["Projects"])


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(payload: ProjectCreate, current_user: Dict[str, Any] = Depends(get_current_user)):
    user_id = current_user["id"]
    return ProjectService.create_project(user_id=user_id, name=payload.name, idea=payload.idea, constraints=payload.constraints)


@router.get("", response_model=List[ProjectResponse])
def list_projects(current_user: Dict[str, Any] = Depends(get_current_user)):
    user_id = current_user["id"]
    return ProjectService.list_user_projects(user_id)


@router.get("/{project_id}", response_model=ProjectDetailResponse)
def get_project(project_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    user_id = current_user["id"]
    project = ProjectService.get_user_project(project_id, user_id)
    runs = repository.list_runs_for_project(project_id)
    latest_run_id = runs[-1]["id"] if runs else None
    
    return {
        **project,
        "runs_count": len(runs),
        "latest_run_id": latest_run_id
    }


@router.delete("/{project_id}", status_code=status.HTTP_200_OK)
def delete_project(project_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    user_id = current_user["id"]
    return ProjectService.delete_user_project(project_id=project_id, user_id=user_id)

