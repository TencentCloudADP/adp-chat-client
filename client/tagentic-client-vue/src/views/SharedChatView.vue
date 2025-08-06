<script setup lang="ts">
import { ref, reactive, computed, watch, onBeforeMount } from 'vue'
import Chat from '@/components/Chat.vue'
import useEventsBus from '@/util/eventBus'
const { emit, bus } = useEventsBus()
import Cookies from 'js-cookie'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

const shareId = ref(undefined as string|undefined)

watch(() => route.params.shareId,
  (newId, oldId) => {
    shareId.value = newId as string|undefined
  },
  { immediate: true }
)

</script>

<template>
  <div class="main">
    <chat :shareId="shareId" />
  </div>
</template>

<style scoped>
.main {
  max-width: 1000px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
