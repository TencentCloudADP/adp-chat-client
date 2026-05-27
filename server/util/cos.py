"""
腾讯云 COS 对象存储工具类
"""
import logging

from qcloud_cos import CosConfig, CosS3Client

from config import tagentic_config

logger = logging.getLogger(__name__)


def _get_cos_client() -> CosS3Client:
    """获取 COS 客户端实例"""
    config = CosConfig(
        Region=tagentic_config.COS_REGION,
        SecretId=tagentic_config.TC_SECRET_ID,
        SecretKey=tagentic_config.TC_SECRET_KEY,
        Scheme='https',
    )
    return CosS3Client(config)


def upload_to_cos(key: str, body: bytes, content_type: str = '') -> str:
    """上传文件内容到 COS

    Args:
        key: COS 对象键（存储路径），如 app_id/workdir/main.py
        body: 文件内容（bytes）
        content_type: 文件的 Content-Type

    Returns:
        str: 上传后的 COS 访问 URL

    Raises:
        Exception: 上传失败时抛出
    """
    client = _get_cos_client()
    bucket = tagentic_config.COS_BUCKET

    kwargs = {
        'Bucket': bucket,
        'Key': key,
        'Body': body,
    }
    if content_type:
        kwargs['ContentType'] = content_type

    response = client.put_object(**kwargs)
    etag = response.get('ETag', '')
    logger.info(f'[COS] upload success: key={key}, ETag={etag}')

    # 构造访问 URL
    cos_url = f"https://{bucket}.cos.{tagentic_config.COS_REGION}.myqcloud.com/{key}"
    return cos_url
