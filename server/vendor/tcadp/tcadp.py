import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sanic.request.types import Request
import asyncio
import aiohttp
import json
from util.tca import tc_request
from util.warehouse import AsyncWareHouseS3

from core.completion import CoreCompletion
from config import tagentic_config
from vendor.interface import (
    BaseVendor,
    ApplicationInfo,
    ConversationCallback,
    EventType,
    Record,
    ErrorInfo,
    extract_text_from_contents,
)
from util.helper import to_event
from util.json_format import custom_dumps


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
        else:
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
                ApplicationId=self.application_id,
                Name='Unknown',
                Greeting='Please check your AppKey/SseURL/TC_SECRET_ID/TC_SECRET_KEY',
            )
        else:
            return ApplicationInfo(
                ApplicationId=self.application_id,
                Name=resp['Response']['BaseConfig']['Name'],
                Avatar=resp['Response']['BaseConfig']['Avatar'],
                Greeting=resp['Response']['AppConfig']['KnowledgeQa']['Greeting'],
                OpeningQuestions=resp['Response']['AppConfig']['KnowledgeQa']['OpeningQuestions'],
            )

    # MessageInterface - V2 Protocol
    async def get_messages(
        self,
        db: AsyncSession,
        account_id: str,
        conversation_id: str,
        limit: int, last_record_id: str = None
    ) -> list[Record]:
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

        # Parse V2 Records directly from response
        records = []
        for record_data in resp['Response']['Records']:
            record = Record.model_validate(record_data)
            records.append(record)
        return records

    # ChatInterface - V2 Protocol
    async def chat(
        self,
        account_id: str,
        contents: list,
        conversation_id: str,
        is_new_conversation: bool,
        conversation_cb: ConversationCallback,
        search_network=True,
        custom_variables={}
    ):
        if not contents:
            contents = [{"Type": "text", "Text": ""}]

        if is_new_conversation:
            conversation = await conversation_cb.create()
            yield to_event(EventType.CONVERSATION, conversation=conversation, is_new_conversation=True)
            conversation_id = str(conversation.Id)

        timeout = aiohttp.ClientTimeout(total=None, sock_read=tagentic_config.SERVER_RESPONSE_TIMEOUT)
        async with aiohttp.ClientSession(read_bufsize=1*1024*1024, timeout=timeout) as session:
            param = {
                "ConversationId": conversation_id,
                "AppKey": self.config['AppKey'],
                "Contents": contents,
                "Incremental": True,
                "EnableMultiIntent": True,
                "Stream": "enable",
            }
            headers = {
                "Accept": "text/event-stream",
                "Content-Type": "application/json",
            }

            reply_text = ""

            async with session.post(self.tc_config()['sse'], headers=headers, data=json.dumps(param)) as resp:
                if resp.status != 200:
                    logging.error(f"Failed to chat: {resp}")
                    error_info = ErrorInfo(
                        Code=resp.status,
                        Message=f"SSE error: {resp.status}",
                    )
                    yield to_event(EventType.ERROR, error=error_info)
                    return

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
                            try:
                                data = json.loads(data)
                            except json.JSONDecodeError:
                                continue
                            event_type = data.get('Type', '')

                            # Collect reply text for title generation
                            if event_type == 'text.delta':
                                reply_text += data.get('Text', '')
                            # Forward V2 event directly
                            yield f'data: {custom_dumps(data)}\n\n'.encode('utf-8')

                except asyncio.CancelledError:
                    logging.info("forward_request: cancelled")
                    resp.close()

            logging.info("forward_request: done")

        # Update conversation
        try:
            summarize = None
            if is_new_conversation:
                query_text = extract_text_from_contents(contents).strip()
                if not query_text:
                    query_text = "New Chat"
                prompt = '请从以下对话中提取一个最核心的主题，用于对话列表展示。要求：\n1. 用5-10个汉字概括\n2. 优先选择：最新进展/待解决问题/双方共识\n请直接输出提炼结果，不要解释。'
                completion = CoreCompletion(
                    self.tc_config(),
                    system_prompt=prompt
                )
                summarize = await completion.chat(f'user: {query_text}\n\nassistance: {reply_text[:200]}')
            conversation = await conversation_cb.update(conversation_id=conversation_id, title=summarize)
            yield to_event(EventType.CONVERSATION, conversation=conversation, is_new_conversation=False)
        except Exception as e:
            logging.error(f'failed to summarize conversation title. error: {e}')

    # FileInterface:
    async def upload(self, db: AsyncSession, request: Request, account_id: str, mime_type: str) -> str:
        action = "DescribeStorageCredential"
        payload = {
            "BotBizId": self.config['BotBizId'],
            "FileType": mime_type.split("/")[-1],
            "IsPublic": True,
            "TypeKey": 'realtime',
        }
        resp = await tc_request(self.tc_config(), action, payload)
        resp = resp['Response']
        if 'Error' in resp:
            logging.error(resp)
            raise Exception(resp['Error']['Message'])

        cos = AsyncWareHouseS3(
            secretId=resp['Credentials']['TmpSecretId'],
            secretKey=resp['Credentials']['TmpSecretKey'],
            tmpToken=resp['Credentials']['Token'],
            region=resp['Region'],
            bucket=resp['Bucket'],
            config=self.tc_config()['cos'],
        )

        async with cos.put_multipart(resp['UploadPath']) as uploader:
            while True:
                body = await request.stream.read()
                if body is None:
                    break
                print(f'upload: {len(body)}')
                await uploader.write(body)

        url = cos.get_full_url(resp['UploadPath'])
        return url

    # FeedbackInterface
    async def rate(
        self,
        db: AsyncSession,
        account_id: str,
        conversation_id: str,
        record_id: str, score: int,
        comment: str = None
    ) -> None:
        action = "RateMsgRecord"
        payload = {
            "RecordId": record_id,
            "Score": 1 if score == 1 else 2,
            "BotAppKey": self.config['AppKey'],
        }
        await tc_request(self.tc_config(), action, payload)

    async def get_reference_details(
        self,
        account_id: str | None,
        reference_ids: list[str],
    ) -> list[dict]:
        del account_id

        unique_reference_ids = []
        seen_reference_ids = set()
        for reference_id in reference_ids:
            if not reference_id or reference_id in seen_reference_ids:
                continue
            seen_reference_ids.add(reference_id)
            unique_reference_ids.append(reference_id)

        if not unique_reference_ids:
            return []

        action = "DescribeRefer"
        payload = {
            "BotBizId": self.config['BotBizId'],
            "ReferBizIds": unique_reference_ids,
        }
        resp = await tc_request(self.tc_config(), action, payload)
        response = resp.get('Response', resp)
        if 'Error' in response:
            logging.error(resp)
            raise Exception(response['Error']['Message'])

        detail_map = {}
        for item in response.get('List', []):
            detail = dict(item)
            refer_biz_id = detail.get('ReferBizId')
            if refer_biz_id and 'Id' not in detail:
                detail['Id'] = refer_biz_id
            if detail.get('DocName') and 'Name' not in detail:
                detail['Name'] = detail['DocName']
            detail_id = detail.get('Id', refer_biz_id)
            if detail_id:
                detail_map[detail_id] = detail

        return [detail_map[reference_id] for reference_id in unique_reference_ids if reference_id in detail_map]

    def tc_config_private_url(self, config: dict, private_url: str) -> dict:
        for key, value in config.items():
            if type(value) is str:
                value = value.replace('{PrivateUrl}', private_url)
            elif type(value) is dict:
                value = self.tc_config_private_url(value, private_url)
            config[key] = value
        return config

    def tc_config(self):
        private = self.config.get('Private', False)
        private_url = self.config.get('PrivateUrl', '')
        international = self.config.get('International', False)
        if international:
            return service_configs['International']
        if private:
            config = json.loads(json.dumps(service_configs['Private']))
            config = self.tc_config_private_url(config, private_url)
            return config
        return service_configs['China']


service_configs = {
    'Private': {
        'lke': {
            'url': '{PrivateUrl}',
            'region': 'ap-guangzhou',
            "version": "2023-11-30"
        },
        'lkeap': {
            'url': '{PrivateUrl}',
            'region': 'ap-jakarta',
            "version": "2024-05-22"
        },
        'cos': {
            'ep': '{PrivateUrl}',
            'access': '{PrivateUrl}/{bucket}',
            'addressing_style': 'path'
        },
        'sse': '{PrivateUrl}/v1/qbot/chat/sse'
    },
    'International': {
        'lke': {
            'url': 'https://lke.intl.tencentcloudapi.com',
            'region': 'ap-jakarta',
            "version": "2023-11-30"
        },
        'lkeap': {
            'url': 'https://lkeap.intl.tencentcloudapi.com',
            'region': 'ap-jakarta',
            "version": "2024-05-22"
        },
        'cos': {
            'ep': 'http://cos.{region}.myqcloud.com',
            'access': 'http://{bucket}.cos.{region}.myqcloud.com'
        },
        'sse': 'https://wss.lke.tencentcloud.com/adp/v2/chat'
    },
    'China': {
        'lke': {
            'url': 'https://lke.tencentcloudapi.com',
            'region': 'ap-guangzhou',
            "version": "2023-11-30"
        },
        'lkeap': {
            'url': 'https://lkeap.tencentcloudapi.com',
            'region': 'ap-guangzhou',
            "version": "2024-05-22"
        },
        'cos': {
            'ep': 'http://cos.{region}.myqcloud.com',
            'access': 'http://{bucket}.cos.{region}.myqcloud.com'
        },
        'sse': 'https://wss.lke.cloud.tencent.com/adp/v2/chat'
    }
}


def get_class():
    return TCADP
