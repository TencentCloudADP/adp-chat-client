import os
import logging
import time
from sanic import Sanic

from util.module import autodiscover
from util.module import autodiscover_vendor
from util.json_format import custom_dumps
from util.helper import dict_md5
from config import tagentic_config
import router
import middleware
from vendor.interface import BaseVendor

class TAgenticApp(Sanic):
    vendors = {}
    apps = {}

    def __init__(self, *args, **kwargs):
        super().__init__(dumps=custom_dumps, *args, **kwargs)
        self.config.update(tagentic_config.model_dump())
        logging.basicConfig(level=logging.getLevelNamesMapping()[self.config.LOG_LEVEL], format='%(asctime)s - %(levelname)s - %(message)s')

        # 厂商类注册
        self.vendors.update(autodiscover_vendor())
        logging.info(f'vendors: {self.vendors}')

        # 实例化应用配置
        apps = tagentic_config.APP_CONFIGS
        for app_config in apps:
            if app_config['Vendor'] in self.vendors.keys():
                # application_id = dict_md5(app_config)
                application_id = app_config['ApplicationId']
                self.apps[application_id] = ( self.vendors[app_config['Vendor']](app_config, application_id) )
        logging.info(f'apps: {self.apps}')
    
    def get_vendor_app(self, application_id: str) -> BaseVendor:
        if application_id in self.apps.keys():
            return self.apps[application_id]
        raise Exception(f'application_id {application_id} not found')

def create_app_with_configs() -> TAgenticApp:
    """
    create a sanic app and load configs from .env file
    """
    tagentic_app = TAgenticApp(__name__)

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
