from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
import logging

from app.core.config import settings
from app.api.v1.api import api_router

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Enterprise AI Backend 2026 - Scalable, Streaming, Distributed",
    version="2.0.0"
)

# Set up CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

from app.middleware.telemetry import TelemetryMiddleware
from app.middleware.security import SecurityMiddleware

# Add custom middlewares
app.add_middleware(SecurityMiddleware)
app.add_middleware(TelemetryMiddleware)

# Metrics - Prometheus Instrumentator
Instrumentator().instrument(app).expose(app, include_in_schema=False)

# Include Routers
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": app.version}
