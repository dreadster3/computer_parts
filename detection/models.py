from __future__ import annotations
import random
import logging

from PIL.Image import Image
from django import forms
from django.conf import settings
from django.core.files.base import ContentFile
from django.db import models
from django.db.models.fields.files import ImageFieldFile

from .utils import hash_image, plot_image, process_image

# Create your models here.


def upload_path(instance: models.Model, filename: str) -> str:
    if not isinstance(instance, Detection):
        raise ValueError("Invalid instance type")

    file_extension = filename.split(".")[-1]
    hash = hash_image(instance.image)

    return f"raw/{hash}.{file_extension}"


class Detection(models.Model):
    hash = models.CharField(max_length=32, unique=True)
    image = models.ImageField(upload_to=upload_path, unique=True)
    processed_image = models.ImageField(upload_to="processed/", unique=True)

    def save(self, *args, **kwargs):
        logger = logging.getLogger(__name__)
        self.hash = hash_image(self.image)

        extension = self.image.name.split(".")[-1]
        result = process_image(extension, self.image.file)

        processed_image = plot_image(result)

        logger.info(f"Saving processed image {self.hash}.{extension}")
        self.processed_image.delete(save=True)
        self.processed_image.save(f"{self.hash}.{extension}", ContentFile(
            processed_image.tobytes(), f"{processed_image}.{extension}"), save=False)

        super().save(*args, **kwargs)

        self.result_set.all().delete()
        if result.boxes:
            for box in result.boxes:
                confidence = box.conf.item()
                label = result.names[int(box.cls)]
                model = random.choice(settings.DUMMY_MODELS[label])

                self.result_set.create(
                    confidence=confidence, label=label, model=model)


class Result(models.Model):
    confidence = models.FloatField()
    label = models.CharField(max_length=255)
    model = models.CharField(max_length=255)
    detection = models.ForeignKey(Detection, on_delete=models.CASCADE)


class ImageUploadForm(forms.ModelForm):
    class Meta:
        model = Detection
        fields = ["image"]
