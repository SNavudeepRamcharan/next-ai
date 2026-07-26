from sqlmodel import Session, select

from database import engine
from models import Chat, Message

with Session(engine) as session:
    chats = session.exec(select(Chat)).all()
    messages = session.exec(select(Message)).all()

    print("\n========== CHATS ==========")
    print(chats)

    print("\n========== MESSAGES ==========")
    print(messages)