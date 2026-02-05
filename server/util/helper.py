from typing import Optional, cast
from urllib.parse import urlparse
import re

from sanic.request.types import Request

from config import tagentic_config
from vendor.interface import MessageType, MsgRecord
from model.chat import ChatConversation
from util.json_format import custom_dumps


def get_remote_ip(request: Request) -> str:
    if request.headers.get("X-Forwarded-For"):
        return cast(str, request.headers.get("X-Forwarded-For"))
    else:
        return cast(str, request.client_ip)


def get_path_base() -> str:
    parsed_url = urlparse(tagentic_config.SERVICE_API_URL)
    path = parsed_url.path
    if path == '':
        path = '/'
    return path


# 预编译正则表达式，提高性能
UNDERSCORE_PATTERN = re.compile(r'_([a-z])')
CAMEL_PATTERN_1 = re.compile('(.)([A-Z][a-z]+)')
CAMEL_PATTERN_2 = re.compile('([a-z0-9])([A-Z])')


def pascal_to_snake(key):
    """大驼峰转下划线"""
    # 先处理连续大写字母的情况（如'UserID' -> 'user_id'）
    s1 = CAMEL_PATTERN_1.sub(r'\1_\2', key)
    return CAMEL_PATTERN_2.sub(r'\1_\2', s1).lower()


def snake_to_pascal(key):
    """下划线风格转换为大驼峰风格"""
    # 替换下划线后的字母为大写，并移除下划线
    return UNDERSCORE_PATTERN.sub(lambda m: m.group(1).upper(), key.title().replace('_', ''))


def convert_dict_keys_to_snake(d):
    """递归字典键转换"""
    if isinstance(d, dict):
        return {pascal_to_snake(k): convert_dict_keys_to_snake(v) for k, v in d.items()}
    elif isinstance(d, list):
        return [convert_dict_keys_to_snake(item) for item in d]
    return d


def convert_dict_keys_to_pascal(d):
    """递归转换字典的所有键为大驼峰风格"""
    if isinstance(d, dict):
        return {snake_to_pascal(k): convert_dict_keys_to_pascal(v) for k, v in d.items()}
    elif isinstance(d, list):
        return [convert_dict_keys_to_pascal(item) for item in d]
    return d


def to_message(
    type: MessageType,
    record: Optional[MsgRecord] = None,
    conversation: Optional[ChatConversation] = None,
    error_msg: Optional[str] = None,
    incremental: bool = False,
    is_new_conversation: bool = False,
) -> bytes:
    """转换为SSE消息 / Convert to SSE (Server-Sent Events) message

    Args:
        type: 消息类型 / Message type:
            - REPLY, THOUGHT, REFERENCE, TOKEN_STAT:
              需要`record`参数，可选`incremental`参数
              require `record`, optional `incremental`
            - CONVERSATION:
              需要`conversation`参数，可选`is_new_conversation`参数
              requires `conversation`, optional `is_new_conversation`
            - ERROR:
              需要`error_msg`参数
              requires `error_msg`
        record: 消息记录 / Message content record (required for certain types)
        conversation: 会话 / Conversation object (required for CONVERSATION type)
        error_msg: 错误描述 / Error description (required for ERROR type)
        incremental: 是否为增量消息（只对REPLY, THOUGHT有效） / Whether this is a incremental message (only for REPLY, THOUGHT)
        is_new_conversation: 是否为新会话（只对CONVERSATION有效） / Whether this is a new conversation (only for CONVERSATION)

    Returns:
        bytes: SSE格式编码的消息 / Encoded message

    Raises:
        ValueError: 当缺少必需参数时触发 / If required parameters are missing for the given type
    """
    # 根据消息类型验证参数 / Validate parameters based on message type
    payload = {'Type': type.value}
    if type in {MessageType.REPLY, MessageType.THOUGHT, MessageType.REFERENCE, MessageType.TOKEN_STAT}:
        if record is None:
            raise ValueError(f"{type.name} 需要'record'参数 / requires 'record' parameter")
        payload['Payload'] = record.model_dump(exclude_none=True)
        # 如需增量标记则添加 / Add incremental flag if needed
        payload['Payload']['Incremental'] = incremental
    elif type == MessageType.CONVERSATION:
        if conversation is None:
            raise ValueError("CONVERSATION 需要'conversation'参数 / requires 'conversation' parameter")
        payload['Payload'] = conversation.to_dict()
        payload['Payload']['IsNewConversation'] = is_new_conversation
    elif type == MessageType.ERROR:
        if error_msg is None:
            raise ValueError("ERROR 需要'error_msg'参数 / requires 'error_msg' parameter")
        payload['Payload'] = {'Error': {'Message': error_msg}}
    else:
        raise ValueError(f"未处理的消息类型: {type} / Unhandled message type: {type}")

    return f'data: {custom_dumps(payload)}\n\n'.encode('utf-8')
