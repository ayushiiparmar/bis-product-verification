from pydantic import BaseModel
from typing import List, Optional


class Product(BaseModel):
    category: Optional[str] = None
    brand: Optional[str] = None
    product_name: Optional[str] = None
    manufacturer: Optional[str] = None


class BISInformation(BaseModel):
    standard_number: Optional[str] = None
    licence_number: Optional[str] = None
    registration_number: Optional[str] = None
    huid: Optional[str] = None
    rn_number: Optional[str] = None
    marking_text: Optional[str] = None


class Confidence(BaseModel):
    overall: float = 0.0
    standard_number: float = 0.0
    licence_number: float = 0.0
    product_category: float = 0.0
    marking: float = 0.0


class ImageQuality(BaseModel):
    is_readable: bool = True
    issues: List[str] = []


class VisionResponse(BaseModel):
    product: Product
    bis_information: BISInformation
    detected_markings: List[str] = []
    extracted_text: List[str] = []
    confidence: Confidence
    image_quality: ImageQuality
    language: str = "en"
