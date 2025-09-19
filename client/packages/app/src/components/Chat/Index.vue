<!--
  聊天主界面组件
  @description 用于展示聊天内容、发送消息和加载历史记录
-->
<template>
    <!-- 聊天内容容器 -->
    <div id="chat-content" class="chat-box">
        <!-- 聊天组件 -->
        <TChat ref="chatRef" :reverse="false" style="height: 100%" :clear-history="false" @scroll="handleChatScroll"
            @clear="clearConfirm">
            <!-- 默认问题提示 -->
            <template v-if="chatList.length <= 0 && !messageLoading">
                <AppType :getDefaultQuestion="getDefaultQuestion" />
            </template>
            <!-- 聊天消息列表 -->
            <template v-else>
                <ChatItem v-for="(item, index) in chatList" :isLastMsg="index === (chatList.length - 1)" :item="item"
                    :index="index" :loading="loading" :isStreamLoad="isStreamLoad" />
            </template>
            <!-- 底部发送区域 -->
            <template #footer>
                <Sender :inputValue="inputValue" :modelOptions="modelOptions" :selectModel="selectModel"
                    :isDeepThinking="isDeepThinking" :isStreamLoad="isStreamLoad" :handleInput="handleInput"
                    :onStop="onStop" :inputEnter="inputEnter" :handleModelChange="handleModelChange"
                    :toggleDeepThinking="toggleDeepThinking" />
                <!-- 提示文字 -->
                <div class="ai-warning">
                    {{ $t('common.aiWarning') }}
                </div>
            </template>
        </TChat>
        <!-- 回到底部按钮 -->
        <BackToBottom v-show="isShowToBottom && !isStreamLoad" :backToBottom="backToBottom" />
    </div>
</template>

<script setup lang="tsx">
import { ref, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import type { AxiosRequestConfig } from 'axios'
import AppType from '@/components/Chat/AppType.vue'
import { Chat as TChat } from '@tdesign-vue-next/chat'
import { LoadingPlugin } from 'tdesign-vue-next'
import { fetchSSE } from '@/model/sseRequest-reasoning'
import { mergeRecord } from '@/utils/util'
// 模型数据
import { modelOptions, defaultModel } from '@/model/models'
import type { Record } from '@/model/chat'
import { handleLoadConversationDetail, handleSendConversation } from '@/service/chat'
import { useChatStore, fetchChatList } from '@/stores/chat'
import { useAppsStore } from '@/stores/apps'

import Sender from './Sender.vue'
import BackToBottom from './BackToBottom.vue'
import ChatItem from './ChatItem.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const chatStore = useChatStore()
const appsStore = useAppsStore()
const { currentConversationId: chatId } = storeToRefs(chatStore)
const { currentApplicationId } = storeToRefs(appsStore)

// 是否正在创建新对话
const skipUpdateOnce = ref(false)


/**
 * 聊天加载状态
 * @type {Ref<boolean>}
 */
const loading = ref(false)
/**
 * 消息加载状态
 * @type {Ref<boolean>}
 */
const messageLoading = ref(false)
/**
 * 是否流式加载中
 * @type {Ref<boolean>}
 */
const isStreamLoad = ref(false)

let abort = null as AbortController | null

/**
 * 聊天组件引用
 * @type {Ref<{ scrollToBottom?: (options?: { behavior?: string }) => void } | null>}
 */
const chatRef = ref<{ scrollToBottom?: (options?: { behavior?: string }) => void } | null>(null)
/**
 * 是否显示回到底部按钮
 * @type {Ref<boolean>}
 */
const isShowToBottom = ref(false)

/**
 * 加载聊天会话详情
 * @param {string} chatId - 会话ID
 * @returns {Promise<void>}
 */
const handleGetConversationDetail = async (chatId: string) => {
    if (!chatId) return
    const loadingInstance = LoadingPlugin({
        attach: '#chat-content',
        size: 'medium',
        showOverlay: false,
    })
    messageLoading.value = true
    try {
        let LastRecordId = chatList.value.length > 0 ? chatList.value[0].RecordId : ''
        const ChatConversation = await handleLoadConversationDetail({
            ConversationId: chatId,
            ShareId: '',
            LastRecordId: LastRecordId
        })
        messageLoading.value = false
        chatList.value = [...ChatConversation?.Response.Records, ...chatList.value]
        loadingInstance.hide()
        nextTick(() => {
            // 仅首次加载滚动到最底部
            !LastRecordId && backToBottom()
        })
    } catch (err) {
        loadingInstance.hide()
    }

}

/**
 * 滚动到底部
 * @returns {void}
 */
const backToBottom = () => {
    if (!(chatRef.value && chatRef.value.scrollToBottom)) return
    chatRef.value.scrollToBottom({
        behavior: 'smooth',
    })
}

/**
 * 输入框内容
 * @type {Ref<string>}
 */
const inputValue = ref('')

/**
 * 设置默认问题
 * @param {string} value - 默认问题内容
 * @returns {void}
 */
const getDefaultQuestion = (value: string) => {
    inputValue.value = value
}

/**
 * 当前选中的模型
 * @type {Ref<any>}
 */
const selectModel = ref(defaultModel)
/**
 * 切换模型
 * @param {any} option - 模型选项
 * @returns {void}
 */
const handleModelChange = (option: any) => {
    selectModel.value = option
}
/**
 * 深度思考按钮选中状态
 * @type {Ref<boolean>}
 */
const isDeepThinking = ref(true)

/**
 * 切换深度思考状态
 * @returns {void}
 */
const toggleDeepThinking = () => {
    isDeepThinking.value = !isDeepThinking.value
}

/**
 * 聊天消息列表（倒序渲染）
 * @type {Ref<Record[]>}
 */
const chatList = ref<Record[]>([])
/**
 * 清空聊天
 * @returns {void}
 */
const clearConfirm = function () {
    chatList.value = []
}

/**
 * 停止流式推理
 * @returns {void}
 */
const onStop = function () {
    abort?.abort()
    abort = null
}

/**
 * 聊天滚动事件
 * @param {{ e: Event }} param0 - 滚动事件对象
 * @returns {void}
 */
const handleChatScroll = function ({ e }: { e: Event }) {
    if (messageLoading.value) return;
    const scrollTop = (e.target as HTMLElement).scrollTop
    const clientHeight = (e.target as HTMLElement).clientHeight
    const scrollHeight = (e.target as HTMLElement).scrollHeight
    isShowToBottom.value = clientHeight + scrollTop < scrollHeight
    if (scrollTop === 0) {
        handleGetConversationDetail(chatId.value)
    }
}

/**
 * 发送消息
 * @returns {void}
 */
const inputEnter = function () {
    if (isStreamLoad.value) {
        return
    }
    if (!inputValue.value) return
    // 用户消息
    const params: Record = {
        RecordId: 'placeholder-user',
        Content: inputValue.value,
        IsLlmGenerated: false,
    }
    chatList.value.push(params)

    // 空消息占位（AI回复）
    const params2: Record = {
        RecordId: 'placeholder-agent',
        Content: '',
        IsLlmGenerated: true
    }
    chatList.value.push(params2)
    nextTick(() => {
        backToBottom()
    })
    handleSendData()
    inputValue.value = ''
}

/**
 * 处理输入内容
 * @param {string} value - 输入内容
 * @returns {void}
 */
const handleInput = (value: string) => {
    inputValue.value = value
}

/**
 * 处理发送逻辑
 * @returns {Promise<void>}
 */
const handleSendData = async () => {
    abort = new AbortController()
    loading.value = true
    isStreamLoad.value = true
    await fetchSSE(
        () => {
            const options = {
                responseType: 'stream',
                adapter: 'fetch',
                timeout: 1000 * 600,
                signal: abort?.signal
            } as AxiosRequestConfig
            return handleSendConversation({
                Query: inputValue.value,
                ConversationId: chatId.value, //   id为空创建新对话
                ApplicationId: currentApplicationId.value,
            }, options)
        },
        {
            success(result) {
                if (result.type === 'conversation') {
                    //  创建新的对话，重新调用chatlist接口更新列表，根据record的LastActiveAt更新列表排序
                    fetchChatList()
                    if (result.data.IsNewConversation) {
                        skipUpdateOnce.value = true
                        chatStore.setCurrentConversation(result.data)
                        router.push({ name: 'Home', query: { conversationId: result.data.Id } })
                    }
                } else {
                    let record: Record = result.data;
                    record.IsLlmGenerated = (record.RelatedRecordId !== '')
                    if (result.type == 'reply' && !record.IsLlmGenerated) {
                        const index = chatList.value.findIndex(item => item.RecordId === 'placeholder-user');
                        if (index !== -1) {
                            chatList.value.splice(index, 1, record);
                        }
                    } else {
                        const lastIndex = chatList.value.length - 1
                        if (chatList.value[lastIndex].RecordId == 'placeholder-agent') {
                            chatList.value[lastIndex].RecordId = record.RecordId
                        }
                        if (lastIndex >= 0 && chatList.value[lastIndex].RecordId == record.RecordId) {
                            mergeRecord(chatList.value[lastIndex], record, result.type)
                        } else {
                            chatList.value.push(record)
                        }
                    }

                    loading.value = false
                }
                nextTick(() => {
                    backToBottom()
                })
            },
            complete(isOk, msg) {
                if (isOk) {
                    isStreamLoad.value = false
                    loading.value = false
                    nextTick(() => {
                        backToBottom()
                    })
                }
            },
            fail(msg) {
                console.error('fail', msg)
                isStreamLoad.value = false
                loading.value = false
            }
        },
    )
}

// 监听chatId变化
watch(
    chatId,
    (newId) => {
        // sse新建对话中不处理变化
        if (skipUpdateOnce.value) {
            skipUpdateOnce.value = false
            return
        }
        // 切换到新的对话,停止上一次对话内容
        onStop();
        chatList.value = [];
        handleGetConversationDetail(newId)
    },
    { immediate: true },
)
</script>

<style scoped>
.chat-box {
    height: 100%;
    position: relative;
}

.ai-warning {
    text-align: center;
    color: var(--td-text-color-placeholder);
    font-size: var(--td-font-size-body-small);
    margin-top: var(--td-comp-margin-s);
    padding: var(--td-comp-paddingTB-xs) var(--td-comp-paddingLR-s);
}
</style>
