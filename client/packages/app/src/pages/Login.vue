<template>
  <t-layout class="page-container">
    <div class="login-container">
      <t-card class="login-card">
        <template #title>
          <div class="login-title">{{ $t('account.welcome') }}👋</div>
          <div class="login-title">{{ $t('account.systemName') }}</div>
        </template>
        <div v-for="(provider, index) in oauthProviders" :key="index" class="oauth-button-wrapper">
          <t-button variant="outline" size="large" :href="provider['url']">{{ provider['name'] }}</t-button>
        </div>
      </t-card>
      <t-dialog
        v-model:visible="showEmptyDialog"
        theme="warning"
        :footer="false"
        placement="center"
        :header="t('header.tip')"
        :on-close="cancelEmptyDialog"
        :cancel-btn="null"
        :closeOnEscKeydown="false"
        :closeOnOverlayClick="false"
      >
      {{ t('login.according')  }} 
      <t-link theme="primary" target="_blank" size="small" href="https://github.com/TencentCloudADP/adp-chat-client/blob/main/README.cn.md#%E8%B4%A6%E6%88%B7%E4%BD%93%E7%B3%BB%E5%AF%B9%E6%8E%A5"> README </t-link>  
      {{ t('login.Guidelines') }}
      </t-dialog>
    </div>
  </t-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
// TDesign 组件由 unplugin-vue-components 自动按需导入
import { fetchLoginProviders } from '@/service/login';
const { t } = useI18n();

const oauthProviders = ref([])
const showEmptyDialog = ref(false);

onMounted(async () => {
  const providers = await fetchLoginProviders();
  if(providers.Providers?.length <= 0){
    showEmptyDialog.value = true;
  }else{
    oauthProviders.value = providers.Providers;
  }
});

const cancelEmptyDialog = () => {
    showEmptyDialog.value = false;
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: var(--td-bg-color-page);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  padding: var(--td-comp-paddingTB-xl) var(--td-comp-paddingLR-xl);
  border-radius: var(--td-radius-large);
  max-width: 90%;
}

.login-title {
  font-size: var(--td-size-10);
  font-weight: 600;
  color: var(--td-text-color-primary);
  line-height: normal;
}

.t-button {
  width: 400px;
}

.oauth-button-wrapper:not(:last-child) {
  margin-bottom: var(--td-comp-margin-l);
}

:deep(.t-card__header),
:deep(.t-card__body) {
  padding: var(--td-comp-paddingTB-m) var(--td-comp-paddingLR-xl);
}
:deep(.oauth-button-wrapper .t-button){
  max-width: 100%;
}
</style>
