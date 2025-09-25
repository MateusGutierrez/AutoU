import re
import nltk
from typing import List, Dict, Any
import unicodedata
from collections import Counter

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('wordnet')
    nltk.download('averaged_perceptron_tagger')

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.tag import pos_tag

class TextProcessor:
    def __init__(self, language: str = 'portuguese'):
        self.language = language
        self.lemmatizer = WordNetLemmatizer()
        self.custom_stopwords = {
            'prezado', 'prezada', 'atenciosamente', 'cordialmente',
            'att', 'abs', 'grato', 'grata', 'agradeço', 'obrigado',
            'obrigada', 'favor', 'por', 'para', 'com', 'sem'
        }
        
        try:
            self.stop_words = set(stopwords.words(language))
            self.stop_words.update(self.custom_stopwords)
        except:
            self.stop_words = self.custom_stopwords
            
    def clean_text(self, text: str) -> str:
        text = unicodedata.normalize('NFKD', text)
        
        text = re.sub(r'\S+@\S+', '', text)
        text = re.sub(r'http[s]?://\S+', '', text)
        text = re.sub(r'www.\S+', '', text)

        text = re.sub(r'\+?[\d\-\(\)\s]+\d', '', text)

        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'\n+', ' ', text)

        text = re.sub(r'[^\w\s\.\,\!\?\-]', '', text)
        
        return text.strip()
    
    def extract_features(self, text: str) -> Dict[str, Any]:

        clean_text = self.clean_text(text)
        tokens = word_tokenize(clean_text.lower())
        sentences = sent_tokenize(text)
        
        filtered_tokens = [w for w in tokens if w not in self.stop_words and len(w) > 2]
        
        features = {
            'text_length': len(text),
            'word_count': len(tokens),
            'sentence_count': len(sentences),
            'avg_word_length': sum(len(word) for word in tokens) / len(tokens) if tokens else 0,
            'avg_sentence_length': len(tokens) / len(sentences) if sentences else 0,
            'unique_words': len(set(tokens)),
            'lexical_diversity': len(set(tokens)) / len(tokens) if tokens else 0,
            'filtered_tokens': filtered_tokens,
            'top_words': self._get_top_words(filtered_tokens, n=10),
            'has_questions': self._has_questions(text),
            'has_urgency_indicators': self._has_urgency_indicators(text),
            'has_request_indicators': self._has_request_indicators(text),
            'sentiment_indicators': self._get_sentiment_indicators(text),
            'formality_score': self._calculate_formality_score(text)
        }
        
        return features
    
    def _get_top_words(self, tokens: List[str], n: int = 10) -> List[tuple]:
        word_freq = Counter(tokens)
        return word_freq.most_common(n)
    
    def _has_questions(self, text: str) -> bool:
        question_patterns = [
            r'\?',
            r'\b(como|quando|onde|por que|qual|quem|quanto)\b',
            r'\b(poderia|pode|seria|é possível)\b'
        ]
        
        for pattern in question_patterns:
            if re.search(pattern, text.lower()):
                return True
        return False
    
    def _has_urgency_indicators(self, text: str) -> bool:
        urgency_words = [
            'urgente', 'urgência', 'imediato', 'imediatamente',
            'asap', 'prioridade', 'crítico', 'emergência',
            'logo', 'rápido', 'rapidamente', 'hoje', 'agora'
        ]
        
        text_lower = text.lower()
        return any(word in text_lower for word in urgency_words)
    
    def _has_request_indicators(self, text: str) -> bool:
        request_patterns = [
            'solicito', 'solicita', 'peço', 'pedido', 'favor',
            'preciso', 'necessito', 'gostaria', 'poderia',
            'ajuda', 'suporte', 'assistência', 'problema',
            'erro', 'falha', 'não funciona', 'não consigo'
        ]
        
        text_lower = text.lower()
        return any(pattern in text_lower for pattern in request_patterns)
    
    def _get_sentiment_indicators(self, text: str) -> Dict[str, bool]:
        positive_words = [
            'obrigado', 'parabéns', 'excelente', 'ótimo',
            'bom', 'feliz', 'satisfeito', 'agradeço'
        ]
        
        negative_words = [
            'problema', 'erro', 'falha', 'ruim', 'péssimo',
            'insatisfeito', 'decepcionado', 'frustrado'
        ]
        
        text_lower = text.lower()
        
        return {
            'has_positive': any(word in text_lower for word in positive_words),
            'has_negative': any(word in text_lower for word in negative_words)
        }
    
    def _calculate_formality_score(self, text: str) -> float:
        formal_indicators = [
            'prezado', 'prezada', 'senhor', 'senhora',
            'vossa', 'ilustríssimo', 'excelentíssimo',
            'cordialmente', 'atenciosamente', 'respeitosamente'
        ]
        
        informal_indicators = [
            'oi', 'olá', 'e aí', 'beleza', 'valeu',
            'abraço', 'beijo', 'tchau', 'falou'
        ]
        
        text_lower = text.lower()
        
        formal_count = sum(1 for word in formal_indicators if word in text_lower)
        informal_count = sum(1 for word in informal_indicators if word in text_lower)
        
        if formal_count + informal_count == 0:
            return 0.5
            
        formality_score = formal_count / (formal_count + informal_count)
        return formality_score
    
    def extract_keywords(self, text: str, n: int = 5) -> List[str]:
        features = self.extract_features(text)
        
        tokens = word_tokenize(self.clean_text(text).lower())
        pos_tags = pos_tag(tokens)
        
        important_words = [
            word for word, tag in pos_tags 
            if tag in ['NN', 'NNS', 'NNP', 'NNPS', 'VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ']
            and word not in self.stop_words
            and len(word) > 3
        ]
        
        word_freq = Counter(important_words)
        
        return [word for word, _ in word_freq.most_common(n)]