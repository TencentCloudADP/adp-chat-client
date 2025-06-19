<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import api from '@/util/api'
import useEventsBus from '@/util/eventBus'
const {emit} = useEventsBus()

const email = ref("")
const password = ref("")

const handleLogin = async () => {
    const res = await api.post('/login', {
        email: email.value,
        password: password.value
    })
    if (res.data.token) {
      localStorage.setItem('access_token', res.data.token)
      emit("login-state-changed", res.data.token)
    }
}

</script>

<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email:</label>
        <input id="email" v-model="email" type="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input id="password" v-model="password" type="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<style scoped>
.login {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}
button {
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}
</style>