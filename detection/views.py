from typing import Any, Dict
from django.conf import settings
from django.core.files.base import ContentFile
from django.shortcuts import render
from django.http import HttpRequest, HttpResponse
from render_block import render_block_to_string

from detection.models import Detection, ImageUploadForm
from detection.utils import hash_image, process_image

# Create your views here.


def index(request: HttpRequest):
    template = "upload.html"
    static_image = settings.STATIC_URL + "images/placeholder.png"

    context: Dict[str, Any] = {
        "original_image": {
            "url": static_image,
            "title": "Original Image",
            "id": "original_image"
        },
        "processed_image": {
            "url": static_image,
            "title": "Processed Image",
            "id": "processed_image"
        },
    }

    if request.method == "POST":
        form = ImageUploadForm(request.POST, request.FILES)

        if not form.is_valid():
            context = {
                "errors": form.errors,
            }
            rendered_block = render_block_to_string(
                "components/form.html", "error", context, request)
            return HttpResponse(content=rendered_block)

        hash = hash_image(form.cleaned_data["image"])
        detection = Detection.objects.filter(hash=hash).first()
        if detection is None:
            detection = form.save()
        else:
            detection.save()

        context["original_image"]["url"] = detection.image.url
        context["processed_image"]["url"] = detection.processed_image.url
        context["results"] = detection.result_set.all()

        rendered_block = render_block_to_string(
            template, "preview", context, request)
        results_block = render_block_to_string(
            "components/carousel.html", "results", context, request)

        return HttpResponse(content=rendered_block + results_block)

    form = ImageUploadForm()
    context["form"] = form
    return render(request, template, context)
