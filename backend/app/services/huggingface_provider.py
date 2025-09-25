"""
HuggingFace AI Provider for email classification and response generation
"""
import httpx
import json
import logging
from typing import Dict, Any, Tuple
from app.services.ai_service import AIProvider
from app.models.email import EmailCategory

logger = logging.getLogger(__name__)

class HuggingFaceProvider(AIProvider):
    """Provedor usando HuggingFace Inference API"""
    
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("HuggingFace API key não configurada")
        self.api_key = api_key
        self.base_url = "https://api-inference.huggingface.co/models"
        self.classification_model = "microsoft/DialoGPT-medium"
        self.generation_model = "microsoft/DialoGPT-medium"
        
    async def classify_email(self, text: str, features: Dict[str, Any]) -> Tuple[EmailCategory, float, str]:
        """
        Classifica o email usando HuggingFace models
        
        Args:
            text: Texto do email
            features: Features extraídas
            
        Returns:
            Tupla (categoria, confiança, reasoning)
        """
        try:
            # Para este exemplo, vamos usar uma abordagem híbrida:
            # análise de features + classificação simples baseada em keywords
            
            # Primeiro, tenta usar um modelo de classificação se disponível
            try:
                classification_result = await self._classify_with_model(text)
                if classification_result:
                    return classification_result
            except Exception as e:
                logger.warning(f"Falha na classificação por modelo HF: {e}")
            
            # Fallback para classificação baseada em regras melhorada
            return self._enhanced_rule_based_classification(text, features)
            
        except Exception as e:
            logger.error(f"Erro na classificação HuggingFace: {str(e)}")
            return self._enhanced_rule_based_classification(text, features)
    
    async def _classify_with_model(self, text: str) -> Tuple[EmailCategory, float, str]:
        """
        Tenta classificar usando modelo HuggingFace
        """
        headers = {"Authorization": f"Bearer {self.api_key}"}
        
        # Usando um modelo de análise de sentimento como proxy
        model_url = f"{self.base_url}/cardiffnlp/twitter-roberta-base-sentiment-latest"
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                model_url,
                headers=headers,
                json={"inputs": text[:512]}  # Limita tamanho do input
            )
            
            if response.status_code == 200:
                result = response.json()
                
                # Interpreta resultado do modelo de sentimento
                if isinstance(result, list) and len(result) > 0:
                    scores = result[0]
                    
                    # Lógica para mapear sentimento para produtividade
                    negative_score = next((s['score'] for s in scores if s['label'] == 'LABEL_0'), 0)
                    neutral_score = next((s['score'] for s in scores if s['label'] == 'LABEL_1'), 0)
                    positive_score = next((s['score'] for s in scores if s['label'] == 'LABEL_2'), 0)
                    
                    # Emails negativos ou neutros tendem a ser mais produtivos (problemas, solicitações)
                    # Emails muito positivos tendem a ser improdutivos (felicitações)
                    
                    if negative_score > 0.6 or neutral_score > 0.5:
                        category = EmailCategory.PRODUCTIVE
                        confidence = max(negative_score, neutral_score)
                        reasoning = "Email classificado como produtivo baseado em análise de sentimento (conteúdo técnico/neutro/problema)"
                    else:
                        category = EmailCategory.UNPRODUCTIVE
                        confidence = positive_score
                        reasoning = "Email classificado como improdutivo baseado em análise de sentimento (conteúdo positivo/social)"
                    
                    return category, min(confidence + 0.1, 0.95), reasoning
        
        return None
    
    def _enhanced_rule_based_classification(self, text: str, features: Dict[str, Any]) -> Tuple[EmailCategory, float, str]:
        """
        Classificação baseada em regras melhorada
        """
        score = 0
        reasons = []
        
        # Palavras-chave específicas para emails produtivos
        productive_keywords = [
            'problema', 'erro', 'falha', 'bug', 'suporte', 'ajuda',
            'solicito', 'preciso', 'urgente', 'prazo', 'deadline',
            'sistema', 'aplicativo', 'plataforma', 'acesso', 'login',
            'senha', 'configuração', 'instalação', 'atualização',
            'dúvida', 'questão', 'pergunta', 'como', 'quando',
            'reunião', 'meeting', 'projeto', 'tarefa', 'entrega'
        ]
        
        # Palavras-chave para emails improdutivos
        unproductive_keywords = [
            'parabéns', 'felicitações', 'obrigado', 'agradeco',
            'feliz natal', 'bom dia', 'boa tarde', 'abraço',
            'sucesso', 'conquista', 'vitória', 'comemoração',
            'aniversário', 'feriado', 'férias', 'fim de semana'
        ]
        
        text_lower = text.lower()
        
        # Conta palavras-chave produtivas
        productive_count = sum(1 for keyword in productive_keywords if keyword in text_lower)
        unproductive_count = sum(1 for keyword in unproductive_keywords if keyword in text_lower)
        
        score += productive_count * 15
        score -= unproductive_count * 10
        
        # Usa features extraídas
        if features.get('has_questions'):
            score += 25
            reasons.append("contém perguntas")
            
        if features.get('has_urgency_indicators'):
            score += 30
            reasons.append("indica urgência")
            
        if features.get('has_request_indicators'):
            score += 25
            reasons.append("contém solicitações")
            
        # Análise de comprimento
        word_count = features.get('word_count', 0)
        if word_count > 50:  # Emails longos tendem a ser mais produtivos
            score += 10
            
        # Análise de formalidade
        formality = features.get('formality_score', 0.5)
        if formality > 0.6:
            score += 5
        elif formality < 0.3:
            score -= 5
            
        # Análise de sentimento
        sentiment = features.get('sentiment_indicators', {})
        if sentiment.get('has_negative'):
            score += 20
            reasons.append("reporta problema")
        if sentiment.get('has_positive') and not sentiment.get('has_negative'):
            score -= 10
            
        # Determinação final
        if score >= 40:
            category = EmailCategory.PRODUCTIVE
            confidence = min(score / 100 + 0.5, 0.92)
            reasoning = f"Email produtivo detectado: {', '.join(reasons) if reasons else 'múltiplos indicadores'}"
        else:
            category = EmailCategory.UNPRODUCTIVE
            confidence = max((60 - score) / 100 + 0.3, 0.65)
            reasoning = "Email improdutivo: comunicação social ou informativa sem ação específica necessária"
            
        return category, confidence, reasoning
    
    async def generate_response(self, text: str, category: EmailCategory, context: Dict[str, Any]) -> str:
        """
        Gera resposta usando HuggingFace ou templates
        """
        try:
            # Tenta gerar com modelo HF
            generated_response = await self._generate_with_model(text, category, context)
            if generated_response and len(generated_response.strip()) > 20:
                return generated_response
        except Exception as e:
            logger.warning(f"Falha na geração HF: {e}")
        
        # Fallback para templates
        return self._generate_template_response(category, context)
    
    async def _generate_with_model(self, text: str, category: EmailCategory, context: Dict[str, Any]) -> str:
        """
        Gera resposta usando modelo HuggingFace
        """
        headers = {"Authorization": f"Bearer {self.api_key}"}
        model_url = f"{self.base_url}/microsoft/DialoGPT-medium"
        
        # Prepara prompt baseado na categoria
        if category == EmailCategory.PRODUCTIVE:
            prompt = f"Responda profissionalmente a este email de solicitação: {text[:300]}"
        else:
            prompt = f"Responda cordialmente a este email informal: {text[:300]}"
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                model_url,
                headers=headers,
                json={
                    "inputs": prompt,
                    "parameters": {
                        "max_length": 150,
                        "temperature": 0.7,
                        "do_sample": True
                    }
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    generated_text = result[0].get('generated_text', '')
                    # Limpa e formata a resposta
                    if generated_text:
                        # Remove o prompt original da resposta
                        clean_response = generated_text.replace(prompt, '').strip()
                        if len(clean_response) > 20:
                            return self._format_response(clean_response, category)
        
        return None
    
    def _format_response(self, response: str, category: EmailCategory) -> str:
        """
        Formata resposta gerada para ter aparência profissional
        """
        # Remove caracteres estranhos e limpa
        response = response.strip()
        
        # Adiciona saudações apropriadas se não tiver
        if category == EmailCategory.PRODUCTIVE:
            if not response.lower().startswith(('prezado', 'caro', 'olá')):
                response = f"Prezado(a),\n\n{response}"
            if not response.lower().endswith(('atenciosamente', 'cordialmente')):
                response = f"{response}\n\nAtenciosamente,\nEquipe de Suporte"
        else:
            if not response.lower().startswith(('olá', 'oi', 'prezado')):
                response = f"Olá!\n\n{response}"
            if not response.lower().endswith(('abraços', 'atenciosamente', 'cordialmente')):
                response = f"{response}\n\nCordialmente,\nEquipe"
        
        return response
    
    def _generate_template_response(self, category: EmailCategory, context: Dict[str, Any]) -> str:
        """
        Gera resposta usando templates (fallback)
        """
        if category == EmailCategory.PRODUCTIVE:
            if context.get('is_urgent'):
                return """Prezado(a),

Recebemos sua mensagem e identificamos a urgência da solicitação. Nossa equipe técnica está priorizando seu atendimento.

Entraremos em contato em breve com uma solução ou atualização sobre o andamento.

Atenciosamente,
Equipe de Suporte Técnico"""
            
            elif context.get('has_questions'):
                return """Prezado(a),

Agradecemos seu contato e as questões apresentadas. Nossa equipe está analisando suas dúvidas para fornecer as informações mais precisas.

Retornaremos com as respostas em até 48 horas úteis.

Atenciosamente,
Equipe de Suporte"""
            
            else:
                return """Prezado(a),

Confirmamos o recebimento de sua solicitação. Nossa equipe está trabalhando em seu pedido e manteremos você informado sobre o progresso.

Prazo estimado de resposta: 2 a 3 dias úteis.

Atenciosamente,
Equipe de Suporte"""
        
        else:
            return """Olá!

Muito obrigado pela sua mensagem. É sempre um prazer receber seu contato.

Estamos à disposição para qualquer assistência que possa necessitar.

Cordialmente,
Equipe"""