import logging
import os
from pathlib import Path
from contextlib import asynccontextmanager
import time

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import settings
from app.api.routes import router as api_router
from app.models.email import ErrorResponse

logging.basicConfig(
    level=logging.INFO if not settings.debug else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("app.log")
    ]
)

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Iniciando {settings.app_name} v{settings.app_version}")
    Path(settings.upload_folder).mkdir(exist_ok=True)
    Path("logs").mkdir(exist_ok=True)
    try:
        import nltk
        nltk.download('punkt', quiet=True)
        nltk.download('stopwords', quiet=True)
        nltk.download('wordnet', quiet=True)
        nltk.download('averaged_perceptron_tagger', quiet=True)
        logger.info("Recursos NLTK inicializados")
    except Exception as e:
        logger.warning(f"Erro ao baixar recursos NLTK: {e}")
    logger.info("Aplicação iniciada com sucesso")
    yield
    logger.info("Finalizando aplicação...")

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="API para classificação automática de emails e geração de respostas",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.3f}s"
    )
    
    return response

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return ErrorResponse(
        error=exc.detail,
        status_code=exc.status_code
    ).dict()

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return ErrorResponse(
        error="Dados de entrada inválidos",
        details=str(exc),
        status_code=422
    ).dict()

@app.exception_handler(StarletteHTTPException)
async def starlette_exception_handler(request: Request, exc: StarletteHTTPException):
    return ErrorResponse(
        error="Erro interno do servidor",
        details=str(exc),
        status_code=exc.status_code
    ).dict()

app.include_router(api_router, prefix="/api/v1")

if os.path.exists("frontend"):
    app.mount("/static", StaticFiles(directory="frontend"), name="static")
    
    @app.get("/", include_in_schema=False)
    async def serve_frontend():
        return FileResponse("frontend/index.html")
else:
    @app.get("/")
    async def root():
        return {
            "message": f"Bem-vindo ao {settings.app_name}",
            "version": settings.app_version,
            "docs_url": "/docs",
            "health_url": "/api/v1/health"
        }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version,
        "ai_provider": settings.get_ai_provider()
    }

if __name__ == "__main__":
    import uvicorn
    import time
    
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info" if not settings.debug else "debug"
    )