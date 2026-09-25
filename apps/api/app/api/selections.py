from fastapi import APIRouter, Depends, status
from typing import Dict, Any, List
from apps.api.app.core.security import get_current_user
from apps.api.app.schemas.selection import SelectionRequest, SelectionResponse
from apps.api.app.services.selection_service import SelectionService

router = APIRouter(prefix="/api/projects/{project_id}/selection", tags=["Human Control & Selection"])


@router.post("", response_model=SelectionResponse, status_code=status.HTTP_200_OK)
def save_selection(project_id: str, payload: SelectionRequest, current_user: Dict[str, Any] = Depends(get_current_user)):
    user_id = current_user["id"]
    return SelectionService.save_selection(
        project_id=project_id,
        user_id=user_id,
        direction_type=payload.direction_type,
        selected_value=payload.selected_value
    )


@router.get("", response_model=List[SelectionResponse])
def list_selections(project_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    user_id = current_user["id"]
    return SelectionService.list_selections(project_id=project_id, user_id=user_id)
