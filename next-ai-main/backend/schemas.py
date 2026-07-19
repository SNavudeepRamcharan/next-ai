from pydantic import BaseModel


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    chat_id: str
    messages: list[ChatMessage]
    model: str = "openai/gpt-4.1-mini"


class ChatSessionResponse(BaseModel):
    chat_id: str
    title: str


class RenameChatRequest(BaseModel):
    title: str