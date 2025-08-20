import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateAvatarName } from '@/utils/display'

export const useUserStore = defineStore('user', () => {
  const name = ref('游客')
  const avatarUrl = ref('https://tdesign.gtimg.com/site/chat-avatar.png')

  const avatarName = computed(() => generateAvatarName(name.value))

  function setUserInfo(newName: string, newAvatarUrl: string) {
    name.value = newName
    avatarUrl.value = newAvatarUrl
  }

  function clearUserInfo() {
    name.value = '游客'
    avatarUrl.value = 'https://tdesign.gtimg.com/site/chat-avatar.png'
  }

  return {
    name,
    avatarUrl,
    avatarName,
    setUserInfo,
    clearUserInfo,
  }
})
