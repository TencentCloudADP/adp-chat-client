import json
import pytest
from sanic import response


@pytest.mark.asyncio
async def test_error_asgi_client(app):
    request, response = await app.asgi_client.post("/login")

    assert request.method.lower() == "post"
    assert response.status == 400
