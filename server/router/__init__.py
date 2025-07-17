from functools import wraps
from core.error.account import AccountUnauthorized
from core.session import SessionToken

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

