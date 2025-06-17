from datetime import UTC, datetime, timedelta
from enum import Enum
import logging
from pydantic import BaseModel
from typing import Any, Optional, cast
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import asyncio
import aiohttp
import json

from ag_ui.core import EventType, TextMessageContentEvent
from ag_ui.encoder import EventEncoder

from config import tagentic_config

class TCADPEventType(str, Enum):
    """
    The type of event.
    """
    REPLY = "reply"
    TOKEN_STAT = "token_stat"
    REFERENCE = "reference"
    ERROR = "error"
    THOUGHT = "thought"

# class TCADPChat:


class CoreChat:
    @staticmethod
    async def forward_request(input: str):
        url = tagentic_config.TCADP_API_URL
        bot_app_key = tagentic_config.TCADP_APP_KEY
        session_id = 'a29bae68-cb1c-489d-8097-6be78f136acf'
        visitor_biz_id = 'a29bae68-cb1c-489d-8097-6be78f136acf'
        async with aiohttp.ClientSession() as session:
            param = {
                "content": input,
                "bot_app_key": bot_app_key,
                "session_id": session_id,
                "visitor_biz_id": visitor_biz_id,
                "incremental" : True,
            }
            headers = {
                "Accept": "text/event-stream",
                "Content-Type": "application/json",
            }
            async with session.post(url, headers=headers, data=json.dumps(param)) as resp:
                if resp.status != 200:
                    raise(Exception())

                # Initialize the encoder
                encoder = EventEncoder()

                # 逐行读取事件流
                while True:
                    line = await resp.content.readline()
                    if not line:
                        break
                    line = line.decode()
                    if ':' not in line:
                        continue
                    line_type, data = line.split(':', 1)
                    if line_type == 'data':
                        try:
                            data = json.loads(data)
                            data_type = data['type']
                            event = None
                            if data_type == TCADPEventType.REPLY:
                                event = TextMessageContentEvent(
                                    type=EventType.TEXT_MESSAGE_CONTENT,
                                    message_id=data['payload']['record_id'],
                                    delta=data['payload']['content']
                                )
                            elif data_type == TCADPEventType.THOUGHT:
                                # print(data)
                                event = TextMessageContentEvent(
                                    type=EventType.TEXT_MESSAGE_CONTENT,
                                    message_id=data['payload']['record_id'],
                                    delta=data['payload']['procedures'][-1]['debugging']['content']
                                )
                            if event is not None:
                                yield encoder.encode(event)
                        except Exception as e:
                            logging.error(e, data)
                    # print(f"Received: {line.decode().strip()}")

        # # Initialize the encoder
        # encoder = EventEncoder()
        # for i in range(10):
        #     await asyncio.sleep(0.1)
        #     event = TextMessageContentEvent(
        #         type=EventType.TEXT_MESSAGE_CONTENT,
        #         message_id="msg_123",
        #         delta=f"Hello, world! {input} {i}"
        #     )
        #     yield encoder.encode(event)

    @staticmethod
    async def messages(db: AsyncSession, input: str):
        async for message in CoreChat.forward_request(input):
            yield message
