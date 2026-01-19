<!--
  聊天主界面组件
  @description 用于展示聊天内容、发送消息和加载历史记录
-->
<template>
    <!-- 聊天内容容器 -->
    <div id="chat-content" class="chat-box">
        <!-- 聊天组件 -->
        <TChat ref="chatRef" :class="{ isChatting: isChatting }" :reverse="false" style="height: 100%" :clear-history="false"
            @scroll="handleChatScroll" @clear="clearConfirm">
            <!-- 默认问题提示 -->
            <template v-if="chatList.length <= 0 && !messageLoading && !chatId">
                <AppType 
                    :currentApplicationAvatar="currentApplicationAvatar"
                    :currentApplicationName="currentApplicationName"
                    :currentApplicationGreeting="currentApplicationGreeting"
                    :currentApplicationOpeningQuestions="currentApplicationOpeningQuestions"
                    :isMobile="isMobile"
                    @selectQuestion="getDefaultQuestion" 
                />
            </template>
            <!-- 聊天消息列表 -->
            <template v-else>
                <div class="content selectable" :class="{ isMobile: isMobile, isFull: chatList.length <= 0 }">
                    <InfiniteLoading v-if="chatId" :identifier="chatId" direction="top" @infinite="infiniteHandler">
                        <template #spinner>
                            <div>
                                <TLoading size="small">
                                    <template #text>
                                        <span class="thinking-text">
                                            {{ `${i18n.loading}...` }}
                                        </span>
                                    </template>
                                    <template #indicator>
                                        <CustomizedIcon class="thinking-icon" name="thinking" :theme="theme" />
                                    </template>
                                </TLoading>
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
                            <ChatItem 
                                :isLastMsg="index === (chatList.length - 1)" 
                                :item="item" 
                                :index="index"
                                :loading="loading" 
                                :isStreamLoad="isChatting" 
                                :isMobile="isMobile"
                                :theme="theme"
                                :i18n="chatItemI18n"
                                @resend="onResend"
                                @share="onShare"
                                @rate="onRate"
                                @copy="onCopy"
                                @sendMessage="inputEnter" 
                            />
                        </div>
                    </div>
                </div>
            </template>
            <!-- 底部发送区域 -->
            <template #footer>
                <!-- 回到底部按钮 -->
                <BackToBottom 
                    v-show="chatId && ((isShowToBottom && !isChatting) || hasUserScrolled)"
                    :loading="isChatting" 
                    :theme="theme"
                    @click="handleClickBackToBottom" 
                />
                <TCard v-if="isSelecting" size="small" class="share-setting-container" shadow
                    bodyClassName="share-setting-card">
                    <div class="share-setting-content">
                        <TCheckbox :indeterminate="selectedIds.length !== chatList.length && selectedIds.length !== 0"
                            :checked="checkall" @change="handleCheckAll">{{ i18n.checkAll }}</TCheckbox>
                        <TDivider layout="vertical"></TDivider>
                        <div class="share-text">
                            {{ i18n.shareFor }}
                            <div class="icon__share-copy" :class="{ disabled: selectedIds.length <= 0 }"
                                @click="handleCopyShare()">
                                <CustomizedIcon name="copy_link" :theme="theme" />
                                <span>{{ i18n.copyUrl }}</span>
                            </div>
                        </div>
                        <TDivider layout="vertical"></TDivider>
                        <div class="icon__share-close" @click="handleCloseShare()">
                            <span>{{ i18n.cancelShare }}</span>
                        </div>
                    </div>
                </TCard>
                <Sender 
                    ref="senderRef" 
                    :isStreamLoad="isChatting" 
                    :isMobile="isMobile"
                    :theme="theme"
                    :i18n="senderI18n"
                    :useInternalRecord="useInternalRecord"
                    :asrUrlApi="asrUrlApi"
                    @stop="onStop"
                    @send="handleSend" 
                    @uploadFile="handleUploadFile"
                    @startRecord="handleStartRecord"
                    @stopRecord="handleStopRecord"
                    @message="handleMessage"
                />
            </template>
        </TChat>
    </div>
</template>

<script setup lang="tsx">
import { ref, watch, computed, onMounted, onUnmounted, nextTick, toRefs } from 'vue'
import InfiniteLoading from 'vue-infinite-loading'
import { Chat as TChat } from '@tdesign-vue-next/chat'
import { Checkbox, Loading as TLoading, Card as TCard, Checkbox as TCheckbox, Divider as TDivider } from 'tdesign-vue-next'
import type { Record } from '../../model/chat'
import { ScoreValue } from '../../model/chat'
import type { FileProps } from '../../model/file';
import { MessageCode } from '../../model/messages';
import type { ChatRelatedProps, ChatI18n, ChatItemI18n, SenderI18n } from '../../model/type'
import { chatRelatedPropsDefaults, defaultChatI18n, defaultChatItemI18n, defaultSenderI18n } from '../../model/type'

import AppType from './AppType.vue'
import Sender from './Sender.vue'
import BackToBottom from './BackToBottom.vue'
import ChatItem from './ChatItem.vue'
import CustomizedIcon from '../CustomizedIcon.vue';

export interface Props extends ChatRelatedProps {
    /** 当前会话ID */
    chatId?: string;
    /** 聊天消息列表 */
    chatList?: Record[];
    /** 是否正在聊天中 */
    isChatting?: boolean;
    /** 当前应用ID */
    currentApplicationId?: string;
    /** 当前应用头像 */
    currentApplicationAvatar?: string;
    /** 当前应用名称 */
    currentApplicationName?: string;
    /** 当前应用欢迎语 */
    currentApplicationGreeting?: string;
    /** 当前应用推荐问题列表 */
    currentApplicationOpeningQuestions?: string[];
    /** 国际化文本 */
    i18n?: ChatI18n;
    /** ChatItem 国际化文本 */
    chatItemI18n?: ChatItemI18n;
    /** Sender 国际化文本 */
    senderI18n?: SenderI18n;
    /** 是否使用内部录音处理（API 模式） */
    useInternalRecord?: boolean;
    /** ASR URL API 路径 */
    asrUrlApi?: string;
}

const props = withDefaults(defineProps<Props>(), {
    ...chatRelatedPropsDefaults,
    chatId: '',
    chatList: () => [],
    isChatting: false,
    currentApplicationId: '',
    currentApplicationAvatar: '',
    currentApplicationName: '',
    currentApplicationGreeting: '',
    currentApplicationOpeningQuestions: () => [],
    i18n: () => ({}),
    chatItemI18n: () => ({}),
    senderI18n: () => ({}),
    useInternalRecord: false,
    asrUrlApi: ''
});

// 解构 props 以便在模板中使用
const { 
    chatId,
    currentApplicationAvatar, 
    currentApplicationName, 
    currentApplicationGreeting, 
    currentApplicationOpeningQuestions,
    currentApplicationId,
    isChatting,
    isMobile,
    theme,
    useInternalRecord,
    asrUrlApi
} = toRefs(props);

// 合并默认值和传入值
const i18n = computed(() => ({
    ...defaultChatI18n,
    ...props.i18n
}));

const chatItemI18n = computed(() => ({
    ...defaultChatItemI18n,
    ...props.chatItemI18n
}));

const senderI18n = computed(() => ({
    ...defaultSenderI18n,
    ...props.senderI18n
}));

const emit = defineEmits<{
    (e: 'send', query: string, fileList: FileProps[], conversationId: string, applicationId: string): void;
    (e: 'stop'): void;
    (e: 'loadMore', conversationId: string, lastRecordId: string): void;
    (e: 'rate', conversationId: string, recordId: string, score: typeof ScoreValue[keyof typeof ScoreValue]): void;
    (e: 'share', conversationId: string, applicationId: string, recordIds: string[]): void;
    (e: 'copy', rowtext: string | undefined, content: string | undefined, type: string): void;
    (e: 'uploadFile', files: File[]): void;
    (e: 'startRecord'): void;
    (e: 'stopRecord'): void;
    (e: 'message', code: MessageCode, message: string): void;
    (e: 'conversationChange', conversationId: string): void;
}>();

/**
 * 内部聊天列表（用于本地状态管理）
 */
const internalChatList = ref<Record[]>([]);

/**
 * 计算属性：实际使用的聊天列表
 */
const chatList = computed(() => props.chatList.length > 0 ? props.chatList : internalChatList.value);

/**
 * 是否处于选择分享状态
 */
const isSelecting = ref(false)

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
 */
const selectedIds = ref<string[]>([])

/**
 * 发送组件引用
 */
const senderRef = ref<InstanceType<typeof Sender> | null>(null)

/**
 * 聊天加载状态
 */
const loading = ref(false)

/**
 * 消息加载状态
 */
const messageLoading = ref(false)

/**
 * 聊天组件引用
 */
const chatRef = ref<{ scrollToBottom?: (options?: { behavior?: string }) => void } | null>(null)

/**
 * 是否显示回到底部按钮
 */
const isShowToBottom = ref(false)

/**
 * 上次滚动位置
 */
const lastScrollTop = ref(0)

/**
 * 用户是否手动滚动
 */
const hasUserScrolled = ref(false)

/**
 * 滚动到底部
 */
const backToBottom = () => {
    if (!(chatRef.value && chatRef.value.scrollToBottom)) return;
    if (hasUserScrolled.value) return;
    chatRef.value.scrollToBottom({
        behavior: 'smooth',
    });
}

/**
 * 点击回到底部按钮
 */
const handleClickBackToBottom = () => {
    hasUserScrolled.value = false;
    backToBottom()
}

/**
 * 聊天滚动事件
 */
const handleChatScroll = function ({ e }: { e: Event }) {
    if (messageLoading.value) return;
    const scrollTop = (e.target as HTMLElement).scrollTop
    const clientHeight = (e.target as HTMLElement).clientHeight
    const scrollHeight = (e.target as HTMLElement).scrollHeight
    const isToBottom = clientHeight + scrollTop < scrollHeight - 2
    isShowToBottom.value = isToBottom

    if (lastScrollTop.value - scrollTop > 4 && props.isChatting) {
        hasUserScrolled.value = true
    }
    if (!isToBottom) {
        hasUserScrolled.value = false
    }
    lastScrollTop.value = scrollTop
}

/**
 * footer高度观察器
 */
let footerResizeObserver: ResizeObserver | null = null

/**
 * 更新footer高度CSS变量
 */
const updateFooterHeight = () => {
    const footer = document.querySelector('.t-chat__footer') as HTMLElement
    if (footer) {
        const height = footer.offsetHeight
        document.documentElement.style.setProperty('--chat-footer-height', `${height + 60}px`)
    }
}

onMounted(() => {
    nextTick(() => {
        const footer = document.querySelector('.t-chat__footer') as HTMLElement
        if (footer) {
            updateFooterHeight()
            footerResizeObserver = new ResizeObserver(() => {
                updateFooterHeight()
            })
            footerResizeObserver.observe(footer)
        }
    })
})

onUnmounted(() => {
    if (footerResizeObserver) {
        footerResizeObserver.disconnect()
        footerResizeObserver = null
    }
})

/**
 * 设置默认问题
 */
const getDefaultQuestion = (value: string) => {
    inputEnter(value)
}

/**
 * 清空聊天
 */
const clearConfirm = function () {
    internalChatList.value = []
}

/**
 * 停止流式推理
 */
const onStop = function () {
    emit('stop');
}

/**
 * 是否正在加载更多
 */
const isLoadingMore = ref(false);

/**
 * 无限加载状态引用
 */
const infiniteLoadingState = ref<{ loaded: () => void; complete: () => void } | null>(null)

/**
 * 无限加载处理函数
 */
const infiniteHandler = function ($state: { loaded: () => void; complete: () => void }) {
    // 如果没有 chatId，直接返回
    if (!props.chatId) {
        return
    }
    
    // 如果正在聊天中，直接完成加载
    if (props.isChatting) {
        $state.complete()
        return
    }
    
    // 如果正在加载更多，忽略此次调用（不保存状态，让之前的加载继续）
    if (isLoadingMore.value) {
        return
    }
    
    isLoadingMore.value = true
    messageLoading.value = true
    
    // 保存状态引用，供外部调用
    infiniteLoadingState.value = $state
    
    // 获取最早的记录ID
    const firstRecord = chatList.value[0]
    const lastRecordId = chatList.value.length > 0 && firstRecord ? (firstRecord.RecordId ?? '') : ''
    
    // 触发 loadMore 事件，由父组件处理数据加载
    emit('loadMore', props.chatId, lastRecordId)
}

/**
 * 通知无限加载已加载更多数据
 */
const notifyLoaded = () => {
    isLoadingMore.value = false
    messageLoading.value = false
    infiniteLoadingState.value?.loaded()
    infiniteLoadingState.value = null
}

/**
 * 通知无限加载已完成（没有更多数据）
 */
const notifyComplete = () => {
    isLoadingMore.value = false
    messageLoading.value = false
    infiniteLoadingState.value?.complete()
    infiniteLoadingState.value = null
}

/**
 * 发送消息
 */
const inputEnter = function (queryVal: string | undefined, fileList?: FileProps[]) {
    if (props.isChatting) {
        return
    }
    if (!queryVal) return
    
    emit('send', queryVal, fileList || [], props.chatId, props.currentApplicationId);
    senderRef.value && senderRef.value.changeSenderVal('', [])
}

/**
 * 处理发送
 */
const handleSend = (value: string, fileList: FileProps[]) => {
    inputEnter(value, fileList);
}

/**
 * 重新发送消息
 */
const onResend = (RelatedRecordId: string | undefined) => {
    if (!RelatedRecordId) return;
    const related = chatList.value.find((record: Record) => record.RecordId === RelatedRecordId)
    if (!related) {
        return
    }
    inputEnter(related.Content)
}

/**
 * 关闭分享设置
 */
const handleCloseShare = () => {
    isSelecting.value = false
    selectedIds.value = []
}

/**
 * 打开分享设置
 */
const onShare = async (RecordIds: string[]) => {
    let _selectedList = chatList.value.filter(item => (item?.RelatedRecordId && RecordIds.includes(item?.RelatedRecordId)) || RecordIds.includes(item?.RecordId)).map(i => i.RecordId)
    isSelecting.value = true
    selectedIds.value = [...new Set([...selectedIds.value, ..._selectedList])]
}

/**
 * 复制分享链接
 */
const handleCopyShare = async () => {
    if (selectedIds.value.length <= 0) return;
    emit('share', props.chatId, props.currentApplicationId, selectedIds.value);
}

/**
 * 评分
 */
const onRate = (record: Record, score: typeof ScoreValue[keyof typeof ScoreValue]) => {
    emit('rate', props.chatId, record.RecordId, score);
}

/**
 * 复制
 */
const onCopy = (rowtext: string | undefined, content: string | undefined, type: string) => {
    emit('copy', rowtext, content, type);
}

/**
 * 选择/取消选择消息ID
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
 * 处理文件上传
 */
const handleUploadFile = (files: File[]) => {
    emit('uploadFile', files);
}

/**
 * 处理开始录音
 */
const handleStartRecord = () => {
    emit('startRecord');
}

/**
 * 处理停止录音
 */
const handleStopRecord = () => {
    emit('stopRecord');
}

/**
 * 处理消息提示
 */
const handleMessage = (code: MessageCode, message: string) => {
    emit('message', code, message);
}

// 监听chatId变化
watch(
    () => props.chatId,
    (newId) => {
        isSelecting.value = false;
        selectedIds.value = [];
        isLoadingMore.value = false;
        infiniteLoadingState.value = null;
        emit('conversationChange', newId);
    },
    { immediate: true },
)

/**
 * 暴露给父组件的方法
 */
defineExpose({
    clearConfirm,
    getSenderRef: () => senderRef.value,
    notifyLoaded,
    notifyComplete,
    backToBottom,
    setHasUserScrolled: (value: boolean) => { hasUserScrolled.value = value }
})
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

/* 确保 AppType 组件容器有足够高度实现垂直居中 */
:deep(.t-chat__list > div) {
    height: 100%;
}

:deep(.t-chat__list .content) {
    width: 100%;
    max-width: calc(800px + var(--td-size-4));
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
