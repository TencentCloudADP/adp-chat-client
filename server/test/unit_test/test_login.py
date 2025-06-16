import json
import pytest
from sanic import response
from app_factory import create_app


@pytest.fixture
def app():
    app = create_app()
    return app

@pytest.mark.asyncio
async def test_error_asgi_client(app):
    request, response = await app.asgi_client.post("/login")

    assert request.method.lower() == "post"
    assert response.status == 400

@pytest.mark.asyncio
async def test_basic_asgi_client(app):
    post_json = json.dumps({
        "email": "foo",
        "password": "123456"
    })
    request, response = await app.asgi_client.post("/login", data = post_json)

    assert request.method.lower() == "post"
    assert response.body == post_json.encode()
    assert response.status == 200
