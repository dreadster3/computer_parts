FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y nodejs npm libgl1-mesa-glx libglib2.0-0

RUN pip install --upgrade pip
RUN pip install poetry

COPY ./pyproject.toml ./poetry.lock ./README.md ./

RUN poetry install

COPY . .

EXPOSE 8000

CMD ["poetry", "run", "fastapi", "run", "src/main.py", "--port", "8000"]
