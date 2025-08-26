from sanic import json
from sanic.views import stream
from sanic.views import HTTPMethodView
from sanic_restful_api import reqparse
from sanic.request.types import Request
from router import login_required
from app_factory import TAgenticApp
app: TAgenticApp = TAgenticApp.get_app()


class FileUploadApi(HTTPMethodView):
    @stream
    @login_required
    async def post(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("ApplicationId", type=str, required=True, location="args")
        args = parser.parse_args(request)
        application_id = args['ApplicationId']
        vendor_app = app.get_vendor_app(application_id)

        Url = await vendor_app.upload(request.ctx.db, request, request.ctx.account_id)
        return json({"Url": Url})

app.add_route(FileUploadApi.as_view(), "/file/upload")
