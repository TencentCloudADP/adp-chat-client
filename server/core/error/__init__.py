from typing import Optional


class BaseError(ValueError):
    def __init__(self, description: Optional[str] = None):
        self.description = description
