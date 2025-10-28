import logging
import aiohttp
import json
from typing import AsyncGenerator

from vendor.interface import BaseVendor, ApplicationInfo, MsgRecord, MessageType
from util.helper import to_message

logger = logging.getLogger(__name__)


class OpenAI(BaseVendor):
    """OpenAI vendor implementation for GPT models"""
    
    @classmethod
    def get_vendor(cls) -> str:
        """Return vendor name"""
        return 'OpenAI'
    
    async def get_info(self) -> ApplicationInfo:
        """Get application information from config"""
        # Default OpenAI icon from Simple Icons CDN
        default_avatar = 'https://cdn.simpleicons.org/openai/10A37F'
        
        return ApplicationInfo(
            ApplicationId=self.application_id,
            Name=self.config.get('Comment', 'OpenAI GPT Model'),
            Avatar=self.config.get('Avatar', default_avatar),
            Greeting=self.config.get('Greeting', '你好！我是 ChatGPT，有什么可以帮助你的吗？'),
            OpeningQuestions=self.config.get('OpeningQuestions', [])
        )
    
    async def chat(
        self,
        db,
        account_id,
        query,
        conversation_id,
        is_new_conversation,
        conversation_cb,
        search_network=True,
        custom_variables={}
    ) -> AsyncGenerator:
        """
        Main chat method that handles conversation with OpenAI API
        
        Args:
            db: Database session
            account_id: User account ID
            query: User's message
            conversation_id: Current conversation ID
            is_new_conversation: Whether this is a new conversation
            conversation_cb: Callback for conversation operations
            search_network: Whether to search network (not used for OpenAI)
            custom_variables: Custom variables (not used for OpenAI)
        
        Yields:
            Messages with conversation info and AI responses
        """
        try:
            # Create new conversation if needed
            if is_new_conversation:
                conversation = await conversation_cb.create()
                yield to_message(
                    MessageType.CONVERSATION,
                    conversation=conversation,
                    is_new_conversation=True
                )
                conversation_id = str(conversation.Id)
            
            # Get OpenAI configuration
            api_key = self.config.get('ApiKey')
            if not api_key:
                raise ValueError("OpenAI API Key is required")
            
            base_url = self.config.get('BaseUrl', 'https://api.openai.com/v1')
            model_name = self.config.get('ModelName', 'gpt-3.5-turbo')
            temperature = self.config.get('Temperature', 0.7)
            max_tokens = self.config.get('MaxTokens', 2000)
            
            logger.info(f"[OpenAI] Calling API: {base_url}/chat/completions with model: {model_name}")
            
            # Prepare request headers
            headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            }
            
            # Prepare request payload
            # Note: GPT-5 and reasoning models (o1, o3) have special parameter requirements
            payload = {
                "model": model_name,
                "messages": [{"role": "user", "content": query}],
                "stream": True
            }
            
            # GPT-5 and reasoning models (o1, o3) don't support custom temperature and use max_completion_tokens
            if model_name.startswith('gpt-5') or model_name.startswith('o1') or model_name.startswith('o3'):
                payload["max_completion_tokens"] = max_tokens
                # These models only support temperature=1 (default), so we don't set it
            else:
                # Older models support temperature and max_tokens
                payload["temperature"] = temperature
                payload["max_tokens"] = max_tokens
            
            # Call OpenAI API
            content = ""
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{base_url}/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=300)
                ) as resp:
                    if resp.status != 200:
                        error_text = await resp.text()
                        logger.error(f"[OpenAI] API error: {resp.status} - {error_text}")
                        raise Exception(f"OpenAI API error: {resp.status} - {error_text}")
                    
                    # Stream response (SSE format)
                    # Use buffer to handle incomplete lines
                    buffer = b''
                    async for chunk in resp.content.iter_any():
                        if not chunk:
                            continue
                        
                        buffer += chunk
                        
                        # Split by newline
                        while b'\n' in buffer:
                            line_bytes, buffer = buffer.split(b'\n', 1)
                            line_str = line_bytes.decode('utf-8').strip()
                            
                            # Skip empty lines and comments
                            if not line_str or line_str.startswith(':'):
                                continue
                            
                            # Remove "data: " prefix
                            if line_str.startswith('data: '):
                                line_str = line_str[6:]
                            
                            # Check for end of stream
                            if line_str == '[DONE]':
                                logger.info(f"[OpenAI] Response completed")
                                break
                            
                            try:
                                data = json.loads(line_str)
                                
                                # Extract delta content
                                if 'choices' in data and len(data['choices']) > 0:
                                    delta = data['choices'][0].get('delta', {})
                                    delta_content = delta.get('content', '')
                                    
                                    if delta_content:
                                        content += delta_content
                                        # Send incremental content (delta), not accumulated content
                                        record = MsgRecord(Content=delta_content)
                                        yield to_message(
                                            MessageType.REPLY,
                                            record=record,
                                            incremental=True
                                        )
                                    
                                    # Check if finished
                                    finish_reason = data['choices'][0].get('finish_reason')
                                    if finish_reason:
                                        logger.info(f"[OpenAI] Finish reason: {finish_reason}")
                                        
                            except json.JSONDecodeError as e:
                                logger.warning(f"[OpenAI] Failed to parse line: {line_str[:100]}... Error: {e}")
                                continue
            
            # Save messages to database
            if content:
                from model.chat import ChatRecord
                
                # Save user message
                user_record = ChatRecord(
                    ConversationId=conversation_id,
                    Content=query,
                    FromRole='user'
                )
                db.add(user_record)
                
                # Save assistant message
                assistant_record = ChatRecord(
                    ConversationId=conversation_id,
                    Content=content,
                    FromRole='assistant'
                )
                db.add(assistant_record)
                
                await db.commit()
                logger.info(f"[OpenAI] Saved messages to database")
            
            # Update conversation title if new
            if is_new_conversation and content:
                # Use first 20 characters of query as title
                title = query[:20] + "..." if len(query) > 20 else query
                conversation = await conversation_cb.update(
                    conversation_id=conversation_id,
                    title=title
                )
                yield to_message(
                    MessageType.CONVERSATION,
                    conversation=conversation,
                    is_new_conversation=False
                )
            
            logger.info(f"[OpenAI] Chat completed. Response length: {len(content)}")
            
        except Exception as e:
            logger.error(f"[OpenAI] Error in chat: {str(e)}", exc_info=True)
            # Yield error message
            error_record = MsgRecord(Content=f"Error: {str(e)}")
            yield to_message(MessageType.REPLY, record=error_record, incremental=False)
    
    async def get_messages(self, db, account_id, conversation_id, limit, last_record_id=None):
        """Get message history from database"""
        from sqlalchemy import select, and_
        from model.chat import ChatRecord
        
        try:
            # Build query
            query = select(ChatRecord).where(
                ChatRecord.ConversationId == conversation_id
            ).order_by(ChatRecord.CreatedAt.desc()).limit(limit)
            
            # If last_record_id is provided, get messages before that record
            if last_record_id:
                last_record = (await db.execute(
                    select(ChatRecord).where(ChatRecord.Id == last_record_id)
                )).scalar()
                
                if last_record:
                    query = select(ChatRecord).where(
                        and_(
                            ChatRecord.ConversationId == conversation_id,
                            ChatRecord.CreatedAt < last_record.CreatedAt
                        )
                    ).order_by(ChatRecord.CreatedAt.desc()).limit(limit)
            
            # Execute query
            result = await db.execute(query)
            records = result.scalars().all()
            
            # Convert to MsgRecord format (return list of MsgRecord objects, not dicts)
            messages = []
            for record in reversed(records):  # Reverse to get chronological order
                msg_record = MsgRecord(
                    RecordId=str(record.Id),
                    Content=record.Content,
                    IsFromSelf=(record.FromRole == 'user'),
                    CreatedAt=int(record.CreatedAt.timestamp())
                )
                messages.append(msg_record)
            
            logger.info(f"[OpenAI] Retrieved {len(messages)} messages for conversation {conversation_id}")
            return messages
            
        except Exception as e:
            logger.error(f"[OpenAI] Error retrieving messages: {str(e)}", exc_info=True)
            return []
    
    async def upload(self, db, request, account_id, mime_type):
        """Upload file - not implemented for OpenAI"""
        raise NotImplementedError("OpenAI does not support file upload")
    
    async def rate(self, db, account_id, conversation_id, record_id, score, comment=None):
        """Rate message - not implemented for OpenAI"""
        raise NotImplementedError("OpenAI does not support message rating")


def get_class():
    """Return the OpenAI class for vendor registration"""
    return OpenAI
