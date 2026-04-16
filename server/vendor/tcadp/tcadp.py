import logging
from typing import Any
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
    Content,
    ContentType,
    EventType,
    Message,
    MessageExtraInfo,
    MessageType,
    Record,
    RecordExtraInfo,
    RecordRole,
    ErrorInfo,
    extract_text_from_contents,
)
from util.helper import to_event
from util.json_format import custom_dumps


class TCADP(BaseVendor):
    @staticmethod
    def _is_v2_record(record_data: dict[str, Any]) -> bool:
        return all(field in record_data for field in ('Role', 'RecordId', 'ConversationId', 'Status'))

    @staticmethod
    def _normalize_status(status: Any, default: str = 'completed') -> str:
        if status is None:
            return default

        value = str(status).strip().lower()
        if value in {'success', 'stop', 'done', 'finish', 'finished', 'completed'}:
            return 'completed'
        if value in {'processing', 'running', 'in_progress', 'pending'}:
            return 'processing'
        if value in {'failed', 'fail', 'error'}:
            return 'failed'
        return value or default

    @staticmethod
    def _to_int(value: Any) -> int | None:
        if value is None or value == '':
            return None
        try:
            return int(value)
        except (TypeError, ValueError):
            return None

    @classmethod
    def _normalize_quote_infos(cls, quote_infos: list[dict[str, Any]] | None) -> list[dict[str, int]] | None:
        normalized: list[dict[str, int]] = []
        for item in quote_infos or []:
            if not isinstance(item, dict):
                continue
            position = cls._to_int(item.get('Position'))
            index = cls._to_int(item.get('Index'))
            if position is None or index is None:
                continue
            normalized.append({
                'Position': position,
                'Index': index,
            })
        return normalized or None

    @staticmethod
    def _normalize_option_cards(option_cards: list[Any] | None) -> list[str] | None:
        normalized: list[str] = []
        for item in option_cards or []:
            if isinstance(item, str) and item:
                normalized.append(item)
                continue
            if not isinstance(item, dict):
                continue
            for key in ('Text', 'Title', 'Name', 'Label', 'Content'):
                value = item.get(key)
                if isinstance(value, str) and value:
                    normalized.append(value)
                    break
        return normalized or None

    @classmethod
    def _normalize_references(cls, references: list[dict[str, Any]] | None) -> list[dict[str, Any]] | None:
        normalized: list[dict[str, Any]] = []

        for idx, item in enumerate(references or []):
            if not isinstance(item, dict):
                continue

            reference: dict[str, Any] = {
                'Index': cls._to_int(item.get('Index')) if item.get('Index') is not None else idx,
                'Type': cls._to_int(item.get('Type')) or 0,
                'Name': (
                    item.get('Name')
                    or item.get('DocName')
                    or item.get('Title')
                    or item.get('Url')
                    or f'Reference {idx + 1}'
                ),
            }

            refer_biz_id = item.get('ReferBizId') or item.get('Id')
            doc_biz_id = item.get('DocBizId') or item.get('DocId')
            qa_biz_id = item.get('QaBizId')
            knowledge_biz_id = item.get('KnowledgeBizId')
            knowledge_name = item.get('KnowledgeName')
            url = item.get('Url') or item.get('DisplayUrl') or item.get('PageUrl')

            if doc_biz_id or item.get('DocName') or knowledge_biz_id or refer_biz_id:
                reference['DocRefer'] = {
                    'ReferBizId': str(refer_biz_id or doc_biz_id or f'ref_{idx}'),
                    'DocBizId': str(doc_biz_id or ''),
                    'DocName': item.get('DocName') or reference['Name'],
                    'KnowledgeBizId': str(knowledge_biz_id or ''),
                    'KnowledgeName': knowledge_name,
                    'Url': url or '',
                }

            if qa_biz_id:
                reference['QaRefer'] = {
                    'ReferBizId': str(refer_biz_id or qa_biz_id),
                    'QaBizId': str(qa_biz_id),
                    'KnowledgeBizId': str(knowledge_biz_id or ''),
                    'KnowledgeName': knowledge_name,
                }

            if url and 'DocRefer' not in reference and 'QaRefer' not in reference:
                reference['WebSearchRefer'] = {
                    'Url': url,
                }

            normalized.append(reference)

        return normalized or None

    @classmethod
    def _build_text_content(cls, record_data: dict[str, Any]) -> Content:
        content_payload: dict[str, Any] = {
            'Type': ContentType.TEXT,
            'Text': record_data.get('Content') or '',
        }

        quote_infos = cls._normalize_quote_infos(record_data.get('QuoteInfos'))
        if quote_infos:
            content_payload['QuoteInfos'] = quote_infos

        references = cls._normalize_references(record_data.get('References'))
        if references:
            content_payload['References'] = references

        option_cards = cls._normalize_option_cards(record_data.get('OptionCards'))
        if option_cards:
            content_payload['OptionCards'] = option_cards

        related_record_id = record_data.get('RelatedRecordId')
        if related_record_id:
            content_payload['RelatedRecordId'] = related_record_id

        file_collection = record_data.get('FileCollection')
        if isinstance(file_collection, dict):
            content_payload['FileCollection'] = file_collection

        return Content.model_validate(content_payload)

    @staticmethod
    def _build_file_content(file_info: dict[str, Any]) -> Content | None:
        if not isinstance(file_info, dict):
            return None

        file_name = file_info.get('FileName') or file_info.get('Name')
        file_url = file_info.get('FileUrl') or file_info.get('Url')
        if not file_name or not file_url:
            return None

        file_payload = {
            'FileName': file_name,
            'FileSize': str(file_info.get('FileSize') or '0'),
            'FileUrl': file_url,
            'FileType': file_info.get('FileType') or '',
            'Url': file_info.get('Url') or file_url,
        }
        return Content(
            Type=ContentType.FILE,
            File=file_payload,
        )

    @staticmethod
    def _stringify_content_value(value: Any, default: str = '') -> str:
        if value is None:
            return default
        if isinstance(value, str):
            return value
        if isinstance(value, (dict, list)):
            return custom_dumps(value)
        return str(value)

    @classmethod
    def _build_widget_content(cls, widget_info: dict[str, Any]) -> Content | None:
        if not isinstance(widget_info, dict):
            return None

        widget_id = widget_info.get('WidgetId')
        widget_run_id = widget_info.get('WidgetRunId')
        if not widget_id or not widget_run_id:
            return None

        widget_payload: dict[str, Any] = {
            'WidgetId': str(widget_id),
            'WidgetRunId': str(widget_run_id),
            'State': cls._stringify_content_value(widget_info.get('State')),
            'EncodedWidget': cls._stringify_content_value(widget_info.get('EncodedWidget')),
            'View': cls._stringify_content_value(widget_info.get('View')) if widget_info.get('View') is not None else None,
            'Payload': cls._stringify_content_value(widget_info.get('Payload')) if widget_info.get('Payload') is not None else None,
        }

        position = cls._to_int(widget_info.get('Position'))
        if position is not None:
            widget_payload['Position'] = position

        return Content.model_validate({
            'Type': ContentType.WIDGET,
            'Widget': widget_payload,
        })

    @classmethod
    def _build_widget_action_content(cls, widget_action: dict[str, Any]) -> Content | None:
        if not isinstance(widget_action, dict):
            return None

        widget_id = widget_action.get('WidgetId')
        widget_run_id = widget_action.get('WidgetRunId')
        action_type = widget_action.get('ActionType')
        if not widget_id or not widget_run_id or not action_type:
            return None

        widget_action_payload: dict[str, Any] = {
            'WidgetId': str(widget_id),
            'WidgetRunId': str(widget_run_id),
            'ActionType': str(action_type),
            'Payload': cls._stringify_content_value(widget_action.get('Payload')),
        }

        doc_biz_id = widget_action.get('DocBizId')
        if doc_biz_id is not None:
            widget_action_payload['DocBizId'] = str(doc_biz_id)

        return Content.model_validate({
            'Type': ContentType.WIDGET_ACTION,
            'WidgetAction': widget_action_payload,
        })

    @classmethod
    def _build_reply_contents(cls, record_data: dict[str, Any]) -> list[Content]:
        contents: list[Content] = []

        text_content = cls._build_text_content(record_data)
        if any((
            text_content.Text,
            text_content.QuoteInfos,
            text_content.References,
            text_content.OptionCards,
            text_content.FileCollection,
        )):
            contents.append(text_content)

        contents.extend(
            content
            for content in (
                cls._build_file_content(file_info)
                for file_info in (record_data.get('FileInfos') or [])
            )
            if content is not None
        )

        widget_entries: list[tuple[int, dict[str, Any]]] = []
        raw_widgets = record_data.get('Widgets')
        if isinstance(raw_widgets, list):
            widget_entries.extend(
                (idx, widget_info)
                for idx, widget_info in enumerate(raw_widgets)
                if isinstance(widget_info, dict)
            )
        elif isinstance(raw_widgets, dict):
            widget_entries.append((0, raw_widgets))

        single_widget = record_data.get('Widget')
        if isinstance(single_widget, dict):
            widget_entries.append((len(widget_entries), single_widget))

        for _, widget_info in sorted(
            widget_entries,
            key=lambda item: (
                cls._to_int(item[1].get('Position')) is None,
                cls._to_int(item[1].get('Position')) or 0,
                item[0],
            ),
        ):
            widget_content = cls._build_widget_content(widget_info)
            if widget_content is not None:
                contents.append(widget_content)

        widget_action_content = cls._build_widget_action_content(record_data.get('WidgetAction'))
        if widget_action_content is not None:
            contents.append(widget_action_content)

        return contents

    @classmethod
    def _extract_thought_text(cls, procedure: dict[str, Any]) -> str:
        debugging = procedure.get('Debugging')
        if not isinstance(debugging, dict):
            return ''

        display_content = debugging.get('DisplayContent')
        if isinstance(display_content, str):
            text = display_content.strip()
            if text:
                return text

        content = debugging.get('Content')
        if isinstance(content, str):
            return content.strip()

        return ''

    @classmethod
    def _build_thought_message(
        cls,
        record_id: str,
        procedure: dict[str, Any],
        index: int,
    ) -> Message | None:
        if not isinstance(procedure, dict):
            return None

        thought_text = cls._extract_thought_text(procedure)
        if not thought_text:
            return None

        debugging = procedure.get('Debugging') if isinstance(procedure.get('Debugging'), dict) else {}
        content_payload: dict[str, Any] = {
            'Type': ContentType.TEXT,
            'Text': thought_text,
        }

        quote_infos = cls._normalize_quote_infos(debugging.get('QuoteInfos'))
        if quote_infos:
            content_payload['QuoteInfos'] = quote_infos

        references = cls._normalize_references(debugging.get('References'))
        if references:
            content_payload['References'] = references

        sandbox_url = debugging.get('SandboxUrl')
        display_url = debugging.get('DisplayUrl')
        if sandbox_url or display_url:
            content_payload['Sandbox'] = {
                'Url': sandbox_url,
                'DisplayUrl': display_url,
            }

        option_cards = cls._normalize_option_cards(
            (debugging.get('WorkFlow') or {}).get('OptionCards')
            if isinstance(debugging.get('WorkFlow'), dict) else None
        )
        if option_cards:
            content_payload['OptionCards'] = option_cards

        message_extra_info: dict[str, Any] = {}
        for key in ('Elapsed', 'StartTime'):
            if procedure.get(key) is not None:
                message_extra_info[key] = procedure.get(key)
        agent_name = procedure.get('TargetAgentName') or procedure.get('SourceAgentName')
        if agent_name:
            message_extra_info['AgentName'] = agent_name
        if procedure.get('AgentIcon'):
            message_extra_info['AgentIcon'] = procedure.get('AgentIcon')
        if procedure.get('Name'):
            message_extra_info['ToolName'] = procedure.get('Name')
        if procedure.get('Icon'):
            message_extra_info['ToolIcon'] = procedure.get('Icon')

        message_payload: dict[str, Any] = {
            'Type': MessageType.THOUGHT,
            'MessageId': f'{record_id}_thought_{index}',
            'Name': procedure.get('Name') or f'thought_{index}',
            'Title': procedure.get('Title') or procedure.get('Name') or '思考',
            'Icon': procedure.get('Icon'),
            'Status': cls._normalize_status(procedure.get('Status')),
            'StatusDesc': debugging.get('DisplayStatus') if isinstance(debugging.get('DisplayStatus'), str) else None,
            'Contents': [Content.model_validate(content_payload)],
        }
        if message_extra_info:
            message_payload['ExtraInfo'] = MessageExtraInfo.model_validate(message_extra_info)

        return Message.model_validate(message_payload)

    @classmethod
    def _convert_legacy_record(
        cls,
        record_data: dict[str, Any],
        conversation_id: str,
    ) -> Record:
        record_id = record_data.get('RecordId') or ''
        is_from_self = bool(record_data.get('IsFromSelf'))
        role = RecordRole.USER if is_from_self else RecordRole.ASSISTANT

        messages: list[Message] = [
            Message(
                Type=MessageType.REPLY,
                MessageId=f'{record_id}_reply',
                Name='',
                Title='',
                Status='completed',
                Contents=cls._build_reply_contents(record_data),
            )
        ]

        agent_thought = record_data.get('AgentThought')
        if isinstance(agent_thought, dict):
            for idx, procedure in enumerate(agent_thought.get('Procedures') or []):
                thought_message = cls._build_thought_message(record_id, procedure, idx)
                if thought_message is not None:
                    messages.append(thought_message)

        extra_info_payload: dict[str, Any] = {
            'IsFromSelf': is_from_self,
            'IsLlmGenerated': record_data.get('IsLlmGenerated'),
            'CanRating': record_data.get('CanRating'),
            'CanFeedback': record_data.get('CanFeedback'),
            'ReplyMethod': record_data.get('ReplyMethod'),
            'FromName': record_data.get('FromName'),
            'FromAvatar': record_data.get('FromAvatar'),
            'HasRead': record_data.get('HasRead'),
        }
        if isinstance(agent_thought, dict):
            for key in ('RequestId', 'TraceId', 'Elapsed'):
                if agent_thought.get(key) is not None:
                    extra_info_payload[key] = agent_thought.get(key)

        record_payload = {
            'Role': role,
            'RecordId': record_id,
            'RelatedRecordId': record_data.get('RelatedRecordId') or None,
            'ConversationId': conversation_id or record_data.get('SessionId') or '',
            'Status': cls._normalize_status(record_data.get('Status')),
            'StatusDesc': record_data.get('StatusDesc'),
            'Messages': messages,
            'ExtraInfo': RecordExtraInfo.model_validate(extra_info_payload),
        }
        return Record.model_validate(record_payload)

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

        records = []
        for record_data in resp['Response']['Records']:
            if self._is_v2_record(record_data):
                record = Record.model_validate(record_data)
            else:
                logging.error(json.dumps(record_data))
                record = self._convert_legacy_record(record_data, conversation_id)
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
        if custom_variables:
            contents.append({"Type": "custom_variables", "CustomVariables": custom_variables})

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
                "VisitorId": account_id,
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
