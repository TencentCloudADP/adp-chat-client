# adp-chat-component 组件文档

## 项目信息

| 属性 | 值 |
|------|-----|
| **包名** | `adp-chat-component` |
| **版本** | `0.0.0` |
| **类型** | ES Module |
| **入口文件** | `./dist/adp-chat-component.es.js` (ESM) / `./dist/adp-chat-component.umd.js` (UMD) |
| **主要依赖** | Vue 3.5.22, TDesign Vue Next 1.17.7, @tdesign-vue-next/chat 0.5.0-alpha.10 |

---

## 目录结构

```
adp-chat-component/
├── src/
│   ├── index.ts                 # 主入口，导出所有组件和类型
│   ├── mounters.ts              # 组件挂载器，用于动态挂载组件
│   ├── main.ts                  # Vue 应用入口
│   ├── App.vue                  # 根组件
│   ├── style.css                # 全局样式
│   │
│   ├── components/              # 组件目录
│   │   ├── AIWarning.vue        # AI 警告提示组件
│   │   ├── ApplicationList.vue  # 应用列表组件
│   │   ├── Button.vue           # 按钮组件
│   │   ├── CreateConversation.vue # 新建对话按钮
│   │   ├── CustomizedIcon.vue   # 自定义图标组件
│   │   ├── HistoryList.vue      # 历史会话列表
│   │   ├── LogoArea.vue         # Logo 区域
│   │   ├── PersonalAccount.vue  # 个人账户信息
│   │   ├── Search.vue           # 搜索组件
│   │   ├── Settings.vue         # 设置组件
│   │   ├── SidebarToggle.vue    # 侧边栏切换按钮
│   │   │
│   │   ├── Chat/                # 聊天相关组件
│   │   │   ├── Index.vue        # 聊天主组件 (Chat)
│   │   │   ├── ChatItem.vue     # 聊天消息项
│   │   │   ├── Sender.vue       # 消息发送器
│   │   │   ├── AppType.vue      # 应用类型/欢迎页
│   │   │   └── BackToBottom.vue # 回到底部按钮
│   │   │
│   │   ├── Common/              # 通用组件
│   │   │   ├── FileList.vue     # 文件列表
│   │   │   ├── OptionCard.vue   # 选项卡片
│   │   │   └── RecordIcon.vue   # 录音图标
│   │   │
│   │   └── layout/              # 布局组件
│   │       ├── Index.vue        # 完整布局 (ChatLayout)
│   │       ├── MainLayout.vue   # 主内容区布局
│   │       └── SideLayout.vue   # 侧边栏布局
│   │
│   ├── model/                   # 类型定义
│   │   ├── type.ts              # 通用类型 (ChatConfig, ButtonConfig 等)
│   │   ├── chat.ts              # 聊天相关类型
│   │   ├── application.ts       # 应用类型
│   │   ├── file.ts              # 文件类型
│   │   └── models.ts            # 模型选项
│   │
│   ├── service/                 # 服务层
│   │   ├── index.ts             # 服务导出
│   │   ├── api.ts               # API 请求方法
│   │   └── httpService.ts       # HTTP 服务封装
│   │
│   └── assets/                  # 静态资源
│       ├── icons/               # SVG 图标
│       └── img/                 # 图片资源
│
├── dist/                        # 构建产物
├── public/                      # 公共资源
└── package.json
```

---

## 组件详细文档

### 1. 基础组件

#### AIWarning - AI 警告提示

**描述**: 显示 AI 生成内容的警告提示

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `text` | `string` | `'内容由AI生成，仅供参考'` | 警告文本 |

---

#### Button - 按钮

**描述**: 通用按钮组件

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `type` | `'primary' \| 'secondary' \| 'danger'` | `'primary'` | 按钮类型 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 按钮尺寸 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `loading` | `boolean` | `false` | 是否加载中 |

| Events | 参数 | 说明 |
|--------|------|------|
| `click` | `MouseEvent` | 点击事件 |

| Slots | 说明 |
|-------|------|
| `default` | 按钮内容，默认显示"按钮" |

---

#### ApplicationList - 应用列表

**描述**: 展示和切换应用列表

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `applications` | `Application[]` | `[]` | 应用列表 |
| `currentApplicationId` | `string` | `''` | 当前选中的应用ID |
| `maxAppLen` | `number` | `4` | 最大显示数量 |
| `moreText` | `string` | `'更多'` | "更多"文本 |
| `collapseText` | `string` | `'收起'` | "收起"文本 |

| Events | 参数 | 说明 |
|--------|------|------|
| `select` | `Application` | 选择应用时触发 |

---

#### CreateConversation - 新建对话按钮

**描述**: 新建对话的快捷按钮

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `tooltipText` | `string` | `'新建对话'` | 提示文本 |

| Events | 参数 | 说明 |
|--------|------|------|
| `create` | - | 点击新建时触发 |

---

#### CustomizedIcon - 自定义图标

**描述**: SVG 雪碧图图标组件

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `name` | `string` | **必填** | 图标名称 |
| `size` | `'xs' \| 's' \| 'm' \| 'l' \| 'xl'` | `'m'` | 图标尺寸 |
| `nativeIcon` | `boolean` | `false` | 是否使用原生图标样式（不应用主题滤镜） |
| `showHoverBg` | `boolean` | `true` | hover 是否显示背景色 |
| `theme` | `'light' \| 'dark'` | `'light'` | 主题模式 |

---

#### HistoryList - 历史会话列表

**描述**: 展示聊天会话历史记录

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `conversations` | `ChatConversation[]` | `[]` | 会话列表 |
| `currentConversationId` | `string` | `''` | 当前选中的会话ID |
| `todayText` | `string` | `'今天'` | "今天"文本 |
| `recentText` | `string` | `'最近'` | "最近"文本 |

| Events | 参数 | 说明 |
|--------|------|------|
| `select` | `ChatConversation` | 选择会话时触发 |

---

#### LogoArea - Logo 区域

**描述**: 显示 Logo 和标题

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `logoUrl` | `string` | `''` | Logo 图片 URL |
| `title` | `string` | `''` | 标题文本 |

---

#### PersonalAccount - 个人账户

**描述**: 显示用户头像和名称

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `avatarUrl` | `string` | `''` | 用户头像 URL |
| `avatarName` | `string` | `''` | 用户头像文字（无头像时显示） |
| `name` | `string` | `''` | 用户名称 |

| Events | 参数 | 说明 |
|--------|------|------|
| `click` | - | 点击时触发 |

---

#### Search - 搜索组件

**描述**: 搜索输入框

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `placeholder` | `string` | `'搜索'` | 占位符文本 |

| Events | 参数 | 说明 |
|--------|------|------|
| `search` | `string` | 输入内容变化时触发 |
| `focus` | - | 获得焦点时触发 |
| `blur` | - | 失去焦点时触发 |

---

#### Settings - 设置组件

**描述**: 设置下拉菜单（主题切换、语言选择、退出登录）

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `theme` | `'light' \| 'dark'` | `'light'` | 主题模式 |
| `languageOptions` | `LanguageOption[]` | `[{key:'zh-CN',value:'简体中文'},{key:'en-US',value:'English'}]` | 语言选项列表 |
| `switchThemeText` | `string` | `'切换主题'` | 切换主题文本 |
| `selectLanguageText` | `string` | `'选择语言'` | 选择语言文本 |
| `logoutText` | `string` | `'退出登录'` | 退出登录文本 |

| Events | 参数 | 说明 |
|--------|------|------|
| `toggleTheme` | - | 切换主题时触发 |
| `changeLanguage` | `string` (key) | 切换语言时触发 |
| `logout` | - | 退出登录时触发 |

---

#### SidebarToggle - 侧边栏切换

**描述**: 侧边栏展开/收起切换按钮

| Events | 参数 | 说明 |
|--------|------|------|
| `toggle` | - | 点击时触发 |

---

### 2. Chat 组件

#### Chat (Index.vue) - 聊天主组件

**描述**: 完整的聊天界面，包含消息列表、发送器、分享等功能

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `chatId` | `string` | `''` | 当前会话ID |
| `chatList` | `Record[]` | `[]` | 聊天消息列表 |
| `isChatting` | `boolean` | `false` | 是否正在聊天中 |
| `currentApplicationId` | `string` | `''` | 当前应用ID |
| `currentApplicationAvatar` | `string` | `''` | 当前应用头像 |
| `currentApplicationName` | `string` | `''` | 当前应用名称 |
| `currentApplicationGreeting` | `string` | `''` | 当前应用欢迎语 |
| `currentApplicationOpeningQuestions` | `string[]` | `[]` | 当前应用推荐问题列表 |
| `modelOptions` | `any[]` | `defaultModelOptions` | 模型选项列表 |
| `selectModel` | `any` | `defaultModel` | 当前选中的模型 |
| `isDeepThinking` | `boolean` | `true` | 是否启用深度思考模式 |
| `isMobile` | `boolean` | `false` | 是否为移动端 |
| `theme` | `'light' \| 'dark'` | `'light'` | 主题模式 |
| `i18n` | `object` | 见下方 | 国际化文本 |
| `chatItemI18n` | `object` | 见下方 | ChatItem 国际化文本 |
| `senderI18n` | `object` | 见下方 | Sender 国际化文本 |

**i18n 默认值:**
```typescript
{
    loading: '加载中',
    thinking: '思考中',
    checkAll: '全选',
    shareFor: '分享至',
    copyUrl: '复制链接',
    cancelShare: '取消分享',
    sendError: '发送失败',
    networkError: '网络错误'
}
```

| Events | 参数 | 说明 |
|--------|------|------|
| `send` | `(query, fileList, conversationId, applicationId)` | 发送消息 |
| `stop` | - | 停止生成 |
| `loadMore` | `(conversationId, lastRecordId)` | 加载更多历史消息 |
| `rate` | `(conversationId, recordId, score)` | 评分（点赞/踩） |
| `share` | `(conversationId, applicationId, recordIds)` | 分享消息 |
| `copy` | `(content, type)` | 复制内容 |
| `modelChange` | `option` | 切换模型 |
| `toggleDeepThinking` | - | 切换深度思考模式 |
| `uploadFile` | `File[]` | 上传文件 |
| `startRecord` | - | 开始录音 |
| `stopRecord` | - | 停止录音 |
| `message` | `(type, message)` | 消息提示 |
| `conversationChange` | `conversationId` | 会话变化 |

**Expose 方法:**
- `backToBottom()` - 滚动到底部
- `clearConfirm()` - 清空聊天
- `getSenderRef()` - 获取发送器引用

---

#### ChatItem - 聊天消息项

**描述**: 单条聊天消息的展示

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `item` | `Record` | **必填** | 当前聊天记录项 |
| `index` | `number` | **必填** | 当前项的索引 |
| `isLastMsg` | `boolean` | `false` | 是否为最后一条消息 |
| `loading` | `boolean` | **必填** | 是否正在加载 |
| `isStreamLoad` | `boolean` | **必填** | 是否为流式加载 |
| `showActions` | `boolean` | `true` | 是否显示操作按钮 |
| `isMobile` | `boolean` | `false` | 是否为移动端 |
| `theme` | `'light' \| 'dark'` | `'light'` | 主题模式 |
| `i18n` | `object` | 见下方 | 国际化文本 |

**i18n 默认值:**
```typescript
{
    thinking: '思考中',
    deepThinkingFinished: '深度思考完成',
    deepThinkingExpand: '展开深度思考',
    copy: '复制',
    replay: '重新生成',
    share: '分享',
    good: '点赞',
    bad: '踩',
    thxForGood: '感谢您的反馈',
    thxForBad: '感谢您的反馈',
    references: '参考来源'
}
```

| Events | 参数 | 说明 |
|--------|------|------|
| `resend` | `relatedRecordId` | 重新发送 |
| `share` | `recordIds[]` | 分享 |
| `rate` | `(record, score)` | 评分 |
| `copy` | `(content, type)` | 复制 |
| `sendMessage` | `message` | 发送消息（选项卡片） |

---

#### ChatSender (Sender.vue) - 消息发送器

**描述**: 消息输入和发送组件

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `modelOptions` | `any[]` | `[]` | 模型选项列表 |
| `selectModel` | `any` | `null` | 当前选中的模型 |
| `isDeepThinking` | `boolean` | `true` | 是否启用深度思考模式 |
| `isStreamLoad` | `boolean` | `false` | 是否正在流式加载 |
| `isMobile` | `boolean` | `false` | 是否为移动端 |
| `theme` | `'light' \| 'dark'` | `'light'` | 主题模式 |
| `i18n` | `object` | 见下方 | 国际化文本 |

**i18n 默认值:**
```typescript
{
    placeholder: '请输入您的问题',
    placeholderMobile: '请输入',
    uploadImg: '上传图片',
    startRecord: '开始录音',
    stopRecord: '停止录音',
    answering: '正在回答中...',
    notSupport: '不支持的文件格式',
    uploadError: '上传失败',
    recordTooLong: '录音时间过长'
}
```

| Events | 参数 | 说明 |
|--------|------|------|
| `stop` | - | 停止生成 |
| `send` | `(value, fileList)` | 发送消息 |
| `modelChange` | `option` | 切换模型 |
| `toggleDeepThinking` | - | 切换深度思考模式 |
| `uploadFile` | `File[]` | 上传文件 |
| `startRecord` | - | 开始录音 |
| `stopRecord` | - | 停止录音 |
| `message` | `(type, message)` | 消息提示 |

**Expose 方法:**
- `changeSenderVal(value, files)` - 修改输入框内容
- `addFile(file)` - 添加文件到列表
- `setRecording(value)` - 设置录音状态
- `updateInputValue(value)` - 更新输入值

---

#### ChatAppType (AppType.vue) - 应用欢迎页

**描述**: 展示当前应用的欢迎语和推荐问题

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `currentApplicationAvatar` | `string` | `''` | 当前应用头像 |
| `currentApplicationName` | `string` | `''` | 当前应用名称 |
| `currentApplicationGreeting` | `string` | `''` | 当前应用欢迎语 |
| `currentApplicationOpeningQuestions` | `string[]` | `[]` | 当前应用推荐问题列表 |
| `isMobile` | `boolean` | `false` | 是否为移动端 |

| Events | 参数 | 说明 |
|--------|------|------|
| `selectQuestion` | `question` | 选择推荐问题 |

---

#### BackToBottom - 回到底部按钮

**描述**: 滚动到聊天底部的浮动按钮

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `loading` | `boolean` | `false` | 是否正在加载 |

| Events | 参数 | 说明 |
|--------|------|------|
| `click` | - | 点击时触发 |

---

### 3. Common 组件

#### FileList - 文件列表

**描述**: 展示已上传的文件列表

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `fileList` | `FileProps[]` | **必填** | 文件列表 |
| `onDelete` | `(index: number) => void` | **必填** | 删除回调 |

---

#### OptionCard - 选项卡片

**描述**: 展示可点击的选项卡片列表

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `cards` | `string[]` | **必填** | 选项卡片列表 |
| `sendMessage` | `(text: string) => void` | - | 发送消息回调 |

---

#### RecordIcon - 录音图标

**描述**: 录音状态动画图标

*无 Props*

---

### 4. Layout 组件

#### ChatLayout (layout/Index.vue) - 完整布局

**描述**: 包含侧边栏和主内容区的完整聊天布局，支持 API 模式自动加载数据

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `applications` | `Application[]` | `[]` | 应用列表 |
| `currentApplication` | `Application` | - | 当前选中的应用 |
| `conversations` | `ChatConversation[]` | `[]` | 会话列表 |
| `currentConversation` | `ChatConversation` | - | 当前选中的会话 |
| `chatList` | `Record[]` | `[]` | 聊天消息列表 |
| `isChatting` | `boolean` | `false` | 是否正在聊天中 |
| `user` | `UserInfo` | `{}` | 用户信息 |
| `theme` | `'light' \| 'dark'` | `'light'` | 主题模式 |
| `languageOptions` | `LanguageOption[]` | 默认中英文 | 语言选项列表 |
| `isMobile` | `boolean` | `false` | 是否为移动端 |
| `logoUrl` | `string` | `''` | Logo URL |
| `logoTitle` | `string` | `''` | Logo 标题 |
| `modelOptions` | `any[]` | `[]` | 模型选项列表 |
| `selectModel` | `any` | `null` | 当前选中的模型 |
| `isDeepThinking` | `boolean` | `true` | 是否启用深度思考模式 |
| `maxAppLen` | `number` | `4` | 最大应用显示数量 |
| `showCloseButton` | `boolean` | `false` | 是否显示关闭按钮 |
| `aiWarningText` | `string` | `'内容由AI生成，仅供参考'` | AI警告文本 |
| `createConversationText` | `string` | `'新建对话'` | 新建对话提示文本 |
| `sideI18n` | `object` | - | 侧边栏国际化文本 |
| `chatI18n` | `object` | - | 聊天国际化文本 |
| `chatItemI18n` | `object` | - | ChatItem 国际化文本 |
| `senderI18n` | `object` | - | Sender 国际化文本 |
| `apiConfig` | `ApiConfig` | - | API 配置（传入则启用 API 模式） |
| `autoLoad` | `boolean` | `true` | 是否自动加载数据 |

| Events | 参数 | 说明 |
|--------|------|------|
| `selectApplication` | `Application` | 选择应用 |
| `selectConversation` | `ChatConversation` | 选择会话 |
| `createConversation` | - | 新建会话 |
| `toggleTheme` | - | 切换主题 |
| `changeLanguage` | `key` | 切换语言 |
| `logout` | - | 退出登录 |
| `userClick` | - | 点击用户信息 |
| `close` | - | 关闭 |
| `send` | `(query, fileList, conversationId, applicationId)` | 发送消息 |
| `stop` | - | 停止生成 |
| `loadMore` | `(conversationId, lastRecordId)` | 加载更多 |
| `rate` | `(conversationId, recordId, score)` | 评分 |
| `share` | `(conversationId, applicationId, recordIds)` | 分享 |
| `copy` | `(content, type)` | 复制 |
| `modelChange` | `option` | 切换模型 |
| `toggleDeepThinking` | - | 切换深度思考 |
| `uploadFile` | `File[]` | 上传文件 |
| `startRecord` | - | 开始录音 |
| `stopRecord` | - | 停止录音 |
| `message` | `(type, message)` | 消息提示 |
| `conversationChange` | `conversationId` | 会话变化 |
| `dataLoaded` | `(type, data)` | 数据加载完成 |

| Slots | 说明 |
|-------|------|
| `sider-logo` | 侧边栏 Logo 区域 |

**Expose 方法:**
- `loadApplications()` - 加载应用列表
- `loadConversations()` - 加载会话列表
- `loadConversationDetail(conversationId)` - 加载会话详情
- `loadUserInfo()` - 加载用户信息

---

#### MainLayout - 主内容区布局

**描述**: 聊天主内容区，包含头部、聊天区域和底部警告

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `currentApplicationAvatar` | `string` | `''` | 当前应用头像 |
| `currentApplicationName` | `string` | `''` | 当前应用名称 |
| `currentApplicationGreeting` | `string` | `''` | 当前应用欢迎语 |
| `currentApplicationOpeningQuestions` | `string[]` | `[]` | 当前应用推荐问题列表 |
| `currentApplicationId` | `string` | `''` | 当前应用ID |
| `chatId` | `string` | `''` | 当前会话ID |
| `chatList` | `Record[]` | `[]` | 聊天消息列表 |
| `isChatting` | `boolean` | `false` | 是否正在聊天中 |
| `modelOptions` | `any[]` | `[]` | 模型选项列表 |
| `selectModel` | `any` | `null` | 当前选中的模型 |
| `isDeepThinking` | `boolean` | `true` | 是否启用深度思考模式 |
| `isMobile` | `boolean` | `false` | 是否为移动端 |
| `theme` | `'light' \| 'dark'` | `'light'` | 主题模式 |
| `showSidebarToggle` | `boolean` | `true` | 是否显示侧边栏切换按钮 |
| `aiWarningText` | `string` | `'内容由AI生成，仅供参考'` | AI警告文本 |
| `createConversationText` | `string` | `'新建对话'` | 新建对话提示文本 |
| `i18n` | `object` | - | 国际化文本 |
| `chatItemI18n` | `object` | - | ChatItem 国际化文本 |
| `senderI18n` | `object` | - | Sender 国际化文本 |

| Slots | 说明 |
|-------|------|
| `header-close-content` | 头部关闭按钮区域 |
| `empty-content` | 空内容区域 |

---

#### SideLayout - 侧边栏布局

**描述**: 侧边栏，包含应用列表、会话列表、用户信息和设置

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `visible` | `boolean` | `true` | 是否显示侧边栏 |
| `applications` | `Application[]` | `[]` | 应用列表 |
| `currentApplicationId` | `string` | `''` | 当前选中的应用ID |
| `conversations` | `ChatConversation[]` | `[]` | 会话列表 |
| `currentConversationId` | `string` | `''` | 当前选中的会话ID |
| `userAvatarUrl` | `string` | `''` | 用户头像URL |
| `userAvatarName` | `string` | `''` | 用户头像文字 |
| `userName` | `string` | `''` | 用户名称 |
| `theme` | `'light' \| 'dark'` | `'light'` | 主题模式 |
| `languageOptions` | `LanguageOption[]` | 默认中英文 | 语言选项列表 |
| `isMobile` | `boolean` | `false` | 是否为移动端 |
| `maxAppLen` | `number` | `4` | 最大应用显示数量 |
| `i18n` | `object` | - | 国际化文本 |

| Slots | 说明 |
|-------|------|
| `sider-logo` | Logo 区域 |

---

## 类型定义

### Application
```typescript
interface Application {
    ApplicationId: string;
    Name: string;
    Avatar: string;
    Greeting: string;
    OpeningQuestions: string[];
}
```

### ChatConversation
```typescript
interface ChatConversation {
    Id: string;
    AccountId: string;
    Title: string;
    LastActiveAt: number;
    CreatedAt: number;
    ApplicationId: string;
}
```

### Record
```typescript
interface Record {
    AgentThought?: AgentThought;
    CanFeedback?: boolean;
    CanRating?: boolean;
    Content?: string;
    ExtraInfo?: ExtraInfo;
    FileInfos?: any[];
    FromAvatar?: string;
    FromName?: string;
    HasRead?: boolean;
    ImageUrls?: any[];
    IsFromSelf?: boolean;
    IsFinal?: boolean;
    OptionCards?: string[];
    QuoteInfos?: QuoteInfo[];
    Reasons?: any[];
    RecordId: string;
    References?: Reference[];
    RelatedRecordId?: string;
    ReplyMethod?: number;
    Score?: ScoreValue;
    SessionId?: string;
    TaskFlow?: any;
    Timestamp?: number;
    TokenStat?: TokenStat;
    Type?: number;
    WorkFlow?: WorkFlow;
    Incremental?: boolean;
}
```

### FileProps
```typescript
interface FileProps {
    uid: string;
    url: string;
    name?: string;
    status?: string;
    response?: string;
}
```

### ApiConfig
```typescript
interface ApiConfig {
    applicationListApi?: string;
    conversationListApi?: string;
    conversationDetailApi?: string;
    sendMessageApi?: string;
    rateApi?: string;
    shareApi?: string;
    userInfoApi?: string;
    uploadApi?: string;
}
```

---

## Service 服务

### httpService
HTTP 请求服务，提供 `get`、`post`、`put`、`delete` 方法

### API 方法
- `fetchApplicationList(apiPath?)` - 获取应用列表
- `fetchConversationList(apiPath?)` - 获取会话列表
- `fetchConversationDetail(params, apiPath?)` - 获取会话详情
- `sendMessage(params, options?, apiPath?)` - 发送消息
- `rateMessage(params, apiPath?)` - 评分
- `createShare(params, apiPath?)` - 创建分享
- `fetchUserInfo(apiPath?)` - 获取用户信息
- `uploadFile(file, apiPath?)` - 上传文件

### 配置方法
- `configureAxios(config)` - 配置 axios 实例
- `setRequestInterceptor(onFulfilled?, onRejected?)` - 设置请求拦截器
- `setResponseInterceptor(onFulfilled?, onRejected?)` - 设置响应拦截器

---

## 组件挂载器 (Mounters)

提供动态挂载组件的能力，每个组件都有对应的 Mounter：

```typescript
// 示例
import { ChatLayoutMounter } from 'adp-chat-component'

const id = ChatLayoutMounter.mount('#app', {
    applications: [...],
    theme: 'dark'
})

// 卸载
ChatLayoutMounter.unmount(id)
```

可用的 Mounter:
- `ButtonMounter`
- `AIWarningMounter`
- `ApplicationListMounter`
- `CreateConversationMounter`
- `CustomizedIconMounter`
- `HistoryListMounter`
- `LogoAreaMounter`
- `PersonalAccountMounter`
- `SearchMounter`
- `SettingsMounter`
- `SidebarToggleMounter`
- `ChatMounter`
- `ChatItemMounter`
- `ChatSenderMounter`
- `ChatAppTypeMounter`
- `BackToBottomMounter`
- `OptionCardMounter`
- `RecordIconMounter`
- `ChatLayoutMounter`
- `MainLayoutMounter`
- `SideLayoutMounter`

---

## 快速开始

### 安装

```bash
npm install adp-chat-component
# 或
pnpm add adp-chat-component
```

### 基础使用

```vue
<template>
  <ChatLayout
    :applications="applications"
    :current-application="currentApp"
    :conversations="conversations"
    :current-conversation="currentConversation"
    :chat-list="chatList"
    :user="userInfo"
    theme="light"
    @send="handleSend"
    @select-application="handleSelectApp"
    @select-conversation="handleSelectConversation"
  />
</template>

<script setup lang="ts">
import { ChatLayout } from 'adp-chat-component'
import 'adp-chat-component/dist/style.css'

// ... 你的数据和方法
</script>
```

### API 模式使用

```vue
<template>
  <ChatLayout
    :api-config="apiConfig"
    :auto-load="true"
    @data-loaded="handleDataLoaded"
  />
</template>

<script setup lang="ts">
import { ChatLayout } from 'adp-chat-component'

const apiConfig = {
  applicationListApi: '/api/applications',
  conversationListApi: '/api/conversations',
  conversationDetailApi: '/api/conversation/detail',
  sendMessageApi: '/api/message/send',
  userInfoApi: '/api/user/info'
}
</script>
```

### 动态挂载

```typescript
import { ChatLayoutMounter } from 'adp-chat-component'

// 挂载组件
const instanceId = ChatLayoutMounter.mount('#chat-container', {
  theme: 'dark',
  applications: [...],
  onSend: (query, files, conversationId, appId) => {
    // 处理发送
  }
})

// 卸载组件
ChatLayoutMounter.unmount(instanceId)
```
