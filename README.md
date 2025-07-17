# 部署

## docker

1. 安装docker
``` bash
bash script/init_env.sh
```

2. 复制.env.example文件到deploy文件夹
``` bash
cp server/.env.example deploy/default/.env
```

3. 修改deploy/default/.env文件

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

4. 拉取镜像
``` bash
sudo make pull_image
```

5. 启动容器
``` bash
sudo make deploy
```

注意：正式的生产系统需要通过自有域名申请证书，使用nginx反代等方式部署到https协议，如果基于http协议部署，无法使用语音、复制消息等功能

## 账户体系对接

### OAuth

默认支持GitHub OAuth协议，可以配置，其他OAuth系统可根据具体协议修改core/oauth.py文件：
```
OAUTH_GITHUB_CLIENT_ID=
OAUTH_GITHUB_SECRET=
```

### url跳转

如果你已经有自己的账户体系，但没有标准的OAuth，希望用更简单的方法对接，那么可以采用这个方法。

1. 【你现有的账户服务】：生成指向本系统的url，携带CustomerId、Name、ExtraInfo、Timestamp、签名等信息
2. 【用户】：用户点击该url
3. 【本系统】：校验签名通过，自动创建、绑定账户，生成登录态，自动跳转到对话页面

详细参数：

 - url: https://your-domain.com/account/customer?CustomerId=&Name=&Timestamp=&ExtraInfo=&Code=
 - CustomerId: 你现有账户体系的uid
 - Name: 你现有账户体系的username（可选）
 - Timestamp: 当前时间戳
 - ExtraInfo: 用户信息
 - Code: 签名，SHA256(HMAC(CUSTOMER_ACCOUNT_SECRET_KEY, CustomerId + Name + ExtraInfo + str(Timestamp)))
 - 以上参数需要分别进行url_encode，详细实现可以参考代码core/account.py, CoreAccount.customer_auth，生成url的方式可以参考test/unit_test/conftest.py

# 开发指南

## 前端

### 依赖

1. node >= 18
2. npm

``` bash
# for Ubuntu Server 24.04
sudo apt install nodejs npm
```

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
# 1. 执行【部署】的所有步骤
# 2. 复制刚刚编辑好的.env文件到server文件夹
cp deploy/default/.env server/.env
# 3. 以文件挂载方式启动server容器（不需要重新打包）
sudo make debug
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
