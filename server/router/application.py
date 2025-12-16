from sanic import json
from sanic.views import HTTPMethodView
from sanic.request.types import Request
from sanic_restful_api import reqparse
from router import login_required
from app_factory import TAgenticApp
from core.application import CoreApplication
app = TAgenticApp.get_app()


class ApplicationListApi(HTTPMethodView):
    @login_required
    async def get(self, request: Request):
        parser = reqparse.RequestParser()
        # 0: all, 1: published, 2: by-seft, 3: shared
        parser.add_argument("type", type=int, default=0, location="args") 
        args = parser.parse_args(request)

        if args.type == 0:
            apps_info = request.ctx.apps_info
            return json({"Applications": apps_info})
        elif args.type == 1:
            applications = await CoreApplication.list_published(request.ctx.db)
            shared_applications = await CoreApplication.list_shared(request.ctx.db, request.ctx.account_id)
            shared_ids = {app.ApplicationId for app in shared_applications}

            # 根据说明，为每个 application 增加 IsShared 字段
            print('1. applications length:', len(applications))
            for application in applications:
                # 某些 Application 可能是 model/application.py 的实例
                # ApplicationId 字段可以直接获取
                if hasattr(application, "ApplicationId"):
                    application.IsShared = application.ApplicationId in shared_ids
                else:
                    # fallback, 尝试用 Id 字段
                    application.IsShared = False

            return json({"Applications": [application.to_dict() for application in applications]})
        elif args.type == 2:
            applications = await CoreApplication.list(request.ctx.db, request.ctx.account_id)
            return json({"Applications": [application.to_dict() for application in applications]})
        elif args.type == 3:
            applications = await CoreApplication.list_shared(request.ctx.db, request.ctx.account_id)
            return json({"Applications": [application.to_dict() for application in applications]})
        else:
            return json({"Applications": []})

class ApplicationCreateApi(HTTPMethodView):
    @login_required
    async def post(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("Name", type=str, required=True, location="json")
        parser.add_argument("Avatar", type=str, required=True, location="json")
        parser.add_argument("ExtraInfo", type=dict, required=True, location="json")
        args = parser.parse_args(request)
        application = await CoreApplication.create(request.ctx.db, request.ctx.account_id, args.Name, args.Avatar, args.ExtraInfo)
        return json({"Application": application})

class ApplicationShareApi(HTTPMethodView):
    @login_required
    async def post(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("ApplicationId", type=str, required=True, location="json")
        args = parser.parse_args(request)
        await CoreApplication.share(request.ctx.db, args.ApplicationId, request.ctx.account_id)
        return json({"Success": 1})

class ApplicationUnshareApi(HTTPMethodView):
    @login_required
    async def post(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("ApplicationId", type=str, required=True, location="json")
        args = parser.parse_args(request)
        await CoreApplication.unshare(request.ctx.db, args.ApplicationId, request.ctx.account_id)
        return json({"Success": 1})

class ApplicationPublishApi(HTTPMethodView):
    @login_required
    async def post(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("ApplicationId", type=str, required=True, location="json")
        args = parser.parse_args(request)
        await CoreApplication.publish(request.ctx.db, args.ApplicationId, request.ctx.account_id)
        return json({"Success": 1})

class ApplicationUnpublishApi(HTTPMethodView):
    @login_required
    async def post(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("ApplicationId", type=str, required=True, location="json")
        args = parser.parse_args(request)
        await CoreApplication.unpublish(request.ctx.db, args.ApplicationId, request.ctx.account_id)
        return json({"Success": 1})

app.add_route(ApplicationListApi.as_view(), "/application/list")
app.add_route(ApplicationCreateApi.as_view(), "/application/create")
app.add_route(ApplicationShareApi.as_view(), "/application/share")
app.add_route(ApplicationUnshareApi.as_view(), "/application/unshare")
app.add_route(ApplicationPublishApi.as_view(), "/application/publish")
app.add_route(ApplicationUnpublishApi.as_view(), "/application/unpublish")