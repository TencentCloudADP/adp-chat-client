<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import Login from './components/Login.vue';

const isAuthenticated = computed(() => {
  return !!localStorage.getItem('access_token');
})

</script>

<template>
  <div id="app">
    <Login v-if="!isAuthenticated" />
    <HelloWorld v-else />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
