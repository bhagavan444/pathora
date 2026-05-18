from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl
from typing import List, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Enterprise AI Backend 2026"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "https://carrer-intelligence.vercel.app",
        "http://localhost:5173",
        "https://pathora-backend1.onrender.com"
    ]
    
    # Security
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    
    # Databases
    POSTGRES_URI: str | None = None
    MONGODB_URI: str | None = None
    REDIS_URI: str | None = None
    QDRANT_URL: str | None = None
    
    # AI API Keys
    GEMINI_API_KEY: str
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    
    # Worker
    CELERY_BROKER_URL: str | None = None
    CELERY_RESULT_BACKEND: str | None = None

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra='allow')

import logging
import sys

try:
    settings = Settings()
except Exception as e:
    logging.error(f"Startup Configuration Error: Failed to load settings. Ensure required environment variables (SECRET_KEY, GEMINI_API_KEY) are set. Details: {e}")
    sys.exit(1)
