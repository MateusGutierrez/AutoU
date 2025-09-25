import os
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    app_title: str = os.getenv("APP_TITLE", "SparkMail")
    app_description: str = os.getenv("APP_DESCRIPTION", "Classificação automática de emails")
    app_version: str = os.getenv("APP_VERSION", "1.0.0")
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    classification_temperature: float = float(os.getenv("CLASSIFICATION_TEMPERATURE", "0.3"))
    classification_max_tokens: int = int(os.getenv("CLASSIFICATION_MAX_TOKENS", "400"))
    response_generation_temperature: float = float(os.getenv("RESPONSE_GENERATION_TEMPERATURE", "0.7"))
    response_max_tokens: int = int(os.getenv("RESPONSE_MAX_TOKENS", "300"))
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    environment: str = os.getenv("ENVIRONMENT", "development")
    
settings = Settings()
