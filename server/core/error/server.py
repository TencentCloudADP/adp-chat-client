from typing import Optional
from core.error import BaseError


class RateLimit(BaseError):
    def __init__(self, description: Optional[str] = None):
        super().__init__(description)
        self.status_code = 429
