from functools import wraps
from sanic.request.types import Request
from sanic.response import HTTPResponse

from util.helper import get_remote_ip, get_path_base
from core.error.account import AccountUnauthorized
from core.session import SessionToken
from core.account import CoreAccount


def check_login(request):
    auth = request.headers.get("Authorization")
    if auth is None:
        auth = request.cookies.get('token', None)
    if auth is None:
        raise AccountUnauthorized()

    auth_token = auth.split(' ')[-1]
    token = SessionToken.check(auth_token)
    request.ctx.account_id = token['AccountId']


def login_required(view):
    @wraps(view)
    async def decorated(*args, **kwargs):
        _, request = args

        check_login(request)

        return await view(*args, **kwargs)

    return decorated


async def auto_login(request: Request, response: HTTPResponse):
    try:
        check_login(request)
    except:  # pylint: disable=bare-except
        account = await CoreAccount.register(
            request.ctx.db,
            name='User',
        )
        token = await CoreAccount.login(request.ctx.db, account, get_remote_ip(request))
        response.add_cookie(
            "token",
            token,
            path=get_path_base(),
            max_age=315360000,
            secure=False,
        )
    return response
