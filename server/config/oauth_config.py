import logging
from pydantic import Field
from pydantic_settings import BaseSettings

logger = logging.getLogger(__name__)


class OAuthConfig(BaseSettings):
    """
    Configuration settings for OAuth
    """
    OAUTH_GITHUB_CLIENT_ID: str = Field(
        description="OAuth with github, client id, you can obtain it from https://github.com/settings/applications/new",
        default="",
    )

    OAUTH_GITHUB_SECRET: str = Field(
        description="OAuth with github, secret, you can obtain it from https://github.com/settings/applications/new",
        default="",
    )

    OAUTH_MICROSOFT_ENTRA_ENDPOINT: str = Field(
        description="OAuth with Microsoft Entra ID, endpoint (optional, if you have a tenant id), see: https://learn.microsoft.com/en-us/entra/identity-platform/authentication-national-cloud",  # noqa: E501
        default="common",
    )

    OAUTH_MICROSOFT_ENTRA_CLIENT_ID: str = Field(
        description="OAuth with Microsoft Entra ID, client id, you can obtain it from https://entra.microsoft.com",
        default="",
    )

    OAUTH_MICROSOFT_ENTRA_SECRET: str = Field(
        description="OAuth with Microsoft Entra ID, secret, you can obtain it from https://entra.microsoft.com",
        default="",
    )
