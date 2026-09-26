from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone


class ToolExecutionResult(BaseModel):
    tool: str
    status: str = "completed"
    details: Dict[str, Any] = Field(default_factory=dict)
    summary: str


class MentorResponse(BaseModel):
    intent: str = Field(
        default="GENERAL",
        description="Intent classification: BUSINESS_CLARIFICATION | STRATEGIC_DECISION | BRAND_EDUCATION | CRITIQUE | GENERATION | REVISION | VALIDATION | STATE_EXPLANATION | WORKFLOW_ACTION | GENERAL"
    )
    response_type: str = Field(
        default="teaching",
        description="One of: diagnosis | teaching | decision | question | action"
    )
    answer: str = Field(description="Core response to founder")
    key_insight: Optional[str] = Field(default=None, description="Critical strategic takeaway or thesis")
    assumptions: List[str] = Field(default_factory=list, description="Assumptions identified in current thinking")
    questions: List[str] = Field(default_factory=list, description="1-2 high-value clarifying questions")
    recommended_next_step: Optional[str] = Field(default=None, description="Practical next validation or brand step")
    tool_action: Optional[str] = Field(default=None, description="Allowlisted tool name if strategically appropriate to execute, else None")
    reasoning_summary: Optional[str] = Field(default=None, description="Concise user-facing explanation of why this advice or action was chosen")
    affected_stages: List[str] = Field(default_factory=list, description="Downstream stages affected by this discussion or action")


class ChatMessage(BaseModel):
    id: str
    role: str  # "user" | "assistant" | "system"
    content: str
    tool_calls: Optional[List[ToolExecutionResult]] = None
    mentor_data: Optional[Dict[str, Any]] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
    tools_executed: List[ToolExecutionResult] = Field(default_factory=list)
    updated_brand_state: Optional[Dict[str, Any]] = None
    mentor: Optional[MentorResponse] = None


class ChatHistoryResponse(BaseModel):
    project_id: str
    messages: List[ChatMessage]
