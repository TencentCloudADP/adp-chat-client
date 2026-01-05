<div align="center">

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-Tencent-blue.svg)](https://github.com/TencentCloudADP/adp-chat-client)
[![WeChat Community](https://img.shields.io/badge/Community-WeChat-32CD32)](assets/wechat_qr.png)
[![Discord Community](https://img.shields.io/badge/Community-Discord-8A2BE2)](https://discord.gg/dwHuBUKkxw)

[🔖 中文版](README.cn.md) • [🚀 Quickly Start Guide](#Docker)

</div>

# About

**ADP-Chat-Client** is an open sourced AI Agent application conversation interface. It allows developers to quickly deploy AI agent applications developed on the [Tencent Cloud Agent Development Platform (Tencent Cloud ADP)](https://adp.tencentcloud.com/) as web applications (or embed them into mini-programs, Android, and iOS apps). The client supports real-time conversations, conversation history management, voice input, image understanding, third-party account system integration, and more. It supports fast deployment via Docker.

#### Table of Contents

- [Deployment](#deployment)
  - [Account System Integration](#account-system-integration)
- [Development Guide](#development-guide)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Advanced Topics](#advanced-topics)
  - [Agent: Variables - API Parameters](#agent-variables---api-parameters)
  - [Deployment: Subpath](#deployment-subpath)
  - [Deployment: Rate Limiting](#deployment-rate-limiting)

# Deployment

## System Requirements

Please ensure the machine meets the minimum requirements:

- CPU >= 2 Core
- RAM >= 4 GiB
- Operating System: Linux/macOS. If you want to run on Windows, you need to use WSL or a cloud server with a Linux system.

## Browser Compatibility (H5)

This project is built with Vue 3 and Vite, which requires modern browser support:

| <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/chrome/chrome_48x48.png" alt="Chrome" width="24"> Chrome | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/firefox/firefox_48x48.png" alt="Firefox" width="24"> Firefox | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/safari/safari_48x48.png" alt="Safari" width="24"> Safari | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/edge/edge_48x48.png" alt="Edge" width="24"> Edge | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24"> iOS Safari | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/chrome/chrome_48x48.png" alt="Android Chrome" width="24"> Android |
| :---: | :---: | :---: | :---: | :---: | :---: |
| >= 87 | >= 78 | >= 14 | >= 88 | >= 14 | >= 87 |

> ⚠️ **Note**: Internet Explorer is **NOT** supported. Vue 3 has dropped IE11 support.

## Docker

1. Clone the source code and enter the project directory.

```bash
git clone https://github.com/TencentCloudADP/adp-chat-client.git
cd adp-chat-client
```

2. Install docker (skip if docker is already installed on your system):

> For TencentOS Server 4.4:

```bash
bash script/init_env_tencentos.sh
```
> For Ubuntu Server 24.04:

```bash
bash script/init_env_ubuntu.sh
```

3. Copy the ```.env.example``` file to the deploy folder:

```bash
cp server/.env.example deploy/default/.env
```

4. Edit the ```deploy/default/.env``` file:

You need to fill in the following credentials and application keys based on your Tencent Cloud account and ADP platform information:

```
# Tencent Cloud account secret: https://console.tencentcloud.com/cam/capi
TC_SECRET_APPID=
TC_SECRET_ID=
TC_SECRET_KEY=
# Tencent Cloud ADP platform agent app key: https://adp.tencentcloud.com/
APP_CONFIGS='[
    {
        "Vendor":"Tencent",
        "ApplicationId":"The unique ID of the chat application, used to uniquely identify a chat application in this system. Recommended to use appid or generate a random uuid using the uuidgen command",
        "Comment": "Comment",
        "AppKey": "",
        "International": true
    }
]'

# JWT secret key, a random string, can be generated using the uuidgen command
SECRET_KEY=
```

> ⚠️ **Note**:
> 1. The content of APP_CONFIGS is in JSON format. Please adhere to JSON specifications, e.g., the last item should not end with a comma, and // comments are not supported.
> 2. Comment: Can be filled in freely for easy identification of the corresponding agent application.
> 3. International: If the agent application is developed on the [ADP](https://adp.tencentcloud.com/), set the value to true.
> 4. ApplicationId: Access any ADP application and check the appid in the application URL. For example, if an application's link is `https://adp.tencentcloud.com/adp/#/app/knowledge/app-config?appid=197******768&appType=knowledge_qa&spaceId=default_space`, then its ApplicationId is 197******768.
> 5. Vendor: Fixed to "Tencent", other options may be available for other platforms in the future.

5. Build docker image
```bash
# Build image (The initial deployment requires packing, and it needs to be rerun after code changes, no need to repack if you only modify the .env file).
sudo make pack
```

6. Start the container
```bash
sudo make deploy
```
Open the browser and navigate to http://localhost:8000 to view the login page.

> ⚠️ **Warning:** For production environment, you need to apply for an SSL certificate through your own domain and deploy it over HTTPS using nginx for reverse proxy or other methods. If deployed over HTTP, certain features (such as voice recognition, message copying, etc.) may not function properly.

7. Login

This system supports integration with existing account systems. Here, we demonstrate the [URL Redirection](#URL-Redirection) login method:

``` bash
sudo make url
```

The above command retrieves the login URL. Open this URL in the browser for login.

If OAuth login is configured, you can log in by opening http://localhost:8000 in the browser.

8. Troubleshooting
``` bash
# Check if the containers are running. Normally, there should be 2 containers: adp-chat-client-default, adp-chat-client-db-default
sudo docker ps

# If no containers are visible, it indicates a startup issue. You can check the logs:
sudo make logs
```

## Video Tutorial

[📺 Video Tutorial](https://pub-eada7a74aa3243c1a5c7b627deafeac9.r2.dev/adp-chat-client.mp4)

## Service Configuration

To use the system, enable/configure the following services:
1. Dialogue title generation: [Tencent Cloud DeepSeek OpenAI API](https://www.tencentcloud.com/document/product/1255/70381).
2. Voice input: [Speech Recognition: Settings](https://www.tencentcloud.com/products/asr), enable: Real-time speech recognition for the required region.
3. App Permission: Make sure the account associated with your TC_SECRET_ID/TC_SECRET_KEY has permission to access the applications you’ve added. For details, see the [platform-side user permissions documentation](https://www.tencentcloud.com/document/product/1254/73347).

## Account System Integration

### OAuth

### GitHub OAuth

GitHub OAuth is supported by default. You can can configure it as needed:
```
# you can obtain it from https://github.com/settings/developers
OAUTH_GITHUB_CLIENT_ID=
OAUTH_GITHUB_SECRET=
```
> 📝 **Note**：When creating a GitHub OAuth application, fill in the callback URL as：SERVICE_API_URL+/oauth/callback/github, for example: http://localhost:8000/oauth/callback/github

### Microsoft Entra ID OAuth

Microsoft Entra ID OAuth is supported by default. You can can configure it as needed:
```
# you can obtain it from https://entra.microsoft.com
OAUTH_MICROSOFT_ENTRA_CLIENT_ID=
OAUTH_MICROSOFT_ENTRA_SECRET=
# Endpoint (optional, if you have a tenant id, default: common), see: https://learn.microsoft.com/en-us/entra/identity-platform/authentication-national-cloud
OAUTH_MICROSOFT_ENTRA_ENDPOINT=common
```
> 📝 **Note**：When creating a Microsoft Entra ID OAuth application, fill in the callback URL as：SERVICE_API_URL+/oauth/callback/ms_entra_id, for example: http://localhost:8000/oauth/callback/ms_entra_id

### Other OAuth providers

> OAuth protocol enables seamless authentication and authorization. Developers can customize authentication methods according to their requirements. If you need to use a different OAuth system, you can modify the `server/core/oauth.py` file to adapt to the specific protocol.

### URL Redirection

If you have an existing account system but do not implement a standard OAuth flow, you can integrate with the system using a URL redirect method for simpler integration.

1. **Your account service:** Generate a URL pointing to this system, carrying CustomerId, Name, Timestamp, ExtraInfo, Code, etc.
2. **User:** Clicks the URL to login to their account.
3. **This system:** Verifies the signature, auto-creates/binds the account, generates a login session, and redirects to the chat page.

###### Parameter details:

| Parameter | Description |
| :----------- | :-----------|
| url | https://your-domain.com/account/customer?CustomerId=&Name=&Timestamp=&ExtraInfo=&Code= |
| CustomerId | Your account system's uid |
| Name | Your account system's username (optional) |
| Timestamp | Current timestamp |
| ExtraInfo | User information |
| Code | Signature, SHA256(HMAC(CUSTOMER_ACCOUNT_SECRET_KEY, CustomerId + Name + ExtraInfo + str(Timestamp))) |

> 📝 **Note**:
> 1. The parameters above must be URL-encoded, for more details you can refer to the CoreAccount.customer_auth in `server/core/account.py` file, and generate_customer_account_url in `server/main.py` file for URL generation method.
> 2. Configure CUSTOMER_ACCOUNT_SECRET_KEY in the .env file, a random string that can be generated using the uuidgen command.

### I want users to be able to use the service directly without logging in.

If you don't have your own account system and want new users to be able to access the chat interface immediately upon opening the link, you can achieve this by setting `AUTO_CREATE_ACCOUNT` in your .env file:

```
AUTO_CREATE_ACCOUNT=true
```

> 📝 **Note:** This will automatically create an account for each new user. Although this system has flow control settings, creating new accounts without restrictions makes it easy to bypass flow control. Using this mode in a publicly production system is not recommended.

# Development Guide

## Backend

### Dependencies

- python >= 3.12
- uv ~= 0.8

### Debugging

#### Command Line

```bash
# 1. Execute all the steps in [Deployment] section
# 2. Copy the edited .env file to the server folder
cp deploy/default/.env server/.env

# 3. Initialize (only needed on the first run)
make init_server

# 4. continue to [Frontend] section below.
```

## Frontend

### Dependencies

- node >= 20

``` bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install v22
```

### Debugging

#### Command Line

```bash
# Initialize (only needed on the first run)
make init_client

# Run the backend/frontend in dev mode, the terminal will print the debugging URL, such as: [ui]   ➜  Local:   http://localhost:5173/
make dev
```

### Architecture

| Component | Description |
| :----------- | :-----------|
| config | Configuration system |
| core | Core logic, not bound to specific protocols (e.g., HTTP or stdio) |
| middleware | Middleware for the Sanic server |
| model | ORM definitions for entities, e.g., Account |
| router | Externally exposed HTTP endpoints, typically wrapping core logic |
| static | Static files |
| test | Testing |
| util | Other utility classes |

# Advanced Topics

## Agent: Variables - API Parameters

When calling the agent for conversation, you can pass parameters to the agent. Depending on the specific situation, you can choose to pass them on the frontend or backend. Here is an example of adding API parameters on the backend:

```python
# Edit file: server/router/chat.py
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

        # Add the following code to attach additional API parameters during conversation:
        from core.account import CoreAccount
        account = await CoreAccount.get(request.ctx.db, request.ctx.account_id)
        # Note the json.dumps here: Tencent Cloud ADP convention requires that if the value is a dictionary, it needs to be JSON-encoded once and converted to a JSON string
        args['CustomVariables']['account'] = json.dumps({
            "id": str(account.Id),
            "name": account.Name,
        })
        logging.info(f"[ChatMessageApi] ApplicationId: {application_id},\n\
            CustomVariables: {args['CustomVariables']},\n\
            vendor_app: {vendor_app}")

```

## Deployment: Subpath

If you want to deploy the application to a subpath (e.g., /chat), you need to combine it with nginx's rewrite functionality. Here's an example of deploying to `https://example.com/chat`:

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
            rewrite ^/chat/(.*)$ /$1 break;
        }
    }
}
```

## Deployment: Rate Limiting

This system limits traffic based on path + account or IP address (IP address when not logged in, account address when logged in). The limit can be changed in the .env file using `RATE_LIMIT`.

```
RATE_LIMIT=100/minute
```

Configuration format reference: [limit string](https://limits.readthedocs.io/en/latest/quickstart.html#rate-limit-string-notation)
