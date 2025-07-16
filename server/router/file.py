from sanic import json
from sanic.views import stream
from sanic.views import HTTPMethodView
from sanic_restful_api import reqparse
from sanic.request.types import Request
from sanic.response import ResponseStream
from sanic import response
import logging
from util.tca import tc_request
from router import login_required
from util.warehouse import AsyncWareHouseS3
from app_factory import TAgenticApp
app = TAgenticApp.get_app()


class FileUploadApi(HTTPMethodView):
    @stream
    @login_required
    async def post(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("application_id", type=str, required=True, location="args")
        args = parser.parse_args(request)

        action = "DescribeStorageCredential"
        payload = {
            "BotBizId": args['application_id'],
            "FileType": 'png',
            "IsPublic": True,
            "TypeKey": 'realtime',
        }
        resp = await tc_request(action, payload)
        resp = resp['Response']
        if 'Error' in resp:
            logging.error(resp)
            raise Exception(resp['Error']['Message'])
        cos = AsyncWareHouseS3(secretId=resp['Credentials']['TmpSecretId'], secretKey=resp['Credentials']['TmpSecretKey'], tmpToken=resp['Credentials']['Token'], region=resp['Region'], bucket=resp['Bucket'])

        async with cos.put_multipart(resp['UploadPath']) as uploader:
            while True:
                body = await request.stream.read()
                if body is None:
                    break
                # result += body.decode("utf-8")
                print(f'upload: {len(body)}')
                # print(f'upload: {body}')
                await uploader.write(body)

        url = cos.get_full_url(resp['UploadPath'])
        return json({"url": url})

app.add_route(FileUploadApi.as_view(), "/file/upload")
