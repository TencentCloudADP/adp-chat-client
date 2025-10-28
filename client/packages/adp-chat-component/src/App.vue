<script setup lang="ts">

import { ref } from 'vue'
import { defineProps } from 'vue'

const props = defineProps({
  container: String,
})

const popup = ref(false)
const open = ref(false)
</script>

<template>
  <Teleport to="body">
    <div v-if="!open" class="toggle-btn" @click="open = !open">f</div>
  </Teleport>

  <Teleport :to="'#'+props.container">
    <div v-show="open" @keydown.esc="open = false" tabindex="0" :class="{ 'panel-popup': popup, 'panel-side': !popup }">
      <div class="panel-header">
        <label><input type="checkbox" v-model="popup" />弹出</label>
        <button class="panel-close-btn" @click="open = false">—</button>
      </div>
      <h1>Chat</h1>
    </div>
  </Teleport>

</template>

<style scoped>
.panel-close-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 32px;
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.toggle-btn {
  position: fixed;
  z-index: 999;
  bottom: 0%;
  right: 0%;
  margin: 24px;
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: #ffffff80;
  border: #dcdcdc 1px solid;
  box-shadow: 0 1px 44px #00000026;
  user-select: none;
  cursor: pointer;
  font-size: 44px;
  text-align: center;
  line-height: 44px;
  transition: transform 0.2s ease;
}
.toggle-btn:hover {
  border: #d0d0d0 1px solid;
  transform: scale(1.1);
}
.panel-side {
  width: 300px;
  padding: 30px;
  background: white;
  height: 100vh;
  box-sizing: border-box;
}
.panel-popup {
  position: fixed;
  z-index: 999;
  bottom: 0%;
  right: 0%;
  width: 300px;
  margin: 24px;
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 16px #00000026;
}
</style>
