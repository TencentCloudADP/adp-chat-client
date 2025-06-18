import enum
import json
from typing import Optional, cast
from sqlalchemy import func, INTEGER, Column, ForeignKey, String, Text, DateTime, text
from sqlalchemy.orm import Mapped, mapped_column, reconstructor, DeclarativeBase
from sqlalchemy import UUID
from sqlalchemy.orm import DeclarativeBase
from model.base import Base


class ChatMessage(Base):
    __tablename__ = "chat_message"

    id: Mapped[str] = mapped_column(UUID(), server_default=text("uuid_generate_v4()"), primary_key=True)
    conversation_id = Column(UUID(), nullable=False, index=True)
    content = Column(Text(), nullable=False)
    from_role = Column(String(255), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.current_timestamp())

class ChatConversation(Base):
    __tablename__ = "chat_conversation"

    id: Mapped[str] = mapped_column(UUID(), server_default=text("uuid_generate_v4()"), primary_key=True)
    account_id = Column(UUID(), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    last_active_at = Column(DateTime, nullable=False, server_default=func.current_timestamp())
    created_at = Column(DateTime, nullable=False, server_default=func.current_timestamp())
