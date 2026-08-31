import json
import re
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
KB_PATH = BASE_DIR / "data" / "bis_standards.json"


def load_knowledge_base():
    """Load BIS standards from the JSON knowledge base."""

    with open(KB_PATH, "r", encoding="utf-8-sig") as file:
        return json.load(file)


def normalize_text(value: str) -> str:
    """Normalize text for reliable comparison."""

    if not value:
        return ""

    value = value.lower().strip()

    # Treat punctuation such as :, -, / as separators.
    value = re.sub(r"[^a-z0-9]+", " ", value)

    return " ".join(value.split())


def normalize_standard_number(value: str) -> str:
    """Normalize BIS standard numbers such as IS:4151 and IS 4151."""

    if not value:
        return ""

    value = value.upper().strip()

    match = re.search(r"\bIS\s*[:\-]?\s*(\d+)", value)

    if match:
        return f"IS {match.group(1)}"

    return normalize_text(value).upper()


def find_standard(standard_number: str):
    """Find a BIS standard by normalized standard number."""

    standards = load_knowledge_base()

    target = normalize_standard_number(standard_number)

    for standard in standards:
        known = normalize_standard_number(
            standard.get("standard_number", "")
        )

        if known == target:
            return standard

    return None


def category_matches(product_category: str, standard: dict) -> bool:
    """Check whether detected product category matches the BIS standard."""

    if not product_category:
        return False

    detected_category = normalize_text(product_category)

    for category in standard.get("product_categories", []):
        known_category = normalize_text(category)

        if (
            detected_category == known_category
            or detected_category in known_category
            or known_category in detected_category
        ):
            return True

    return False


def verify_product(vision_data: dict) -> dict:
    """
    Verify Vision AI extracted information against
    the BIS knowledge base.

    Possible statuses:

    STANDARD_IDENTIFIED
    INCONCLUSIVE
    BIS_MISMATCH
    """

    bis_information = vision_data.get("bis_information", {})
    product = vision_data.get("product", {})
    confidence = vision_data.get("confidence", {})
    image_quality = vision_data.get("image_quality", {})

    standard_number = bis_information.get("standard_number", "")
    product_category = product.get("category", "")

    overall_confidence = confidence.get("overall", 0.0)
    standard_confidence = confidence.get("standard_number", 0.0)

    # Rule 1: Image quality

    if not image_quality.get("is_readable", True):
        return {
            "status": "INCONCLUSIVE",
            "reason": "Image is not sufficiently readable.",
            "standard": None,
            "product_category_match": None,
            "confidence": overall_confidence
        }

    # Rule 2: Missing standard

    if not standard_number:
        return {
            "status": "INCONCLUSIVE",
            "reason": "No reliable BIS standard number was detected.",
            "standard": None,
            "product_category_match": None,
            "confidence": overall_confidence
        }

    # Rule 3: Low standard confidence

    if standard_confidence < 0.60:
        return {
            "status": "INCONCLUSIVE",
            "reason": "The detected BIS standard number has low confidence.",
            "standard": standard_number,
            "product_category_match": None,
            "confidence": overall_confidence
        }

    # Rule 4: Find standard

    standard = find_standard(standard_number)

    if standard is None:
        return {
            "status": "BIS_MISMATCH",
            "reason": "The detected BIS standard was not found in the knowledge base.",
            "standard": standard_number,
            "product_category_match": False,
            "confidence": overall_confidence
        }

    # Rule 5: Missing product category

    if not product_category:
        return {
            "status": "INCONCLUSIVE",
            "reason": "BIS standard was detected, but product category information is insufficient.",
            "standard": standard,
            "product_category_match": None,
            "confidence": overall_confidence
        }

    # Rule 6: Category matching

    category_match = category_matches(
        product_category,
        standard
    )

    if not category_match:
        return {
            "status": "BIS_MISMATCH",
            "reason": "The detected product category does not match the expected category for this BIS standard.",
            "standard": standard,
            "product_category_match": False,
            "confidence": overall_confidence
        }

    # Rule 7: Successful identification

    return {
        "status": "STANDARD_IDENTIFIED",
        "reason": "The detected BIS standard exists in the knowledge base and matches the detected product category.",
        "standard": standard,
        "product_category_match": True,
        "confidence": overall_confidence
    }
