import logging
from sanic.request.types import Request
from typing import TYPE_CHECKING, Any, Optional, Union, cast

def get_remote_ip(request: Request) -> str:
    if request.headers.get("X-Forwarded-For"):
        return cast(str, request.headers.get("X-Forwarded-For"))
    else:
        return cast(str, request.remote_addr)

