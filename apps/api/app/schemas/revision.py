from pydantic import BaseModel, Field


class RevisionRequest(BaseModel):
    target_stage: str = Field(..., description="Target stage to revise: naming, visual, strategy, etc.")
    feedback: str = Field(..., min_length=3, description="User feedback and revision instructions")


class RevisionResponse(BaseModel):
    status: str
    project_id: str
    target_stage: str
    message: str
