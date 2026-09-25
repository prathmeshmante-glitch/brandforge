from fastapi import APIRouter, Depends, status
from typing import Dict, Any, List
from apps.api.app.core.security import get_current_user
from apps.api.app.schemas.run import RunCreate, RunResponse
from apps.api.app.services.run_service import RunService
from apps.api.app.db.repository import repository

router = APIRouter(prefix="/api/projects/{project_id}/runs", tags=["Brand Runs"])


@router.post("", response_model=RunResponse, status_code=status.HTTP_201_CREATED)
def create_run(project_id: str, payload: RunCreate = RunCreate(), current_user: Dict[str, Any] = Depends(get_current_user)):
    user_id = current_user["id"]
    return RunService.create_run(project_id=project_id, user_id=user_id)


@router.get("", response_model=List[RunResponse])
def list_runs(project_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    user_id = current_user["id"]
    # Check ownership
    from apps.api.app.services.project_service import ProjectService
    ProjectService.get_user_project(project_id, user_id)
    return repository.list_runs_for_project(project_id)


@router.get("/{run_id}", response_model=RunResponse)
def get_run(project_id: str, run_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    user_id = current_user["id"]
    return RunService.get_run(run_id=run_id, project_id=project_id, user_id=user_id)
