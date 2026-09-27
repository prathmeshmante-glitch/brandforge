from fastapi import APIRouter, Depends, status, Response
import json
from typing import Dict, Any
from apps.api.app.core.security import get_current_user
from apps.api.app.schemas.export import ExportRequest, ExportResponse
from apps.api.app.services.export_service import ExportService

from apps.api.app.core.rate_limit import rate_limiter

router = APIRouter(prefix="/api/projects/{project_id}/export", tags=["Exports"])
download_router = APIRouter(prefix="/api/exports", tags=["Exports"])


@router.post("", response_model=ExportResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(rate_limiter(max_requests=10, window_seconds=60))])
def export_brand_kit(project_id: str, payload: ExportRequest = ExportRequest(), current_user: Dict[str, Any] = Depends(get_current_user)):

    user_id = current_user["id"]
    return ExportService.create_export_job(project_id=project_id, user_id=user_id, export_format=payload.format, run_id=payload.run_id)


@download_router.get("/{export_id}/download")
def download_export(
    export_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    user_id = current_user["id"]
    content_bytes, media_type, filename = ExportService.download_export_file(
        export_id=export_id,
        user_id=user_id
    )
    return Response(
        content=content_bytes,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

