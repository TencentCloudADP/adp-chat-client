import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sanic.request.types import Request
import asyncio
import aiohttp
import json
import uuid
from util.helper import to_message
from vendor.interface import BaseVendor, ApplicationInfo, MsgRecord, _TokenStat, ConversationCallback, MessageType


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
    def get_vendor(self) -> str:
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
    async def get_messages(
        self,
        db: AsyncSession,
        account_id: str,
        conversation_id: str,
        limit: int, last_record_id: str = None
    ) -> list[MsgRecord]:
        payload = {
            "limit": limit,
            "user": account_id,
            "conversation_id": conversation_id,
        }
        if last_record_id is not None:
            payload['first_id'] = last_record_id
        resp = await request(f'{self.config['BaseURL']}/messages', self.config['APIKey'], payload, method='get')
        print(resp)
        records = []
        for msg in resp['data']:
            records.append(self.to_msg_record(msg, is_from_self=True))
            records.append(self.to_msg_record(msg))

        # if 'Error' in resp['Response']:
        #     raise Exception(resp['Response']['Error'])
        return records

    # ChatInterface
    async def chat(
        self,
        db: AsyncSession,
        account_id: str,
        query: str,
        conversation_id: str,
        is_new_conversation: bool,
        conversation_cb: ConversationCallback,
        search_network = True,
        custom_variables = {}
    ):
        async with aiohttp.ClientSession() as session:
            param = {
                "query": query,
                "conversation_id": conversation_id,
                "user": account_id,
                "inputs": custom_variables,
                "response_mode": "streaming",
                "files": [],
            }
            # print(param)
            headers = {
                "Authorization": f"Bearer {self.config['APIKey']}",
                "Accept": "text/event-stream",
                "Content-Type": "application/json",
            }

            async with session.post(
                f'{self.config["BaseURL"]}/chat-messages',
                headers=headers,
                data=json.dumps(param)
            ) as resp:
                if resp.status != 200:
                    logging.error(f"Failed to chat: {resp}")
                    raise Exception(f"Failed to chat: {resp}")

                # 逐行读取事件流
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
                            data = json.loads(data)
                            if is_new_conversation:
                                if data['event'] == 'message':
                                    is_new_conversation = False
                                    conversation = await conversation_cb.create(
                                        conversation_id=data['conversation_id']
                                    )  # 创建会话
                                    yield to_message(
                                        MessageType.CONVERSATION, conversation=conversation, is_new_conversation=True
                                    )

                            if data['event'] == 'message':
                                yield to_message(
                                    MessageType.REPLY, record=self.to_msg_record(data, is_final=False), incremental=True
                                )
                            elif data['event'] == 'message_end':
                                yield to_message(
                                    MessageType.REPLY, record=self.to_msg_record(data), incremental=True
                                )

                except asyncio.CancelledError:
                    logging.info("forward_request: cancelled")
                    resp.close()
            logging.info("forward_request: done")

            conversation = await conversation_cb.update(conversation_id=conversation_id)  # 更新会话
            yield to_message(MessageType.CONVERSATION, conversation=conversation, is_new_conversation=False)

    # FileInterface:
    async def upload(self, db: AsyncSession, request: Request, account_id: str, mime_type: str) -> str:
        async with aiohttp.ClientSession() as session:
            headers = {
                "Authorization": f"Bearer {self.config['APIKey']}",
            }

            multipart_data = aiohttp.MultipartWriter('form-data')
            part = multipart_data.append(request.stream)
            part.set_content_disposition(
                'form-data', name='file', filename=f'{uuid.uuid4()}.{mime_type.split("/")[-1]}'
            )
            part.headers[aiohttp.hdrs.CONTENT_TYPE] = mime_type
            # set user id
            part = multipart_data.append(str(account_id))
            part.set_content_disposition('form-data', name='user')
            async with session.post(
                f'{self.config["BaseURL"]}/files/upload', headers=headers, data=multipart_data
            ) as resp:
                resp = await resp.json()
                # TODO: protocol need to support file id
                return resp['id']

    def to_msg_record(self, msg: dict, is_from_self: bool = False, is_final: bool = True) -> MsgRecord:
        token_stat = None
        if "metadata" in msg:
            metadata = msg["metadata"]
            if "usage" in metadata:
                token_stat = _TokenStat(TokenCount = metadata["usage"]["total_tokens"])
        return MsgRecord(
            RecordId = msg['id'] if is_from_self else f"{msg['id']}-a",
            SessionId = msg['conversation_id'],
            Content = msg['query'] if is_from_self else (msg['answer'] if 'answer' in msg else ''),
            IsFromSelf = is_from_self,
            IsLlmGenerated = not is_from_self,
            IsFinal = is_final,
            CanRating = is_final,
            Score=0,
            Timestamp = msg['created_at'],
            TokenStat = token_stat,
        )


def get_class():
    return Dify
