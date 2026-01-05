import { defineStore } from 'pinia'
import mitt from 'mitt'

export const useEventBus = defineStore('eventBus', {
  state: () => ({ emitter: mitt() }),
  actions: {
    emit(event: string, payload?: any) {
      this.emitter.emit(event, payload)
    },
    on(event: string, handler: (payload: any) => void) {
      this.emitter.on(event, handler)
    },
    off(event: string, handler: (payload: any) => void) {
      this.emitter.off(event, handler)
    },
  },
})
