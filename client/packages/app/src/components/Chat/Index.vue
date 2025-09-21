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
            <template v-if="chatList.length <= 0 && !messageLoading && !chatId">
                <AppType :getDefaultQuestion="getDefaultQuestion" />
            </template>
            <!-- 聊天消息列表 -->
            <template v-else>
                <div class="content">
                    <div class="chat-item__content" v-for="(item, index) in chatList">
                        <Checkbox :checked="selectedIds?.includes(item.RecordId)" v-if="isSelecting"
                            @change="(e) => onSelectIds(item.RecordId, e)" />
                        <div style="width: 100%">
                            <ChatItem :isLastMsg="index === (chatList.length - 1)" :item="item" :index="index"
                                :loading="loading" :isStreamLoad="isStreamLoad" :onResend="onResend"
                                :onShare="onShare" />
                        </div>
                    </div>
                </div>
            </template>
            <!-- 底部发送区域 -->
            <template #footer>
                <Drawer class="share-setting-container" :footer="false" size="small" placement="bottom"
                    :showOverlay="false" :preventScrollThrough="false" :visible="isSelecting"
                    @close="handleCloseShare()">
                    <div class="share-setting-content">
                        <div class="icon__share-copy" :class="{ disabled: selectedIds.length <= 0 }"
                            @click="handleCopyShare()">
                            <span> <t-icon name="link-1"></t-icon> </span>
                            <span>{{ $t('operation.copyUrl') }}</span>
                        </div>
                        <div class="icon__share-close" @click="handleCloseShare()">
                            <span>
                                <t-icon name="close"></t-icon>
                            </span>
                            <span>{{ $t('operation.cancelShare') }}</span>
                        </div>
                    </div>
                </Drawer>
                <Sender v-if="!isSelecting" :inputValue="inputValue" :modelOptions="modelOptions" :selectModel="selectModel"
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
import { ref, watch, nextTick,computed } from 'vue'
import { storeToRefs } from 'pinia'
import type { AxiosRequestConfig } from 'axios'
import AppType from '@/components/Chat/AppType.vue'
import { Chat as TChat } from '@tdesign-vue-next/chat'
import { LoadingPlugin, Drawer, Checkbox } from 'tdesign-vue-next'
import { fetchSSE } from '@/model/sseRequest-reasoning'
import { mergeRecord } from '@/utils/util'
// 模型数据
import { modelOptions, defaultModel } from '@/model/models'
import type { Record } from '@/model/chat'
import { handleLoadConversationDetail, handleSendConversation, handleGetShareId } from '@/service/chat'
import { useChatStore, fetchChatList } from '@/stores/chat'
import { useAppsStore } from '@/stores/apps'
import { copy } from '@/utils/clipboard';

import Sender from './Sender.vue'
import BackToBottom from './BackToBottom.vue'
import ChatItem from './ChatItem.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const chatStore = useChatStore()
const appsStore = useAppsStore()
const chatId = computed(() => chatStore.currentConversationId);
const isChatting = computed(() => chatStore.isChatting);
const { currentApplicationId } = storeToRefs(appsStore)

const isSelecting = ref(false)
const selectedIds = ref<string[]>([])

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
    chatList.value = []
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
    chatList.value.length = 0; 
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
const inputEnter = function (queryVal = inputValue.value) {
    if (isStreamLoad.value) {
        return
    }
    if (!queryVal) return
    // 用户消息
    const params: Record = {
        RelatedRecordId: "",
        RecordId: 'placeholder-user',
        Content: queryVal,
        IsLlmGenerated: false,
    }
    chatList.value.push(params)

    // 空消息占位（AI回复）
    const params2: Record = {
        RelatedRecordId: "",
        RecordId: 'placeholder-agent',
        Content: '',
        IsLlmGenerated: true
    }
    chatList.value.push(params2)
    nextTick(() => {
        backToBottom()
    })
    handleSendData(queryVal)
    inputValue.value = ''
}

const onResend = (RelatedRecordId: string | undefined) => {
    if (!RelatedRecordId) return;
    const related = chatList.value.filter((record) => record.RecordId == RelatedRecordId)
    if (related.length == 0) {
        return
    }
    inputEnter(related[0].Content)
}

const handleCloseShare = () => {
    isSelecting.value = false
    selectedIds.value = []
}
const onShare = async (RecordIds: string[]) => {
    let _selectedList = chatList.value.filter(item => RecordIds.includes(item?.RelatedRecordId) || RecordIds.includes(item?.RecordId)).map( i => i.RecordId)
    isSelecting.value = true
    selectedIds.value = [...new Set([...selectedIds.value, ..._selectedList])]
}

const handleCopyShare = async () => {
    if (selectedIds.value.length <= 0) return;
    try {
        const res = await handleGetShareId({
            ConversationId: chatId.value,
            ApplicationId: currentApplicationId.value,
            RecordIds: selectedIds.value,
        })
        if (res.ShareId) {
            const baseUrl = window.location.href.split('#')[0]
            const url = `${baseUrl}#/share?ShareId=${res.ShareId}`
            copy(url,url);
        }
    } catch (e) {
        console.log('share error', e)
    }
}

const onSelectIds = (RecordId: string | undefined, checked: boolean) => {
    if (!RecordId) return
    if (checked) {
        selectedIds.value.push(RecordId)
    } else {
        let newArray = selectedIds.value.filter(item => item !== RecordId);
        selectedIds.value = [...newArray]
    }
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
const handleSendData = async (queryVal = inputValue.value) => {
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
                Query: queryVal,
                ConversationId: chatId.value, //   id为空创建新对话
                ApplicationId: currentApplicationId.value,
            }, options)
        },
        {
            success(result) {
                if (result.type === 'conversation') {
                    //  创建新的对话，重新调用chatlist接口更新列表，根据record的LastActiveAt更新列表排序
                    fetchChatList(result.data.Id)
                    if (result.data.IsNewConversation) {
                        chatStore.setIsChatting(true)
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
                    chatStore.setIsChatting(false)
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
        console.log('newId',isChatting.value,'messageLoading',messageLoading.value,'newId',newId)
        // sse新建对话中不处理变化
        if (isChatting.value) {
            return
        }
        onStop();
        clearConfirm()
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

.chat-item__content {
    display: flex;
    align-items: self-start;
}

.ai-warning {
    text-align: center;
    color: var(--td-text-color-placeholder);
    font-size: var(--td-font-size-body-small);
    margin-top: var(--td-comp-margin-s);
    padding: var(--td-comp-paddingTB-xs) var(--td-comp-paddingLR-s);
}

.share-setting-content {
    display: flex;
    justify-content: center;
}

.icon__share-copy,
.icon__share-close {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.icon__share-copy.disabled {
    cursor: not-allowed;
    opacity: 0.8;
}

.icon__share-copy span:nth-child(1),
.icon__share-close span:nth-child(1) {
    margin-bottom: 4px;
    background: var(--td-bg-color-secondarycontainer-hover);
    border-radius: 100%;
    width: var(--td-font-size-display-medium);
    height: var(--td-font-size-display-medium);
    line-height: var(--td-font-size-display-medium);
    text-align: center;
    margin: var(--td-size-2) var(--td-size-7);
}

.icon__share-copy span:nth-child(1):hover,
.icon__share-close span:nth-child(1):hover {
    background: var(--td-bg-color-secondarycontainer-active);
}
</style>

<style>
.share-setting-container .t-drawer__content-wrapper {
    height: 120px !important;
    background-color: var(--td-bg-color-secondarycontainer);
}
</style>
