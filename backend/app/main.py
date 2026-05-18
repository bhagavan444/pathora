from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import os

from app.core.config import settings

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Pathora AI Backend — Career Intelligence Platform",
    version="2.0.0"
)

# ─── Middlewares ────────────────────────────────────────────────────────────────

# Telemetry middleware (lightweight, always safe to load)
try:
    from app.middleware.telemetry import TelemetryMiddleware
    app.add_middleware(TelemetryMiddleware)
except Exception as e:
    logger.warning(f"Telemetry middleware skipped: {e}")

# Security middleware (lightweight, always safe to load)
try:
    from app.middleware.security import SecurityMiddleware
    app.add_middleware(SecurityMiddleware)
except Exception as e:
    logger.warning(f"Security middleware skipped: {e}")

# CORS — must be added last so it's the outermost middleware (executed first)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://carrer-intelligence.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Prometheus Metrics (optional) ─────────────────────────────────────────────
try:
    from prometheus_fastapi_instrumentator import Instrumentator
    Instrumentator().instrument(app).expose(app, include_in_schema=False)
except Exception as e:
    logger.info(f"Prometheus metrics skipped: {e}")

# ─── API Routes ────────────────────────────────────────────────────────────────
from app.api.v1.api import api_router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.on_event("startup")
async def startup_event():
    logger.info("=== Starting Pathora AI Backend ===")
    logger.info(f"API prefix: {settings.API_V1_STR}")
    logger.info(f"GEMINI_API_KEY configured: {'Yes' if settings.GEMINI_API_KEY else 'No'}")
    
    # Check optional infrastructure services
    optional_services = {
        "PostgreSQL": settings.POSTGRES_URI,
        "MongoDB": settings.MONGODB_URI,
        "Redis": settings.REDIS_URI,
        "Qdrant": settings.QDRANT_URL,
    }
    
    for service, uri in optional_services.items():
        if uri:
            logger.info(f"  [ACTIVE] {service} configured")
        else:
            logger.info(f"  [SKIPPED] {service} not configured (lightweight mode)")


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": app.version,
        "gemini_configured": bool(settings.GEMINI_API_KEY),
    }
