from fastapi import APIRouter, Depends, status
from typing import Dict, Any, List
from apps.api.app.core.security import get_current_user
from apps.api.app.schemas.artifact import BrandKitResponse, StageArtifactResponse
from apps.api.app.services.project_service import ProjectService
from apps.api.app.db.repository import repository
from apps.api.app.core.exceptions import NotFoundException

router = APIRouter(prefix="/api/projects/{project_id}", tags=["Brand Kit & Artifacts"])


@router.get("/brand-kit", response_model=BrandKitResponse)
def get_brand_kit(project_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    user_id = current_user["id"]
    ProjectService.get_user_project(project_id, user_id)
    
    runs = repository.list_runs_for_project(project_id)
    if not runs:
        return {
            "project_id": project_id,
            "brand_name": None,
            "tagline": None,
            "one_line_pitch": None,
            "artifacts": {},
            "status": "no_runs"
        }
        
    latest_run = runs[-1]
    artifacts = repository.get_artifacts_for_run(latest_run["id"])
    artifact_map = {a["stage"]: a["artifact_json"] for a in artifacts}
    
    launch_data = artifact_map.get("launch", {})
    
    return {
        "project_id": project_id,
        "brand_name": launch_data.get("brand_name"),
        "tagline": launch_data.get("tagline"),
        "one_line_pitch": launch_data.get("one_line_pitch"),
        "artifacts": artifact_map,
        "status": latest_run["status"]
    }


@router.get("/artifacts/{stage}", response_model=StageArtifactResponse)
def get_stage_artifact(project_id: str, stage: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    user_id = current_user["id"]
    ProjectService.get_user_project(project_id, user_id)
    
    runs = repository.list_runs_for_project(project_id)
    if not runs:
        raise NotFoundException("No runs found for this project")
        
    latest_run = runs[-1]
    artifacts = repository.get_artifacts_for_run(latest_run["id"])
    stage_artifact = next((a for a in artifacts if a["stage"] == stage), None)
    
    if not stage_artifact:
        raise NotFoundException(f"Artifact for stage '{stage}' not found")
        
    return stage_artifact
