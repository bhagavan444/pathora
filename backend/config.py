import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    
    # Database Settings
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///fallback.db")
    
    # SQLAlchemy Engine Configuration for Production Stability
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
        "pool_size": 10,
        "max_overflow": 20,
    }
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Environment mode (development/production)
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
