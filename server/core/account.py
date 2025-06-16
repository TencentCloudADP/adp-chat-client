from pydantic import BaseModel
from typing import Any, Optional, cast

from core.error.account import (
    AccountNotFoundError,
    AccountPasswordError,
)
from model.account import Account

class AccountToken(BaseModel):
    access_token: str
    refresh_token: str

class CoreAccount:
    @staticmethod
    def authenticate(email: str, password: str) -> Account:
        pass

    @staticmethod
    def login(account: Account, *, ip_address: Optional[str] = None) -> AccountToken:
        pass
