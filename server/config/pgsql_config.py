from typing import Optional

from pydantic import Field, PositiveInt
from pydantic_settings import BaseSettings


class PGSqlConfig(BaseSettings):
    """
    Configuration settings for Redis connection
    """

    PGSQL_HOST: Optional[str] = Field(
        description="Hostname or IP address of the PostgreSQL server (e.g. 'localhost')",
        default=None,
    )

    PGSQL_PORT: PositiveInt = Field(
        description="Port number on which the PostgreSQL server is listening (default is 5433)",
        default=5433,
    )

    PGSQL_USER: Optional[str] = Field(
        description="Username of the PostgreSQL database",
        default=None,
    )

    PGSQL_PASSWORD: Optional[str] = Field(
        description="Password of the PostgreSQL database",
        default=None,
    )

    PGSQL_DB: Optional[str] = Field(
        description="Name of the PostgreSQL database to connect to",
        default=None,
    )
