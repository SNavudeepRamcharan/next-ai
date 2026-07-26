import os
import base64
from google import genai
from google.genai import types

def generate_image(prompt: str):
    try:
        client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY")
        )

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["TEXT", "IMAGE"]
            ),
        )

        if not response.candidates:
            return {"error": "No candidates", "response": str(response)}

        for part in response.candidates[0].content.parts:
            if getattr(part, "inline_data", None):
                return {
                    "image": base64.b64encode(
                        part.inline_data.data
                    ).decode("utf-8")
                }

        return {
            "error": "No image returned",
            "response": str(response)
        }

    except Exception as e:
        return {
            "error": str(e)
        }