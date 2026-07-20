from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from database import Chat, Message, get_session
from schemas import RenameChatRequest

router = APIRouter(
    prefix="/history",
    tags=["History"],
)


# ==========================================
# Get all chats
# ==========================================

@router.get("/chats")
def get_chats(session: Session = Depends(get_session)):
    chats = session.exec(
        select(Chat).order_by(Chat.updated_at.desc())
    ).all()

    return chats


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
        raise HTTPException(404, "Chat not found")

    chat.title = data.title
    chat.updated_at = datetime.now().isoformat()

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
        raise HTTPException(404, "Chat not found")

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