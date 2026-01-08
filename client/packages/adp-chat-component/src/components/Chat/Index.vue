<!--
  聊天主界面组件
  @description 用于展示聊天内容、发送消息和加载历史记录
-->
<template>
    <!-- 聊天内容容器 -->
    <div id="chat-content" class="chat-box">
        <!-- 聊天组件 -->
        <TChat :reverse="false" style="height: 100%" :clear-history="false"
            @clear="clearConfirm">
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
                    <div v-if="messageLoading" class="loading-more">
                        <t-loading size="small">
                            <template #text>
                                <span class="thinking-text">
                                    {{ `${i18n.loading}...` }}
                                </span>
                            </template>
                            <template #indicator>
                                <CustomizedIcon class="thinking-icon" name="thinking" :theme="theme" />
                            </template>
                        </t-loading>
                    </div>
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
                <t-card v-if="isSelecting" size="small" class="share-setting-container" shadow
                    bodyClassName="share-setting-card">
                    <div class="share-setting-content">
                        <t-checkbox :indeterminate="selectedIds.length !== chatList.length && selectedIds.length !== 0"
                            :checked="checkall" @change="handleCheckAll">{{ i18n.checkAll }}</t-checkbox>
                        <t-divider layout="vertical"></t-divider>
                        <div class="share-text">
                            {{ i18n.shareFor }}
                            <div class="icon__share-copy" :class="{ disabled: selectedIds.length <= 0 }"
                                @click="handleCopyShare()">
                                <CustomizedIcon name="copy_link" :theme="theme" />
                                <span>{{ i18n.copyUrl }}</span>
                            </div>
                        </div>
                        <t-divider layout="vertical"></t-divider>
                        <div class="icon__share-close" @click="handleCloseShare()">
                            <span>{{ i18n.cancelShare }}</span>
                        </div>
                    </div>
                </t-card>
                <Sender 
                    ref="senderRef" 
                    :modelOptions="modelOptions" 
                    :selectModel="selectModel"
                    :isDeepThinking="isDeepThinking" 
                    :isStreamLoad="isStreamLoad" 
                    :isMobile="isMobile"
                    :theme="theme"
                    :i18n="senderI18n"
                    @stop="onStop"
                    @send="handleSend" 
                    @modelChange="handleModelChange"
                    @toggleDeepThinking="toggleDeepThinking"
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
import { ref, watch, computed } from 'vue'
import { ChatList as TChat } from '@tdesign-vue-next/chat'
import { Checkbox } from 'tdesign-vue-next'
import type { Record } from '../../model/chat'
import { ScoreValue } from '../../model/chat'
import type { FileProps } from '../../model/file';
import { modelOptions as defaultModelOptions, defaultModel } from '../../model/models'

import AppType from './AppType.vue'
import Sender from './Sender.vue'
import ChatItem from './ChatItem.vue'
import CustomizedIcon from '../CustomizedIcon.vue';

interface Props {
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
    /** 模型选项列表 */
    modelOptions?: any[];
    /** 当前选中的模型 */
    selectModel?: any;
    /** 是否启用深度思考模式 */
    isDeepThinking?: boolean;
    /** 是否为移动端 */
    isMobile?: boolean;
    /** 主题模式 */
    theme?: 'light' | 'dark';
    /** 国际化文本 */
    i18n?: {
        loading?: string;
        thinking?: string;
        checkAll?: string;
        shareFor?: string;
        copyUrl?: string;
        cancelShare?: string;
        sendError?: string;
        networkError?: string;
    };
    /** ChatItem 国际化文本 */
    chatItemI18n?: {
        thinking?: string;
        deepThinkingFinished?: string;
        deepThinkingExpand?: string;
        copy?: string;
        replay?: string;
        share?: string;
        good?: string;
        bad?: string;
        thxForGood?: string;
        thxForBad?: string;
        references?: string;
    };
    /** Sender 国际化文本 */
    senderI18n?: {
        placeholder?: string;
        placeholderMobile?: string;
        uploadImg?: string;
        startRecord?: string;
        stopRecord?: string;
        answering?: string;
        notSupport?: string;
        uploadError?: string;
        recordTooLong?: string;
    };
}

const props = withDefaults(defineProps<Props>(), {
    chatId: '',
    chatList: () => [],
    isChatting: false,
    currentApplicationId: '',
    currentApplicationAvatar: '',
    currentApplicationName: '',
    currentApplicationGreeting: '',
    currentApplicationOpeningQuestions: () => [],
    modelOptions: () => defaultModelOptions,
    selectModel: () => defaultModel,
    isDeepThinking: true,
    isMobile: false,
    theme: 'light',
    i18n: () => ({
        loading: '加载中',
        thinking: '思考中',
        checkAll: '全选',
        shareFor: '分享至',
        copyUrl: '复制链接',
        cancelShare: '取消分享',
        sendError: '发送失败',
        networkError: '网络错误'
    }),
    chatItemI18n: () => ({
        thinking: '思考中',
        deepThinkingFinished: '深度思考完成',
        deepThinkingExpand: '展开深度思考',
        copy: '复制',
        replay: '重新生成',
        share: '分享',
        good: '点赞',
        bad: '踩',
        thxForGood: '感谢您的反馈',
        thxForBad: '感谢您的反馈',
        references: '参考来源'
    }),
    senderI18n: () => ({
        placeholder: '请输入您的问题',
        placeholderMobile: '请输入',
        uploadImg: '上传图片',
        startRecord: '开始录音',
        stopRecord: '停止录音',
        answering: '正在回答中...',
        notSupport: '不支持的文件格式',
        uploadError: '上传失败',
        recordTooLong: '录音时间过长'
    })
});

const emit = defineEmits<{
    (e: 'send', query: string, fileList: FileProps[], conversationId: string, applicationId: string): void;
    (e: 'stop'): void;
    (e: 'loadMore', conversationId: string, lastRecordId: string): void;
    (e: 'rate', conversationId: string, recordId: string, score: typeof ScoreValue[keyof typeof ScoreValue]): void;
    (e: 'share', conversationId: string, applicationId: string, recordIds: string[]): void;
    (e: 'copy', content: string | undefined, type: string): void;
    (e: 'modelChange', option: any): void;
    (e: 'toggleDeepThinking'): void;
    (e: 'uploadFile', files: File[]): void;
    (e: 'startRecord'): void;
    (e: 'stopRecord'): void;
    (e: 'message', type: 'warning' | 'error' | 'info' | 'success', message: string): void;
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
 * 是否流式加载中
 */
const isStreamLoad = ref(false)

/**
 * 设置默认问题
 */
const getDefaultQuestion = (value: string) => {
    inputEnter(value)
}

/**
 * 切换模型
 */
const handleModelChange = (option: any) => {
    emit('modelChange', option);
}

/**
 * 切换深度思考状态
 */
const toggleDeepThinking = () => {
    emit('toggleDeepThinking');
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
 * 发送消息
 */
const inputEnter = function (queryVal: string | undefined, fileList?: FileProps[]) {
    if (isStreamLoad.value) {
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
const onCopy = (content: string | undefined, type: string) => {
    emit('copy', content, type);
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
const handleMessage = (type: 'warning' | 'error' | 'info', message: string) => {
    emit('message', type, message);
}

// 监听chatId变化
watch(
    () => props.chatId,
    (newId) => {
        isSelecting.value = false;
        selectedIds.value = [];
        emit('conversationChange', newId);
    },
    { immediate: true },
)

/**
 * 暴露给父组件的方法
 */
defineExpose({
    clearConfirm,
    getSenderRef: () => senderRef.value
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

.loading-more {
    display: flex;
    justify-content: center;
    padding: var(--td-comp-paddingTB-l);
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
