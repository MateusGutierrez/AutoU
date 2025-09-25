"""
API Routes for Email Classification Service
"""
import logging
from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from fastapi.responses import JSONResponse

from app.config import settings
from app.models.email import (
    EmailInput,
    EmailClassificationResponse,
    FileUploadResponse,
    HealthCheckResponse,
    ErrorResponse
)
from app.services.classifier import EmailClassifier
from app.services.file_handler import FileHandler

logger = logging.getLogger(__name__)

# Criar router
router = APIRouter()

# Instâncias dos serviços
email_classifier = EmailClassifier()
file_handler = FileHandler(settings.upload_folder)

@router.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """
    Health check endpoint para verificar status da aplicação
    """
    return HealthCheckResponse(
        status="healthy",
        version=settings.app_version,
        ai_provider=settings.get_ai_provider()
    )

@router.post("/classify", response_model=EmailClassificationResponse)
async def classify_email(email: EmailInput):
    """
    Classifica um email e gera resposta sugerida
    
    Args:
        email: Dados do email para classificar
        
    Returns:
        Resultado da classificação com resposta sugerida
    """
    try:
        logger.info(f"Recebida solicitação de classificação - Tamanho: {len(email.content)} chars")
        
        # Validar entrada
        if not email.content or len(email.content.strip()) < 10:
            raise HTTPException(
                status_code=400,
                detail="Email deve ter pelo menos 10 caracteres"
            )
        
        # Classificar email
        result = await email_classifier.classify_email(email)
        
        logger.info(f"Email classificado: {result.classification.category} "
                   f"(confidence: {result.classification.confidence:.2f})")
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao classificar email: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Erro interno ao processar email"
        )

@router.post("/upload", response_model=FileUploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    extract_text: bool = Form(True)
):
    """
    Upload de arquivo para extração de texto
    
    Args:
        file: Arquivo enviado
        extract_text: Se deve extrair texto do arquivo
        
    Returns:
        Informações do arquivo e texto extraído
    """
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="Nome do arquivo não fornecido")
        
        # Ler conteúdo do arquivo
        file_content = await file.read()
        
        # Validar arquivo
        is_valid, error_message = file_handler.validate_file(file.filename, len(file_content))
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_message)
        
        logger.info(f"Processando upload: {file.filename} ({len(file_content)} bytes)")
        
        # Extrair texto se solicitado
        extracted_text = ""
        if extract_text:
            try:
                extracted_text, content_type = await file_handler.extract_text_from_file(
                    file_content, 
                    file.filename
                )
            except Exception as e:
                logger.error(f"Erro ao extrair texto: {str(e)}")
                raise HTTPException(
                    status_code=422, 
                    detail=f"Erro ao processar arquivo: {str(e)}"
                )
        
        response = FileUploadResponse(
            filename=file.filename,
            content_type=file.content_type or "application/octet-stream",
            size=len(file_content),
            extracted_text=extracted_text,
            message=f"Arquivo {file.filename} processado com sucesso"
        )
        
        logger.info(f"Upload processado: {file.filename} - Texto extraído: {len(extracted_text)} chars")
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro no upload do arquivo: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Erro interno ao processar arquivo"
        )

@router.post("/classify-file")
async def classify_from_file(
    file: UploadFile = File(...),
    subject: Optional[str] = Form(None),
    sender: Optional[str] = Form(None)
):
    """
    Classifica email a partir de arquivo enviado
    
    Args:
        file: Arquivo com conteúdo do email
        subject: Assunto do email (opcional)
        sender: Remetente do email (opcional)
        
    Returns:
        Resultado da classificação
    """
    try:
        # Upload e extração do texto
        file_content = await file.read()
        
        # Validar arquivo
        is_valid, error_message = file_handler.validate_file(file.filename, len(file_content))
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_message)
        
        # Extrair texto
        extracted_text, _ = await file_handler.extract_text_from_file(
            file_content, 
            file.filename
        )
        
        if not extracted_text or len(extracted_text.strip()) < 10:
            raise HTTPException(
                status_code=400,
                detail="Não foi possível extrair texto suficiente do arquivo"
            )
        
        # Criar objeto EmailInput
        email_input = EmailInput(
            content=extracted_text,
            subject=subject,
            sender=sender
        )
        
        # Classificar
        result = await email_classifier.classify_email(email_input)
        
        logger.info(f"Arquivo {file.filename} classificado: {result.classification.category}")
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao classificar arquivo: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Erro interno ao processar arquivo"
        )

@router.get("/stats")
async def get_stats():
    """
    Retorna estatísticas da aplicação
    """
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "ai_provider": settings.get_ai_provider(),
        "max_file_size_mb": settings.max_upload_size / (1024 * 1024),
        "supported_formats": settings.allowed_extensions,
        "uptime": datetime.now().isoformat()
    }

@router.post("/test")
async def test_classification():
    """
    Endpoint de teste com exemplos pré-definidos
    """
    test_cases = [
        {
            "name": "Email Produtivo - Suporte Técnico",
            "email": EmailInput(
                content="Prezados, estou enfrentando problemas para acessar o sistema. Quando tento fazer login, recebo uma mensagem de erro. Poderiam me ajudar com urgência?",
                subject="Problema de Acesso - Urgente",
                sender="usuario@empresa.com"
            )
        },
        {
            "name": "Email Improdutivo - Felicitações",
            "email": EmailInput(
                content="Olá pessoal! Gostaria de parabenizar toda a equipe pelo excelente trabalho no último trimestre. Vocês são fantásticos! Abraços e bom final de semana!",
                subject="Parabéns equipe!",
                sender="colega@empresa.com"
            )
        }
    ]
    
    results = []
    
    for test_case in test_cases:
        try:
            result = await email_classifier.classify_email(test_case["email"])
            results.append({
                "test_name": test_case["name"],
                "classification": result.classification.category,
                "confidence": result.classification.confidence,
                "reasoning": result.classification.reasoning
            })
        except Exception as e:
            results.append({
                "test_name": test_case["name"],
                "error": str(e)
            })
    
    return {"test_results": results}