import enum
from typing import Optional

from sqlalchemy import func, Column, String, DateTime, Text, text, UniqueConstraint, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import UUID

from model.base import Base
from sqlalchemy import UUID
import sqlalchemy


class Application(Base):
    __tablename__ = "application"

    Id: Mapped[str] = mapped_column(UUID(), server_default=text("uuid_generate_v4()"), primary_key=True)
    Vendor = Column(String(255), nullable=False)
    Name = Column(String(255), nullable=True)
    ApplicationId = Column(String(255), nullable=True)
    AppKey = Column(String(255), nullable=True)
    Avatar = Column(String(255), nullable=True)
    Greeting = Column(Text(), nullable=True)
    Comment = Column(Text(), nullable=True)
    OpeningQuestions = Column(Text(), nullable=True)
    International = Column(Boolean(), nullable=True, default=False)
    CreatedBy = Column(UUID(), nullable=True)
    Published = Column(Boolean(), nullable=True, default=False)
    ExtraInfo = Column(Text(), nullable=True)


class SharedApplication(Base):
    __tablename__ = "shared_application"

    Id: Mapped[str] = mapped_column(UUID(), server_default=text("uuid_generate_v4()"), primary_key=True)
    ApplicationId = Column(String(255), nullable=False)
    SharedBy = Column(UUID(), nullable=False)

