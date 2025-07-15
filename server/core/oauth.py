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
from core.account import CoreAccount

class CoreOAuth:
    @staticmethod
    async def list(db: AsyncSession) -> None:
        providers = []
        callback = quote(f'{tagentic_config.SERVICE_API_URL}/oauth/callback')
        if tagentic_config.OAUTH_GITHUB_CLIENT_ID != '':
            providers.append(
                {
                    'name': 'GitHub',
                    'url': f'https://github.com/login/oauth/authorize?client_id={tagentic_config.OAUTH_GITHUB_CLIENT_ID}&redirect_uri={callback}&scope=',
                }
            )
        return providers

    @staticmethod
    async def callback(db: AsyncSession, code: Optional[str]) -> None:
        provider = 'github'
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
                login = resp['login']
                id = str(resp['id'])

            account = await CoreAccount.find(db, provider=provider, open_id=id)
            if account is None:
                account = await CoreAccount.register(db, provider=provider, open_id=id, token=access_token, name=login)
            else:
                await CoreAccount.link_or_update_account(db, account, provider=provider, open_id=id, token=access_token)
            
            return account
