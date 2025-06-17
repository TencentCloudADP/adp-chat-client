import json
import pytest
from sanic import response


@pytest.mark.asyncio
async def test_error_asgi_client(app, auth_token):
    headers = {
        "Authorization": f"Bearer {auth_token}",
    }
    request, response = await app.asgi_client.get("/chat/messages", headers=headers)
    # print(response.body)

    # assert request.method.lower() == "post"
    assert response.status == 200
