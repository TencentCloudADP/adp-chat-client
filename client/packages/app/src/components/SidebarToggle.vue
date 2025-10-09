<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import SidebarIcon from '@/assets/icons/sidebar.svg';

const uiStore = useUiStore();

const handleClick = () => {
    uiStore.toggleDrawer();
};

</script>

<template>
    <t-button variant="text" shape="square" @click="handleClick">
        <template #icon><img :src="SidebarIcon" /></template>
    </t-button>
</template>

<style scoped></style>
