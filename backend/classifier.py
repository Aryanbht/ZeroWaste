"""
Gemini Vision classifier for waste detection and categorisation.
Uses Google Gemini 1.5 Flash (free tier: 15 RPM, 1500 RPD) for image analysis.
"""

import os
import io
import base64
import json
import re
import google.generativeai as genai
from PIL import Image

_model = None


def _get_model():
    global _model
    if _model is None:
        api_key = os.getenv("GEMINI_API_KEY", "")
        if not api_key or api_key == "your_gemini_api_key_here":
            raise RuntimeError(
                "GEMINI_API_KEY is not set. Please add it to your .env file."
            )
        genai.configure(api_key=api_key)
        _model = genai.GenerativeModel("gemini-2.5-flash-lite")
        print("Gemini Vision model ready.")
    return _model


_PROMPT = """
You are a highly intelligent waste classification and sustainability AI assistant.
Analyse the image and respond with a JSON object ONLY (no markdown, no explanation).

Rules:
- Identify the main object(s) in the image.
- Set "is_garbage": true if it is waste, garbage, or recyclable items.
- Set "is_garbage": false if it's NOT waste (e.g., a person, an animal, nature, a usable item, food being eaten).
- Always provide a "category" (e.g., "E-waste", "Organic", "Plastic", "Metal", "Glass", "Paper", "General", or precisely describing what it is if it isn't waste).
- "confidence" should be a float between 0.0 and 1.0.
- "reasoning" should be a 1-2 sentence explanation of what you see.
- ALWAYS include a "tips_data" object with the following fields:
  - "description": A short interesting fact about this item's environmental impact or material.
  - "disposal": Array of 2-4 actionable, specific steps on how to properly dispose of, recycle, or handle this item. If not waste, provide steps on maintaining it to prevent waste.
  - "reuse": Array of 1-3 creative ideas to reuse, upcycle, or prolong the life of this exact item.
  - "carbon_saving": A single sentence detailing the carbon footprint or environmental saving of handling this item properly.

Required JSON format:
{
  "is_garbage": true,
  "category": "Plastic Bottle",
  "confidence": 0.95,
  "reasoning": "The image shows an empty plastic water bottle, which is recyclable plastic waste.",
  "tips_data": {
    "description": "PET plastics can take up to 450 years to decompose in a landfill.",
    "disposal": ["Rinse the bottle out.", "Leave the label on as modern recycling facilities can handle it.", "Place in your blue recycling bin."],
    "reuse": ["Cut the top off to use as a small planter.", "Refill it with tap water instead of buying a new one."],
    "carbon_saving": "Recycling one plastic bottle saves enough energy to power a 60-watt light bulb for up to 6 hours."
  }
}
"""


def _analyze_with_gemini(image: Image.Image) -> dict:
    """Send image to Gemini Vision and parse the structured response."""
    model = _get_model()

    # Convert PIL image to bytes for Gemini
    buf = io.BytesIO()
    image.save(buf, format="JPEG", quality=85)
    image_bytes = buf.getvalue()

    response = model.generate_content(
        [
            _PROMPT,
            {
                "mime_type": "image/jpeg",
                "data": image_bytes,
            },
        ]
    )

    raw_text = response.text.strip()

    # Strip markdown code fences if present
    raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
    raw_text = re.sub(r"\s*```$", "", raw_text)

    try:
        result = json.loads(raw_text)
    except json.JSONDecodeError:
        # Fallback: try to extract JSON object from the text
        match = re.search(r"\{.*\}", raw_text, re.DOTALL)
        if match:
            result = json.loads(match.group())
        else:
            raise RuntimeError(f"Gemini returned unexpected format: {raw_text[:300]}")

    # Validate and normalise
    is_garbage = bool(result.get("is_garbage", False))
    category = result.get("category", "General")
    confidence = float(result.get("confidence", 0.9))
    reasoning = result.get("reasoning", "Analysed by Gemini Vision.")

    tips_data = result.get("tips_data", {})
    if not tips_data or not isinstance(tips_data, dict):
        # Fallback empty structure
        tips_data = {
            "description": "No detailed environmental information available.",
            "disposal": ["Check local guidelines for proper disposal."],
            "reuse": ["Consider finding a new use for this item."],
            "carbon_saving": "Every recycled item helps the planet."
        }
    else:
        # Ensure array fields exist
        if "disposal" not in tips_data or not isinstance(tips_data["disposal"], list):
            tips_data["disposal"] = ["Check local guidelines for proper disposal."]
        if "reuse" not in tips_data or not isinstance(tips_data["reuse"], list):
            tips_data["reuse"] = ["Consider finding a new use for this item."]
        if "description" not in tips_data:
            tips_data["description"] = "No detailed environmental information available."
        if "carbon_saving" not in tips_data:
            tips_data["carbon_saving"] = "Every recycled item helps the planet."

    return {
        "is_garbage": is_garbage,
        "category": category,
        "confidence": round(confidence, 2),
        "reasoning": reasoning,
        "tips_data": tips_data
    }


def classify_image_bytes(image_bytes: bytes, mime_type: str = "image/jpeg") -> dict:
    """Classify raw image bytes using Gemini Vision."""
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return _analyze_with_gemini(image)


def classify_base64_frame(b64_data: str) -> dict:
    """Classify a base64-encoded webcam frame using Gemini Vision."""
    if "," in b64_data:
        b64_data = b64_data.split(",", 1)[1]
    image_bytes = base64.b64decode(b64_data)
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return _analyze_with_gemini(image)
