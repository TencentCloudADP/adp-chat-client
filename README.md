# 部署

## docker

1. 复制.env.example文件到deploy文件夹
``` bash
cp server/.env.example deploy/.env
```

2. 修改deploy/.env文件

```
# 腾讯云账户密钥：https://console.cloud.tencent.com/cam/capi
TC_SECRET_APPID=
TC_SECRET_ID=
TC_SECRET_KEY=

# TCADP平台获取的智能体应用key：https://lke.cloud.tencent.com/
TCADP_APP_KEYS='[
    ""
]'
```

3. 拉取镜像
``` bash
make pull_image
```

4. 启动容器
``` bash
make deploy
```

# 开发指南

## 前端

### 调试

#### 命令行
``` bash
# 初始化（只需要首次运行）
make init_client
# 打包
make client
# 打包后编译结果会生成到server/static/app文件夹，启动服务端后即可在浏览器拉取
```

## 后端

### 调试

#### 命令行

``` bash
# 1. 执行deploy的所有步骤
# 2. 复制刚刚编辑好的.env文件到server文件夹
cp deploy/.env server/.env
# 3. 以文件挂载方式启动server容器（不需要重新打包）
make debug
```

#### vscode快捷调试

通过快捷命令（cmd+shift+p），输入Preferences: Open Keyboard Shortcuts (JSON)，添加如下配置，即可通过快捷键cmd+r快速启动命令，如对server进行单元测试

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

- config: 配置系统
- core: 核心逻辑，不与具体协议（如http或stdio）绑定
- middleware: sanic服务端的中间件
- model: 实体模型ORM定义，例如：Account
- router: 对外暴露的http入口，一般是对core的包装
- static: 静态文件
- test: 测试
- util: 其他辅助类
