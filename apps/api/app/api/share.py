import secrets
from fastapi import APIRouter, Depends, status
from typing import Dict, Any

from apps.api.app.core.security import get_current_user
from apps.api.app.services.project_service import ProjectService
from apps.api.app.services.export_service import ExportService
from apps.api.app.db.repository import repository
from apps.api.app.core.exceptions import NotFoundException

project_share_router = APIRouter(prefix="/api/projects/{project_id}/share", tags=["Brand Kit Sharing"])
public_share_router = APIRouter(prefix="/api/share", tags=["Brand Kit Sharing"])


@project_share_router.post("", status_code=status.HTTP_201_CREATED)
def create_share_link(
    project_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    user_id = current_user["id"]
    # Verify user owns this project
    ProjectService.get_user_project(project_id, user_id)

    # Resolve safe snapshot (scrubbing user IDs and sensitive raw DB keys)
    payload = ExportService._resolve_brand_kit_payload(project_id)
    brand_name = payload.get("brand_name", "BrandForge Venture")

    # Generate a cryptographically secure random URL-safe token
    share_token = secrets.token_urlsafe(24)

    record = repository.create_shared_brand_kit(
        project_id=project_id,
        share_token=share_token,
        brand_name=brand_name,
        snapshot={
            "brand_name": brand_name,
            "tagline": payload.get("tagline", ""),
            "artifacts": payload.get("artifacts", {}),
            "status": payload.get("status", "completed"),
        }
    )

    return {
        "share_token": share_token,
        "share_url": f"/share/{share_token}",
        "brand_name": brand_name,
        "created_at": record.get("created_at"),
    }


@project_share_router.delete("/{share_token}", status_code=status.HTTP_200_OK)
def revoke_share_link(
    project_id: str,
    share_token: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    user_id = current_user["id"]
    ProjectService.get_user_project(project_id, user_id)
    repository.revoke_shared_brand_kit(share_token)
    return {"status": "revoked", "share_token": share_token}


@public_share_router.get("/{share_token}")
def get_public_brand_kit(share_token: str):
    """Public read-only brand kit view without account credentials or database secrets."""
    record = repository.get_shared_brand_kit_by_token(share_token)
    if not record or not record.get("is_active", True):
        raise NotFoundException("Shared brand kit not found or link has expired.")

    return {
        "share_token": share_token,
        "brand_name": record.get("brand_name"),
        "snapshot": record.get("snapshot", {}),
        "created_at": record.get("created_at"),
    }
