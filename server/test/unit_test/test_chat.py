import json
import pytest
from sanic import response


@pytest.mark.asyncio
async def test_error_asgi_client(app, auth_token):
    headers = {
        "Authorization": f"Bearer {auth_token}",
    }

    # get application list
    request, response = await app.asgi_client.get("/application/list", headers=headers)
    assert request.method.lower() == "get"
    assert response.status == 200
    resp_dict = json.loads(response.body.decode())
    assert isinstance(resp_dict, dict)
    assert 'Applications' in resp_dict
    applications = resp_dict["Applications"]
    assert len(applications) > 0

    # check conversation list
    request, response = await app.asgi_client.get("/chat/conversations", headers=headers)
    assert request.method.lower() == "get"
    assert response.status == 200
    resp_dict = json.loads(response.body.decode())
    assert isinstance(resp_dict, list)
    n_conversations = len(resp_dict)

    # make a conversation
    params = {
        "Query": "hello",
        "ApplicationId": applications[0]["ApplicationId"],
    }
    post_json = json.dumps(params)
    request, response = await app.asgi_client.post("/chat/message", headers=headers, data=post_json)
    assert request.method.lower() == "post"
    assert response.status == 200

    # check conversation list
    request, response = await app.asgi_client.get("/chat/conversations", headers=headers)
    assert request.method.lower() == "get"
    assert response.status == 200
    resp_dict = json.loads(response.body.decode())
    assert isinstance(resp_dict, list)
    assert len(resp_dict) == n_conversations + 1
