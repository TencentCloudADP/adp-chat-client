import os
import logging
import logging.handlers
import time
from pathlib import Path

from dotenv import load_dotenv
from sanic import Sanic

env_path = Path(__file__).resolve().parent / ".env"
logging.getLogger(__name__).warning("Loading dotenv from %s (exists=%s)", env_path, env_path.exists())
load_dotenv(env_path, override=False)

from util.module import autodiscover
from util.module import autodiscover_vendor
from util.module import autodiscover_oauth
from util.json_format import custom_dumps
from config import tagentic_config
import router
import middleware
from vendor.interface import BaseVendor
from core.oauth import CoreOAuth


class TAgenticApp(Sanic):
    vendors = {}
    apps = {}

    def __init__(self, *args, **kwargs):
        super().__init__(dumps=custom_dumps, *args, **kwargs)
        self.config.update(tagentic_config.model_dump())
        self.config.RESPONSE_TIMEOUT = tagentic_config.SERVER_RESPONSE_TIMEOUT
        self._setup_logging()

        # 厂商类注册
        self.vendors.update(autodiscover_vendor())
        logging.info(f'vendors: {self.vendors}')

        # OAuth提供方类注册
        autodiscover_oauth()
        logging.info(f'activated oauth_providers: {CoreOAuth.providers}')

        # 实例化应用配置
        apps = tagentic_config.APP_CONFIGS
        for app_config in apps:
            if app_config['Vendor'] in self.vendors.keys():
                application_id = app_config['ApplicationId']
                self.apps[application_id] = self.vendors[app_config['Vendor']](app_config, application_id)
            else:
                logging.error(f'Vendor {app_config["Vendor"]} not found in vendors({list(self.vendors.keys())})')
        logging.info(f'apps: {self.apps}')

    def _setup_logging(self):
        """配置日志：控制台 + 本地文件持久化（按天轮转，保留 3 天）"""
        log_level = logging.getLevelNamesMapping()[self.config.LOG_LEVEL]
        log_format = '%(asctime)s - %(levelname)s - %(message)s'
        formatter = logging.Formatter(log_format)

        # 根 logger 配置
        root_logger = logging.getLogger()
        root_logger.setLevel(log_level)

        # 控制台 handler（保持原有行为）
        console_handler = logging.StreamHandler()
        console_handler.setLevel(log_level)
        console_handler.setFormatter(formatter)
        root_logger.addHandler(console_handler)

        # 文件 handler：按天轮转，保留 3 天
        log_dir = Path(__file__).resolve().parent / 'logs'
        log_dir.mkdir(exist_ok=True)
        file_handler = logging.handlers.TimedRotatingFileHandler(
            filename=log_dir / 'server.log',
            when='midnight',       # 每天午夜轮转
            interval=1,
            backupCount=3,         # 保留最近 3 天的日志
            encoding='utf-8',
        )
        file_handler.suffix = '%Y-%m-%d'  # 轮转后文件名后缀：server.log.2026-07-01
        file_handler.setLevel(log_level)
        file_handler.setFormatter(formatter)
        root_logger.addHandler(file_handler)

    def get_vendor_app(self, application_id: str) -> BaseVendor:
        if application_id in self.apps.keys():
            return self.apps[application_id]
        raise Exception(f'application_id {application_id} not found')


def create_app_with_configs() -> TAgenticApp:
    """
    create a sanic app and load configs from .env file
    """
    return TAgenticApp(__name__)


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
