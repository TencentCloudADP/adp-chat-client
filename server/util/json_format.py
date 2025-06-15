import ujson
import functools
from datetime import datetime, date
def datetime_to_json_formatting(o):
    if isinstance(o, (date, datetime)):
        return o.strftime('%Y-%m-%d %H:%M:%S')

custom_dumps = functools.partial(ujson.dumps, default=datetime_to_json_formatting)
