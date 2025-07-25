import time
from termcolor import colored
import logging
import asyncio

from config import tagentic_config
from util.tca import tc_request
from app_factory import TAgenticApp
app = TAgenticApp.get_app()

apps_info = []
apps_info_ts = time.time()

async def update_application_info():
    global apps_info, apps_info_ts
    logging.info(f'[update_application_info] begin')

    apps = tagentic_config.TCADP_APP_KEYS
    _apps_info = []
    for app in apps:
        action = "DescribeRobotBizIDByAppKey"
        payload = {
            "AppKey": app,
        }
        resp = await tc_request(action, payload)
        if 'Error' in resp['Response']:
            logging.error(resp)
            continue
        BotBizId = resp['Response']['BotBizId']

        action = "DescribeApp"
        payload = {
            "AppBizId": BotBizId,
        }
        resp = await tc_request(action, payload)
        if 'Error' in resp['Response']:
            logging.error(resp)
            _apps_info.append({
                "AppBizId": BotBizId,
                "AppKey": app,
            })
        else:
            _apps_info.append(resp['Response'])
    
    apps_info = _apps_info
    logging.info(f'[update_application_info] done')
    
@app.listener('before_server_start')
async def init_application_info(app, loop):
    await update_application_info()

@app.middleware("request")
async def application_info(request):
    global apps_info, apps_info_ts

    ts = time.time()
    if ts - apps_info_ts > 60:
        apps_info_ts = ts
        # 异步更新，不阻塞流程
        task = asyncio.create_task(update_application_info())
        logging.info(f'[update_application_info] {task}')
            
    request.ctx.apps_info = apps_info
