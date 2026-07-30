from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException  # type: ignore[import]
from sqlmodel import Session, select  # type: ignore[import]

from database import get_session
from models import Chat, Message

from schemas import RenameChatRequest

from repositories.chat_repository import ChatRepository

router = APIRouter(
    prefix="/history",
    tags=["History"],
)

# ==========================================
# Get messages of one chat
# ==========================================

@router.get("/chat/{chat_id}")
def get_chat(chat_id: str, session: Session = Depends(get_session)):
    messages = session.exec(
        select(Message).where(Message.chat_id == chat_id)
    ).all()

    return messages


# ==========================================
# Rename chat
# ==========================================

@router.patch("/chat/{chat_id}")
def rename_chat(
    chat_id: str,
    data: RenameChatRequest,
    session: Session = Depends(get_session),
):
    chat = session.get(Chat, chat_id)

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    chat.title = data.title
    # store as datetime object
    chat.updated_at = datetime.now()

    session.add(chat)
    session.commit()
    session.refresh(chat)

    return chat


# ==========================================
# Delete chat
# ==========================================

@router.delete("/chat/{chat_id}")
def delete_chat(chat_id: str, session: Session = Depends(get_session)):
    chat = session.get(Chat, chat_id)

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    messages = session.exec(
        select(Message).where(Message.chat_id == chat_id)
    ).all()

    for msg in messages:
        session.delete(msg)

    session.delete(chat)

    session.commit()

    return {
        "success": True,
        "message": "Chat deleted successfully",
    }

@router.get("/chats")
def get_chats(session: Session = Depends(get_session)):
    chats = ChatRepository.get_chats(session)

    return [
        {
            "id": c.id,
            "title": c.title,
            "created_at": c.created_at,
            "updated_at": c.updated_at,
            "pinned": c.pinned,
        }
        for c in chats
    ]

@router.patch("/chat/{chat_id}/pin")
def pin_chat(chat_id: str, session: Session = Depends(get_session)):
    chat = session.get(Chat, chat_id)

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    chat.pinned = not chat.pinned

    session.add(chat)
    session.commit()
    session.refresh(chat)

    return chat