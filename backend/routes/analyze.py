from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.models.schemas import VisionResponse

router = APIRouter()

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp"
}


@router.post("/api/analyze", response_model=VisionResponse)
async def analyze_product(file: UploadFile = File(...)):

    # Check file type
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Invalid image format. Please upload JPG, PNG, or WEBP."
        )

    # Read image
    image_data = await file.read()

    # Check that image is not empty
    if not image_data:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty."
        )

    # Temporary response until Vision AI is connected
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