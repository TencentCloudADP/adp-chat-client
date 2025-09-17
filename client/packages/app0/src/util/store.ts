import { reactive } from 'vue'

export const store = reactive({
  isMobile: (window.innerWidth < 512)
})
