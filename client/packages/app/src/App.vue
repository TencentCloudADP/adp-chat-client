<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, computed } from 'vue'
import { initUI, useUiStore } from '@/stores/ui'
import enConfig from 'tdesign-vue-next/es/locale/en_US'
import zhConfig from 'tdesign-vue-next/es/locale/zh_CN'
const uiStore = useUiStore()

const tDesignLocale = computed(() => {
  console.log(uiStore.language)
  return uiStore.language === 'en' ? enConfig : zhConfig;
});

onMounted(() => {
  initUI();
});

</script>

<template>
  <t-config-provider :global-config="tDesignLocale">
    <RouterView />
  </t-config-provider>
</template>

<style scoped>

.page-container {
  width: 100vw;
  user-select: none;
}
:deep(.t-chat-sender){
  padding:0;
}
:deep(.dropdown-item){
    gap: var(--td-comp-paddingLR-s);
}
/* content自定义 */
:deep(.t-chat__detail-reasoning[role='assistant'] .t-collapse-panel__body){
    background: transparent;
    background-color: transparent;
}
:deep(.t-chat__detail-reasoning[role='assistant'] .t-collapse-panel__wrapper){
    background: transparent;
    background-color: transparent;
}
:deep(.t-chat__detail-reasoning[role='assistant'] .t-collapse-panel__content){
    background: transparent;
    background-color: transparent;
}
:deep(.t-chat__detail-reasoning[role='assistant'] .t-collapse-panel__header--blank){
  display: none;
}
:deep(.t-chat__detail-reasoning[role='assistant'] .t-collapse-panel__icon){
  transform: rotate(180deg);
}
:deep(.assistant .t-chat__detail) {
    max-width: 100%;
    width: 100%;
}
:deep(.isMobile .t-chat__content) {
    margin-left: 0;
}
:deep(.t-chat__detail-reasoning .t-collapse-panel){
  margin-left: 0;
}
:deep(.t-chat__detail-reasoning .t-collapse-panel__header){
  padding: 0;
}
:deep(.t-chat__detail-reasoning .t-collapse-panel__content){
  padding: 0 0 var(--td-comp-paddingTB-m) 0;
}
:deep(.t-chat__text--variant--text .t-chat__detail-reasoning){
  padding-top: 0;
}
</style>
<style>
@keyframes rotate {
from {
transform: rotate(0deg);
}
to {
transform: rotate(360deg);
}
}
.selectable {
  user-select: text;
}
</style>
