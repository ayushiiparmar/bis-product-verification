
import os
import tempfile

from fastapi import APIRouter, UploadFile, File, HTTPException

from backend.models.schemas import VisionResponse
from backend.services.verification import verify_product
from backend.services.rag_service import get_rag_context
from src.vision_service import extract_product_info


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

    # 2. Read uploaded image

    image_data = await file.read()

    if not image_data:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty."
        )

    # 3. Save image temporarily for Vision AI

    suffix = os.path.splitext(file.filename or "")[1].lower()

    if suffix not in {".jpg", ".jpeg", ".png", ".webp"}:
        suffix = ".jpg"

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix
        ) as temp_file:
            temp_file.write(image_data)
            temp_path = temp_file.name

        # 4. Real Vision AI extraction

        vision_response = extract_product_info(temp_path)

    except ValueError as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc)
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Vision AI analysis failed: {str(exc)}"
        )

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)

    # 5. Validate Vision output against frozen JSON contract

    try:
        validated_vision = VisionResponse(**vision_response)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid Vision AI response format: {str(exc)}"
        )

    vision_data = validated_vision.model_dump()

    # 6. BIS verification

    verification_result = verify_product(vision_data)

    # 7. RAG retrieval

    product_category = (
        vision_data["product"].get("category") or ""
    )

    standard_number = (
        vision_data["bis_information"].get("standard_number") or ""
    )

    rag_query = f"{product_category} {standard_number} BIS standard"

    rag_context = get_rag_context(
        rag_query,
        top_k=3
    )

        # 8. Final API response

    verification_status = verification_result.get(
        "status",
        "INCONCLUSIVE"
    )

    confidence = verification_result.get(
        "confidence",
        vision_data.get("confidence", {}).get("overall", 0.0)
    )

    standard = verification_result.get("standard") or {}

    standard_number_result = (
        standard.get("standard_number")
        or vision_data["bis_information"].get("standard_number")
        or ""
    )

    standard_title = standard.get(
        "standard_title",
        ""
    )

    standard_identified = standard_number_result

    if standard_title:
        standard_identified = (
            f"{standard_number_result} - {standard_title}"
        )

    explanation = verification_result.get(
        "reason",
        "Verification could not be conclusively determined."
    )

    return {
        # GitHub frontend contract
        "success": True,
        "data": {
            "product_name": vision_data["product"].get("product_name") or "",
            "category": vision_data["product"].get("category") or "",
            "brand": vision_data["product"].get("brand") or "",
            "verification_state": verification_status,
            "confidence_score": round(float(confidence) * 100, 2),
            "standard_identified": standard_identified,
            "explanation": explanation,
            "evidence": [
                f"Detected BIS standard: {standard_number_result}"
                if standard_number_result
                else "No BIS standard detected.",
                f"Product category: {vision_data['product'].get('category')}"
                if vision_data["product"].get("category")
                else "Product category could not be determined."
            ],
            "citations": [
                {
                    "title": standard_title or "BIS Reference Dataset",
                    "source": standard.get("source", "BIS"),
                    "url": (
                        rag_context[0].get("source_url")
                        if rag_context
                        else None
                    )
                }
            ] if standard_title or rag_context else []
        },

        # Keep detailed backend information available
        "vision_data": vision_data,
        "verification": verification_result,
        "rag_context": rag_context
    }