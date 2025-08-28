from sanic import json
from sanic.views import HTTPMethodView
from sanic.request.types import Request
from app_factory import TAgenticApp
app = TAgenticApp.get_app()


class ApplicationListApi(HTTPMethodView):
    async def get(self, request: Request):
        apps_info = request.ctx.apps_info
        return json({"Applications": apps_info})


app.add_route(ApplicationListApi.as_view(), "/application/list")
