import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from core.conversation import CoreConversation
from model.chat import ChatRecord, ChatConversation
from vendor.interface import BaseVendor, ConversationCallback

logger = logging.getLogger(__name__)


class CoreChat:
    @staticmethod
    async def message(
        vendor_app: BaseVendor,
        db: AsyncSession,
        account_id: str,
        query: str,
        conversation_id: str,
        search_network: bool,
        custom_variables: dict
    ):
        class CoreConversationCallback(ConversationCallback):
            async def create(self, title: str = None, conversation_id: str = None) -> ChatConversation:
                # create
                if title is None:
                    title = query[:10]
                conversation = await CoreConversation.create(
                    db,
                    account_id,
                    vendor_app.application_id,
                    title=title,
                    conversation_id=conversation_id
                )
                return conversation

            async def update(self, conversation_id: str = None, title: str = None) -> ChatConversation:
                # update
                conversation = await CoreConversation.get(db, conversation_id)
                if conversation is None:
                    raise Exception(f'conversation not found: {conversation_id}')
                await CoreConversation.update(db, conversation, title=title)
                return conversation

        is_new_conversation = False
        if conversation_id is None or conversation_id == '':
            is_new_conversation = True

        async for message in vendor_app.chat(
            db,
            account_id,
            query,
            conversation_id,
            is_new_conversation,
            CoreConversationCallback(),
            search_network=search_network,
            custom_variables=custom_variables
        ):
            yield message


class CoreMessage:
    @staticmethod
    async def list(db: AsyncSession, conversation_id: str) -> list[ChatRecord]:
        conversations = (await db.execute(select(ChatRecord).where(
            ChatRecord.ConversationId == conversation_id
        ).order_by(ChatRecord.CreatedAt))).scalars()
        return conversations

    @staticmethod
    async def create(db: AsyncSession, conversation_id: str, from_role: str, content: str) -> ChatRecord:
        message = ChatRecord(ConversationId=conversation_id, FromRole=from_role, Content=content)
        db.add(message)
        await db.commit()
        return message


class CoreChatHistory:
    """
    Simple chat history management for non-Tencent vendors
    Based on SharedConversation design - stores complete conversation as JSON
    """
    
    @staticmethod
    async def add_message_pair(db, conversation_id: str, application_id: str, user_message: str, assistant_message: str):
        """Add a user-assistant message pair to conversation history"""
        from sqlalchemy import select
        from model.chat import ChatHistory
        from datetime import datetime
        
        try:
            # Get or create history record
            result = await db.execute(
                select(ChatHistory).where(ChatHistory.ConversationId == conversation_id)
            )
            history = result.scalar()
            
            if not history:
                history = ChatHistory(
                    ConversationId=conversation_id,
                    ApplicationId=application_id,
                    Records=[]
                )
                db.add(history)
            
            # Append new messages as simple dicts
            # IMPORTANT: Must reassign the entire array to trigger SQLAlchemy update
            record_count = len(history.Records) if history.Records else 0
            current_time = datetime.now().isoformat()
            
            existing_records = list(history.Records) if history.Records else []
            
            user_record = {
                'RecordId': f"{conversation_id}_{record_count}",
                'Content': user_message,
                'IsFromSelf': True,
                'CreatedAt': current_time
            }
            
            assistant_record = {
                'RecordId': f"{conversation_id}_{record_count + 1}",
                'Content': assistant_message,
                'IsFromSelf': False,
                'CreatedAt': current_time
            }
            
            # Reassign the entire array to trigger SQLAlchemy change detection
            history.Records = existing_records + [user_record, assistant_record]
            
            await db.commit()
            logger.info(f"Saved message pair to conversation {conversation_id}, total: {len(history.Records)}")
            
        except Exception as e:
            await db.rollback()
            logger.error(f"Error adding message pair: {e}")
    
    @staticmethod
    async def get_records(db, conversation_id: str):
        """Get all message records for a conversation"""
        from sqlalchemy import select
        from model.chat import ChatHistory
        
        try:
            result = await db.execute(
                select(ChatHistory).where(ChatHistory.ConversationId == conversation_id)
            )
            history = result.scalar()
            
            return history.Records if history and history.Records else []
            
        except Exception as e:
            logger.error(f"Error getting chat records: {e}")
            return []
