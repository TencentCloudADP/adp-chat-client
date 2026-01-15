<template>
  <TLayout class="page-container">
    <!-- 分享聊天内容容器 -->
    <div class="share-container">
      <!-- 聊天组件，用于展示分享的聊天记录 -->
      <TChat ref="chatRef" :reverse="false" style="height: 100%" :clear-history="false">
        <!-- 遍历聊天记录列表，渲染每条消息 -->
        <ChatItem v-for="(item, index) in chatList" :key="item.RecordId" :isLastMsg="index === (chatList.length - 1)" :item="item"
          :index="index" :loading="loading" :isStreamLoad="isStreamLoad" :showActions="false" />
      </TChat>
    </div>
  </TLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Chat as TChat } from '@tdesign-vue-next/chat';
import { Layout as TLayout, LoadingPlugin } from 'tdesign-vue-next';
import { ChatItem, type Record } from 'adp-chat-component';
import { useRoute, useRouter } from 'vue-router';
import { handleLoadConversationDetail } from '@/service/chat';
const router = useRouter();
const route = useRoute();

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
const handleGetConversationDetail = async (shareId: string) => {
  if (!shareId) return
  const loadingInstance = LoadingPlugin({
    attach: '#chat-content',
    size: 'medium',
    showOverlay: false,
  });
  loading.value = true;
  try {
    const ChatConversation = await handleLoadConversationDetail({
      ShareId: shareId
    });
    loading.value = false;
    chatList.value = ChatConversation?.Response.Records;
    loadingInstance.hide();
  } catch {
    loadingInstance.hide();
  }
};

onMounted(async () => {
  // 优先从 params 获取 shareId，兼容 query 参数
  const shareIdParam = route.params.shareId || route.query.ShareId;
  if (shareIdParam) {
    ShareId.value = shareIdParam.toString();
    handleGetConversationDetail(ShareId.value);
  } else {
    // 分享地址有误时跳回首页
    router.push({ name: 'home' });
  }
});
</script>

<style scoped>
/* 分享页面容器样式 */
.share-container {
  padding: var(--td-comp-size-xxs) 10%;
  background-color: var(--td-bg-color-container);
  height: 100vh;
  overflow: auto;
}
</style>
