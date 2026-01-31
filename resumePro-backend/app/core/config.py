from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Project Info
    PROJECT_NAME: str = "ResumePro"
    PROJECT_VERSION: str = "1.0.0"
    
    # Database
    DATABASE_URL: Optional[str] = None
    
    # JWT/Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    FRONTEND_URL: str = "http://localhost:3000"
    
    # GCP
    GCP_PROJECT_ID: Optional[str] = None
    GCP_BUCKET_NAME: Optional[str] = None
    
    # AI
    GEMINI_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings()