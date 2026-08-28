from fastapi import APIRouter, UploadFile, File
from backend.models.schemas import VisionResponse

router = APIRouter()


@router.post("/api/analyze", response_model=VisionResponse)
async def analyze_product(file: UploadFile = File(...)):

    response = VisionResponse(
        product={
            "category": "",
            "brand": "",
            "product_name": ""
        },
        bis_information={
            "standard_number": "",
            "licence_number": "",
            "registration_number": "",
            "marking_text": ""
        },
        extracted_text=[],
        confidence={
            "overall": 0.0,
            "standard_number": 0.0,
            "licence_number": 0.0,
            "product_category": 0.0
        },
        image_quality={
            "is_readable": True,
            "issues": []
        }
    )

    return response