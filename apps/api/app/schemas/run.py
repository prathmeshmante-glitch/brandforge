from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List


class RunCreate(BaseModel):
    provider: Optional[str] = Field("gemini", description="Configured AI model provider")


class RunResponse(BaseModel):
    id: str
    project_id: str
    version: int
    status: str
    started_at: str
    completed_at: Optional[str] = None


class StageStatus(BaseModel):
    stage: str
    status: str  # pending, running, completed, failed
    artifacts_count: int = 0


class WorkflowStatusResponse(BaseModel):
    run_id: str
    project_id: str
    status: str
    current_stage: str
    stages: List[StageStatus]
