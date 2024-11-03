# pull official base image
FROM python:3.12-slim

RUN apt-get update && apt-get install -y nodejs npm libgl1-mesa-glx libglib2.0-0

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
RUN pip install poetry
COPY ./poetry.lock ./pyproject.toml ./
RUN poetry install --with=prod --with=dev

# copy entrypoint.sh
COPY ./docker/entrypoint.sh .
RUN sed -i 's/\r$//g' /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

# copy project
COPY . .

RUN poetry run python manage.py tailwind install
RUN poetry run python manage.py tailwind build

EXPOSE 8000

# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
