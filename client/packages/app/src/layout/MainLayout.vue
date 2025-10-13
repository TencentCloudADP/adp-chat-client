<script setup lang="ts">
import Chat from '@/components/Chat/Index.vue';
import SidebarToggle from '@/components/SidebarToggle.vue';
import AIWarning from '@/components/AIWarning.vue';
import CreateConversation from '@/components/CreateConversation.vue';
import { useUiStore } from '@/stores/ui';
import { useAppsStore } from '@/stores/apps'


const uiStore = useUiStore();
const appsStore = useAppsStore()

</script>

<template>
    <t-layout class="main-layout">
        <t-header class="layout-header">
            <div class="header-app-container">
                <t-avatar shape="round" :image="appsStore.currentApplicationAvatar" size="large"></t-avatar>
                <span class="header-app__title">{{ appsStore.currentApplicationName}}</span>
                
            </div>
            <div class="header-app-settings">
                <!-- <t-icon name="sound" size="20px" /> -->
                <CreateConversation />
                <SidebarToggle v-if="!uiStore.drawerVisible"/>
                <!-- <t-icon name="more" size="20px"  /> -->
            </div>
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
