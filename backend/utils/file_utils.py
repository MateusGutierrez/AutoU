import PyPDF2
import io
from fastapi import HTTPException, UploadFile

class FileProcessor:
    @staticmethod
    def extract_text_from_pdf(file_content: bytes) -> str:
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            return text
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Erro ao processar PDF: {str(e)}")
    
    @staticmethod
    async def process_upload_file(file: UploadFile) -> str:
        if not file.filename:
            raise HTTPException(status_code=400, detail="Nenhum arquivo enviado")
        
        if not file.filename.lower().endswith(('.txt', '.pdf')):
            raise HTTPException(status_code=400, detail="Apenas arquivos .txt e .pdf são aceitos")
        
        try:
            content = await file.read()
            
            if file.filename.lower().endswith('.pdf'):
                email_text = FileProcessor.extract_text_from_pdf(content)
            else:
                email_text = content.decode('utf-8')
            
            if not email_text.strip():
                raise HTTPException(status_code=400, detail="Arquivo vazio ou não foi possível extrair texto")
            
            return email_text
            
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="Erro na codificação do arquivo. Certifique-se que é UTF-8")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")