from sanic import response

from app_factory import create_app

app = create_app()

# redirect to index.html
@app.get('/')
async def handler(request):
    return response.redirect('/static/app/index')
