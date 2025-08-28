from datetime import datetime, date
import functools
from uuid import UUID

import ujson
from pydantic import BaseModel


def datetime_to_json_formatting(o):
    if isinstance(o, BaseModel):
        return o.model_dump()
    if isinstance(o, (date, datetime)):
        return int(o.timestamp())
    if isinstance(o, UUID):
        return str(o)


custom_dumps = functools.partial(ujson.dumps, default=datetime_to_json_formatting)
