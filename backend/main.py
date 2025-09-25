from fastapi import FastAPI
from config import settings
from routes import classification, health

app = FastAPI(
    title=settings.app_title,
    description=settings.app_description,
    version=settings.app_version
)

app.include_router(classification.router, tags=["Classification"])
app.include_router(health.router, tags=["Health"])
