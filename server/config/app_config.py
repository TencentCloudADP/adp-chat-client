import logging
from typing import Any

from pydantic import Field, NonNegativeInt, PositiveFloat, PositiveInt
from pydantic.fields import FieldInfo
from pydantic_settings import BaseSettings, PydanticBaseSettingsSource, SettingsConfigDict

from .redis_config import RedisConfig
from .pgsql_config import PGSqlConfig
from .tcadp_config import TCADPConfig

logger = logging.getLogger(__name__)


class TAgenticConfig(
    RedisConfig,
    PGSqlConfig,
    TCADPConfig,
):
    LOG_LEVEL: str = Field(
        description="Log level of the server, can be one of: CRITICAL, FATAL, ERROR, WARN, WARNING, INFO, DEBUG",
        default="INFO",
    )

    SECRET_KEY: str = Field(
        description="Secret key for secure session cookie signing."
            "Make sure you are changing this key for your deployment with a strong key."
            "Generate a strong key using `openssl rand -base64 64`.",
        default="",
    )

    ACCESS_TOKEN_EXPIRE_HOURS: PositiveInt = Field(
        description="Expiration time for access tokens in hours",
        default=24,
    )

    model_config = SettingsConfigDict(
        # read from dotenv format config file
        env_file=".env",
        env_file_encoding="utf-8",
        # ignore extra attributes
        extra="ignore",
    )
