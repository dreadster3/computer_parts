import cv2
import numpy

from PIL import Image
from django.conf import settings
from django.core import serializers
from django.core.files.base import ContentFile
from django.urls import path
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.views.decorators.http import require_http_methods
from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile
from ultralytics import YOLO

from .models import ImageUploadForm, Detection
from .utils import hash_image

# Create your views here.


@require_http_methods(["POST"])
def detect_objects(request: HttpRequest):
    form = ImageUploadForm(request.POST, request.FILES)

    if not form.is_valid():
        return JsonResponse({"status": "error", "message": form.errors})

    hash = hash_image(form.cleaned_data["image"])
    detection = Detection.objects.filter(hash=hash).first()
    if detection is None:
        extension: str = form.cleaned_data["image"].name.split(".")[-1]
        processed_image = process_image(extension, form.cleaned_data["image"])

        form.instance.processed_image.save(
            f"{hash}.{extension}", ContentFile(processed_image.tobytes(), f"{processed_image}.{extension}"), save=False)
        detection = form.save()

    html = f'''
    <img id="original_image" src="{detection.image.url}" alt="Original Image" />
    <img id="processed_image" src="{detection.processed_image.url}" alt="Processed Image" />
    '''

    return JsonResponse({"status": "ok", "original_image": detection.image.url, "processed_image": detection.processed_image.url, html: html})


urlpatterns = [
    path("detection", detect_objects, name="api_detect_objects")


]
