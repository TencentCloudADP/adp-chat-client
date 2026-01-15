<template>
    <div class="flex gap-2">
        <TButton v-for="txt in cards" :key="txt" @click="sendMessage && sendMessage(txt)" shape="round" variant="outline" theme="primary">{{ txt }}</TButton>
    </div>
</template>

<script setup lang="ts">
import { Button as TButton } from 'tdesign-vue-next';

// TButton 已导入，模板中使用 TButton 组件

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
