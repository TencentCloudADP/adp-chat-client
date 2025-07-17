from datetime import UTC, datetime, timedelta
import logging
from pydantic import BaseModel
from typing import Any, Optional, cast
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import secrets
import binascii
import aiohttp
from urllib.parse import quote

from config import tagentic_config
from core.error.account import (
    AccountAuthenticationError,
    AccountUnauthorized,
)
from core.session import SessionToken
from model.account import Account
from util.password import hash, compare
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
                    'client_id':  tagentic_config.OAUTH_GITHUB_CLIENT_ID,
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
                    'client_id':  tagentic_config.OAUTH_MICROSOFT_ENTRA_CLIENT_ID,
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

        else:
            raise AccountUnauthorized()

        account = await CoreAccount.find(db, provider=provider, open_id=id)
        if account is None:
            account = await CoreAccount.register(db, provider=provider, open_id=id, token=access_token, name=name)
        else:
            await CoreAccount.link_or_update_account(db, account, provider=provider, open_id=id, token=access_token, name=name)
        
        return account

@app.listener('before_server_start')
def oauth_init(app, loop):
    if tagentic_config.OAUTH_GITHUB_CLIENT_ID != '':
        callback = quote(f'{tagentic_config.SERVICE_API_URL}/oauth/callback/github')
        CoreAccountProvider.addProvider('GitHub', f'https://github.com/login/oauth/authorize?client_id={tagentic_config.OAUTH_GITHUB_CLIENT_ID}&redirect_uri={callback}&scope=')

    if tagentic_config.OAUTH_MICROSOFT_ENTRA_CLIENT_ID != '':
        callback = quote(f'{tagentic_config.SERVICE_API_URL}/oauth/callback/ms_entra_id')
        CoreAccountProvider.addProvider('Microsoft Entra ID', f'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id={tagentic_config.OAUTH_MICROSOFT_ENTRA_CLIENT_ID}&redirect_uri={callback}&scope=user.read&response_type=code')
