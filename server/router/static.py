from sanic import response

from util.helper import get_remote_ip, get_path_base
from app_factory import TAgenticApp
app = TAgenticApp.get_app()

"""
static file server
"""
app.static('/static/app/index', './static/app/index.html', name='index')
app.static('/static/app', './static/app', name='dir')

"""
redirect to index.html
"""
@app.get('/')
async def handler(request):
    return response.redirect(f'{get_path_base()}/static/app/index')
