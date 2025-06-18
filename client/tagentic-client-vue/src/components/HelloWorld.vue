<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {api, chunkSplitter} from '@/util/api'
import type { AxiosRequestConfig } from 'axios'

const query = ref("")
const messages = reactive([] as string[])

const handleSend = async () => {
  const post_body = {
    query: query.value
  }
  const options = {
    responseType: 'stream',
    adapter: 'fetch',
    timeout: 1000 * 600,
  } as AxiosRequestConfig
  const res = await api.post('/chat/message', post_body, options)

  for await (const line of chunkSplitter(res.data)) {
    let msg_body = line.substring(line.indexOf(':')+1).trim()
    let msg = JSON.parse(msg_body)
    if (msg['type'] == 'TEXT_MESSAGE_CONTENT') {
      messages.push(msg['delta'])
    }
    else if (msg['type'] == 'CUSTOM' && msg['name'] == 'thought') {
      messages.push(msg['value']['delta'])
    }
    console.log(msg)
  }
  console.log('done')
}

</script>

<template>
  <div class="chat">
    <h1>Chat</h1>
    {{messages}}
    <form @submit.prevent="handleSend">
      <div>
        <label for="query">query:</label>
        <input id="query" v-model="query" type="text" required />
        <button type="submit">send</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.chat {
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
