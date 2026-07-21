from sqlmodel import Session, select

from models import Memory


class MemoryRepository:

    @staticmethod
    def add_memory(session: Session, text: str):

        memory = Memory(
            memory=text,
        )

        session.add(memory)
        session.commit()

    @staticmethod
    def get_memories(session: Session):

        return session.exec(
            select(Memory)
        ).all()