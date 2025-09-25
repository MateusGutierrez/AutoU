"""
Main email classification service
"""
import uuid
import time
from typing import Optional, Dict, Any
from datetime import datetime
import logging

from app.config import settings
from app.models.email import (
    EmailInput,
    EmailClassificationResponse,
    ClassificationResult,
    ResponseSuggestion,
    EmailCategory
)
from app.services.ai_service import OpenAIProvider
from app.services.huggingface_provider import HuggingFaceProvider
from app.utils.text_processor import TextProcessor

logger = logging.getLogger(__name__)

class EmailClassifier:
    """Serviço principal de classificação de emails"""
    
    def __init__(self):
        """Inicializa o classificador com o provedor de AI apropriado"""
        self.text_processor = TextProcessor(language='portuguese')
        self.ai_provider = self._initialize_ai_provider()
        
    def _initialize_ai_provider(self):
        """
        Inicializa o provedor de AI baseado na configuração
        
        Returns:
            Instância do provedor de AI
        """
        provider_type = settings.get_ai_provider()
        
        if provider_type == "openai":
            logger.info("Usando OpenAI como provedor de AI")
            return OpenAIProvider()
        elif provider_type == "huggingface":
            logger.info("Usando HuggingFace como provedor de AI")
            return HuggingFaceProvider(settings.huggingface_api_key)
        else:
            logger.warning("Nenhum provedor de AI configurado, usando classificação baseada em regras")
            return None
    
    async def classify_email(self, email_input: EmailInput) -> EmailClassificationResponse:
        """
        Classifica um email e gera resposta sugerida
        
        Args:
            email_input: Dados do email para classificar
            
        Returns:
            Resposta completa da classificação
        """
        start_time = time.time()
        
        try:
            # Gera ID único para a classificação
            classification_id = f"clf_{uuid.uuid4().hex[:12]}"
            
            # Processa o texto e extrai features
            logger.info(f"Processando email {classification_id}")
            features = self.text_processor.extract_features(email_input.content)
            keywords = self.text_processor.extract_keywords(email_input.content, n=5)
            
            # Classifica o email
            if self.ai_provider:
                category, confidence, reasoning = await self.ai_provider.classify_email(
                    email_input.content, 
                    features
                )
            else:
                category, confidence, reasoning = self._rule_based_classification(
                    email_input.content,
                    features
                )
            
            # Prepara contexto para geração de resposta
            context = {
                'keywords': keywords,
                'is_urgent': features.get('has_urgency_indicators', False),
                'has_questions': features.get('has_questions', False),
                'formality_score': features.get('formality_score', 0.5),
                'subject': email_input.subject,
                'sender': email_input.sender
            }
            
            # Gera resposta sugerida
            if self.ai_provider:
                suggested_response_text = await self.ai_provider.generate_response(
                    email_input.content,
                    category,
                    context
                )
            else:
                suggested_response_text = self._generate_template_response(
                    category,
                    context
                )
            
            # Determina prioridade e tom
            priority = self._determine_priority(features, category)
            tone = self._determine_tone(features)
            action_required = category == EmailCategory.PRODUCTIVE
            
            # Monta a resposta completa
            classification_result = ClassificationResult(
                category=category,
                confidence=confidence,
                reasoning=reasoning,
                keywords=keywords
            )
            
            response_suggestion = ResponseSuggestion(
                response_text=suggested_response_text,
                tone=tone,
                priority=priority,
                action_required=action_required
            )
            
            processing_time = time.time() - start_time
            
            response = EmailClassificationResponse(
                id=classification_id,
                timestamp=datetime.now(),
                input_email=email_input,
                classification=classification_result,
                suggested_response=response_suggestion,
                processing_time=processing_time,
                metadata={
                    'ai_provider': settings.get_ai_provider(),
                    'text_features': {
                        'word_count': features.get('word_count', 0),
                        'sentence_count': features.get('sentence_count', 0),
                        'has_questions': features.get('has_questions', False),
                        'has_urgency': features.get('has_urgency_indicators', False)
                    }
                }
            )
            
            logger.info(f"Email {classification_id} classificado com sucesso em {processing_time:.2f}s")
            return response
            
        except Exception as e:
            logger.error(f"Erro ao classificar email: {str(e)}")
            raise
    
    def _rule_based_classification(self, text: str, features: Dict[str, Any]) -> tuple:
        """
        Classificação baseada em regras quando AI não está disponível
        
        Args:
            text: Texto do email
            features: Features extraídas
            
        Returns:
            Tupla (categoria, confiança, reasoning)
        """
        score = 0
        reasons = []
        
        # Análise baseada em features
        if features.get('has_questions'):
            score += 25
            reasons.append("contém perguntas")
            
        if features.get('has_urgency_indicators'):
            score += 30
            reasons.append("indica urgência")
            
        if features.get('has_request_indicators'):
            score += 35
            reasons.append("contém solicitações")
            
        sentiment = features.get('sentiment_indicators', {})
        if sentiment.get('has_negative'):
            score += 15
            reasons.append("reporta problema")
            
        # Análise de comprimento e complexidade
        if features.get('word_count', 0) > 100:
            score += 10
            reasons.append("conteúdo detalhado")
            
        if features.get('formality_score', 0) > 0.7:
            score += 5
            reasons.append("tom formal")
            
        # Determinação da categoria
        if score >= 45:
            category = EmailCategory.PRODUCTIVE
            confidence = min(score / 100, 0.85)
            reasoning = f"Email produtivo: {', '.join(reasons)}" if reasons else "Email requer ação ou resposta"
        else:
            category = EmailCategory.UNPRODUCTIVE  
            confidence = max((100 - score) / 100, 0.6)
            reasoning = "Email improdutivo: comunicação geral ou social sem ação específica necessária"
            
        return category, confidence, reasoning
    
    def _generate_template_response(self, category: EmailCategory, context: Dict[str, Any]) -> str:
        """
        Gera resposta baseada em templates
        
        Args:
            category: Categoria do email
            context: Contexto adicional
            
        Returns:
            Texto da resposta
        """
        if category == EmailCategory.PRODUCTIVE:
            if context.get('is_urgent'):
                template = """Prezado(a),

Recebemos sua mensagem e identificamos a urgência do assunto. Nossa equipe está analisando sua solicitação com prioridade.

Entraremos em contato nas próximas horas com uma atualização sobre o andamento.

Agradecemos a compreensão.

Atenciosamente,
Equipe de Suporte"""
            elif context.get('has_questions'):
                template = """Prezado(a),

Agradecemos seu contato e as questões levantadas. Nossa equipe técnica está analisando suas dúvidas para fornecer as respostas mais precisas.

Retornaremos em até 2 dias úteis com as informações solicitadas.

Atenciosamente,
Equipe de Suporte"""
            else:
                template = """Prezado(a),

Confirmamos o recebimento de sua solicitação. Nossa equipe está trabalhando em seu pedido e entraremos em contato assim que tivermos uma atualização.

Prazo estimado de resposta: 2 a 3 dias úteis.

Atenciosamente,
Equipe de Suporte"""
        else:
            template = """Olá!

Agradecemos sua mensagem. É sempre um prazer manter contato com você.

Caso precise de alguma assistência específica, não hesite em nos contatar novamente.

Cordialmente,
Equipe"""
            
        return template
    
    def _determine_priority(self, features: Dict[str, Any], category: EmailCategory) -> str:
        """
        Determina a prioridade do email
        
        Args:
            features: Features do texto
            category: Categoria classificada
            
        Returns:
            Prioridade (high, normal, low)
        """
        if features.get('has_urgency_indicators'):
            return "high"
        elif category == EmailCategory.PRODUCTIVE:
            return "normal"
        else:
            return "low"
    
    def _determine_tone(self, features: Dict[str, Any]) -> str:
        """
        Determina o tom apropriado para a resposta
        
        Args:
            features: Features do texto
            
        Returns:
            Tom (professional, friendly, formal)
        """
        formality_score = features.get('formality_score', 0.5)
        
        if formality_score > 0.7:
            return "formal"
        elif formality_score < 0.3:
            return "friendly"
        else:
            return "professional"