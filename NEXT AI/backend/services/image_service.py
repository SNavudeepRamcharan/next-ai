import os
import base64

from google import genai
from google.genai import types

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def generate_image(prompt: str):
    response = client.models.generate_content(
        model="gemini-2.5-flash-image-preview",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["TEXT", "IMAGE"]
        ),
    )

    for part in response.candidates[0].content.parts:
        if getattr(part, "inline_data", None):
            return {
                "image": base64.b64encode(
                    part.inline_data.data
                ).decode("utf-8")
            }

    raise Exception("No image returned by Gemini.")