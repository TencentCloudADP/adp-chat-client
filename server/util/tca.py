# -*- coding: utf-8 -*-
import os
import hashlib
import hmac
import base64
import uuid
from urllib.parse import quote
from random import randint, randrange
import json
import sys
import time
from datetime import datetime
import aiohttp
import asyncio
import logging
from config import tagentic_config


def asr_sign(msg):
    secret_key = tagentic_config.TC_SECRET_KEY
    hmacstr = hmac.new(secret_key.encode('utf-8'), msg.encode('utf-8'), hashlib.sha1).digest()
    s = base64.b64encode(hmacstr)
    s = s.decode('utf-8')
    return s

def asr_query_string(param):
    signstr = "asr.cloud.tencent.com/asr/v2/"
    for k, v in param.items():
        if 'appid' in k:
            signstr += str(v)
            break
    signstr += "?"
    for k, v in sorted(param.items()):
        if 'appid' in k:
            continue
        signstr += f'{str(k)}={str(v)}&'
    signstr = signstr[:-1]
    return signstr

def asr_url(engine_model_type="16k_zh", voice_format=1):
    # https://cloud.tencent.com/document/api/1093/48982
    ts = int(time.time())
    param = {
        "appid": tagentic_config.TC_SECRET_APPID,
        "secretid": tagentic_config.TC_SECRET_ID,
        "voice_id": str(uuid.uuid4()),
        "engine_model_type": engine_model_type,
        "voice_format": voice_format,
        "nonce": str(randint(1_000_000, 9_999_999)),
        "timestamp": str(ts),
        "expired": str(ts + 600),
    }
    url = asr_query_string(param)
    sign = quote(asr_sign(url))
    url = f'wss://{url}&signature={sign}'
    return url

def sign(key, msg):
    return hmac.new(key, msg.encode("utf-8"), hashlib.sha256).digest()

def tc_request_prepare(config: dict, action: str, payload: dict = {}, service = "lke") -> dict:
    secret_id = tagentic_config.TC_SECRET_ID
    secret_key = tagentic_config.TC_SECRET_KEY
    token = ""

    host = config[service]['host']
    version = config[service]['version']
    region = config[service]['region']
    algorithm = "TC3-HMAC-SHA256"
    timestamp = int(time.time())
    date = datetime.utcfromtimestamp(timestamp).strftime("%Y-%m-%d")

    # ************* 步骤 1：拼接规范请求串 *************
    http_request_method = "POST"
    canonical_uri = "/"
    canonical_querystring = ""
    ct = "application/json; charset=utf-8"
    canonical_headers = "content-type:%s\nhost:%s\nx-tc-action:%s\n" % (ct, host, action.lower())
    signed_headers = "content-type;host;x-tc-action"
    hashed_request_payload = hashlib.sha256(payload.encode("utf-8")).hexdigest()
    canonical_request = (http_request_method + "\n" +
                        canonical_uri + "\n" +
                        canonical_querystring + "\n" +
                        canonical_headers + "\n" +
                        signed_headers + "\n" +
                        hashed_request_payload)

    # ************* 步骤 2：拼接待签名字符串 *************
    credential_scope = date + "/" + service + "/" + "tc3_request"
    hashed_canonical_request = hashlib.sha256(canonical_request.encode("utf-8")).hexdigest()
    string_to_sign = (algorithm + "\n" +
                    str(timestamp) + "\n" +
                    credential_scope + "\n" +
                    hashed_canonical_request)

    # ************* 步骤 3：计算签名 *************
    secret_date = sign(("TC3" + secret_key).encode("utf-8"), date)
    secret_service = sign(secret_date, service)
    secret_signing = sign(secret_service, "tc3_request")
    signature = hmac.new(secret_signing, string_to_sign.encode("utf-8"), hashlib.sha256).hexdigest()

    # ************* 步骤 4：拼接 Authorization *************
    authorization = (algorithm + " " +
                    "Credential=" + secret_id + "/" + credential_scope + ", " +
                    "SignedHeaders=" + signed_headers + ", " +
                    "Signature=" + signature)

    # ************* 步骤 5：构造并发起请求 *************
    headers = {
        "Authorization": authorization,
        "Content-Type": "application/json; charset=utf-8",
        "Host": host,
        "X-TC-Action": action,
        "X-TC-Timestamp": str(timestamp),
        "X-TC-Version": version
    }
    if region:
        headers["X-TC-Region"] = region
    if token:
        headers["X-TC-Token"] = token
    return headers, host

async def tc_request(config: dict, action: str, payload: dict = {}, service = "lke") -> str:
    payload = json.dumps(payload)
    headers, host = tc_request_prepare(config, action, payload, service)
    async with aiohttp.ClientSession() as session:
        async with session.post(f'https://{host}/', headers=headers, data=payload) as resp:
            return await resp.json()

async def tc_request_sse(config: dict, action: str, payload: dict = {}, service = "lke"):
    payload = json.dumps(payload)
    headers, host = tc_request_prepare(config, action, payload, service)
    async with aiohttp.ClientSession() as session:
        async with session.post(f'https://{host}/', headers=headers, data=payload) as resp:
            try:
                while True:
                    raw_line = await resp.content.readline()
                    if resp.headers['Content-Type'] != 'text/event-stream':
                        yield raw_line
                        continue
                    # logging.info(raw_line)
                    if not raw_line:
                        break
                    line = raw_line.decode()
                    if ':' not in line:
                        continue
                    line_type, data = line.split(':', 1)
                    if line_type == 'data':
                        yield data
            except asyncio.CancelledError:
                logging.info("tc_request_sse: cancelled")
                resp.close()
            logging.info("tc_request_sse: done")
