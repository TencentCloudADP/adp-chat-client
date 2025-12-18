from urllib.parse import quote
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from config import tagentic_config
from core.error.account import (
    AccountUnauthorized,
)
from oauth_provider.interface import BaseOAuthProvider
from core.account import CoreAccountProvider
from model.account import Account


class CoreOAuth:
    providers = {}

    @staticmethod
    async def callback(db: AsyncSession, provider: str, code: Optional[str]) -> Account:
        if provider in CoreOAuth.providers.keys():
            return await CoreOAuth.providers[provider].callback(db, provider, code)
        else:
            raise AccountUnauthorized()

    @staticmethod
    def add_provider(obj: BaseOAuthProvider, title: str, url: str) -> None:
        CoreAccountProvider.add_provider(title, url)
        CoreOAuth.providers[obj.get_name()] = obj

    @staticmethod
    def get_callback_url(obj: BaseOAuthProvider) -> str:
        """获取回调URL
        """
        return quote(f'{tagentic_config.SERVICE_API_URL}/oauth/callback/{obj.get_name()}')
