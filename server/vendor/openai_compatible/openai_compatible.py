# flake8: noqa: E501
import logging
import uuid
import aiohttp
import json
from typing import AsyncGenerator

from sqlalchemy import select, desc
from model.chat import ChatRecord
from core.chat import CoreMessage

from vendor.interface import (
    BaseVendor, ApplicationInfo,
    EventType, Record, RecordRole, Message, MessageType, Content, ContentType,
    RecordExtraInfo, Procedure, ErrorInfo, extract_text_from_contents
)
from util.helper import to_event
from util.json_format import custom_dumps
from util.database import db_connection


logger = logging.getLogger(__name__)


class OpenAICompatible(BaseVendor):
    """
    OpenAI-compatible vendor implementation (V2 Protocol)

    Supports:
    - OpenAI (GPT-3.5, GPT-4, GPT-5, o1, o3, etc.)
    - Ollama (local models with OpenAI-compatible API)
    - Any other service that implements OpenAI's chat completions API
    """

    @classmethod
    def get_vendor(cls) -> str:
        """Return vendor name"""
        return 'OpenAICompatible'

    async def get_info(self) -> ApplicationInfo:
        """Get application information from config"""
        return ApplicationInfo(
            ApplicationId=self.application_id,
            Name=self.config.get('DisplayName', 'AI Assistant'),
            Avatar=self.config.get('Avatar', 'https://cdn.simpleicons.org/openai/10A37F'),
            Greeting=self.config.get('Greeting', 'Hello! How can I help you today?'),
            OpeningQuestions=self.config.get('OpeningQuestions', [])
        )

    async def chat(
        self,
        account_id,
        contents,
        conversation_id,
        is_new_conversation,
        conversation_cb,
        search_network=True,
        custom_variables={}
    ) -> AsyncGenerator:
        """
        Main chat method using OpenAI-compatible API (V2 Protocol)
        """
        # Generate IDs
        user_record_id = str(uuid.uuid4())
        assistant_record_id = str(uuid.uuid4())
        reply_message_id = str(uuid.uuid4())
        thought_message_id = str(uuid.uuid4())

        try:
            normalized_contents = []
            if contents:
                for item in contents:
                    if isinstance(item, Content):
                        normalized_contents.append(item)
                    else:
                        normalized_contents.append(Content.model_validate(item))
            if not normalized_contents:
                normalized_contents = [Content(Type=ContentType.TEXT, Text="")]

            query_text = extract_text_from_contents(normalized_contents).strip()
            if not query_text:
                query_text = "New Chat"

            # Create new conversation if needed
            if is_new_conversation:
                conversation = await conversation_cb.create()
                yield to_event(EventType.CONVERSATION, conversation=conversation, is_new_conversation=True)
                conversation_id = str(conversation.Id)

            # 1. Emit request_ack (user's record)
            user_record = Record(
                Role=RecordRole.USER,
                RecordId=user_record_id,
                ConversationId=conversation_id,
                Status='completed',
                StatusDesc='',
                Messages=[Message(
                    Type=MessageType.REPLY,
                    MessageId=f"{user_record_id}_msg",
                    Name='',
                    Title='',
                    Status='completed',
                    Contents=normalized_contents
                )],
                ExtraInfo=RecordExtraInfo(IsFromSelf=True)
            )
            yield to_event(EventType.REQUEST_ACK, record=user_record)

            # 2. Emit response.created (assistant's record shell)
            assistant_record = Record(
                Role=RecordRole.ASSISTANT,
                RecordId=assistant_record_id,
                RelatedRecordId=user_record_id,
                ConversationId=conversation_id,
                Status='processing',
                StatusDesc='',
                Messages=[],
                Procedures=[],
            )
            yield to_event(EventType.RESPONSE_CREATED, record=assistant_record)

            # 3. Add reply message
            reply_message = Message(
                Type=MessageType.REPLY,
                MessageId=reply_message_id,
                Name='',
                Title='',
                Status='processing',
                Contents=[Content(Type=ContentType.TEXT, Text='')]
            )
            yield to_event(EventType.MESSAGE_ADDED, message=reply_message)

            # Get configuration
            api_key = self.config.get('ApiKey', '')
            base_url = self.config.get('BaseUrl', 'https://api.openai.com/v1')
            model_name = self.config.get('ModelName', 'gpt-3.5-turbo')
            temperature = self.config.get('Temperature', 0.7)
            max_tokens = self.config.get('MaxTokens', 2000)

            # API key is optional (e.g., Ollama doesn't require it)
            if not api_key and not base_url.startswith('http://localhost'):
                raise ValueError("API Key is required in configuration")

            # Ensure base_url ends with /v1 if needed
            if not base_url.endswith('/v1') and '/v1/' not in base_url:
                base_url = base_url.rstrip('/') + '/v1'

            logger.info(f"[OpenAICompatible] Calling API: {base_url}/chat/completions with model: {model_name}")

            # Build messages array with history
            messages = []
            if not is_new_conversation:
                async with db_connection() as db:
                    # Load existing messages from ChatRecord
                    chat_records = await CoreMessage.list(db, conversation_id)
                for record in chat_records:
                    role = "user" if record.FromRole == "user" else "assistant"
                    try:
                        record_dict = json.loads(record.Content)
                        content = record_dict.get('Content')
                        if content is None and 'Contents' in record_dict:
                            content = extract_text_from_contents(record_dict.get('Contents') or [])
                        if content is None:
                            content = ''
                    except json.JSONDecodeError:
                        content = record.Content

                    messages.append({
                        "role": role,
                        "content": content
                    })

            # Add current user message
            messages.append({"role": "user", "content": query_text})

            logger.info(f"[OpenAICompatible] Sending {len(messages)} messages (including {len(messages)-1} history messages)")

            # Prepare request headers
            headers = {'Content-Type': 'application/json'}
            if api_key:
                headers['Authorization'] = f'Bearer {api_key}'

            # Prepare request payload
            payload = {
                "model": model_name,
                "messages": messages,
                "stream": True
            }

            # GPT-5 and reasoning models (o1, o3) have special parameter requirements
            if model_name.startswith('gpt-5') or model_name.startswith('o1') or model_name.startswith('o3'):
                payload["max_completion_tokens"] = max_tokens
            else:
                payload["temperature"] = temperature
                payload["max_tokens"] = max_tokens

            # Call OpenAI-compatible API
            content = ""
            reasoning_content = ""
            has_thought_message = False

            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{base_url}/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=300)
                ) as resp:
                    if resp.status != 200:
                        error_text = await resp.text()
                        logger.error(f"[OpenAICompatible] API error: {resp.status} - {error_text}")
                        raise Exception(f"OpenAI-compatible API error: {resp.status} - {error_text}")

                    # Stream response (SSE format)
                    while True:
                        raw_line = await resp.content.readline()
                        if not raw_line:
                            break
                        line = raw_line.decode()
                        if ':' not in line:
                            continue
                        _, line_str = line.split(':', 1)

                        # Check for end of stream
                        if line_str.strip() == '[DONE]':
                            logger.info(f"[OpenAICompatible] Response completed")
                            break

                        try:
                            data = json.loads(line_str)

                            # Extract delta content
                            if 'choices' in data and len(data['choices']) > 0:
                                delta = data['choices'][0].get('delta', {})
                                delta_reasoning_content = delta.get('reasoning_content', '')
                                delta_content = delta.get('content', '')

                                if delta_reasoning_content:
                                    # Add thought message if first reasoning content
                                    if not has_thought_message:
                                        thought_message = Message(
                                            Type=MessageType.THOUGHT,
                                            MessageId=thought_message_id,
                                            Name='Reasoning',
                                            Title='思考过程',
                                            Status='processing',
                                            Contents=[Content(Type=ContentType.TEXT, Text='')]
                                        )
                                        yield to_event(EventType.MESSAGE_ADDED, message=thought_message)
                                        has_thought_message = True

                                    reasoning_content += delta_reasoning_content
                                    yield to_event(
                                        EventType.TEXT_DELTA,
                                        message_id=thought_message_id,
                                        content_index=0,
                                        text=delta_reasoning_content
                                    )

                                if delta_content:
                                    content += delta_content
                                    yield to_event(
                                        EventType.TEXT_DELTA,
                                        message_id=reply_message_id,
                                        content_index=0,
                                        text=delta_content
                                    )

                                # Check if finished
                                finish_reason = data['choices'][0].get('finish_reason')
                                if finish_reason:
                                    logger.info(f"[OpenAICompatible] Finish reason: {finish_reason}")

                        except json.JSONDecodeError as e:
                            logger.warning(f"[OpenAICompatible] Failed to parse line: {line_str[:100]}... Error: {e}")
                            continue

            # Save messages to ChatRecord
            logger.info(f"[OpenAICompatible] Final content length: {len(content)}")
            if content:
                serialized_contents = [item.model_dump(exclude_none=True) for item in normalized_contents]
                async with db_connection() as db:
                    # Save user message
                    related_record = await CoreMessage.create(
                        
                    db,
                       
                    conversation_id,
                       
                    "user",
                       
                    json.dumps({'Content': query_text, 'Contents': serialized_contents}, ensure_ascii=False)
                    
                )

                    # Save assistant message
                    await CoreMessage.create(
                        db,
                        conversation_id,
                        "assistant",
                        json.dumps(
                            {
                                'RelatedId': str(related_record.Id),
                                'Content': content,
                                'ReasoningContent': reasoning_content
                            },
                            ensure_ascii=False
                        )
                    )

                logger.info(f"[OpenAICompatible] Saved message pair to ChatRecord")

            # 4. Emit message.done for thought message (if exists)
            if has_thought_message:
                thought_message = Message(
                    Type=MessageType.THOUGHT,
                    MessageId=thought_message_id,
                    Name='Reasoning',
                    Title='思考过程',
                    Status='completed',
                    Contents=[Content(Type=ContentType.TEXT, Text=reasoning_content)]
                )
                yield to_event(EventType.MESSAGE_DONE, message_id=thought_message_id, message=thought_message)

            # 5. Emit message.done for reply message
            reply_message = Message(
                Type=MessageType.REPLY,
                MessageId=reply_message_id,
                Name='',
                Title='',
                Status='completed',
                Contents=[Content(Type=ContentType.TEXT, Text=content)]
            )
            yield to_event(EventType.MESSAGE_DONE, message_id=reply_message_id, message=reply_message)

            # 6. Emit response.completed
            all_messages = [reply_message]
            if has_thought_message:
                all_messages.append(thought_message)

            assistant_record = Record(
                Role=RecordRole.ASSISTANT,
                RecordId=assistant_record_id,
                RelatedRecordId=user_record_id,
                ConversationId=conversation_id,
                Status='completed',
                StatusDesc='',
                Messages=all_messages,
                ExtraInfo=RecordExtraInfo(
                    IsFromSelf=False,
                    CanRating=False,
                )
            )
            yield to_event(EventType.RESPONSE_COMPLETED, record=assistant_record)

            # Update conversation title if new
            if is_new_conversation and content:
                title = query_text[:20] + "..." if len(query_text) > 20 else query_text
                conversation = await conversation_cb.update(
                    conversation_id=conversation_id,
                    title=title
                )
                yield to_event(EventType.CONVERSATION, conversation=conversation, is_new_conversation=False)

            logger.info(f"[OpenAICompatible] Chat completed. Response length: {len(content)}")

        except Exception as e:
            logger.error(f"[OpenAICompatible] Error in chat: {str(e)}", exc_info=True)
            error_info = ErrorInfo(
                Code=-1,
                Message=str(e),
            )
            yield to_event(EventType.ERROR, error=error_info)

    async def get_messages(self, db, account_id, conversation_id, limit, last_record_id=None) -> list[Record]:
        """
        Get message history from ChatRecord (V2 Protocol)
        Supports pagination using last_record_id
        """
        try:
            logger.info(f"[OpenAICompatible] Loading messages: conversation_id={conversation_id}, limit={limit}, last_record_id={last_record_id}")

            # Build query
            query = select(ChatRecord).where(
                ChatRecord.ConversationId == conversation_id
            ).order_by(desc(ChatRecord.CreatedAt))

            # Apply pagination if last_record_id is provided
            if last_record_id:
                last_record_result = await db.execute(
                    select(ChatRecord).where(ChatRecord.Id == last_record_id)
                )
                last_record = last_record_result.scalar()
                if last_record:
                    query = query.where(ChatRecord.CreatedAt < last_record.CreatedAt)

            # Apply limit
            query = query.limit(limit)

            # Execute query
            result = await db.execute(query)
            chat_records = result.scalars().all()

            # Convert to V2 Record format
            records = []
            for db_record in chat_records:
                related_id = None
                content_text = db_record.Content
                reasoning_content = ''
                try:
                    record_dict = json.loads(db_record.Content)
                    related_id = record_dict.get('RelatedId', None)
                    content_text = record_dict.get('Content', '')
                    reasoning_content = record_dict.get('ReasoningContent', '')
                except json.JSONDecodeError:
                    pass

                is_from_self = db_record.FromRole == "user"
                role = RecordRole.USER if is_from_self else RecordRole.ASSISTANT
                record_id = str(db_record.Id)

                # Build messages
                messages = []

                # Reply message
                reply_message = Message(
                    Type=MessageType.REPLY,
                    MessageId=f"{record_id}_reply",
                    Name='',
                    Title='',
                    Status='completed',
                    Contents=[Content(Type=ContentType.TEXT, Text=content_text)]
                )
                messages.append(reply_message)

                # Thought message (if reasoning content exists)
                if reasoning_content:
                    thought_message = Message(
                        Type=MessageType.THOUGHT,
                        MessageId=f"{record_id}_thought",
                        Name='Reasoning',
                        Title='思考过程',
                        Status='completed',
                        Contents=[Content(Type=ContentType.TEXT, Text=reasoning_content)]
                    )
                    messages.append(thought_message)

                record = Record(
                    Role=role,
                    RecordId=record_id,
                    RelatedRecordId=related_id,
                    ConversationId=conversation_id,
                    Status='completed',
                    StatusDesc='',
                    Messages=messages,
                    ExtraInfo=RecordExtraInfo(
                        IsFromSelf=is_from_self,
                        CanRating=False,
                    )
                )
                records.append(record)

            records = records[::-1]

            logger.info(f"[OpenAICompatible] Loaded {len(records)} records from ChatRecord")
            return records

        except Exception as e:
            logger.error(f"[OpenAICompatible] Error loading messages: {str(e)}", exc_info=True)
            return []

    async def upload(self, db, request, account_id, mime_type):
        """Upload file - not implemented"""
        raise NotImplementedError("OpenAI-compatible vendor does not support file upload")

    async def rate(self, db, account_id, conversation_id, record_id, score, comment=None):
        """Rate message - not implemented"""
        raise NotImplementedError("OpenAI-compatible vendor does not support message rating")


# Vendor aliases
class OpenAI(OpenAICompatible):
    """OpenAI vendor alias"""

    @classmethod
    def get_vendor(cls) -> str:
        return 'OpenAI'


class Ollama(OpenAICompatible):
    """Ollama vendor alias"""

    @classmethod
    def get_vendor(cls) -> str:
        return 'Ollama'

    async def get_info(self) -> ApplicationInfo:
        """Get application information with Ollama-specific defaults"""
        return ApplicationInfo(
            ApplicationId=self.application_id,
            Name=self.config.get('DisplayName', 'Ollama Local Model'),
            Avatar=self.config.get('Avatar', 'https://cdn.simpleicons.org/ollama/000000'),
            Greeting=self.config.get('Greeting', 'Hello! I am a local AI assistant. How can I help you?'),
            OpeningQuestions=self.config.get('OpeningQuestions', [])
        )
