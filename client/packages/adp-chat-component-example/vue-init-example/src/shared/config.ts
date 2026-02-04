// 默认的基础配置
// 注意：不要传入 sideI18n/chatI18n 等 i18n 配置，让组件内部根据语言自动选择
export const defaultConfig = {
  theme: 'light' as const,
  aiWarningText: '内容由AI生成，仅供参考',
  createConversationText: '新建对话',
}
