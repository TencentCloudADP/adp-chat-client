<script setup lang="ts">
import { computed } from 'vue';
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();

const handleClick = () => {
    uiStore.toggleDrawer();
};

const iconName = computed(() => (uiStore.drawerVisible ? 'indent-left' : 'indent-right'));
</script>

<template>
    <t-button variant="text" shape="square" @click="handleClick">
        <template #icon><t-icon :name="iconName" /></template>
    </t-button>
</template>

<style scoped></style>
