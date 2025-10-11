FROM python:3.12-slim

WORKDIR /app

COPY docker/server .

ENV PIP_INDEX_URL=https://mirrors.tencent.com/pypi/simple/
ENV UV_DEFAULT_INDEX=$PIP_INDEX_URL

RUN pip install --no-cache-dir uv==0.9.2

ENV UV_PROJECT_ENVIRONMENT="/usr/local/"

RUN uv sync

CMD ["bash", "-c", "sanic main:create_app --factory -H 0.0.0.0 -p 8000"]
