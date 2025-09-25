"""
File handling service for processing uploaded files
"""
import os
import aiofiles
from typing import Optional, Tuple
import PyPDF2
import tempfile
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

class FileHandler:
    """Serviço para processamento de arquivos enviados"""
    
    def __init__(self, upload_folder: str = "uploads"):
        """
        Inicializa o handler de arquivos
        
        Args:
            upload_folder: Pasta para armazenar uploads temporários
        """
        self.upload_folder = Path(upload_folder)
        self.upload_folder.mkdir(exist_ok=True)
        
    async def extract_text_from_file(self, file_content: bytes, filename: str) -> Tuple[str, str]:
        """
        Extrai texto de um arquivo
        
        Args:
            file_content: Conteúdo do arquivo em bytes
            filename: Nome do arquivo
            
        Returns:
            Tupla (texto_extraído, tipo_arquivo)
        """
        file_extension = filename.split('.')[-1].lower()
        
        try:
            if file_extension == 'txt':
                return await self._extract_from_txt(file_content), 'text/plain'
            elif file_extension == 'pdf':
                return await self._extract_from_pdf(file_content), 'application/pdf'
            else:
                raise ValueError(f"Formato de arquivo não suportado: {file_extension}")
                
        except Exception as e:
            logger.error(f"Erro ao extrair texto do arquivo {filename}: {str(e)}")
            raise
    
    async def _extract_from_txt(self, content: bytes) -> str:
        """
        Extrai texto de arquivo TXT
        
        Args:
            content: Conteúdo do arquivo
            
        Returns:
            Texto extraído
        """
        try:
            # Tenta diferentes encodings
            encodings = ['utf-8', 'latin-1', 'iso-8859-1', 'cp1252']
            
            for encoding in encodings:
                try:
                    text = content.decode(encoding)
                    return text
                except UnicodeDecodeError:
                    continue
                    
            # Se nenhum encoding funcionou, usa utf-8 com errors='ignore'
            return content.decode('utf-8', errors='ignore')
            
        except Exception as e:
            logger.error(f"Erro ao decodificar arquivo TXT: {str(e)}")
            raise
    
    async def _extract_from_pdf(self, content: bytes) -> str:
        """
        Extrai texto de arquivo PDF
        
        Args:
            content: Conteúdo do arquivo
            
        Returns:
            Texto extraído
        """
        text = ""
        
        # Cria arquivo temporário para processar o PDF
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        try:
            with open(tmp_file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                num_pages = len(pdf_reader.pages)
                
                logger.info(f"Processando PDF com {num_pages} páginas")
                
                for page_num in range(num_pages):
                    page = pdf_reader.pages[page_num]
                    page_text = page.extract_text()
                    
                    if page_text:
                        text += page_text + "\n"
                        
            if not text.strip():
                raise ValueError("Não foi possível extrair texto do PDF")
                
            return text
            
        except Exception as e:
            logger.error(f"Erro ao processar PDF: {str(e)}")
            raise
        finally:
            # Remove arquivo temporário
            try:
                os.unlink(tmp_file_path)
            except:
                pass
    
    async def save_temporary_file(self, content: bytes, filename: str) -> str:
        """
        Salva arquivo temporariamente
        
        Args:
            content: Conteúdo do arquivo
            filename: Nome do arquivo
            
        Returns:
            Caminho do arquivo salvo
        """
        # Sanitiza o nome do arquivo
        safe_filename = "".join(c for c in filename if c.isalnum() or c in ('_', '-', '.'))
        file_path = self.upload_folder / safe_filename
        
        try:
            async with aiofiles.open(file_path, 'wb') as f:
                await f.write(content)
                
            logger.info(f"Arquivo salvo temporariamente: {file_path}")
            return str(file_path)
            
        except Exception as e:
            logger.error(f"Erro ao salvar arquivo: {str(e)}")
            raise
    
    def cleanup_old_files(self, max_age_hours: int = 24):
        """
        Remove arquivos antigos da pasta de upload
        
        Args:
            max_age_hours: Idade máxima dos arquivos em horas
        """
        import time
        
        current_time = time.time()
        max_age_seconds = max_age_hours * 3600
        
        try:
            for file_path in self.upload_folder.glob('*'):
                if file_path.is_file():
                    file_age = current_time - file_path.stat().st_mtime
                    
                    if file_age > max_age_seconds:
                        file_path.unlink()
                        logger.info(f"Arquivo antigo removido: {file_path}")
                        
        except Exception as e:
            logger.error(f"Erro ao limpar arquivos antigos: {str(e)}")
    
    def validate_file(self, filename: str, file_size: int) -> Tuple[bool, Optional[str]]:
        """
        Valida arquivo antes do processamento
        
        Args:
            filename: Nome do arquivo
            file_size: Tamanho do arquivo em bytes
            
        Returns:
            Tupla (é_válido, mensagem_erro)
        """
        from app.config import settings
        
        # Verifica extensão
        file_extension = filename.split('.')[-1].lower()
        if file_extension not in settings.allowed_extensions:
            return False, f"Formato não suportado. Use: {', '.join(settings.allowed_extensions)}"
        
        # Verifica tamanho
        if file_size > settings.max_upload_size:
            max_mb = settings.max_upload_size / (1024 * 1024)
            return False, f"Arquivo muito grande. Máximo: {max_mb:.1f} MB"
        
        if file_size == 0:
            return False, "Arquivo vazio"
        
        return True, None