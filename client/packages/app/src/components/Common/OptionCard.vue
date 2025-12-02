<template>
    <div class="flex gap-2">
        <Button v-for="txt in cards" :key="txt" @click="sendMessage && sendMessage(txt)" shape="round" variant="outline" theme="primary">{{ txt }}</Button>
    </div>
</template>

<script setup lang="ts">
// TDesign UI 组件
import { Button } from 'tdesign-vue-next';

const { cards, sendMessage } = defineProps<{
  cards: string[];
  sendMessage?: (text: string) => void;
}>();
</script>

<style scoped>
.flex {
    display: flex;
    align-items: center;
}
.gap-2 {
    gap: 10px;
}
</style>
