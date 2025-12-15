<script setup lang="ts">
import MainLayout from '@/layout/MainLayout.vue'
import SideLayout from '@/layout/SideLayout.vue'
import { onMounted } from 'vue'
import { watch } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useAppsStore } from '@/stores/apps'
import { useChatStore } from '@/stores/chat'
import { fetchUserInfo } from '@/service/user';
import { fetchApplicationInfo } from '@/stores/apps';
import { fetchChatList } from '@/stores/chat';
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
const router = useRouter()
const uiStore = useUiStore()
const route = useRoute()
const appsStore = useAppsStore();
const chatStore = useChatStore();

/**
 * 页面挂载时执行的生命周期钩子
 * 1. 获取用户信息
 * 2. 初始化应用列表
 * 3. 更新聊天列表
 */
onMounted(async () => {
    console.log('[onMounted]');

    // 并发调用，等全部结束
    await Promise.all([
        fetchUserInfo(),
        fetchApplicationInfo(),
        fetchChatList(),
    ]);

    // url参数 -> store
    updateStore();
});

/**
 * 页面url路径、参数处理
 * 1. url参数处理应该在pages层面，不能在组件里读写url参数（组件需要通过store，或者组件参数间接使用url参数）
 * 2. url参数和store应该保持一致，优先级：url参数 > store
 */

// url参数 -> store
const updateStore = () => {
    console.log(`[updateStore] ${route.params.conversationId}, ${route.params.applicationId}`)
    if (!route.params.conversationId) {
        appsStore.setCurrentApplicationId(route.params.applicationId as string);
        chatStore.setCurrentConversationId('');
    } else {
        chatStore.setCurrentConversationId(route.params.conversationId as string);
    }
}
watch(() => route.params.applicationId, (newId, oldId) => updateStore());
watch(() => route.params.conversationId, (newId, oldId) => updateStore());

// url参数 <- store
const updateUrl = () => {
    console.log(`[updateUrl] ${chatStore.currentConversationId}, ${appsStore.currentApplicationId}`);
    if (chatStore.currentConversationId == '') {
        router.push({name: 'app', params: { applicationId: appsStore.currentApplicationId}});
    } else {
        router.push({name: 'home', params: { conversationId: chatStore.currentConversationId}});
    }
}
watch(() => appsStore.currentApplicationId, (newId, oldId) => updateUrl());
watch(() => chatStore.currentConversationId, (newId, oldId) => updateUrl());

</script>

<template>
    <t-layout class="page-container" :class="uiStore.isMobile ? 'isMobile' : 'pc'">
        <t-content class="content">
            <SideLayout />
            <MainLayout />
        </t-content>
    </t-layout>
</template>

<style scoped>
.content {
    height: 100vh;
}
:deep(.custome-drawer .t-drawer__content-wrapper){
    box-shadow: none;
}
</style>
