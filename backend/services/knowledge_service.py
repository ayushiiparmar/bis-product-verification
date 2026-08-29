import json
from pathlib import Path


DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "bis_standards.json"


def load_standards() -> list:
    """Load BIS standards from the JSON knowledge base."""

    if not DATA_FILE.exists():
        return []

    with open(DATA_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def normalize(value: str) -> str:
    """Normalize text for reliable comparison."""

    return " ".join(value.lower().strip().split())


def find_standard(standard_number: str):
    """Find an exact BIS standard number."""

    target = normalize(standard_number)

    standards = load_standards()

    for standard in standards:
        if normalize(standard["standard_number"]) == target:
            return standard

    return None


def category_matches(product_category: str, standard: dict) -> bool:
    """Check whether the detected product category matches the standard."""

    if not product_category:
        return False

    category = normalize(product_category)

    for supported_category in standard.get("product_categories", []):
        supported = normalize(supported_category)

        if category == supported:
            return True

        if category in supported or supported in category:
            return True

    return False
