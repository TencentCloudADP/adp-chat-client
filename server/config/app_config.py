import logging
from typing import Any

from pydantic import Field, NonNegativeInt, PositiveFloat, PositiveInt
from pydantic.fields import FieldInfo
from pydantic_settings import BaseSettings, PydanticBaseSettingsSource, SettingsConfigDict

from .redis_config import RedisConfig
from .pgsql_config import PGSqlConfig

logger = logging.getLogger(__name__)


class TAgenticConfig(
    RedisConfig,
    PGSqlConfig,
):
    LOG_LEVEL: str = Field(
        description="Log level of the server, can be one of: CRITICAL, FATAL, ERROR, WARN, WARNING, INFO, DEBUG",
        default="INFO",
    )

    model_config = SettingsConfigDict(
        # read from dotenv format config file
        env_file=".env",
        env_file_encoding="utf-8",
        # ignore extra attributes
        extra="ignore",
    )
