import os
from typing import List
from database import create_db
from dotenv import load_dotenv
from conversation_manager import conversation_manager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from pydantic import BaseModel
from openai import AsyncOpenAI

from routers.image import router as image_router

load_dotenv()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncOpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)


# ==========================
# Models
# ==========================

class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    chat_id: str
    messages: List[ChatMessage]
    model: str = "openai/gpt-4.1-mini"


# ==========================
# Routes
# ==========================
@app.on_event("startup")
def on_startup():
    create_db()

app.include_router(image_router)
    
@app.get("/")
def home():
    return {
        "message": "Next AI Backend is Running!"
    }


@app.post("/chat")
async def chat(req: ChatRequest):
    try:

        # Store conversation
        conversation_manager.clear_chat(req.chat_id)

        for msg in req.messages:
            conversation_manager.add_message(
                req.chat_id,
                msg.role,
                msg.content
            )

        # System Prompt
        api_messages = [
            {
                "role": "system",
                "content": (
                    "You are Next AI, a helpful, intelligent AI assistant. "
                    "Always answer in clean Markdown. "
                    "Use headings, bullet points, tables, and code blocks whenever appropriate."
                )
            }
        ]

        # Previous Conversation
        for msg in conversation_manager.get_messages(req.chat_id):
            api_messages.append(msg)

        # OpenRouter Streaming
        stream = await client.chat.completions.create(
            model=req.model,
            messages=api_messages,
            temperature=0.7,
            max_tokens=2000,
            stream=True,
        )

        async def generate():

            full_reply = ""

            async for chunk in stream:

                if (
                    chunk.choices
                    and len(chunk.choices) > 0
                    and chunk.choices[0].delta
                ):

                    content = chunk.choices[0].delta.content

                    if content:

                        full_reply += content

                        yield content

            # Save AI response
            conversation_manager.add_message(
                req.chat_id,
                "assistant",
                full_reply
            )

        return StreamingResponse(
            generate(),
            media_type="text/plain"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )