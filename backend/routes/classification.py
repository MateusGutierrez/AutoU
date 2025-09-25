from fastapi import APIRouter, UploadFile, File, HTTPException
from models.schemas import EmailClassification, TextInput, FeaturesTestResponse
from services.classification_service import ClassificationService
from services.feature_extraction_service import FeatureExtractionService
from utils.file_utils import FileProcessor

router = APIRouter()
classification_service = ClassificationService()
feature_service = FeatureExtractionService()

@router.post("/classify-text", response_model=EmailClassification)
async def classify_text(text_input: TextInput):
    if not text_input.text.strip():
        raise HTTPException(status_code=400, detail="Texto não pode estar vazio")
    
    classification = classification_service.classify_email(text_input.text)
    return classification

@router.post("/classify-file", response_model=EmailClassification)
async def classify_file(file: UploadFile = File(...)):
    email_text = await FileProcessor.process_upload_file(file)
    classification = classification_service.classify_email(email_text)
    return classification

@router.get("/features-test", response_model=FeaturesTestResponse)
async def test_features(text: str = "Exemplo de texto para testar features"):
    features = feature_service.extract_features(text)
    return FeaturesTestResponse(text=text, features=features)