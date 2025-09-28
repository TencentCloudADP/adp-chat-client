<script setup lang="ts">
import { computed } from 'vue';
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();

const handleClick = () => {
    uiStore.toggleDrawer();
};

const iconName = computed(() => (uiStore.drawerVisible ? 'indent-right' : 'indent-left'));
</script>

<template>
    <t-button class="collapse-btn" variant="text" shape="square" @click="handleClick">
        <template #icon><t-icon :name="iconName" /></template>
    </t-button>
</template>

<style scoped>
.collapse-btn {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 10;
}
</style>
