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
os.makedirs(settings._raw_images_folder, exist_ok=True)
os.makedirs(settings._processed_images_folder, exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")


class UrlDetectionRequest(BaseModel):
    url: HttpUrl


class DetectionResult(BaseModel):
    confidence: float
    label: str


class UrlDetectionResponse(BaseModel):
    original_image: FilePath
    processed_image: FilePath
    results: list[DetectionResult]


def process_image_file(file_path: str) -> UrlDetectionResponse:
    model = settings.load_model()
    filename = os.path.basename(file_path)

    results = model.predict(
        file_path,
        imgsz=640,
        conf=settings.confidence_threshold,
    )
    assert len(results) > 0
    result = results[0]

    processed_image_file_path = os.path.join(
        settings._processed_images_folder, filename
    )
    _ = result.save(processed_image_file_path)

    detection_results: list[DetectionResult] = []
    if result.boxes:
        for box in result.boxes:
            confidence = box.conf.item()
            label = result.names[int(box.cls)]
            detection_results.append(
                DetectionResult(confidence=confidence, label=label)
            )

    return UrlDetectionResponse(
        original_image=Path(file_path),
        processed_image=Path(processed_image_file_path),
        results=detection_results,
    )


@app.post("/api/v1/detect/url")
async def detect_url(request: UrlDetectionRequest):
    extension = request.url.path.split(".")[-1] if request.url.path else ""
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
    return process_image_file(final_file_path)


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
    return process_image_file(final_file_path)
