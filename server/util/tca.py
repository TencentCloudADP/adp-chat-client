import asyncio
import logging
import hashlib
import hmac
import base64
import uuid
import os
from urllib.parse import quote
from random import randint
import json
import re
import time
from datetime import datetime

import aiohttp
import pydash

from config import tagentic_config


# 加载 action 级别的 version 覆盖配置
_ACTION_VERSION_CONFIG_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    'vendor', 'tcadp', 'action_version.json'
)


def _load_action_version_config() -> dict:
    """加载 action_version.json 配置，返回 {Action: {headers: {}, payload: {}}} 映射

    配置项格式:
        - "headers.X-TC-Version": "2025-11-12"  -> 注入到请求 headers 中
        - "payload.AppKey": "xxx"               -> 注入到 payload 顶层字段
        - "payload.a.b": "xxx"                  -> 注入到 payload 嵌套字段 payload["a"]["b"]
    """
    if not os.path.exists(_ACTION_VERSION_CONFIG_PATH):
        return {}
    try:
        with open(_ACTION_VERSION_CONFIG_PATH, 'r', encoding='utf-8') as f:
            config = json.load(f)
        result = {}
        for action, value in config.items():
            if action.startswith('_'):
                continue
            if not isinstance(value, dict):
                continue
            headers = {}
            payload_paths = {}  # {dotted_path: value}
            action_service = None
            for k, v in value.items():
                if k == 'service':
                    action_service = v
                elif k.startswith('headers.'):
                    header_name = k[len('headers.'):]
                    headers[header_name] = v
                elif k.startswith('payload.'):
                    path_str = k[len('payload.'):]
                    payload_paths[path_str] = v
            result[action] = {'headers': headers, 'payload': payload_paths, 'service': action_service}
        return result
    except (OSError, ValueError, KeyError, TypeError) as e:
        logging.warning(f'[tca] Failed to load action_version.json: {e}')
        return {}

ACTION_VERSION_OVERRIDES = _load_action_version_config()


_TEMPLATE_PATTERN = re.compile(r'\{\{(\w+)\}\}')


def _render_template(value, variables: dict):
    """将值中的 {{VAR}} 模板变量替换为 variables 中对应的值

    - 如果整个值就是一个 {{VAR}}，则直接返回变量原始值（保留类型）
    - 如果值中包含多个模板或混合文本，则做字符串替换
    - 如果模板变量在 variables 中不存在，保留原样
    """
    if not isinstance(value, str):
        return value
    # 整个值就是 {{VAR}}，直接返回原始类型
    match = _TEMPLATE_PATTERN.fullmatch(value.strip())
    if match:
        key = match.group(1)
        return variables.get(key, value)
    # 部分替换，转为字符串
    def replacer(m):
        key = m.group(1)
        return str(variables.get(key, m.group(0)))
    return _TEMPLATE_PATTERN.sub(replacer, value)


def inject_action_payload(action: str, payload: dict, variables: dict = None) -> dict:
    """根据 action_version.json 配置，将配置中的 payload 字段注入到 payload 中（不覆盖已有值）

    支持嵌套路径，如配置 "payload.Config.Mode": "advanced" 会设置 payload["Config"]["Mode"] = "advanced"
    支持模板变量，如 "payload.AppKey": "{{APP_KEY}}" 会将 APP_KEY 替换为 variables 中的对应值
    """
    if variables is None:
        variables = {}
    action_config = ACTION_VERSION_OVERRIDES.get(action, {})
    action_payload_paths = action_config.get('payload', {})
    for path, p_value in action_payload_paths.items():
        if not pydash.has(payload, path):
            resolved = _render_template(p_value, variables)
            pydash.set_(payload, path, resolved)
    return payload


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


def tc_request_prepare(config: dict, action: str, payload: str, service = "lke", version: str = None) -> dict:
    secret_id = tagentic_config.TC_SECRET_ID
    secret_key = tagentic_config.TC_SECRET_KEY
    token = ""
    url = config[service]['url']
    host = url.split('//')[1].split('/')[0]
    # 加载 action 级别的 headers 配置
    action_config = ACTION_VERSION_OVERRIDES.get(action, {})
    action_headers_config = action_config.get('headers', {})
    default_version = config[service]['version']
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
        "X-TC-Version": default_version,
    }
    if region:
        headers["X-TC-Region"] = region
    if token:
        headers["X-TC-Token"] = token
    # 入参 version 优先级高于默认值
    if version:
        headers["X-TC-Version"] = version
    # action_version.json 配置优先级最高，覆盖所有（包括 X-TC-Version）
    for h_key, h_value in action_headers_config.items():
        headers[h_key] = h_value
    return headers, url


def _resolve_service(action: str, service) -> str:
    """解析最终的 service：外部显式传入优先，否则使用 action_version.json 配置，最后回退到默认值 'lke'"""
    if service is not None:
        return service
    action_config = ACTION_VERSION_OVERRIDES.get(action, {})
    return action_config.get('service') or 'lke'


async def tc_request(
    config: dict, action: str, payload: dict = None,
    service=None, version: str = None,
    variables: dict = None,
) -> str:
    service = _resolve_service(action, service)
    if payload is None:
        payload = {}
    payload = inject_action_payload(action, payload, variables)
    payload = json.dumps(payload)
    headers, url = tc_request_prepare(config, action, payload, service, version)
    full_url = f'{url}/'
    logging.info(f'[tc_request] POST {full_url} action={action} service={service} version={headers.get("X-TC-Version")} host={headers.get("Host")} payload={payload}')
    async with aiohttp.ClientSession() as session:
        async with session.post(full_url, headers=headers, data=payload) as resp:
            return await resp.json()


async def tc_request_sse(config: dict, action: str, payload: dict = None, service=None, version: str = None):
    service = _resolve_service(action, service)
    if payload is None:
        payload = {}
    payload = json.dumps(payload)
    headers, url = tc_request_prepare(config, action, payload, service, version)
    async with aiohttp.ClientSession() as session:
        async with session.post(f'{url}/', headers=headers, data=payload) as resp:
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
