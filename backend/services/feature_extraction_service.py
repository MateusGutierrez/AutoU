import re
from typing import Dict, Any
from models.schemas import EmailFeatures, SentimentIndicators

class FeatureExtractionService:
    def __init__(self):
        self.urgency_keywords = [
            'urgente', 'imediato', 'prioridade', 'emergência', 'crítico',
            'hoje', 'agora', 'o mais rápido', 'asap', 'emergencial'
        ]
        
        self.request_keywords = [
            'preciso', 'necessito', 'solicito', 'gostaria', 'poderia',
            'pode ajudar', 'me auxilie', 'favor', 'ajuda', 'suporte'
        ]
        
        self.problem_keywords = [
            'problema', 'erro', 'bug', 'falha', 'não funciona', 'quebrou',
            'não consigo', 'dificuldade', 'travou', 'parou'
        ]
        
        self.technical_keywords = [
            'sistema', 'software', 'aplicativo', 'plataforma', 'servidor',
            'banco de dados', 'api', 'integração', 'código', 'configuração'
        ]
        
        self.social_keywords = [
            'parabéns', 'felicitações', 'obrigado', 'agradecimento', 'natal',
            'ano novo', 'festa', 'celebração', 'aniversário', 'sucesso'
        ]
        
        self.formal_indicators = ['prezado', 'cordialmente', 'atenciosamente', 'senhor', 'senhora']
        self.informal_indicators = ['oi', 'tchau', 'abraço', 'beijo', 'valeu']
        
        self.negative_words = ['ruim', 'péssimo', 'terrível', 'insatisfeito', 'reclamação', 'problema']
        self.positive_words = ['ótimo', 'excelente', 'perfeito', 'satisfeito', 'obrigado', 'parabéns']
    
    def extract_features(self, text: str) -> EmailFeatures:
        text_lower = text.lower()
        question_patterns = [r'\?', r'como\s+', r'quando\s+', r'onde\s+', r'por\s*que', r'qual\s+']
        has_questions = any(re.search(pattern, text_lower) for pattern in question_patterns)
        has_urgency_indicators = any(keyword in text_lower for keyword in self.urgency_keywords)
        has_request_indicators = any(keyword in text_lower for keyword in self.request_keywords)
        has_problem_indicators = any(keyword in text_lower for keyword in self.problem_keywords)
        has_technical_indicators = any(keyword in text_lower for keyword in self.technical_keywords)
        has_social_indicators = any(keyword in text_lower for keyword in self.social_keywords)
        formality_score = self._calculate_formality_score(text_lower)
        sentiment_indicators = self._analyze_sentiment(text_lower)
        
        return EmailFeatures(
            has_questions=has_questions,
            has_urgency_indicators=has_urgency_indicators,
            has_request_indicators=has_request_indicators,
            has_problem_indicators=has_problem_indicators,
            has_technical_indicators=has_technical_indicators,
            has_social_indicators=has_social_indicators,
            formality_score=formality_score,
            sentiment_indicators=sentiment_indicators,
            word_count=len(text.split()),
            char_count=len(text)
        )
    
    def _calculate_formality_score(self, text_lower: str) -> float:
        formal_count = sum(1 for indicator in self.formal_indicators if indicator in text_lower)
        informal_count = sum(1 for indicator in self.informal_indicators if indicator in text_lower)
        
        if formal_count + informal_count == 0:
            return 0.5
        else:
            return formal_count / (formal_count + informal_count)
    
    def _analyze_sentiment(self, text_lower: str) -> SentimentIndicators:
        negative_count = sum(1 for word in self.negative_words if word in text_lower)
        positive_count = sum(1 for word in self.positive_words if word in text_lower)
        
        sentiment_score = (positive_count - negative_count) / max(positive_count + negative_count, 1)
        
        return SentimentIndicators(
            has_negative=negative_count > 0,
            has_positive=positive_count > 0,
            sentiment_score=sentiment_score
        )