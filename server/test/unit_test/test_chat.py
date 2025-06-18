import json
import pytest
from sanic import response


@pytest.mark.asyncio
async def test_error_asgi_client(app, auth_token):
    headers = {
        "Authorization": f"Bearer {auth_token}",
    }

    # check conversation list
    request, response = await app.asgi_client.get("/chat/conversation", headers=headers)
    assert request.method.lower() == "get"
    assert response.status == 200
    resp_dict = json.loads(response.body.decode())
    assert isinstance(resp_dict, list)
    assert len(resp_dict) == 0

    # make a conversation
    params = {
        "query": "hello",
    }
    post_json = json.dumps(params)
    request, response = await app.asgi_client.post("/chat/message", headers=headers, data=post_json)
    assert request.method.lower() == "post"
    assert response.status == 200

    # check conversation list
    request, response = await app.asgi_client.get("/chat/conversation", headers=headers)
    assert request.method.lower() == "get"
    assert response.status == 200
    resp_dict = json.loads(response.body.decode())
    assert isinstance(resp_dict, list)
    assert len(resp_dict) == 1
