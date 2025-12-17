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


class MsEntraId(BaseOAuthProvider):
    def __init__(self):
        super().__init__()
        # 把自己注册到CoreAccountProvider
        if tagentic_config.OAUTH_MICROSOFT_ENTRA_CLIENT_ID != '':
            callback = CoreOAuth.get_callback_url(self)
            CoreOAuth.add_provider(
                self,
                'Microsoft Entra ID',
                (
                    f'https://login.microsoftonline.com/{tagentic_config.OAUTH_MICROSOFT_ENTRA_ENDPOINT}/oauth2/v2.0/authorize?'  # noqa: E501
                    f'client_id={tagentic_config.OAUTH_MICROSOFT_ENTRA_CLIENT_ID}&'
                    f'redirect_uri={callback}&scope=user.read&response_type=code'
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
        access_token_api = f'https://login.microsoftonline.com/{tagentic_config.OAUTH_MICROSOFT_ENTRA_ENDPOINT}/oauth2/v2.0/token'  # noqa: E501
        user_api = 'https://graph.microsoft.com/v1.0/me'
        async with aiohttp.ClientSession() as session:
            callback = f'{tagentic_config.SERVICE_API_URL}/oauth/callback/ms_entra_id'
            headers = {
                'Accept': 'application/json',
            }
            payload = {
                'client_id': tagentic_config.OAUTH_MICROSOFT_ENTRA_CLIENT_ID,
                'client_secret': tagentic_config.OAUTH_MICROSOFT_ENTRA_SECRET,
                'code': code,
                'redirect_uri': callback,
                'grant_type': 'authorization_code',
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
                # logger.info(resp)
                if 'displayName' not in resp or 'id' not in resp:
                    logger.error(resp)
                    raise AccountAuthenticationError()
                name = resp['displayName']
                id = str(resp['id'])
            # ms_entra_id is too long to fit into the table ...
            access_token = None

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
        return 'ms_entra_id'


def get_class():
    return MsEntraId
