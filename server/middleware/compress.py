import gzip

from sanic.response.types import ResponseStream

from app_factory import TAgenticApp

app = TAgenticApp.get_app()

# 需要压缩的 Content-Type 前缀
COMPRESSIBLE_TYPES = (
    "text/",
    "application/javascript",
    "application/json",
    "application/xml",
    "image/svg+xml",
)

# 最小压缩阈值（字节），太小的响应压缩反而增大体积
MIN_COMPRESS_SIZE = 1024


@app.middleware("response")
async def gzip_response(request, response):
    # 检查客户端是否支持 gzip
    accept_encoding = request.headers.get("accept-encoding", "")
    if "gzip" not in accept_encoding:
        return response

    # 检查响应是否已压缩
    if response.headers.get("content-encoding"):
        return response

    # 流式响应无 body，跳过压缩
    if isinstance(response, ResponseStream):
        return response

    # 检查 Content-Type 是否可压缩
    content_type = response.content_type or ""
    if not any(content_type.startswith(t) for t in COMPRESSIBLE_TYPES):
        return response

    # 获取响应体
    body = response.body
    if not body or len(body) < MIN_COMPRESS_SIZE:
        return response

    # gzip 压缩
    compressed = gzip.compress(body, compresslevel=6)

    # 压缩后反而更大则跳过
    if len(compressed) >= len(body):
        return response

    response.body = compressed
    response.headers["content-encoding"] = "gzip"
    response.headers["content-length"] = str(len(compressed))
    # 标记 Vary 头，确保缓存正确
    vary = response.headers.get("vary", "")
    if "accept-encoding" not in vary.lower():
        response.headers["vary"] = f"{vary}, Accept-Encoding" if vary else "Accept-Encoding"

    return response
