import os

def generate_image(prompt: str):
    return {
        "prompt": prompt,
        "gemini_key_exists": os.getenv("GEMINI_API_KEY") is not None,
        "gemini_key_length": len(os.getenv("GEMINI_API_KEY", "")),
        "first5": os.getenv("GEMINI_API_KEY", "")[:5],
    }