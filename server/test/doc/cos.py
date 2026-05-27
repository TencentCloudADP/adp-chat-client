# -*- coding=utf-8
from qcloud_cos import CosConfig
from qcloud_cos import CosS3Client
from qcloud_cos import CosServiceError
import sys
import os
import logging

# 正常情况日志级别使用 INFO，需要定位时可以修改为 DEBUG，此时 SDK 会打印和服务端的通信信息
logging.basicConfig(level=logging.INFO, stream=sys.stdout)

# 1. 设置用户属性，包括 secret_id、secret_key、region 等
#    Bucket 由 BucketName-Appid 组成，例如 examplebucket-1250000000
secret_id = os.environ['COS_SECRET_ID']     # 用户的 SecretId，建议使用子账号密钥
secret_key = os.environ['COS_SECRET_KEY']   # 用户的 SecretKey，建议使用子账号密钥
region = 'ap-beijing'      # 替换为用户的 region，参见 https://cloud.tencent.com/document/product/436/6224
token = None               # 永久密钥无需填写 token；临时密钥需填写
scheme = 'https'           # 指定使用 http/https 协议访问 COS，默认为 https

config = CosConfig(Region=region, SecretId=secret_id, SecretKey=secret_key, Token=token, Scheme=scheme)
client = CosS3Client(config)

# 2. 指定要操作的桶名称（BucketName-Appid 格式）
bucket_name = 'examplebucket-1250000000'


def ensure_bucket_exists(bucket):
    """判断桶是否存在，若不存在则自动创建。

    :param bucket: 桶名称，格式为 BucketName-Appid，例如 examplebucket-1250000000
    """
    # 方式一：使用 SDK 内置的 bucket_exists 方法（推荐）
    exists = client.bucket_exists(Bucket=bucket)
    if exists:
        print(f'桶 {bucket} 已存在，无需创建。')
    else:
        print(f'桶 {bucket} 不存在，开始创建...')
        try:
            client.create_bucket(Bucket=bucket)
            print(f'桶 {bucket} 创建成功。')
        except CosServiceError as e:
            print(f'创建桶失败：{e.get_error_msg()}')
            print(f'状态码：{e.get_status_code()}，错误码：{e.get_error_code()}')
            raise


def ensure_bucket_exists_via_head(bucket):
    """通过 head_bucket 判断桶是否存在，若不存在则自动创建（异常捕获方式）。

    :param bucket: 桶名称，格式为 BucketName-Appid
    """
    try:
        client.head_bucket(Bucket=bucket)
        print(f'桶 {bucket} 已存在，无需创建。')
    except CosServiceError as e:
        if e.get_status_code() == 404:
            # 桶不存在，执行创建
            print(f'桶 {bucket} 不存在（404），开始创建...')
            try:
                client.create_bucket(Bucket=bucket)
                print(f'桶 {bucket} 创建成功。')
            except CosServiceError as create_err:
                print(f'创建桶失败：{create_err.get_error_msg()}')
                print(f'状态码：{create_err.get_status_code()}，错误码：{create_err.get_error_code()}')
                raise
        else:
            # 其他错误（如权限不足等），直接抛出
            print(f'检查桶时发生错误：{e.get_error_msg()}，状态码：{e.get_status_code()}')
            raise


if __name__ == '__main__':
    # 方式一：使用 bucket_exists（推荐）
    ensure_bucket_exists(bucket_name)

    # 方式二：使用 head_bucket + 异常捕获
    # ensure_bucket_exists_via_head(bucket_name)
