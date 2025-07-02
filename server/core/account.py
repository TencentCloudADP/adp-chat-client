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
from model.account import Account, AccountThirdParty
from util.password import hash, compare

class CoreAccount:
    @staticmethod
    async def find(db: AsyncSession, email: Optional[str] = None, provider: Optional[str] = None, open_id: Optional[str] = None) -> Account:
        account_third_party = (await db.execute(
            select(AccountThirdParty)
                .where(AccountThirdParty.provider == provider, AccountThirdParty.open_id == open_id)
                .limit(1)
            )
        ).scalar()
        account = None

        if account_third_party:
            account = (await db.execute(
                select(Account)
                    .where(Account.id==account_third_party.account_id)
                    .limit(1)
                )
            ).scalar()
            return account

        if email is not None:
            account = (await db.execute(
                select(Account)
                    .where(Account.email==email)
                    .limit(1)
                )
            ).scalar()
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
    async def register(
        db: AsyncSession,
        name: Optional[str] = None,
        email: Optional[str] = None,
        password: Optional[str] = None,
        provider: Optional[str] = None,
        open_id: Optional[str] = None,
        token: Optional[str] = None,
    ) -> str:
        account = await CoreAccount.create_account(db, name, email, password)
        if provider is not None and open_id is not None:
            await CoreAccount.link_or_update_account(db, provider, open_id, token, account)

        await db.commit()

        return account

    @staticmethod
    async def create_account(
        db: AsyncSession,
        name: Optional[str] = None,
        email: Optional[str] = None,
        password: Optional[str] = None,
    ) -> Account:
        """create account"""
        account = Account()
        account.email = email
        if name is None:
            name = email.split("@")[0]
        account.name = name

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

    @staticmethod
    async def link_or_update_account(
        db: AsyncSession,
        provider: str,
        open_id: str,
        token: str,
        account: Account
    ) -> None:
        """link account with oauth provider"""

        account_third_party = (await db.execute(
            select(AccountThirdParty)
                .where(AccountThirdParty.provider == provider, AccountThirdParty.open_id == open_id)
                .limit(1)
            )
        ).scalar()

        if account_third_party is None:
            account_third_party = AccountThirdParty(
                account_id=account.id, provider=provider, open_id=open_id, token=token
            )
            db.add(account_third_party)
        
        account_third_party.token = token
        account.updated_at = datetime.now(UTC).replace(tzinfo=None)

        await db.commit()

