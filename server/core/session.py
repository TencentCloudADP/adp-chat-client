from pydantic import BaseModel
from typing import Any, Optional, cast
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from config import tagentic_config
import jwt

from core.error.account import (
    AccountAuthenticationError,
    AccountUnauthorized,
)

class SessionToken:
    @staticmethod
    def create(payload):
        return jwt.encode(payload, tagentic_config.SECRET_KEY, algorithm="HS256")

    @staticmethod
    def check(token):
        try:
            return jwt.decode(token, tagentic_config.SECRET_KEY, algorithms=["HS256"])
        except jwt.exceptions.InvalidSignatureError:
            raise AccountUnauthorized("Invalid token signature.")
        except jwt.exceptions.DecodeError:
            raise AccountUnauthorized("Invalid token.")
        except jwt.exceptions.ExpiredSignatureError:
            raise AccountUnauthorized("Token has expired.")
