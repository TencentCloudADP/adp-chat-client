<script setup lang="ts">
import { ref } from 'vue';
import type { Application } from '../../model/application';
import type { Record } from '../../model/chat';
import type { FileProps } from '../../model/file';
import { ScoreValue } from '../../model/chat';
import { MessageCode } from '../../model/messages';
import Chat from '../Chat/Index.vue';
import AIWarning from '../AIWarning.vue';
import SidebarToggle from '../SidebarToggle.vue';
import CreateConversation from '../CreateConversation.vue';
import { Avatar as TAvatar, Layout as TLayout, Content as TContent, Header as THeader, Footer as TFooter } from 'tdesign-vue-next';

interface Props {
    /** 当前应用信息 */
    currentApplication?: Application;
    /** 当前应用头像 */
    currentApplicationAvatar?: string;
    /** 尺寸 */
    size?: string;
    /** 当前应用名称 */
    currentApplicationName?: string;
    /** 当前应用欢迎语 */
    currentApplicationGreeting?: string;
    /** 当前应用推荐问题列表 */
    currentApplicationOpeningQuestions?: string[];
    /** 当前应用ID */
    currentApplicationId?: string;
    /** 当前会话ID */
    chatId?: string;
    /** 聊天消息列表 */
    chatList?: Record[];
    /** 是否正在聊天中 */
    isChatting?: boolean;
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
    /** 是否显示侧边栏切换按钮 */
    showSidebarToggle?: boolean;
    /** AI警告文本 */
    aiWarningText?: string;
    /** 新建对话提示文本 */
    createConversationText?: string;
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
    /** 是否使用内部录音处理（API 模式） */
    useInternalRecord?: boolean;
    /** ASR URL API 路径 */
    asrUrlApi?: string;
}

const props = withDefaults(defineProps<Props>(), {
    size: 'small',
    currentApplicationAvatar: '',
    currentApplicationName: '',
    currentApplicationGreeting: '',
    currentApplicationOpeningQuestions: () => [],
    currentApplicationId: '',
    chatId: '',
    chatList: () => [],
    isChatting: false,
    modelOptions: () => [],
    selectModel: null,
    isDeepThinking: true,
    isMobile: false,
    theme: 'light',
    showSidebarToggle: true,
    aiWarningText: '内容由AI生成，仅供参考',
    createConversationText: '新建对话'
});

const emit = defineEmits<{
    (e: 'toggleSidebar'): void;
    (e: 'createConversation'): void;
    (e: 'close'): void;
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
    (e: 'message', code: MessageCode, message: string): void;
    (e: 'conversationChange', conversationId: string): void;
}>();

const chatRef = ref<InstanceType<typeof Chat> | null>(null);

const handleToggleSidebar = () => {
    emit('toggleSidebar');
};

const handleCreateConversation = () => {
    emit('createConversation');
};

/**
 * 通知无限加载已加载更多数据
 */
const notifyLoaded = () => {
    chatRef.value?.notifyLoaded();
};

/**
 * 通知无限加载已完成（没有更多数据）
 */
const notifyComplete = () => {
    chatRef.value?.notifyComplete();
};

defineExpose({
    notifyLoaded,
    notifyComplete,
    getChatRef: () => chatRef.value
});
</script>

<template>
    <t-layout class="main-layout">
        <t-header class="layout-header">
            <div class="header-app-container">
                <SidebarToggle v-if="showSidebarToggle" @toggle="handleToggleSidebar" />
                <t-avatar :imageProps="{
                    lazy: true,
                    loading: ''
                }" class="header-app__avatar" shape="round" :image="currentApplicationAvatar" :size="isMobile ? 'var(--td-line-height-headline-small)' : 'large'"></t-avatar>
                <span class="header-app__title">{{ currentApplicationName }}</span>
            </div>
            <div class="header-app-settings">
                <CreateConversation :tooltipText="createConversationText" @create="handleCreateConversation" />
                <slot name="header-fullscreen-content"></slot>
                <slot name="header-close-content"></slot>
            </div>
        </t-header>
        <t-content class="layout-content">
            <Chat 
                ref="chatRef"
                :chatId="chatId"
                :chatList="chatList"
                :isChatting="isChatting"
                :currentApplicationId="currentApplicationId"
                :currentApplicationAvatar="currentApplicationAvatar"
                :currentApplicationName="currentApplicationName"
                :currentApplicationGreeting="currentApplicationGreeting"
                :currentApplicationOpeningQuestions="currentApplicationOpeningQuestions"
                :modelOptions="modelOptions"
                :selectModel="selectModel"
                :isDeepThinking="isDeepThinking"
                :isMobile="isMobile"
                :theme="theme"
                :i18n="i18n"
                :chatItemI18n="chatItemI18n"
                :senderI18n="senderI18n"
                :useInternalRecord="useInternalRecord"
                :asrUrlApi="asrUrlApi"
                @send="(query, fileList, conversationId, applicationId) => emit('send', query, fileList, conversationId, applicationId)"
                @stop="emit('stop')"
                @loadMore="(conversationId, lastRecordId) => emit('loadMore', conversationId, lastRecordId)"
                @rate="(conversationId, recordId, score) => emit('rate', conversationId, recordId, score)"
                @share="(conversationId, applicationId, recordIds) => emit('share', conversationId, applicationId, recordIds)"
                @copy="(content, type) => emit('copy', content, type)"
                @modelChange="(option) => emit('modelChange', option)"
                @toggleDeepThinking="emit('toggleDeepThinking')"
                @uploadFile="(files) => emit('uploadFile', files)"
                @startRecord="emit('startRecord')"
                @stopRecord="emit('stopRecord')"
                @message="(code, message) => emit('message', code, message)"
                @conversationChange="(conversationId) => emit('conversationChange', conversationId)"
            >
                <template #empty-content>
                    <slot name="empty-content"></slot>
                </template>
            </Chat>
        </t-content>
        <t-footer class="layout-footer">
            <AIWarning :text="aiWarningText" />
        </t-footer>
    </t-layout>
</template>

<style scoped>
.main-layout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--td-bg-color-container);
}

.layout-header {
    flex-shrink: 0;
    display: flex;
    padding: var(--td-pop-padding-xl) var(--td-comp-paddingLR-xl);
    justify-content: space-between;
}
.header-app-settings{
    display: flex;
}

.layout-header .header-app-settings svg {
    cursor: pointer;
    margin-left: var(--td-comp-margin-s);
}

.layout-header .header-app__avatar{
    border-radius: var(--td-radius-medium)
}
.layout-header .header-app__title {
    color: var(--td-text-color-primary);
    font-size: var(--td-font-size-link-large);
    font-weight: 500;
    margin-left: var(--td-comp-margin-s);
}

.layout-content {
    flex: 1;
    overflow: auto;
}

.layout-footer {
    flex-shrink: 0;
    padding: var(--td-pop-padding-l);
}
.header-app-container{
    display: flex;
    align-items: center;
}
:deep(.t-chat__footer){
    position: relative;
}
:deep(.content .t-chat__content, .content .t-chat__detail-reasoning){
    padding-top: 0;
}
:deep(.content .t-chat__inner){
    margin-bottom: 0;
}
</style>
