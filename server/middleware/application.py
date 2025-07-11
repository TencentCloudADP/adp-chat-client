import time
from termcolor import colored
import logging

from config import tagentic_config
from util.tca import tc_request
from app_factory import TAgenticApp
app = TAgenticApp.get_app()

apps_info = []
apps_info_ts = time.time()

@app.middleware("request")
async def application_info(request):
    global apps_info, apps_info_ts
    ts = time.time()
    if ts - apps_info_ts > 60 or len(apps_info) == 0:
        apps_info_ts = ts
        apps = tagentic_config.TCADP_APP_KEYS
        apps_info = []
        for app in apps:
            action = "DescribeRobotBizIDByAppKey"
            payload = {
                "AppKey": app,
            }
            resp = await tc_request(action, payload)
            BotBizId = resp['Response']['BotBizId']

            action = "DescribeApp"
            payload = {
                "AppBizId": BotBizId,
            }
            resp = await tc_request(action, payload)
            if 'Error' in resp['Response']:
                logging.error(resp)
                apps_info.append({
                    "AppBizId": BotBizId,
                    "AppKey": app,
                })
            else:
                apps_info.append(resp['Response'])
    
    request.ctx.apps_info = apps_info
