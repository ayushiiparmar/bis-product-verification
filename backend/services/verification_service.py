from backend.models.schemas import VisionResponse
from backend.services.knowledge_service import (
    find_standard,
    category_matches
)


STANDARD_IDENTIFIED = "STANDARD_IDENTIFIED"
INCONCLUSIVE = "INCONCLUSIVE"
BIS_MISMATCH = "BIS_MISMATCH"


def verify_product(vision_data: VisionResponse) -> dict:
    """
    Deterministic BIS verification logic.

    Vision AI:
        Extracts information.

    Knowledge Base:
        Provides BIS reference information.

    Verification Engine:
        Determines the result status.

    LLM:
        Must only explain this result.
    """

    # --------------------------------------------------
    # 1. Check image readability
    # --------------------------------------------------

    if not vision_data.image_quality.is_readable:
        return {
            "status": INCONCLUSIVE,
            "reason": "The uploaded image is not sufficiently readable.",
            "standard": vision_data.bis_information.standard_number,
            "product_category_match": None,
            "evidence": None
        }

    # --------------------------------------------------
    # 2. Get detected standard number
    # --------------------------------------------------

    standard_number = (
        vision_data.bis_information.standard_number.strip()
    )

    if not standard_number:
        return {
            "status": INCONCLUSIVE,
            "reason": "No BIS standard number could be reliably detected.",
            "standard": "",
            "product_category_match": None,
            "evidence": None
        }

    # --------------------------------------------------
    # 3. Check confidence
    # --------------------------------------------------

    if vision_data.confidence.standard_number < 0.70:
        return {
            "status": INCONCLUSIVE,
            "reason": "The detected BIS standard number has low confidence.",
            "standard": standard_number,
            "product_category_match": None,
            "evidence": None
        }

    # --------------------------------------------------
    # 4. Search BIS Knowledge Base
    # --------------------------------------------------

    standard = find_standard(standard_number)

    if standard is None:
        return {
            "status": BIS_MISMATCH,
            "reason": (
                "The detected BIS standard number was not found "
                "in the current BIS Knowledge Base."
            ),
            "standard": standard_number,
            "product_category_match": False,
            "evidence": None
        }

    # --------------------------------------------------
    # 5. Check product category
    # --------------------------------------------------

    product_category = vision_data.product.category.strip()

    if not product_category:
        return {
            "status": INCONCLUSIVE,
            "reason": (
                "The BIS standard was detected, but the product "
                "category could not be reliably determined."
            ),
            "standard": standard["standard_number"],
            "product_category_match": None,
            "evidence": standard
        }

    category_match = category_matches(
        product_category,
        standard
    )

    # --------------------------------------------------
    # 6. Category mismatch
    # --------------------------------------------------

    if not category_match:
        return {
            "status": BIS_MISMATCH,
            "reason": (
                "The detected BIS standard exists, but it does not "
                "match the detected product category."
            ),
            "standard": standard["standard_number"],
            "product_category_match": False,
            "evidence": standard
        }

    # --------------------------------------------------
    # 7. Successful identification
    # --------------------------------------------------

    return {
        "status": STANDARD_IDENTIFIED,
        "reason": (
            "The BIS standard was found in the Knowledge Base "
            "and matches the detected product category."
        ),
        "standard": standard["standard_number"],
        "product_category_match": True,
        "evidence": standard
    }
