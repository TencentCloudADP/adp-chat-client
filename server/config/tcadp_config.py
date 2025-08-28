import logging
from pydantic import Field
from pydantic_settings import BaseSettings

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
