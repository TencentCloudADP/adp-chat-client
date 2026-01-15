// 默认的 i18n 配置
export const defaultI18n = {
  sideI18n: {
    more: '更多',
    collapse: '收起',
    today: '今天',
    recent: '最近',
    switchTheme: '切换主题',
    selectLanguage: '选择语言',
    logout: '退出登录',
  },
  chatI18n: {
    loading: '加载中...',
    thinking: '思考中...',
    sendError: '发送失败',
    networkError: '网络错误',
  },
  chatItemI18n: {
    thinking: '思考中',
    copy: '复制',
    replay: '重新生成',
    share: '分享',
    good: '有帮助',
    bad: '没帮助',
  },
  senderI18n: {
    placeholder: '请输入问题...',
    uploadImg: '上传图片',
    answering: '回答中...',
  },
}

// 默认的基础配置
export const defaultConfig = {
  theme: 'light' as const,
  aiWarningText: '内容由AI生成，仅供参考',
  createConversationText: '新建对话',
  ...defaultI18n,
}
