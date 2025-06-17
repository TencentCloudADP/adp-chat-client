import json
import logging
import pytest
from sanic import response
from core.account import CoreAccount
from util.database import create_db_engine

@pytest.mark.asyncio
async def test_create_account(app):
    data = {
        "email": "foo@bar.com",
        "password": "123456"
    }
    post_json = json.dumps(data)

    # clean up the account first
    _, sessionmaker = create_db_engine(app)
    db = sessionmaker()
    try:
        account = await CoreAccount.find(db, email=data["email"])
        if account:
            await CoreAccount.remove_account(db, account)
    except Exception as e:
        pass
    await db.close()

    # create account
    request, response = await app.asgi_client.post("/account/create", data = post_json)
    resp_dict = json.loads(response.body.decode())
    print(f"/account/create: {response.body}")
    assert request.method.lower() == "post"
    assert resp_dict['id'] is not None
    assert resp_dict['password'] is None
    assert resp_dict['email'] == data['email']
    assert response.status == 200

    # login
    request, response = await app.asgi_client.post("/login", data = post_json)
    resp_dict = json.loads(response.body.decode())
    assert request.method.lower() == "post"
    assert 'token' in resp_dict
    assert response.status == 200
