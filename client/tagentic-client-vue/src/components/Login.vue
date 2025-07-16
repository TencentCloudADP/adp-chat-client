<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import api from '@/util/api'
import useEventsBus from '@/util/eventBus'
const {emit} = useEventsBus()

import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
interface FormState {
  username: string;
  password: string;
}
const formState = reactive<FormState>({
  username: '',
  password: '',
})
const disabled = computed(() => {
  return !(formState.username && formState.password)
})

const oauthProviders = ref([])
const handleLoadProvider = async () => {
    const res = await api.get('/account/providers', {})
    if (res.data.providers) {
        oauthProviders.value = res.data.providers
    }
}

const handleLogin = async () => {
    const res = await api.post('/login', {
        email: formState.username,
        password: formState.password
    })
    if (res.data.token) {
        emit("login-state-changed", res.data.token)
    }
}

onMounted(async () => {
    await handleLoadProvider()
})

</script>

<template>
  <div class="login">
    <a-form
      :model="formState"
      name="normal_login"
      class="login-form"
      @finish="handleLogin"
    >
      <a-form-item
        label="Username"
        name="username"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input v-model:value="formState.username">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        label="Password"
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password v-model:value="formState.password">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item class="form-item-clear">
        <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
          Log in
        </a-button>
      </a-form-item>

      <a-form-item class="form-item-clear" v-if="oauthProviders.length > 0">
        Or login with
        <span v-for="provider,index in oauthProviders">
          <a class="login-providers" :href="provider['url']">{{provider['name']}}</a>
          <span v-if="index !== oauthProviders.length - 1">,</span>
        </span>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
.login {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 5px;
}
.form-item-clear {
  margin-bottom: 10px;
}
.login-form-button {
  width: 100%;
}
.login-providers {
}
</style>