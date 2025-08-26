from datetime import UTC, datetime, timedelta
from enum import Enum
import logging
from pydantic import BaseModel
from typing import Any, Optional, cast
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sanic.request.types import Request
import asyncio
import aiohttp
import json
from util.tca import tc_request
from util.warehouse import AsyncWareHouseS3

from util.helper import to_message, convert_dict_keys_to_pascal
from util.json_format import custom_dumps
from config import tagentic_config
from core.completion import CoreCompletion
from vendor.interface import BaseVendor, ApplicationInfo, MsgRecord, ConversationCallback, MessageType

class TCADP(BaseVendor):

    # ApplicationInterface
    @classmethod
    def get_vendor(self) -> str:
        return 'Tencent'
    
    # ApplicationInterface
    async def get_info(self) -> ApplicationInfo:
        action = "DescribeRobotBizIDByAppKey"
        payload = {
            "AppKey": self.config['AppKey'],
        }
        resp = await tc_request(self.tc_config(), action, payload)
        if 'Error' in resp['Response']:
            logging.error(resp)
            raise Exception(resp['Response']['Error'])
        
        BotBizId = resp['Response']['BotBizId']
        self.config['BotBizId'] = BotBizId

        action = "DescribeApp"
        payload = {
            "AppBizId": BotBizId,
        }
        resp = await tc_request(self.tc_config(), action, payload)
        if 'Error' in resp['Response']:
            logging.error(resp)
            return ApplicationInfo(
                ApplicationId = self.application_id,
                Name = '未知应用',
            )
        else:
            return ApplicationInfo(
                ApplicationId = self.application_id,
                Name = resp['Response']['BaseConfig']['Name'],
                Avatar = resp['Response']['BaseConfig']['Avatar'],
                Greeting = resp['Response']['AppConfig']['KnowledgeQa']['Greeting'],
                OpeningQuestions = resp['Response']['AppConfig']['KnowledgeQa']['OpeningQuestions'],
            )

    # MessageInterface
    async def get_messages(self, db: AsyncSession, account_id: str, conversation_id: str, limit: int, last_record_id: str = None) -> list[MsgRecord]:
        action = "GetMsgRecord"
        payload = {
            "Type": 5,
            "Count": limit,
            "SessionId": conversation_id,
            "BotAppKey": self.config['AppKey'],
        }
        if last_record_id is not None:
            payload['LastRecordId'] = last_record_id
        resp = await tc_request(self.tc_config(), action, payload)
        if 'Error' in resp['Response']:
            raise Exception(resp['Response']['Error'])
        records = [MsgRecord(**msg) for msg in resp['Response']['Records']]
        return records
        # return resp['Response']['Records']


    # ChatInterface
    async def chat(self, db: AsyncSession, account_id: str, query: str, conversation_id: str, is_new_conversation: bool, conversation_cb: ConversationCallback, search_network = True, custom_variables = {}):
        if is_new_conversation:
            conversation = await conversation_cb.create() # 创建会话
            yield to_message(MessageType.CONVERSATION, conversation=conversation, is_new_conversation=True)
            conversation_id = str(conversation.Id)
        async with aiohttp.ClientSession() as session:
            incremental = True
            param = {
                "content": query,
                "bot_app_key": self.config['AppKey'],
                "session_id": conversation_id,
                "visitor_biz_id": account_id,
                "search_network": "enable" if search_network else "disable",
                "custom_variables": custom_variables,
                "incremental" : incremental,
            }
            headers = {
                "Accept": "text/event-stream",
                "Content-Type": "application/json",
            }
            
            async with session.post(self.tc_config()['sse'], headers=headers, data=json.dumps(param)) as resp:
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
                            # 转换为与云API一致的大驼峰风格
                            data = json.loads(data)
                            try:
                                msg_type = MessageType(data['type'])
                            except ValueError:
                                logging.info(f"Unknown message type: {data['type']}")
                                continue

                            if msg_type in {MessageType.REPLY, MessageType.THOUGHT, MessageType.REFERENCE, MessageType.TOKEN_STAT}:
                                payload = convert_dict_keys_to_pascal(data['payload'])
                                if msg_type == MessageType.REPLY:
                                    pass
                                elif msg_type == MessageType.THOUGHT:
                                    payload = {'AgentThought': payload, **payload}
                                elif msg_type == MessageType.REFERENCE:
                                    payload = {'Reference': payload, **payload}
                                elif msg_type == MessageType.TOKEN_STAT:
                                    payload = {'TokenStat': payload, **payload}
                                record = MsgRecord.model_validate(payload)
                                
                                yield to_message(msg_type, record=record, incremental=incremental)
                            elif msg_type in {MessageType.ERROR}:
                                if 'payload' in data:
                                    msg = data['payload']['error']['message']
                                elif 'error' in data:
                                    msg = data['error']['message']
                                else:
                                    msg = f"未知错误: {str(data)}"
                                yield to_message(msg_type, error_msg=msg)
                            else:
                                logging.info(f"Unknown message type: {data['type']}")

                            # yield raw_line + '\n'.encode()
                except asyncio.CancelledError:
                    logging.info("forward_request: cancelled")
                    resp.close()
            logging.info(f"forward_request: done")

            try:
                # 生成标题
                summarize = None
                if is_new_conversation:
                    completion = CoreCompletion(self.tc_config(), system_prompt = '请从以下对话中提取一个最核心的主题，用于对话列表展示。要求：\n1. 用5-10个汉字概括\n2. 优先选择：最新进展/待解决问题/双方共识\n\n请直接输出提炼结果，不要解释。')
                    summarize = await completion.chat(f'user: {query}\n\nassistance:')
                conversation = await conversation_cb.update(conversation_id=conversation_id, title=summarize) # 更新会话
                yield to_message(MessageType.CONVERSATION, conversation=conversation, is_new_conversation=False)
            except Exception as e:
                logging.error(f'failed to summarize conversation title. error: {e}')

    # FileInterface:
    async def upload(self, db: AsyncSession, request: Request, account_id: str) -> str:
        action = "DescribeStorageCredential"
        payload = {
            "BotBizId": self.config['BotBizId'],
            "FileType": 'png',
            "IsPublic": True,
            "TypeKey": 'realtime',
        }
        resp = await tc_request(self.tc_config(), action, payload)
        resp = resp['Response']
        if 'Error' in resp:
            logging.error(resp)
            raise Exception(resp['Error']['Message'])
        cos = AsyncWareHouseS3(secretId=resp['Credentials']['TmpSecretId'], secretKey=resp['Credentials']['TmpSecretKey'], tmpToken=resp['Credentials']['Token'], region=resp['Region'], bucket=resp['Bucket'])

        async with cos.put_multipart(resp['UploadPath']) as uploader:
            while True:
                body = await request.stream.read()
                if body is None:
                    break
                # result += body.decode("utf-8")
                print(f'upload: {len(body)}')
                # print(f'upload: {body}')
                await uploader.write(body)

        url = cos.get_full_url(resp['UploadPath'])
        return url

    # FeedbackInterface
    async def rate(self, db: AsyncSession, account_id: str, conversation_id: str, record_id: str, score: int, comment: str = None) -> None:
        action = "RateMsgRecord"
        payload = {
            "RecordId": record_id,
            "Score": 1 if score==1 else 2,
            "BotAppKey": self.config['AppKey'],
        }
        resp = await tc_request(self.tc_config(), action, payload)
    
    def tc_config(self):
        international = False
        if 'International' in self.config:
            international = self.config['International']
        return service_configs['International'] if international else service_configs['China']


service_configs = {
    'International': {
        'lke': {
            'host': 'lke.intl.tencentcloudapi.com',
            'region': 'ap-jakarta',
            "version": "2023-11-30"
        },
        'lkeap': {
            'host': 'lkeap.intl.tencentcloudapi.com',
            'region': 'ap-jakarta',
            "version": "2024-05-22"
        },
        'sse': 'https://wss.lke.tencentcloud.com/v1/qbot/chat/sse'
    },
    'China': {
        'lke': {
            'host': 'lke.tencentcloudapi.com',
            'region': 'ap-guangzhou',
            "version": "2023-11-30"
        },
        'lkeap': {
            'host': 'lkeap.tencentcloudapi.com',
            'region': 'ap-guangzhou',
            "version": "2024-05-22"
        },
        'sse': 'https://wss.lke.cloud.tencent.com/v1/qbot/chat/sse'
    }
}

def get_class():
    return TCADP