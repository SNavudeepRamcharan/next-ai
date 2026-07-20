from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import create_db

from routers.chat import router as chat_router
from routers.image import router as image_router

app = FastAPI(
    title="Next AI Backend"
)


@app.on_event("startup")
def startup():
    create_db()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(image_router)


@app.get("/")
def home():
    return {
        "message": "Next AI Backend is Running!"
    }