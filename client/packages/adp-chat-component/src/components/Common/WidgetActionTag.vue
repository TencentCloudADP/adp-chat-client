<!-- Widget Action 标签组件：显示 "已进行操作" 提示 -->
<template>
  <div class="widget-action-tag">
    <span class="widget-action-text">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  /** 显示文本，默认为 "已进行操作" */
  text?: string;
}>(), {
  text: '已进行操作',
});
</script>

<style scoped>
/* 标签胶囊样式 */
.widget-action-tag {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 0 12px;
  background: var(--td-bg-color-container-hover, #F7F8FA);
  border-radius: 20px;
  width: fit-content;
}

.widget-action-text {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 2em;
  color: var(--td-text-color-placeholder, rgba(1, 11, 50, 0.41));
}
</style>
