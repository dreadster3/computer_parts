#!/bin/sh

poetry run python manage.py migrate

poetry run gunicorn config.wsgi --bind 0.0.0.0:8000
