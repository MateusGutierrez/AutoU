"""
AI Service for email classification and response generation
"""
import json
from typing import Dict, Any, Optional, Tuple
from abc import ABC, abstractmethod
import httpx
from openai import OpenAI
from app.config import settings
from app.models.email import EmailCategory
import logging

logger = logging.getLogger(__name__)

class AIProvider(ABC):
    """Interface base para provedores de AI"""
    
    @abstractmethod
    async def classify_email(self, text: str, features: Dict[str, Any]) -> Tuple[EmailCategory, float, str]:
        """Classifica o email"""
        pass
    
    @abstractmethod
    async def generate_response(self, text: str, category: EmailCategory, context: Dict[str, Any]) -> str:
        """Gera resposta automática"""
        pass

class OpenAIProvider(AIProvider):
    """Provedor usando OpenAI API"""
    
    def __init__(self):
        if not settings.openai_api_key:
            raise ValueError("OpenAI API key não configurada")
        self.client = OpenAI(api_key=settings.openai_api_key)
        
    async def classify_email(self, text: str, features: Dict[str, Any]) -> Tuple[EmailCategory, float, str]:
        """
        Classifica o email usando GPT
        
        Args:
            text: Texto do email
            features: Features extraídas
            
        Returns:
            Tupla (categoria, confiança, reasoning)
        """
        try:
            system_prompt = """
            Você é um assistente especializado em classificar emails corporativos.
            
            Classifique os emails em duas categorias:
            1. PRODUTIVO: Emails que requerem ação ou resposta específica (solicitações, problemas, dúvidas técnicas, pedidos de informação)
            2. IMPRODUTIVO: Emails que não necessitam ação imediata (felicitações, agradecimentos, mensagens informais)
            
            Responda APENAS em formato JSON com a estrutura:
            {
                "category": "productive" ou "unproductive",
                "confidence": 0.0 a 1.0,
                "reasoning": "explicação em português",
                "is_urgent": true/false
            }
            """
            
            user_prompt = f"""
            Analise o seguinte email e classifique:
            
            Texto: {text}
            
            Indicadores detectados:
            - Contém perguntas: {features.get('has_questions', False)}
            - Indicadores de urgência: {features.get('has_urgency_indicators', False)}
            - Indicadores de solicitação: {features.get('has_request_indicators', False)}
            - Score de formalidade: {features.get('formality_score', 0.5):.2f}
            """
            
            response = self.client.chat.completions.create(
                model=settings.openai_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,
                max_tokens=200,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            
            category = EmailCategory.PRODUCTIVE if result['category'] == 'productive' else EmailCategory.UNPRODUCTIVE
            confidence = float(result.get('confidence', 0.8))
            reasoning = result.get('reasoning', 'Classificação baseada no conteúdo do email')
            
            return category, confidence, reasoning
            
        except Exception as e:
            logger.error(f"Erro na classificação OpenAI: {str(e)}")
            # Fallback para classificação baseada em regras
            return self._fallback_classification(text, features)
    
    async def generate_response(self, text: str, category: EmailCategory, context: Dict[str, Any]) -> str:
        """
        Gera resposta automática usando GPT
        
        Args:
            text: Texto original do email
            category: Categoria classificada
            context: Contexto adicional
            
        Returns:
            Resposta sugerida
        """
        try:
            if category == EmailCategory.PRODUCTIVE:
                system_prompt = """
                Você é um assistente que gera respostas profissionais para emails produtivos.
                Suas respostas devem:
                1. Ser cordiais e profissionais
                2. Confirmar o recebimento da solicitação
                3. Indicar próximos passos quando aplicável
                4. Ser concisas (máximo 3 parágrafos)
                5. Usar português formal
                """
            else:
                system_prompt = """
                Você é um assistente que gera respostas cordiais para emails improdutivos.
                Suas respostas devem:
                1. Ser breves e cordiais
                2. Agradecer quando apropriado
                3. Não criar compromissos desnecessários
                4. Ser concisas (máximo 2 parágrafos)
                5. Usar tom amigável mas profissional
                """
            
            user_prompt = f"""
            Gere uma resposta apropriada para o seguinte email:
            
            Email original: {text}
            
            Contexto:
            - Categoria: {category.to_portuguese()}
            - É urgente: {context.get('is_urgent', False)}
            - Palavras-chave: {', '.join(context.get('keywords', []))}
            
            Responda de forma apropriada, sem incluir placeholders como [Nome] ou [Data].
            """
            
            response = self.client.chat.completions.create(
                model=settings.openai_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=300
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Erro na geração de resposta OpenAI: {str(e)}")
            return self._generate_fallback_response(category, context)
    
    def _fallback_classification(self, text: str, features: Dict[str, Any]) -> Tuple[EmailCategory, float, str]:
        """
        Classificação fallback baseada em regras
        
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
            score += 30
            reasons.append("contém perguntas")
            
        if features.get('has_urgency_indicators'):
            score += 25
            reasons.append("indica urgência")
            
        if features.get('has_request_indicators'):
            score += 35
            reasons.append("contém solicitações")
            
        sentiment = features.get('sentiment_indicators', {})
        if sentiment.get('has_negative'):
            score += 20
            reasons.append("expressa problema ou insatisfação")
            
        # Análise de formalidade
        formality = features.get('formality_score', 0.5)
        if formality > 0.7:
            score += 10
            reasons.append("tom formal")
            
        # Determinação da categoria
        if score >= 50:
            category = EmailCategory.PRODUCTIVE
            confidence = min(score / 100, 0.95)
            reasoning = f"Email classificado como produtivo: {', '.join(reasons)}"
        else:
            category = EmailCategory.UNPRODUCTIVE
            confidence = max(1 - (score / 100), 0.6)
            reasoning = f"Email classificado como improdutivo: comunicação geral ou social"
            
        return category, confidence, reasoning
    
    def _generate_fallback_response(self, category: EmailCategory, context: Dict[str, Any]) -> str:
        """
        Gera resposta fallback baseada em templates
        
        Args:
            category: Categoria do email
            context: Contexto adicional
            
        Returns:
            Resposta gerada
        """
        if category == EmailCategory.PRODUCTIVE:
            if context.get('is_urgent'):
                return """Prezado(a),

Recebemos sua mensagem e identificamos a urgência da situação. Nossa equipe está analisando sua solicitação com prioridade e retornaremos o mais breve possível.

Caso necessite de atendimento imediato, por favor, entre em contato através dos nossos canais de suporte prioritário.

Atenciosamente,
Equipe de Suporte"""
            else:
                return """Prezado(a),

Agradecemos seu contato. Sua solicitação foi recebida e será analisada por nossa equipe especializada.

Retornaremos com uma resposta em até 48 horas úteis. Caso sua solicitação seja urgente, por favor, nos informe.

Atenciosamente,
Equipe de Suporte"""
        else:
            return """Olá!

Agradecemos sua mensagem. É sempre um prazer receber seu contato.

Estamos à disposição caso necessite de alguma assistência.

Atenciosamente,
Equipe"""