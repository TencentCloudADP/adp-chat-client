import enum
import json
from typing import Optional, cast

from sqlalchemy import func, INTEGER, Column, ForeignKey, String, DateTime, text
from sqlalchemy.orm import Mapped, mapped_column, reconstructor, DeclarativeBase
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase
class Base(DeclarativeBase):
    def to_dict(self):
        ret = dict(self.__dict__)
        del ret['_sa_instance_state']
        return ret

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

    id: Mapped[str] = mapped_column(UUID(), server_default=text("uuid_generate_v4()"), primary_key=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    password = Column(String(255), nullable=True)
    password_salt = Column(String(255), nullable=True)
    timezone = Column(String(255))
    last_login_at = Column(DateTime)
    last_login_ip = Column(String(255))
    last_active_at = Column(DateTime, nullable=False, server_default=func.current_timestamp())
    status = Column(String(16), nullable=False, server_default=text("'active'::character varying"))
    created_at = Column(DateTime, nullable=False, server_default=func.current_timestamp())
    updated_at = Column(DateTime, nullable=False, server_default=func.current_timestamp())

    @reconstructor
    def init_on_load(self):
        self.role: Optional[AccountRole] = None

    @property
    def is_password_set(self):
        return self.password is not None

    @property
    def get_role(self):
        return self.role

    def get_status(self) -> AccountStatus:
        status_str = self.status
        return AccountStatus(status_str)

    @property
    def is_admin(self):
        return AccountRole.is_admin_role(self.role)
