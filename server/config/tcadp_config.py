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
    TC_SECRET_APPID: str = Field(
        description="Tencent secret appid, you can obtain it from https://console.cloud.tencent.com/cam/capi",
        default="",
    )

    TC_SECRET_ID: str = Field(
        description="Tencent secret id, you can obtain it from https://console.cloud.tencent.com/cam/capi",
        default="",
    )

    TC_SECRET_KEY: str = Field(
        description="Tencent secret key, you can obtain it from https://console.cloud.tencent.com/cam/capi",
        default="",
    )

    APP_CONFIGS: list[dict] = Field(
        description="app configs, for TCADP, you can obtain it from https://lke.cloud.tencent.com/",
        default="",
    )

    TC_TCADP_HOST: str = Field(
        description="host of TCADP API service",
        default="",
    )

    TC_TCADP_REGION: str = Field(
        description="region of TCADP API service",
        default="",
    )
