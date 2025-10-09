<script setup lang="ts">
import Chat from '@/components/Chat/Index.vue';
import SidebarToggle from '@/components/SidebarToggle.vue';
import AIWarning from '@/components/AIWarning.vue';
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();

</script>

<template>
    <t-layout class="main-layout">
        <t-header class="layout-header">
            <SidebarToggle v-if="!uiStore.drawerVisible"/>
        </t-header>
        <t-content class="layout-content">
            <Chat />
        </t-content>
        <t-footer class="layout-footer">
            <AIWarning />
        </t-footer>
    </t-layout>
</template>

<style scoped>
.main-layout {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--td-bg-color-container);
}

.layout-header {
    flex-shrink: 0;
    display: flex;
    padding: var(--td-pop-padding-xl) var(--td-comp-paddingLR-xl);
    justify-content: space-between;
}

.layout-header .header-app-settings svg {
    cursor: pointer;
    margin-left: var(--td-comp-margin-s);
}

.layout-header .header-app__title {
    color: var(--td-text-color-primary);
    font-size: var(--td-font-size-link-large);
    font-weight: 500;
    margin-left: var(--td-comp-margin-s);
}

.layout-content {
    flex: 1;
    overflow: auto;
}

.layout-footer {
    flex-shrink: 0;
    padding: var(--td-pop-padding-l);
}
</style>
