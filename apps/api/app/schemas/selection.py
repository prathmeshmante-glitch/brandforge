from pydantic import BaseModel, Field
from typing import Dict, Any


class SelectionRequest(BaseModel):
    direction_type: str = Field(..., description="Choice type: naming_territory, preferred_name, personality, visual_style, approved_option, rejected_option")
    selected_value: Dict[str, Any] = Field(..., description="Choice payload data")


class SelectionResponse(BaseModel):
    id: str
    project_id: str
    direction_type: str
    selected_value: Dict[str, Any]
    created_at: str
