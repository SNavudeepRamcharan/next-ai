from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlmodel import Session

from database import get_session
from repositories.chat_repository import ChatRepository
from schemas import ChatRequest
from services.ai_service import create_stream

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

        # Load complete history from database
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

        # Ask AI
        stream = await create_stream(
            model=req.model,
            messages=history,
            image_path=req.image,
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