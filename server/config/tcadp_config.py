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

    OPENAI_API_KEY: str = Field(
        description="OpenAI API key for conversation title generation",
        default="",
    )

    OPENAI_BASE_URL: str = Field(
        description="OpenAI API base URL",
        default="https://api.openai.com",
    )

    OPENAI_MODEL: str = Field(
        description="OpenAI model for conversation title generation",
        default="gpt-4o-mini",
    )
