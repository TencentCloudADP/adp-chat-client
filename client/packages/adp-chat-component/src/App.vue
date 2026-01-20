<!-- 控制尺寸、展开和收起 -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import MainApp from './components/layout/Index.vue';
import type { Application } from './model/application';
import type { ChatConversation, Record } from './model/chat';
import type { FileProps } from './model/file';
import { ScoreValue } from './model/chat';
import type { ApiConfig } from './service/api';
import { defaultApiDetailConfig } from './service/api';
import { getMessage, type MessageCode } from './model/messages';
import { normalizeWidth, normalizeHeight } from './utils/device';
import type { 
    LanguageOption, 
    UserInfo,
    SideI18n, 
    ChatI18n, 
    ChatItemI18n, 
    SenderI18n,
    ChatRelatedProps,
    FullscreenProps
} from './model/type';
import { 
    defaultLanguageOptions,
    chatRelatedPropsDefaults,
    fullscreenPropsDefaults
} from './model/type';

interface Props extends ChatRelatedProps, FullscreenProps {
    /** 挂载容器选择器 */
    container?: string;
    /** 是否显示关闭按钮 */
    isShowCloseButton?: boolean;
    /** 是否显示全屏按钮 */
    isShowFullscreenButton?: boolean;
    /** 是否显示悬浮切换按钮 */
    isShowToggleButton?: boolean;
    /** 是否为浮层模式：true-使用 width/height 浮动在容器上，false-宽高100%撑满容器 */
    isOverlay?: boolean;
    /** 宽度（仅在 isOverlay 为 true 时生效） */
    width?: string | number;
    /** 高度（仅在 isOverlay 为 true 时生效） */
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
    user?: UserInfo;
    /** 语言选项列表 */
    languageOptions?: LanguageOption[];
    /** Logo URL */
    logoUrl?: string;
    /** Logo 标题 */
    logoTitle?: string;
    /** 最大应用显示数量 */
    maxAppLen?: number;
    /** 全屏状态切换回调 */
    onFullscreen?: (isFullscreen: boolean) => void;
    /** 是否展开面板 */
    isOpen?: boolean;
    /** 面板展开状态变化回调 */
    onOpenChange?: (isOpen: boolean) => void;
    /** AI警告文本 */
    aiWarningText?: string;
    /** 侧边栏国际化文本 */
    sideI18n?: SideI18n;
    /** 聊天国际化文本 */
    chatI18n?: ChatI18n;
    /** ChatItem 国际化文本 */
    chatItemI18n?: ChatItemI18n;
    /** Sender 国际化文本 */
    senderI18n?: SenderI18n;
    /** API 配置 - 如果传入则使用 HTTP 请求获取数据 */
    apiConfig?: ApiConfig;
    /** 是否自动加载数据（仅在使用 apiConfig 时生效） */
    autoLoad?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    ...chatRelatedPropsDefaults,
    ...fullscreenPropsDefaults,
    container: 'body',
    isShowCloseButton: true,
    isShowFullscreenButton: true,
    isOverlay: false,
    width: 400,
    height: 640,
    applications: () => [],
    conversations: () => [],
    chatList: () => [],
    isChatting: false,
    user: () => ({}),
    languageOptions: () => defaultLanguageOptions,
    logoUrl: '',
    logoTitle: '',
    maxAppLen: 4,
    onFullscreen: undefined,
    isOpen: undefined,
    onOpenChange: undefined,
    isShowToggleButton: true,
    aiWarningText: '内容由AI生成，仅供参考',
    apiConfig: () => ({ apiDetailConfig: defaultApiDetailConfig }),
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
    (e: 'copy', rowtext: string | undefined, content: string | undefined, type: string): void;
    (e: 'uploadFile', files: File[]): void;
    (e: 'startRecord'): void;
    (e: 'stopRecord'): void;
    (e: 'message', type: 'warning' | 'error' | 'info' | 'success', message: string): void;
    (e: 'conversationChange', conversationId: string): void;
    (e: 'dataLoaded', type: 'applications' | 'conversations' | 'chatList' | 'user', data: any): void;
    (e: 'fullscreen', isFullscreen: boolean): void;
    (e: 'openChange', open: boolean): void;
}>();

const isFullscreen = ref(props.isFullscreen);

// 内部 open 状态，初始化时使用用户传入的值
const internalOpen = ref(props.isOpen ?? false);

// 监听 props.isOpen 变化，同步内部状态
watch(() => props.isOpen, (newVal) => {
    if (newVal !== undefined) {
        internalOpen.value = newVal;
    }
});

// 监听 props.isFullscreen 变化，同步内部状态
watch(() => props.isFullscreen, (newVal) => {
    if (newVal !== undefined) {
        isFullscreen.value = newVal;
    }
});

// 计算实际的 open 状态 - 始终使用内部状态，因为 createApp 传入的 props 是静态的
const isOpen = computed(() => internalOpen.value);

// 设置 open 状态
const setOpen = (value: boolean) => {
    internalOpen.value = value;
    props.onOpenChange?.(value);
    emit('openChange', value);
};

// 计算浮层模式下的样式
const panelParkStyle = computed(() => {
    if (actualIsOverlay.value) {
        const width = typeof actualWidth.value === 'number' ? `${actualWidth.value}px` : actualWidth.value;
        const height = typeof actualHeight.value === 'number' ? `${actualHeight.value}px` : actualHeight.value;
        return {
            width,
            height
        };
    }
    return {};
});

const handleClose = () => {
    setOpen(false);
    emit('close');
};

const handleFullscreen = (_isFullscreen: boolean) => {
    isFullscreen.value = _isFullscreen;
    emit('fullscreen', _isFullscreen);
    props.onFullscreen?.(_isFullscreen);
};

// 计算属性 - 用于响应 props 变化（通过 update 方法更新时）
const actualContainer = computed(() => props.container);
const actualIsShowToggleButton = computed(() => props.isShowToggleButton);
const actualIsOverlay = computed(() => props.isOverlay);
// 规范化宽高：超出屏幕时使用屏幕尺寸减去 padding * 2
const actualWidth = computed(() => actualIsOverlay.value ? normalizeWidth(props.width) : props.width);
const actualHeight = computed(() => actualIsOverlay.value ? normalizeHeight(props.height) : props.height);
const actualApplications = computed(() => props.applications);
const actualCurrentApplication = computed(() => props.currentApplication);
const actualConversations = computed(() => props.conversations);
const actualCurrentConversation = computed(() => props.currentConversation);
const actualChatList = computed(() => props.chatList);
const actualIsChatting = computed(() => props.isChatting);
const actualUser = computed(() => props.user);
const actualTheme = computed(() => props.theme);
const actualLanguageOptions = computed(() => props.languageOptions);
const actualIsSidePanelOverlay = computed(() => props.isSidePanelOverlay);
const actualLogoUrl = computed(() => props.logoUrl);
const actualLogoTitle = computed(() => props.logoTitle);
const actualMaxAppLen = computed(() => props.maxAppLen);
const actualIsShowCloseButton = computed(() => props.isShowCloseButton);
const actualIsShowFullscreenButton = computed(() => props.isShowFullscreenButton);
const actualAiWarningText = computed(() => props.aiWarningText);
const actualSideI18n = computed(() => props.sideI18n);
const actualChatI18n = computed(() => props.chatI18n);
const actualChatItemI18n = computed(() => props.chatItemI18n);
const actualSenderI18n = computed(() => props.senderI18n);
const actualApiConfig = computed(() => props.apiConfig);
const actualAutoLoad = computed(() => props.autoLoad);
</script>

<template>
    <Teleport to="body">
        <div v-if="actualIsShowToggleButton && !isOpen" class="toggle-btn" @click="setOpen(true)">
            <span class="toggle-btn__icon"></span>
        </div>
    </Teleport>

    <Teleport :to="actualContainer">
        <div v-show="isOpen" @keydown.esc="setOpen(false)" tabindex="0"
            :class="[{ 'panel-park--full': !actualIsOverlay, 'panel-park--overlay': actualIsOverlay }]"
            :style="actualIsOverlay ? panelParkStyle : {}">
            <MainApp 
                :applications="actualApplications"
                :currentApplication="actualCurrentApplication"
                :conversations="actualConversations"
                :currentConversation="actualCurrentConversation"
                :chatList="actualChatList"
                :isChatting="actualIsChatting"
                :user="actualUser"
                :theme="actualTheme"
                :languageOptions="actualLanguageOptions"
                :isOverlay="actualIsOverlay"
                :width="actualWidth"
                :height="actualHeight"
                :container="actualContainer"
                :isSidePanelOverlay="actualIsSidePanelOverlay"
                :logoUrl="actualLogoUrl"
                :logoTitle="actualLogoTitle"
                :maxAppLen="actualMaxAppLen"
                :isShowCloseButton="actualIsShowCloseButton"
                :isShowFullscreenButton="actualIsShowFullscreenButton"
                :isFullscreen="isFullscreen"
                :aiWarningText="actualAiWarningText"
                :sideI18n="actualSideI18n"
                :chatI18n="actualChatI18n"
                :chatItemI18n="actualChatItemI18n"
                :senderI18n="actualSenderI18n"
                :apiConfig="actualApiConfig"
                :autoLoad="actualAutoLoad"
                @selectApplication="(app: Application) => emit('selectApplication', app)"
                @selectConversation="(conversation: ChatConversation) => emit('selectConversation', conversation)"
                @createConversation="emit('createConversation')"
                @toggleTheme="emit('toggleTheme')"
                @changeLanguage="(key: string) => emit('changeLanguage', key)"
                @logout="emit('logout')"
                @userClick="emit('userClick')"
                @close="handleClose"
                @fullscreen="handleFullscreen"
                @send="(query: string, fileList: FileProps[], conversationId: string, applicationId: string) => emit('send', query, fileList, conversationId, applicationId)"
                @stop="emit('stop')"
                @loadMore="(conversationId: string, lastRecordId: string) => emit('loadMore', conversationId, lastRecordId)"
                @rate="(conversationId: string, recordId: string, score: typeof ScoreValue[keyof typeof ScoreValue]) => emit('rate', conversationId, recordId, score)"
                @share="(conversationId: string, applicationId: string, recordIds: string[]) => emit('share', conversationId, applicationId, recordIds)"
                @copy="(rowtext: string | undefined, content: string | undefined, type: string) => emit('copy', rowtext, content, type)"
                @uploadFile="(files: File[]) => emit('uploadFile', files)"
                @startRecord="emit('startRecord')"
                @stopRecord="emit('stopRecord')"
                @message="(code: MessageCode, message: string) => emit('message', getMessage(code).type, message)"
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

<!-- 全局样式 - 用于 Teleport 传送后的组件 -->
<style>
/* 根据设计要求重构td */
.t-chat-sender {
  padding: 0;
}
.dropdown-item {
  gap: var(--td-comp-paddingLR-s);
}
.t-chat.t-chat--normal .t-chat__to-bottom {
  bottom: var(--chat-footer-height, 100px);
}
.t-chat.isChatting .t-chat__to-bottom {
  position: relative;
}
.t-chat.isChatting .t-chat__to-bottom::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('./assets/icons/loading.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  animation: rotate 2s linear infinite;
  z-index: 2;
  border-radius: 9999px;
}

/* 自定义滚动条样式 */
@-moz-document url-prefix(){
  .t-chat__list {
    scrollbar-color: var(--td-scrollbar-color) transparent;
    scrollbar-width: thin;
  }
}
.t-chat__list::-webkit-scrollbar {
  width: var(--td-size-4);
  background: transparent;
}
.t-chat__list::-webkit-scrollbar-thumb {
  border: 2px solid transparent;
  background-clip: content-box;
  background-color: var(--td-scrollbar-color);
  border-radius: 15px;
}
.t-chat__list::-webkit-scrollbar-thumb:hover {
  background-color: var(--td-scrollbar-hover-color);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

<style scoped>
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
    height: 100%;
}

.panel-park--overlay {
    /* 宽高由 style 动态设置 */
    border-radius: 8px;
    box-shadow: 0 4px 16px #00000026;

    position: fixed;
    z-index: 999;
    bottom: 0%;
    right: 0%;
    margin: 24px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 16px #00000026;
    overflow: hidden;
}
</style>
