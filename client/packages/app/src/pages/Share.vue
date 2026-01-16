<template>
  <TLayout class="page-container">
    <!-- 使用 adp-chat-component 的 ShareChat 组件 -->
    <ShareChat 
      v-if="shareId"
      :share-id="shareId"
      @load-error="handleLoadError"
    />
  </TLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Layout as TLayout } from 'tdesign-vue-next';
import { ShareChat } from 'adp-chat-component';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

/**
 * 分享ID
 */
const shareId = ref<string>("");

/**
 * 加载失败处理
 */
const handleLoadError = (error: Error) => {
  console.error('加载分享内容失败:', error);
};

onMounted(() => {
  // 优先从 params 获取 shareId，兼容 query 参数
  const shareIdParam = route?.params?.shareId || route?.query?.ShareId;
  if (shareIdParam) {
    shareId.value = shareIdParam.toString();
  } else {
    // 分享地址有误时跳回首页
    router.push({ name: 'home' });
  }
});
</script>

<style scoped>
.page-container {
  height: 100vh;
}
</style>
