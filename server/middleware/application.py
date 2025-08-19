import time
from termcolor import colored
import logging
import asyncio

from config import tagentic_config
from util.tca import tc_request
from app_factory import TAgenticApp
app = TAgenticApp.get_app()


class CoreApplication:
    _instance = None
    # 单例模式
    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance

    apps_info = []
    apps_info_ts = time.time()

    async def hook_application_info(self, request):
        ts = time.time()
        if ts - self.apps_info_ts > 60:
            self.apps_info_ts = ts
            # 异步更新，不阻塞流程
            task = asyncio.create_task(self.update_application_info())
            logging.info(f'[update_application_info] {task}')
        
        request.ctx.apps_info = self.apps_info
    
    async def update_application_info(self):
        logging.info(f'[update_application_info] begin')

        apps = app.apps
        _apps_info = []
        for application_id, vendor_app in apps.items():
            info = await vendor_app.get_info()
            info.ApplicationId = application_id
            _apps_info.append(info)
            # print(vendor_app)
            # print(info)
        
        self.apps_info = _apps_info
        logging.info(f'[update_application_info] done')
    
@app.listener('before_server_start')
async def init_application_info(app, loop):
    core_app = CoreApplication()
    await core_app.update_application_info()

@app.middleware("request")
async def application_info(request):
    await CoreApplication().hook_application_info(request)
