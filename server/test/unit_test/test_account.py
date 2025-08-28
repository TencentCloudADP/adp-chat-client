import json
import pytest


@pytest.mark.asyncio
async def test_error_create_account(app, account):
    post_json = json.dumps(account)

    # create account
    request, response = await app.asgi_client.post("/account/create", data = post_json)
    assert request.method.lower() == "post"
    assert response.status == 404
