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
:deep(.t-chat__detail-reasoning .t-collapse-panel__body){
    background: transparent;
    background-color: transparent;
}
:deep(.t-chat__detail-reasoning .t-collapse-panel__wrapper){
    background: transparent;
    background-color: transparent;
}
:deep(.t-chat__detail-reasoning .t-collapse-panel__content){
    background: transparent;
    background-color: transparent;
}
:deep(.t-chat__detail-reasoning .t-collapse-panel__header--blank){
  display: none;
}
:deep(.t-chat__detail-reasoning .t-collapse-panel__icon){
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
:deep(.t-chat.t-chat--normal .t-chat__to-bottom){
  bottom: var(--chat-footer-height, 100px);
}
:deep(.t-chat.isChatting .t-chat__to-bottom){
  position: relative;
}
:deep(.t-chat.isChatting .t-chat__to-bottom::before){
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/icons/loading.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  animation: rotate 2s linear infinite;
  z-index: 2;
  border-radius: 9999px;
}
:deep(.t-chat__text .other__model-change){
  background-color: transparent;
  padding-left:var(--td-comp-paddingTB-s)0;
  text-align: left;
}
:deep(.t-chat__text .other__system){
  background-color: transparent;
  padding-left: var(--td-comp-paddingTB-s);
  text-align: left;
}
/* 自定义滚动条样式 */
@-moz-document url-prefix(){
  :deep(.t-chat__list){
    scrollbar-color:var(--td-scrollbar-color) transparent;
    scrollbar-width: thin;
  }
}
 :deep(.t-chat__list::-webkit-scrollbar ){
    width: var(--td-size-4);
    background: transparent;
}
:deep(.t-chat__list::-webkit-scrollbar-thumb){
    border: 2px solid transparent;
    background-clip: content-box;
    background-color: var(--td-scrollbar-color);
    border-radius: 15px;
}
:deep(.t-chat__list::-webkit-scrollbar-thumb:hover){
    background-color: var(--td-scrollbar-hover-color);
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
/* .narrow-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
} */
/* .narrow-scrollbar::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    background-clip: content-box;
    background-color: var(--td-scrollbar-color);
    border-radius: 15px;
} */

</style>
