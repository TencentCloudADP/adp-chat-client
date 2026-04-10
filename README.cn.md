<div align="center">

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-Tencent-blue.svg)](https://github.com/TencentCloudADP/adp-chat-client)
[![微信社群](https://img.shields.io/badge/Community-WeChat-32CD32)](assets/wechat_qr.png)
[![Discord 社群](https://img.shields.io/badge/Community-Discord-8A2BE2)](https://discord.gg/dwHuBUKkxw)

[🔖 English](README.md) • [🚀 部署指南](#部署)

</div>


# 关于

**ADP-Chat-Client**是一个开源的AI智能体应用对话端。可以将[腾讯云智能体开发平台（Tencent Cloud ADP）](https://cloud.tencent.com/product/tcadp) 开发的AI智能体应用快速部署为Web应用（或嵌入到小程序、Android、iOS 应用中）。支持实时对话、对话历史管理、语音输入、图片理解、交互式Widget（图表、表单等）、第三方账户体系对接等功能。支持通过Docker快速部署。

#### 目录

- [部署](#部署)
  - [账户体系对接](#账户体系对接)
- [开发指南](#开发指南)
  - [后端](#后端)
  - [前端](#前端)
- [专题](#专题)
  - [智能体: 变量-API参数](#智能体-变量-API参数)
  - [部署: nginx](#部署-nginx)
  - [部署: 子路径](#部署-子路径)
  - [部署: 限流](#部署-限流)
  - [部署: CORS](#部署-cors)
  - [部署: Iframe 嵌入白名单](#部署-iframe-嵌入白名单)

# 部署

## 系统要求

请确保机器满足最低要求：

- CPU >= 2 Core
- RAM >= 4 GiB
- 操作系统：Linux/macOS。如果你希望在Windows系统运行，需要通过WSL，或者使用Linux系统的云服务器

## 浏览器兼容性（H5）

本项目基于 Vue 3 和 Vite 构建，需要现代浏览器支持：

| <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/chrome/chrome_48x48.png" alt="Chrome" width="24"> Chrome | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/firefox/firefox_48x48.png" alt="Firefox" width="24"> Firefox | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/safari/safari_48x48.png" alt="Safari" width="24"> Safari | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/edge/edge_48x48.png" alt="Edge" width="24"> Edge | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24"> iOS Safari | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/chrome/chrome_48x48.png" alt="Android Chrome" width="24"> Android |
| :---: | :---: | :---: | :---: | :---: | :---: |
| >= 87 | >= 78 | >= 14 | >= 88 | >= 14 | >= 87 |

> ⚠️ **注意**：**不支持** Internet Explorer。Vue 3 已放弃对 IE11 的支持。

## Docker快速部署

1. 克隆源代码并进入目录

```bash
git clone https://github.com/TencentCloudADP/adp-chat-client.git
cd adp-chat-client
```

2. 安装Docker并设定镜像配置（如果系统上已经装好Docker，可跳过该步骤）：

> 适用于 TencentOS Server 4.4：

```bash
bash script/init_env_tencentos.sh
```
> 适用于 Ubuntu Server 24.04：

```bash
bash script/init_env_ubuntu.sh
```

3. 复制`.env.example`文件到deploy文件夹

``` bash
cp server/.env.example deploy/default/.env
```

4. 修改```deploy/default/.env```文件中的配置项

您需要根据您的腾讯云账户和ADP平台的相关信息，填入以下密钥和应用Key：

```bash
# 腾讯云账户密钥：https://console.cloud.tencent.com/cam/capi
TC_SECRET_APPID=
TC_SECRET_ID=
TC_SECRET_KEY=

# ADP平台获取的智能体应用key：https://adp.cloud.tencent.com/
APP_CONFIGS='[
    {
        "Vendor":"Tencent",
        "ApplicationId":"对话应用唯一Id，在本系统内唯一标识一个对话应用，推荐使用appid，或者使用uuidgen命令生成一个随机的uuid",
        "Comment": "注释",
        "AppKey": "",
        "International": false
    }
]'

# JWT密钥，一个随机字符串，可以使用uuidgen命令生成
SECRET_KEY=

```

> ⚠️ **注意**：
> 1. APP_CONFIGS内容为JSON，注意遵循JSON规范，例如：最后一项末尾不能有逗号，不支持//注释
> 2. Comment: 可以任意填写，方便自己定位对应的智能体应用
> 3. International: 使用腾讯云国内站设为false(默认)，如果是在国际站开发的智能体应用，此处设为true
> 4. ApplicationId: 进入任意ADP应用，在应用网址内查看appid。例如某个应用的链接为 `https://adp.cloud.tencent.com/adp/#/app/knowledge/app-config?appid=1959******8208&appType=knowledge_qa&spaceId=default_space`，则它的ApplicationId为1959******8208。
> 5. Vendor: 固定为Tencent，后续支持其他平台可能会有其他选项

5. 制作镜像

``` bash
# 制作镜像（首次部署需要运行，修改代码后需要重新运行，如果只是修改.env文件不需要重新pack）
sudo make pack
```

6. 启动容器
``` bash
sudo make deploy
```

> ⚠️ **注意**：正式的生产系统需要通过自有域名申请SSL证书，并使用nginx进行反向代理等方式部署到https协议。如果仅基于http协议部署，某些功能（如语音识别、消息复制等）可能无法正常工作。

7. 登录

本系统支持和现有账户体系打通，此处演示基于[url跳转](#url跳转)的登录方式：

``` bash
sudo make url
```

上述命令可以获得登录url，在浏览器打开该url进行无感登录。

如果配置了OAuth登录方式，可以在浏览器打开 http://localhost:8000 进行登录。

8. 问题排查
``` bash
# 检查容器是否在运行，正常应该有2个容器：adp-chat-client-default, adp-chat-client-db-default
sudo docker ps

# 如果没有看到容器，意味着启动遇到问题，可以查看日志:
sudo make logs
```

## 视频讲解

[🎥 观看演示视频](https://pub-eada7a74aa3243c1a5c7b627deafeac9.r2.dev/adp-chat-client.mp4)

## 服务开关

为了正常使用本系统，需要开启/配置以下服务：
1. 对话标题：[知识引擎原子能力：后付费设置](https://console.cloud.tencent.com/lkeap/settings)，开启：原子能力_DeepSeek API-V3后付费
2. 语音输入：[语音识别：设置](https://console.cloud.tencent.com/asr/settings)，开启：所需区域的实时语音识别
3. 应用权限：请确保配置的 TC_SECRET_ID/TC_SECRET_KEY 所对应的账号拥有已添加的应用的权限，详情可参考[平台端用户权限说明](https://cloud.tencent.com/document/product/1759/122574)

## 账户体系对接

### GitHub OAuth

默认支持GitHub OAuth协议，开发者可以根据需要进行配置：
```
# you can obtain it from https://github.com/settings/developers
OAUTH_GITHUB_CLIENT_ID=
OAUTH_GITHUB_SECRET=
```
> 📝 **注意**：创建GitHub OAuth应用时，callback URL填写：SERVICE_API_URL+/oauth/callback/github，例如：http://localhost:8000/oauth/callback/github

### Microsoft Entra ID OAuth

默认支持 Microsoft Entra ID OAuth 协议，开发者可以根据需要进行配置：
```
# you can obtain it from https://entra.microsoft.com
OAUTH_MICROSOFT_ENTRA_CLIENT_ID=
OAUTH_MICROSOFT_ENTRA_SECRET=
# Endpoint (optional, if you have a tenant id, default: common), see: https://learn.microsoft.com/en-us/entra/identity-platform/authentication-national-cloud
OAUTH_MICROSOFT_ENTRA_ENDPOINT=common
```
> 📝 **注意**：创建Microsoft Entra ID OAuth应用时，callback URL填写：SERVICE_API_URL+/oauth/callback/ms_entra_id，例如：http://localhost:8000/oauth/callback/ms_entra_id

### 其它OAuth

OAuth协议可以帮助实现无缝的身份验证和授权，开发者可以根据业务需求定制自己的认证方式。如需使用其他OAuth系统，可以根据具体协议修改 `server/core/oauth.py` 文件以适配。

### url跳转

如果您已经有自己的账户体系，但没有标准的OAuth，希望用更简单的方法对接，可以采用url跳转方式来实现系统对接。

1. 【您现有的账户服务】：生成指向本系统的url，携带CustomerId、Name、ExtraInfo、Timestamp、签名等信息。
2. 【用户】：用户点击该url，进行登录。
3. 【本系统】：校验签名通过，自动创建、绑定账户，生成登录态，自动跳转到对话页面。

###### 详细参数：

| 参数      | 描述 |
| :----------- | :-----------|
| url | https://your-domain.com/account/customer?CustomerId=&Name=&Timestamp=&ExtraInfo=&Code= |
| CustomerId | 您现有账户体系的uid |
| Name | 您现有账户体系的username（可选）|
| Timestamp | 当前时间戳 |
| ExtraInfo | 用户信息 |
| Code | 签名，SHA256(HMAC(CUSTOMER_ACCOUNT_SECRET_KEY, CustomerId + Name + ExtraInfo + str(Timestamp))) |

> 📝 **注意**：

> 1. 以上参数需要分别进行url_encode，详细实现可以参考代码 `server/core/account.py` 内 CoreAccount.customer_auth 部分；生成url的方式可以参考 `server/main.py`的generate_customer_account_url。

> 2. 需要在.env文件中配置CUSTOMER_ACCOUNT_SECRET_KEY，一个随机字符串，可以使用uuidgen命令生成。

### 我希望用户不登录就能直接使用

如果你没有自己的账号体系，希望新用户打开链接就能进入对话界面开始使用，可以通过在.env文件设置`AUTO_CREATE_ACCOUNT`实现:

```
AUTO_CREATE_ACCOUNT=true
```

> 📝 **注意**: 这会为每个新用户自动创建账户，虽然本系统有流控设置，但是能不加限制的创建新账户，仍然是很容易突破流控的，不建议在生产系统中使用这个模式

# 开发指南

## 后端

### 依赖

- python >= 3.12
- uv ~= 0.8

### 调试

#### 命令行

``` bash
# 1. 执行【部署】的所有步骤
# 2. 复制刚刚编辑好的.env文件到server文件夹
cp deploy/default/.env server/.env

# 3. 初始化（仅首次运行）
make init_server

# 4. 继续下面的步骤，安装【前端】部分依赖
```

## 前端

### 依赖

- node >= 20

``` bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install v22
```

### 调试

#### 命令行

``` bash
# 初始化（仅首次运行）
make init_client

# 调试运行，同时运行前后端和一个 PostgreSQL 容器，终端会打印调试网址，如：[ui]   ➜  Local:   http://localhost:5173/
# 数据会持久化到 deploy/dev/volume/db。
# 需要确保 server/.env 中的 PGSQL_HOST 为 localhost 或 127.0.0.1。
make dev_withdb

# 如果你有自己的PostgreSQL实例，不需要本地自动启动新的实例，运行以下命令
make dev
```

### 架构

| 组成部分      | 描述 |
| :----------- | :-----------|
| config      | 配置系统 |
| core   | 核心逻辑，不与具体协议（如http或stdio）绑定 |
| middleware | Sanic服务端的中间件 |
| router | 对外暴露的http入口，一般是对core的包装 |
| static | 静态文件 |
| test | 测试 |
| util | 其他辅助类 |

# 专题

## 智能体: 变量-API参数

调用智能体对话时，可以向智能体传递参数，根据具体情况，可以选择在前端还是后端进行传递，这是一个后端附加API参数的示例

```python
# 编辑文件：server/router/chat.py
class ChatMessageApi(HTTPMethodView):
    @login_required
    async def post(self, request: Request):
        parser = reqparse.RequestParser()
        parser.add_argument("Query", type=str, required=True, location="json")
        parser.add_argument("ConversationId", type=str, location="json")
        parser.add_argument("ApplicationId", type=str, location="json")
        parser.add_argument("SearchNetwork", type=bool, default=True, location="json")
        parser.add_argument("CustomVariables", type=dict, default={}, location="json")
        args = parser.parse_args(request)
        logging.info(f"ChatMessageApi: {args}")

        application_id = args['ApplicationId']
        vendor_app = app.get_vendor_app(application_id)

        # 新增以下代码，就能在对话时附加额外的API参数：
        import json
        from core.account import CoreAccount
        account = await CoreAccount.get(request.ctx.db, request.ctx.account_id)
        account_third_party = await CoreAccount.get_third_party(request.ctx.db, request.ctx.account_id)
        # 注意这里的json.dumps，腾讯云ADP约定：如果值是字典，需要进行一次json编码，转换为json字符串
        args['CustomVariables']['account'] = json.dumps({
            "id": account_third_party.OpenId if account_third_party else str(account.Id),
            "name": account.Name if account else "",
        })
        logging.info(f"[ChatMessageApi] ApplicationId: {application_id},\n\
            CustomVariables: {args['CustomVariables']},\n\
            vendor_app: {vendor_app}")

```

## 部署: nginx

生产环境通常会使用 nginx 反向代理到本系统。以下配置不能遗漏，否则容易出现流式响应卡住、后端拿不到真实客户端 IP、限流误判等问题。

必须保留的设置：

1. `proxy_buffering off;`

聊天接口使用 SSE 流式返回内容。如果遗漏这项，nginx 可能会缓存上游响应，导致前端长时间收不到增量消息，或者直到响应结束才一次性显示。

2. `proxy_set_header X-Real-IP $remote_addr;`

后端需要拿到真实客户端 IP，用于日志记录、风控和未登录场景的限流。如果不透传，服务端看到的可能只有 nginx 容器或内网代理地址。

3. `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`

这会保留完整的代理链路 IP。经过多层代理或负载均衡时，后端可以基于该请求头继续还原来源地址；如果遗漏，链路信息可能丢失。

最小示例：

```nginx
http {
    server {
        location / {
            proxy_pass http://127.0.0.1:8000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_buffering off;
        }
    }
}
```

如果需要部署到子路径（如 `/chat`），还需要结合下一节的 rewrite 和 `X-Forwarded-Prefix` 配置。

## 部署: 子路径

如果希望部署到一个子路径里（如：/chat），需要结合nginx的rewrite功能，这里以部署到`https://example.com/chat`为例进行说明

.env
```
SERVICE_API_URL=https://example.com/chat
SERVER_HTTP_PORT=8000
```

nginx.conf
```
http {
    server {
        location /chat {
            proxy_pass http://127.0.0.1:8000/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-Prefix /chat;
            proxy_buffering off;
            rewrite ^/chat/(.*)$ /$1 break;
        }
    }
}
```

## 部署: 限流

本系统基于路径+账户或IP(未登录时基于IP，登录后基于账户)进行限流，可以在.env文件里通过`RATE_LIMIT`更改限制

```
RATE_LIMIT=100/minute
```

配置格式参考：[limit string](https://limits.readthedocs.io/en/latest/quickstart.html#rate-limit-string-notation)

## 部署: CORS

如果前端和后端部署在不同域名/端口下，需要在`.env`中配置`CORS_ORIGINS`，允许浏览器进行跨域请求。

多个 origin 用英文逗号分隔：

```
CORS_ORIGINS=http://localhost,http://127.0.0.1:3000
```

## 部署: Iframe 嵌入白名单

如果需要允许页面被其他站点以 iframe 嵌入，可以在`.env`中配置`IFRAME_ORIGINS`。多个 origin 用英文逗号分隔。

```
IFRAME_ORIGINS=https://example.com
```

推荐优先使用同域名嵌入（父页面与本系统同域），这种情况下不需要配置`IFRAME_ORIGINS`。

只有在跨域嵌入时才需要配置`IFRAME_ORIGINS`。

配置后会自动开启 iframe 登录所需的 cookie 策略（`SameSite=None; Secure`）并启用 CORS credentials。请确保站点使用 HTTPS。

留空时，默认仅允许同源嵌入（`frame-ancestors 'self'`）。

请注意：iframe 场景受浏览器安全策略影响，部分 OAuth 登录流程可能被拒绝或受限。
