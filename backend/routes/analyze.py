from fastapi import APIRouter, UploadFile, File, HTTPException

from backend.models.schemas import VisionResponse
from backend.services.verification import verify_product
from backend.services.rag_service import get_rag_context


router = APIRouter()

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp"
}


@router.post("/api/analyze")
async def analyze_product(file: UploadFile = File(...)):

    # 1. Validate image type

    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Invalid image format. Please upload JPG, PNG, or WEBP."
        )

    # 2. Read image

    image_data = await file.read()

    if not image_data:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty."
        )

    # 3. TEMPORARY Vision AI output
    # This will be replaced by the real Vision AI teammate code.

    vision_response = {
        "product": {
            "category": "electrical appliance",
            "brand": "Demo Brand",
            "product_name": "Demo Product",
            "manufacturer": "Demo Manufacturer"
        },
        "bis_information": {
            "standard_number": "IS 302",
            "licence_number": None,
            "registration_number": None,
            "huid": None,
            "rn_number": None,
            "marking_text": "IS 302"
        },
        "detected_markings": [
            "IS 302"
        ],
        "extracted_text": [
            "IS 302"
        ],
        "confidence": {
            "overall": 0.92,
            "standard_number": 0.95,
            "licence_number": 0.0,
            "product_category": 0.90,
            "marking": 0.95
        },
        "image_quality": {
            "is_readable": True,
            "issues": []
        },
        "language": "en"
    }

    # Validate Vision output against frozen JSON contract.

    validated_vision = VisionResponse(**vision_response)

    vision_data = validated_vision.model_dump()

    # 4. BIS verification

    verification_result = verify_product(vision_data)

    # 5. RAG retrieval

    product_category = vision_data["product"].get("category") or ""
    standard_number = vision_data["bis_information"].get("standard_number") or ""

    rag_query = f"{product_category} {standard_number} BIS standard"

    rag_context = get_rag_context(
        rag_query,
        top_k=3
    )

    # 6. Final API response

    return {
        "vision_data": vision_data,
        "verification": verification_result,
        "rag_context": rag_context
    }
