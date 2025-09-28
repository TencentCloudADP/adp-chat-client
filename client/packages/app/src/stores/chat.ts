import { defineStore } from 'pinia'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { ChatConversation } from '@/model/chat'
import { handleLoadConversations } from '@/service/chat'
import { useAppsStore } from '@/stores/apps'

/**
 * 定义聊天相关的全局状态存储
 */
export const useChatStore = defineStore('chat', () => {
  /**
   * 聊天会话列表
   * @type {Ref<ChatConversation[]>}
   */
  const conversations = ref([] as ChatConversation[])
   /**
   * 是否正在对话聊天过程中
   * @type {Ref<ChatConversation[]>}
   */
  const isChatting = ref(false);
  /**
   * 当前选中的聊天会话
   * @type {Ref<ChatConversation>}
   */
  const currentConversation = ref<ChatConversation>({
    Id: "",
    AccountId: "",
    Title: "",
    LastActiveAt: 0,
    CreatedAt: 0,
    ApplicationId: ""
  })

  /**
   * 当前会话的 ID（计算属性）
   * @type {ComputedRef<string>}
   */
  const currentConversationId = computed(() => currentConversation.value?.Id)

  /**
   * 设置当前聊天会话
   * @param {ChatConversation} detail - 会话详情
   */
  const setCurrentConversation = (detail: ChatConversation) => {
    currentConversation.value = detail
    // 切换对话后，切换默认 appid
    const appsStore = useAppsStore()
    if (detail.ApplicationId) {
      console.log('_currentConversation', detail, appsStore.applications)
      let _currentApplication = appsStore.applications.find((item) => item['ApplicationId'] == detail["ApplicationId"])
      _currentApplication && appsStore.setCurrentApplication(_currentApplication)
    }
  }

  /**
   * 设置聊天会话列表
   * @param {ChatConversation[]} chats - 会话列表
   */
  const setConversations = (chats: ChatConversation[]) => {
    conversations.value = chats
  }

   /**
   * 设置聊天状态
   * @param {boolean} flag - 是否正在对话中
   */
  const setIsChatting = (flag: boolean) => {
    isChatting.value = flag
  }

  onMounted(() => {
    console.log('chat.onMounted')
  })

  onUnmounted(() => {
  })

  return {
    isChatting,
    setIsChatting,
    currentConversationId,
    currentConversation,
    setCurrentConversation,
    conversations,
    setConversations
  }
})

/**
 * 加载聊天会话列表并更新存储
 * @param {string} [Id] - 可选参数，指定当前会话 ID
 * @returns {Promise<void>}
 */
export const fetchChatList = async (Id?: string) => {
  const ChatConversation = await handleLoadConversations()
  const chatStore = useChatStore()
  chatStore.setConversations(ChatConversation)
  if (Id) {
    let _currentConversation = ChatConversation.find((item) => item['Id'] == Id)
    _currentConversation && chatStore.setCurrentConversation(_currentConversation)
  }
}