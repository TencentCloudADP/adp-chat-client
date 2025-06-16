# Development Guide

## Backend

### Architecture

- config: Configuration system
- core: Core logic, not bound to specific protocols (e.g., HTTP or stdio)
- middleware: Middleware for the Sanic server
- model: ORM definitions for entities, e.g., Account
- router: HTTP endpoints exposed externally, typically wrapping core logic
- static: Static files
- test: Testing
- util: Other utility classes

### Debugging

#### Quick Debugging in VSCode

Use the shortcut command (cmd+shift+p), enter "Preferences: Open Keyboard Shortcuts (JSON)", and add the following configuration to quickly launch commands via the shortcut cmd+r, such as running unit tests for the server.

``` json
{
    "key": "cmd+r",
    "command": "workbench.action.terminal.sendSequence",
    "args": {
        "text": "make test_server\n"
    }
},
```