import os
import logging
import time
from sanic import Sanic

from util.module import autodiscover
from util.json_format import custom_dumps
from config import tagentic_config
import router
import middleware

class TAgenticApp(Sanic):
    def __init__(self, *args, **kwargs):
        super().__init__(dumps=custom_dumps, *args, **kwargs)

def create_app_with_configs() -> TAgenticApp:
    """
    create a sanic app and load configs from .env file
    """
    tagentic_app = TAgenticApp(__name__)
    tagentic_app.config.update(tagentic_config.model_dump())
    logging.basicConfig(level=logging.getLevelNamesMapping()[tagentic_app.config.LOG_LEVEL], format='%(asctime)s - %(levelname)s - %(message)s')

    return tagentic_app

def create_app() -> TAgenticApp:
    # Set server timezone to UTC. Time display will format in client side with customer's timezone
    os.environ['TZ'] = 'UTC'
    time.tzset()

    start_time = time.perf_counter()
    app = create_app_with_configs()
    initialize_middleware(app)
    end_time = time.perf_counter()
    logging.info(f"Finished create_app ({(end_time - start_time) * 1000:.2f} ms)")
    return app

def initialize_middleware(app: TAgenticApp):
    """
    auto load all blueprints and middleware from server/router and server/middleware
    """
    autodiscover(
        app,
        [
            router,
            middleware,
        ],
        recursive=True,
    )
