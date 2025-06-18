from datetime import UTC, datetime, timedelta
import logging
from pydantic import BaseModel
from typing import Any, Optional, cast
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import secrets
import binascii

from config import tagentic_config
from core.error.account import (
    AccountAuthenticationError,
    AccountUnauthorized,
)
from core.session import SessionToken
from model.account import Account
from util.password import hash, compare

class CoreAccount:
    @staticmethod
    async def find(db: AsyncSession, email: Optional[str]) -> Account:
        account = (await db.execute(select(Account).where(Account.email==email).limit(1))).scalar()
        return account

    @staticmethod
    async def authenticate(db: AsyncSession, email: str, password: str) -> Account:
        account = await CoreAccount.find(db, email=email)
        if not account:
            raise AccountAuthenticationError()

        if account.password is None or not compare(password, account.password, account.password_salt):
            raise AccountAuthenticationError()

        return account

    @staticmethod
    async def login(db: AsyncSession, account: Account, ip_address: Optional[str] = None) -> str:
        access_token = CoreAccount.create_jwt_token(account=account)

        # update last login info
        account.last_login_at = datetime.now(UTC).replace(tzinfo=None)
        account.last_login_ip = ip_address
        db.add(account)
        await db.commit()

        return access_token

    @staticmethod
    async def create_account(
        db: AsyncSession,
        email: str,
        password: Optional[str] = None,
    ) -> Account:
        """create account"""
        account = Account()
        account.email = email
        account.name = email.split("@")[0]

        if password:
            # generate salt
            salt = secrets.token_bytes(32)
            hex_salt = binascii.hexlify(salt).decode()

            # encrypt password with salt
            password_hashed = hash(password, hex_salt)

            account.password = password_hashed
            account.password_salt = hex_salt

        db.add(account)
        await db.commit()

        account.password = None
        account.password_salt = None

        return account

    @staticmethod
    async def remove_account(
        db: AsyncSession,
        account: Account,
    ) -> Account:
        """remove account"""
        await db.delete(account)
        await db.commit()

    @staticmethod
    def create_jwt_token(account: Account) -> str:
        exp_dt = datetime.now(UTC) + timedelta(hours=tagentic_config.ACCESS_TOKEN_EXPIRE_HOURS)
        exp = int(exp_dt.timestamp())

        payload = {
            "account_id": str(account.id),
            "token_source": "login_token",
            "exp": exp,
        }

        token: str = SessionToken.create(payload)
        return token

