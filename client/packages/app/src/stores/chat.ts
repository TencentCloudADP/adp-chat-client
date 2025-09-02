import { defineStore } from 'pinia'
import { ref, onMounted, onUnmounted,computed } from 'vue'
import type { ChatConversation } from '@/model/chat'
import { useEventBus } from './eventBus'
import { handleLoadConversations } from '@/service/chat'
const eventBus = useEventBus()

export const useChatStore = defineStore('chat', () => {
  const conversations = ref([] as ChatConversation[])
  const currentConversation = ref<ChatConversation>({
      Id: "",
      AccountId: "",
      Title: "",
      LastActiveAt: 0,
      CreatedAt: 0
  });
  const currentConversationId = computed(() => currentConversation.value?.Id)


  const setCurrentConversation = (detail: ChatConversation) => {
    currentConversation.value = detail
  }
  const setConversations = (chats: ChatConversation[]) => {
    conversations.value = chats
  }

  onMounted(() => {
    console.log('chat.onMounted')
  })

  onUnmounted(() => {
  })

  return {
    currentConversationId,
    currentConversation,
    setCurrentConversation,
    conversations,
    setConversations
  }
})

export const fetchChatList = async (Id?:string) =>{
  const ChatConversation = await handleLoadConversations();
  const chatStore = useChatStore();
  chatStore.setConversations(ChatConversation);
  if(Id){
    let _currentConversation = ChatConversation.find((item) => item['Id'] == Id)
    _currentConversation && chatStore.setCurrentConversation(_currentConversation)
  }
}