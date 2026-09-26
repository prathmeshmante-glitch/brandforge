from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone


class ToolExecutionResult(BaseModel):
    tool: str
    status: str = "completed"
    details: Dict[str, Any] = Field(default_factory=dict)
    summary: str


class ChatMessage(BaseModel):
    id: str
    role: str  # "user" | "assistant" | "system"
    content: str
    tool_calls: Optional[List[ToolExecutionResult]] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
    tools_executed: List[ToolExecutionResult] = Field(default_factory=list)
    updated_brand_state: Optional[Dict[str, Any]] = None


class ChatHistoryResponse(BaseModel):
    project_id: str
    messages: List[ChatMessage]
