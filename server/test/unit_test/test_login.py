import json
import pytest
from sanic import response


@pytest.mark.asyncio
async def test_succ_asgi_client(app, account):
    post_json = json.dumps(account)

    request, response = await app.asgi_client.post("/login", data=post_json)
    resp_dict = json.loads(response.body.decode())

    assert 'token' in resp_dict
    assert response.status == 200

@pytest.mark.asyncio
async def test_error_asgi_client(app):
    request, response = await app.asgi_client.post("/login")

    assert request.method.lower() == "post"
    assert response.status == 400
