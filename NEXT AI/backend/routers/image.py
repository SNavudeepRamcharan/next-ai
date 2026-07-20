from fastapi import APIRouter, UploadFile, File
import os
import shutil

router = APIRouter(prefix="/image", tags=["Image"])

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Stores the latest uploaded image path
latest_image = None


@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    global latest_image

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    latest_image = file_path

    return {
        "filename": file.filename,
        "path": file_path,
    }


@router.get("/latest")
def get_latest_image():
    return {
        "image": latest_image
    }