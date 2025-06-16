import json
import logging
import pytest
from sanic import response
from core.account import CoreAccount
from util.database import create_db_engine

@pytest.mark.asyncio
async def test_create_account(app):
    data = {
        "email": "foo",
        "password": "123456"
    }
    post_json = json.dumps(data)

    _, sessionmaker = create_db_engine(app)
    db = sessionmaker()
    try:
        account = await CoreAccount.find(db, email=data["email"])
        if account:
            await CoreAccount.remove_account(db, account)
    except Exception as e:
        pass
    await db.close()

    request, response = await app.asgi_client.post("/account/create", data = post_json)
    print(f"/account/create: {response.body}")
    assert request.method.lower() == "post"
    assert response.body == post_json.encode()
    assert response.status == 200

    request, response = await app.asgi_client.post("/login", data = post_json)
    assert request.method.lower() == "post"
    assert 'token' in json.loads(response.body.decode())
    assert response.status == 200
