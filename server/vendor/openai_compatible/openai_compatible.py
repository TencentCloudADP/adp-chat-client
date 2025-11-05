import logging
import aiohttp
import json
from typing import AsyncGenerator

from vendor.interface import BaseVendor, ApplicationInfo, MsgRecord, MessageType
from util.helper import to_message

logger = logging.getLogger(__name__)


class OpenAICompatible(BaseVendor):
    """
    OpenAI-compatible vendor implementation
    
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
        Main chat method using OpenAI-compatible API
        
        Args:
            db: Database session
            account_id: User account ID
            query: User's message
            conversation_id: Current conversation ID
            is_new_conversation: Whether this is a new conversation
            conversation_cb: Callback for conversation operations
            search_network: Whether to search network (not used)
            custom_variables: Custom variables (not used)
        
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
            
            # Get conversation history from ChatRecord
            from core.chat import CoreMessage
            
            # Build messages array with history
            messages = []
            if not is_new_conversation:
                # Load existing messages from ChatRecord
                chat_records = await CoreMessage.list(db, conversation_id)
                for record in chat_records:
                    role = "user" if record.FromRole == "user" else "assistant"
                    messages.append({
                        "role": role,
                        "content": record.Content
                    })
            
            # Add current user message
            messages.append({"role": "user", "content": query})
            
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
                # These models only support temperature=1 (default), so we don't set it
            else:
                # Standard models support temperature and max_tokens
                payload["temperature"] = temperature
                payload["max_tokens"] = max_tokens
            
            # Call OpenAI-compatible API
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
                        logger.error(f"[OpenAICompatible] API error: {resp.status} - {error_text}")
                        raise Exception(f"OpenAI-compatible API error: {resp.status} - {error_text}")
                    
                    # Stream response (SSE format)
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
                                logger.info(f"[OpenAICompatible] Response completed")
                                break
                            
                            try:
                                data = json.loads(line_str)
                                
                                # Extract delta content
                                if 'choices' in data and len(data['choices']) > 0:
                                    delta = data['choices'][0].get('delta', {})
                                    delta_content = delta.get('content', '')
                                    
                                    if delta_content:
                                        content += delta_content
                                        # Send incremental content (delta)
                                        record = MsgRecord(Content=delta_content)
                                        yield to_message(
                                            MessageType.REPLY,
                                            record=record,
                                            incremental=True
                                        )
                                    
                                    # Check if finished
                                    finish_reason = data['choices'][0].get('finish_reason')
                                    if finish_reason:
                                        logger.info(f"[OpenAICompatible] Finish reason: {finish_reason}")
                                        
                            except json.JSONDecodeError as e:
                                logger.warning(f"[OpenAICompatible] Failed to parse line: {line_str[:100]}... Error: {e}")
                                continue
                    
                    # Process any remaining data in buffer
                    if buffer:
                        line_str = buffer.decode('utf-8').strip()
                        if line_str and not line_str.startswith(':') and line_str != '[DONE]':
                            if line_str.startswith('data: '):
                                line_str = line_str[6:]
                            try:
                                data = json.loads(line_str)
                                if 'choices' in data and len(data['choices']) > 0:
                                    delta = data['choices'][0].get('delta', {})
                                    delta_content = delta.get('content', '')
                                    if delta_content:
                                        content += delta_content
                                        record = MsgRecord(Content=delta_content)
                                        yield to_message(
                                            MessageType.REPLY,
                                            record=record,
                                            incremental=True
                                        )
                            except json.JSONDecodeError:
                                pass
            
            # Save messages to ChatRecord
            logger.info(f"[OpenAICompatible] Final content length: {len(content)}")
            if content:
                from core.chat import CoreMessage
                
                # Save user message
                await CoreMessage.create(db, conversation_id, "user", query)
                
                # Save assistant message
                await CoreMessage.create(db, conversation_id, "assistant", content)
                
                logger.info(f"[OpenAICompatible] Saved message pair to ChatRecord")
            
            # Update conversation title if new
            if is_new_conversation and content:
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
            
            logger.info(f"[OpenAICompatible] Chat completed. Response length: {len(content)}")
            
        except Exception as e:
            logger.error(f"[OpenAICompatible] Error in chat: {str(e)}", exc_info=True)
            # Yield error message
            error_record = MsgRecord(Content=f"Error: {str(e)}")
            yield to_message(MessageType.ERROR, record=error_record, incremental=False)
    
    async def get_messages(self, db, account_id, conversation_id, limit, last_record_id=None):
        """
        Get message history from ChatRecord
        Supports pagination using last_record_id
        """
        try:
            logger.info(f"[OpenAICompatible] Loading messages: conversation_id={conversation_id}, limit={limit}, last_record_id={last_record_id}")
            
            from core.chat import CoreMessage
            from sqlalchemy import select
            from model.chat import ChatRecord
            
            # Build query
            query = select(ChatRecord).where(
                ChatRecord.ConversationId == conversation_id
            ).order_by(ChatRecord.CreatedAt)
            
            # Apply pagination if last_record_id is provided
            if last_record_id:
                # Get the timestamp of the last record
                last_record_result = await db.execute(
                    select(ChatRecord).where(ChatRecord.Id == last_record_id)
                )
                last_record = last_record_result.scalar()
                if last_record:
                    query = query.where(ChatRecord.CreatedAt > last_record.CreatedAt)
            
            # Apply limit
            query = query.limit(limit)
            
            # Execute query
            result = await db.execute(query)
            chat_records = result.scalars().all()
            
            # Convert to MsgRecord format
            messages = []
            for record in chat_records:
                msg_record = MsgRecord(
                    RecordId=str(record.Id),
                    Content=record.Content,
                    IsFromSelf=(record.FromRole == "user"),
                    CreatedAt=record.CreatedAt.isoformat() if record.CreatedAt else None,
                    CanRating=False
                )
                messages.append(msg_record)
            
            logger.info(f"[OpenAICompatible] Loaded {len(messages)} messages from ChatRecord")
            return messages
            
        except Exception as e:
            logger.error(f"[OpenAICompatible] Error loading messages: {str(e)}", exc_info=True)
            return []
    
    async def upload(self, db, request, account_id, mime_type):
        """Upload file - not implemented"""
        raise NotImplementedError("OpenAI-compatible vendor does not support file upload")
    
    async def rate(self, db, account_id, conversation_id, record_id, score, comment=None):
        """Rate message - not implemented"""
        raise NotImplementedError("OpenAI-compatible vendor does not support message rating")


# Vendor aliases - these classes share the same implementation as OpenAICompatible
# but allow users to use different Vendor names in configuration
class OpenAI(OpenAICompatible):
    """
    OpenAI vendor alias
    
    This is an alias for OpenAICompatible that allows users to use
    "Vendor": "OpenAI" in their configuration while sharing the same
    implementation logic.
    """
    
    @classmethod
    def get_vendor(cls) -> str:
        return 'OpenAI'


class Ollama(OpenAICompatible):
    """
    Ollama vendor alias
    
    This is an alias for OpenAICompatible that allows users to use
    "Vendor": "Ollama" in their configuration while sharing the same
    implementation logic.
    """
    
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
