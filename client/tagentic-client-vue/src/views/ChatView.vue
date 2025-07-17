<script setup lang="ts">
import { ref, reactive, computed, watch, onBeforeMount } from 'vue'
import Chat from '@/components/ChatWithConversationList.vue'
import useEventsBus from '@/util/eventBus'
const { emit, bus } = useEventsBus()
import Cookies from 'js-cookie'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

const conversationId = ref(undefined as string|undefined)

watch(() => route.params.conversationId,
  (newId, oldId) => {
    conversationId.value = newId as string|undefined
  },
  { immediate: true }
)

watch(conversationId,
  (newId, oldId) => {
    router.push({name: 'chat', params: { conversationId: newId}})
  },
)

const handleLogout = () => {
  emit("login-state-changed", null)
}

</script>

<template>
    <chat v-model:conversationId="conversationId" @logout="handleLogout" />
</template>

<style scoped>
</style>
