import os
import base64
import requests

HF_TOKEN = os.getenv("HF_TOKEN")

API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell"


def generate_image(prompt: str):

    headers = {
        "Authorization": f"Bearer {HF_TOKEN}"
    }

    payload = {
        "inputs": prompt
    }

    response = requests.post(
        API_URL,
        headers=headers,
        json=payload,
        timeout=180,
    )

    if response.status_code != 200:
        raise Exception(response.text)

    return {
        "image": base64.b64encode(response.content).decode("utf-8")
    }