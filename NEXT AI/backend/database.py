from sqlmodel import SQLModel, Session, create_engine

from models import Chat, Message

DATABASE_URL = "sqlite:///next_ai.db"

engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False},
)


def create_db():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session