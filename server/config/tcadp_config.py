import logging
from typing import Any

from pydantic import Field, NonNegativeInt, PositiveFloat, PositiveInt
from pydantic.fields import FieldInfo
from pydantic_settings import BaseSettings, PydanticBaseSettingsSource, SettingsConfigDict

logger = logging.getLogger(__name__)


class TCADPConfig(BaseSettings):
    """
    Configuration settings for TCADP
    """

    TCADP_APP_KEY: str = Field(
        description="TCADP bot app key, you can obtain it from https://lke.cloud.tencent.com/",
        default="",
    )

    TCADP_API_URL: str = Field(
        description="TCADP API service url",
        default="",
    )
