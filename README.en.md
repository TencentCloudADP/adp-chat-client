# About

**adp-chat-client** is an open sourced AI Agent application conversation interface. It allows developers to quickly deploy AI agent applications developed on the [Tencent Cloud AI Agent Development Platform (ADP)](https://cloud.tencent.com/product/tcadp) as web applications (or embed them into mini-programs, Android, and iOS apps). The client supports real-time conversations, conversation history management, voice input, image understanding, third-party account system integration, and more. It supports fast deployment via Docker.

#### Table of Contents

- [Deployment](#deployment)
- [Development Guide](#development-guide)

# Deployment

## Docker

1. Install Docker and configure settings:
> For Ubuntu Server 24.04:
```bash
bash script/init_env_ubuntu.sh
```
> For TencentOS Server 4.4:
```bash
bash script/init_env_tencentos.sh
```

2. Copy the ```.env.example``` file to the deploy folder
```bash
cp server/.env.example deploy/default/.env
```

3. Edit the ```deploy/default/.env``` file

You need to fill in the following credentials and application keys based on your Tencent Cloud account and ADP platform information:

```
# Tencent Cloud account secret: https://console.cloud.tencent.com/cam/capi
TC_SECRET_APPID=
TC_SECRET_ID=
TC_SECRET_KEY=

# TCADP platform agent app key: https://lke.cloud.tencent.com/
TCADP_APP_KEYS='[
    ""
]'
```

4. Pull or Build docker image
```bash
# Pull the image (if you don't have permission, use the build method instead)  
sudo make pull_image  

# Build  
# 1. Complete all steps in the [Development Guide - Frontend] section of this document 
# 2. Build the image:
sudo make pack  
```

5. Start the container
```bash
sudo make deploy
```
Open the browser and navigate to http://localhost:8000 to view the login page.

> ⚠️ **Warning:** For production environment, you need to apply for an SSL certificate through your own domain and deploy it over HTTPS using nginx for reverse proxy or other methods. If deployed over HTTP, certain features (such as voice recognition, message copying, etc.) may not function properly.

## Service Configuration

To use the system, enable the following services:
1. Dialogue title generation: [Knowledge Engine Atomic Capability: Postpaid Settings](https://console.cloud.tencent.com/lkeap/settings), enable: Atomic Capability_DeepSeek API-V3 Postpaid
2. Voice input: [Speech Recognition: Settings](https://console.cloud.tencent.com/asr/settings), enable: Real-time speech recognition for the required region.

## Account System Integration

### OAuth

GitHub OAuth is supported by default. You can can configure it as needed:
```
OAUTH_GITHUB_CLIENT_ID=
OAUTH_GITHUB_SECRET=
```
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

> 📝 **Note:** The parameters above must be URL-encoded, for more details you can refer to the CoreAccount.customer_auth part in `server/core/account.py` file, and `server/test/unit_test/conftest.py` file for URL generation method. 

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