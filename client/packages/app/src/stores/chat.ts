import { defineStore } from 'pinia'
import { ref, onMounted, onUnmounted } from 'vue'
import { useEventBus } from './eventBus'
const eventBus = useEventBus()

export const useChatStore = defineStore('chat', () => {
  const activeId = ref('')
  let cleanupFn: () => void

  const init = () => {
    const activeGroupHandler = (id: string) => {
      setActiveId('')
    }
    eventBus.on('group.activeId', activeGroupHandler)
    return () => {
      eventBus.off('group.activeId', activeGroupHandler)
    }
  }

  const setActiveId = (id: string) => {
    activeId.value = id
    id && eventBus.emit('chat.activeId', id)
  }

  onMounted(() => {
    console.log('chat.onMounted')
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
