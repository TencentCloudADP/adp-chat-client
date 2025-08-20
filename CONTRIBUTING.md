# 贡献指南
感谢你对 adp-chat-client 项目的关注与支持！我们欢迎所有形式的贡献，包括提交 Issue 报告问题、提出功能建议，或通过 Pull Request 提交代码改进。请仔细阅读以下指南，以确保你的贡献能够被高效地审查。

## 目录
- [Issue 提交](#issue-提交)
- [Pull Request](#pull-request)

## Issue 提交
如果在使用过程中遇到 bug，或者有新的功能需求或改进建议，欢迎通过提交 Issue 来告知我们。在提交 Issue 前，请确保它符合以下所有条件：
1. 是一个 bug 报告，或新需求/改进建议
2. 该问题或建议未被其他用户报告过
3. 该问题未在最新版本中被修复


### 🐛 Bug 报告 Issue
请提供以下信息以帮助我们快速定位问题：

1. **问题描述**：简洁清晰地描述遇到的问题
2. **运行环境**：包括但不限于操作系统、设备类型、项目版本等信息
3. **复现步骤**：提供复现问题的详细步骤
4. **实际表现**：当前遇到的错误/问题
5. **期望表现**：期望中的正确表现
6. **相关代码**（如有）：如果问题是由特定代码引起的，请提供该代码段或相关错误日志
7. **相关截图**（推荐）：可以提供问题相关截图以便我们更直观地了解问题
8. **建议实现方式**（可选）：如果有解决方案或改进建议，可以附加在此

### 📝 需求建议 Issue
请提供以下信息以帮助我们充分评估可行性与优先级：

1. **当前现状**：现有功能的不足或缺失
2. **问题描述**：当前设计带来的不便或限制
3. **期望结果**：期望看到的功能或改进后的行为
4. **建议实现方式**（可选）：技术方案或设计思路

## Pull Request
如果你有代码上的贡献，欢迎通过 Pull Request 提交更改。在提交前，请确保它符合以下条件：
1. 在 Pull Requests 列表中没有类似的提交
2. 相关 Issue 已存在（如为功能新增或问题修复）

### PR 流程

### 1. Fork 项目仓库
在我们的 GitHub 主页面点击 `Fork` 按钮，建立你自己的仓库副本。

### 2. 克隆项目仓库到本地
将 `fork` 下来的仓库克隆到本地：
``` bash
$ git clone git@github.com:<yourname>/adp-chat-client.git
```

### 3. 添加上游仓库
将上游（原始）仓库（upstream）连接到本地仓库：
``` bash
$ git remote add upstream git@github.com:TencentCloudADP/adp-chat-client.git
```

### 4. 同步远程仓库
确保本地仓库与主仓库保持同步：
``` bash
$ git pull --rebase upstream main
```


### 5. 建立分支
为了避免直接在 `main` 上修改，请自行建立分支，推荐使用`dev-xxx`分支命名格式。
```bash
$ git checkout -b <dev-xxx>
```

### 6. 提交代码 
本项目采用 `Conventional Commits` 规范，并通过[**Commitizen**](https://commitizen-tools.github.io/commitizen/)辅助生成并规范化提交信息。

请优先使用 `cz commit` 发起提交，避免直接使用`git commit`。
#### Commitizen 使用指南
1. 根据你的环境选择安装方式：
    * 在项目中安装：
    ```bash
    # 使用 pip 安装
    pip install -U commitizen

    #使用 conda 安装
    conda install -c conda-forge commitizen
    ```
    * 全局安装：
    ```bash
    # 使用 pipx 安装
    pipx install commitizen
    pipx upgrade commitizen

    #使用 uv 安装
    uv tool install commitizen
    uv tool upgrade commitizen

    # 使用 Homebrew 安装（macOS）
    brew install commitizen
    ```
2. `git add`后，使用：
    ```bash
    $ cz commit
    ```
    > Commitizen 会根据仓库中的配置文件引导你完成提交信息填写，请严格按照规范输入。


#### Conventional Commits 规范格式
```text
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
(BREAKING CHANGE: )<footer>
```

#### 格式说明
1. `Header` 部分：
    * `<type>`：提交类型：
        * `fix`: 修复问题
        * `feat`: 新功能
        * `docs`: 文档
        * `style`: 代码格式
        * `refactor`: 重构，非修复或新功能
        * `perf`: 性能优化
        * `test`: 测试
        * `build`: build 系统变更
        * `ci`: config 文件变更
    * `<scope>`：修改范围，例如模块、组件或文件:
        * `client`
        * `server`
        * `deploy`
        * `Makefile`
    * `<subject>`： 简洁的修改描述
2. `Body` 部分：详细描述修改内容、动机以及与之前行为的对比
3.  `Footer` 部分：
    * `BREAKING CHANGE`：列出所有不兼容的改动
    * `关闭/关联 Issue`：使用 `Closes #123` 或 `Fixes #456` 关闭相关 Issue，使用 `Issue #789` 关联相关 Issue

#### 示例
```text
feat(server): 添加用户登录验证

- 新增用户登录 API 接口

Closes #123
```

### 7. push 代码
将修改 push 到 remote 仓库
```bash
$ git push origin <your-branch-name>
```

### 8. 创建 Pull Request
在 GitHub 上进入你的仓库，点击 `New Pull Request`，选择刚才 `push` 的分支，并向主仓库提交 `Pull Request`。请确保你的 `Pull Request` 能清楚描述解决了什么问题或添加了哪些新功能，并引用相关的 `Issue`。

### 9. 同步上游更新
当 PR 已创建，但上游分支有了新的提交时，为减少冲突、保持线性历史，请把你的分支 `rebase` 到最新的上游分支:
```bash
# 确认分支
$ git checkout <your-branch-name>

# 保持与上游同步并 rebase
$ git pull --rebase upstream main

# push
$ git push --force-with-lease origin <your-branch-name>
```
最后，请确认 PR 状态，检查 PR 对应的 `diff` 是否只包含你的预期改动。
