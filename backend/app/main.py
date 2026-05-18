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

from app.middleware.telemetry import TelemetryMiddleware
from app.middleware.security import SecurityMiddleware

# Add custom middlewares
app.add_middleware(SecurityMiddleware)
app.add_middleware(TelemetryMiddleware)

# Set up CORS - Add last so it's the outermost middleware (executed first)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://carrer-intelligence.vercel.app",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Metrics - Prometheus Instrumentator
Instrumentator().instrument(app).expose(app, include_in_schema=False)

# Include Routers
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_event():
    logger.info("=== Starting Enterprise AI Backend ===")
    
    # Check Infrastructure Services
    services = {
        "PostgreSQL": settings.POSTGRES_URI,
        "MongoDB": settings.MONGODB_URI,
        "Redis": settings.REDIS_URI,
        "Qdrant": settings.QDRANT_URL,
        "Celery Broker": settings.CELERY_BROKER_URL,
        "Celery Backend": settings.CELERY_RESULT_BACKEND,
    }
    
    for service, uri in services.items():
        if uri:
            logger.info(f"[ACTIVE] {service} is configured.")
        else:
            logger.warning(f"[SKIPPED] {service} is missing. Running in lightweight mode.")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": app.version}
