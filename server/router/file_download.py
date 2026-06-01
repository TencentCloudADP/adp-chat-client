"""文件代理下载接口

通过后端代理从工作空间下载文件，避免前端直接访问 COS 产生跨域问题。
前端直接使用同域的 /file/download?... URL 即可下载或预览文件。
"""
import logging
from urllib.parse import quote

from sanic.views import HTTPMethodView
from sanic_restful_api import reqparse
from sanic.request.types import Request
from sanic.response import raw
from sanic.exceptions import SanicException

from router import login_required
from app_factory import TAgenticApp

app: TAgenticApp = TAgenticApp.get_app()


class FileDownloadApi(HTTPMethodView):
    """文件代理下载

    前端通过 GET /file/download?ApplicationId=xxx&AppId=xxx&WorkspaceId=xxx&Path=xxx
    获取文件内容。后端内部从工作空间沙箱获取文件，直接返回给前端。

    Query 参数:
        ApplicationId: 应用配置 ID（用于定位 vendor 实例）
        AppId:         应用 ID（传给 fetch_file 的 app_id）
        WorkspaceId:   工作空间 ID
        Path:          文件路径，如 /workdir/main.py
    """

    @login_required
    async def get(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("ApplicationId", type=str, required=True, location="args")
        parser.add_argument("AppId", type=str, required=True, location="args")
        parser.add_argument("WorkspaceId", type=str, required=True, location="args")
        parser.add_argument("Path", type=str, required=True, location="args")
        args = parser.parse_args(request)

        application_id = args['ApplicationId']
        app_id = args['AppId']
        workspace_id = args['WorkspaceId']
        file_path = args['Path']

        logging.info(
            f"[FileDownloadApi] ApplicationId={application_id}, "
            f"AppId={app_id}, WorkspaceId={workspace_id}, Path={file_path}"
        )

        vendor_app = app.get_vendor_app(application_id)

        if not hasattr(vendor_app, 'download_file_content'):
            raise SanicException(
                'This vendor does not support file download',
                status_code=501
            )

        try:
            content, content_type, file_name = await vendor_app.download_file_content(
                app_id=app_id,
                workspace_id=workspace_id,
                path=file_path,
            )
        except Exception as e:
            logging.error(f'[FileDownloadApi] download failed: {e}')
            raise SanicException(
                f'文件下载失败: {str(e)}',
                status_code=502
            ) from e

        # 使用 RFC 5987 编码文件名以支持中文等非 ASCII 字符
        encoded_filename = quote(file_name, safe='')

        return raw(
            body=content,
            content_type=content_type,
            headers={
                'Content-Disposition': (
                    f"attachment; filename=\"{encoded_filename}\"; "
                    f"filename*=UTF-8''{encoded_filename}"
                ),
                'Cache-Control': 'no-cache',
            },
        )


app.add_route(FileDownloadApi.as_view(), "/file/download")
