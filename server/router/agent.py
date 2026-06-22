from sanic import json
from sanic.views import HTTPMethodView
from sanic_restful_api import reqparse
from sanic.request.types import Request

from router import login_required
from core.agent import CoreAgent
from app_factory import TAgenticApp

app: TAgenticApp = TAgenticApp.get_app()


class AgentConfigApi(HTTPMethodView):
    @login_required
    async def get(self, request: Request):
        """获取当前用户在指定 application 下的 AgentId"""
        parser = reqparse.RequestParser()
        parser.add_argument("ApplicationId", type=str, required=True, location="args")
        args = parser.parse_args(request)

        record = await CoreAgent.get(
            request.ctx.db,
            request.ctx.account_id,
            args["ApplicationId"],
        )
        return json({
            "Response": {
                "ApplicationId": args["ApplicationId"],
                "AgentId": record.AgentId if record else None,
            }
        })

    @login_required
    async def post(self, request: Request):
        """新增或更新当前用户在指定 application 下的 AgentId"""
        parser = reqparse.RequestParser()
        parser.add_argument("ApplicationId", type=str, required=True, location="json")
        parser.add_argument("AgentId", type=str, required=True, location="json")
        args = parser.parse_args(request)

        record = await CoreAgent.upsert(
            request.ctx.db,
            request.ctx.account_id,
            args["ApplicationId"],
            args["AgentId"],
        )
        return json({
            "Response": {
                "ApplicationId": record.ApplicationId,
                "AgentId": record.AgentId,
            }
        })


app.add_route(AgentConfigApi.as_view(), "/agent/config")
