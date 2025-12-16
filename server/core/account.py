from datetime import UTC, datetime, timedelta
import logging
from typing import Optional
import secrets
import binascii
import hmac
import hashlib
import time

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from config import tagentic_config
from core.error.account import (
    AccountAuthenticationError,
    CustomerAccountSign,
)
from core.session import SessionToken
from model.account import Account, AccountThirdParty, AccountRole
from util.password import hash, compare


class CoreAccountProvider:
    providers = []

    @staticmethod
    def add_provider(name: str, url: str) -> None:
        CoreAccountProvider.providers.append({'name': name, 'url': url})

    @staticmethod
    def get_providers():
        return CoreAccountProvider.providers


class CoreAccount:
    @staticmethod
    async def find(
        db: AsyncSession, email: Optional[str] = None, provider: Optional[str] = None, open_id: Optional[str] = None
    ) -> Account:
        account_third_party = (
            await db.execute(
                select(AccountThirdParty)
                    .where(AccountThirdParty.Provider == provider, AccountThirdParty.OpenId == open_id)
                    .limit(1)
            )
        ).scalar()
        account = None

        if account_third_party:
            account = (
                await db.execute(
                    select(Account)
                        .where(Account.Id == account_third_party.AccountId)
                        .limit(1)
                )
            ).scalar()
            return account

        if email is not None:
            account = (
                await db.execute(
                    select(Account)
                        .where(Account.Email == email)
                        .limit(1)
                )
            ).scalar()
        return account

    @staticmethod
    async def find_admins(db: AsyncSession) -> list[Account]:
        accounts = (await db.execute(
            select(Account)
                .where(Account.Role == AccountRole.ADMIN)
        )).scalars().all()
        return accounts

    @staticmethod
    async def get(db: AsyncSession, account_id: str) -> Account:
        account = (await db.execute(
            select(Account)
                .where(Account.Id == account_id)
        )).scalar()
        return account

    @staticmethod
    async def authenticate(db: AsyncSession, email: str, password: str) -> Account:
        account = await CoreAccount.find(db, email=email)
        if not account:
            raise AccountAuthenticationError()

        if account.Password is None or not compare(password, account.Password, account.PasswordSalt):
            raise AccountAuthenticationError()

        return account

    @staticmethod
    async def login(db: AsyncSession, account: Account, ip_address: Optional[str] = None) -> str:
        access_token = CoreAccount.create_jwt_token(account=account)

        # update last login info
        account.LastLoginAt = datetime.now(UTC).replace(tzinfo=None)
        account.LastLoginIp = ip_address
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
        extra_info: Optional[str] = None,
        token: Optional[str] = None,
    ) -> str:
        account = await CoreAccount.create_account(db, name=name, email=email, password=password, extra_info=extra_info)
        if provider is not None and open_id is not None:
            await CoreAccount.link_or_update_account(
                db, account, provider, open_id, name=name, extra_info=extra_info, token=token
            )

        await db.commit()

        return account

    @staticmethod
    async def create_account(
        db: AsyncSession,
        name: Optional[str] = None,
        email: Optional[str] = None,
        password: Optional[str] = None,
        extra_info: Optional[str] = None,
    ) -> Account:
        """create account"""
        account = Account()
        account.Email = email
        if name is None and email is not None:
            name = email.split("@")[0]
        account.Name = name
        account.ExtraInfo = extra_info

        if password:
            # generate salt
            salt = secrets.token_bytes(32)
            hex_salt = binascii.hexlify(salt).decode()

            # encrypt password with salt
            password_hashed = hash(password, hex_salt)

            account.Password = password_hashed
            account.PasswordSalt = hex_salt

        db.add(account)
        await db.commit()

        account.Password = None
        account.PasswordSalt = None

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
            "AccountId": str(account.Id),
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
        name: Optional[str] = None,
        extra_info: Optional[str] = None,
        token: str = None
    ) -> None:
        """link account with oauth provider"""

        account_third_party = (
            await db.execute(
                select(AccountThirdParty)
                    .where(AccountThirdParty.Provider == provider, AccountThirdParty.OpenId == open_id)
                    .limit(1)
            )
        ).scalar()

        if account_third_party is None:
            account_third_party = AccountThirdParty(
                AccountId=account.Id, Provider=provider, OpenId=open_id, Token=token
            )
            db.add(account_third_party)

        account_third_party.Token = token
        account.UpdatedAt = datetime.now(UTC).replace(tzinfo=None)
        if name is not None:
            account.Name = name
        if extra_info is not None:
            account.ExtraInfo = extra_info

        await db.commit()

    @staticmethod
    async def customer_auth(
        db: AsyncSession,
        customer_id: Optional[str],
        name: Optional[str],
        timestamp: Optional[int],
        extra_info: Optional[str],
        code: Optional[str]
    ) -> Account:
        provider = 'customer'

        # 注意：需要对传入信息进行验证！避免被恶意批量注册
        # 验证可以采取以下任意方法：
        # 1. 离线验证，通过传入的code进行签名，通过加密算法确保只有拥有CUSTOMER_ACCOUNT_SECRET_KEY的服务器可以生成该签名
        # 2. 在线验证，通过传入的code，发起与客户账户系统后端服务器进行交互，确保该code由可信的服务生成

        # 离线验证
        # SHA256(HMAC(CUSTOMER_ACCOUNT_SECRET_KEY, customer_id + name + str(timestamp)))
        msg = f'{customer_id}{name}{extra_info}{timestamp}'
        ts = int(time.time())
        if abs(timestamp - ts) > 60:
            err_msg = f'timestamp diff too much (abs({timestamp} - {ts}) = {abs(timestamp - ts)}) > 60'
            logging.error(f'[customer_auth] {err_msg}')
            raise CustomerAccountSign(err_msg)
        sign = hmac.new(
            tagentic_config.CUSTOMER_ACCOUNT_SECRET_KEY.encode("utf-8"), msg.encode("utf-8"), hashlib.sha256
        ).hexdigest()
        if sign != code:
            err_msg = 'sign mismatch'
            logging.error(f'[customer_auth] {err_msg} ({sign} != {code}) msg={msg}')
            raise CustomerAccountSign(err_msg)

        # 在线验证
        # 参考core/oauth.py: CoreOAuth.callback()

        if name is None:
            name = f'{provider}_{customer_id}'
        account = await CoreAccount.find(db, provider=provider, open_id=customer_id)
        if account is None:
            account = await CoreAccount.register(
                db, provider=provider, open_id=customer_id, extra_info=extra_info, name=name
            )
        else:
            await CoreAccount.link_or_update_account(
                db, account, provider=provider, open_id=customer_id, extra_info=extra_info, name=name
            )

        return account


    @staticmethod
    async def auto_create(
        db: AsyncSession,
        name: str,
        ip_address: Optional[str] = None,
    ) -> str:

        account = await CoreAccount.register(
            db,
            name=name,
        )
        token = await CoreAccount.login(db, account, ip_address)

        return token
