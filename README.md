# 关于
**adp-chat-client** 是一个开源的AI智能体应用对话端。可以将 [腾讯云智能体开发平台（Tencent Cloud ADP）](https://cloud.tencent.com/product/tcadp) 开发的 AI 智能体应用快速部署为Web应用（或嵌入到小程序、Android、iOS 应用中）。支持实时对话、对话历史管理、语音输入、图片理解、第三方账户体系对接等功能。支持通过 Docker 快速部署。

#### 目录

- [部署](#部署)
- [开发指南](#开发指南)

# 部署

## docker快速部署

1. 克隆源代码并进入目录
```bash
git clone https://github.com/TencentCloudADP/adp-chat-client.git
cd adp-chat-client
```

2. 安装docker并设定镜像配置（如果系统上已经装好docker，跳过）：
> 适用于 TencentOS Server 4.4：
``` bash
bash script/init_env_tencentos.sh
```
> 适用于 Ubuntu Server 24.04：
``` bash
bash script/init_env_ubuntu.sh
```

3. 复制```.env.example```文件到deploy文件夹
``` bash
cp server/.env.example deploy/default/.env
```

4. 修改```deploy/default/.env```文件中的配置项

您需要根据您的腾讯云账户和 ADP 平台的相关信息，填入以下密钥和应用 Key：

```
# 腾讯云账户密钥：https://console.cloud.tencent.com/cam/capi
TC_SECRET_APPID=
TC_SECRET_ID=
TC_SECRET_KEY=

# TCADP平台获取的智能体应用key：https://lke.cloud.tencent.com/
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

5. 制作镜像
``` bash
# 制作镜像
sudo make pack
```

6. 启动容器
``` bash
sudo make deploy
```
浏览器打开 http://localhost:8000 即可看到登录页面

> ⚠️ **注意**：正式的生产系统需要通过自有域名申请 SSL 证书，并使用 nginx 进行反向代理等方式部署到 https 协议。如果仅基于 http 协议部署，某些功能（如语音识别、消息复制等）可能无法正常工作。

## 服务开关

为了正常使用本系统，需要开启以下服务：
1. 对话标题：[知识引擎原子能力：后付费设置](https://console.cloud.tencent.com/lkeap/settings)，开启：原子能力_DeepSeek API-V3后付费
2. 语音输入：[语音识别：设置](https://console.cloud.tencent.com/asr/settings)，开启：所需区域的实时语音识别


## 账户体系对接

### OAuth

系统默认支持 GitHub OAuth 协议，开发者可以根据需要进行配置：
```
OAUTH_GITHUB_CLIENT_ID=
OAUTH_GITHUB_SECRET=
```
> OAuth 协议可以帮助实现无缝的身份验证和授权，开发者可以根据业务需求定制自己的认证方式。如需使用其他 OAuth 系统，可以根据具体协议修改 `server/core/oauth.py` 文件以适配。

### url跳转

如果您已经有自己的账户体系，但没有标准的OAuth，希望用更简单的方法对接，可以采用 url 跳转方式来实现系统对接。

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
> 1. 以上参数需要分别进行 url_encode，详细实现可以参考代码 `server/core/account.py` 内 CoreAccount.customer_auth 部分；生成url的方式可以参考 `server/test/unit_test/conftest.py`。
> 2. 需要在.env文件中配置CUSTOMER_ACCOUNT_SECRET_KEY，一个随机字符串，可以使用uuidgen命令生成

# 开发指南

## 前端

### 依赖

1. node >= 18
2. npm

``` bash
# 适用于 Ubuntu Server 24.04
sudo apt install nodejs npm

# 适用于 TencentOS Server 4.4
sudo dnf install -y nodejs npm
```

### 调试

#### 命令行
``` bash
# 初始化（仅首次运行）
make init_client

# 打包
make client
# 打包后编译结果会生成到server/static/app文件夹，启动服务端后即可在浏览器拉取访问
```

## 后端

### 调试

#### 命令行

``` bash
# 1. 执行【部署】的所有步骤
# 2. 复制刚刚编辑好的.env文件到server文件夹
cp deploy/default/.env server/.env

# 3. 以文件挂载方式启动server容器（无需重新打包）
sudo make debug
```

#### vscode快捷调试

通过快捷命令（cmd+shift+p），输入`Preferences: Open Keyboard Shortcuts (JSON)`，添加如下配置，即可通过快捷键cmd+r快速启动命令，如对server进行单元测试。

``` json
{
    "key": "cmd+r",
    "command": "workbench.action.terminal.sendSequence",
    "args": {
        "text": "make debug\n"
    }
},
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
