## v0.6.0 (2026-07-03)

### Feat

- **tca**: 引入 ServiceVendor 多场景路由，支持 ChinaTencentCloud / ChinaTencentADP / International / Private 四种场景，替代原有的 International/Private 标志；将 action_version.json 拆分为按 ServiceVendor 命名的独立配置文件，灵活控制不同场景的接口路由、版本与区域
- **tca**: 新增 `ADP_SECRET_ID` / `ADP_SECRET_KEY` 环境变量，ADP 独立站场景优先使用独立密钥，未配置时回退 `TC_SECRET_*`
- **client**: 知识库（Knowledge Base）管理功能
- **client**: 知识库 `@mention` 输入支持
- **client**: 快捷模板（SUGGESTION_CONFIGS）配置：对话页输入框上方展示可点击的建议按钮
- **client**: 升级插件接口 ListPlugins → DescribePluginSummaryList，并完善英文 i18n
- **server**: 新增日志文件轮转（log rotation）并处理客户端断开连接

### Fix

- **db**: 修复数据库连接池泄漏及资源未正确释放问题
- **server**: 修复分享（sharing）失败问题
- **client**: 修复 deploy 模式下 `SUGGESTION_CONFIGS` 多行值因内部半角单引号被 dotenv 截断、导致快捷按钮为空的问题
- **client**: 修复 `@mention` 面板知识库列表展示异常
- **fix**: 修复 `X-TC-Version` 版本优先级逻辑（入参 > action 配置 > 不带）及聊天列表/文件面板的 UI 样式
- **chat**: 新增微信小程序接入文档及功能开关（知识库 / Skills / 模型选择器 / 连接器 / 工具的 `enable*` 开关）

### Style

- **chat**: 优化聊天组件视觉样式与交互细节

### Config

新增/调整的 `.env` 配置项：

- `SUGGESTION_CONFIGS`：快捷按钮（quick template）配置，多行 JSON 使用单引号 `'…'` 包裹；JSON 内部禁止出现半角单引号 `'`，需用中文全角引号 `"…"`，`PromptContent` 支持 `@skill:` / `@knowledgeBase:` / `@tool:` mention 语法（连接器与工具共用 `@tool:` 前缀）
- `ServiceVendor`：应用级字段，取值 `ChinaTencentCloud`（默认）/ `ChinaTencentADP` / `International` / `Private`
- `ADP_SECRET_ID` / `ADP_SECRET_KEY`：ADP 独立站专用密钥，获取地址 https://adp.tencent.com/adp#/key-manage

### Docs

- 补充 ADP 独立站（ChinaTencentADP）配置指南及密钥获取说明（含密钥管理页面截图）
- 更新 `SUGGESTION_CONFIGS` 示例（含 `@skill` 引用与全角引号用法）

## v0.5.0 (2026-06-26)

### Feat

- **client**: 新增 Skills 管理功能——SkillsPopover、SkillsInstallDialog、SkillManageDialog
- **client**: 新增 useSkills composable 用于 Skills 状态管理
- **client**: 新增 skillsApi 服务用于 Skills 的 CRUD 操作
- **client**: 将 Skills 功能集成进 Chat/Sender.vue 作为可选附加按钮
- **server**: 新增 /skills/<action> 路由，用于转发 Skills API 请求到 ADP vendor

### API

- `POST /skills/global-agent` → DescribeGlobalCorpAssistantAgent（获取全局 Agent 配置及已安装 Skills）
- `POST /skills/categories` → DescribeSkillCategoryList（获取 Skill 分类列表）
- `POST /skills/summary-list` → DescribeSkillSummaryList（获取技能广场列表）
- `POST /skills/detail` → DescribeSkillDetail（获取 Skill 详情）
- `POST /skills/create` → CreateSkill（安装 Skill）
- `POST /skills/delete` → DeleteSkill（卸载 Skill）

## v0.4.0 (2026-04-16)

### Feat

- **client**: 新增 widget 支持
- **client**: 新增详情引用预览
- **client**: 为 widgets 增加交互操作能力
- **client**: 为 widget 配置新增自定义 path 参数
- **client**: 实现对话流 widget 的懒加载
- **client**: 在切换会话时保持 SSE 流不断开
- **server**: 新增 SERVER_RESPONSE_TIMEOUT 配置项控制服务端超时
- **server**: 新增 iframe 来源策略与跨站 cookie 鉴权联动
- **vendor**: 腾讯云 ADP 使用客户账号 id 作为 visitor_biz_id
- **example**: 新增 vue-component-example
- **dev**: 新增本地 PostgreSQL dev_withdb 工作流

### Fix

- **client**: 升级 vite 版本
- **client**: 优化 widget 包引入方式，修复子路径部署下加载失败问题
- **client**: 在新标签页打开 markdown 链接
- **client**: 允许 markdown 内容中的 video 标签
- **client**: 修复聊天历史重载的边界情况
- **server**: 新增 heartbeat 与 sock_read 设置防止超时
- **server**: 在 create_app 中加载 env 文件
- **component**: 修复 currentConversationId props
- **component**: 修复构建问题
- **vendor**: 移除思考文本中混入的多余 json
- **pack**: 放宽 python 版本约束以解决打包失败
- **pack**: 修复 make pack 过程中的内存溢出问题

### Refactor

- **protocol**: 迁移到 ADP chat 协议 v2

### Perf

- **server**: 提升对话响应体验的流畅度

## v0.3.1 (2026-02-26)

### Feat

- **client**: 接入 system/config API 以控制录音显示
- **server**: 新增获取系统配置的接口

### Fix

- **client**: 补充录音失败错误提示的英文翻译
- **client**: 对齐 UI 设计规范并修正英文模式提示
- **vendor**: 因上游接口问题禁用增量响应
- **vendor**: 修复私有云下的文件上传器
- **server**: 修复 get_remote_ip，使限流器正常工作
- **server**: 提高默认数据库连接池大小
- **server**: 重构聊天流中的 DB 使用为带异步上下文管理器的短生命周期会话

## v0.3.0 (2026-02-04)

### Feat

- **client**: 将 isSidePanelOverlay 值与新的默认值同步
- **client**: 调整 isSidePanelOverlay 默认值
- **client**: 重命名全屏并修复样式不一致
- **client**: 修复 HTML 示例样式，重构 props 命名并清理未使用属性
- **client**: 新增框架示例并增强 UI 展示
- **client**: 调整 props，增强文档，修复交互，并新增 React 示例
- **client**: 降级 TDesign 版本并更新接口定义
- **client**: 更新 HTML 与 React 示例以提升清晰度与最佳实践
- **client**: 简化 demo 并修复 TDesign 样式一致性
- **client**: 降低圈复杂度并抽取共享组件接口
- **client**: 迁移到基于组件的架构并新增框架示例
- **client**: 增强 ChatList 组件的性能与功能
- **client**: 更新快速开始指南并清理未使用的基础组件
- **client**: 迁移组件库文档并修复 KaTeX CDN
- **client**: 新增组件模式及 demo，更新文档并升级依赖
- **adp-chat-component**: 提供更简单的嵌入方式
- **adp-chat-component**: 新增 adp-chat-component，允许用户将聊天框嵌入现有网页
- **vendor:adp**: 新增 ADP 私有云支持
- **server**: 新增第三方账号查询，并在可用时支持在自定义变量中使用 OpenId 的文档
- **server**: 新增 CORS 配置

### Fix

- **client**: 移动端应用信息居中对齐
- **client**: 修复构建过程中的类型错误
- **client**: 增强上传状态并优化移动端 UI 展示
- **client**: 修复登录页布局问题并集成分享组件
- **client**: 修复编译错误，新增分享组件并实现代码分析
- **client**: 修复生产构建中的编译错误
- **client**: 调整菜单栏宽度以对齐布局
- **client**: 修复编译错误与应用导航问题
- **client**: 降低圈复杂度并抽取共享组件接口
- **client**: 修复因 vue 默认导入导致的构建问题
- **app**: 在 /account/info 路由中实现 AUTO_CREATE_ACCOUNT
- **example**: 更新默认参数
- **example**: 修复 html 示例并简化所有示例中的全屏模式布局
- **example**: 修复 vue-init-example 的构建问题
- **adp-chat-component**: 移除不应提交到 git 的文件，并从聊天组件移除仅开发用的自动初始化代码块
- **adp-chat-component**: 修复 Props 导出的类型错误 TS4023
- **adp-chat-component**: 新增类型导出，修复构建问题
- **pack**: 修复构建顺序
- **makefile**: 将组件示例加入 make dev target
- **makefile**: 新增 build_component target
- **makefile**: 修复 make dev 问题
- **vendor**: 通过提高流式分块大小上限修复 "chunk too big" 错误
- **server**: 在 /account/info 路由中实现 AUTO_CREATE_ACCOUNT（替代静态文件路由）

### Refactor

- **adp-chat-component**: 生成排除 Vue 和 TDesign 的 ES bundle，同时提供包含全部依赖、供浏览器使用的 UMD bundle

## v0.2.1 (2025-12-19)

### Feat

- **deploy**: 启动时若 SECRET_KEY 为空则自动生成
- **server**: 新增 Microsoft Entra ID 的 endpoint 配置支持
- **server**: 新增自动为新用户创建账号的选项
- **server**: 新增流量限流
- **client**: 新增 OptionCards 支持
- **client**: 聊天时显示错误信息
- **client**: 将图标迁移至 sprite 并修复 retax 布局溢出
- **client**: 优化移动端响应式与 markdown 引用渲染
- **vendor**: 结构化存储内容以包含 ReasoningContent、RelatedId 等信息

### Fix

- **server**: 在 connect_with_retry 中抛出原始异常
- **client**: 在 AccountUnauthorized 时清除 cookie 并登出
- **deploy**: 机器启动时自动运行 pod
- **server**: 在 BaseError 中调用 super init
- **server**: 修复限流获取远程 IP 的方式
- **client**: 修复 url 参数与 store 的关系，前进后退现在正常工作
- **docs**: 升级 React 和 Next.js 以修复安全漏洞
- **docs**: 修复文档中的开发命令
- **docs**: 修复 Node.js v25 兼容性并改进 Mermaid 安全性
- **mermaid**: 设置 securityLevel 为 strict 以防止 XSS
- **client**: 读取前先校验 key 是否存在
- **deploy**: 部署前检查 .env 文件
- **server**: 当 'Vender' 配置未找到时记录错误日志
- **vendor**: 获取应用信息失败时的兜底处理
- **client**: 修正思考模式展开的数据类型定义
- **config**: 移除不必要的 vite 配置兜底
- **vendor**: OpenAI 兼容 vendor 拉取记录的分页逻辑错误
- **vendor**: 错误消息发送方式错误
- **vendor**: 禁用评分按钮
- **vendor**: 修复 openai 兼容 vendor 错误使用 SharedConversation
- **remove-uncessary-docs**: 移除不必要的文档
- **client**: 客户端调试脚本

### Refactor

- **server**: 将 oauth providers 拆分为独立类
- **vendor**: 减少代码冗余
- **vendor**: 在 OpenAI 兼容模型的配置中使用 DisplayName 而非 Comment

## v0.2.0 (2025-10-17)

### Feat

- **client**: 调整对话框间距与图标尺寸
- **client**: 修正 AI 描述文案
- **client**: 增强鉴权流程与 UI 一致性
- **client**: 实现可滚动的图片上传画廊
- **client**: 修复关键交互问题并实现 UI 改进
- **client**: 增强录音与分享体验
- **client**: 增强分享 UX 与输入处理
- **client**: 新增创建会话按钮
- **client**: 实现设置菜单
- **client**: 新增图标文件夹
- 新增 github action
- 更新 star history
- 在 readme 中新增 star history

### Fix

- **client**: 修复语音按钮显示问题
- **client**: 重定位滚动到底部按钮并清理依赖
- **client**: 清理调试日志并调整标签尺寸
- **client**: 修正复制按钮文本
- **client**: 修复暗色模式下的按钮可见性
- **client**: 修复文件上传失败场景
- **client**: 为 handleDeleteFile 函数新增 index 参数
- **client**: 移除未使用的 import
- **client**: 新增应用列表折叠
- 更新视频 url
- **client**: 修复若干 UI 问题

### Refactor

- **client**: 重构 chat item
- **client**: 更改 TD 图标的导入方式
- **client**: 隐藏项目标题
- **client**: 重构 isMobile 函数
- **client**: 修改若干 UI
- **client**: 移除未使用的组件
- **client**: 重构个人账号
- **client**: 在侧边栏新增应用列表
- **client**: 重构侧边栏 UI
- **client**: 重构若干组件 UI
- **client**: 重构 UI 布局
- **client**: 重构登录页 UI
- **server**: 使用 pyproject.toml 与 uv 管理虚拟环境

### Perf

- **client**: 减少重复 CSS 代码

## v0.1.0 (2025-09-29)

### Feat

- **client**: 修复加载展示问题
- **client**: 新增 logo
- **client**: 优化登录页
- **server**: 生成登录 url 的脚本
- **client**: 新增 markdown 样式
- **client**: 新增多模态输入并增强内容展示
- **client**: 完成用户交互并实现深度思考内容展示
- **client**: 新增用户信息获取逻辑
- **client**: 隐藏会话分组列表
- **client**: 为 user 消息新增悬停显示的复制按钮
- **client**: 新增 AI 生成回答免责声明
- **client**: 实现 i18n 基础设施以支持前端动态语言切换
- **client**: 实现 agent 会话创建与时间排序列表
- **client**: 为 Vite 新增动态 IP 配置
- **client**: 移除 AreaToggle 组件
- **client**: 新增 AppType 组件用于 agent 应用类型选择与初始化
- **client**: 支持通过 5174 端口启动文档开发
- **client**: 在前端代码库中集成 OAuth 鉴权状态

### Fix

- **deploy**: 修复打包与部署问题
- **deploy**: 修复 init 脚本
- **client**: 修复加载问题
- **client**: 更新 logo
- **Makefile**: 修复打包流程
- **client**: 修复 TypeScript 类型规范问题
- **client**: 修复展示不一致并实现徽标指示器
- **client**: 修正多处 UI 展示问题
- **client**: 修正多处 UI 展示问题
- **client**: 优化滚动性能与加载行为
- **client**: 移除未使用的方法与文件
- **client**: 修复 markdown 渲染与思考状态指示器
- **client**: 增强 AI 响应展示与图片上传能力
- **client**: 无问候语时隐藏双引号
- **client**: 修复 stylelint 问题
- **Makefile**: 修复打包流程
- **client**: 改进打包流程
- **client**: 预发布检查
- **server**: 预发布检查
- **client**: 修复登出问题
- **client**: 修复聊天展示问题与 Safari 兼容性
- **client**: 移除 logo
- **client**: 清理未使用的依赖
- **client**: 修复 KaTeX 样式导致的滚动条问题
- **client**: 增强 markdown 主题并修复链接跳转
- **client**: 新增 js-cookie 依赖
- **client**: 清理依赖并修复构建问题
- **client**: 条件渲染思考容器并优化聊天气泡样式
- **client**: 修复图片上传换行渲染
- **client**: 修复符号链接问题
- **client**: 合并 main 分支后更新符号链接
- **client**: 修复新建会话并新增聊天状态指示器
- **client**: 增强按钮样式与分享默认值
- **client**: 细化分享与取消按钮的点击区域
- **client**: 修复生产环境 API base URL 路径计算 bug
- **client**: 将生产环境 API base URL 从绝对路径改为相对路径
- **client**: 修复部分内容缺失国际化（中文）
- **client**: 修正消息发送时的骨架屏展示
- **client**: 将 AppType 组件协议更新为最新字段

### Refactor

- **client**: 隐藏未实现的功能
- **client**: 新增基于 TDesign 组件开发的前端代码版本

### Perf

- **client**: 更新主题配置

## v0.0.4 (2025-09-28)

### BREAKING CHANGE

- 聊天协议变更
- 聊天协议变更
- .env 配置格式变更

### Feat

- **client/app0**: 仅配置一个应用时隐藏应用选择器
- **client/app0**: 删除会话
- **server**: 删除会话
- **server**: 账号信息 api

### Fix

- **deploy**: 构建/部署错误
- **server**: 重定向 url 问题
- **server**: 重定向 url 问题
- **client/app**: 云 API 修复后，使用正确的 IsFromSelf 属性判断说话方
- **client/app0**: 登出功能不可用
- **server**: 与 workflow 应用对话时崩溃
- **.env.example**: 拼写错误
- **client/app**: 思考时未展示加载状态
- **client/app**: iOS 设备页面异常跳动
- **client/app**: 上传文件时设置文件类型
- **server**: 上传文件时的文件类型参数
- **client/app**: agent 回复后评分按钮被禁用
- **server**: 细化 vendor 接口的数据结构
- **server**: 默认配置问题
- **server**: 将分享与评分代码移至 vendor 类
- **server**: 清理未使用代码
- **server**: 自动导入 vendor 类
- **client/app**: 思考消息响应问题
- **server**: 思考消息问题
- **client/app**: 思考框响应问题
- **client/app**: 表格渲染样式
- **client/app**: 在分享页隐藏推荐问题按钮
- **client/app**: 多次思考过程切换时思考框错误消失
- **client/app**: 移动端分享页宽度溢出
- **client/app**: 未展示"workflow 中配置的回复"
- **client/app**: 修复思考框布局问题

### Refactor

- **client**: 将 client app 移入 packages 以符合 monorepo 风格
- **server**: 将文件上传代码移至 vendor 类
- **server**: 重新组织服务配置
- **client/app**: 调整 record 结构以对齐后端重构
- **server**: 完成 vendor 接口 chat 部分，并将 chat 协议数据结构中的 key 统一为 CamelCase 以对齐其他 API
- **client/app**: 调整 application 结构以对齐后端重构
- **server**: 抽象 'vendor' 接口，将腾讯云 ADP 相关 API 调用与核心代码解耦

## v0.0.3 (2025-08-08)

## v0.0.2 (2025-07-10)

## v0.0.1 (2025-06-19)
