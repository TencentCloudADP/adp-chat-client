from datetime import UTC, datetime, timedelta
import logging
from pydantic import BaseModel
from typing import Any, Optional, cast
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import secrets
import binascii
import hmac
import hashlib
import time

from config import tagentic_config
from core.error.account import (
    AccountAuthenticationError,
    AccountUnauthorized,
    CustomerAccountSign,
)
from core.session import SessionToken
from model.account import Account, AccountThirdParty, AccountRole
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
    async def find_admins(db: AsyncSession) -> list[Account]:
        accounts = (await db.execute(
            select(Account)
                .where(Account.role == AccountRole.ADMIN)
        )).scalars().all()
        return accounts

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
            await CoreAccount.link_or_update_account(db, account, provider, open_id, token)

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
        if name is None and email is not None:
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
        account: Account,
        provider: str,
        open_id: str,
        token: str = None
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


    @staticmethod
    async def customer_auth(db: AsyncSession, customer_id: Optional[str], name: Optional[str], timestamp: Optional[int], code: Optional[str]) -> None:
        provider = 'customer'

        # 注意：需要对传入信息进行验证！避免被恶意批量注册
        # 验证可以采取以下任意方法：
        # 1. 离线验证，通过传入的code进行签名，通过加密算法确保只有拥有SECRET_KEY的服务器可以生成该签名
        # 2. 在线验证，通过传入的code，发起与客户账户系统后端服务器进行交互，确保该code由可信的服务生成
        
        # 离线验证
        # SHA256(HMAC(CUSTOMER_ACCOUNT_SECRET_KEY, customer_id + name + str(timestamp)))
        msg = f'{customer_id}{name}{timestamp}'
        ts  = int(time.time())
        if abs(timestamp - ts) > 60:
            err_msg = f'timestamp diff too much (abs({timestamp} - {ts}) = {abs(timestamp - ts)}) > 60'
            logging.error(f'[customer_auth] {err_msg}')
            raise CustomerAccountSign(err_msg)
        sign = hmac.new(tagentic_config.CUSTOMER_ACCOUNT_SECRET_KEY.encode("utf-8"), msg.encode("utf-8"), hashlib.sha256).hexdigest()
        if sign != code:
            err_msg = f'sign mismatch'
            logging.error(f'[customer_auth] {err_msg} ({sign} != {code})')
            raise CustomerAccountSign(err_msg)
        
        # 在线验证
        # 参考core/oauth.py: CoreOAuth.callback()

        account = await CoreAccount.find(db, provider=provider, open_id=customer_id)
        if account is None:
            if name is None:
                name = f'{provider}_{customer_id}'
            account = await CoreAccount.register(db, provider=provider, open_id=customer_id, name=name)
        else:
            await CoreAccount.link_or_update_account(db, account, provider=provider, open_id=customer_id)
        
        return account
