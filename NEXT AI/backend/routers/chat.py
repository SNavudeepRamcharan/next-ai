import re

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlmodel import Session

from database import get_session
from repositories.chat_repository import ChatRepository
from repositories.memory_repository import MemoryRepository
from schemas import ChatRequest

from services.ai_service import create_stream
from services.memory_service import extract_memory
from services.web_search import search_web
from services.web_reader import read_webpage
from services.youtube_reader import read_youtube

router = APIRouter(tags=["Chat"])


@router.post("/chat")
async def chat(
    req: ChatRequest,
    session: Session = Depends(get_session),
):
    try:

        # ===========================
        # Create Chat
        # ===========================

        ChatRepository.create_chat(
            session=session,
            chat_id=req.chat_id,
        )

        # ===========================
        # Save User Message
        # ===========================

        if req.messages:

            last = req.messages[-1]

            ChatRepository.add_message(
                session=session,
                chat_id=req.chat_id,
                role=last.role,
                content=last.content,
            )

            # ===========================
            # Extract Memory
            # ===========================

            memory = extract_memory(last.content)

            if memory:

                MemoryRepository.add_memory(
                    session=session,
                    text=memory,
                )

        # ===========================
        # Load Chat History
        # ===========================

        db_messages = ChatRepository.get_messages(
            session=session,
            chat_id=req.chat_id,
        )

        history = []

        for msg in db_messages:

            history.append(
                {
                    "role": msg.role,
                    "content": msg.content,
                }
            )

        # ===========================
        # Load User Memory
        # ===========================

        memories = MemoryRepository.get_memories(session)

        if memories:

            memory_text = "User Memory:\n\n"

            for m in memories:

                memory_text += f"- {m.memory}\n"

            history.insert(
                0,
                {
                    "role": "system",
                    "content": memory_text,
                },
            )

        # ===========================
        # Website / YouTube Reader
        # ===========================

        if history:

            latest = history[-1]["content"]

            urls = re.findall(
                r"https?://\S+",
                latest,
            )

            if urls:

                url = urls[0]

                try:

                    if (
                        "youtube.com" in url
                        or "youtu.be" in url
                    ):

                        transcript = read_youtube(url)

                        if transcript:

                            history.insert(
                                0,
                                {
                                    "role": "system",
                                    "content":
                                    "The following is the transcript of a YouTube video.\n\n"
                                    + transcript,
                                },
                            )

                    else:

                        webpage = read_webpage(url)

                        if webpage:

                            history.insert(
                                0,
                                {
                                    "role": "system",
                                    "content":
                                    "The following text was extracted from a webpage.\n\n"
                                    + webpage,
                                },
                            )

                except Exception:
                    pass

        # ===========================
        # Web Search
        # ===========================

        if req.web_search:

            results = search_web(
                history[-1]["content"]
            )

            context = (
                "The following are live web search results.\n"
                "Use them to answer accurately.\n\n"
            )

            for r in results:

                context += (
                    f"Title: {r['title']}\n"
                    f"Snippet: {r['body']}\n"
                    f"URL: {r['url']}\n\n"
                )

            history.insert(
                0,
                {
                    "role": "system",
                    "content": context,
                },
            )

        # ===========================
        # Ask AI
        # ===========================

        stream = await create_stream(
            model=req.model,
            messages=history,
            image_path=req.image,
            web_search=req.web_search,
        )

        async def generate():

            full_reply = ""

            async for chunk in stream:

                if (
                    chunk.choices
                    and len(chunk.choices) > 0
                    and chunk.choices[0].delta
                ):

                    content = chunk.choices[0].delta.content

                    if content:

                        full_reply += content
                        yield content

            ChatRepository.add_message(
                session=session,
                chat_id=req.chat_id,
                role="assistant",
                content=full_reply,
            )

        return StreamingResponse(
            generate(),
            media_type="text/plain",
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )