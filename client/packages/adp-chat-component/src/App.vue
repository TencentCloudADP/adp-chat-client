<!-- 控制尺寸、展开和收起 -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import MainApp from './components/layout/Index.vue';
import type { Application } from './model/application';
import type { ChatConversation, Record } from './model/chat';
import type { FileProps } from './model/file';
import { ScoreValue } from './model/chat';
import type { ApiConfig } from './service/api';
import { defaultApiConfig } from './service/api';

interface LanguageOption {
    key: string;
    value: string;
}

interface Props {
    /** 挂载容器选择器 */
    container?: string;
    /** 是否可停靠模式 */
    canPark?: boolean;
    /** 模式类型：full-全屏模式，compact-紧凑模式（固定宽高） */
    modelType?: 'full' | 'compact';
    /** 宽度（仅在 modelType 为 compact 时生效） */
    width?: string | number;
    /** 高度（仅在 modelType 为 compact 时生效） */
    height?: string | number;
    /** 应用列表 */
    applications?: Application[];
    /** 当前选中的应用 */
    currentApplication?: Application;
    /** 会话列表 */
    conversations?: ChatConversation[];
    /** 当前选中的会话 */
    currentConversation?: ChatConversation;
    /** 聊天消息列表 */
    chatList?: Record[];
    /** 是否正在聊天中 */
    isChatting?: boolean;
    /** 用户信息 */
    user?: {
        avatarUrl?: string;
        avatarName?: string;
        name?: string;
    };
    /** 主题模式 */
    theme?: 'light' | 'dark';
    /** 语言选项列表 */
    languageOptions?: LanguageOption[];
    /** 是否为移动端 */
    isMobile?: boolean;
    /** Logo URL */
    logoUrl?: string;
    /** Logo 标题 */
    logoTitle?: string;
    /** 模型选项列表 */
    modelOptions?: any[];
    /** 当前选中的模型 */
    selectModel?: any;
    /** 是否启用深度思考模式 */
    isDeepThinking?: boolean;
    /** 最大应用显示数量 */
    maxAppLen?: number;
    /** AI警告文本 */
    aiWarningText?: string;
    /** 新建对话提示文本 */
    createConversationText?: string;
    /** 侧边栏国际化文本 */
    sideI18n?: {
        more?: string;
        collapse?: string;
        today?: string;
        recent?: string;
        switchTheme?: string;
        selectLanguage?: string;
        logout?: string;
    };
    /** 聊天国际化文本 */
    chatI18n?: {
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
    /** API 配置 - 如果传入则使用 HTTP 请求获取数据 */
    apiConfig?: ApiConfig;
    /** 是否自动加载数据（仅在使用 apiConfig 时生效） */
    autoLoad?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    container: 'body',
    canPark: false,
    modelType: 'full',
    width: 400,
    height: 600,
    applications: () => [],
    conversations: () => [],
    chatList: () => [],
    isChatting: false,
    user: () => ({}),
    theme: 'light',
    languageOptions: () => [
        { key: 'zh-CN', value: '简体中文' },
        { key: 'en-US', value: 'English' }
    ],
    isMobile: false,
    logoUrl: '',
    logoTitle: '',
    modelOptions: () => [],
    selectModel: null,
    isDeepThinking: true,
    maxAppLen: 4,
    aiWarningText: '内容由AI生成，仅供参考',
    createConversationText: '新建对话',
    apiConfig: () => defaultApiConfig,
    autoLoad: true,
});

const emit = defineEmits<{
    (e: 'selectApplication', app: Application): void;
    (e: 'selectConversation', conversation: ChatConversation): void;
    (e: 'createConversation'): void;
    (e: 'toggleTheme'): void;
    (e: 'changeLanguage', key: string): void;
    (e: 'logout'): void;
    (e: 'userClick'): void;
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
    (e: 'message', type: 'warning' | 'error' | 'info' | 'success', message: string): void;
    (e: 'conversationChange', conversationId: string): void;
    (e: 'dataLoaded', type: 'applications' | 'conversations' | 'chatList' | 'user', data: any): void;
}>();

const popup = ref(!props.canPark);
const open = ref(false);

// 计算 panel-park 在 compact 模式下的样式
const panelParkStyle = computed(() => {
    if (props.modelType === 'compact') {
        const width = typeof props.width === 'number' ? `${props.width}px` : props.width;
        const height = typeof props.height === 'number' ? `${props.height}px` : props.height;
        return {
            width,
            height
        };
    }
    return {};
});

const handleClose = () => {
    open.value = false;
    emit('close');
};
</script>

<template>
    <Teleport to="body">
        <div v-if="!open" class="toggle-btn" @click="open = !open">
            <span class="toggle-btn__icon"></span>
        </div>
    </Teleport>

    <Teleport :to="container">
        <div v-show="open" @keydown.esc="open = false" tabindex="0"
            :class="[{ 'panel-popup': popup, 'panel-park': !popup, 'panel-park--full': !popup && modelType === 'full', 'panel-park--compact': !popup && modelType === 'compact' }]"
            :style="!popup && modelType === 'compact' ? panelParkStyle : {}">
            <MainApp 
                :applications="applications"
                :currentApplication="currentApplication"
                :conversations="conversations"
                :currentConversation="currentConversation"
                :chatList="chatList"
                :isChatting="isChatting"
                :user="user"
                :theme="theme"
                :languageOptions="languageOptions"
                :isMobile="isMobile"
                :logoUrl="logoUrl"
                :logoTitle="logoTitle"
                :modelOptions="modelOptions"
                :selectModel="selectModel"
                :isDeepThinking="isDeepThinking"
                :maxAppLen="maxAppLen"
                :showCloseButton="canPark"
                :aiWarningText="aiWarningText"
                :createConversationText="createConversationText"
                :sideI18n="sideI18n"
                :chatI18n="chatI18n"
                :chatItemI18n="chatItemI18n"
                :senderI18n="senderI18n"
                :apiConfig="apiConfig"
                :autoLoad="autoLoad"
                @selectApplication="(app: Application) => emit('selectApplication', app)"
                @selectConversation="(conversation: ChatConversation) => emit('selectConversation', conversation)"
                @createConversation="emit('createConversation')"
                @toggleTheme="emit('toggleTheme')"
                @changeLanguage="(key: string) => emit('changeLanguage', key)"
                @logout="emit('logout')"
                @userClick="emit('userClick')"
                @close="handleClose"
                @send="(query: string, fileList: FileProps[], conversationId: string, applicationId: string) => emit('send', query, fileList, conversationId, applicationId)"
                @stop="emit('stop')"
                @loadMore="(conversationId: string, lastRecordId: string) => emit('loadMore', conversationId, lastRecordId)"
                @rate="(conversationId: string, recordId: string, score: typeof ScoreValue[keyof typeof ScoreValue]) => emit('rate', conversationId, recordId, score)"
                @share="(conversationId: string, applicationId: string, recordIds: string[]) => emit('share', conversationId, applicationId, recordIds)"
                @copy="(content: string | undefined, type: string) => emit('copy', content, type)"
                @modelChange="(option: any) => emit('modelChange', option)"
                @toggleDeepThinking="emit('toggleDeepThinking')"
                @uploadFile="(files: File[]) => emit('uploadFile', files)"
                @startRecord="emit('startRecord')"
                @stopRecord="emit('stopRecord')"
                @message="(type: 'warning' | 'error' | 'info' | 'success', message: string) => emit('message', type, message)"
                @conversationChange="(conversationId: string) => emit('conversationChange', conversationId)"
                @dataLoaded="(type: 'applications' | 'conversations' | 'chatList' | 'user', data: any) => emit('dataLoaded', type, data)"
            >
                <template #sider-logo>
                    <slot name="sider-logo"></slot>
                </template>
            </MainApp>
        </div>
    </Teleport>
</template>

<style scoped>
/* 根据设计要求重构td */
:deep(.t-chat-sender){
  padding:0;
}
:deep(.dropdown-item){
    gap: var(--td-comp-paddingLR-s);
}
/* content自定义 */
:deep(.t-chat__detail-reasoning .t-collapse-panel__body){
    background: transparent;
    background-color: transparent;
}
.content {
    display: flex;
}

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

.toggle-btn__icon{
    display: inline-block;
    height:32px;
    width: 32px;
    background-size: contain;
    background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M3.62396 6.12253C3.33331 6.69296 3.33331 7.4397 3.33331 8.93317V17.9998V20.3998V28.2856L8.42841 24.6665H24.4C25.8935 24.6665 26.6402 24.6665 27.2106 24.3759C27.7124 24.1202 28.1203 23.7122 28.376 23.2105C28.6666 22.64 28.6666 21.8933 28.6666 20.3998V8.93317C28.6666 7.4397 28.6666 6.69296 28.376 6.12253C28.1203 5.62076 27.7124 5.21282 27.2106 4.95715C26.6402 4.6665 25.8935 4.6665 24.4 4.6665H7.59998C6.10651 4.6665 5.35977 4.6665 4.78934 4.95715C4.28757 5.21282 3.87962 5.62076 3.62396 6.12253ZM10.6666 11.9998C10.6666 11.6892 10.6666 11.5339 10.7174 11.4114C10.7851 11.248 10.9148 11.1182 11.0782 11.0506C11.2007 10.9998 11.356 10.9998 11.6666 10.9998H20.3333C20.6439 10.9998 20.7993 10.9998 20.9218 11.0506C21.0851 11.1182 21.2149 11.248 21.2826 11.4114C21.3333 11.5339 21.3333 11.6892 21.3333 11.9998C21.3333 12.3105 21.3333 12.4658 21.2826 12.5883C21.2149 12.7516 21.0851 12.8814 20.9218 12.9491C20.7993 12.9998 20.6439 12.9998 20.3333 12.9998H11.6666C11.356 12.9998 11.2007 12.9998 11.0782 12.9491C10.9148 12.8814 10.7851 12.7516 10.7174 12.5883C10.6666 12.4658 10.6666 12.3105 10.6666 11.9998ZM10.7174 16.7447C10.6666 16.8672 10.6666 17.0225 10.6666 17.3332C10.6666 17.6438 10.6666 17.7991 10.7174 17.9216C10.7851 18.085 10.9148 18.2148 11.0782 18.2824C11.2007 18.3332 11.356 18.3332 11.6666 18.3332H20.3333C20.6439 18.3332 20.7993 18.3332 20.9218 18.2824C21.0851 18.2148 21.2149 18.085 21.2826 17.9216C21.3333 17.7991 21.3333 17.6438 21.3333 17.3332C21.3333 17.0225 21.3333 16.8672 21.2826 16.7447C21.2149 16.5814 21.0851 16.4516 20.9218 16.3839C20.7993 16.3332 20.6439 16.3332 20.3333 16.3332H11.6666C11.356 16.3332 11.2007 16.3332 11.0782 16.3839C10.9148 16.4516 10.7851 16.5814 10.7174 16.7447Z' fill='%2300010A' fill-opacity='0.93' style='fill:%2300010A;fill:color(display-p3 0.0000 0.0039 0.0392);fill-opacity:0.93;'/%3E%3C/svg%3E%0A");
}

.toggle-btn {
    position: fixed;
    z-index: 999;
    bottom: 0%;
    right: 0%;
    margin: 24px;
    width: 48px;
    height: 48px;
    cursor: pointer;
    border-radius: 100%;
    background-color: #ffffff80;
    border: #dcdcdc 1px solid;
    box-shadow: 0 1px 44px #00000026;
    user-select: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
}

.toggle-btn:hover {
    border: #d0d0d0 1px solid;
    transform: scale(1.1);
}

.panel-park {
    background: white;
    box-sizing: border-box;
    overflow: hidden;
}

.panel-park--full {
    width: 100%;
    height: 100vh;
}

.panel-park--compact {
    /* 宽高由 style 动态设置 */
    border-radius: 8px;
    box-shadow: 0 4px 16px #00000026;
}

.panel-popup {
    position: fixed;
    z-index: 999;
    bottom: 0%;
    right: 0%;
    width: 400px;
    height: 600px;
    margin: 24px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 16px #00000026;
    overflow: hidden;
}
</style>
