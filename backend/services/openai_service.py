import openai
import json
from typing import Dict, Any
from config import settings
from models.schemas import EmailFeatures

class OpenAIService:
    def __init__(self):
        openai.api_key = settings.openai_api_key
    
    def classify_email(self, email_text: str, features: EmailFeatures) -> Dict[str, Any]:
        system_prompt = self._get_classification_system_prompt()
        user_prompt = self._build_classification_user_prompt(email_text, features)
        
        try:
            response = openai.ChatCompletion.create(
                model=settings.openai_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=settings.classification_temperature,
                max_tokens=settings.classification_max_tokens,
                top_p=0.9,
                frequency_penalty=0.0,
                presence_penalty=0.0
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            raise Exception(f"Erro na classificação AI: {str(e)}")
    
    def generate_response(self, email_text: str, category: str, is_urgent: bool, features: EmailFeatures) -> str:
        system_prompt = self._get_response_system_prompt(category)
        user_prompt = self._build_response_user_prompt(email_text, category, is_urgent, features)
        
        try:
            response = openai.ChatCompletion.create(
                model=settings.openai_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=settings.response_generation_temperature,
                max_tokens=settings.response_max_tokens
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            raise Exception(f"Erro na geração de resposta: {str(e)}")
    
    def _get_classification_system_prompt(self) -> str:
        return """
        Você é um assistente especializado em classificar emails corporativos com alta precisão.
        
        Sua tarefa é classificar emails em duas categorias principais:
        
        1. Produtivo: Emails que requerem ação, resposta específica ou acompanhamento:
           - Solicitações de suporte técnico
           - Dúvidas sobre produtos/serviços
           - Pedidos de informação específica
           - Relatos de problemas ou bugs
           - Solicitações de mudanças ou melhorias
           - Questões que impactam negócios ou operações
           - Emails que contêm perguntas diretas
           - Comunicações que requerem tomada de decisão
           - Perguntas que precisam de informações factuais específicas (números de emergência, endereços, horários, etc.)
        
        2. Improdutivo: Emails que não necessitam ação imediata ou são informativos:
           - Felicitações e mensagens comemorativas (aniversário, natal, ano novo, etc.)
           - Agradecimentos gerais
           - Comunicações sociais ou casuais
           - Newsletters e informativos
           - Confirmações simples
           - Mensagens de cortesia
        
        Considere também:
        - URGÊNCIA: Se o email indica necessidade de resposta rápida
        - CONTEXTO: O tom e formalidade da mensagem
        - IMPACTO: Se ignorer o email pode causar problemas
        - TIPO DE PERGUNTA: Se é uma pergunta factual que pode ser respondida diretamente
        - MENSAGENS COMEMORATIVAS: Reconheça datas especiais e celebrações
        
        Responda APENAS em formato JSON válido com esta estrutura exata:
        {
            "category": "Produtivo" ou "Improdutivo",
            "confidence": valor entre 0.0 e 1.0,
            "reasoning": "explicação detalhada da classificação em português",
            "is_urgent": true ou false,
            "key_indicators": ["lista", "de", "indicadores", "principais"],
            "special_type": "factual_question", "celebration", "standard" ou null
        }
        """
    
    def _get_response_system_prompt(self, category: str) -> str:
        if category == "Produtivo":
            return """
            Você é um assistente profissional que gera respostas cordiais e eficientes para emails produtivos.
            
            CAPACIDADES ESPECIAIS:
            - Responda perguntas factuais diretamente quando souber a resposta (números de emergência, informações básicas, etc.)
            - Para emergências no Brasil: 190 (Polícia), 192 (SAMU), 193 (Bombeiros), 197 (Polícia Civil), 100 (Direitos Humanos)
            - Para informações gerais: forneça respostas diretas quando possível
            
            Suas respostas devem:
            1. PRIMEIRO: Responder diretamente perguntas factuais quando aplicável
            2. Ser profissionais e cordiais
            3. Confirmar o recebimento da solicitação
            4. Indicar próximos passos quando aplicável
            5. Estabelecer expectativas de tempo de resposta
            6. Ser concisas (máximo 3 parágrafos)
            7. Usar português formal e empresarial
            8. Demonstrar que a solicitação foi compreendida
            
            ESTRUTURA PARA PERGUNTAS FACTUAIS:
            - Resposta direta à pergunta
            - Breve confirmação de que entendeu
            - Oferecimento de ajuda adicional se necessário
            
            Para emails urgentes, priorize:
            - Reconhecimento da urgência
            - Ação imediata ou escalação
            - Canais de contato alternativos se necessário
            """
        else:
            return """
            Você é um assistente que gera respostas cordiais para emails Improdutivos.
            
            CAPACIDADES ESPECIAIS PARA CELEBRAÇÕES:
            - Reconheça e responda apropriadamente a: feliz aniversário, feliz natal, feliz ano novo, parabéns, felicitações, etc.
            - Use respostas calorosas e genuínas para celebrações
            - Mantenha o tom apropriado para cada tipo de celebração
            
            Suas respostas devem:
            1. PRIMEIRO: Reconhecer e agradecer celebrações/felicitações quando aplicável
            2. Ser breves e cordiais
            3. Agradecer quando apropriado
            4. Reconhecer o sentimento positivo
            5. Não criar compromissos desnecessários
            6. Ser concisas (máximo 2 parágrafos)
            7. Usar tom amigável mas profissional
            8. Manter relacionamento positivo
            
            EXEMPLOS DE RESPOSTAS PARA CELEBRAÇÕES:
            - Aniversário: "Muito obrigado(a) pelas felicitações de aniversário! Fico muito grato(a) pelo carinho."
            - Natal: "Obrigado(a) pelos votos natalinos! Desejo a você e sua família um Natal repleto de paz e alegria."
            - Ano Novo: "Agradeço os votos de Ano Novo! Que este novo ciclo traga muitas realizações para todos nós."
            """
    
    def _build_classification_user_prompt(self, email_text: str, features: EmailFeatures) -> str:
        return f"""
        Analise o seguinte email e classifique com base no conteúdo e indicadores detectados:
        
        === TEXTO DO EMAIL ===
        {email_text}
        
        === INDICADORES DETECTADOS AUTOMATICAMENTE ===
        - Contém perguntas: {features.has_questions}
        - Indicadores de urgência: {features.has_urgency_indicators}
        - Indicadores de solicitação: {features.has_request_indicators}
        - Indicadores de problema: {features.has_problem_indicators}
        - Indicadores técnicos: {features.has_technical_indicators}
        - Indicadores sociais: {features.has_social_indicators}
        - Score de formalidade: {features.formality_score:.2f} (0=informal, 1=formal)
        - Sentimento: {features.sentiment_indicators.sentiment_score:.2f} (-1=negativo, +1=positivo)
        - Tamanho: {features.word_count} palavras
        
        === INSTRUÇÕES ESPECÍFICAS ===
        1. Analise o conteúdo principal do email
        2. Considere os indicadores automaticamente detectados
        3. Avalie se o email requer ação específica ou é apenas informativo
        4. Determine o nível de urgência baseado no conteúdo e indicadores
        5. Identifique se é uma pergunta factual, mensagem comemorativa ou email padrão
        6. Para perguntas como "qual telefone ligar em emergência" = classificar como Produtivo
        7. Para mensagens como "feliz aniversário", "feliz natal, quero um café, quero uma bebida, um suco" = classificar como Improdutivo
        8. Forneça reasoning detalhado explicando sua decisão
        
        Classifique agora:
        """
    
    def _build_response_user_prompt(self, email_text: str, category: str, is_urgent: bool, features: EmailFeatures) -> str:
        urgency_context = "URGENTE - " if is_urgent else ""
        sentiment_context = "positivo" if features.sentiment_indicators.has_positive else "neutro/negativo" if features.sentiment_indicators.has_negative else "neutro"
        
        return f"""
        Gere uma resposta apropriada para o seguinte email:
        
        === EMAIL ORIGINAL ===
        {email_text}
        
        === CONTEXTO ===
        - Categoria: {category}
        - {urgency_context}Urgência: {"SIM" if is_urgent else "NÃO"}
        - Sentimento detectado: {sentiment_context}
        - Contém perguntas: {"SIM" if features.has_questions else "NÃO"}
        - Indica problema: {"SIM" if features.has_problem_indicators else "NÃO"}
        - Tom formal: {"SIM" if features.formality_score > 0.7 else "NÃO"}
        
        === INSTRUÇÕES ESPECIAIS ===
        1. IDENTIFIQUE O TIPO DE EMAIL:
           - Pergunta factual (números, informações específicas) → Responda diretamente primeiro
           - Celebração/felicitação → Agradeça genuinamente primeiro
           - Email padrão → Use comportamento normal
        
        2. PERGUNTAS FACTUAIS COMUNS:
           - Emergência: 190 (Polícia), 192 (SAMU), 193 (Bombeiros)
           - Outras informações: forneça quando souber
        
        3. CELEBRAÇÕES/FELICITAÇÕES:
           - Reconheça e agradeça de forma calorosa
           - Use linguagem apropriada para a ocasião
        
        4. COMPORTAMENTO GERAL:
           - Responda de forma apropriada à categoria e contexto
           - Mantenha tom profissional mas acessível
           - Não use placeholders como [Nome] ou [Data]
           - Seja específico sobre próximos passos quando necessário
           - Para emails urgentes, demonstre priorização
        
        Gere a resposta agora:
        """