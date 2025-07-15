# Deployment

## Docker

1. Copy the .env.example file to the deploy folder
```bash
cp server/.env.example deploy/.env
```

2. Edit the deploy/.env file

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

3. Pull the image
```bash
make pull_image
```

4. Start the container
```bash
make deploy
```

# Development Guide

## Frontend

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
# 1. Execute all steps in deploy
# 2. Copy the edited .env file to the server folder
cp deploy/.env server/.env
# 3. Start the server container in mount mode (no need to rebuild)
make debug
```

#### Quick Debugging in VSCode

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