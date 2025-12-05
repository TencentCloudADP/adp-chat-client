<template>
  <t-layout class="page-container">
    <div class="login-container">
      <t-card class="login-card">
        <!-- 不在单点登录中，显示欢迎语及系统标题 -->
        <template #title v-if="!isRedirecting">
          <div class="login-title login-title--left">{{ $t('account.welcome') }}</div>
          <div class="login-title login-title--left login-subtitle">{{ $t('account.systemName') }}</div>
        </template>
        <!-- 有多个 Provider 时，显示 OAuth 登录按钮 -->
        <div v-if="oauthProviders.length > 1">
          <div v-for="provider, index in oauthProviders" :key="index" class="oauth-button-wrapper">
            <t-button variant="outline" size="large" :href="provider['url']">{{ provider['name'] }}</t-button>
          </div>
        </div>
        <!-- 只有一个 Provider 时，正在单点登录中，显示 Loading -->
        <div v-else-if="isRedirecting" class="login-loading">
          <t-loading size="large" />
          <div class="login-loading-text">
            {{ t('common.loading') }}
          </div>
        </div>
        <!-- 没有配置 Provider ，使用用户名/密码登录表单 -->
        <div v-else class="login-form">
          <t-form 
            :data="loginForm" 
            :rules="rules" 
            ref="formRef" 
            @submit="handleLogin"
            :labelWidth="0"
            class="login-form-wrapper"
          >
            <t-form-item name="email">
              <t-input
                v-model="loginForm.email"
                :placeholder="$t('account.inputEmail')"
                size="large"
                clearable
                class="login-input"
              />
            </t-form-item>
            <t-form-item name="password">
              <t-input
                v-model="loginForm.password"
                type="password"
                :placeholder="$t('account.inputPassword')"
                size="large"
                clearable
                class="login-input"
                @keyup.enter="handleLogin({ validateResult: true })"
              />
            </t-form-item>
            <t-form-item class="login-button-wrapper">
              <t-button
                theme="primary"
                size="large"
                block
                type="submit"
                :loading="isLoading"
                class="login-button"
              >
                {{ $t('account.login') }}
              </t-button>
            </t-form-item>
          </t-form>
          <t-alert
            v-if="errorMessage"
            theme="error"
            :message="errorMessage"
            :close="true"
            @close="errorMessage = ''"
            class="login-error-alert"
          />
        </div>
      </t-card>
    </div>
  </t-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { fetchLoginProviders, login } from '@/service/login';
import type { FormInstanceFunctions, FormRule } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';

const { t } = useI18n();
const router = useRouter();

const oauthProviders = ref([])
const formRef = ref<FormInstanceFunctions>();
const isLoading = ref(false);
const isRedirecting = ref(false);
const errorMessage = ref('');

const loginForm = ref({
  email: '',
  password: '',
});

const rules: Record<string, FormRule[]> = {
  email: [
    { required: true, message: t('account.inputEmail'), type: 'error' },
    { email: true, message: t('common.invalidEmail'), type: 'error' },
  ],
  password: [
    { required: true, message: t('account.inputPassword'), type: 'error' },
  ],
};

onMounted(async () => {
  try {
    const providers = await fetchLoginProviders();
    if(providers.Providers?.length <= 0){
      // 不再显示空对话框，而是显示登录表单
      oauthProviders.value = [];
    } else if(providers.Providers?.length === 1){
      // 如果只有一个 Provider，显示 Loading 并跳转
      isRedirecting.value = true;
      setTimeout(() => {
        window.location.href = providers.Providers[0].url;
      }, 100);
    } else {
      // 多个 Provider，显示按钮列表
      oauthProviders.value = providers.Providers;
    }
  } catch (error) {
    console.error('获取登录方式失败:', error);
    // 如果获取失败，也显示登录表单
    oauthProviders.value = [];
  }
});

const handleLogin = async ({ validateResult }: any) => {
  if (validateResult !== true) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    await login(loginForm.value.email, loginForm.value.password);
    MessagePlugin.success(t('account.loginSuccess'));
    // 登录成功后跳转到首页
    setTimeout(() => {
      router.push({ name: 'Home' });
    }, 300);
  } catch (error: any) {
    errorMessage.value = error.message || t('account.loginFailed');
  } finally {
    isLoading.value = false;
  }
};

</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: var(--td-bg-color-page);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--td-comp-paddingTB-xl);
}

.login-card {
  width: 100%;
  max-width: 420px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: var(--td-radius-large);
  transition: box-shadow 0.3s ease;
}

.login-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.login-title {
  font-size: var(--td-size-10);
  font-weight: 600;
  color: var(--td-text-color-primary);
  line-height: 1.5;
  text-align: center;
}

.login-title--left {
  text-align: left;
}

.login-subtitle {
  font-size: var(--td-font-size-body-large);
  color: var(--td-text-color-secondary);
  font-weight: 500;
}

.login-title:first-child {
  margin-bottom: var(--td-comp-margin-xs);
}

.login-form {
  width: 100%;
}

.login-loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: var(--td-comp-paddingTB-xl);
}

.login-loading-text {
  margin-top: var(--td-comp-margin-m);
  color: var(--td-text-color-primary);
  font-size: var(--td-font-size-body-large);
}

.login-form-wrapper {
  padding: var(--td-comp-paddingTB-m) 0;
}

.login-input {
  border-radius: var(--td-radius-medium);
  transition: all 0.2s ease;
}

.login-button-wrapper {
  margin-top: var(--td-comp-margin-xl);
  margin-bottom: 0;
}

.login-button {
  height: 48px;
  border-radius: var(--td-radius-medium);
  font-size: var(--td-font-size-body-large);
  font-weight: 500;
  transition: all 0.2s ease;
}

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.login-error-alert {
  margin-top: var(--td-comp-margin-m);
  border-radius: var(--td-radius-medium);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.oauth-button-wrapper:not(:last-child) {
  margin-bottom: var(--td-comp-margin-m);
}

:deep(.t-card__header) {
  padding: var(--td-comp-paddingTB-xl) var(--td-comp-paddingLR-xl) var(--td-comp-paddingTB-m);
  text-align: center;
}

:deep(.t-card__body) {
  padding: var(--td-comp-paddingTB-m) var(--td-comp-paddingLR-xl) var(--td-comp-paddingTB-xl);
}

:deep(.oauth-button-wrapper .t-button) {
  max-width: 100%;
  height: 48px;
  border-radius: var(--td-radius-medium);
  font-size: var(--td-font-size-body-large);
}

:deep(.t-form-item) {
  margin-bottom: var(--td-comp-margin-l);
}

:deep(.t-form-item:last-child) {
  margin-bottom: 0;
}

:deep(.t-input) {
  border-radius: var(--td-radius-medium);
}

:deep(.t-input__inner:focus) {
  border-color: var(--td-brand-color);
  box-shadow: 0 0 0 2px rgba(var(--td-brand-color-rgb), 0.1);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-container {
    padding: var(--td-comp-paddingTB-m);
  }
  
  .login-card {
    max-width: 100%;
  }
  
  :deep(.t-card__header),
  :deep(.t-card__body) {
    padding: var(--td-comp-paddingTB-m) var(--td-comp-paddingLR-m);
  }
}
</style>
