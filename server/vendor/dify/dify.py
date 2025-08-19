from datetime import UTC, datetime, timedelta
from enum import Enum
import logging
from pydantic import BaseModel
from typing import Any, Optional, cast
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
import asyncio
import aiohttp
import json
from util.tca import tc_request

from util.json_format import custom_dumps
from config import tagentic_config
from core.chat import CoreMessage, CoreConversation, CoreCompletion, CoreChat
from vendor.interface import BaseVendor, ApplicationInfo, ConversationCallback

async def request(url: str, authorization: str, payload: dict = {}, method = "get") -> str:
    headers = {
        "Authorization": f"Bearer {authorization}",
    }
    async with aiohttp.ClientSession() as session:
        if method == "get":
            async with session.get(url, headers=headers, params=payload) as resp:
                return await resp.json()
        elif method == "post":
            payload = json.dumps(payload)
            headers = dict(headers, **{
                "Content-Type": "application/json",
            })
            async with session.post(url, headers=headers, data=payload) as resp:
                return await resp.json()

class Dify(BaseVendor):
    
    # ApplicationInterface
    @classmethod
    def get_config_prefix(self) -> str:
        return 'Dify'
    
    # ApplicationInterface
    async def get_info(self) -> ApplicationInfo:
        resp = await request(f'{self.config['BaseURL']}/site', self.config['APIKey'], method='get')
        # print(resp)
        return ApplicationInfo(
            ApplicationId = self.application_id,
            Name = resp['title'],
            Avatar = resp['icon_url'] or '',
            Greeting = resp['description'] or '',
        )

    # MessageInterface
    async def get_messages(self, db: AsyncSession, account_id: str, conversation_id: str, last_record_id: str = None) -> list:
        payload = {
            "limit": 4,
            "user": account_id,
            "conversation_id": conversation_id,
        }
        if last_record_id is not None:
            payload['first_id'] = last_record_id
        resp = await request(f'{self.config['BaseURL']}/messages', self.config['APIKey'], payload, method='get')
        print(resp)
        # if 'Error' in resp['Response']:
        #     raise Exception(resp['Response']['Error'])
        return resp['data']


    # ChatInterface
    async def chat(self, account_id: str, query: str, conversation_id: str, is_new_conversation: bool, conversation_cb: ConversationCallback, search_network = True, custom_variables = {}):
        async with aiohttp.ClientSession() as session:
            param = {
                "query": query,
                "conversation_id": conversation_id,
                "user": account_id,
                "inputs": custom_variables,
                "response_mode" : "streaming",
                "files": [],
            }
            # print(param)
            headers = {
                "Authorization": f"Bearer {self.config['APIKey']}",
                "Accept": "text/event-stream",
                "Content-Type": "application/json",
            }
            
            async with session.post(f'{self.config["BaseURL"]}/chat-messages', headers=headers, data=json.dumps(param)) as resp:
                if resp.status != 200:
                    logging.error(f"Failed to chat: {resp}")
                    raise(Exception())

                # 逐行读取事件流
                last_event_type = None
                last_message_test = ''
                last_message_id = ''
                last_from_role = ''
                try:
                    while True:
                        raw_line = await resp.content.readline()
                        if not raw_line:
                            break
                        line = raw_line.decode()
                        if ':' not in line:
                            continue
                        line_type, data = line.split(':', 1)
                        if line_type == 'data':
                            if is_new_conversation:
                                data = json.loads(data)
                                if data['event'] == 'message':
                                    is_new_conversation = False
                                    conversation_id = await conversation_cb.create(conversation_id=data['conversation_id']) # 创建会话
                                    yield ('data:'+custom_dumps(CoreChat.message_new_conversation_id(conversation_id))+'\n\n').encode()
                            
                            yield raw_line + '\n'.encode()
                except asyncio.CancelledError:
                    logging.info("forward_request: cancelled")
                    resp.close()
            logging.info(f"forward_request: done")

def get_class():
    return Dify