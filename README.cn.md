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
  - [智能体: VisitorId 配置](#智能体-visitorid-配置)
  - [智能体: 变量-API参数](#智能体-变量-API参数)
  - [智能体: 快捷按钮配置](#智能体-快捷按钮配置)
  - [部署: nginx](#部署-nginx)
  - [部署: 长时间回复被截断问题](#部署-长时间回复被截断问题)
  - [部署: 子路径](#部署-子路径)
  - [部署: 限流](#部署-限流)
  - [部署: CORS](#部署-cors)
  - [部署: Iframe 嵌入白名单](#部署-iframe-嵌入白名单)
  - [微信小程序接入示例](#微信小程序接入示例)

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

# ADP 平台专用密钥（仅当 ServiceVendor 为 "ChinaTencentADP" 时必填）
# 独立站获取地址见下方说明
ADP_SECRET_ID=
ADP_SECRET_KEY=

# ADP平台获取的智能体应用key：
# - 国内站：https://adp.cloud.tencent.com/
# - 独立站：https://adp.tencent.com/
APP_CONFIGS='[
    {
        "Vendor":"Tencent",
        "ApplicationId":"对话应用唯一Id，在本系统内唯一标识一个对话应用，推荐使用appid，或者使用uuidgen命令生成一个随机的uuid",
        "Comment": "注释",
        "AppKey": "",
        "International": false
    },
    {
        "Vendor":"Tencent",
        "ApplicationId":"独立站应用的唯一ID",
        "Comment": "独立站应用注释",
        "AppKey": "",
        "ServiceVendor": "ChinaTencentADP"
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
> 6. 配置多个应用时，在 APP_CONFIGS 数组内追加对象即可，格式与示例一致。
> 7. **ServiceVendor**: 可选值 `"ChinaTencentCloud"` (国内云，**默认**) / `"ChinaTencentADP"` (**独立站**) / `"International"` (国际站) / `"Private"` (私有化)。使用独立站时必须设置为 `"ChinaTencentADP"`。
> 8. **ADP_SECRET_ID / ADP_SECRET_KEY**: 仅当存在 `ServiceVendor: "ChinaTencentADP"` 时需要填写，用于独立站 API 认证。如果留空，系统会回退使用 TC_SECRET_ID / TC_SECRET_KEY。

#### 快捷按钮建议配置（可选）

通过 `SUGGESTION_CONFIGS` 可以为 Web 端对话页面配置快捷按钮，在输入框上方展示提示模板，用户点击后自动填入输入框。如果不配置该项，则不会显示快捷按钮。

配置格式：

```bash
SUGGESTION_CONFIGS='[
    {
        "GroupId": "分组唯一ID",
        "IconUrl": "分组图标URL（支持 https 远程图片）",
        "Name": "分组名称（如：文档处理、数据分析等）",
        "SuggestionList": [
            {
                "SuggestionId": "建议唯一ID",
                "Title": "建议标题",
                "PromptContent": "点击后填入输入框的提示文本"
            }
        ]
    }
]'
```

交互说明：
- **一级菜单**：水平展示各分组，显示图标+名称，可左右滑动
- **二级菜单**：点击分组后展开，水平展示该分组下的建议卡片（标题+描述）
- **点击建议**：将 `PromptContent` 填入输入框，用户可编辑后再发送
- **返回**：点击左上角返回图标回到一级菜单

`PromptContent` 支持 mention 语法（可选）：
- `@skill:<skill-name>` 引用当前应用已安装的 Skill
- `@knowledgeBase:<kb-name>` 引用已挂载的知识库
- `@tool:<tool-name>` 引用已注册的工具（**连接器 connector 同样使用 `@tool:` 前缀**）

点击后 mention 会以蓝色 chip 的形式渲染在输入框内，被引用对象必须已在当前应用中安装/挂载。

> ⚠️ **格式注意**：整个值使用单引号 `'...'` 包裹，JSON 内部**不要出现半角单引号 `'`（U+0027）**。若需要在 `PromptContent` 中引出一段短语，请使用中文全角引号 `“…”` / `‘…’`，或去掉引号。否则 Docker 部署模式下 dotenv 会把内部 `'` 视为值的结束，导致 `SUGGESTION_CONFIGS` 回退为空数组、快捷按钮全部消失。

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

### ADP 独立站（ChinaTencentADP）密钥配置

当你的智能体应用部署在 **ADP 独立站**（[https://adp.tencent.com](https://adp.tencent.com/)）上时，需要额外配置独立站专用密钥 `ADP_SECRET_ID` / `ADP_SECRET_KEY`，并在应用配置中声明 `ServiceVendor: "ChinaTencentADP"`。

#### 步骤一：申请独立站 API 密钥

1. 登录 [ADP 独立站](https://adp.tencent.com/)
2. 进入 **密钥管理** 页面：[https://adp.tencent.com/adp#/key-manage](https://adp.tencent.com/adp#/key-manage)
3. 点击 **「+ 新建 API 密钥」** 按钮

![ADP 密钥管理页面](docs/assets/adp-key-management.png)

4. 在弹窗中确认创建后，系统将显示 `SecretID` 和 `SecretKey`

![新建 API 密钥弹窗](docs/assets/create-api-key.png)

> ⚠️ **重要提示**：新建的密钥只在创建时提供一次 SecretKey，后续不可再查看，请务必妥善保存。

#### 步骤二：在 .env 中填写密钥（请勿将真实密钥提交到代码仓库）

在 `deploy/default/.env` 中填写以下字段：

```bash
# ADP 独立站专用密钥（仅当 ServiceVendor 为 "ChinaTencentADP" 时必填）
# 获取地址：https://adp.tencent.com/adp#/key-manage
ADP_SECRET_ID=
ADP_SECRET_KEY=
```

- 将弹窗中的 **SecretID** 填入 `ADP_SECRET_ID`
- 将弹窗中的 **SecretKey** 填入 `ADP_SECRET_KEY`
- 在 `APP_CONFIGS` 中对应应用的配置对象中加入 `"ServiceVendor": "ChinaTencentADP"`

```bash
APP_CONFIGS='[
    {
        "Vendor": "Tencent",
        "ApplicationId": "独立站应用的唯一ID",
        "Comment": "独立站应用注释",
        "AppKey": "",
        "ServiceVendor": "ChinaTencentADP"
    }
]'
```

> 💡 **提示**：如果 `ADP_SECRET_ID` / `ADP_SECRET_KEY` 留空，系统会回退使用 `TC_SECRET_ID` / `TC_SECRET_KEY`。同一份 `APP_CONFIGS` 可混合配置多个来源的应用（国内云 + 独立站 + 国际站），只需每个应用对象的 `ServiceVendor` 设置正确即可。


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

## 智能体: VisitorId 配置

调用腾讯云 ADP 对话接口时，本服务会向 ADP 传递 `VisitorId`。可以在 `.env` 中通过 `ADP_VISITOR_ID_TYPE` 配置使用哪个账户字段：

```bash
ADP_VISITOR_ID_TYPE=NAME
```

支持的值：

| 值 | 行为 |
| --- | --- |
| `NAME` | 默认值。使用用户展示名称作为 `VisitorId`。 |
| `CUSTOMER_ID` | 使用账户体系对接时绑定的 `CustomerId` 作为 `VisitorId`。 |

该配置只影响发送给 ADP 的 `VisitorId`。本系统内的登录态、会话归属和权限校验仍使用本系统内部账号 ID。

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

## 智能体: 快捷按钮配置

在 Web 端对话页面的输入框上方，可以通过配置 `SUGGESTION_CONFIGS` 展示快捷按钮，为用户提供预设的提示模板。该功能对标智能体开发平台的"提示建议"（DescribePromptSuggestionList）能力，数据完全从配置文件读取，不依赖后端接口调用。

### 数据结构

`SUGGESTION_CONFIGS` 是一个 JSON 数组，数组的每一项为一个分组（Group），每个分组包含一个建议列表（SuggestionList）：

```json
[
    {
        "GroupId": "分组唯一标识（字符串）",
        "IconUrl": "分组图标URL（支持https远程图片，建议 32x32px）",
        "Name": "分组名称",
        "SuggestionList": [
            {
                "SuggestionId": "建议唯一标识（字符串）",
                "Title": "建议标题（展示在卡片上方）",
                "PromptContent": "点击后填入输入框的文本内容"
            }
        ]
    }
]
```

### 交互说明

| 层级 | 展示方式 | 操作 |
|------|---------|------|
| 一级（分组列表） | 水平滚动行，显示图标+名称 | 点击分组进入二级 |
| 二级（建议卡片） | 水平滚动的卡片行，每张卡片显示标题+描述（最多两行） | 点击卡片将 `PromptContent` 填入输入框，并返回一级 |
| 返回 | 二级顶部显示带左箭头的分组名称 | 点击返回一级 |

> 📝 **注意**：
> 1. 仅在消息列表为空时显示快捷按钮，发送消息后自动隐藏
> 2. 点击建议后填入输入框但**不会自动发送**，用户可以编辑后再发送
> 3. 如果不配置或配置为空数组 `[]`，则不显示快捷按钮区域
> 4. 图标加载失败时会显示默认占位图标

### 完整配置示例

```bash
SUGGESTION_CONFIGS='[
    {
        "GroupId": "group-doc",
        "IconUrl": "https://cdn.example.com/icons/doc-process.png",
        "Name": "文档处理",
        "SuggestionList": [
            {
                "SuggestionId": "sug-001",
                "Title": "会议纪要转周报",
                "PromptContent": "请将我上传的会议纪要整理成正式项目周报..."
            },
            {
                "SuggestionId": "sug-002",
                "Title": "发票信息提取",
                "PromptContent": "帮我创建一个“发票信息提取”Skill：上传发票图片或 PDF，自动识别发票关键字段并输出结构化 JSON。"
            }
        ]
    },
    {
        "GroupId": "group-app",
        "IconUrl": "https://cdn.example.com/icons/app-build.png",
        "Name": "应用搭建",
        "SuggestionList": [
            {
                "SuggestionId": "sug-003",
                "Title": "销售数据分析助手",
                "PromptContent": "帮我创建一个销售数据分析助手的应用，支持自然语言查询销售数据、自动生成可视化图表。@skill:example-app-manager"
            }
        ]
    }
]'
```

### PromptContent 高级用法

`PromptContent` 除了纯文本外，还支持 **mention 引用**，格式为 `@<type>:<name>`，点击建议后会在输入框中以蓝色 chip 形式呈现：

| 语法 | 含义 |
|------|------|
| `@skill:<skill-name>` | 引用当前应用已安装的 Skill |
| `@knowledgeBase:<kb-name>` | 引用已挂载的知识库 |
| `@tool:<tool-name>` | 引用已注册的工具或连接器（connector 同样使用 `@tool:` 前缀） |

被引用的实体必须已经在当前应用中安装/挂载，否则 chip 无法命中，会以纯文本形式展示。连接器与工具共用 `@tool:` 前缀，前端会依据当前应用已注册的 connector 名称自动区分并展示为"连接器"类型的 chip。

### 格式注意事项

`SUGGESTION_CONFIGS` 在 `.env` 中使用单引号 `'...'` 包裹一段跨行 JSON。请遵守以下规则，避免解析失败：

1. **禁止在 JSON 内出现半角单引号 `'`（U+0027）**。若 `PromptContent` 需要引出一段短语，请使用中文全角引号 `“…”` / `‘…’`，或者不加引号。原因：Docker 部署模式下后端使用 `python-dotenv` 严格解析 `.env`，遇到内部 `'` 会立刻视为闭合引号，从而丢弃整个 `SUGGESTION_CONFIGS`，前端表现为 `GroupList` 为空、看不到任何快捷按钮。
2. **JSON 字符串使用双引号 `"..."`**；如需在文本内出现英文双引号，请使用 `\"` 转义。
3. **建议每个 `GroupId` / `SuggestionId` 全局唯一**，前端会用作 `key`。
4. **`IconUrl` 必须是可公网访问的 https 链接**，建议尺寸 32×32 px。
5. **修改 `.env` 后需要重启容器/服务**才能生效（无需重新 `pack` 镜像）。

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

## 部署: 长时间回复被截断问题

如果智能体回复时间较长，前端可能出现响应中途断开或内容被截断。可以按以下两步调整超时时间：

1. 调整服务端 `SERVER_RESPONSE_TIMEOUT` 参数

在 `.env` 中增加或修改该参数，单位为秒。建议设置为大于智能体最长回复耗时的值：

```bash
SERVER_RESPONSE_TIMEOUT=600
```

2. 增加 nginx `proxy_read_timeout` 参数

如果前面还有 nginx 反向代理，需要同步调大 nginx 等待上游响应的时间：

```nginx
location / {
    proxy_pass http://127.0.0.1:8000;
    proxy_read_timeout 600s;
    proxy_buffering off;
}
```

修改后需要重启服务端容器和重新加载 nginx 配置。

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

## 部署：文件预览服务
word、excel、ppt 等需要配置启动预览服务。
1. 需要使用主账号登录 https://console.cloud.tencent.com/cos/bucket；
2. 搜索.env中配置的 cos 桶名称COS_BUCKET（默认为chat-client-bucket-${TC_SECRET_APPID}， 注意: ${TC_SECRET_APPID} 为配置中填入的TC_SECRET_APPID， 实际cos桶的名称例如chat-client-bucket-1322044278），点击打开选中的桶
3. 左侧菜单中选中 "数据处理" -> "文档处理" -> "开启"；
4. "数据处理" -> 文件处理 -> "开启"

## 微信小程序接入示例

微信小程序可以通过 `<web-view>` 组件嵌入本系统部署的 Web 页面，实现在小程序中使用 AI 对话功能。

### 前置条件

1. 完成本系统的 [部署](#部署) 步骤，确保 Web 服务正常运行
2. 在 `.env` 中配置 `IFRAME_ORIGINS`，添加小程序的 web-view 业务域名：

```
IFRAME_ORIGINS=https://your-domain.com
```

3. 在 `.env` 中配置 `CORS_ORIGINS`，允许跨域请求：

```
CORS_ORIGINS=https://your-domain.com
```

4. 确保服务部署在 HTTPS 域名下（小程序要求业务域名必须为 HTTPS）

### 小程序配置

1. 登录 [微信公众平台](https://mp.weixin.qq.com/)，进入小程序管理后台
2. 在 **开发管理** → **开发设置** → **业务域名** 中，添加本系统部署的域名

### 小程序代码示例

创建一个页面，使用 `<web-view>` 嵌入本系统的对话页面：

```xml
<!-- pages/chat/chat.wxml -->
<web-view src="{{chatUrl}}"></web-view>
```

```javascript
// pages/chat/chat.js
Page({
  data: {
    chatUrl: ''
  },
  onLoad() {
    // 替换为你实际部署的地址
    this.setData({
      chatUrl: 'https://your-domain.com'
    })
  }
})
```

> 📝 **注意**：
> 1. `<web-view>` 组件会自动铺满整个小程序页面。
> 2. 小程序的 `<web-view>` 仅支持 HTTPS 协议的业务域名，调试阶段可在微信开发者工具中勾选 **"不校验合法域名"** 临时使用 `http://localhost:5174/`。
> 3. 账户体系对接建议使用 [url跳转](#url跳转) 方式，在小程序端获取用户信息后生成登录 URL 传给 web-view。
> 4. 个人类型的小程序不支持 `<web-view>` 组件，需要使用企业类型的小程序。

### 本地调试

开发阶段可以在微信开发者工具中进行调试：

1. 启动本系统的开发服务：

```bash
make dev_withdb
```

2. 前端服务启动后，访问地址为 `http://localhost:5174/`
3. 在微信开发者工具中，勾选 **"不校验合法域名、web-view(业务域名)、TLS版本以及HTTPS证书"**
4. 将 `<web-view>` 的 `src` 设置为 `http://localhost:5174/`

```javascript
// pages/chat/chat.js（本地调试）
Page({
  data: {
    chatUrl: 'http://localhost:5174/'
  }
})
```

## 应用&配置：Claw模式开启用户自定义选择 Skill & 模型 & 连接器功能 
1. 登录腾讯云 [智能体开发平台](https://adp.cloud.tencent.com/adp)
2. 应用开发 -> 进入 APP_CONFIGS 配置的 应用
3. 在高级配置中找到 "允许在对话中动态修改配置"
![alt text](docs/assets/setting1.png)
4. 发布应用

## 应用&配置：开启知识库功能 
1. 登录腾讯云 [智能体开发平台](https://adp.cloud.tencent.com/adp)
2. 应用开发 -> 进入 APP_CONFIGS 配置的 应用
3. 在工具中添加 "知识库问答/KnowledgeRetrievalAnswer" 工具（默认是已添加的）
![alt text](docs/assets/setting2.png)
4. 发布应用
