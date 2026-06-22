from sqlalchemy import func, Column, String, DateTime, text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import UUID

from model.base import Base


class AgentConfig(Base):
    __tablename__ = "agent_config"
    __table_args__ = (
        UniqueConstraint("AccountId", "ApplicationId", name="unique_account_application"),
    )

    Id: Mapped[str] = mapped_column(
        UUID(), server_default=text("uuid_generate_v4()"), primary_key=True
    )
    AccountId = Column(UUID(), nullable=False, index=True)
    ApplicationId = Column(String(64), nullable=False, index=True)
    AgentId = Column(String(64), nullable=False)
    CreatedAt = Column(DateTime, nullable=False, server_default=func.current_timestamp())
    UpdatedAt = Column(
        DateTime,
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )
