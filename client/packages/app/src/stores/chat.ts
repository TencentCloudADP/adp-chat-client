import { defineStore } from 'pinia'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { ChatConversation } from '@/model/chat'
import { handleLoadConversations } from '@/service/chat'
import { useAppsStore } from '@/stores/apps'
import { useUiStore } from '@/stores/ui'
import type { Application } from '@/model/application'

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
  const currentApplication = ref<Application>();
  const currentApplicationId = computed(() => currentConversation.value?.ApplicationId)
  const currentApplicationAvatar = computed(() => currentApplication.value?.Avatar)
  const currentApplicationName = computed(() => currentApplication.value?.Name)
  const currentApplicationGreeting = computed(() => currentApplication.value?.Greeting)
  const currentApplicationOpeningQuestions = computed(() => currentApplication.value?.OpeningQuestions)


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
    const uiStore = useUiStore()
    // 切换对话时，如果是移动端，自动收起侧边栏
    if(uiStore.isMobile){
     uiStore.setDrawerVisible(false);
    }
    if (detail.ApplicationId) {
      let _currentApplication = appsStore.applications.find((item) => item['ApplicationId'] == detail["ApplicationId"])
      _currentApplication && appsStore.setCurrentApplication(_currentApplication)
      _currentApplication && setCurrentApplication(_currentApplication)
    }
  }

  /**
   * 设置当前聊天会话Id
   * @param {string} conversationId - 应用Id
   */
  const setCurrentConversationId = (conversationId: string|undefined) => {
    const chatStore = useChatStore()
    const appsStore = useAppsStore()

    let conversation
    if (!conversationId) {
      conversation = {
        Id: "",
        AccountId: "",
        Title: "",
        LastActiveAt: 0,
        CreatedAt: 0,
        ApplicationId: appsStore.currentApplicationId || ''
      }
    } else {
      conversation = chatStore.conversations.find((item) => item['Id'] == conversationId)
    }
    conversation && chatStore.setCurrentConversation(conversation)
  }

  /**
   * 设置聊天会话列表
   * @param {ChatConversation[]} chats - 会话列表
   */
  const setConversations = (chats: ChatConversation[]) => {
    conversations.value = chats
  }

  /**
   * 设置当前应用
   * @param {Application} newApp - 新的应用选项
   */
  const setCurrentApplication = (newApp: Application) => {
    currentApplication.value = newApp;
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
    currentApplication,
    currentApplicationId,
    currentApplicationAvatar,
    currentApplicationName,
    currentApplicationGreeting,
    currentApplicationOpeningQuestions,
    currentConversationId,
    currentConversation,
    setCurrentConversation,
    setCurrentConversationId,
    conversations,
    setConversations,
    setCurrentApplication
  }
})

/**
 * 加载聊天会话列表并更新存储
 * @returns {Promise<void>}
 */
export const fetchChatList = async () => {
  const ChatConversation = await handleLoadConversations()
  const chatStore = useChatStore()
  chatStore.setConversations(ChatConversation)
}