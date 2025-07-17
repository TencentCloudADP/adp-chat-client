import logging
from sanic.request.types import Request
from typing import TYPE_CHECKING, Any, Optional, Union, cast
from config import tagentic_config
from urllib.parse import urlparse

def get_remote_ip(request: Request) -> str:
    if request.headers.get("X-Forwarded-For"):
        return cast(str, request.headers.get("X-Forwarded-For"))
    else:
        return cast(str, request.remote_addr)

def get_path_base() -> str:
    parsed_url = urlparse(tagentic_config.SERVICE_API_URL)
    path = parsed_url.path
    if path == '':
        path = '/'
    return path