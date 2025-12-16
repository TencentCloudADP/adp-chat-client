import { defineStore } from 'pinia'
import { generateAvatarName } from '@/utils/display'
import { t } from '@/i18n'

// 使用Options API语法，Pinia会自动处理state重置
export const useUserStore = defineStore('user', {
  state: () => ({
    id: '',
    name: t('account.defaultName'),
    avatarUrl: '',
  }),

  getters: {
    avatarName: (state) => generateAvatarName(state.name),
  },

  actions: {
    setUserInfo(newId: string, newName: string, newAvatarUrl: string) {
      this.id = newId
      this.name = newName
      this.avatarUrl = newAvatarUrl
    },

    // Pinia会自动将state重置为初始值
    clearUserInfo() {
      this.$reset()
    },
  },
})
