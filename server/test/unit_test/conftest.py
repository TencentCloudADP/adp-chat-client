import hmac
import hashlib
import time
from urllib.parse import quote

import pytest
import pytest_asyncio

from config import tagentic_config
from app_factory import create_app


@pytest.fixture(scope="session")
def app():
    app = create_app()
    return app


@pytest.fixture(scope="session")
def account():
    _account = {
    }
    return _account


@pytest_asyncio.fixture(scope="session")
async def auth_token(app, account):
    customer_id = "123456"
    name = "test"
    extra_info = '{"Level":1}'
    timestamp = int(time.time())
    msg = f'{customer_id}{name}{extra_info}{timestamp}'
    sign = hmac.new(
        tagentic_config.CUSTOMER_ACCOUNT_SECRET_KEY.encode("utf-8"), msg.encode("utf-8"), hashlib.sha256
    ).hexdigest()
    # create account
    request, response = await app.asgi_client.get(
        (
            f"/account/customer?CustomerId={quote(customer_id)}&Name={quote(name)}&"
            f"Timestamp={str(timestamp)}&ExtraInfo={quote(extra_info)}&Code={quote(sign)}"
        )
    )
    print(response.cookies)
    assert request.method.lower() == "get"
    assert 'token' in response.cookies
    assert response.status == 302

    return response.cookies['token']
