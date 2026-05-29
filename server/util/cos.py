"""
COS 对象存储桶管理工具

提供桶的存在性检查与自动创建功能，以及文件上传、预签名 URL 生成等能力。
公用参数（SecretId / SecretKey / Region / Bucket）统一从 tagentic_config 读取，
调用方无需重复传入。
"""
import hashlib
import io
import logging
from typing import Optional

from qcloud_cos import CosConfig, CosS3Client, CosServiceError

from config import tagentic_config

logger = logging.getLogger(__name__)

# 缓存已创建的 CosS3Client 实例，避免重复创建
_cos_client_cache: dict[str, CosS3Client] = {}

# 缓存已确认存在的桶名称，避免每次上传都重复检查
_verified_buckets: set[str] = set()


def get_cos_client(
    verify_ssl: bool = True,
    proxies: Optional[dict] = None,
) -> CosS3Client:
    """获取 COS 客户端实例（单例缓存）。

    Region / SecretId / SecretKey 统一从 tagentic_config 读取。

    Args:
        verify_ssl: 是否验证 SSL 证书，默认 True；通过代理调试时可设为 False
        proxies: HTTP/HTTPS 代理配置，如 {"https": "http://127.0.0.1:8898"}

    Returns:
        CosS3Client: COS 客户端实例
    """
    secret_id = tagentic_config.TC_SECRET_ID
    secret_key = tagentic_config.TC_SECRET_KEY
    region = tagentic_config.COS_REGION

    cache_key = f"{secret_id}:{region}"

    if cache_key in _cos_client_cache:
        return _cos_client_cache[cache_key]

    config = CosConfig(
        Region=region,
        SecretId=secret_id,
        SecretKey=secret_key,
        Scheme="https",
        VerifySSL=verify_ssl,
        Proxies=proxies,
    )
    client = CosS3Client(config)
    _cos_client_cache[cache_key] = client
    logger.info(f"[COS] 创建新的 CosS3Client 实例: region={region}")
    return client


def ensure_bucket(
    bucket: str = None,
    verify_ssl: bool = True,
    proxies: Optional[dict] = None,
) -> str:
    """检查 COS 桶是否存在，不存在则自动创建，返回桶的访问域名。

    Args:
        bucket: 桶名称，默认从 tagentic_config.COS_BUCKET 读取
        verify_ssl: 是否验证 SSL 证书，默认 True
        proxies: HTTP/HTTPS 代理配置

    Returns:
        str: 桶的访问域名，如 https://mybucket-1250000000.cos.ap-guangzhou.myqcloud.com

    Raises:
        Exception: 创建桶失败或权限不足时抛出
    """
    if bucket is None:
        bucket = tagentic_config.COS_BUCKET
    region = tagentic_config.COS_REGION

    if not bucket:
        raise ValueError("COS_BUCKET 未配置")

    bucket_url = f"https://{bucket}.cos.{region}.myqcloud.com"

    # 如果已经确认过该桶存在，直接返回，不再重复判断
    if bucket in _verified_buckets:
        return bucket_url

    client = get_cos_client(verify_ssl, proxies)

    # 使用 bucket_exists 判断桶是否已创建
    if client.bucket_exists(Bucket=bucket):
        logger.info(f"[COS] 桶已存在: {bucket}")
        _verified_buckets.add(bucket)
        return bucket_url

    # 桶不存在，主动创建
    logger.info(f"[COS] 桶不存在，开始创建: {bucket}")
    try:
        client.create_bucket(Bucket=bucket)
        logger.info(f"[COS] 桶创建成功: {bucket}")
        _verified_buckets.add(bucket)
        return bucket_url
    except CosServiceError as e:
        logger.error(
            f"[COS] 创建桶失败: status={e.get_status_code()}, "
            f"code={e.get_error_code()}, msg={e.get_error_msg()}"
        )
        raise


def calc_stream_md5(stream) -> str:
    """计算文件流的 MD5 值。

    读取完毕后会自动 seek(0) 复位流指针。

    Args:
        stream: 支持 read() 和 seek() 的文件流对象

    Returns:
        str: 小写十六进制 MD5 字符串
    """
    md5 = hashlib.md5()
    while True:
        chunk = stream.read(8192)
        if not chunk:
            break
        if isinstance(chunk, str):
            chunk = chunk.encode("utf-8")
        md5.update(chunk)
    stream.seek(0)
    return md5.hexdigest()


def upload(
    stream,
    path: str,
    bucket: str = None,
    if_changed: bool = True,
    verify_ssl: bool = True,
    proxies: Optional[dict] = None,
) -> str:
    """将文件流上传到 COS 指定路径。

    当 if_changed=True（默认）时，若 COS 上已存在相同内容的文件则跳过上传；
    当 if_changed=False 时，直接上传覆盖，不做 MD5 比较。

    Args:
        stream: 文件流（需支持 read() 和 seek()）
        path: 上传到 COS 的目标路径，例如 'folder/example.txt'
        bucket: COS 桶名称，默认从 tagentic_config.COS_BUCKET 读取
        if_changed: 是否仅在文件变更时上传，默认为 True
        verify_ssl: 是否验证 SSL 证书，默认 True
        proxies: HTTP/HTTPS 代理配置

    Returns:
        str: COS 文件路径（即传入的 path）
    """
    if bucket is None:
        bucket = tagentic_config.COS_BUCKET

    # 上传前确保桶存在（内部有缓存，只会实际检查一次）
    ensure_bucket(bucket=bucket, verify_ssl=verify_ssl, proxies=proxies)

    client = get_cos_client(verify_ssl, proxies)

    if not if_changed:
        # 不做比较，直接上传
        logger.info(f'[COS] if_changed=False，直接上传: {path}')
        client.put_object(
            Bucket=bucket,
            Body=stream,
            Key=path,
            EnableMD5=False,
        )
        logger.info(f'[COS] 上传成功: {path}')
        return path

    # 1. 计算本地文件流的 MD5
    local_md5 = calc_stream_md5(stream)
    logger.info(f'[COS] 本地文件流 MD5: {local_md5}')

    # 2. 检查 COS 上该路径的文件是否存在
    cos_file_exists = False
    try:
        client.head_object(Bucket=bucket, Key=path)
        cos_file_exists = True
    except CosServiceError as e:
        if e.get_status_code() == 404:
            cos_file_exists = False
        else:
            logger.error(f'[COS] 检查文件时发生错误: {e.get_error_msg()}')
            raise

    # 3. 若文件已存在，获取 COS 文件的 MD5 并比较
    if cos_file_exists:
        logger.info(f'[COS] 文件已存在: {path}，开始比较 MD5...')
        try:
            hash_response = client.file_hash(
                Bucket=bucket,
                Key=path,
                Type='md5',
            )
            cos_md5 = hash_response.get('FileHashCodeResult', {}).get('MD5', '')
            logger.info(f'[COS] COS 文件 MD5: {cos_md5}')
        except CosServiceError as e:
            logger.warning(f'[COS] 获取文件 MD5 失败，将直接覆盖上传: {e.get_error_msg()}')
            cos_md5 = ''

        if cos_md5 and cos_md5.lower() == local_md5.lower():
            logger.info(f'[COS] MD5 相同，跳过上传: {path}')
            return path

        logger.info(f'[COS] MD5 不同（本地: {local_md5}，COS: {cos_md5}），覆盖上传...')
    else:
        logger.info(f'[COS] 文件不存在: {path}，开始上传...')

    # 4. 执行上传
    client.put_object(
        Bucket=bucket,
        Body=stream,
        Key=path,
        EnableMD5=False,
    )
    logger.info(f'[COS] 上传成功: {path}')
    return path


def upload_to_cos(
    key: str,
    body: bytes,
    content_type: str = '',
    bucket: str = None,
) -> str:
    """简化版上传：直接将 bytes 上传到 COS，返回访问 URL。

    Args:
        key: COS 上的文件路径
        body: 文件内容（bytes）
        content_type: Content-Type
        bucket: COS 桶名称，默认从 tagentic_config.COS_BUCKET 读取

    Returns:
        str: 文件的 COS 访问 URL
    """
    if bucket is None:
        bucket = tagentic_config.COS_BUCKET
    region = tagentic_config.COS_REGION

    # 上传前确保桶存在（内部有缓存，只会实际检查一次）
    ensure_bucket(bucket=bucket)

    client = get_cos_client()

    kwargs = {
        'Bucket': bucket,
        'Body': body,
        'Key': key,
        'EnableMD5': False,
    }
    if content_type:
        kwargs['ContentType'] = content_type

    client.put_object(**kwargs)
    cos_url = f"https://{bucket}.cos.{region}.myqcloud.com/{key}"
    logger.info(f'[COS] upload_to_cos 上传成功: {cos_url}')
    return cos_url


def get_presigned_url(
    key: str,
    bucket: str = None,
    expired: int = 3600,
    params: Optional[dict] = None,
    use_ci_endpoint: bool = True,
    sign_host: bool = True,
    verify_ssl: bool = True,
    proxies: Optional[dict] = None,
) -> str:
    """生成 COS 文件的预签名下载 URL。

    可用于文件下载、文件预览（搭配 CI 参数）等场景。

    Args:
        key: COS 上的文件路径，例如 'folder/example.docx'
        bucket: COS 桶名称，默认从 tagentic_config.COS_BUCKET 读取
        expired: 签名有效期（秒），默认 3600（1 小时）
        params: URL 查询参数字典，例如文件预览参数:
                {"ci-process": "doc-preview", "page": "1", "dstType": "html"}
        use_ci_endpoint: 是否使用 CI（数据万象）端点域名，文件预览时需设为 True
        sign_host: 是否将 host 纳入签名（推荐 True，安全性更高）
        verify_ssl: 是否验证 SSL 证书，默认 True
        proxies: HTTP/HTTPS 代理配置

    Returns:
        str: 带签名的预签名下载 URL
    """
    if bucket is None:
        bucket = tagentic_config.COS_BUCKET

    client = get_cos_client(verify_ssl, proxies)

    # 默认文档预览参数
    default_params = {
        "ci-process": "doc-preview",
        # "dstType": "html",
        "weboffice_url": "1",
        "copyable": "0",
    }
    if params:
        default_params.update(params)

    kwargs = {
        "Bucket": bucket,
        "Key": key,
        "Expired": expired,
        "SignHost": sign_host,
        "Params": default_params,
    }

    if use_ci_endpoint:
        kwargs["UseCiEndPoint"] = True

    url = client.get_presigned_download_url(**kwargs)
    logger.info(f"[COS] 生成预签名 URL: key={key}, expired={expired}s, ci={use_ci_endpoint}")
    return url
