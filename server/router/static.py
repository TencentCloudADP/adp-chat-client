from sanic import response

from util.helper import get_path_base
from router import auto_login
from app_factory import TAgenticApp
app = TAgenticApp.get_app()

"""
static file server
"""
app.static('/static/app/index', './static/app/index.html', name='index')
app.static('/static/app0/index', './static/app0/index.html', name='index0')
app.static('/static', './static', name='static')


@app.get('/')
async def handler(request):
    """
    redirect to index.html
    """
    path = get_path_base()
    if path.endswith('/'):
        path = path[:-1]
    referrer = request.headers.get("Referer")
    app_path = 'static/app/index'
    if referrer and referrer.endswith('static/app0/index'):
        app_path = 'static/app0/index'

    resp = response.redirect(f'{path}/{app_path}')
    if app.config.AUTO_CREATE_ACCOUNT:
        # 自动创建账户
        resp = await auto_login(request, resp)
    return resp
