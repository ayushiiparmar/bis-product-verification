import os
import json
import base64
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()


def _empty_vision_response():
    return {
        "product": {
            "category": "",
            "brand": "",
            "product_name": ""
        },
        "bis_information": {
            "standard_number": "",
            "licence_number": "",
            "registration_number": "",
            "marking_text": ""
        },
        "extracted_text": [],
        "confidence": {
            "overall": 0.0,
            "standard_number": 0.0,
            "licence_number": 0.0,
            "product_category": 0.0
        },
        "image_quality": {
            "is_readable": True,
            "issues": []
        }
    }


def extract_product_info(image_path: str) -> dict:
    api_key = os.getenv("OPENAI_API_KEY")
    model = os.getenv("OPENAI_VISION_MODEL")

    if not api_key:
        raise ValueError("OPENAI_API_KEY is not set")

    if not model:
        raise ValueError("OPENAI_VISION_MODEL is not set")

    client = OpenAI(api_key=api_key)

    with open(image_path, "rb") as image_file:
        image_data = base64.b64encode(image_file.read()).decode("utf-8")

        prompt = """
You are a product information extraction system.

Analyze the uploaded product image and return ONLY valid JSON.

You MUST follow this exact structure:

{
  "product": {
    "category": "",
    "brand": "",
    "product_name": ""
  },
  "bis_information": {
    "standard_number": "",
    "licence_number": "",
    "registration_number": "",
    "marking_text": ""
  },
  "extracted_text": [],
  "confidence": {
    "overall": 0.0,
    "standard_number": 0.0,
    "licence_number": 0.0,
    "product_category": 0.0
  },
  "image_quality": {
    "is_readable": true,
    "issues": []
  }
}

Rules:

1. Extract information only from the uploaded image.
2. Do NOT invent or guess specific product names, brands, licence numbers, registration numbers, or BIS numbers.
3. If a value cannot be reliably detected from the image, return an empty string.
4. Identify the general product category when the product itself is visibly identifiable.
5. Product category may be a general category such as:
   - electronic appliance
   - audio equipment
   - video equipment
   - electrical appliance
   - household appliance
   - electric cable
   - gas cylinder
   - lpg cylinder
6. If only a BIS marking or label is visible and the actual product cannot be identified, leave product.category empty.
7. Put all clearly readable text from the image into extracted_text.
8. Extract BIS standard numbers exactly as visible.
9. Extract licence and registration numbers exactly as visible when present.
10. Confidence scores must be between 0.0 and 1.0.
11. Report whether the image is readable and list image issues.
12. Do NOT verify whether a BIS standard or licence is valid.
13. Do NOT decide whether the product is BIS-certified.
14. Return ONLY the JSON object.
"""
    response = client.responses.create(
        model=model,
        input=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": prompt
                    },
                    {
                        "type": "input_image",
                        "image_url": f"data:image/jpeg;base64,{image_data}"
                    }
                ]
            }
        ]
    )

    result = json.loads(response.output_text)

    return result


if __name__ == "__main__":
    result = extract_product_info("product.jpg")
    print(json.dumps(result, indent=2))
