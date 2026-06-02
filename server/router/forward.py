import logging
import re
import inspect

import sanic
from sanic.views import HTTPMethodView
from sanic_restful_api import reqparse
from sanic.request.types import Request
from sanic.exceptions import SanicException

from router import login_required
from app_factory import TAgenticApp

app: TAgenticApp = TAgenticApp.get_app()

# Action 名称白名单正则：只允许大小写字母和数字组成的合法 Action 名
ACTION_PATTERN = re.compile(r'^[A-Za-z][A-Za-z0-9]{1,128}$')


def action_to_method_name(action: str) -> str:
    """将 PascalCase 的 Action 名称转换为 snake_case 的方法名

    例如:
        GetMessages -> get_messages
        DescribeKnowledges -> describe_knowledges
        RateMsgRecord -> rate_msg_record
        GetReferenceDetails -> get_reference_details
    """
    # 在大写字母前插入下划线（处理连续大写如 "URL" -> "u_r_l" 的情况也兼顾）
    s1 = re.sub(r'([A-Z]+)([A-Z][a-z])', r'\1_\2', action)
    s2 = re.sub(r'([a-z0-9])([A-Z])', r'\1_\2', s1)
    return s2.lower()


class ForwardApi(HTTPMethodView):
    """通用 API 转发端点

    当前端需要调用的腾讯云 API Action 在后端没有对应的专属路由时，
    通过 /adp/<action> 路径自动转发。前端只需将 Action 名称作为
    URL 路径的一部分，后端自动解析并调用 vendor 对应的方法。

    优先级：
        1. 如果 vendor 上存在与 action 对应的 snake_case 方法（如 GetMessages -> get_messages），
           则直接调用该方法并传入 Payload 作为参数。
        2. 如果没有找到对应方法，则回退到 vendor.forward_request 通用转发。

    请求格式 (POST JSON):
        POST /adp/DescribeKnowledges
        {
            "ApplicationId": "xxx",    # 应用 ID（必填）
            "Payload": { ... },        # 转发给腾讯云的请求参数（选填，默认 {}）
            "Service": "lke",          # 服务名（选填，默认 "lke"）
            "Version": "2025-11-12"    # API 版本号（选填，不传则使用 service 配置中的默认版本）
        }

    响应格式:
        {
            "Response": { ... }  # 腾讯云 API 原始响应 / 方法返回值
        }
    """

    @login_required
    async def post(self, request: Request, action: str):
        # 校验 Action 名称格式，防止注入
        if not ACTION_PATTERN.match(action):
            raise SanicException(
                f'Invalid Action name: {action}',
                status_code=400
            )

        parser = reqparse.RequestParser()
        parser.add_argument("ApplicationId", type=str, required=True, location="json")
        parser.add_argument("Payload", type=dict, default={}, location="json")
        parser.add_argument("Service", type=str, default="lke", location="json")
        parser.add_argument("Version", type=str, default=None, location="json")
        args = parser.parse_args(request)

        application_id = args['ApplicationId']
        payload = args['Payload'] or {}
        service = args['Service'] or 'lke'
        version = args['Version']

        # 获取 vendor 实例
        vendor_app = app.get_vendor_app(application_id)

        # 构建模板变量上下文，用于 action_version.json 中 {{VAR}} 的替换
        variables = {
            'APP_KEY': vendor_app.config.get('AppKey', ''),
            'ACCOUNT_ID': request.ctx.account_id,
        }

        logging.info(f'[ForwardApi] Action={action}, ApplicationId={application_id}')

        # 尝试将 Action 名称转为 snake_case 并查找 vendor 上的已定义方法
        method_name = action_to_method_name(action)
        method = getattr(vendor_app, method_name, None)

        # 如果方法存在、可调用、且不是 forward_request 本身，优先使用已定义方法
        if method is not None and callable(method) and method_name != 'forward_request':
            logging.info(f'[ForwardApi] Found defined method: {method_name}, calling directly')
            try:
                # 检查方法是否为协程函数
                if inspect.iscoroutinefunction(method):
                    response = await method(**payload)
                else:
                    response = method(**payload)
            except TypeError as e:
                # 参数不匹配时给出明确错误提示
                raise SanicException(
                    f'Method {method_name} parameter error: {str(e)}',
                    status_code=400
                ) from e

            return sanic.json({"Response": response})

        # 没有找到对应方法，回退到通用转发
        if not hasattr(vendor_app, 'forward_request'):
            raise SanicException(
                f'Vendor for application {application_id} does not support forward_request',
                status_code=501
            )

        logging.info(f'[ForwardApi] No defined method for {method_name}, using forward_request')

        try:
            response = await vendor_app.forward_request(
                action,
                payload,
                service,
                version=version,
                raise_on_error=False,
                variables=variables,
            )
        except NotImplementedError as error:
            raise SanicException(
                'This vendor does not support generic forwarding',
                status_code=501
            ) from error

        return sanic.json({"Response": response})


app.add_route(ForwardApi.as_view(), "/adp/<action:str>")
