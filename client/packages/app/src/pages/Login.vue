<template>
  <div class="login-container">
    <t-card class="login-card">
      <template #title>
        <div class="login-title">{{ $t('account.welcome') }}👋</div>
        <div class="login-title">{{ $t('account.systemName') }}</div>
      </template>
      <div v-for="provider, index in oauthProviders" class="oauth-button-wrapper">
        <t-button variant="outline" size="large" :href="provider['url']">{{ provider['name'] }}</t-button>
      </div>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchLoginProviders } from '@/service/login';

const oauthProviders = ref([])

onMounted(async () => {
  const providers = await fetchLoginProviders();
  console.log('Login Providers:', providers.Providers);
  oauthProviders.value = providers.Providers;
});
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
</style>
