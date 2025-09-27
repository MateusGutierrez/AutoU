from models.schemas import EmailClassification, EmailFeatures
from services.feature_extraction_service import FeatureExtractionService
from services.openai_service import OpenAIService
from typing import List

class ClassificationService:
    def __init__(self):
        self.feature_service = FeatureExtractionService()
        self.openai_service = OpenAIService()
    
    def classify_email(self, email_text: str) -> EmailClassification:
        features = self.feature_service.extract_features(email_text)
        
        try:
            result = self.openai_service.classify_email(email_text, features)
            category = result.get("category", "Improdutivo")
            confidence = float(result.get("confidence", 0.8))
            reasoning = result.get("reasoning", "Classificação baseada no conteúdo do email")
            is_urgent = result.get("is_urgent", False)
            suggested_response = self.openai_service.generate_response(
                email_text, category, is_urgent, features
            )
            
        except Exception as e:
            print(f"Erro na classificação AI: {str(e)}")
            return self._classify_fallback(email_text, features)
        
        return EmailClassification(
            category=category,
            confidence=confidence,
            suggested_response=suggested_response,
            reasoning=reasoning,
            is_urgent=is_urgent,
            features_detected=features
        )
    
    def _classify_fallback(self, email_text: str, features: EmailFeatures) -> EmailClassification:
        score = 0
        reasons = []
    
        if features.has_questions:
            score += 35
            reasons.append("contém perguntas diretas")
            
        if features.has_urgency_indicators:
            score += 30
            reasons.append("indica urgência")
            
        if features.has_request_indicators:
            score += 40
            reasons.append("contém solicitações")
            
        if features.has_problem_indicators:
            score += 35
            reasons.append("relata problemas")
            
        if features.has_technical_indicators:
            score += 25
            reasons.append("conteúdo técnico")
            
        if features.has_social_indicators:
            score -= 20
            reasons.append("conteúdo social/cordial")
        
        if features.sentiment_indicators.has_negative:
            score += 20
            reasons.append("expressa insatisfação")
        
        if features.formality_score > 0.7:
            score += 15
            reasons.append("tom formal profissional")
        elif features.formality_score < 0.3:
            score -= 10
            reasons.append("tom informal")
        
        is_urgent = features.has_urgency_indicators
        
        if score >= 50:
            category = "Produtivo"
            confidence = min(score / 100, 0.95)
            reasoning = f"Email classificado como Produtivo baseado em: {', '.join(reasons[:3])}"
        else:
            category = "Improdutivo"
            confidence = max(1 - (score / 100), 0.6)
            reasoning = f"Email classificado como Improdutivo: {', '.join(reasons[:2]) if reasons else 'comunicação geral'}"
        
        suggested_response = self._generate_fallback_response(category, is_urgent, features)
        
        return EmailClassification(
            category=category,
            confidence=confidence,
            suggested_response=suggested_response,
            reasoning=reasoning,
            is_urgent=is_urgent,
            features_detected=features
        )
    
    def _generate_fallback_response(self, category: str, is_urgent: bool, features: EmailFeatures) -> str:
        if category == "Produtivo":
            if is_urgent:
                return """Prezado(a),
Recebemos sua mensagem e identificamos a urgência da situação. Nossa equipe foi notificada com prioridade máxima e está analisando sua solicitação imediatamente.
Você receberá uma resposta inicial dentro de 2 horas úteis. Para situações críticas, pode também entrar em contato através do nosso suporte prioritário pelo telefone (XX) XXXX-XXXX.
Atenciosamente,
Equipe de Suporte"""
            elif features.has_problem_indicators:
                return """Prezado(a),
Agradecemos por nos informar sobre a situação descrita. Entendemos a importância de resolver essa questão rapidamente.
Nossa equipe técnica foi acionada e iniciará a análise em breve. Manteremos você informado(a) sobre o progresso e forneceremos uma solução ou atualização dentro de 24 horas úteis.
Atenciosamente,
Equipe Técnica"""
            else:
                return """Prezado(a),
Agradecemos seu contato. Sua solicitação foi recebida e registrada em nosso sistema de atendimento.
Nossa equipe especializada analisará sua demanda e retornará com uma resposta detalhada em até 48 horas úteis. Caso necessite de informações adicionais durante este período, estaremos à disposição.
Atenciosamente,
Equipe de Atendimento"""
        else:
            if features.sentiment_indicators.has_positive:
                return """Olá!
Muito obrigado por sua mensagem positiva! É sempre gratificante receber esse tipo de feedback.
Ficamos felizes em saber que nossa parceria continua sendo produtiva. Estamos sempre à disposição para atendê-lo(a).
Cordialmente,
Nossa Equipe"""
            else:
                return """Olá!
Agradecemos seu contato. É sempre um prazer manter essa comunicação.
Estamos à disposição caso necessite de alguma assistência ou tenha alguma dúvida.
Atenciosamente,
Nossa Equipe"""