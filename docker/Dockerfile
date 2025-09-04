FROM python:3.12-slim

WORKDIR /app

COPY docker/server .

ENV PIP_INDEX_URL=https://mirrors.tencent.com/pypi/simple/

RUN pip install --no-cache-dir -r requirements.txt

CMD ["bash", "-c", "sanic main:create_app --factory -H 0.0.0.0 -p 8000"]
