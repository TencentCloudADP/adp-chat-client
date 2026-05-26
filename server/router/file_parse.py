"""实时文档解析接口

Standard 模式下，文件上传到 COS 后需要调用实时文档解析获取 doc_id，
然后在聊天时传入 doc_id 字段让大模型能正确解析文件内容。
"""
import logging

from sanic.views import HTTPMethodView
from sanic_restful_api import reqparse
from sanic.request.types import Request
from sanic.response import ResponseStream

from router import login_required
from app_factory import TAgenticApp

app: TAgenticApp = TAgenticApp.get_app()


class FileParseApi(HTTPMethodView):
    """实时文档解析 SSE 代理接口

    前端上传文件到 COS 后，调用此接口进行文档解析，获取 doc_id。
    该接口代理 LKE 的 /v1/qbot/chat/docParse SSE 流并透传给前端。

    请求格式 (POST JSON):
        {
            "ApplicationId": "xxx",
            "FileName": "test.pdf",
            "FileType": "pdf",
            "FileUrl": "https://...",
            "CosBucket": "lke-realtime-test-xxx",
            "CosUrl": "/public/.../test.pdf",
            "ETag": "xxx",
            "CosHash": "xxx",
            "Size": "12345",
            "ConversationId": "xxx"
        }
    响应: SSE 流
        data: {"type":"status","payload":{"doc_id":"123","process":50,"status":"RUNNING"}}
        data: {"type":"status","payload":{"doc_id":"123","process":100,"status":"SUCCESS"}}
    """

    @login_required
    async def post(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("ApplicationId", type=str, required=True, location="json")
        parser.add_argument("FileName", type=str, required=True, location="json")
        parser.add_argument("FileType", type=str, required=True, location="json")
        parser.add_argument("FileUrl", type=str, required=False, location="json")
        parser.add_argument("CosBucket", type=str, required=False, location="json")
        parser.add_argument("CosUrl", type=str, required=False, location="json")
        parser.add_argument("ETag", type=str, default="", location="json")
        parser.add_argument("CosHash", type=str, default="", location="json")
        parser.add_argument("Size", type=str, default="0", location="json")
        parser.add_argument("ConversationId", type=str, default="", location="json")
        args = parser.parse_args(request)

        application_id = args['ApplicationId']
        vendor_app = app.get_vendor_app(application_id)

        logging.info(f"[FileParseApi] ApplicationId={application_id}, FileName={args['FileName']}")

        async def streaming_fn(response):
            async for data in vendor_app.parse_document(
                account_id=request.ctx.account_id,
                file_name=args['FileName'],
                file_type=args['FileType'],
                file_url=args.get('FileUrl', ''),
                cos_bucket=args.get('CosBucket', ''),
                cos_url=args.get('CosUrl', ''),
                e_tag=args.get('ETag', ''),
                cos_hash=args.get('CosHash', ''),
                size=args.get('Size', '0'),
                conversation_id=args.get('ConversationId', ''),
            ):
                await response.write(data)

        return ResponseStream(streaming_fn, content_type='text/event-stream; charset=utf-8')


app.add_route(FileParseApi.as_view(), "/file/parse")
