from pydantic import BaseModel, Field
from typing import Optional


class ExportRequest(BaseModel):
    format: str = Field("pdf", description="Export format: pdf, zip, json")


class ExportResponse(BaseModel):
    export_id: str
    project_id: str
    format: str
    download_url: str
    created_at: str
