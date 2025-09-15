<template>
  <!-- 分享聊天内容容器 -->
  <div class="share-container">
    <!-- 聊天组件，用于展示分享的聊天记录 -->
    <TChat ref="chatRef" :reverse="false" style="height: 100%" :clear-history="false">
      <!-- 遍历聊天记录列表，渲染每条消息 -->
      <ChatItem v-for="(item, index) in chatList" 
        :isLastMsg="index === (chatList.length - 1)" :item="item"
        :index="index" 
        :loading="loading" 
        :isStreamLoad="isStreamLoad"
        :showActions="false"
        />
    </TChat>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Chat as TChat } from '@tdesign-vue-next/chat';
import { useRoute } from 'vue-router';
import ChatItem from '@/components/Chat/ChatItem.vue';
import type { Record } from '@/model/chat';
import { LoadingPlugin } from 'tdesign-vue-next';
import { handleLoadConversationDetail } from '@/service/chat';

const route = useRoute();
const { t } = useI18n();

/**
 * 分享ID
 * @type {Ref<string>}
 */
const ShareId = ref<string>("");

/**
 * 聊天消息列表（倒序渲染）
 * @type {Ref<Record[]>}
 */
const chatList = ref<Record[]>([]);

/**
 * 聊天加载状态
 * @type {Ref<boolean>}
 */
const loading = ref(false);

/**
 * 是否流式加载中
 * @type {Ref<boolean>}
 */
const isStreamLoad = ref(false);

/**
 * 加载聊天会话详情
 * @param {string} ShareId - 分享ID
 * @returns {Promise<void>}
 */
const handleGetConversationDetail = async (ShareId: string) => {
    if (!ShareId) return;
    const loadingInstance = LoadingPlugin({
        attach: '#chat-content',
        size: 'medium',
        showOverlay: false,
    });
    loading.value = true;
    try {
        const ChatConversation = await handleLoadConversationDetail({
            ShareId: ShareId
        });
        loading.value = false;
        chatList.value = ChatConversation?.Response.Records;
        loadingInstance.hide();
    } catch (err) {
        loadingInstance.hide();
    }
};

onMounted(async () => {
  if (route.query.ShareId) {
    ShareId.value = route.query.ShareId?.toString();
    handleGetConversationDetail(ShareId.value);
  }
});
</script>

<style scoped>
/* 分享页面容器样式 */
.share-container {
  padding: 0 10%;
  background-color: var(--td-bg-color-container);
}
</style>
