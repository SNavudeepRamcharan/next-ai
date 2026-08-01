import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


async def create_stream(
    model,
    messages,
    image_path=None,
    web_search=False,
):
    prompt = ""

    for msg in messages:
        prompt += f"{msg['role']}:\n{msg['content']}\n\n"

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt,
    )

    return response.text