from fastapi import APIRouter, UploadFile, File, HTTPException
from services.image_service import generate_image
from schemas import ImageRequest

import os
import shutil
import uuid
import traceback

router = APIRouter(
    prefix="/file",
    tags=["Files"],
)

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

latest_image = None
latest_pdf = None


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    global latest_image
    global latest_pdf

    ext = file.filename.split(".")[-1].lower()

    filename = f"{uuid.uuid4()}.{ext}"

    file_path = os.path.join(
        UPLOAD_FOLDER,
        filename,
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    if ext in ["png", "jpg", "jpeg", "webp"]:
        latest_image = file_path

    elif ext == "pdf":
        latest_pdf = file_path

    return {
        "filename": filename,
        "path": file_path,
        "type": ext,
    }


@router.get("/latest")
def latest():
    return {
        "image": latest_image,
        "pdf": latest_pdf,
    }


@router.post("/generate")
async def generate(request: ImageRequest):
    try:
        return generate_image(request.prompt)

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )