import os
import requests
import base64


API_URL = (
    "https://api-inference.huggingface.co/models/"
    "black-forest-labs/FLUX.1-schnell"
)


def generate_image(prompt: str):

    token = os.getenv("HF_TOKEN")

    headers = {
        "Authorization": f"Bearer {token}",
    }

    response = requests.post(
        API_URL,
        headers=headers,
        json={
            "inputs": prompt
        },
        timeout=120,
    )

    if response.status_code != 200:
        raise Exception(response.text)

    image_bytes = response.content

    return {
        "image": base64.b64encode(
            image_bytes
        ).decode("utf-8")
    }