from typing import cast, Optional
from urllib.parse import urlparse
import re

from sanic.request.types import Request

from config import tagentic_config
from util.json_format import custom_dumps
from vendor.interface import (
    EventType, Record, Message, Content, ErrorInfo
)
from model.chat import ChatConversation


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


def to_event(
    event_type: EventType,
    record: Optional[Record] = None,
    message: Optional[Message] = None,
    message_id: Optional[str] = None,
    content: Optional[Content] = None,
    content_index: Optional[int] = None,
    text: Optional[str] = None,
    error: Optional[ErrorInfo] = None,
    conversation: Optional[ChatConversation] = None,
    is_new_conversation: bool = False,
) -> bytes:
    """Convert to V2 SSE event format

    Args:
        event_type: The type of event to emit
        record: Record object (for request_ack, response.* events)
        message: Message object (for message.* events)
        message_id: Message ID (for message.processing, message.done, content.added, text.delta)
        content: Content object (for content.added)
        content_index: Index of the content in the message (for content.added, text.delta)
        text: Text delta (for text.delta)
        error: Error info (for error events)
        conversation: Conversation object (for conversation events)
        is_new_conversation: Whether this is a new conversation (for conversation events)

    Returns:
        bytes: SSE formatted message

    Raises:
        ValueError: When required parameters are missing for the given event type
    """
    payload = {'Type': event_type.value}

    if event_type == EventType.REQUEST_ACK:
        if record is None:
            raise ValueError("request_ack requires 'record' parameter")
        payload['RequestAck'] = record.model_dump(exclude_none=True)

    elif event_type in {
        EventType.RESPONSE_CREATED,
        EventType.RESPONSE_PROCESSING,
        EventType.RESPONSE_COMPLETED
    }:
        if record is None:
            raise ValueError(f"{event_type.value} requires 'record' parameter")
        payload['Response'] = record.model_dump(exclude_none=True)

    elif event_type == EventType.MESSAGE_ADDED:
        if message is None:
            raise ValueError("message.added requires 'message' parameter")
        payload['Message'] = message.model_dump(exclude_none=True)

    elif event_type in {EventType.MESSAGE_PROCESSING, EventType.MESSAGE_DONE}:
        if message_id is None or message is None:
            raise ValueError(f"{event_type.value} requires 'message_id' and 'message' parameters")
        payload['MessageId'] = message_id
        payload['Message'] = message.model_dump(exclude_none=True)

    elif event_type == EventType.CONTENT_ADDED:
        if message_id is None or content_index is None or content is None:
            raise ValueError("content.added requires 'message_id', 'content_index', and 'content' parameters")
        payload['MessageId'] = message_id
        payload['ContentIndex'] = content_index
        payload['Content'] = content.model_dump(exclude_none=True)

    elif event_type == EventType.TEXT_DELTA:
        if message_id is None or content_index is None or text is None:
            raise ValueError("text.delta requires 'message_id', 'content_index', and 'text' parameters")
        payload['MessageId'] = message_id
        payload['ContentIndex'] = content_index
        payload['Text'] = text

    elif event_type == EventType.ERROR:
        if error is None:
            raise ValueError("error requires 'error' parameter")
        payload['Error'] = error.model_dump(exclude_none=True)

    elif event_type == EventType.CONVERSATION:
        # Backward compatible conversation event
        if conversation is None:
            raise ValueError("conversation requires 'conversation' parameter")
        payload['Payload'] = conversation.to_dict()
        payload['Payload']['IsNewConversation'] = is_new_conversation
    else:
        raise ValueError(f"Unhandled event type: {event_type}")

    return f'data: {custom_dumps(payload)}\n\n'.encode('utf-8')
