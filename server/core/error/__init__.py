from typing import Optional
from sanic.exceptions import SanicException


class BaseError(SanicException):
    def __init__(self, description: Optional[str] = None):
        self.description = description
