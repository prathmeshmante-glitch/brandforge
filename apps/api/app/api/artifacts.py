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
    project = ProjectService.get_user_project(project_id, user_id)
    
    state_bundle = repository.get_accumulated_brand_state(project_id)
    artifact_map = state_bundle["artifact_map"]
    launch_data = artifact_map.get("launch", {})
    
    # Resolve authoritative brand name
    brand_name = launch_data.get("brand_name")
    if not brand_name and state_bundle.get("selected_directions", {}).get("name"):
        sel_val = state_bundle["selected_directions"]["name"]
        brand_name = sel_val.get("name") if isinstance(sel_val, dict) else str(sel_val)
    if not brand_name:
        brand_name = project.get("name")

    return {
        "project_id": project_id,
        "brand_name": brand_name,
        "tagline": launch_data.get("tagline"),
        "one_line_pitch": launch_data.get("one_line_pitch"),
        "artifacts": artifact_map,
        "status": state_bundle["status"]
    }


@router.get("/artifacts/{stage}", response_model=StageArtifactResponse)
def get_stage_artifact(project_id: str, stage: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    user_id = current_user["id"]
    ProjectService.get_user_project(project_id, user_id)
    
    state_bundle = repository.get_accumulated_brand_state(project_id)
    artifact_map = state_bundle["artifact_map"]
    norm_stage = "visual" if stage in ("visualize", "visual_direction") else stage
    
    if norm_stage not in artifact_map:
        raise NotFoundException(f"Artifact for stage '{stage}' not found")
        
    return {
        "id": f"art-{project_id}-{norm_stage}",
        "run_id": state_bundle["run_id"] or "",
        "stage": stage,
        "artifact_json": artifact_map[norm_stage],
        "created_at": "2026-09-26T22:00:00Z"
    }
