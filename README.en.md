# About

**adp-chat-client** is an open sourced AI Agent application conversation interface. It allows developers to quickly deploy AI agent applications developed on the [Tencent Cloud Agent Development Platform (Tencent Cloud ADP)](https://cloud.tencent.com/product/tcadp) as web applications (or embed them into mini-programs, Android, and iOS apps). The client supports real-time conversations, conversation history management, voice input, image understanding, third-party account system integration, and more. It supports fast deployment via Docker.

#### Table of Contents

- [Deployment](#deployment)
- [Development Guide](#development-guide)

# Deployment

## Docker

1. Clone the source code and enter the project directory
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

3. Copy the ```.env.example``` file to the deploy folder
```bash
cp server/.env.example deploy/default/.env
```

4. Edit the ```deploy/default/.env``` file

You need to fill in the following credentials and application keys based on your Tencent Cloud account and ADP platform information:

```
# Tencent Cloud account secret: https://console.tencentcloud.com/cam/capi
TC_SECRET_APPID=
TC_SECRET_ID=
TC_SECRET_KEY=
# Tencent Cloud ADP platform agent app key: https://lke.tencentcloud.com/
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

⚠️ **Note**:
1. The content of APP_CONFIGS is in JSON format. Please adhere to JSON specifications, e.g., the last item should not end with a comma, and // comments are not supported.
2. Comment: Can be filled in freely for easy identification of the corresponding agent application.
3. International: If the agent application is developed on the international site(https://lke.tencentcloud.com/), set this to true.

5. Build docker image
```bash
# Build  
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

## Service Configuration

To use the system, enable/configure the following services:
1. Dialogue title generation: [Knowledge Engine Atomic Capability: Postpaid Settings](https://console.cloud.tencent.com/lkeap/settings), enable: Atomic Capability_DeepSeek API-V3 Postpaid
2. Voice input: [Speech Recognition: Settings](https://console.cloud.tencent.com/asr/settings), enable: Real-time speech recognition for the required region.
3. App Permission: Make sure the account associated with your SECRET_KEY has permission to access the applications you’ve added. For details, see the [platform-side user permissions documentation](https://www.tencentcloud.com/document/product/1254/73347).

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

# Development Guide

## Frontend

### Dependencies

1. node >= 18
2. npm

```bash
# For Ubuntu Server 24.04
sudo apt install nodejs npm

# For TencentOS Server 4.4
sudo dnf install -y nodejs npm
```

### Debugging

#### Command Line
```bash
# Initialize (only needed on the first run)
make init_client

# Build
make client
# The build output will be generated in server/static/app. You can access it in the browser after starting the backend.
```

## Backend

### Debugging

#### Command Line
```bash
# 1. Execute all the steps in [Deployment] section
# 2. Copy the edited .env file to the server folder
cp deploy/default/.env server/.env

# 3. Start the server container in mount mode (no need to rebuild)
sudo make debug
```

#### VSCode Quick Debugging

Use the shortcut command (cmd+shift+p), enter `Preferences: Open Keyboard Shortcuts (JSON)`, and add the following configuration to quickly launch commands via the shortcut cmd+r, such as running unit tests for the server.

```json
{
    "key": "cmd+r",
    "command": "workbench.action.terminal.sendSequence",
    "args": {
        "text": "make debug\n"
    }
},
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