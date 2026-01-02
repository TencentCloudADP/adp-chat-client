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
import uuid
import json
from urllib.parse import quote


logger = logging.getLogger(__name__)


class WeCom(BaseOAuthProvider):
    def __init__(self):
        super().__init__()
        # 把自己注册到CoreAccountProvider
        if tagentic_config.OAUTH_WECOM_CLIENT_ID != '':
            callback = CoreOAuth.get_callback_url(self)
            # 生成随机`state`
            state = quote(str(uuid.uuid4()))
            CoreOAuth.add_provider(
                self,
                '企业微信',
                (
                    f'https://open.weixin.qq.com/connect/oauth2/authorize?'
                    f'appid={tagentic_config.OAUTH_WECOM_CLIENT_ID}&agentid={tagentic_config.OAUTH_WECOM_AGENT_ID}&redirect_uri={callback}&response_type=code&state={state}&scope=snsapi_privateinfo#wechat_redirect'
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
        access_token_api = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken'
        user_api = 'https://qyapi.weixin.qq.com/cgi-bin/auth/getuserinfo'
        user_private_api = 'https://qyapi.weixin.qq.com/cgi-bin/auth/getuserdetail'
        user_detail_api = 'https://qyapi.weixin.qq.com/cgi-bin/user/get'
        async with aiohttp.ClientSession() as session:
            # 获取`Access Token`
            logger.info('获取`Access Token`')
            headers = {
                'Accept': 'application/json',
            }
            async with session.get(f'{access_token_api}?corpid={tagentic_config.OAUTH_WECOM_CLIENT_ID}&corpsecret={tagentic_config.OAUTH_WECOM_SECRET}', headers=headers) as resp:
                resp = await resp.json()
                if 'access_token' not in resp:
                    logger.error(resp)
                    raise AccountAuthenticationError()
                access_token = resp['access_token']

            # 获取用户信息
            logger.info('获取用户信息')
            headers = {
                'Accept': 'application/json',
            }
            async with session.get(
                f'{user_api}?access_token={access_token}&code={code}', headers=headers) as resp:
                resp = await resp.json()
                logger.info(resp)
                if 'userid' not in resp:
                    logger.error(resp)
                    raise AccountAuthenticationError()
                # 获取企业微信用户ID
                id = str(resp['userid'])
                user_ticket = str(resp['user_ticket'])

            # 获取用户敏感信息
            logger.info('获取用户敏感信息: ', user_ticket)
            headers = {
                'Accept': 'application/json',
            }
            payload = {
                'user_ticket': user_ticket,
            }
            async with session.post(
                f'{user_private_api}?access_token={access_token}', headers=headers, json=payload) as resp:
                resp = await resp.json()
                logger.info(resp)
                if 'email' not in resp:
                    logger.error(resp)
                    raise AccountAuthenticationError()
                # 获取企业微信用户邮箱及头像
                email = str(resp.get('email', ''))
                avatar = str(resp.get('avatar', ''))

            # 获取用户姓名
            logger.info('获取用户姓名')
            headers = {
                'Accept': 'application/json',
            }
            async with session.get(
                f'{user_detail_api}?access_token={access_token}&userid={id}', headers=headers) as resp:
                resp = await resp.json()
                logger.info(resp)
                if 'name' not in resp:
                    logger.error(resp)
                    raise AccountAuthenticationError()
                # 获取企业微信用户姓名
                name = str(resp.get('name', ''))

        account = await CoreAccount.find(db, provider=provider, open_id=id)
        if account is None:
            # 由于account表没有存储用户信息及头像的字段，此处把用户信息及头像存储到extra_info字段中
            account = await CoreAccount.register(db, provider=provider, open_id=id, token=access_token, name=name, email=email, extra_info=json.dumps({
                    'open_id': id,
                    'avatar': avatar
                }))
        else:
            # 由于account表没有存储用户信息及头像的字段，此处把用户信息及头像存储到extra_info字段中
            await CoreAccount.link_or_update_account(
                db, account, provider=provider, open_id=id, token=access_token, name=name, extra_info=json.dumps({
                    'open_id': id,
                    'avatar': avatar
                })
            )

        return account

    @classmethod
    def get_name(cls) -> str:
        return 'wecom'


def get_class():
    return WeCom
