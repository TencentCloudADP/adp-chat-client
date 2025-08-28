from core.error import BaseError


class AccountAuthenticationError(BaseError):
    pass


class AccountUnauthorized(BaseError):
    pass


class CustomerAccountSign(BaseError):
    pass
