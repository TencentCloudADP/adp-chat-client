from functools import wraps
from sanic.request.types import Request
import logging

from util.helper import get_remote_ip, get_path_base
from core.error.account import AccountUnauthorized
from core.session import SessionToken
from core.account import CoreAccount


def setup_account_info(request, token):
    token = SessionToken.check(token)
    request.ctx.account_id = token['AccountId']


def check_login(request):
    auth = request.headers.get("Authorization")
    if auth is None:
        auth = request.cookies.get('token', None)
    if auth is None:
        raise AccountUnauthorized()

    auth_token = auth.split(' ')[-1]
    setup_account_info(request, auth_token)


def login_required(view):
    @wraps(view)
    async def decorated(*args, **kwargs):
        _, request = args

        check_login(request)

        return await view(*args, **kwargs)

    return decorated


async def auto_login(request: Request):
    try:
        check_login(request)
    except:  # pylint: disable=bare-except
        account = await CoreAccount.register(
            request.ctx.db,
            name='User',
        )
        token = await CoreAccount.login(request.ctx.db, account, get_remote_ip(request))

        def on_response(resp):
            logging.info(
                '[auto_login] new account registed {}'.format(account.Id)
            )
            resp.add_cookie(
                "token",
                token,
                path=get_path_base(),
                max_age=315360000,
                secure=False,
            )
            return resp
        setup_account_info(request, token)
        return on_response
    return None
