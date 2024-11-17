from typing import Annotated
import requests
import hashlib
import os
import shutil
from fastapi import FastAPI, Form, UploadFile
from pydantic import BaseModel, FilePath, HttpUrl
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import tempfile
from pathlib import Path

from src.settings import settings


app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(settings._raw_images_folder, exist_ok=True)
os.makedirs(settings._processed_images_folder, exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")


class UrlDetectionRequest(BaseModel):
    url: HttpUrl
    confidence_threshold: float


class DetectionResult(BaseModel):
    confidence: float
    label: str
    image: Path


class UrlDetectionResponse(BaseModel):
    original_image: FilePath
    processed_image: FilePath
    results: list[DetectionResult]


def process_image_file(
    file_path: str, confidence_threshold: float
) -> UrlDetectionResponse:
    model = settings.load_model()
    filename = os.path.basename(file_path)

    results = model.predict(
        file_path,
        imgsz=640,
        conf=confidence_threshold,
    )
    assert len(results) > 0
    result = results[0]

    hash = filename.split(".")[0]
    extension = filename.split(".")[-1]
    processed_folder = os.path.join(settings._processed_images_folder, hash)
    os.makedirs(processed_folder, exist_ok=True)
    processed_image_file_path = os.path.join(processed_folder, filename)
    processed_crops_folder = os.path.join(processed_folder, "crops")
    shutil.rmtree(processed_crops_folder, ignore_errors=True)
    _ = result.save(processed_image_file_path)
    _ = result.save_crop(processed_crops_folder, Path(filename))

    detection_results: list[DetectionResult] = []
    label_idx: dict[str, int] = {}
    if result.boxes:
        for box in result.boxes:
            confidence: float = box.conf.item()
            label: str = result.names[int(box.cls)]
            idx = label_idx.get(label, 1)
            identifier = str(idx) if idx > 1 else ""
            image = os.path.join(
                processed_crops_folder,
                label,
                f"{hash}.{extension}{identifier}.{extension}",
            )
            label_idx[label] = label_idx.get(label, 1) + 1

            detection_results.append(
                DetectionResult(confidence=confidence, label=label, image=image)
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
    return process_image_file(final_file_path, request.confidence_threshold)


@app.post("/api/v1/detect/image")
async def detect_image(
    image: UploadFile, confidence_threshold: Annotated[float, Form()]
):
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
    return process_image_file(final_file_path, confidence_threshold)
