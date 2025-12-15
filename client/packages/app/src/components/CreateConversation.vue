<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useChatStore } from '@/stores/chat';
import { useAppsStore } from '@/stores/apps';
import CustomizedIcon from '@/components/CustomizedIcon.vue';

const { t } = useI18n();

const chatStore = useChatStore();

const createConversation = () => {
    console.log('create conversation');
    chatStore.setCurrentConversationId('');
};
</script>

<template>
    <t-tooltip :content="t('conversation.createConversation')">
        <t-button shape="square" variant="text" @click="createConversation">
            <CustomizedIcon name="new_conversation" />
        </t-button>
    </t-tooltip>
</template>

<style scoped></style>
