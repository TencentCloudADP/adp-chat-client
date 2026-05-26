import aioboto3
from botocore.client import Config


class AsyncWareHouseS3():
    def __init__(self, secretId, secretKey, tmpToken, region, bucket, config):
        self.dict = {
            's3access': secretId,
            's3secret': secretKey,
            's3ep': config.get(
                'ep',
                'https://cos.{region}.myqcloud.com'
            ).format(bucket=bucket, region=region),
            's3ep_full': config.get(
                'access',
                'https://{bucket}.cos.{region}.myqcloud.com'
            ).format(bucket=bucket, region=region),
            's3bucket': bucket,
            'addressing_style': config.get('addressing_style', 'virtual')
        }
        self.session = aioboto3.Session(
            aws_access_key_id=secretId, aws_secret_access_key=secretKey, aws_session_token=tmpToken
        )

    async def list(self, prefix=''):
        cos_config = Config(s3={'addressing_style': self.dict['addressing_style']})
        async with self.session.resource('s3', endpoint_url=self.dict['s3ep'], config=cos_config) as s3:
            bucket = await s3.Bucket(self.dict['s3bucket'])
            lst = [objects.key async for objects in bucket.objects.filter(Prefix=prefix)]
        return lst

    async def put(self, path, body):
        path = self.pure_path(path)
        cos_config = Config(s3={'addressing_style': self.dict['addressing_style']})
        async with self.session.resource('s3', endpoint_url=self.dict['s3ep'], config=cos_config) as s3:
            obj = await s3.Object(self.dict['s3bucket'], path)
            await obj.put(Body=body)

    def get_full_url(self, path):
        return self.dict['s3ep_full'] + path

    def put_multipart(self, path):
        path = self.pure_path(path)
        return MultipartUploader(
            session=self.session,
            s3_config=self.dict,
            path=path
        )

    async def get(self, path, decode='utf-8'):
        path = self.pure_path(path)
        cos_config = Config(s3={'addressing_style': self.dict['addressing_style']})
        async with self.session.resource('s3', endpoint_url=self.dict['s3ep'], config=cos_config) as s3:
            obj = await s3.Object(self.dict['s3bucket'], path)
            obj = await obj.get()
            # print(obj)
            str = await obj['Body'].read()
            if decode is not None:
                str = str.decode(decode)
            return str, obj

    def pure_path(self, path):
        base_path = self.get_base_path()
        if path.startswith(base_path):
            path = path[path.index('/', len(base_path)):]
        return path

    def get_base_path(self):
        return 's3a://{}'.format(self.dict['s3bucket'])


class MultipartUploader:
    """使用 client-level API 进行分片上传，兼容腾讯云 COS HTTPS 接口"""

    def __init__(self, session, s3_config, path):
        self.session = session
        self.dict = s3_config
        self.path = path
        self.upload_id = None
        self.client = None
        self.parts = []
        self.buf = bytearray()
        self.part_number = 1

    async def __aenter__(self):
        cos_config = Config(s3={'addressing_style': self.dict['addressing_style']})
        client_ctx = self.session.client('s3', endpoint_url=self.dict['s3ep'], config=cos_config)
        self.client = await client_ctx.__aenter__()
        self._client_ctx = client_ctx

        resp = await self.client.create_multipart_upload(
            Bucket=self.dict['s3bucket'],
            Key=self.path
        )
        self.upload_id = resp['UploadId']
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        try:
            if exc_type is not None:
                if self.upload_id:
                    await self.client.abort_multipart_upload(
                        Bucket=self.dict['s3bucket'],
                        Key=self.path,
                        UploadId=self.upload_id
                    )
                return

            if len(self.buf) > 0:
                await self._upload_part()

            if self.upload_id and self.parts:
                await self.client.complete_multipart_upload(
                    Bucket=self.dict['s3bucket'],
                    Key=self.path,
                    UploadId=self.upload_id,
                    MultipartUpload={'Parts': self.parts}
                )
        finally:
            if self.client:
                await self._client_ctx.__aexit__(exc_type, exc_val, exc_tb)

    async def write(self, data):
        self.buf += data
        if len(self.buf) >= 1024 * 1024:
            await self._upload_part()

    async def _upload_part(self):
        if len(self.buf) == 0:
            return

        body = bytes(self.buf)
        resp = await self.client.upload_part(
            Bucket=self.dict['s3bucket'],
            Key=self.path,
            UploadId=self.upload_id,
            PartNumber=self.part_number,
            Body=body,
            ContentLength=len(body)
        )
        self.parts.append({
            'PartNumber': self.part_number,
            'ETag': resp['ETag']
        })
        self.part_number += 1
        self.buf = bytearray()
