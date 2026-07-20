from datetime import datetime

from sqlmodel import Session, select

from models import Chat, Message


class ChatRepository:

    @staticmethod
    def create_chat(session: Session, chat_id: str, title: str = "New Chat"):

        chat = session.get(Chat, chat_id)

        if chat:
            return chat

        now = datetime.now().isoformat()

        chat = Chat(
            id=chat_id,
            title=title,
            created_at=now,
            updated_at=now,
        )

        session.add(chat)
        session.commit()
        session.refresh(chat)

        return chat

    @staticmethod
    def add_message(
        session: Session,
        chat_id: str,
        role: str,
        content: str,
    ):

        message = Message(
            chat_id=chat_id,
            role=role,
            content=content,
            created_at=datetime.now().isoformat(),
        )

        session.add(message)

        chat = session.get(Chat, chat_id)

        if chat:
            chat.updated_at = datetime.now().isoformat()
            session.add(chat)

        session.commit()

    @staticmethod
    def get_messages(
        session: Session,
        chat_id: str,
    ):

        return session.exec(
            select(Message).where(
                Message.chat_id == chat_id
            )
        ).all()

    @staticmethod
    def get_chats(session: Session):

        return session.exec(
            select(Chat).order_by(
                Chat.updated_at.desc()
            )
        ).all()

    @staticmethod
    def delete_chat(
        session: Session,
        chat_id: str,
    ):

        chat = session.get(Chat, chat_id)

        if not chat:
            return

        messages = session.exec(
            select(Message).where(
                Message.chat_id == chat_id
            )
        ).all()

        for msg in messages:
            session.delete(msg)

        session.delete(chat)

        session.commit()