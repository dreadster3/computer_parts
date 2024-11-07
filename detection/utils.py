import io
import cv2
import numpy
import hashlib
import logging

from PIL import Image
from django.conf import settings
from django.db.models.fields.files import ImageFieldFile
from django.core.files.base import File
from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile
from ultralytics import YOLO
from ultralytics.engine.results import Results


def hash_image(image: ImageFieldFile) -> str:
    hasher = hashlib.md5()
    for chunk in image.chunks():
        hasher.update(chunk)
    return hasher.hexdigest()


def process_image(extension: str, image: File | InMemoryUploadedFile | TemporaryUploadedFile) -> Results:
    if not extension.startswith("."):
        extension = f".{extension}"

    logger = logging.getLogger(__name__)
    logger.info(f"Processing image with model {settings.YOLO_MODEL_NAME}")

    model: YOLO = settings.YOLO_MODEL

    if isinstance(image, InMemoryUploadedFile):
        buffer = io.BytesIO()
        for chunk in image.chunks():
            buffer.write(chunk)

        image_file = Image.open(buffer)

    elif isinstance(image, TemporaryUploadedFile):
        image_file = Image.open(image.temporary_file_path())

    elif isinstance(image, File):
        image_file = Image.open(image)

    results = model.predict(
        image_file, imgsz=640, conf=float(settings.YOLO_CONFIDENCE_THRESHOLD)

    if not results:
        raise ValueError("No objects detected")

    result=results[0]

    return result


def plot_image(result: Results) -> Image.Image:
    logger=logging.getLogger(__name__)
    logger.info("Plotting image")

    processed_image: numpy.ndarray=result.plot()
    ok, buf=cv2.imencode(".png", processed_image)
    if not ok:
        raise ValueError("Error encoding image")
    return Image.fromarray(buf)
