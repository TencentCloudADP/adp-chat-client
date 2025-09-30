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
}
</style>
