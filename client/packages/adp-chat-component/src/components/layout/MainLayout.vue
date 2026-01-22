<script setup lang="ts">
import { ref, computed } from 'vue';
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

// TAvatar, TLayout, TContent, THeader, TFooter 已导入，模板中使用对应组件
import type { ChatRelatedProps, ChatI18n, ChatItemI18n, SenderI18n } from '../../model/type';
import { chatRelatedPropsDefaults, defaultChatI18n } from '../../model/type';

export interface Props extends ChatRelatedProps {
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
    /** 是否显示侧边栏切换按钮 */
    showSidebarToggle?: boolean;
    /** AI警告文本 */
    aiWarningText?: string;
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
    size: 'small',
    currentApplicationAvatar: '',
    currentApplicationName: '',
    currentApplicationGreeting: '',
    currentApplicationOpeningQuestions: () => [],
    currentApplicationId: '',
    chatId: '',
    chatList: () => [],
    isChatting: false,
    showSidebarToggle: true,
    aiWarningText: '内容由AI生成，仅供参考',
});

// 合并 i18n 配置，获取 createConversation 文本
const createConversationText = computed(() => 
    props.i18n?.createConversation ?? defaultChatI18n.createConversation
);

const emit = defineEmits<{
    (e: 'toggleSidebar'): void;
    (e: 'createConversation'): void;
    (e: 'close'): void;
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
    <TLayout class="main-layout">
        <THeader class="layout-header">
            <div class="header-app-container">
                <SidebarToggle :theme="theme" v-if="showSidebarToggle" @toggle="handleToggleSidebar" />
                <TAvatar :imageProps="{
                    lazy: true,
                    loading: ''
                }" class="header-app__avatar" shape="round" :image="currentApplicationAvatar" :size="isMobile ? 'var(--td-line-height-headline-small)' : 'large'"></TAvatar>
                <span class="header-app__title">{{ currentApplicationName }}</span>
            </div>
            <div class="header-app-settings">
                <CreateConversation :tooltipText="createConversationText" :theme="theme" @create="handleCreateConversation" />
                <slot name="header-overlay-content"></slot>
                <slot name="header-close-content"></slot>
            </div>
        </THeader>
        <TContent class="layout-content">
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
                @copy="(rowtext, content, type) => emit('copy', rowtext, content, type)"
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
        </TContent>
        <TFooter class="layout-footer">
            <AIWarning :text="aiWarningText" />
        </TFooter>
    </TLayout>
</template>


<style scoped>
@import '../../styles/chat-overrides.css';
.main-layout {
    flex: 1;
    min-width: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--td-bg-color-container);
    overflow: hidden;
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

/* content自定义 - 从 App.vue 移入，使用 :deep() 确保 build 后生效 */
:deep(.t-chat__detail-reasoning .t-collapse-panel__body) {
    background: transparent;
    background-color: transparent;
}
:deep(.t-chat__detail-reasoning .t-collapse-panel__wrapper) {
    background: transparent;
    background-color: transparent;
}
:deep(.t-chat__detail-reasoning .t-collapse-panel__content) {
    background: transparent;
    background-color: transparent;
    padding: 0 0 var(--td-comp-paddingTB-m) 0;
}
:deep(.t-chat__detail-reasoning .t-collapse-panel__header--blank) {
    display: none;
}
:deep(.t-chat__detail-reasoning .t-collapse-panel__icon) {
    transform: rotate(180deg);
}
:deep(.assistant .t-chat__detail) {
    max-width: 100%;
    width: 100%;
}
:deep(.isMobile .t-chat__content) {
    margin-left: 0;
}
:deep(.t-chat__detail-reasoning .t-collapse-panel) {
    margin-left: 0;
}
:deep(.t-chat__detail-reasoning .t-collapse-panel__header) {
    padding: 0;
}
:deep(.t-chat__text--variant--text .t-chat__detail-reasoning) {
    padding-top: 0;
}
:deep(.t-chat__text .other__model-change) {
    background-color: transparent;
    padding-left: var(--td-comp-paddingTB-s);
    text-align: left;
}
:deep(.t-chat__text .other__system) {
    background-color: transparent;
    padding-left: var(--td-comp-paddingTB-s);
    text-align: left;
}
</style>
