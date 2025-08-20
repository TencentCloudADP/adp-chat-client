<template>
  <div class="login-container">
    <t-card class="login-card">
      <div class="login-title">{{ $t('登录智能体开发平台') }}</div>
      <t-form class="login-form" layout="vertical" :label-width="0" @submit="onSubmit">
        <t-form-item>
          <t-input v-model="username" :placeholder="$t('请输入账户名')" clearable>
            <template #prefix-icon>
              <t-icon name="user" />
            </template>
          </t-input>
        </t-form-item>
        <t-form-item>
          <t-input v-model="password" type="password" :placeholder="$t('请输入密码')" clearable>
            <template #prefix-icon>
              <t-icon name="lock-on" />
            </template>
          </t-input>
        </t-form-item>
        <t-form-item>
          <t-button theme="primary" type="submit" block :disabled="!username || !password">{{ $t('登录') }}</t-button>
        </t-form-item>
      </t-form>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import { uuidv4 } from '@/utils/id';
import { login } from '@/service/auth';

const { t } = useI18n();

const username = ref('');
const password = ref('');


// mock密码
const MOCK_PASS = '123456';

const router = useRouter();

const onSubmit = (e: Event) => {
  console.log('onSubmit', e);
  if (username.value && (password.value === MOCK_PASS)) {
    const token = uuidv4();
    login(token, () => router.replace('/'));
  } else {
    MessagePlugin.error({ content: t('账号或密码错误') });
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
}

.login-card {
  min-width: 400px;
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);
  box-shadow: var(--td-shadow-1);
  border-radius: var(--td-radius-large);
  background: var(--td-bg-color-container);
}

.login-title {
  font-size: var(--td-font-size-title-large);
  font-weight: 600;
  color: var(--td-brand-color);
  margin-bottom: var(--td-comp-margin-l);
  text-align: center;
}

.login-form {
  margin-top: var(--td-comp-margin-m);
}
</style>
