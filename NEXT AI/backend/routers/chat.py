from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from schemas import ChatRequest
from conversation_manager import conversation_manager
from services.ai_service import create_stream

router = APIRouter(tags=["Chat"])


@router.post("/chat")
async def chat(req: ChatRequest):
    try:

        conversation_manager.clear_chat(req.chat_id)

        for msg in req.messages:
            conversation_manager.add_message(
                req.chat_id,
                msg.role,
                msg.content,
            )

        history = conversation_manager.get_messages(req.chat_id)

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

            conversation_manager.add_message(
                req.chat_id,
                "assistant",
                full_reply,
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