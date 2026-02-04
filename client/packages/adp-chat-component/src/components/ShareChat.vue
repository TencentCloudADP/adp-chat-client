<template>
  <div class="chat-component share-chat">
    <!-- 聊天组件，用于展示分享的聊天记录 -->
    <TChat ref="chatRef" :reverse="false" style="height: 100%" :clear-history="false">
      <!-- 遍历聊天记录列表，渲染每条消息 -->
      <ChatItem 
        v-for="(item, index) in chatList" 
        :key="item.RecordId" 
        :isLastMsg="index === (chatList.length - 1)" 
        :item="item"
        :index="index" 
        :loading="loading" 
        :isStreamLoad="isStreamLoad" 
        :showActions="false"
        :theme="theme"
      />
    </TChat>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, toRef } from 'vue';
import { Chat as TChat } from '@tdesign-vue-next/chat';
import ChatItem from './Chat/ChatItem.vue';
import { fetchConversationDetail } from '../service/api';
import type { ApiConfig } from '../service/api';
import { useApiConfig } from '../composables';
import type { Record } from '../model/chat';
import type { ThemeType } from '../model/type';

/**
 * ShareChat 组件 Props
 */
interface Props {
  /** 分享ID */
  shareId: string
  /** 主题 */
  theme?: ThemeType
  /** API 配置 - 如果传入则使用 HTTP 请求获取数据 */
  apiConfig?: ApiConfig
  /** 加载完成回调 */
  onLoadComplete?: (records: Record[]) => void
  /** 加载失败回调 */
  onLoadError?: (error: Error) => void
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'light',
  apiConfig: () => ({}),
})

const emit = defineEmits<{
  (e: 'loadComplete', records: Record[]): void
  (e: 'loadError', error: Error): void
}>()

// 使用 composable 统一管理 API 配置
const { mergedApiDetailConfig } = useApiConfig({
  apiConfig: toRef(props, 'apiConfig'),
});

/**
 * 聊天消息列表
 */
const chatList = ref<Record[]>([]);

/**
 * 聊天加载状态
 */
const loading = ref(false);

/**
 * 是否流式加载中（分享页面固定为 false）
 */
const isStreamLoad = ref(false);

/**
 * 加载聊天会话详情
 */
const loadConversationDetail = async (shareId: string) => {
  if (!shareId) return
  
  loading.value = true;
  try {
    const response = await fetchConversationDetail(
      { ShareId: shareId },
      mergedApiDetailConfig.value.conversationDetailApi
    );
    loading.value = false;
    chatList.value = response?.Response?.Records || [];
    
    // 触发回调
    props.onLoadComplete?.(chatList.value)
    emit('loadComplete', chatList.value)
  } catch (error) {
    loading.value = false;
    const err = error instanceof Error ? error : new Error('加载分享内容失败')
    props.onLoadError?.(err)
    emit('loadError', err)
  }
};

// 监听 shareId 变化
watch(() => props.shareId, (newId) => {
  if (newId) {
    loadConversationDetail(newId)
  }
}, { immediate: false })

onMounted(() => {
  if (props.shareId) {
    loadConversationDetail(props.shareId)
  }
});

// 暴露方法供外部调用
defineExpose({
  reload: () => loadConversationDetail(props.shareId),
  chatList,
  loading,
})
</script>

<style scoped>
@import '../styles/chat-overrides.css';
.share-chat {
  background-color: var(--td-bg-color-container);
  height: 100%;
  overflow: auto;
}
.share-chat :deep(.t-chat){
  width: 100%;
}
.share-chat :deep(.t-chat__list) {
  padding: var(--td-comp-size-xxs) 10%;
}
</style>
