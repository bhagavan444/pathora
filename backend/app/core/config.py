from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl
from typing import List, Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Enterprise AI Backend 2026"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "https://carrer-intelligence.vercel.app",
        "http://localhost:5173",
        "https://pathora-backend1.onrender.com"
    ]
    
    # Security (optional — JWT auth is not currently enforced)
    SECRET_KEY: str = "pathora-default-dev-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    
    # Databases (all optional for lightweight deployment)
    POSTGRES_URI: str | None = None
    MONGODB_URI: str | None = None
    REDIS_URI: str | None = None
    QDRANT_URL: str | None = None
    
    # AI API Keys
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    
    # Worker
    CELERY_BROKER_URL: str | None = None
    CELERY_RESULT_BACKEND: str | None = None

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra='allow')

import logging
import sys

logger = logging.getLogger("config")

try:
    settings = Settings()
    
    # Validate critical keys at startup
    if not settings.GEMINI_API_KEY:
        # Try falling back to OS env (Render sets env vars directly, not via .env)
        env_key = os.environ.get("GEMINI_API_KEY", "")
        if env_key:
            settings.GEMINI_API_KEY = env_key
            logger.info("GEMINI_API_KEY loaded from OS environment.")
        else:
            logger.warning("WARNING: GEMINI_API_KEY is not set. AI features will be unavailable.")
    else:
        logger.info("GEMINI_API_KEY loaded successfully.")
        
except Exception as e:
    logging.error(f"Startup Configuration Error: {e}")
    sys.exit(1)
