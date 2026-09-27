from typing import Optional
from pydantic import BaseModel, Field


class RevisionRequest(BaseModel):
    target_stage: str = Field(..., description="Target stage to revise: naming, visual, strategy, etc.")
    feedback: str = Field(..., min_length=3, description="User feedback and revision instructions")


class RevisionResponse(BaseModel):
    status: str
    project_id: str
    target_stage: str
    new_run_id: Optional[str] = None
    run_id: Optional[str] = None
    message: str

