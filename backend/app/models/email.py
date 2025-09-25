from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from enum import Enum
from datetime import datetime

class EmailCategory(str, Enum):
    PRODUCTIVE = "productive"
    UNPRODUCTIVE = "unproductive"
    
    def to_portuguese(self):
        return {
            "productive": "Produtivo",
            "unproductive": "Improdutivo"
        }[self.value]

class EmailInput(BaseModel):
    content: str = Field(..., min_length=1, description="Conteúdo do email")
    subject: Optional[str] = Field(None, description="Assunto do email")
    sender: Optional[str] = Field(None, description="Remetente do email")
    
    @validator('content')
    def validate_content(cls, v):
        if not v or v.isspace():
            raise ValueError("O conteúdo do email não pode estar vazio")
        if len(v) > 50000:
            raise ValueError("O conteúdo do email é muito longo (máximo 50.000 caracteres)")
        return v.strip()

class ClassificationResult(BaseModel):
    category: EmailCategory
    confidence: float = Field(..., ge=0, le=1)
    reasoning: str = Field(..., description="Explicação da classificação")
    keywords: List[str] = Field(default_factory=list, description="Palavras-chave identificadas")
    
    class Config:
        json_schema_extra = {
            "example": {
                "category": "productive",
                "confidence": 0.92,
                "reasoning": "Email contém solicitação específica de suporte técnico",
                "keywords": ["suporte", "problema", "sistema", "urgente"]
            }
        }

class ResponseSuggestion(BaseModel):
    response_text: str = Field(..., description="Texto sugerido para resposta")
    tone: str = Field(default="professional", description="Tom da resposta")
    priority: str = Field(default="normal", description="Prioridade sugerida")
    action_required: bool = Field(default=False, description="Se requer ação adicional")
    
class EmailClassificationResponse(BaseModel):
    id: str = Field(..., description="ID único da classificação")
    timestamp: datetime = Field(default_factory=datetime.now)
    input_email: EmailInput
    classification: ClassificationResult
    suggested_response: ResponseSuggestion
    processing_time: float = Field(..., description="Tempo de processamento em segundos")
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "clf_123456",
                "timestamp": "2024-01-20T10:30:00",
                "input_email": {
                    "content": "Olá, estou com problema para acessar o sistema...",
                    "subject": "Problema de acesso",
                    "sender": "usuario@example.com"
                },
                "classification": {
                    "category": "productive",
                    "confidence": 0.92,
                    "reasoning": "Email contém solicitação específica de suporte",
                    "keywords": ["problema", "acesso", "sistema"]
                },
                "suggested_response": {
                    "response_text": "Prezado usuário, recebemos sua solicitação...",
                    "tone": "professional",
                    "priority": "high",
                    "action_required": True
                },
                "processing_time": 1.23,
                "metadata": {}
            }
        }

class FileUploadResponse(BaseModel):
    filename: str
    content_type: str
    size: int
    extracted_text: str
    message: str = "Arquivo processado com sucesso"
    
class ErrorResponse(BaseModel):
    error: str
    details: Optional[str] = None
    status_code: int
    timestamp: datetime = Field(default_factory=datetime.now)

class HealthCheckResponse(BaseModel):
    status: str = "healthy"
    timestamp: datetime = Field(default_factory=datetime.now)
    version: str
    ai_provider: str