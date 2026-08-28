from pydantic import BaseModel
from typing import List


class Product(BaseModel):
    category: str = ""
    brand: str = ""
    product_name: str = ""


class BISInformation(BaseModel):
    standard_number: str = ""
    licence_number: str = ""
    registration_number: str = ""
    marking_text: str = ""


class Confidence(BaseModel):
    overall: float = 0.0
    standard_number: float = 0.0
    licence_number: float = 0.0
    product_category: float = 0.0


class ImageQuality(BaseModel):
    is_readable: bool = True
    issues: List[str] = []


class VisionResponse(BaseModel):
    product: Product
    bis_information: BISInformation
    extracted_text: List[str]
    confidence: Confidence
    image_quality: ImageQuality
    