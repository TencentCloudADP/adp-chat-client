import time
from termcolor import colored
import logging

from app_factory import TAgenticApp
app = TAgenticApp.get_app()

@app.middleware("request")
async def rec_time(request):
    request.ctx.performance_ts = time.time()

@app.middleware('response')
async def rec_time(request, response):
    ts = time.time()
    if hasattr(request.ctx, "performance_ts"):
        duration = ts - request.ctx.performance_ts
    else:
        duration = -1
    logging.info('[performance] {}s {} {} {}'.format(colored('{:.3f}'.format(duration), 'green' if duration < 0.1 else 'yellow' if duration < 0.5 else 'red'), request.ip, request.method, request.path))
