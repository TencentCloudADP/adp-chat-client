# 贡献指南
感谢您对 adp-chat-client 项目的关注与支持！我们欢迎所有形式的贡献，包括提交 Issue 报告问题、提出功能建议，或通过 Pull Request 提交代码改进。请仔细阅读以下指南，以确保您的贡献能够被高效地审查。

## 目录
- [Issue 提交](#issue-提交)
- [Pull request](#pull-request)

## Issue 提交
如果在使用过程中遇到 bug，或者有新的功能需求或改进建议，欢迎通过提交 Issue 来告知我们。在提交 Issue 前，请确保它符合以下所有条件：
1. 该问题是一个 bug 报告，或新功能需求建议
2. 该问题或建议未被其他用户报告过
3. 该问题没有在最新版本中已被修复


### Bug 报告类
请提供以下信息以帮助我们快速定位问题：

1. **问题描述**：简洁清晰地描述遇到的问题
2. **运行环境**：包括但不限于操作系统、设备类型、项目版本等信息
3. **重现问题**：提供重现问题的详细步骤
4. **实际表现**：当前遇到的错误/问题
5. **期望表现**：期望中的正确表现
6. **相关代码**（如有）：如果问题是由特定代码引起的，请提供该代码段或相关错误日志
7. **相关截图**（推荐）：可以提供问题相关截图以便我们更直观地了解问题
8. **建议实现方式**（可选）：如果有解决方案或改进建议，可以附加在此

### 需求建议类
请提供以下信息以帮助我们快速定位问题：

1. **当前现状**：现有功能的不足或缺失
2. **问题描述**：当前设计带来的不便或限制
3. **期望结果**：期望看到的功能或改进后的行为
4. **建议实现方式**（可选）：技术方案或设计思路

## Pull request
如果您有代码上的贡献，欢迎通过 Pull request 提交更改。在提交前，请确保它符合以下条件：
1. 在 Pull requests 列表中没有类似的提交
2. 相关 Issue 已存在（如为功能新增或问题修复）

### PR 流程

### 1. Fork 项目仓库
在我们的 GitHub 主页面点击 `Fork` 按钮，建立您自己的仓库副本。

### 2. 克隆项目仓库到本地
将 fork 下来的仓库克隆到本地：
``` bash
$ git clone git@github.com:<yourname>/adp-chat-client.git
```

### 3. 添加上游仓库
将 fork 源仓库（adp-chat-client）连接到本地仓库:
``` bash
$ git remote add upstream git@github.com:TencentCloud/adp-chat-client.git
```

### 4. 同步远程仓库
确保本地仓库与主仓库保持同步：
``` bash
$ git pull --rebase upstream <branch>
```


### 5. 建立分支
为了避免直接在 `main` 上修改，请遵循 [git flow规范](https://nvie.com/posts/a-successful-git-branching-model/) 建立分支，新组建分支请进入`develop checkout`。
```bash
$ git checkout -b <your-branch-name>
```

### 6. 提交代码 
提交 commit 时，请遵循 Angular Git Commit Message 规范。以下为规范简短介绍，如需更多信息还请查阅 [Angular规范文档](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit?tab=t.0#heading=h.uyo6cb12dt6w)。
#### 提交格式：
```text
<type>(<scope>): <subject>
<空行>
<body>
<空行>
<footer>
```
#### 格式说明
1. Header 部分：
    * \<type>：提交类型，如 feat（新功能）、fix（错误修复）、docs（文档更新）等
    * \<scope>：修改范围，例如模块、组件或文件
    * \<subject>： 简洁的修改描述
2. Body 部分：详细描述修改内容、动机以及与之前行为的对比
3.  Footer 部分：
    * Breaking Changes：列出所有不兼容的改动
    * 关闭/关联 Issue：使用 Closes #123 或 Fixes #456 关闭相关 Issue，使用 Issue #789 关联相关 Issue

#### 示例
```text
feat(auth): 添加用户登录验证

- 新增用户登录 API 接口

Closes #42
```

### 7. push 代码
将修改 push 到 remote 仓库
```bash
$ git push origin <your-branch-name>
```

### 8. 创建 Pull Request
在 GitHub 上进入您的仓库，点击 `New Pull Request`，选择刚才 push 的 branch，并向主仓库提交 Pull Request。请确保您的 Pull Request 能清楚描述解决了什么问题或添加了哪些新功能，并引用相关的 Issue。
