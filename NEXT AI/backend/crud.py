from sqlmodel import Session, select
from models import Chat, ChatSession


# ======================
# Chat Sessions
# ======================

def create_chat(session: Session, chat_id: str, title: str):
    chat = ChatSession(
        chat_id=chat_id,
        title=title,
    )

    session.add(chat)
    session.commit()


def get_all_chats(session: Session):
    return session.exec(select(ChatSession)).all()


def delete_chat(session: Session, chat_id: str):
    messages = session.exec(
        select(Chat).where(Chat.chat_id == chat_id)
    ).all()

    for msg in messages:
        session.delete(msg)

    chat = session.exec(
        select(ChatSession).where(ChatSession.chat_id == chat_id)
    ).first()

    if chat:
        session.delete(chat)

    session.commit()


# ======================
# Messages
# ======================

def save_message(session: Session, chat_id: str, role: str, content: str):
    message = Chat(
        chat_id=chat_id,
        role=role,
        content=content,
    )

    session.add(message)
    session.commit()


def get_messages(session: Session, chat_id: str):
    return session.exec(
        select(Chat).where(Chat.chat_id == chat_id)
    ).all()