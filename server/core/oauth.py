import logging
from typing import Optional
from urllib.parse import quote

from sqlalchemy.ext.asyncio import AsyncSession
import aiohttp
import uuid
import json

from config import tagentic_config
from core.error.account import (
    AccountAuthenticationError,
    AccountUnauthorized,
)
from core.account import CoreAccount, CoreAccountProvider
from app_factory import TAgenticApp
app = TAgenticApp.get_app()


class CoreOAuth:

    @staticmethod
    async def callback(db: AsyncSession, provider: str, code: Optional[str]) -> None:
        if provider == 'github':
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
                        logging.error(resp)
                        raise AccountAuthenticationError()
                    access_token = resp['access_token']

                headers = {
                    'Accept': 'application/json',
                    'Authorization': f'Bearer {access_token}',
                }
                async with session.get(user_api, headers=headers) as resp:
                    resp = await resp.json()
                    logging.info(resp)
                    if 'login' not in resp or 'id' not in resp:
                        logging.error(resp)
                        raise AccountAuthenticationError()
                    name = resp['login']
                    id = str(resp['id'])
        elif provider == 'ms_entra_id':
            access_token_api = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
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
                        logging.error(resp)
                        raise AccountAuthenticationError()
                    access_token = resp['access_token']

                headers = {
                    'Accept': 'application/json',
                    'Authorization': f'Bearer {access_token}',
                }
                async with session.get(user_api, headers=headers) as resp:
                    resp = await resp.json()
                    logging.info(resp)
                    if 'displayName' not in resp or 'id' not in resp:
                        logging.error(resp)
                        raise AccountAuthenticationError()
                    name = resp['displayName']
                    id = str(resp['id'])
                # ms_entra_id is too long to fit into the table ...
                access_token = None
        elif provider == 'wecom':
            access_token_api = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken'
            user_api = 'https://qyapi.weixin.qq.com/cgi-bin/auth/getuserinfo'
            user_private_api = 'https://qyapi.weixin.qq.com/cgi-bin/auth/getuserdetail'
            user_detail_api = 'https://qyapi.weixin.qq.com/cgi-bin/user/get'
            async with aiohttp.ClientSession() as session:
                # 获取`Access Token`
                print('获取`Access Token`')
                headers = {
                    'Accept': 'application/json',
                }
                async with session.get(f'{access_token_api}?corpid={tagentic_config.OAUTH_WECOM_CLIENT_ID}&corpsecret={tagentic_config.OAUTH_WECOM_SECRET}', headers=headers) as resp:
                    resp = await resp.json()
                    if 'access_token' not in resp:
                        logging.error(resp)
                        raise AccountAuthenticationError()
                    access_token = resp['access_token']

                # 获取用户信息
                print('获取用户信息')
                headers = {
                    'Accept': 'application/json',
                }
                async with session.get(
                    f'{user_api}?access_token={access_token}&code={code}', headers=headers) as resp:
                    resp = await resp.json()
                    logging.info(resp)
                    if 'userid' not in resp:
                        logging.error(resp)
                        raise AccountAuthenticationError()
                    # 获取企业微信用户ID
                    id = str(resp['userid'])
                    user_ticket = str(resp['user_ticket'])

                # 获取用户敏感信息
                print('获取用户敏感信息: ', user_ticket)
                headers = {
                    'Accept': 'application/json',
                }
                payload = {
                    'user_ticket': user_ticket,
                }
                async with session.post(
                    f'{user_private_api}?access_token={access_token}', headers=headers, json=payload) as resp:
                    resp = await resp.json()
                    logging.info(resp)
                    if 'email' not in resp:
                        logging.error(resp)
                        raise AccountAuthenticationError()
                    # 获取企业微信用户邮箱及头像
                    email = str(resp.get('email', ''))
                    avatar = str(resp.get('avatar', ''))

                # 获取用户姓名
                print('获取用户姓名')
                headers = {
                    'Accept': 'application/json',
                }
                async with session.get(
                    f'{user_detail_api}?access_token={access_token}&userid={id}', headers=headers) as resp:
                    resp = await resp.json()
                    logging.info(resp)
                    if 'name' not in resp:
                        logging.error(resp)
                        raise AccountAuthenticationError()
                    # 获取企业微信用户姓名
                    name = str(resp.get('name', ''))
        else:
            raise AccountUnauthorized()

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


@app.listener('before_server_start')
def oauth_init(app, loop):
    if tagentic_config.OAUTH_GITHUB_CLIENT_ID != '':
        callback = quote(f'{tagentic_config.SERVICE_API_URL}/oauth/callback/github')
        CoreAccountProvider.add_provider(
            'GitHub',
            (
                f'https://github.com/login/oauth/authorize?'
                f'client_id={tagentic_config.OAUTH_GITHUB_CLIENT_ID}&redirect_uri={callback}&scope='
            )
        )

    if tagentic_config.OAUTH_MICROSOFT_ENTRA_CLIENT_ID != '':
        callback = quote(f'{tagentic_config.SERVICE_API_URL}/oauth/callback/ms_entra_id')
        CoreAccountProvider.add_provider(
            'Microsoft Entra ID',
            (
                f'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?'
                f'client_id={tagentic_config.OAUTH_MICROSOFT_ENTRA_CLIENT_ID}&'
                f'redirect_uri={callback}&scope=user.read&response_type=code'
            )
        )

    # 企业微信单点登录
    #   - SaaS: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WEWORK_CORP_ID}&agentid=${WEWORK_AGENT_ID}&redirect_uri=${encodeURIComponent(WEWORK_REDIRECT_URI)}&response_type=code&scope=snsapi_privateinfo&state=${state}#wechat_redirect`
    if tagentic_config.OAUTH_WECOM_CLIENT_ID != '':
        callback = quote(f'{tagentic_config.SERVICE_API_URL}/oauth/callback/wecom')
        # 生成随机`state`
        state = quote(str(uuid.uuid4()))
        CoreAccountProvider.add_provider(
            'WeCom',
            (
                f'https://open.weixin.qq.com/connect/oauth2/authorize?'
                f'appid={tagentic_config.OAUTH_WECOM_CLIENT_ID}&agentid={tagentic_config.OAUTH_WECOM_AGENT_ID}&redirect_uri={callback}&response_type=code&state={state}&scope=snsapi_privateinfo#wechat_redirect'
            )
        )
