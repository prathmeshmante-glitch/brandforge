from fastapi import APIRouter, Depends, status, BackgroundTasks
from fastapi.responses import StreamingResponse
from typing import Dict, Any
from apps.api.app.core.security import get_current_user
from apps.api.app.schemas.run import WorkflowStatusResponse
from apps.api.app.schemas.revision import RevisionRequest, RevisionResponse
from apps.api.app.services.workflow_service import WorkflowService

from apps.api.app.core.rate_limit import rate_limiter

router = APIRouter(prefix="/api/projects/{project_id}", tags=["Workflow Engine"])


@router.post("/workflow/start", status_code=status.HTTP_202_ACCEPTED, dependencies=[Depends(rate_limiter(max_requests=10, window_seconds=60))])
def start_workflow(

    project_id: str,
    background_tasks: BackgroundTasks,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    user_id = current_user["id"]
    return WorkflowService.start_workflow(project_id=project_id, user_id=user_id, background_tasks=background_tasks)


@router.get("/workflow/{run_id}", response_model=WorkflowStatusResponse)
def get_workflow_status(project_id: str, run_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    user_id = current_user["id"]
    return WorkflowService.get_workflow_status(project_id=project_id, run_id=run_id, user_id=user_id)


@router.get("/workflow/{run_id}/stream")
def stream_workflow_progress(project_id: str, run_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    user_id = current_user["id"]
    return StreamingResponse(
        WorkflowService.stream_workflow_events(project_id=project_id, run_id=run_id, user_id=user_id),
        media_type="text/event-stream"
    )


@router.post("/revise", response_model=RevisionResponse, status_code=status.HTTP_202_ACCEPTED, dependencies=[Depends(rate_limiter(max_requests=10, window_seconds=60))])
def revise_workflow(

    project_id: str,
    payload: RevisionRequest,
    background_tasks: BackgroundTasks,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    user_id = current_user["id"]
    return WorkflowService.request_revision(
        project_id=project_id,
        user_id=user_id,
        target_stage=payload.target_stage,
        feedback=payload.feedback,
        background_tasks=background_tasks
    )

