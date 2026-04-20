from typing import Optional
from core.error import BaseError


class AccountAuthenticationError(BaseError):
    def __init__(self, description: Optional[str] = None):
        super().__init__(description)
        self.status_code = 403


class AccountUnauthorized(BaseError):
    def __init__(self, description: Optional[str] = None):
        super().__init__(description)
        self.status_code = 401


class CustomerAccountSign(BaseError):
    def __init__(self, description: Optional[str] = None):
        super().__init__(description)
        self.status_code = 403
