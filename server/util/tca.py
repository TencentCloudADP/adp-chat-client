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


# action_version 配置目录：每个 ServiceVendor 对应一套 JSON 文件
_ACTION_VERSION_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    'vendor', 'tcadp', 'action_version'
)

def _parse_action_version_raw(config: dict) -> dict:
    """解析单个 action_version JSON 内容，返回 {Action: {headers: {}, payload: {}, service: str}} 映射"""
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


def load_action_version_config(vendor_key: str) -> dict:
    """加载 action_version/<vendor_key>.json 配置

    Args:
        vendor_key: ServiceVendor 名称，如 'ChinaTencentCloud'、'International' 等。

    Returns:
        {Action: {headers: {}, payload: {}, service: str}} 映射
    """
    vendor_path = os.path.join(_ACTION_VERSION_DIR, f'{vendor_key}.json')
    if not os.path.exists(vendor_path):
        logging.warning(f'[tca] action_version/{vendor_key}.json not found')
        return {}
    try:
        with open(vendor_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        return _parse_action_version_raw(config)
    except (OSError, ValueError, KeyError, TypeError) as e:
        logging.warning(f'[tca] Failed to load action_version/{vendor_key}.json: {e}')
        return {}





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


def inject_action_payload(action: str, payload: dict, variables: dict = None, action_overrides: dict = None) -> dict:
    """根据 action_version 配置，将配置中的 payload 字段注入到 payload 中（不覆盖已有值）

    支持嵌套路径，如配置 "payload.Config.Mode": "advanced" 会设置 payload["Config"]["Mode"] = "advanced"
    支持模板变量，如 "payload.AppKey": "{{APP_KEY}}" 会将 APP_KEY 替换为 variables 中的对应值

    Args:
        action_overrides: 特定场景的 action_version 配置，为 None 时使用全局默认配置
    """
    if variables is None:
        variables = {}
    overrides = action_overrides or {}
    action_config = overrides.get(action, {})
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


def tc_request_prepare(config: dict, action: str, payload: str, service: str = "lke", version: str = None, action_overrides: dict = None) -> dict:
    """构造腾讯云 API 签名请求的 headers 和 url

    Args:
        config: 包含 endpoint 信息的 service_configs（只含 url + region）
        action: API Action 名称
        payload: 已序列化的 JSON payload 字符串
        service: 目标服务名称（由 action_version 配置决定）
        version: API 版本号覆盖（通常不再使用，由 action_version 配置决定）
        action_overrides: 特定场景的 action_version 配置
    """
    # 优先使用 config 中注入的密钥（如 ChinaTencentADP），否则使用全局 TC 密钥
    secret_id = config.get('secret_id') or tagentic_config.TC_SECRET_ID
    secret_key = config.get('secret_key') or tagentic_config.TC_SECRET_KEY
    token = ""
    logging.info(f'[tca] tc_request_prepare: action={action}, service={service}')

    url = config[service]['url']
    host = url.split('//')[1].split('/')[0]
    # 加载 action 级别的 headers 配置
    overrides = action_overrides or {}
    action_config = overrides.get(action, {})
    action_headers_config = action_config.get('headers', {})
    # version 和 region 优先从 action_version 配置获取，未配置时 fallback 到 service_configs
    default_version = action_headers_config.get('X-TC-Version', '2023-11-30')
    region = action_headers_config.get('X-TC-Region') or config[service].get('region', '')
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
    # 入参 version 优先级高于默认值（兼容极少数场景）
    if version:
        headers["X-TC-Version"] = version
    # action_version 配置优先级最高，覆盖所有（包括 X-TC-Version）
    for h_key, h_value in action_headers_config.items():
        headers[h_key] = h_value
   
    return headers, url


def _resolve_service(action: str, action_overrides: dict = None) -> str:
    """从 action_version 配置中解析 action 对应的目标 service，回退到默认值 'lke'"""
    overrides = action_overrides or {}
    action_config = overrides.get(action, {})
    return action_config.get('service') or 'lke'


async def tc_request(
    config: dict, action: str, payload: dict = None,
    service=None, version: str = None,
    variables: dict = None,
    action_overrides: dict = None,
) -> str:
    """发起腾讯云 API 请求

    Args:
        config: endpoint 配置（service_configs 中对应 vendor 的配置）
        action: API Action 名称
        payload: 请求参数字典
        service: 目标服务名（已废弃，建议不传，由 action_version 配置决定）
        version: API 版本号（已废弃，建议不传，由 action_version 配置决定）
        variables: 模板变量字典
        action_overrides: 特定场景的 action_version 配置（由 TCADP 实例传入）
    """
    if service is None:
        service = _resolve_service(action, action_overrides)
    if payload is None:
        payload = {}
    payload = inject_action_payload(action, payload, variables, action_overrides)
    payload = json.dumps(payload)
    headers, url = tc_request_prepare(config, action, payload, service, version, action_overrides)
    full_url = f'{url}/'
    logging.info(
        '[tc_request] POST %s action=%s service=%s version=%s host=%s payload=%s',
        full_url, action, service,
        headers.get('X-TC-Version'), headers.get('Host'), payload,
    )
    async with aiohttp.ClientSession() as session:
        async with session.post(full_url, headers=headers, data=payload) as resp:
            try:
                return await resp.json()
            except aiohttp.ContentTypeError:
                body = await resp.text()
                logging.error(
                    '[tc_request] Non-JSON response: status=%s, content_type=%s, url=%s, body=%s',
                    resp.status, resp.content_type, full_url, body[:500],
                )
                return {
                    'Response': {
                        'Error': {
                            'Code': 'InvalidResponse',
                            'Message': f'Non-JSON response (status={resp.status}, content_type={resp.content_type})',
                        }
                    }
                }


async def tc_request_sse(config: dict, action: str, payload: dict = None, service=None, version: str = None, action_overrides: dict = None):
    """发起腾讯云 API SSE 流式请求

    Args:
        config: endpoint 配置
        action: API Action 名称
        payload: 请求参数字典
        service: 目标服务名（已废弃，建议不传，由 action_version 配置决定）
        version: API 版本号（已废弃，建议不传，由 action_version 配置决定）
        action_overrides: 特定场景的 action_version 配置（由 TCADP 实例传入）
    """
    if service is None:
        service = _resolve_service(action, action_overrides)
    if payload is None:
        payload = {}
    payload = json.dumps(payload)
    headers, url = tc_request_prepare(config, action, payload, service, version, action_overrides)
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
