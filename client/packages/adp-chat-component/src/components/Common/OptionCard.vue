<template>
    <div class="flex gap-2">
        <Button v-for="txt in cards" :key="txt" @click="sendMessage && sendMessage(txt)" shape="round" variant="outline" theme="primary">{{ txt }}</Button>
    </div>
</template>

<script setup lang="ts">
import { Button } from 'tdesign-vue-next';

interface Props {
    /** 选项卡片列表 */
    cards: string[];
    /** 发送消息回调 */
    sendMessage?: (text: string) => void;
}

defineProps<Props>();
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
