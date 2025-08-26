<template>
    <div id="chat-content" class="chat-box">
        <TChat ref="chatRef" style="height: 100%" :clear-history="chatList.length > 0 && !isStreamLoad"
            @scroll="handleChatScroll" @clear="clearConfirm">
            <template v-if="chatList.length <= 0">
                <AppType :getDefaultQuestion="getDefaultQuestion" />
            </template>
            <template v-else>
                <!-- TODO: 1. 开始对话后不显示type切换 2. template-->
                <ChatItem v-for="(item, index) in chatList" :item="item" :index="index" :loading="loading"
                    :isStreamLoad="isStreamLoad" />
            </template>
            <template #footer>
                <Sender :inputValue="inputValue" :modelOptions="modelOptions" :selectModel="selectModel"
                    :isDeepThinking="isDeepThinking" :isStreamLoad="isStreamLoad" :handleInput="handleInput"
                    :onStop="onStop" :inputEnter="inputEnter" :handleModelChange="handleModelChange"
                    :toggleDeepThinking="toggleDeepThinking" />
            </template>
        </TChat>
        <BackToBottom v-show="isShowToBottom" :backToBottom="backToBottom" />
    </div>
</template>
<script setup lang="tsx">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import AppType from '@/components/Chat/AppType.vue';

// 模拟 SSE 推理数据
import { fetchSSE, MockSSEResponse } from '@/model/sseRequest-reasoning'
// 模型数据
import { modelOptions, defaultModel } from '@/model/models'

import { chatMockData, mockSSEResponseData } from '@/model/chat'
import { useChatStore } from '@/stores/chat'

import { Chat as TChat } from '@tdesign-vue-next/chat'
import { LoadingPlugin } from 'tdesign-vue-next'
import Sender from './Sender.vue'
import BackToBottom from './BackToBottom.vue'
import ChatItem from './ChatItem.vue'


const props = defineProps<{
    draggable?: boolean
}>()

const chatStore = useChatStore()
const { activeId: chatId } = storeToRefs(chatStore)

const loadingHistory = ref(false)

// SSE 请求取消对象
const fetchCancel = ref<any>(null)
// 聊天加载状态
const loading = ref(false)
// 是否流式加载中
const isStreamLoad = ref(false)

// 聊天组件引用
const chatRef = ref<{ scrollToBottom?: (options?: { behavior?: string }) => void } | null>(null)
// 是否显示回到底部按钮
const isShowToBottom = ref(false)

// 滚动到底部方法
const backToBottom = () => {
    if (!(chatRef.value && chatRef.value.scrollToBottom)) return
    chatRef.value.scrollToBottom({
        behavior: 'smooth',
    })
}

// 输入框内容
const inputValue = ref('')

const getDefaultQuestion = (value: string) => {
    inputValue.value = value
}

// 当前选中的模型
const selectModel = ref(defaultModel)
const handleModelChange = (option: any) => {
    selectModel.value = option
}
// 深度思考按钮选中状态
const isDeepThinking = ref(true)

const toggleDeepThinking = () => {
    isDeepThinking.value = !isDeepThinking.value
}

// 聊天消息列表（倒序渲染）
const chatList = ref([...(chatMockData[chatId.value] || [])])
// 清空聊天
const clearConfirm = function () {
    chatList.value = []
}

// 停止流式推理
const onStop = function () {
    if (fetchCancel.value) {
        fetchCancel.value.controller.close()
        loading.value = false
        isStreamLoad.value = false
    }
}

// 聊天滚动事件，判断是否显示回到底部按钮
const handleChatScroll = function ({ e }: { e: Event }) {
    const scrollTop = (e.target as HTMLElement).scrollTop
    isShowToBottom.value = scrollTop < 0
}

// 发送消息
const inputEnter = function () {
    console.log('inputEnter', inputValue.value)
    if (isStreamLoad.value) {
        return
    }
    if (!inputValue.value) return
    // 用户消息
    const params = {
        avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
        name: '自己',
        datetime: new Date().toISOString(),
        content: inputValue.value,
        role: 'user' as 'user',
    }
    chatList.value.unshift(params)
    // 空消息占位（AI回复）
    const params2 = {
        avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
        name: 'TDesignAI',
        datetime: new Date().toISOString(),
        content: '',
        reasoning: '',
        role: 'assistant' as 'assistant',
    }
    chatList.value.unshift(params2)
    handleData()
    inputValue.value = ''
}

const handleInput = (value: string) => {
    inputValue.value = value
}

const handleData = async () => {
    loading.value = true
    isStreamLoad.value = true
    const lastItem = chatList.value[0]
    const mockResponse = new MockSSEResponse({ ...mockSSEResponseData })
    fetchCancel.value = mockResponse
    await fetchSSE(
        () => {
            return mockResponse.getResponse()
        },
        {
            success(result) {
                console.log('success', result)
                loading.value = false
                lastItem.reasoning += result.delta.reasoning_content
                lastItem.content += result.delta.content
            },
            complete(isOk, msg) {
                if (!isOk) {
                    lastItem.role = 'error'
                    lastItem.content = msg ?? ''
                    lastItem.reasoning = msg ?? ''
                }
                // 显示用时xx秒，业务侧需要自行处理
                lastItem.duration = 20
                // 控制终止按钮
                isStreamLoad.value = false
                loading.value = false
            },
        },
    )
}

watch(
    chatId,
    (newId) => {
        if (newId) {
            // 加载对应 mock 聊天记录
            console.log('加载聊天记录', newId)
            loadingHistory.value = true
            chatList.value = []
            const loadingInstance = LoadingPlugin({
                attach: '#chat-content',
                size: 'medium',
                showOverlay: false,
            })
            setTimeout(() => {
                // 模拟加载完成
                chatList.value = [...(chatMockData[newId] || [])]
                loadingHistory.value = false
                loadingInstance.hide()
                console.log('聊天记录加载完成', newId)
            }, 2000)
        }
    },
    { immediate: true },
)
</script>
<style scoped>
.chat-box {
    height: 100%;
    position: relative;
}
</style>
