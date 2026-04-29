import logging
from typing import Literal
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

    ADP_VISITOR_ID_TYPE: Literal["CUSTOMER_ID", "NAME"] = Field(
        description="VisitorId type for ADP chat requests. Supported values: CUSTOMER_ID, NAME",
        default="NAME",
    )
