<script setup lang="ts">
interface Props {
    /** 警告文本 */
    text?: string;
}

withDefaults(defineProps<Props>(), {
    text: '内容由AI生成，仅供参考'
})
</script>

<template>
    <div class="chat-component ai-warning">
        {{ text }}
    </div>
</template>

<style scoped>
.ai-warning {
    text-align: center;
    color: var(--td-text-color-placeholder);
    font-size: var(--td-font-size-body-small);
}
</style>
