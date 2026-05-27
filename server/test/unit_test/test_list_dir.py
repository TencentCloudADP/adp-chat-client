"""
测试用例：通过客户端调用 /adp/ListDir 接口（模拟前端调用方式）

流程：
    1. 先通过 /account/customer 获取登录 Token
    2. 使用 Token 调用 POST /adp/ListDir 接口
    3. 打印完整返回数据

运行方式：
    python3 test/unit_test/test_list_dir.py
"""
import json
import hmac
import hashlib
import time
import asyncio
from urllib.parse import quote

import httpx


# ============================================================
# 👇👇👇 请在这里填写请求参数 👇👇👇
# ============================================================

# 服务端地址（本地启动后默认 http://localhost:8000）
SERVER_URL = "http://localhost:8000"

# ApplicationId（.env 中配置的 ApplicationId）
APPLICATION_ID = "2059173834404121408"

# Customer Account 签名密钥（.env 中的 CUSTOMER_ACCOUNT_SECRET_KEY，为空则留空即可）
CUSTOMER_ACCOUNT_SECRET_KEY = ""

# ListDir 的参数
LIST_PATH = "/workdir"
DEPTH = 1

# ============================================================
# 👆👆👆 请在上面填写请求参数 👆👆👆
# ============================================================


async def get_auth_token(client: httpx.AsyncClient) -> str:
    """通过 /account/customer 接口获取登录 Token（模拟前端登录）"""
    customer_id = "test_user_001"
    name = "TestUser"
    extra_info = ""
    timestamp = int(time.time())

    msg = f"{customer_id}{name}{extra_info}{timestamp}"
    sign = hmac.new(
        CUSTOMER_ACCOUNT_SECRET_KEY.encode("utf-8"),
        msg.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()

    url = (
        f"{SERVER_URL}/account/customer?"
        f"CustomerId={quote(customer_id)}&"
        f"Name={quote(name)}&"
        f"Timestamp={timestamp}&"
        f"ExtraInfo={quote(extra_info)}&"
        f"Code={quote(sign)}"
    )

    resp = await client.get(url, follow_redirects=False)
    print(f"  登录状态码: {resp.status_code}")

    # 从 Set-Cookie 中提取 token
    token = resp.cookies.get("token", "")
    if not token:
        # 尝试从响应头解析
        for cookie_header in resp.headers.get_list("set-cookie"):
            if "token=" in cookie_header:
                token = cookie_header.split("token=")[1].split(";")[0]
                break

    return token


async def call_list_dir(client: httpx.AsyncClient, auth_token: str) -> tuple[int, dict]:
    """通过 /adp/ListDir 调用 list_dir 方法（和前端调用方式一致）

    前端请求格式:
        POST /adp/ListDir
        Headers: Authorization: Bearer <token>
        Body: {
            "ApplicationId": "xxx",
            "Payload": { "app_id": "xxx", "path": "/workdir", "depth": 1 }
        }
    """
    url = f"{SERVER_URL}/adp/ListDir"
    headers = {
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json",
    }
    body = {
        "ApplicationId": APPLICATION_ID,
        "Payload": {
            "app_id": APPLICATION_ID,
            "path": LIST_PATH,
            "depth": DEPTH,
            "workspace_id": "0dfaa218-f3ed-4f13-97e7-59f666b14a20"
        },
    }

    resp = await client.post(url, headers=headers, json=body, timeout=30)
    try:
        data = resp.json()
    except Exception:
        data = {"raw_text": resp.text}
    return resp.status_code, data


async def main():
    print("=" * 60)
    print("🚀 通过客户端接口调用测试 ListDir")
    print("=" * 60)

    if not APPLICATION_ID:
        print("❌ 请先填写 APPLICATION_ID")
        return

    print(f"\n  服务地址: {SERVER_URL}")
    print(f"  ApplicationId: {APPLICATION_ID}")
    print(f"  ListDir path: {LIST_PATH}")
    print(f"  ListDir depth: {DEPTH}")

    async with httpx.AsyncClient(verify=False) as client:
        # =====================================================
        # Step 1: 获取登录 Token
        # =====================================================
        print(f"\n{'=' * 60}")
        print("[Step 1] 获取登录 Token（/account/customer）")
        auth_token = await get_auth_token(client)

        if not auth_token:
            print("  ❌ 获取 Token 失败，请检查 CUSTOMER_ACCOUNT_SECRET_KEY 是否正确")
            return

        print(f"  ✅ Token: {auth_token}")

        # =====================================================
        # Step 2: 调用 /adp/ListDir
        # =====================================================
        print(f"\n{'=' * 60}")
        print("[Step 2] 调用 POST /adp/ListDir")
        print(f"  请求体:")
        print(f"    ApplicationId: {APPLICATION_ID}")
        print(f"    Payload: {{app_id: {APPLICATION_ID}, path: {LIST_PATH}, depth: {DEPTH}}}")

        status, data = await call_list_dir(client, auth_token)

        print(f"\n  状态码: {status}")
        print(f"  返回数据:")
        print(json.dumps(data, ensure_ascii=False, indent=2))

        if status == 200:
            response = data.get("Response", {})
            entries = response.get("entries", [])
            if entries:
                print(f"\n  ✅ 成功! 共 {len(entries)} 个条目:")
                for i, entry in enumerate(entries):
                    etype = "📁" if entry.get("type") == "FILE_TYPE_DIRECTORY" else "📄"
                    print(f"    [{i}] {etype} {entry.get('name')} ({entry.get('path')})")
            else:
                print(f"\n  ⚠️  返回数据中无 entries，完整 Response:")
                print(json.dumps(response, ensure_ascii=False, indent=2))
        else:
            print(f"\n  ❌ 请求失败 (HTTP {status})")

    print(f"\n{'=' * 60}")
    print("🏁 测试完成")


if __name__ == "__main__":
    asyncio.run(main())
