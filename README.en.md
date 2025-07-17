# Deployment

## Docker

1. Install Docker
```bash
bash script/init_env.sh
```

2. Copy the .env.example file to the deploy folder
```bash
cp server/.env.example deploy/default/.env
```

3. Edit the deploy/default/.env file

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

4. Pull the image
```bash
sudo make pull_image
```

5. Start the container
```bash
sudo make deploy
```

Note: For production, you should use your own domain, apply for an SSL certificate, and use nginx as a reverse proxy for HTTPS. If you deploy with HTTP, some features (like voice input and copy message) may not work.

## Account System Integration

### OAuth

GitHub OAuth is supported by default. You can configure it, or modify `core/oauth.py` for other OAuth systems:
```
OAUTH_GITHUB_CLIENT_ID=
OAUTH_GITHUB_SECRET=
```

### URL Redirection

If you already have your own account system but not standard OAuth, you can use this simpler method for integration.

1. **Your account service:** Generate a URL pointing to this system, carrying CustomerId, Name, Timestamp, ExtraInfo, Code, etc.
2. **User:** Clicks the URL.
3. **This system:** Verifies the signature, auto-creates/binds the account, generates a login session, and redirects to the chat page.

Parameters:

 - url: https://your-domain.com/account/customer?CustomerId=&Name=&Timestamp=&ExtraInfo=&Code=
 - CustomerId: Your account system's uid
 - Name: Your account system's username (optional)
 - Timestamp: Current timestamp
 - ExtraInfo: User information
 - Code: Signature, SHA256(HMAC(CUSTOMER_ACCOUNT_SECRET_KEY, CustomerId + Name + ExtraInfo + str(Timestamp)))
 - For details, see the code in core/account.py: CoreAccount.customer_auth, test/unit_test/conftest.py

# Development Guide

## Frontend

### Dependencies

1. node >= 18
2. npm

```bash
# for Ubuntu Server 24.04
sudo apt install nodejs npm
```

### Debugging

#### Command Line
```bash
# Initialize (only needed for the first run)
make init_client
# Build
make client
# The build output will be generated in server/static/app. After starting the backend, you can access it in the browser.
```

## Backend

### Debugging

#### Command Line
```bash
# 1. Execute all steps in Deployment
# 2. Copy the edited .env file to the server folder
cp deploy/default/.env server/.env
# 3. Start the server container in mount mode (no need to rebuild)
sudo make debug
```

#### VSCode Quick Debugging

Use the shortcut command (cmd+shift+p), enter "Preferences: Open Keyboard Shortcuts (JSON)", and add the following configuration to quickly launch commands via the shortcut cmd+r, such as running unit tests for the server.

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

- config: Configuration system
- core: Core logic, not bound to specific protocols (e.g., HTTP or stdio)
- middleware: Middleware for the Sanic server
- model: ORM definitions for entities, e.g., Account
- router: HTTP endpoints exposed externally, typically wrapping core logic
- static: Static files
- test: Testing
- util: Other utility classes