"""
测试用例：调用 sandbox filesystem.Filesystem/ListDir 接口

流程：
    1. 调用 ListDir 接口获取目录列表
    2. 取 entries[1] 的 path
    3. 拼接成文件下载 URL：https://sandbox-test.adp.cloud.tencent.com/files?path=xxx&X-Directory-Token=xxx
    4. 请求该 URL 并打印返回结果

运行方式：
    pip3 install httpx pytest pytest-asyncio
    python3 -m pytest test/unit_test/test_filesystem_listdir.py -v -s --noconftest
    python3 test/unit_test/test_filesystem_listdir.py
"""
import json
import urllib.parse

import httpx
import pytest

# sandbox ListDir 接口地址
LISTDIR_URL = (
    "https://sandbox-test.adp.cloud.tencent.com/filesystem.Filesystem/ListDir"
)

# 文件下载基础 URL
FILES_BASE_URL = "https://sandbox-test.adp.cloud.tencent.com/files"

# X-Directory-Token
DIRECTORY_TOKEN = (
    "v1.kkydAEAY5zOzQoyqoQ7C69yYX6SJIbrnhGjpXSsfPc4NXkCDPhmzJOn2zyJXt_00GBMeUHQ4Htd39VBboG2dMikzo311e2wlRT4KZCyTUr3s_t3aV4CDj2tszFnmsVA5yARGgoRWoADFm30XadpFIUAHvk7Fdz-iRIekfc2c_mPnxsmDGwiQJDtMFSrUbmpJfqm3WRrhFHwD2O-pyFVgD2r7pcN5UlLxDXPqC7C_YKa8PlIvNUV3BaUvQhqbEBMMZjawrI8nzayamP4tkzAq7p9MRTHCAB6xs8DKrkYF1zafzsc8clw7xcWs2XbbnvCl"
)

# Token 绑定的授权目录路径
AUTHORIZED_PATH = "/users/700000963993/1747547736783716352/default_space/991d75ef-a018-4b02-96d3-9cbd0241d031"


async def call_listdir(path: str, depth: int = 1) -> tuple[int, dict]:
    """
    调用 ListDir 接口，Token 通过 Query 参数传递
    """
    params = {"X-Directory-Token": DIRECTORY_TOKEN}
    payload = {"path": path, "depth": depth}

    async with httpx.AsyncClient(timeout=30, verify=False) as client:
        resp = await client.post(
            LISTDIR_URL,
            params=params,
            json=payload,
            headers={"Content-Type": "application/json"},
        )

    return resp.status_code, resp.json()


async def fetch_file(file_path: str) -> tuple[int, str]:
    """
    通过 /files 接口获取文件内容

    拼接格式: https://sandbox-test.adp.cloud.tencent.com/files?path=<url_encoded_path>&X-Directory-Token=<token>
    """
    params = {
        "path": file_path,
        "X-Directory-Token": DIRECTORY_TOKEN,
    }

    async with httpx.AsyncClient(timeout=30, verify=False) as client:
        resp = await client.get(
            FILES_BASE_URL,
            params=params,
        )

    return resp.status_code, resp.text


class TestListDirAndFetchFile:
    """ListDir + 获取文件内容"""

    @pytest.mark.asyncio
    async def test_listdir_then_fetch_file(self):
        """先 ListDir 获取目录列表，再取 entries[1] 的 path 请求文件内容"""
        # Step 1: 调用 ListDir
        status, data = await call_listdir(AUTHORIZED_PATH, depth=1)
        print(f"\n{'='*60}")
        print(f"[Step 1] ListDir 请求: path={AUTHORIZED_PATH}, depth=1")
        print(f"状态码: {status}")
        print(f"返回数据:\n{json.dumps(data, ensure_ascii=False, indent=2)}")
        assert status == 200, f"期望 200，实际 {status}"

        # Step 2: 取 entries[1] 的 path
        entries = data.get("entries", [])
        assert len(entries) > 1, f"entries 数量不足，实际: {len(entries)}"

        target_entry = entries[1]
        target_path = target_entry["path"]
        print(f"\n{'='*60}")
        print(f"[Step 2] 取 entries[1]: name={target_entry['name']}, path={target_path}")

        # Step 3: 拼接文件下载 URL 并请求
        file_url = f"{FILES_BASE_URL}?path={urllib.parse.quote(target_path, safe='')}&X-Directory-Token={DIRECTORY_TOKEN}"
        print(f"\n[Step 3] 拼接的文件 URL:")
        print(f"  {file_url}")

        file_status, file_content = await fetch_file(target_path)
        print(f"\n{'='*60}")
        print(f"[Step 3] 文件请求结果:")
        print(f"状态码: {file_status}")
        print(f"返回内容:")
        print(file_content[:3000] if len(file_content) > 3000 else file_content)
        print(f"{'='*60}")


# ============================================================
# 直接运行入口（python3 xxx.py）
# ============================================================

if __name__ == "__main__":
    import asyncio

    async def main():
        print("🚀 测试 filesystem.Filesystem/ListDir + 文件获取")
        print(f"ListDir 接口: {LISTDIR_URL}")
        print(f"Files 接口: {FILES_BASE_URL}")
        print(f"Token: {DIRECTORY_TOKEN[:50]}...")
        print(f"授权路径: {AUTHORIZED_PATH}")
        print()

        # Step 1: ListDir
        print(f"{'='*60}")
        print("[Step 1] 调用 ListDir, depth=1")
        print(f"{'='*60}")
        status, data = await call_listdir(AUTHORIZED_PATH, depth=1)
        print(f"状态码: {status}")
        print(f"返回数据:")
        print(json.dumps(data, ensure_ascii=False, indent=2))

        if status != 200:
            print("❌ ListDir 失败，终止")
            return

        # Step 2: 取 entries[1]
        entries = data.get("entries", [])
        if len(entries) < 2:
            print(f"❌ entries 数量不足: {len(entries)}")
            return

        target_entry = entries[1]
        target_path = target_entry["path"]
        print(f"\n{'='*60}")
        print(f"[Step 2] 取 entries[1]:")
        print(f"  name: {target_entry['name']}")
        print(f"  type: {target_entry['type']}")
        print(f"  path: {target_path}")

        # Step 3: 拼接 URL 请求文件
        file_url = f"{FILES_BASE_URL}?path={urllib.parse.quote(target_path, safe='')}&X-Directory-Token={DIRECTORY_TOKEN}"
        print(f"\n{'='*60}")
        print(f"[Step 3] 请求文件内容")
        print(f"  URL: {file_url}")
        print(f"{'='*60}")

        file_status, file_content = await fetch_file(target_path)
        print(f"状态码: {file_status}")
        print(f"返回内容:")
        print(file_content[:3000] if len(file_content) > 3000 else file_content)

    asyncio.run(main())
