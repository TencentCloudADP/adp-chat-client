<template>
  <div class="login-container">
    <t-card class="login-card">
      <div class="login-title">{{ $t('account.loginToAdp') }}</div>
      <t-form class="login-form" layout="vertical" :label-width="0" @submit="onSubmit">
        <t-form-item>
          <t-input v-model="username" :placeholder="$t('account.inputAccountName')" clearable disabled>
            <template #prefix-icon>
              <t-icon name="user" />
            </template>
          </t-input>
        </t-form-item>
        <t-form-item>
          <t-input v-model="password" type="password" :placeholder="$t('account.inputPassword')" clearable disabled>
            <template #prefix-icon>
              <t-icon name="lock-on" />
            </template>
          </t-input>
        </t-form-item>
        <t-form-item>
          <t-button theme="primary" type="submit" block :disabled="!username || !password">{{ $t('account.login')
            }}</t-button>
        </t-form-item>

        <t-form-item class="form-item-clear" v-if="oauthProviders.length > 0">
          Or login with
          <span v-for="provider, index in oauthProviders">
            <a class="login-providers" :href="provider['url']">{{ provider['name'] }}</a>
            <span v-if="index !== oauthProviders.length - 1">,</span>
          </span>
        </t-form-item>

      </t-form>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import { fetchLoginProviders } from '@/service/login';

const { t } = useI18n();

const username = ref('');
const password = ref('');
const oauthProviders = ref([])

const router = useRouter();

const onSubmit = (e: Event) => { };

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
