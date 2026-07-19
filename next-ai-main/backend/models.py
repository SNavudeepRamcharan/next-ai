from typing import Optional
from sqlmodel import SQLModel, Field


class Chat(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    chat_id: str = Field(index=True)

    role: str

    content: str


class ChatSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    chat_id: str = Field(index=True, unique=True)

    title: str