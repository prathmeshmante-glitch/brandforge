from fastapi import APIRouter, Depends, status, Response
import json
from typing import Dict, Any
from apps.api.app.core.security import get_current_user
from apps.api.app.schemas.export import ExportRequest, ExportResponse
from apps.api.app.services.export_service import ExportService

router = APIRouter(prefix="/api/projects/{project_id}/export", tags=["Exports"])
download_router = APIRouter(prefix="/api/exports", tags=["Exports"])


@router.post("", response_model=ExportResponse, status_code=status.HTTP_200_OK)
def export_brand_kit(project_id: str, payload: ExportRequest = ExportRequest(), current_user: Dict[str, Any] = Depends(get_current_user)):
    user_id = current_user["id"]
    return ExportService.create_export_job(project_id=project_id, user_id=user_id, export_format=payload.format)


@download_router.get("/{export_id}/download")
def download_export(export_id: str):
    data = ExportService.get_export_content(export_id)
    content = json.dumps(data, indent=2)
    return Response(
        content=content,
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=brandforge_brand_kit_{export_id}.json"}
    )
