from pydantic import BaseModel
from typing import Dict, Any, Optional, List


class StageArtifactResponse(BaseModel):
    id: str
    run_id: str
    stage: str
    artifact_json: Dict[str, Any]
    created_at: str


class BrandKitResponse(BaseModel):
    project_id: str
    brand_name: Optional[str] = None
    tagline: Optional[str] = None
    one_line_pitch: Optional[str] = None
    artifacts: Dict[str, Any]
    status: str
