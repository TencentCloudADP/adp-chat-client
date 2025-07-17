import enum
import json
from typing import Optional, cast
from sqlalchemy import func, INTEGER, Column, ForeignKey, String, DateTime, JSON, Text, text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, reconstructor, DeclarativeBase
from sqlalchemy import UUID
from model.base import Base

class AccountRole(enum.StrEnum):
    ADMIN = "admin"
    NORMAL = "normal"

    @staticmethod
    def is_valid(role: str) -> bool:
        if not role:
            return False
        return role in {
            AccountRole.ADMIN,
            AccountRole.NORMAL,
        }

    @staticmethod
    def is_admin(role: Optional["AccountRole"]) -> bool:
        if not role:
            return False
        return role == AccountRole.ADMIN


class AccountStatus(enum.StrEnum):
    PENDING = "pending"
    UNINITIALIZED = "uninitialized"
    ACTIVE = "active"
    BANNED = "banned"


class Account(Base):
    __tablename__ = "account"

    Id: Mapped[str] = mapped_column(UUID(), server_default=text("uuid_generate_v4()"), primary_key=True)
    Name = Column(String(255), nullable=False)
    Role = Column(String(16), nullable=False, server_default=AccountRole.NORMAL)
    Email = Column(String(255), nullable=True, unique=True)
    Password = Column(String(255), nullable=True)
    PasswordSalt = Column(String(255), nullable=True)
    Timezone = Column(String(255))
    LastLoginAt = Column(DateTime)
    LastLoginIp = Column(String(255))
    LastActiveAt = Column(DateTime, nullable=False, server_default=func.current_timestamp())
    Status = Column(String(16), nullable=False, server_default=AccountStatus.ACTIVE)
    CreatedAt = Column(DateTime, nullable=False, server_default=func.current_timestamp())
    UpdatedAt = Column(DateTime, nullable=False, server_default=func.current_timestamp())
    ExtraInfo = Column(Text(), nullable=True)

    @property
    def is_password_set(self):
        return self.Password is not None

    @property
    def get_role(self):
        return self.Role

    def get_status(self) -> AccountStatus:
        status_str = self.Status
        return AccountStatus(status_str)

    @property
    def is_admin(self):
        return AccountRole.is_admin(self.Role)

class AccountThirdParty(Base):
    __tablename__ = "account_third_party"
    __table_args__ = (
        UniqueConstraint("AccountId", "Provider", name="unique_account_provider"),
        UniqueConstraint("Provider", "OpenId", name="unique_provider_open_id"),
    )

    Id: Mapped[str] = mapped_column(UUID(), server_default=text("uuid_generate_v4()"), primary_key=True)
    AccountId = Column(UUID(), nullable=False)
    Provider = Column(String(16), nullable=False)
    OpenId = Column(String(255), nullable=False)
    Token = Column(String(255), nullable=True)
    CreatedAt = Column(DateTime, nullable=False, server_default=func.current_timestamp())
    UpdatedAt = Column(DateTime, nullable=False, server_default=func.current_timestamp())

