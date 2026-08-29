import re
from typing import Optional


def normalize_standard_number(value: Optional[str]) -> str:
    if not value:
        return ""

    value = value.strip().upper()
    value = re.sub(r"\s+", " ", value)

    # Convert common variants such as "IS302" ? "IS 302"
    match = re.search(r"\bIS\s*[-:]?\s*(\d+)\b", value)

    if match:
        return f"IS {match.group(1)}"

    return value


def validate_standard_number(value: Optional[str]) -> dict:
    normalized = normalize_standard_number(value)

    if not normalized:
        return {
            "is_valid_format": False,
            "normalized": "",
            "reason": "No BIS standard number detected."
        }

    if not re.fullmatch(r"IS \d+", normalized):
        return {
            "is_valid_format": False,
            "normalized": normalized,
            "reason": "Detected standard number does not match the expected IS number format."
        }

    return {
        "is_valid_format": True,
        "normalized": normalized,
        "reason": "Standard number format is valid."
    }


def validate_vision_output(vision_data: dict) -> dict:
    bis_info = vision_data.get("bis_information", {})

    standard_number = bis_info.get("standard_number", "")
    standard_validation = validate_standard_number(standard_number)

    image_quality = vision_data.get("image_quality", {})
    is_readable = image_quality.get("is_readable", True)

    confidence = vision_data.get("confidence", {})
    overall_confidence = confidence.get("overall", 0.0)

    return {
        "standard": standard_validation,
        "image_readable": is_readable,
        "overall_confidence": overall_confidence
    }
