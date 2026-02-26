import type { ApiConfig, SideI18n, ChatI18n, ChatItemI18n, SenderI18n, LanguageOption } from 'adp-chat-component'

// 获取 baseURL
export const getBaseURL = (): string => {
  const isDev = import.meta.env.DEV
  return isDev ? '/api' : './'
}

// API 配置
export const apiConfig: ApiConfig = {
  baseURL: getBaseURL(),
  timeout: 1000 * 60,
  apiDetailConfig: {
    applicationListApi: '/application/list',
    conversationListApi: '/chat/conversations',
    conversationDetailApi: '/chat/messages',
    sendMessageApi: '/chat/message',
    rateApi: '/feedback/rate',
    shareApi: '/share/create',
    userInfoApi: '/account/info',
    uploadApi: '/file/upload',
    asrUrlApi: '/helper/asr/url',
    systemConfigApi: '/system/config',
  }
}

// 语言选项
export const languageOptions: LanguageOption[] = [
  { key: 'zh', value: '中文' },
  { key: 'en', value: 'English' },
]

// 侧边栏国际化
export const sideI18n: SideI18n = {
  more: '更多',
  collapse: '收起',
  today: '今天',
  recent: '最近',
  switchTheme: '切换主题',
  selectLanguage: '选择语言',
  logout: '退出登录',
}

// 聊天国际化
export const chatI18n: ChatI18n = {
  loading: '加载中...',
  thinking: '思考中...',
  checkAll: '查看全部',
  shareFor: '分享范围',
  copyUrl: '链接',
  cancelShare: '取消分享',
  sendError: '发送失败',
  networkError: '网络错误',
}

// ChatItem 国际化
export const chatItemI18n: ChatItemI18n = {
  thinking: '思考中',
  deepThinkingFinished: '深度思考完成',
  deepThinkingExpand: '展开思考过程',
  copy: '复制',
  replay: '重新生成',
  share: '分享',
  good: '有帮助',
  bad: '没帮助',
  thxForGood: '感谢您的反馈',
  thxForBad: '感谢您的反馈',
  references: '参考资料',
}

// Sender 国际化
export const senderI18n: SenderI18n = {
  placeholder: '请输入问题...',
  placeholderMobile: '请输入...',
  uploadImg: '上传图片',
  startRecord: '开始录音',
  stopRecord: '停止录音',
  answering: '回答中...',
  notSupport: '不支持',
  uploadError: '上传失败',
  recordTooLong: '录音时间过长',
}
