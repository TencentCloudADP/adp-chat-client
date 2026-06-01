import logging
import re
from typing import Any
from urllib.parse import quote
from sqlalchemy.ext.asyncio import AsyncSession
from sanic.request.types import Request
import asyncio
import aiohttp
import json
from util.tca import tc_request
from util.warehouse import AsyncWareHouseS3
from util.cos import upload, get_presigned_download_url, get_presigned_preview_url

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

    # =========================================================================
    # 通用转发方法
    # =========================================================================

    async def forward_request(
        self,
        action: str,
        payload: dict = None,
        service: str = "lke",
        *,
        version: str = None,
        response_key: str = None,
        raise_on_error: bool = True,
        variables: dict = None,
    ) -> dict:
        """通用腾讯云 API 转发方法（公开接口）

        将请求转发到腾讯云后端接口，统一处理签名、错误检查和响应解析。
        当前端传入的 Action 名称没有对应的具体实现方法时，可直接通过此方法转发。

        Args:
            action: 腾讯云 API Action 名称，如 "GetMsgRecord"、"RateMsgRecord"
            payload: 请求参数字典，为 None 时传空 dict
            service: 服务名称，默认 "lke"，用于选择签名配置
            version: API 版本号，为 None 时使用 service 配置中的默认版本
            response_key: 如果指定，从 Response 中提取该 key 的值返回；
                         为 None 时返回整个 Response dict
            raise_on_error: 为 True 时遇到 Error 抛异常；为 False 时返回包含 Error 的原始响应
            variables: 模板变量字典，用于替换 action_version.json 配置中的 {{VAR}} 占位符，
                      如 {"APP_KEY": "xxx", "ACCOUNT_ID": "yyy"}

        Returns:
            dict: 腾讯云 API 响应的 Response 部分（或 response_key 对应的子结构）

        Raises:
            Exception: 当 raise_on_error=True 且响应包含 Error 时抛出
        """
        if payload is None:
            payload = {}

        logging.info(f'[TCADP.forward_request] action={action}, service={service}, version={version}, payload={payload}')
        resp = await tc_request(self.tc_config(), action, payload, service, version, variables=variables)
        response = resp.get('Response', resp)

        if 'Error' in response:
            logging.error(f'[TCADP.forward_request] action={action} error={response["Error"]}')
            if raise_on_error:
                error_msg = response['Error'].get('Message', str(response['Error']))
                raise Exception(f'{action} failed: {error_msg}')
            return response

        if response_key is not None:
            return response.get(response_key)

        return response

    # 保留内部别名，兼容已重构的方法
    _forward_request = forward_request

    # =========================================================================
    # 实时文档解析
    # =========================================================================

    async def parse_document(
        self,
        account_id: str,
        file_name: str,
        file_type: str,
        file_url: str = '',
        cos_bucket: str = '',
        cos_url: str = '',
        e_tag: str = '',
        cos_hash: str = '',
        size: str = '0',
        conversation_id: str = '',
    ):
        """代理 LKE 的实时文档解析 SSE 接口

        上传文件到 COS 后，调用此方法进行文档解析获取 doc_id。
        Standard 模式下发送消息时需要传入 doc_id 让大模型正确解析文件。
        """
        tc_cfg = self.tc_config()
        # docParse SSE 端点与 chat SSE 同域，路径为 /v1/qbot/chat/docParse
        sse_base = tc_cfg['sse'].rsplit('/adp/', 1)[0] if '/adp/' in tc_cfg['sse'] else tc_cfg['sse'].rsplit('/v1/', 1)[0] if '/v1/' in tc_cfg['sse'] else tc_cfg['sse']
        doc_parse_url = f"{sse_base}/v1/qbot/chat/docParse"

        data = {
            "cos_bucket": cos_bucket,
            "file_type": file_type,
            "file_name": file_name,
            "cos_url": cos_url,
            "e_tag": e_tag,
            "cos_hash": cos_hash,
            "size": size,
            "bot_app_key": self.config['AppKey'],
        }
        if conversation_id:
            data["session_id"] = conversation_id

        logging.info(f"[parse_document] url={doc_parse_url}, file_name={file_name}")

        timeout = aiohttp.ClientTimeout(total=120)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.post(
                doc_parse_url,
                headers={"Content-Type": "application/json", "Accept": "text/event-stream"},
                data=json.dumps(data)
            ) as resp:
                if resp.status != 200:
                    error_text = await resp.text()
                    logging.error(f"[parse_document] failed: status={resp.status}, body={error_text}")
                    yield f'data: {json.dumps({"type": "error", "payload": {"doc_id": "0", "process": 0, "status": "FAILED", "error_message": f"Parse request failed: {resp.status}"}})}\n\n'.encode('utf-8')
                    return

                async for line in resp.content:
                    decoded = line.decode('utf-8')
                    if decoded.strip():
                        yield f'{decoded}\n'.encode('utf-8') if not decoded.endswith('\n') else decoded.encode('utf-8')

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
            return ApplicationInfo(
                ApplicationId=self.application_id,
                Name='Unknown',
                Greeting='Please check your AppKey/SseURL/TC_SECRET_ID/TC_SECRET_KEY',
            )

        BotBizId = resp['Response']['BotBizId']
        self.config['BotBizId'] = BotBizId

        action = "DescribeAppConf"
        payload = {
            "AppBizId": BotBizId,
            "AppType": "knowledge_qa",
        }
        resp = await tc_request(self.tc_config(), action, payload)

        if 'Error' in resp['Response']:
            logging.error(resp)
            return ApplicationInfo(
                ApplicationId=self.application_id,
                Name='Unknown',
                Greeting='Please check your AppKey/SseURL/TC_SECRET_ID/TC_SECRET_KEY',
            )

        response = resp['Response']
        app_config = response.get('AppConfig', {})
        base_config = response.get('BaseConfig', {})

        # V2 格式：从 app_config 中提取配置
        base = app_config.get('Base', {})
        greeting_config = app_config.get('Greeting', {})
        conversation_experience = app_config.get('ConversationExperience', {})
        search_engine = app_config.get('SearchEngine', {})

        # 输入框配置
        input_box_config = conversation_experience.get('InputBoxConfig', {})
        input_box_buttons = input_box_config.get('InputBoxButtons', [])

        from vendor.interface import InputBoxButton, InputBoxConfig
        buttons = []
        for btn in input_box_buttons:
            if isinstance(btn, dict):
                buttons.append(InputBoxButton(Type=btn.get('Type', 0), Name=btn.get('Name')))
            elif isinstance(btn, int):
                buttons.append(InputBoxButton(Type=btn))
            else:
                buttons.append(InputBoxButton(Type=int(btn)))

        return ApplicationInfo(
            ApplicationId=self.application_id,
            Name=base_config.get('Name') or base.get('Name', ''),
            Avatar=base_config.get('Avatar') or base.get('Avatar', ''),
            Greeting=greeting_config.get('Greeting'),
            OpeningQuestions=greeting_config.get('OpeningQuestions', []),
            Pattern=base.get('Pattern'),
            AppStatus=response.get('AppStatus'),
            AgentType=response.get('AgentType'),
            InputBox=InputBoxConfig(InputBoxButtons=buttons) if buttons else None,
            EnableWebSearch=search_engine.get('UseSearchEngine', False),
            EnableAudit=base.get('EnableAudit', False),
        )

    # MessageInterface - V2 Protocol
    async def get_messages(
        self,
        db: AsyncSession,
        account_id: str,
        conversation_id: str,
        limit: int, last_record_id: str = None
    ) -> list[dict]:
        """获取历史消息列表，透传 GetMsgRecord 上游返回的所有字段"""
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
                records.append(record_data)
            else:
                converted = self._convert_legacy_record(record_data, conversation_id)
                result = converted.model_dump(exclude_none=True)
                # 将上游原始字段补充到转换结果中（不覆盖已转换的字段）
                for key, value in record_data.items():
                    if key not in result and value is not None:
                        result[key] = value
                records.append(result)
        return records

    async def get_messages_v2(
        self,
        db: AsyncSession,
        account_id: str,
        conversation_id: str,
        limit: int,
        last_record_id: str = None
    ) -> dict:
        """通过 DescribeConversationMessageList 获取完整 V2 格式历史消息（含 tool_call/Procedures 等）

        返回数据会按 RecordId 分组，转换为前端 V2 Record 格式。
        如果上游已经返回的是分组后的 Record 格式（含 Messages 数组），则直接透传。
        """
        action = "DescribeConversationMessageList"
        payload = {
            "ConversationId": conversation_id,
            "Limit": limit,
            "Type": 5,
            "UserId": account_id,
            "AppKey": self.config['AppKey'],
            "RecordQueryDirection": 1,
        }
        if last_record_id:
            payload['RecordId'] = last_record_id

        resp = await tc_request(self.tc_config(), action, payload, version='2025-11-12')
        response = resp.get('Response', resp)
        if 'Error' in response:
            raise Exception(response['Error'])

        raw_messages = response.get('Messages', [])
        records = self._convert_messages_to_records(raw_messages, conversation_id)

        return {
            'Records': records,
            'HasMoreBefore': response.get('HasMoreBefore', False),
            'HasMoreAfter': response.get('HasMoreAfter', False),
            'FirstRecordId': response.get('FirstRecordId', ''),
            'LastRecordId': response.get('LastRecordId', ''),
        }

    @staticmethod
    def _convert_messages_to_records(messages: list, conversation_id: str) -> list:
        """将 DescribeConversationMessageList 返回的消息列表转换为 V2 Record 格式

        上游可能返回两种格式：
        1. 已分组的 Record 格式（含 Role/RecordId/Messages 字段） → 直接透传
        2. 扁平的 ConversationMessage 格式（每条含 RecordId 标识归属） → 按 RecordId 分组
        """
        if not messages:
            return []

        first = messages[0]
        # 判断是否已经是分组的 Record 格式
        if 'Messages' in first and isinstance(first.get('Messages'), list):
            return messages

        # 扁平格式：按 RecordId 分组
        from collections import OrderedDict
        groups: OrderedDict = OrderedDict()

        for msg in messages:
            record_id = msg.get('RecordId', '')
            if not record_id:
                continue

            if record_id not in groups:
                groups[record_id] = {
                    'Role': msg.get('Role', 'assistant'),
                    'RecordId': record_id,
                    'ConversationId': msg.get('ConversationId', conversation_id),
                    'Status': msg.get('Status', 'completed'),
                    'StatusDesc': msg.get('StatusDesc', ''),
                    'Messages': [],
                    'ExtraInfo': msg.get('ExtraInfo'),
                }

            # 将当前 message 作为 Record.Messages 中的一条
            groups[record_id]['Messages'].append({
                'Type': msg.get('Type', 'reply'),
                'MessageId': msg.get('MessageId', ''),
                'Name': msg.get('Name', ''),
                'Title': msg.get('Title', ''),
                'Icon': msg.get('Icon', ''),
                'Status': msg.get('Status', 'completed'),
                'StatusDesc': msg.get('StatusDesc', ''),
                'Contents': msg.get('Contents', []),
                'ExtraInfo': msg.get('ExtraInfo'),
                'RecordId': record_id,
            })

        return list(groups.values())

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

        if not conversation_id:
            logging.error(f"[TCADP.chat] ConversationId is empty after creation, aborting SSE request")
            error_info = ErrorInfo(Code=400, Message="ConversationId is required")
            yield to_event(EventType.ERROR, error=error_info)
            return

        if not account_id:
            account_id = "anonymous"

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
            logging.info(f"[TCADP.chat] SSE param: ConversationId={conversation_id!r}, VisitorId={account_id!r}, is_new={is_new_conversation}")
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

    # FilesystemInterface:
    async def list_dir(self, app_id: str, path: str, depth: int = 1, workspace_id = "") -> dict:
        """调用 CreateWorkspaceCredential 获取凭证后，再请求 ListDir 接口获取目录列表

        Args:
            app_id: 前端传入的 ApplicationId
            path: 目录路径，如 /workdir 或更深的子路径
            depth: 遍历深度，默认 1

        Returns:
            dict: ListDir 接口返回的 JSON 数据，包含 entries 列表

        Raises:
            Exception: 当凭证获取或 ListDir 请求失败时抛出
        """
        # Step 1: 通过通用转发协议调用 CreateWorkspaceCredential 获取凭证
        credential_payload = {
            "AppId": app_id,
            "Type": 2,
            "WorkspaceId": workspace_id
        }
        credential_resp = await self.forward_request(
            action="CreateWorkspaceCredential",
            payload=credential_payload,
        )        
        logging.info(f'credential_resp: {credential_resp}')
        # 解析凭证信息
        credential = credential_resp.get('Credential', {})
        sandbox_storage = credential_resp.get('SandboxStorage', {})

        access_token = credential.get('AccessToken', '')
        domain = sandbox_storage.get('Domain', '')
        token_tag = sandbox_storage.get('TokenTag', '')

        if not access_token or not domain or not token_tag:
            raise Exception(
                f'CreateWorkspaceCredential 返回数据不完整: '
                f'AccessToken={bool(access_token)}, Domain={domain}, TokenTag={token_tag}'
            )

        # Step 2: 使用 Domain + TokenTag + AccessToken 拼接调用 ListDir
        url = f"{domain}/filesystem.Filesystem/ListDir"
        headers = {
            "Content-Type": "application/json",
            token_tag: access_token,  # 如 "X-File-Ticket": "<token>"
        }
        payload = {"path": path, "depth": depth}

        async with aiohttp.ClientSession() as session:
            async with session.post(
                url,
                json=payload,
                headers=headers,
                ssl=False,
            ) as resp:
                data = await resp.json()
                if resp.status != 200:
                    logging.error(
                        f'[TCADP.list_dir] path={path} status={resp.status} resp={data}'
                    )
                    raise Exception(
                        f'ListDir failed: status={resp.status}, '
                        f'code={data.get("code")}, message={data.get("message")}'
                    )
                return data

    async def fetch_file(self, app_id: str, workspace_id: str, path: str) -> dict:
        """通过 /files 接口获取文件内容

        流程：
            1. 先调用 CreateWorkspaceCredential 获取凭证
            2. 使用凭证拼接 GET {domain}{path} 获取文件

        Args:
            app_id: 应用 ID
            workspace_id: 工作空间 ID
            path: 文件路径，如 /workdir/main.py

        Returns:
            dict: 包含 status_code、content_type 和 content 的字典

        Raises:
            Exception: 当请求失败时抛出
        """
        # Step 1: 获取凭证
        credential_payload = {
            "AppId": app_id,
            "Type": 2,
            "WorkspaceId": workspace_id
        }
        credential_resp = await self.forward_request(
            action="CreateWorkspaceCredential",
            payload=credential_payload,
        )
        logging.info(f'[fetch_file] credential_resp: {credential_resp}')

        # 解析凭证信息
        credential = credential_resp.get('Credential', {})
        sandbox_storage = credential_resp.get('SandboxStorage', {})

        access_token = credential.get('AccessToken', '')
        domain = sandbox_storage.get('Domain', '')
        token_tag = sandbox_storage.get('TokenTag', '')

        if not access_token or not domain or not token_tag:
            raise Exception(
                f'CreateWorkspaceCredential 返回数据不完整: '
                f'AccessToken={bool(access_token)}, Domain={domain}, TokenTag={token_tag}'
            )

        # Step 2: 使用 Domain + TokenTag + AccessToken 调用 GET {domain}/files?path=<path>
        url = f"{domain}/files"
        params = {
            "path": path,
        }
        headers = {
            token_tag: access_token,
        }

        async with aiohttp.ClientSession() as session:
            async with session.get(
                url,
                params=params,
                headers=headers,
                ssl=False,
            ) as resp:
                content_type = resp.headers.get('Content-Type', '')
                content = await resp.read()  # 使用 read() 获取原始字节
                if resp.status != 200:
                    text = content.decode('utf-8', errors='replace')[:200]
                    logging.error(
                        f'[TCADP.fetch_file] path={path} status={resp.status} resp={text}'
                    )
                    raise Exception(
                        f'fetch_file failed: status={resp.status}, content={text}'
                    )

                # Step 3: 上传到 COS，路径为 app_id/path
                cos_key = f"{app_id}/{path}"  # 如 2059173834404121408/workdir/main.py
                # 去掉连续的 / 并去掉开头的 /
                cos_key = re.sub(r'/+', '/', cos_key).lstrip('/')
                download_url = ''
                preview_url = ''
                try:
                    import io
                    stream = io.BytesIO(content)
                    # 转存有时间消耗，暂时先不加 mq 了
                    upload(
                        stream=stream,
                        path=cos_key,
                        if_changed=True,
                    )
                    logging.info(f'[TCADP.fetch_file] uploaded to COS: {cos_key}')
                    # 生成预签名下载链接
                    download_url = get_presigned_download_url(key=cos_key)
                    logging.info(f'[TCADP.fetch_file] download URL: {download_url}')
                    # 生成预览链接（通过 CI 服务获取 WebOffice 预览地址）
                    preview_url = get_presigned_preview_url(key=cos_key)
                    logging.info(f'[TCADP.fetch_file] preview URL: {preview_url}')
                except Exception as e:
                    logging.error(f'[TCADP.fetch_file] upload to COS failed: {e}')

                return {
                    "status_code": resp.status,
                    "content_type": content_type,
                    "cos_url": download_url,
                    "preview_url": preview_url,
                }

    async def download_file_content(self, app_id: str, workspace_id: str, path: str) -> tuple:
        """从工作空间下载文件原始内容（不经过 COS 转存）

        用于后端代理下载场景：后端直接返回文件内容给前端，避免 COS 跨域问题。

        Args:
            app_id: 应用 ID
            workspace_id: 工作空间 ID
            path: 文件路径，如 /workdir/main.py

        Returns:
            tuple: (content_bytes, content_type, file_name)
                - content_bytes: 文件原始字节
                - content_type: MIME 类型
                - file_name: 文件名

        Raises:
            Exception: 当请求失败时抛出
        """
        # Step 1: 获取凭证
        credential_payload = {
            "AppId": app_id,
            "Type": 2,
            "WorkspaceId": workspace_id
        }
        credential_resp = await self.forward_request(
            action="CreateWorkspaceCredential",
            payload=credential_payload,
        )
        logging.info(f'[download_file_content] credential_resp received')

        # 解析凭证信息
        credential = credential_resp.get('Credential', {})
        sandbox_storage = credential_resp.get('SandboxStorage', {})

        access_token = credential.get('AccessToken', '')
        domain = sandbox_storage.get('Domain', '')
        token_tag = sandbox_storage.get('TokenTag', '')

        if not access_token or not domain or not token_tag:
            raise Exception(
                f'CreateWorkspaceCredential 返回数据不完整: '
                f'AccessToken={bool(access_token)}, Domain={domain}, TokenTag={token_tag}'
            )

        # Step 2: 下载文件
        url = f"{domain}/files"
        params = {"path": path}
        headers = {token_tag: access_token}

        async with aiohttp.ClientSession() as session:
            async with session.get(
                url,
                params=params,
                headers=headers,
                ssl=False,
            ) as resp:
                content_type = resp.headers.get('Content-Type', 'application/octet-stream')
                content = await resp.read()
                if resp.status != 200:
                    text = content.decode('utf-8', errors='replace')[:200]
                    logging.error(
                        f'[TCADP.download_file_content] path={path} status={resp.status} resp={text}'
                    )
                    raise Exception(
                        f'download_file_content failed: status={resp.status}, content={text}'
                    )

                # 从路径中提取文件名
                file_name = path.rsplit('/', 1)[-1] if '/' in path else path
                logging.info(
                    f'[TCADP.download_file_content] path={path} size={len(content)} '
                    f'content_type={content_type}'
                )
                return content, content_type, file_name

    @staticmethod
    def _resolve_file_type(mime_type: str) -> str:
        """将 MIME 类型转换为腾讯云 DescribeStorageCredential 接受的文件扩展名"""
        mime_to_ext = {
            'image/png': 'png',
            'image/jpg': 'jpg',
            'image/jpeg': 'jpeg',
            'image/bmp': 'bmp',
            'image/webp': 'webp',
            'image/gif': 'gif',
            'image/tiff': 'tiff',
            'application/pdf': 'pdf',
            'application/msword': 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            'application/vnd.ms-powerpoint': 'ppt',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
            'application/vnd.ms-excel': 'xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
            'text/plain': 'txt',
            'text/markdown': 'md',
            'text/csv': 'csv',
            'application/json': 'json',
        }
        ext = mime_to_ext.get(mime_type)
        if ext:
            return ext
        if mime_type.startswith('image/'):
            return mime_type.split('/')[-1]
        return mime_type.split('/')[-1]

    # FileInterface:
    async def upload(self, db: AsyncSession, request: Request, account_id: str, mime_type: str, mode: str = 'standard') -> str:
        action = "DescribeStorageCredential"
        file_type = self._resolve_file_type(mime_type)

        # claw/agent 模式使用 BotBizId='0' + IsPublic=True，确保文件在公有桶中可被 Claw Agent 下载
        if mode == 'claw':
            payload = {
                "BotBizId": '0',
                "FileType": file_type,
                "IsPublic": True,
                "TypeKey": 'realtime',
            }
        else:
            payload = {
                "BotBizId": self.config['BotBizId'],
                "FileType": file_type,
                "IsPublic": True,
                "TypeKey": 'realtime',
            }
        resp = await tc_request(self.tc_config(), action, payload)
        resp = resp['Response']
        if 'Error' in resp:
            logging.error(resp)
            raise Exception(resp['Error']['Message'])

        logging.info(f"DescribeStorageCredential mode={mode}, response keys: {[k for k in resp.keys() if k != 'Credentials']}")
        logging.info(f"DescribeStorageCredential UploadPath: {resp.get('UploadPath')}, FileUrl: {resp.get('FileUrl')}, UploadUrl: {resp.get('UploadUrl')}, DownloadUrl: {resp.get('DownloadUrl')}")

        # 读取完整请求体
        file_data = bytearray()
        while True:
            body = await request.stream.read()
            if body is None:
                break
            file_data += body

        logging.info(f"upload: file size {len(file_data)} bytes")

        # 使用 DescribeStorageCredential 返回的 UploadUrl（已签名）直接 PUT 上传
        upload_url = resp.get('UploadUrl')
        if upload_url:
            import aiohttp
            async with aiohttp.ClientSession() as session:
                async with session.put(
                    upload_url,
                    data=bytes(file_data),
                    headers={'Content-Length': str(len(file_data))}
                ) as put_resp:
                    if put_resp.status not in (200, 201, 204):
                        text = await put_resp.text()
                        logging.error(f"upload PUT failed: status={put_resp.status}, body={text}")
                        raise Exception(f"File upload failed: {put_resp.status}")
        else:
            # 回退到 S3 SDK 简单上传
            cos = AsyncWareHouseS3(
                secretId=resp['Credentials']['TmpSecretId'],
                secretKey=resp['Credentials']['TmpSecretKey'],
                tmpToken=resp['Credentials']['Token'],
                region=resp['Region'],
                bucket=resp['Bucket'],
                config=self.tc_config()['cos'],
            )
            await cos.put(resp['UploadPath'], bytes(file_data))

        # 优先使用 DescribeStorageCredential 返回的 FileUrl（LKE 平台可识别的地址）
        url = resp.get('FileUrl') or resp.get('file_url') or (
            f"https://{resp['Bucket']}.cos.{resp['Region']}.myqcloud.com{resp['UploadPath']}"
        )
        cos_url = resp.get('UploadPath', '')

        # claw 模式：上传完成后需再次调用 DescribeStorageCredential 获取 DownloadUrl
        # 对齐 webim openclaw 的 handleAgentDoc → cos.getDownloadUrl 逻辑
        if mode == 'claw' and cos_url:
            download_payload = {
                "BotBizId": '0',
                "FileType": file_type,
                "IsPublic": True,
                "TypeKey": 'realtime',
                "CosUrl": cos_url,
            }
            try:
                dl_resp = await tc_request(self.tc_config(), action, download_payload)
                dl_resp = dl_resp['Response']
                download_url = dl_resp.get('DownloadUrl') or dl_resp.get('FileUrl') or dl_resp.get('file_url')
                if download_url:
                    logging.info(f"claw mode DownloadUrl obtained: {download_url[:80]}...")
                    url = download_url
                else:
                    logging.warning(f"claw mode: DownloadUrl not found in response, keys: {list(dl_resp.keys())}")
            except Exception as e:
                logging.warning(f"claw mode: failed to get DownloadUrl, using FileUrl. Error: {e}")

        return {
            'Url': url,
            'CosUrl': cos_url,
            'CosBucket': resp.get('Bucket', ''),
        }

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
        custom = self.config.get('Custom', False)
        if international:
            return service_configs['International']
        if private:
            config = json.loads(json.dumps(service_configs['Private']))
            config = self.tc_config_private_url(config, private_url)
            return config
        if custom:
            config = json.loads(json.dumps(service_configs['China']))
            if self.config.get('CustomLkeUrl'):
                config['lke']['url'] = self.config['CustomLkeUrl']
            if self.config.get('CustomLkeapUrl'):
                config['lkeap']['url'] = self.config['CustomLkeapUrl']
            if self.config.get('CustomSseUrl'):
                config['sse'] = self.config['CustomSseUrl']
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
            'ep': 'https://cos.{region}.myqcloud.com',
            'access': 'https://{bucket}.cos.{region}.myqcloud.com'
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
            'ep': 'https://cos.{region}.myqcloud.com',
            'access': 'https://{bucket}.cos.{region}.myqcloud.com'
        },
        'sse': 'https://wss.lke.cloud.tencent.com/adp/v2/chat'
    }
}


def get_class():
    return TCADP
