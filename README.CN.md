# 开发指南

## 后端

### 架构

- config: 配置系统
- core: 核心逻辑，不与具体协议（如http或stdio）绑定
- middleware: sanic服务端的中间件
- model: 实体模型ORM定义，例如：Account
- router: 对外暴露的http入口，一般是对core的包装
- static: 静态文件
- test: 测试
- util: 其他辅助类

### 调试

#### vscode快捷调试

通过快捷命令（cmd+shift+p），输入Preferences: Open Keyboard Shortcuts (JSON)，添加如下配置，即可通过快捷键cmd+r快速启动命令，如对server进行单元测试

``` json
{
    "key": "cmd+r",
    "command": "workbench.action.terminal.sendSequence",
    "args": {
        "text": "make test_server\n"
    }
},
```