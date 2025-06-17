import json
import logging
import pytest
import pytest_asyncio
from sanic import response
from core.account import CoreAccount
from util.database import create_db_engine
from app_factory import create_app

@pytest.fixture(scope="session")
def app():
    app = create_app()
    return app

@pytest.fixture(scope="session")
def account():
    _account = {
        "email": "foo@bar.com",
        "password": "123456"
    }
    return _account

@pytest_asyncio.fixture(scope="session")
async def auth_token(app, account):
    post_json = json.dumps(account)

    # clean up the account first
    _, sessionmaker = create_db_engine(app)
    db = sessionmaker()
    try:
        _account = await CoreAccount.find(db, email=account["email"])
        if _account:
            await CoreAccount.remove_account(db, _account)
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
    assert resp_dict['email'] == account['email']
    assert response.status == 200

    # login
    request, response = await app.asgi_client.post("/login", data = post_json)
    resp_dict = json.loads(response.body.decode())
    assert request.method.lower() == "post"
    assert 'token' in resp_dict
    assert response.status == 200
    
    return resp_dict['token']
