import logging
from functools import wraps

from sanic.request.types import Request

from util.helper import get_remote_ip, get_path_base
from util.auth_cookie import add_auth_token_cookie
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
    need_register = False
    try:
        check_login(request)
        # token 可解析，但需验证 account 是否仍存在于数据库中
        existing = await CoreAccount.get(request.ctx.db, request.ctx.account_id)
        if existing is None:
            need_register = True
    except:  # pylint: disable=bare-except
        need_register = True

    if need_register:
        account = await CoreAccount.register(
            request.ctx.db,
            name='User',
        )
        token = await CoreAccount.login(request.ctx.db, account, get_remote_ip(request))

        def on_response(resp):
            logging.info(
                '[auto_login] new account registed {}'.format(account.Id)
            )
            add_auth_token_cookie(
                resp,
                config=request.app.config,
                token=token,
                path=get_path_base(),
                max_age=315360000,
            )
            return resp
        setup_account_info(request, token)
        return on_response
    return None
