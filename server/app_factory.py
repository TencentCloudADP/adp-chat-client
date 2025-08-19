import os
import logging
import time
from sanic import Sanic

from util.module import autodiscover
from util.json_format import custom_dumps
from util.helper import dict_md5
from config import tagentic_config
import router
import middleware

class TAgenticApp(Sanic):
    vendors = {}
    apps = {}

    def __init__(self, *args, **kwargs):
        super().__init__(dumps=custom_dumps, *args, **kwargs)
        self.config.update(tagentic_config.model_dump())
        logging.basicConfig(level=logging.getLevelNamesMapping()[self.config.LOG_LEVEL], format='%(asctime)s - %(levelname)s - %(message)s')

        # 厂商类注册
        from vendor.tcadp.tcadp import get_class
        cls = get_class()
        self.vendors[cls.get_config_prefix()] = cls
        from vendor.dify.dify import get_class
        cls = get_class()
        self.vendors[cls.get_config_prefix()] = cls
        logging.info(f'vendors: {self.vendors}')
        
        # 实例化应用配置
        apps = tagentic_config.APP_CONFIGS
        for app_config in apps:
            if app_config['Type'] in self.vendors.keys():
                application_id = dict_md5(app_config)
                self.apps[application_id] = ( self.vendors[app_config['Type']](app_config, application_id) )
        logging.info(f'apps: {self.apps}')
    
    def get_vendor_app(self, application_id: str):
        if application_id in self.apps.keys():
            return self.apps[application_id]
        raise Exception(f'application_id {application_id} not found')

    # 保存在conversation表里的application_id可能是旧的格式，需要转换成新的
    def convert_old_application_id(self, application_id_old: str):
        for application_id, vendor_app in self.apps.items():
            if 'BotBizId' in vendor_app.config and vendor_app.config['BotBizId'] == application_id_old:
                return application_id
        return None

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
