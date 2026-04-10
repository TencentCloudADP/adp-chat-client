from vendor.tcadp.tcadp import TCADP


def test_tcadp_thought_text_prefers_display_thought_and_keeps_status_separate():
    procedure = {
        "Name": "reasoning",
        "Title": "思考",
        "Status": "processing",
        "Debugging": {
            "DisplayContent": "展示给用户的思考正文",
            "Content": "原始调试文本",
            "DisplayStatus": "检索中",
        },
    }

    message = TCADP._build_thought_message("record-1", procedure, 0)

    assert message is not None
    assert message.Contents is not None
    assert message.Contents[0].Text == "展示给用户的思考正文"
    assert message.StatusDesc == "检索中"


def test_tcadp_thought_text_falls_back_to_content():
    procedure = {
        "Name": "reasoning",
        "Title": "思考",
        "Status": "completed",
        "Debugging": {
            "Content": "只有原始调试文本",
        },
    }

    message = TCADP._build_thought_message("record-1", procedure, 0)

    assert message is not None
    assert message.Contents is not None
    assert message.Contents[0].Text == "只有原始调试文本"


def test_tcadp_thought_text_keeps_upstream_display_content_as_is():
    procedure = {
        "Name": "reasoning",
        "Title": "思考",
        "Status": "completed",
        "Debugging": {
            "DisplayContent": "参考来源：\n文档名：foo.pdf\n文档片段：这是引用切片",
            "References": [
                {
                    "ReferBizId": "ref-1",
                    "PageContent": "文档名：foo.pdf\n文档片段：这是引用切片",
                }
            ],
        },
    }

    message = TCADP._build_thought_message("record-1", procedure, 0)

    assert message is not None
    assert message.Contents is not None
    assert message.Contents[0].Text == "参考来源：\n文档名：foo.pdf\n文档片段：这是引用切片"
