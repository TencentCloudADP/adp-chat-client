<script setup lang="ts">
import { computed } from 'vue';
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();

const handleClick = () => {
    uiStore.toggleChatAreaDraggable();
};

const iconTheme = computed(() => (uiStore.chatAreaDraggable ? 'primary' : 'base'));
</script>

<template>
    <t-button class="collapse-btn" :theme="iconTheme" variant="text" shape="square" @click="handleClick">
        <template #icon><t-icon name="drag-move" /></template>
    </t-button>
</template>

<style scoped>
.collapse-btn {
    position: absolute;
    top: 50px;
    left: 8px;
    z-index: 10;
}
</style>
