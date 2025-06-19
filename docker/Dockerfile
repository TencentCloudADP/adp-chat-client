# syntax=docker.io/docker/dockerfile:1.7-labs

FROM python:3.12-slim

WORKDIR /app

COPY --exclude=**/__pycache__ --exclude=**/.env --exclude=**/.venv server .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["bash", "-c", "sanic main:create_app --factory -H 0.0.0.0 -p 8000"]
