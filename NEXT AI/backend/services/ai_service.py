import os
import base64

from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

client = AsyncOpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)


def image_to_base64(image_path: str):
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode()


async def generate_chat_title(message: str):

    response = await client.chat.completions.create(
        model="openai/gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "Generate a short chat title."
                    "Return ONLY the title."
                    "Maximum 5 words."
                ),
            },
            {
                "role": "user",
                "content": message,
            },
        ],
        max_tokens=20,
        temperature=0.2,
    )

    return response.choices[0].message.content.strip()


async def create_stream(model, messages, image_path=None):

    api_messages = [
        {
            "role": "system",
            "content": (
                "You are Next AI, a helpful intelligent AI assistant. "
                "Always answer using Markdown."
            ),
        }
    ]

    if image_path:

        extension = image_path.split(".")[-1]

        image64 = image_to_base64(image_path)

        for i, msg in enumerate(messages):

            if i == len(messages) - 1 and msg["role"] == "user":

                api_messages.append(
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": msg["content"],
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/{extension};base64,{image64}"
                                },
                            },
                        ],
                    }
                )

            else:
                api_messages.append(msg)

    else:
        api_messages.extend(messages)

    return await client.chat.completions.create(
        model=model,
        messages=api_messages,
        temperature=0.7,
        max_tokens=2000,
        stream=True,
    )