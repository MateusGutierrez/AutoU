import os
from typing import Optional, List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "SparkMail"
    app_version: str = "1.0.0"
    debug: bool = False
    host: str = "0.0.0.0"
    port: int = 8000
    
    openai_api_key: Optional[str] = None
    huggingface_api_key: Optional[str] = None
    openai_model: str = "gpt-3.5-turbo"
    
    max_upload_size: int = 10 * 1024 * 1024
    allowed_extensions: List[str] = ["txt", "pdf"]
    upload_folder: str = "uploads"

    cors_origins: List[str] = ["*"]
    cors_allow_credentials: bool = True
    cors_allow_methods: List[str] = ["*"]
    cors_allow_headers: List[str] = ["*"]
    secret_key: str = "your-secret-key-change-in-production"
    redis_url: Optional[str] = None
    cache_ttl: int = 3600
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
    
    def get_ai_provider(self) -> str:
        if self.openai_api_key:
            return "openai"
        elif self.huggingface_api_key:
            return "huggingface"
        else:
            return "fallback"

settings = Settings()