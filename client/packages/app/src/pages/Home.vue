<script setup lang="ts">
import MainLayout from '@/layout/MainLayout.vue'
import SideLayout from '@/layout/SideLayout.vue'
import { onMounted } from 'vue'
import { fetchUserInfo } from '@/service/user';
import { fetchApplicationInfo } from '@/stores/apps';
import { fetchChatList } from '@/stores/chat';
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

/**
 * 页面挂载时执行的生命周期钩子
 * 1. 获取用户信息
 * 2. 初始化应用列表
 * 3. 更新聊天列表
 */
onMounted(async () => {
    console.log('Query:', route.query.conversationId);
    fetchUserInfo();
    fetchApplicationInfo();
    fetchChatList(route.query.conversationId?.toString());
});

</script>

<template>
    <t-layout class="page-container">
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
</style>
