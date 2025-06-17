import json
import logging
import pytest
from sanic import response
from core.account import CoreAccount
from util.database import create_db_engine

@pytest.mark.asyncio
async def test_error_create_account(app, account):
    post_json = json.dumps(account)

    # create account
    request, response = await app.asgi_client.post("/account/create", data = post_json)
    resp_dict = json.loads(response.body.decode())
    assert request.method.lower() == "post"
    assert response.status == 500
