import aioboto3
from botocore.client import Config


class AsyncWareHouseS3():
    def __init__(self, secretId, secretKey, tmpToken, region, bucket):
        self.dict = {
            's3access': secretId,
            's3secret': secretKey,
            's3ep': f'http://cos.{region}.myqcloud.com',
            's3ep_full': f'http://{bucket}.cos.{region}.myqcloud.com',
            's3bucket': bucket,
        }
        self.session = aioboto3.Session(
            aws_access_key_id=secretId, aws_secret_access_key=secretKey, aws_session_token=tmpToken
        )

    async def list(self, prefix=''):
        cos_config = Config(s3={'addressing_style': 'virtual'})
        async with self.session.resource('s3', endpoint_url=self.dict['s3ep'], config=cos_config) as s3:
            bucket = await s3.Bucket(self.dict['s3bucket'])
            lst = [objects.key async for objects in bucket.objects.filter(Prefix=prefix)]
        return lst

    async def put(self, path, body):
        path = self.pure_path(path)
        cos_config = Config(s3={'addressing_style': 'virtual'})
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
        cos_config = Config(s3={'addressing_style': 'virtual'})
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
    def __init__(self, session, s3_config, path):
        self.session = session
        self.dict = s3_config
        self.path = path
        self.mp = None
        self.parts = []
        self.buf = bytearray()
        self.part_number = 1

    async def __aenter__(self):
        cos_config = Config(s3={'addressing_style': 'virtual'})
        s3_resource = self.session.resource('s3', endpoint_url=self.dict['s3ep'], config=cos_config)
        self.s3 = await s3_resource.__aenter__()
        obj = await self.s3.Object(self.dict['s3bucket'], self.path)
        self.mp = await obj.initiate_multipart_upload(Bucket=self.dict['s3bucket'], Key=self.path)
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        try:
            if exc_type is not None:
                # On error, abort the multipart upload
                if self.mp:
                    await self.mp.abort()
                return

            # Upload any remaining data
            if len(self.buf) > 0:
                await self._upload_part()

            # Complete the multipart upload
            if self.mp and self.parts:
                await self.mp.complete(MultipartUpload={'Parts': self.parts})
        finally:
            # Close the S3 resource
            if self.s3:
                await self.s3.__aexit__(exc_type, exc_val, exc_tb)

    async def write(self, data):
        self.buf += data
        if len(self.buf) >= 1024 * 1024:  # 1MB threshold
            await self._upload_part()

    async def _upload_part(self):
        if len(self.buf) == 0:
            return

        part = await self.mp.Part(self.part_number)
        upload_result = await part.upload(Body=self.buf)
        self.parts.append({
            'PartNumber': self.part_number,
            'ETag': upload_result['ETag']
        })
        self.part_number += 1
        self.buf = bytearray()
