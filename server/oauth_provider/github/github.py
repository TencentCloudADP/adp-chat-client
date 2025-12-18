import logging
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
import aiohttp

from config import tagentic_config
from core.error.account import (
    AccountAuthenticationError,
)
from oauth_provider.interface import BaseOAuthProvider
from core.oauth import CoreOAuth
from core.account import CoreAccount
from model.account import Account


logger = logging.getLogger(__name__)


class GitHub(BaseOAuthProvider):
    def __init__(self):
        super().__init__()
        # 把自己注册到CoreAccountProvider
        if tagentic_config.OAUTH_GITHUB_CLIENT_ID != '':
            callback = CoreOAuth.get_callback_url(self)
            CoreOAuth.add_provider(
                self,
                'GitHub',
                (
                    f'https://github.com/login/oauth/authorize?'
                    f'client_id={tagentic_config.OAUTH_GITHUB_CLIENT_ID}&redirect_uri={callback}&scope='
                )
            )

    async def callback(
        self,
        db: AsyncSession,
        provider: str,
        code: Optional[str]
    ) -> Account:
        """回调响应
        响应授权回调，验证合法性，查找本系统对应账户的，如果不存在需要创建账户
        Returns:
            Account: 本系统账户
        """
        access_token_api = 'https://github.com/login/oauth/access_token'
        user_api = 'https://api.github.com/user'
        async with aiohttp.ClientSession() as session:
            headers = {
                'Accept': 'application/json',
            }
            payload = {
                'client_id': tagentic_config.OAUTH_GITHUB_CLIENT_ID,
                'client_secret': tagentic_config.OAUTH_GITHUB_SECRET,
                'code': code,
            }
            async with session.post(access_token_api, headers=headers, data=payload) as resp:
                resp = await resp.json()
                if 'access_token' not in resp:
                    logger.error(resp)
                    raise AccountAuthenticationError()
                access_token = resp['access_token']

            headers = {
                'Accept': 'application/json',
                'Authorization': f'Bearer {access_token}',
            }
            async with session.get(user_api, headers=headers) as resp:
                resp = await resp.json()
                logger.info(resp)
                if 'login' not in resp or 'id' not in resp:
                    logger.error(resp)
                    raise AccountAuthenticationError()
                name = resp['login']
                id = str(resp['id'])

        account = await CoreAccount.find(db, provider=provider, open_id=id)
        if account is None:
            account = await CoreAccount.register(db, provider=provider, open_id=id, token=access_token, name=name)
        else:
            await CoreAccount.link_or_update_account(
                db, account, provider=provider, open_id=id, token=access_token, name=name
            )

        return account

    @classmethod
    def get_name(cls) -> str:
        return 'github'


def get_class():
    return GitHub
