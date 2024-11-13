import requests
import hashlib
import os
import shutil
from fastapi import FastAPI, UploadFile
from pydantic import BaseModel, FilePath, HttpUrl
from fastapi.staticfiles import StaticFiles
import tempfile
from pathlib import Path

from src.settings import settings


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")


class UrlDetectionRequest(BaseModel):
    url: HttpUrl


class UrlDetectionResponse(BaseModel):
    path: FilePath
    confidence: float
    label: str


@app.post("/api/v1/detect/url")
async def detect_url(request: UrlDetectionRequest):
    extension = request.url.path.split(".")[1] if request.url.path else ""
    response = requests.get(str(request.url), stream=True)
    hashobj = hashlib.sha256()
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        current_file_path = temp_file.name
        chunk_size = 1024 * 1024
        for chunk in response.iter_content(chunk_size):
            hashobj.update(chunk)
            _ = temp_file.write(chunk)

        file_hash = hashobj.hexdigest()
        final_file_path = "{}.{}".format(
            os.path.join(settings._raw_images_folder, file_hash), extension
        )

    shutil.move(current_file_path, final_file_path)

    model = settings.load_model()

    results = model.predict(
        final_file_path, imgsz=640, conf=settings.confidence_threshold
    )
    assert len(results) == 1
    result = results[0]

    if result.boxes:
        for box in result.boxes:
            return box.conf.item()

    return request


@app.post("/api/v1/detect/image")
async def detect_image(image: UploadFile):
    extension = image.filename.split(".")[-1] if image.filename else ""
    hashobj = hashlib.sha256()
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        current_file_path = temp_file.name
        chunk_size = 1024 * 1024
        while chunk := await image.read(chunk_size):
            hashobj.update(chunk)
            _ = temp_file.write(chunk)

        file_hash = hashobj.hexdigest()
        filename = "{}.{}".format(file_hash, extension)
        final_file_path = os.path.join(settings._raw_images_folder, filename)

    shutil.move(current_file_path, final_file_path)

    model = settings.load_model()

    results = model.predict(
        final_file_path,
        imgsz=640,
        conf=settings.confidence_threshold,
    )
    assert len(results) > 0
    result = results[0]

    processed_image_file_path = os.path.join(
        settings._processed_images_folder, filename
    )
    _ = result.save(processed_image_file_path)
    confidence: float = 0
    label: str = ""
    if result.boxes:
        for box in result.boxes:
            confidence = box.conf.item()
            label = result.names[int(box.cls)]

    return UrlDetectionResponse(
        path=Path(processed_image_file_path), confidence=confidence, label=label
    )
