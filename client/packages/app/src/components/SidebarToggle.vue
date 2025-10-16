<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import SidebarIcon from '@/assets/icons/sidebar.svg';
import CustomizedIcon from '@/components/CustomizedIcon.vue';

const uiStore = useUiStore();

const handleClick = () => {
    uiStore.toggleDrawer();
};

</script>

<template>
    <t-button class="sidebar-icon" variant="text" shape="square" @click="handleClick">
            <template #icon>
                <CustomizedIcon showHoverBackground :svg="SidebarIcon" />
            </template>
        </t-button>
</template>

<style scoped>
.sidebar-icon{
    margin-right: var(--td-comp-margin-l);
    padding: var(--td-pop-padding-m);
    border-radius: var(--td-radius-default);
}
.sidebar-icon:hover{
    background-color: var(--td-bg-color-container-active);
}
</style>
