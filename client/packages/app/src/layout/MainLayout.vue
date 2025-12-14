<script setup lang="ts">
import { computed } from 'vue';
import Chat from '@/components/Chat/Index.vue';
import SidebarToggle from '@/components/SidebarToggle.vue';
import AIWarning from '@/components/AIWarning.vue';
import CreateConversation from '@/components/CreateConversation.vue';
import { useUiStore } from '@/stores/ui';
import { useAppsStore } from '@/stores/apps'
import { useChatStore } from '@/stores/chat'
import { storeToRefs } from 'pinia';

const uiStore = useUiStore();
const appsStore = useAppsStore()
const chatStore = useChatStore();

const { applications } = storeToRefs(appsStore);

// 判断是否只有一个应用
const hasSingleApplication = computed(() => applications.value.length <= 1);

// 根据应用数量决定显示的标题
const displayTitle = computed(() => {
  if (hasSingleApplication.value) {
    // 只有一个应用时，显示对话的 Title
    return chatStore.currentConversation.Title || '新对话';
  } else {
    // 有多个应用时，显示应用名称
    return chatStore.currentApplicationName || appsStore.currentApplicationName || '';
  }
});

</script>

<template>
    <t-layout class="main-layout">
        <t-header class="layout-header">
            <div class="header-app-container">
                <SidebarToggle v-if="!uiStore.drawerVisible" />
                <!-- 多个应用时才显示头像 -->
                <t-avatar 
                    v-if="!hasSingleApplication"
                    :imageProps="{
                        lazy: true,
                        loading: ''
                    }" 
                    class="header-app__avatar" 
                    shape="round" 
                    :image="chatStore.currentApplicationAvatar || appsStore.currentApplicationAvatar" 
                    :size="uiStore.isMobile ? 'var(--td-line-height-headline-small)' : 'large'"
                ></t-avatar>
                <span class="header-app__title">{{ displayTitle }}</span>
            </div>
            <div class="header-app-settings">
                <CreateConversation />
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

.layout-header .header-app__avatar{
    border-radius: var(--td-radius-medium);
    margin-left: var(--td-comp-margin-m);
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
.header-app-container{
    display: flex;
    align-items: center;
}
:deep(.t-chat__footer){
    position: relative;
}
:deep(.content .t-chat__content, .content .t-chat__detail-reasoning){
    padding-top: 0;
}
:deep(.content .t-chat__inner){
    margin-bottom: 0;
}
</style>
