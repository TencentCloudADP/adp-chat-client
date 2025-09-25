from sanic import response

from util.helper import get_path_base
from app_factory import TAgenticApp
app = TAgenticApp.get_app()

"""
static file server
"""
app.static('/static/app/index', './static/app/index.html', name='index')
app.static('/static/app', './static/app', name='dir')
app.static('/static/app0/index', './static/app0/index.html', name='index0')
app.static('/static/app0', './static/app0', name='dir0')


@app.get('/')
async def handler(request):
    """
    redirect to index.html
    """
    path = get_path_base()
    if path.endswith('/'):
        path = path[:-1]
    return response.redirect(f'{path}/static/app0/index')
