from fastapi import APIRouter, UploadFile, File, HTTPException

from backend.models.schemas import VisionResponse
from backend.services.verification import verify_product


router = APIRouter()

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp"
}


@router.post("/api/analyze")
async def analyze_product(file: UploadFile = File(...)):

    # -----------------------------
    # 1. Validate image type
    # -----------------------------

    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Invalid image format. Please upload JPG, PNG, or WEBP."
        )

    # -----------------------------
    # 2. Read image
    # -----------------------------

    image_data = await file.read()

    if not image_data:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty."
        )

    # -----------------------------
    # 3. TEMPORARY Vision AI output
    # -----------------------------
    #
    # This will later be replaced by
    # the real Vision AI teammate code.
    #

    vision_response = {
        "product": {
            "category": "electrical appliance",
            "brand": "Demo Brand",
            "product_name": "Demo Product"
        },
        "bis_information": {
            "standard_number": "IS 302",
            "licence_number": "",
            "registration_number": "",
            "marking_text": "IS 302"
        },
        "extracted_text": [
            "IS 302"
        ],
        "confidence": {
            "overall": 0.92,
            "standard_number": 0.95,
            "licence_number": 0.0,
            "product_category": 0.90
        },
        "image_quality": {
            "is_readable": True,
            "issues": []
        }
    }

    # Validate that the Vision output
    # follows our frozen JSON contract.

    validated_vision = VisionResponse(**vision_response)

    # -----------------------------
    # 4. Verification
    # -----------------------------

    verification_result = verify_product(
        validated_vision.model_dump()
    )

    # -----------------------------
    # 5. Final API response
    # -----------------------------

    return {
        "vision_data": validated_vision.model_dump(),
        "verification": verification_result
    }