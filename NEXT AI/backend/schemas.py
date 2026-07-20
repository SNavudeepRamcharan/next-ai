from typing import List
from pydantic import BaseModel


# ==========================================
# Chat Messages
# ==========================================

class ChatMessage(BaseModel):
    role: str
    content: str


# ==========================================
# Chat Request
# ==========================================

class ChatRequest(BaseModel):
    chat_id: str
    messages: List[ChatMessage]
    model: str = "openai/gpt-4.1-mini"
    image: str | None = None


# ==========================================
# Chat History
# ==========================================

class ChatSessionResponse(BaseModel):
    chat_id: str
    title: str
    created_at: str
    updated_at: str


# ==========================================
# Rename Chat
# ==========================================

class RenameChatRequest(BaseModel):
    title: str


# ==========================================
# Delete Chat
# ==========================================

class DeleteChatResponse(BaseModel):
    success: bool
    message: str