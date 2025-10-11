<script setup lang="ts">
const createConversation = () => {
    console.log('create conversation');
};
</script>

<template>
    <t-tooltip :content="$t('conversation.createConversation')">
        <t-button shape="square" variant="text" @click="createConversation"><t-icon name="chat-add" /></t-button>
    </t-tooltip>
</template>

<style scoped></style>
