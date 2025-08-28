from sanic import json
from sanic.views import HTTPMethodView
from sanic.request.types import Request
from router import login_required
from util.tca import asr_url
from app_factory import TAgenticApp
app = TAgenticApp.get_app()


class TCADPHelperAsrUrlApi(HTTPMethodView):
    @login_required
    async def get(self, request: Request):
        url = asr_url()
        return json({"url": url})


app.add_route(TCADPHelperAsrUrlApi.as_view(), "/helper/asr/url")
