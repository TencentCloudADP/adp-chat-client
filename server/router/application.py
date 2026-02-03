from sanic import json
from sanic.views import HTTPMethodView
from sanic.request.types import Request
from app_factory import TAgenticApp
from router import check_login
from core.account import CoreAccount
import re
import logging

app = TAgenticApp.get_app()


class ApplicationListApi(HTTPMethodView):
    async def get(self, request: Request):
        apps_info = request.ctx.apps_info

        # 如果用户已登录，替换欢迎语中的变量
        try:
            check_login(request)
            account = await CoreAccount.get(request.ctx.db, request.ctx.account_id)

            # 为每个应用创建个性化副本
            personalized_apps = []
            for app_info in apps_info:
                # 转换为字典以便修改
                app_dict = app_info.model_dump() if hasattr(app_info, 'model_dump') else app_info.__dict__.copy()

                # 替换欢迎语中的变量
                if 'Greeting' in app_dict and app_dict['Greeting']:
                    greeting = app_dict['Greeting']
                    # 替换 {{API.user_account}} 为用户名称
                    greeting = re.sub(
                        r'\{\{API\.user_account\}\}',
                        account.Name or account.Email or str(account.Id),
                        greeting
                    )
                    app_dict['Greeting'] = greeting

                personalized_apps.append(app_dict)

            return json({"Applications": personalized_apps})
        except Exception as e:
            # 如果获取用户信息失败（未登录等），返回原始信息
            logging.debug(f"Failed to personalize greeting: {e}")
            return json({"Applications": apps_info})


app.add_route(ApplicationListApi.as_view(), "/application/list")
