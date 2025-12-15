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
                <div class="content selectable" :class="{ isMobile: uiStore.isMobile, isFull: chatList.length <= 0 }">
                    <InfiniteLoading v-if="chatId" :identifier="chatId" direction="top" @infinite="infiniteHandler">
                        <template #spinner>
                            <div>
                                <t-loading size="small">
                                    <template #text>
                                        <span class="thinking-text">
                                            {{ `${$t('common.loading')}...` }}
                                        </span>
                                    </template>
                                    <template #indicator>
                                        <CustomizedIcon class="thinking-icon" name="thinking" />
                                    </template>
                                </t-loading>
                            </div>
                        </template>
                        <template #no-more>
                            <div></div>
                        </template>
                        <template #no-results>
                            <div></div>
                        </template>
                    </InfiniteLoading>
                    <div class="chat-item__content" v-for="(item, index) in chatList" :key="item.RecordId">
                        <Checkbox class="share-checkbox" :checked="selectedIds?.includes(item.RecordId)"
                            v-if="isSelecting" @change="(e) => onSelectIds(item.RecordId, e)" />
                        <div style="width: 100%">
                            <ChatItem :isLastMsg="index === (chatList.length - 1)" :item="item" :index="index"
                                :loading="loading" :isStreamLoad="isChatting" :onResend="onResend"
                                :onShare="onShare"
                                :sendMessage="inputEnter" />
                        </div>
                    </div>
                </div>

            </template>
            <!-- 底部发送区域 -->
            <template #footer>
                <!-- 回到底部按钮 -->
                <BackToBottom v-show="chatId && ((isShowToBottom && !isStreamLoad) || hasUserScrolled)"
                    :loading="isChatting" :backToBottom="handleClickBackToBottom" />
                <t-card v-if="isSelecting" size="small" class="share-setting-container" shadow
                    bodyClassName="share-setting-card">
                    <div class="share-setting-content">
                        <t-checkbox :indeterminate="selectedIds.length !== chatList.length && selectedIds.length !== 0"
                            :checked="checkall" @change="handleCheckAll">{{ $t('operation.checkAll') }}</t-checkbox>
                        <t-divider layout="vertical"></t-divider>
                        <div class="share-text">
                            {{ $t('operation.shareFor') }}
                            <div class="icon__share-copy" :class="{ disabled: selectedIds.length <= 0 }"
                                @click="handleCopyShare()">
                                <CustomizedIcon name="copy_link" />
                                <span>{{ $t('operation.copyUrl') }}</span>
                            </div>
                        </div>
                        <t-divider layout="vertical"></t-divider>
                        <div class="icon__share-close" @click="handleCloseShare()">
                            <span>{{ $t('operation.cancelShare') }}</span>
                        </div>
                    </div>
                </t-card>
                <Sender ref="senderRef" :modelOptions="modelOptions" :selectModel="selectModel"
                    :isDeepThinking="isDeepThinking" :isStreamLoad="isStreamLoad" :onStop="onStop"
                    :inputEnter="inputEnter" :handleModelChange="handleModelChange"
                    :toggleDeepThinking="toggleDeepThinking" />
            </template>
        </TChat>

    </div>
</template>

<script setup lang="tsx">
import { ref, watch, nextTick, computed } from 'vue'
import InfiniteLoading from 'vue-infinite-loading'
import { storeToRefs } from 'pinia'
import type { AxiosRequestConfig } from 'axios'
import { useI18n } from 'vue-i18n'
import AppType from '@/components/Chat/AppType.vue'
import { Chat as TChat } from '@tdesign-vue-next/chat'
import { Checkbox, MessagePlugin } from 'tdesign-vue-next'
import { fetchSSE } from '@/model/sseRequest-reasoning'
import { mergeRecord } from '@/utils/util'
import { useUiStore } from '@/stores/ui'

// 模型数据
import { modelOptions, defaultModel } from '@/model/models'
import type { Record } from '@/model/chat'
import type { FileProps } from '@/model/file';
import { handleLoadConversationDetail, handleSendConversation, handleGetShareId } from '@/service/chat'
import { useChatStore, fetchChatList } from '@/stores/chat'
import { useAppsStore } from '@/stores/apps'
import { copy } from '@/utils/clipboard';

import Sender from './Sender.vue'
import BackToBottom from './BackToBottom.vue'
import ChatItem from './ChatItem.vue'
import CustomizedIcon from '@/components/CustomizedIcon.vue';
const { t } = useI18n()


/**
 * 聊天存储实例
 * @type {import('@/stores/chat').useChatStore}
 */
const chatStore = useChatStore()

const uiStore = useUiStore()

/**
 * 应用存储实例
 * @type {import('@/stores/apps').useAppsStore}
 */
const appsStore = useAppsStore()
/**
 * 当前会话ID
 * @type {ComputedRef<string>}
 */
const chatId = computed(() => chatStore.currentConversationId);
/**
 * 是否正在聊天中
 * @type {ComputedRef<boolean>}
 */
const isChatting = computed(() => chatStore.isChatting);
const { currentApplicationId } = storeToRefs(appsStore)

/**
 * 是否处于选择分享状态
 * @type {Ref<boolean>}
 */
const isSelecting = ref(false)
const currentChatingConversationId = ref('')    //  当前对话中新生成的id


const checkall = ref(false);

const handleCheckAll = (checked: boolean) => {
    checkall.value = checked;
    if (checked) {
        selectedIds.value = chatList.value.map(i => i.RecordId)
    } else {
        selectedIds.value = [];
    }
}
/**
 * 选中的消息ID列表
 * @type {Ref<string[]>}
 */
const selectedIds = ref<string[]>([])
/**
 * 发送组件引用
 * @type {Ref<InstanceType<typeof Sender> | null>}
 */
const senderRef = ref<InstanceType<typeof Sender> | null>(null)

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

const lastScrollTop = ref(0)
const hasUserScrolled = ref(false)

/**
 * 中止控制器，用于取消请求
 * @type {AbortController | null}
 */
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
 * @param {any} [status] - 可选状态参数
 * @returns {Promise<void>}
 */
const handleGetConversationDetail = async (chatId: string, status?: { loaded: () => void; complete: () => void }) => {
    console.log('isChatting', isChatting)
    if (!chatId) return
    if (isChatting.value) {
        status && status.complete()
        return;
    }
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
        if (ChatConversation?.Response.Records.length > 0) {
            status && status.loaded();
        } else {
            status && status.complete();
        }
        nextTick(() => {
            // 仅首次加载滚动到最底部
            !LastRecordId && backToBottom()
        })
    } catch (err) {
        status && status.complete();
    }
}

/**
 * 通用节流函数
 * @param {Function} fn - 需要节流的函数
 * @param {number} delay - 节流时间（毫秒）
 * @returns {Function} - 节流后的函数
 */
const throttle = (fn: Function, delay: number) => {
    let lastCallTime = 0;
    return function (this: any, ...args: any[]) {
        const now = Date.now();
        if (now - lastCallTime < delay) {
            return;
        }
        lastCallTime = now;
        return fn.apply(this, args);
    };
};

/**
 * 滚动到底部
 * @returns {void}
 */
const backToBottom = () => {
     if (!(chatRef.value && chatRef.value.scrollToBottom)) return;
    if (hasUserScrolled.value) return;
    chatRef.value.scrollToBottom({
        behavior: 'smooth',
    });
}
// const backToBottom = throttle(() => {
//     if (!(chatRef.value && chatRef.value.scrollToBottom)) return;
//     if (hasUserScrolled.value) return;
//     chatRef.value.scrollToBottom({
//         behavior: 'smooth',
//     });
// }, 500);

/**
 * 点击回到底部按钮
 * @returns {void}
 */
const handleClickBackToBottom = () => {
    hasUserScrolled.value = false;
    backToBottom()
}

/**
 * 设置默认问题
 * @param {string} value - 默认问题内容
 * @returns {void}
 */
const getDefaultQuestion = (value: string) => {
    // senderRef.value && senderRef.value.changeSenderVal(value, [])
    inputEnter(value)
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
    currentChatingConversationId.value = ''
}

/**
 * 无限加载处理函数
 * @param {any} $state - 无限加载状态
 * @returns {void}
 */
const infiniteHandler = function ($state: any) {
    try{
        handleGetConversationDetail(chatId.value, $state)
    }catch(err){
        $state.complete()
    }
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
    const isToBottom = clientHeight + scrollTop < scrollHeight - 2
    isShowToBottom.value = isToBottom

    if (lastScrollTop.value - scrollTop > 4 && isChatting.value) {
        hasUserScrolled.value = true
    }
    if (!isToBottom) {
        hasUserScrolled.value = false
    }
    lastScrollTop.value = scrollTop
}

/**
 * 发送消息
 * @param {string} [queryVal] - 消息内容
 * @param {FileProps[]} [fileList] - 文件列表
 * @returns {void}
 */
const inputEnter = function (queryVal: string | undefined, fileList?: FileProps[]) {
    if (isStreamLoad.value) {
        return
    }
    if (!queryVal) return
    let _query = ``;
    {
        for (const file of fileList || []) {
            if (file.status == 'done') {
                _query += `![](${file.url})`
            }
        }
    }
    _query += queryVal;
    // 用户消息
    const params: Record = {
        RelatedRecordId: "",
        RecordId: 'placeholder-user',
        Content: _query,
        IsFromSelf: true
    }
    chatList.value.push(params)

    // 空消息占位（AI回复）
    const params2: Record = {
        RelatedRecordId: "",
        RecordId: 'placeholder-agent',
        Content: '',
        IsFromSelf: false
    }
    chatList.value.push(params2)
    nextTick(() => {
        backToBottom()
    })
    handleSendData(_query)
    senderRef.value && senderRef.value.changeSenderVal('', [])
}

/**
 * 重新发送消息
 * @param {string} [RelatedRecordId] - 关联记录ID
 * @returns {void}
 */
const onResend = (RelatedRecordId: string | undefined) => {
    if (!RelatedRecordId) return;
    const related = chatList.value.filter((record: Record) => record.RecordId == RelatedRecordId)
    if (related.length == 0) {
        return
    }
    inputEnter(related[0].Content)
}

/**
 * 关闭分享设置
 * @returns {void}
 */
const handleCloseShare = () => {
    isSelecting.value = false
    selectedIds.value = []
}

/**
 * 打开分享设置
 * @param {string[]} RecordIds - 记录ID列表
 * @returns {Promise<void>}
 */
const onShare = async (RecordIds: string[]) => {
    let _selectedList = chatList.value.filter(item => (item?.RelatedRecordId && RecordIds.includes(item?.RelatedRecordId)) || RecordIds.includes(item?.RecordId)).map(i => i.RecordId)
    isSelecting.value = true
    selectedIds.value = [...new Set([...selectedIds.value, ..._selectedList])]
}

/**
 * 复制分享链接
 * @returns {Promise<void>}
 */
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
            copy(url, url);
        }
    } catch (e) {
        console.log('share error', e)
    }
}

/**
 * 选择/取消选择消息ID
 * @param {string} [RecordId] - 记录ID
 * @param {boolean} checked - 是否选中
 * @returns {void}
 */
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
 * 处理发送逻辑
 * @param {string} queryVal - 查询内容
 * @returns {Promise<void>}
 */
const handleSendData = async (queryVal: string) => {
    abort = new AbortController()
    loading.value = true
    isStreamLoad.value = true
    hasUserScrolled.value = false
    chatStore.setIsChatting(true)
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
                    fetchChatList()
                    if (result.data.IsNewConversation) {
                        currentChatingConversationId.value = result.data.Id;
                        chatStore.setCurrentConversation(result.data)
                    }
                } else {
                    let record: Record = result.data;
                    if (result.type == 'reply' && record.IsFromSelf) {
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
                    loading.value = false
                    chatStore.setIsChatting(false)
                    currentChatingConversationId.value = ''
                    nextTick(() => {
                        backToBottom();
                        setTimeout(() => {
                            hasUserScrolled.value = false;  //  结束后取消自动滚动
                            isStreamLoad.value = false;
                        }, 500);    //  自动滚动到底有操作延迟，确认触底后取消状态位
                    })
                    
                }
            },
            fail(msg) {
                // 根据错误类型显示不同的提示
                let errorMessage = t('conversation.sendError')
                
                // 判断是否为 AbortError（用户取消请求）
                if (msg && typeof msg === 'object' &&
                    (
                        ('name' in msg && msg.name === 'AbortError') ||
                        ('code' in msg && msg.code === 'ERR_CANCELED')
                    )
                ) {
                    return
                }
                // 判断是否为 AxiosError（网络错误）
                else if (msg && typeof msg === 'object' &&
                    (
                        ('code' in msg && msg.code === 'ERR_NETWORK')
                    )
                ) {
                    errorMessage = t('conversation.networkError')
                }
                // 如果是字符串类型的错误消息，直接使用
                else if (msg && typeof msg === 'string') {
                    errorMessage = msg
                }
                
                MessagePlugin.error(errorMessage)
            }
        },
    )
}

// 监听chatId变化
watch(
    chatId,
    (newId, oldId) => {
        // sse新建对话中不处理变化
        if (isChatting.value && (newId && currentChatingConversationId.value && newId === currentChatingConversationId.value)) {
            return
        }
        isSelecting.value = false;
        selectedIds.value = [];
        onStop();
        clearConfirm()
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

.share-setting-container {
    z-index: 10;
    position: fixed;
    bottom: 146px;
}

.share-setting-content {
    display: flex;
    justify-content: center;
    align-items: center;
}

.icon__share-copy {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--td-bg-color-container-hover);
    border-radius: var(--td-radius-default);
    padding: var(--td-comp-paddingLR-xs) var(--td-comp-paddingLR-xl);
    margin-left: var(--td-comp-paddingLR-l);
    margin-right: var(--td-comp-paddingLR-xs);
    font-size: var(--td-font-size-link-medium);
    cursor: pointer;
}

.share-text {
    display: flex;
    align-items: center;
}

.icon__share-copy.disabled {
    cursor: not-allowed;
    opacity: 0.4;
}

.icon__share-copy span:nth-child(1) {
    margin-right: var(--td-pop-padding-s);
}

.icon__share-close {
    cursor: pointer;
    margin-left: var(--td-pop-padding-xl);
    padding-left: var(--td-comp-paddingLR-xxs);
}

.thinking-text {
    color: var(--td-text-color-primary);
    font-size: var(--td-font-size-link-medium);
    margin-left: var(--td-comp-margin-xs)
}

.thinking-icon {
    animation: rotate 2s linear infinite;
    width: var(--td-comp-size-xs);
    height: var(--td-comp-size-xs);
    padding: 0;
}

.content.isFull,
.content.isFull .infinite-loading-container,
.content.isFull .infinite-status-prompt {
    height: 100%;
}

:deep(.content.isFull .infinite-status-prompt) {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

:deep(.t-chat__footer) {
    display: flex;
    justify-content: center;
    padding: 0 var(--td-comp-paddingLR-m);

}

:deep(.content .chat-item__content) {
    padding-bottom: var(--td-comp-paddingLR-l);
    margin-left: var(--td-size-4);
}

:deep(.content .chat-item__content:last-child) {
    padding-bottom: var(--td-comp-paddingLR-xl);
}

:deep(.t-chat__list) {
    padding: 0 calc(var(--td-comp-paddingLR-xl) - var(--td-size-4));
    overflow-y: scroll;
}

:deep(.t-chat__list .content) {
    width: 100%;
    max-width: calc(800px + var(--td-size-4));   /* 添加滚动条宽度 */
    margin: 0 auto;
}

:deep(.share-setting-content .t-card__body) {
    padding: var(--td-comp-paddingLR-l) var(--td-size-10) var(--td-comp-paddingLR-l) var(--td-comp-paddingLR-xl);
}

:deep(.share-setting-card) {
    box-sizing: border-box;
    box-shadow: 0px 0px 1px rgba(18, 19, 25, 0.08), 0px 0px 18px rgba(18, 19, 25, 0.08), 0px 16px 64px rgba(18, 19, 25, 0.16);
    border-radius: 6px;
    padding: var(--td-comp-paddingLR-s) var(--td-size-10) var(--td-comp-paddingLR-s) var(--td-comp-paddingLR-xl);

}

:deep(.share-setting-container) {
    border: none;
    box-sizing: border-box;
    box-shadow: 0px 0px 1px rgba(18, 19, 25, 0.08), 0px 0px 18px rgba(18, 19, 25, 0.08), 0px 16px 64px rgba(18, 19, 25, 0.16);
    border-radius: 6px;
}
</style>
