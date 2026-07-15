import logging
from pydantic import Field, PositiveInt
from pydantic_settings import SettingsConfigDict

from .redis_config import RedisConfig
from .pgsql_config import PGSqlConfig
from .tcadp_config import TCADPConfig
from .oauth_config import OAuthConfig

logger = logging.getLogger(__name__)


class TAgenticConfig(
    RedisConfig,
    PGSqlConfig,
    TCADPConfig,
    OAuthConfig,
):
    LOG_LEVEL: str = Field(
        description="Log level of the server, can be one of: CRITICAL, FATAL, ERROR, WARN, WARNING, INFO, DEBUG",
        default="INFO",
    )

    SERVICE_API_URL: str = Field(
        description="URL of the service API, used for OAuth callback, resource path, etc.",
        default="",
    )

    SECRET_KEY: str = Field(
        description="Secret key for secure session cookie signing."
            "Make sure you are changing this key for your deployment with a strong key."
            "Generate a strong key using `openssl rand -base64 64`.",
        default="",
    )

    APP_CONFIGS: list[dict] = Field(
        description="app configs, for TCADP, you can obtain it from https://lke.cloud.tencent.com/",
        default=[],
    )

    SUGGESTION_CONFIGS: list[dict] = Field(
        description="prompt suggestion configs for assist quick buttons, "
            "each item is a group with IconUrl, Name and SuggestionList",
        default=[],
    )

    CUSTOMER_ACCOUNT_SECRET_KEY: str = Field(
        description="Secret key for secure customer account signing."
            "Make sure you are changing this key for your deployment with a strong key."
            "Generate a strong key using `openssl rand -base64 64`.",
        default="",
    )

    ACCESS_TOKEN_EXPIRE_HOURS: PositiveInt = Field(
        description="Expiration time for access tokens in hours",
        default=24,
    )

    AUTO_CREATE_ACCOUNT: bool = Field(
        description="Whether to automatically create an account for new users",
        default=False,
    )

    CHAT_MESSAGE_PAGE_SIZE: PositiveInt = Field(
        description="Number of messages to load per page when browsing chat history",
        default=100,
    )

    SERVER_RESPONSE_TIMEOUT: PositiveInt = Field(
        description=(
            "Sanic RESPONSE_TIMEOUT for regular (non-streaming) API responses in seconds. "
            "Does NOT affect SSE streaming responses once the first chunk is written. "
            "SSE upstream idle timeout is controlled separately by SSE_IDLE_TIMEOUT."
        ),
        default=300,
    )

    SSE_IDLE_TIMEOUT: PositiveInt = Field(
        description=(
            "Upstream SSE idle timeout in seconds (aiohttp sock_read). "
            "Triggered when the upstream SSE service stops pushing new chunks for this long. "
            "Only applies to server<->upstream SSE connections; regular APIs use SERVER_RESPONSE_TIMEOUT. "
            "Default is 5400s (90 minutes) to accommodate long-running chat streams."
        ),
        default=5400,
    )

    RATE_LIMIT: str = Field(
        description="Rate limit configuration in format 'requests/period' (e.g., '100/minute')",
        default="100/minute",
    )

    CORS_ORIGINS: str = Field(
        description="Allowed CORS origins. Multiple origins separated by comma, "
            "e.g. 'http://localhost,http://127.0.0.1:3000'",
        default="http://localhost",
    )

    IFRAME_ORIGINS: str = Field(
        description="Allowed parent origins for iframe embedding via CSP frame-ancestors. "
            "Multiple origins separated by comma, e.g. 'https://example.com,https://foo.bar'. "
            "Leave empty to allow only same-origin embedding.",
        default="",
    )

    # COS 对象存储配置（SecretId/SecretKey 复用 TC_SECRET_ID / TC_SECRET_KEY）
    COS_REGION: str = Field(
        description="COS 存储桶所在地域，如 ap-beijing、ap-guangzhou",
        default="ap-guangzhou",
    )

    COS_BUCKET: str = Field(
        description="COS 存储桶名称，格式为 BucketName-APPID，如 mybucket-1250000000",
        default="",
    )

    model_config = SettingsConfigDict(
        # read from dotenv format config file
        env_file=".env",
        env_file_encoding="utf-8",
        # ignore extra attributes
        extra="ignore",
    )
