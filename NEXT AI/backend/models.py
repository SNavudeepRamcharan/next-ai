from sqlmodel import SQLModel, Field


class Chat(SQLModel, table=True):
    id: str = Field(primary_key=True)

    title: str

    created_at: str

    updated_at: str


class Message(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    chat_id: str = Field(index=True)

    role: str

    content: str

    created_at: str