<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useChatStore } from '@/stores/chat';
import { useAppsStore } from '@/stores/apps'
const router = useRouter();
const { t } = useI18n();

const chatStore = useChatStore();
const appsStore = useAppsStore()

const createConversation = () => {
    console.log('create conversation');
    router.push({ name: 'Home' })
    chatStore.setCurrentConversation({
        Id: "",
        AccountId: "",
        Title: "",
        LastActiveAt: 0,
        CreatedAt: 0,
        ApplicationId: appsStore.currentApplicationId || '' 
    });
};
</script>

<template>
    <t-tooltip :content="$t('conversation.createConversation')" theme="primary">
        <t-button shape="square" variant="text" @click="createConversation"><t-icon name="chat-add" /></t-button>
    </t-tooltip>
</template>

<style scoped></style>
