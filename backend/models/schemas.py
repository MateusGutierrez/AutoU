from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from enum import Enum

class EmailCategory(str, Enum):
    PRODUCTIVE = "Produtivo"
    UNPRODUCTIVE = "Improdutivo"

class SentimentIndicators(BaseModel):
    has_negative: bool
    has_positive: bool
    sentiment_score: float

class EmailFeatures(BaseModel):
    has_questions: bool
    has_urgency_indicators: bool
    has_request_indicators: bool
    has_problem_indicators: bool
    has_technical_indicators: bool
    has_social_indicators: bool
    formality_score: float
    sentiment_indicators: SentimentIndicators
    word_count: int
    char_count: int

class EmailClassification(BaseModel):
    category: str
    confidence: float
    suggested_response: str
    reasoning: str
    is_urgent: bool
    features_detected: EmailFeatures

class TextInput(BaseModel):
    text: str

class HealthResponse(BaseModel):
    status: str
    message: str

class FeaturesTestResponse(BaseModel):
    text: str
    features: EmailFeatures