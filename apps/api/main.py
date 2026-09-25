import os
import sys

# Ensure root repository directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apps.api.app.core.config import settings
from apps.api.app.api.projects import router as projects_router
from apps.api.app.api.runs import router as runs_router
from apps.api.app.api.workflows import router as workflows_router
from apps.api.app.api.selections import router as selections_router
from apps.api.app.api.artifacts import router as artifacts_router
from apps.api.app.api.exports import router as exports_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI Brand Intelligence Studio Backend API",
    version=settings.VERSION,
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(projects_router)
app.include_router(runs_router)
app.include_router(workflows_router)
app.include_router(selections_router)
app.include_router(artifacts_router)
app.include_router(exports_router)


@app.get("/", tags=["Health"])
def read_root():
    return {
        "status": "ok",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
