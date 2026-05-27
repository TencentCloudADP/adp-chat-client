"""
COS 对象存储桶管理中间件

提供桶的存在性检查与自动创建功能，以及文件上传能力。
"""
import hashlib
import io
import logging
from typing import Optional

from qcloud_cos import CosConfig, CosS3Client, CosServiceError

logger = logging.getLogger(__name__)

# 缓存已创建的 CosS3Client 实例，避免重复创建
_cos_client_cache: dict[str, CosS3Client] = {}


def get_cos_client(
    secret_id: str,
    secret_key: str,
    region: str = "ap-guangzhou",
    verify_ssl: bool = True,
    proxies: Optional[dict] = None,
) -> CosS3Client:
    """获取 COS 客户端实例（单例缓存）。

    根据 secret_id + region 作为缓存 key，如果已存在则直接返回，不再重新创建。

    Args:
        secret_id: 腾讯云 SecretId（即 TC_SECRET_ID）
        secret_key: 腾讯云 SecretKey（即 TC_SECRET_KEY）
        region: 桶所在地域，默认 ap-guangzhou
        verify_ssl: 是否验证 SSL 证书，默认 True；通过代理调试时可设为 False
        proxies: HTTP/HTTPS 代理配置，如 {"https": "http://127.0.0.1:8898"}

    Returns:
        CosS3Client: COS 客户端实例
    """
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
    secret_id: str,
    secret_key: str,
    bucket: str,
    region: str = "ap-guangzhou",
    verify_ssl: bool = True,
    proxies: Optional[dict] = None,
) -> str:
    """检查 COS 桶是否存在，不存在则自动创建，返回桶的访问域名。

    Args:
        secret_id: 腾讯云 SecretId（即 TC_SECRET_ID）
        secret_key: 腾讯云 SecretKey（即 TC_SECRET_KEY）
        bucket: 桶名称，格式为 BucketName-APPID，如 mybucket-1250000000
        region: 桶所在地域，默认 ap-guangzhou
        verify_ssl: 是否验证 SSL 证书，默认 True；通过代理调试时可设为 False
        proxies: HTTP/HTTPS 代理配置，如 {"https": "http://127.0.0.1:8898"}

    Returns:
        str: 桶的访问域名，如 https://mybucket-1250000000.cos.ap-guangzhou.myqcloud.com

    Raises:
        Exception: 创建桶失败或权限不足时抛出
    """
    if not secret_id or not secret_key or not bucket:
        raise ValueError(
            f"参数不完整: secret_id={bool(secret_id)}, "
            f"secret_key={bool(secret_key)}, bucket={bool(bucket)}"
        )

    client = get_cos_client(secret_id, secret_key, region, verify_ssl, proxies)
    bucket_url = f"https://{bucket}.cos.{region}.myqcloud.com"

    # 使用 bucket_exists 判断桶是否已创建
    if client.bucket_exists(Bucket=bucket):
        logger.info(f"[COS] 桶已存在: {bucket}")
        return bucket_url

    # 桶不存在，主动创建
    logger.info(f"[COS] 桶不存在，开始创建: {bucket}")
    try:
        client.create_bucket(Bucket=bucket)
        logger.info(f"[COS] 桶创建成功: {bucket}")
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
    secret_id: str,
    secret_key: str,
    bucket: str,
    region: str = "ap-guangzhou",
    if_changed: bool = True,
    verify_ssl: bool = True,
    proxies: Optional[dict] = None,
) -> str:
    """将文件流上传到 COS 指定路径。

    当 if_changed=True（默认）时，若 COS 上已存在相同内容的文件则跳过上传；
    当 if_changed=False 时，直接上传覆盖，不做 MD5 比较。

    逻辑（if_changed=True）：
    1. 计算本地文件流的 MD5。
    2. 检查 COS 上该路径的文件是否存在。
    3. 若存在，则通过 file_hash 接口获取 COS 文件的 MD5 并比较：
       - 相同 → 跳过上传，直接返回 COS 文件路径。
       - 不同 → 覆盖上传，返回 COS 文件路径。
    4. 若不存在 → 直接上传，返回 COS 文件路径。

    :param stream:     从其他地方读取的文件流（需支持 read() 和 seek()）
    :param path:       上传到 COS 的目标路径，例如 'folder/example.txt'
    :param secret_id:  腾讯云 SecretId（即 TC_SECRET_ID）
    :param secret_key: 腾讯云 SecretKey（即 TC_SECRET_KEY）
    :param bucket:     COS 桶名称，格式为 BucketName-Appid
    :param region:     桶所在地域，默认 ap-guangzhou
    :param if_changed: 是否仅在文件变更时上传，默认为 True
    :param verify_ssl: 是否验证 SSL 证书，默认 True；通过代理调试时可设为 False
    :param proxies:    HTTP/HTTPS 代理配置，如 {"https": "http://127.0.0.1:8898"}
    :return:           COS 文件路径（即传入的 path）
    """
    client = get_cos_client(secret_id, secret_key, region, verify_ssl, proxies)

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


def get_presigned_url(
    key: str,
    secret_id: str,
    secret_key: str,
    bucket: str,
    region: str = "ap-guangzhou",
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
        secret_id: 腾讯云 SecretId（即 TC_SECRET_ID）
        secret_key: 腾讯云 SecretKey（即 TC_SECRET_KEY）
        bucket: COS 桶名称，格式为 BucketName-APPID
        region: 桶所在地域，默认 ap-guangzhou
        expired: 签名有效期（秒），默认 3600（1 小时）
        params: URL 查询参数字典，例如文件预览参数:
                {"ci-process": "doc-preview", "page": "1", "dstType": "html"}
        use_ci_endpoint: 是否使用 CI（数据万象）端点域名，文件预览时需设为 True
        sign_host: 是否将 host 纳入签名（推荐 True，安全性更高）
        verify_ssl: 是否验证 SSL 证书，默认 True
        proxies: HTTP/HTTPS 代理配置

    Returns:
        str: 带签名的预签名下载 URL

    Example:
        # 普通文件下载签名
        url = get_presigned_url(
            key="docs/report.pdf",
            secret_id="xxx",
            secret_key="xxx",
            bucket="mybucket-1250000000",
        )

        # 文件预览（使用 CI 端点）
        url = get_presigned_url(
            key="docs/report.docx",
            secret_id="xxx",
            secret_key="xxx",
            bucket="mybucket-1250000000",
            params={"ci-process": "doc-preview", "page": "1", "dstType": "html"},
            use_ci_endpoint=True,
        )
    """
    client = get_cos_client(secret_id, secret_key, region, verify_ssl, proxies)

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
