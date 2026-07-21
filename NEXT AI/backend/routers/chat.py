import re

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlmodel import Session

from database import get_session
from repositories.chat_repository import ChatRepository
from schemas import ChatRequest
from services.ai_service import create_stream
from services.web_search import search_web
from services.web_reader import read_webpage

router = APIRouter(tags=["Chat"])


@router.post("/chat")
async def chat(
    req: ChatRequest,
    session: Session = Depends(get_session),
):
    try:

        # Create chat if it doesn't exist
        ChatRepository.create_chat(
            session=session,
            chat_id=req.chat_id,
        )

        # Save latest user message
        if req.messages:
            last = req.messages[-1]

            ChatRepository.add_message(
                session=session,
                chat_id=req.chat_id,
                role=last.role,
                content=last.content,
            )

        # Load complete history
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
        # Website Reader
        # ===========================

        if history:

            latest = history[-1]["content"]

            urls = re.findall(
                r"https?://\S+",
                latest,
            )

            if urls:

                try:

                    webpage = read_webpage(urls[0])

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

        # Ask AI
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

            # Save AI reply
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