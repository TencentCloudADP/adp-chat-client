from functools import wraps
from core.error.account import AccountUnauthorized
from core.session import SessionToken

def login_required(view):
    @wraps(view)
    async def decorated(*args, **kwargs):
        _, request = args

        auth = request.headers.get("Authorization")
        if auth is None:
            raise AccountUnauthorized()

        auth_token = auth.split(' ')[-1]
        print(f'auth_token: {auth_token}')
        token = SessionToken.check(auth_token)
        print(f'auth_token: {token}')

        return await view(*args, **kwargs)

    return decorated

