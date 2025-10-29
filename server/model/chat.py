from sqlalchemy import func, Column, String, Text, JSON, DateTime, text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import UUID
from model.base import Base


class ChatRecord(Base):
    __tablename__ = "chat_record"

    Id: Mapped[str] = mapped_column(UUID(), server_default=text("uuid_generate_v4()"), primary_key=True)
    ConversationId = Column(UUID(), nullable=False, index=True)
    Content = Column(Text(), nullable=False)
    FromRole = Column(String(255), nullable=False)
    CreatedAt = Column(DateTime, nullable=False, server_default=func.current_timestamp())


class ChatConversation(Base):
    __tablename__ = "chat_conversation"

    Id: Mapped[str] = mapped_column(UUID(), server_default=text("uuid_generate_v4()"), primary_key=True)
    AccountId = Column(UUID(), nullable=False, index=True)
    ApplicationId = Column(String(64), nullable=False)
    Title = Column(String(255), nullable=False)
    LastActiveAt = Column(DateTime, nullable=False, server_default=func.current_timestamp())
    CreatedAt = Column(DateTime, nullable=False, server_default=func.current_timestamp())


class SharedConversation(Base):
    __tablename__ = "shared_conversation"

    Id: Mapped[str] = mapped_column(UUID(), server_default=text("uuid_generate_v4()"), primary_key=True)
    AccountId = Column(UUID(), nullable=False, index=True)
    ApplicationId = Column(String(64), nullable=False)
    ParentConversationId = Column(UUID(), nullable=False)
    CreatedAt = Column(DateTime, nullable=False, server_default=func.current_timestamp())
    Records = Column(JSON(64), nullable=False)


class ChatHistory(Base):
    """
    Chat history storage for non-Tencent vendors (OpenAI, Ollama, etc.)
    Based on the successful SharedConversation design pattern
    Stores complete conversation history as JSON array for simple retrieval
    """
    __tablename__ = "chat_history"

    Id: Mapped[str] = mapped_column(UUID(), server_default=text("uuid_generate_v4()"), primary_key=True)
    ConversationId = Column(UUID(), nullable=False, unique=True, index=True)  # One record per conversation
    ApplicationId = Column(String(64), nullable=False, index=True)  # Distinguish different vendors (openai, ollama, etc.)
    Records = Column(JSON(), nullable=False, default=list)  # Complete message records using same JSON design as SharedConversation
    LastUpdated = Column(DateTime, nullable=False, server_default=func.current_timestamp(), onupdate=func.current_timestamp())
    CreatedAt = Column(DateTime, nullable=False, server_default=func.current_timestamp())
