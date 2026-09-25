from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, description="Project name/title")
    idea: str = Field(..., min_length=5, description="Raw startup or product idea description")
    constraints: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Optional constraints")


class ProjectResponse(BaseModel):
    id: str
    user_id: str
    name: str
    idea: str
    status: str
    created_at: str
    updated_at: str


class ProjectDetailResponse(ProjectResponse):
    runs_count: int = 0
    latest_run_id: Optional[str] = None
