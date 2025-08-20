import { defineStore } from 'pinia'
import { ref, onMounted, onUnmounted } from 'vue'
import { useEventBus } from './eventBus'
const eventBus = useEventBus()

export const useGroupStore = defineStore('group', () => {
  const activeId = ref('')
  let cleanupFn: () => void

  const init = () => {
    const activeChatHandler = (id: string) => {
      setActiveId('')
    }
    eventBus.on('chat.activeId', activeChatHandler)
    return () => {
      eventBus.off('chat.activeId', activeChatHandler)
    }
  }

  const setActiveId = (id: string) => {
    activeId.value = id
    id && eventBus.emit('group.activeId', id)
  }

  onMounted(() => {
    console.log('group.onMounted')
    cleanupFn = init()
  })

  onUnmounted(() => {
    if (cleanupFn) {
      cleanupFn()
      console.log('取消事件监听')
    }
  })

  return {
    activeId,
    setActiveId,
  }
})
