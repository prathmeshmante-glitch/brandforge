from fastapi import APIRouter, Depends, status
from typing import Dict, Any
from apps.api.app.core.security import get_current_user
from apps.api.app.schemas.chat import ChatRequest, ChatResponse, ChatHistoryResponse
from apps.api.app.services.chat_service import ChatService

router = APIRouter(prefix="/api/projects/{project_id}/chat", tags=["Brand Assistant Chat"])


@router.get("", response_model=ChatHistoryResponse)
def get_chat_history(project_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    user_id = current_user["id"]
    return ChatService.get_history(project_id=project_id, user_id=user_id)


@router.post("", response_model=ChatResponse, status_code=status.HTTP_200_OK)
def send_chat_message(
    project_id: str,
    payload: ChatRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    user_id = current_user["id"]
    return ChatService.process_message(
        project_id=project_id,
        user_id=user_id,
        message=payload.message,
    )
