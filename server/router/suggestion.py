"""
提示建议（Prompt Suggestion）接口

对标 DescribePromptSuggestionList 的协议结构，直接从环境变量
SUGGESTION_CONFIGS 中读取预配置的快捷按钮分组与建议列表并返回。
"""
import sanic
from sanic.views import HTTPMethodView

from router import login_required
from app_factory import TAgenticApp
from config import tagentic_config

app: TAgenticApp = TAgenticApp.get_app()


class SuggestionApi(HTTPMethodView):
    """GET /api/suggestions

    返回格式与 DescribePromptSuggestionList 完全一致:
        {
            "Response": {
                "GroupList": [
                    {
                        "GroupId": "...",
                        "IconUrl": "...",
                        "Name": "...",
                        "SuggestionList": [
                            {
                                "SuggestionId": "...",
                                "Title": "...",
                                "PromptContent": "..."
                            }
                        ]
                    }
                ]
            }
        }
    """

    @login_required
    async def get(self, _request):
        group_list = tagentic_config.SUGGESTION_CONFIGS or []
        return sanic.json({
            "Response": {
                "GroupList": group_list,
            },
        })


app.add_route(SuggestionApi.as_view(), "/suggestions")
