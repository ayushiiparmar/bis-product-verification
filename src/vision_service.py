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
1. Extract information only from the image.
2. Do NOT invent or guess missing values.
3. If a value cannot be detected, return an empty string.
4. Put all readable text in extracted_text.
5. Confidence scores must be between 0.0 and 1.0.
6. Report image readability and any image issues.
7. Do NOT verify whether a BIS standard or licence is valid.
8. Do NOT decide whether the product is BIS-certified.
9. Return ONLY the JSON object.
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