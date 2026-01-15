<!-- 控制尺寸、展开和收起 -->
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Layout as TLayout, Content as TContent, MessagePlugin } from 'tdesign-vue-next';
import MainLayout from './MainLayout.vue';
import SideLayout from './SideLayout.vue';
import LogoArea from '../LogoArea.vue';
import CustomizedIcon from '../CustomizedIcon.vue';
import type { Application } from '../../model/application';
import type { ChatConversation, Record } from '../../model/chat';
import type { FileProps } from '../../model/file';
import { ScoreValue } from '../../model/chat';
import type { ApiConfig } from '../../service/api';
import {
    fetchApplicationList,
    fetchConversationList,
    fetchConversationDetail,
    sendMessage,
    rateMessage,
    createShare,
    fetchUserInfo,
    uploadFile,
} from '../../service/api';
import { MessageCode, getMessage } from '../../model/messages';
import { fetchSSE } from '../../model/sseRequest-reasoning';
import { mergeRecord } from '../../utils/util';
import { copyToClipboard } from '../../utils/clipboard';

interface LanguageOption {
    key: string;
    value: string;
}

interface Props {
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
    /** 是否显示关闭按钮 */
    showCloseButton?: boolean;
    /** 是否显示全屏按钮 */
    showFullscreenButton?: boolean;
    /** 是否处于全屏状态 */
    isFullscreen?: boolean;
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
    showCloseButton: false,
    showFullscreenButton: false,
    isFullscreen: false,
    aiWarningText: '内容由AI生成，仅供参考',
    createConversationText: '新建对话',
    apiConfig: undefined,
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
    (e: 'fullscreen', isFullscreen: boolean): void;
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
    (e: 'dataLoaded', type: 'applications' | 'conversations' | 'chatList' | 'user', data: any): void;
}>();

const sidebarVisible = ref(!props.isMobile);
const mainLayoutRef = ref<InstanceType<typeof MainLayout> | null>(null);

// 监听 isMobile 变化，自动调整侧边栏状态
watch(() => props.isMobile, (newVal) => {
    sidebarVisible.value = !newVal;
});

// 内部数据状态（当使用 API 时）
const internalApplications = ref<Application[]>([]);
const internalConversations = ref<ChatConversation[]>([]);
const internalChatList = ref<Record[]>([]);
const internalUser = ref<{ avatarUrl?: string; avatarName?: string; name?: string }>({});
const internalCurrentApplication = ref<Application | undefined>(undefined);
const internalCurrentConversation = ref<ChatConversation | undefined>(undefined);
const internalIsChatting = ref(false);
const abortController = ref<AbortController | null>(null);

// 判断是否使用 API 模式
const useApiMode = computed(() => !!props.apiConfig);

// 实际使用的数据（优先使用 props，否则使用内部数据）
const actualApplications = computed(() => 
    props.applications.length > 0 ? props.applications : internalApplications.value
);
const actualConversations = computed(() => 
    props.conversations.length > 0 ? props.conversations : internalConversations.value
);
const actualChatList = computed(() => 
    props.chatList.length > 0 ? props.chatList : internalChatList.value
);
const actualUser = computed(() => 
    (props.user && Object.keys(props.user).length > 0) ? props.user : internalUser.value
);
const actualCurrentApplication = computed(() => 
    props.currentApplication || internalCurrentApplication.value
);
const actualCurrentConversation = computed(() => 
    props.currentConversation || internalCurrentConversation.value
);
const actualIsChatting = computed(() => 
    props.isChatting || internalIsChatting.value
);

// 计算属性
const currentApplicationId = computed(() => actualCurrentApplication.value?.ApplicationId || '');
const currentApplicationAvatar = computed(() => actualCurrentApplication.value?.Avatar || '');
const currentApplicationName = computed(() => actualCurrentApplication.value?.Name || '');
const currentApplicationGreeting = computed(() => actualCurrentApplication.value?.Greeting || '');
const currentApplicationOpeningQuestions = computed(() => actualCurrentApplication.value?.OpeningQuestions || []);
const currentConversationId = computed(() => actualCurrentConversation.value?.Id || '');

// API 数据加载方法
const loadApplications = async () => {
    if (!useApiMode.value) return;
    try {
        const data = await fetchApplicationList(props.apiConfig?.applicationListApi);
        internalApplications.value = data;
        // 默认选中第一个应用
        if (data.length > 0 && !internalCurrentApplication.value) {
            internalCurrentApplication.value = data[0];
        }
        emit('dataLoaded', 'applications', data);
    } catch (error) {
        const msg = getMessage(MessageCode.GET_APP_LIST_FAILED);
        MessagePlugin[msg.type](msg.message);
        emit('message', MessageCode.GET_APP_LIST_FAILED, msg.message);
    }
};

const loadConversations = async () => {
    if (!useApiMode.value) return;
    try {
        const data = await fetchConversationList(props.apiConfig?.conversationListApi);
        internalConversations.value = data;
        emit('dataLoaded', 'conversations', data);
    } catch (error) {
        const msg = getMessage(MessageCode.GET_CONVERSATION_LIST_FAILED);
        MessagePlugin[msg.type](msg.message);
        emit('message', MessageCode.GET_CONVERSATION_LIST_FAILED, msg.message);
    }
};

const loadConversationDetail = async (conversationId: string) => {
    if (!useApiMode.value || !conversationId) return;
    try {
        const response = await fetchConversationDetail(
            { ConversationId: conversationId },
            props.apiConfig?.conversationDetailApi
        );
        internalChatList.value = response?.Response?.Records || [];
        emit('dataLoaded', 'chatList', internalChatList.value);
    } catch (error) {
        const msg = getMessage(MessageCode.GET_CONVERSATION_DETAIL_FAILED);
        MessagePlugin[msg.type](msg.message);
        emit('message', MessageCode.GET_CONVERSATION_DETAIL_FAILED, msg.message);
    }
};

const loadUserInfo = async () => {
    if (!useApiMode.value) return;
    try {
        const data = await fetchUserInfo(props.apiConfig?.userInfoApi);
        internalUser.value = {
            avatarUrl: data.Avatar,
            avatarName: data.Name?.charAt(0) || '',
            name: data.Name,
        };
        emit('dataLoaded', 'user', internalUser.value);
    } catch (error) {
        // 用户信息获取失败不影响主流程
        console.error('获取用户信息失败:', error);
    }
};

// 内部发送消息处理（API 模式）
const handleInternalSend = async (query: string, fileList: FileProps[], conversationId: string, applicationId: string) => {
    if (!useApiMode.value) {
        emit('send', query, fileList, conversationId, applicationId);
        return;
    }

    internalIsChatting.value = true;

    // 创建用户消息占位
    const userRecord: Record = {
        RecordId: 'placeholder-user',
        Content: query,
        IsFromSelf: true,
        Timestamp: Date.now(),
        FileInfos: fileList,
    };
    internalChatList.value.push(userRecord);

    // 创建助手消息占位
    const assistantRecord: Record = {
        RecordId: 'placeholder-agent',
        Content: '',
        IsFromSelf: false,
        Timestamp: Date.now(),
    };
    internalChatList.value.push(assistantRecord);

    abortController.value = new AbortController();

    await fetchSSE(
        () => {
            return sendMessage(
                {
                    Query: query,
                    ConversationId: conversationId || undefined,
                    ApplicationId: applicationId,
                    FileInfos: fileList,
                },
                { signal: abortController.value?.signal },
                props.apiConfig?.sendMessageApi
            );
        },
        {
            success(result) {
                if (result.type === 'conversation') {
                    // 创建新的对话，重新调用 chatlist 接口更新列表
                    loadConversations();
                    if (result.data.IsNewConversation) {
                        internalCurrentConversation.value = result.data;
                    }
                } else {
                    const record: Record = result.data;
                    if (result.type === 'reply' && record.IsFromSelf) {
                        // 替换用户消息占位
                        const index = internalChatList.value.findIndex(item => item.RecordId === 'placeholder-user');
                        if (index !== -1) {
                            internalChatList.value.splice(index, 1, record);
                        }
                    } else {
                        const lastIndex = internalChatList.value.length - 1;
                        const lastRecord = internalChatList.value[lastIndex];
                        if (lastRecord && lastRecord.RecordId === 'placeholder-agent') {
                            lastRecord.RecordId = record.RecordId;
                        }
                        if (lastIndex >= 0 && lastRecord && lastRecord.RecordId === record.RecordId) {
                            mergeRecord(lastRecord, record, result.type);
                        } else {
                            internalChatList.value.push(record);
                        }
                    }
                }
            },
            complete(isOk, msg) {
                if (isOk) {
                    internalIsChatting.value = false;
                    abortController.value = null;
                }
                if (msg) {
                    MessagePlugin.error(msg);
                    emit('message', MessageCode.SEND_MESSAGE_FAILED, msg);
                }
            },
            fail(msg) {
                // 判断是否为 AbortError（用户取消请求）
                if (msg && typeof msg === 'object' &&
                    (
                        ('name' in msg && msg.name === 'AbortError') ||
                        ('code' in msg && msg.code === 'ERR_CANCELED')
                    )
                ) {
                    return;
                }
                // 判断是否为 AxiosError（网络错误）
                if (msg && typeof msg === 'object' && ('code' in msg && msg.code === 'ERR_NETWORK')) {
                    const networkMsg = getMessage(MessageCode.NETWORK_ERROR);
                    MessagePlugin[networkMsg.type](networkMsg.message);
                    emit('message', MessageCode.NETWORK_ERROR, networkMsg.message);
                } else if (msg && typeof msg === 'string') {
                    MessagePlugin.error(msg);
                    emit('message', MessageCode.SEND_MESSAGE_FAILED, msg);
                } else {
                    const sendMsg = getMessage(MessageCode.SEND_MESSAGE_FAILED);
                    MessagePlugin[sendMsg.type](sendMsg.message);
                    emit('message', MessageCode.SEND_MESSAGE_FAILED, sendMsg.message);
                }
            }
        }
    );
};

// 内部停止处理（API 模式）
const handleInternalStop = () => {
    if (abortController.value) {
        abortController.value.abort();
        internalIsChatting.value = false;
    }
    emit('stop');
};

// 内部加载更多处理（API 模式）
const handleInternalLoadMore = async (conversationId: string, lastRecordId: string) => {
    if (!useApiMode.value) {
        emit('loadMore', conversationId, lastRecordId);
        return;
    }

    try {
        const response = await fetchConversationDetail(
            { ConversationId: conversationId, LastRecordId: lastRecordId },
            props.apiConfig?.conversationDetailApi
        );
        const newRecords = response?.Response?.Records || [];
        if (newRecords.length > 0) {
            internalChatList.value = [...newRecords, ...internalChatList.value];
            mainLayoutRef.value?.notifyLoaded();
        } else {
            mainLayoutRef.value?.notifyComplete();
        }
    } catch (error) {
        mainLayoutRef.value?.notifyComplete();
        const msg = getMessage(MessageCode.LOAD_MORE_FAILED);
        MessagePlugin[msg.type](msg.message);
        emit('message', MessageCode.LOAD_MORE_FAILED, msg.message);
    }
};

// 内部评分处理（API 模式）
const handleInternalRate = async (conversationId: string, recordId: string, score: typeof ScoreValue[keyof typeof ScoreValue]) => {
    if (!useApiMode.value) {
        emit('rate', conversationId, recordId, score);
        return;
    }

    try {
        await rateMessage(
            { ConversationId: conversationId, RecordId: recordId, Score: score },
            props.apiConfig?.rateApi
        );
        // 更新本地状态
        const record = internalChatList.value.find(r => r.RecordId === recordId);
        if (record) {
            record.Score = score;
        }
    } catch (error) {
        const msg = getMessage(MessageCode.RATE_FAILED);
        MessagePlugin[msg.type](msg.message);
        emit('message', MessageCode.RATE_FAILED, msg.message);
    }
};

// 内部分享处理（API 模式）
const handleInternalShare = async (conversationId: string, applicationId: string, recordIds: string[]) => {
    if (!useApiMode.value) {
        emit('share', conversationId, applicationId, recordIds);
        return;
    }

    try {
        const response = await createShare(
            { ConversationId: conversationId, ApplicationId: applicationId, RecordIds: recordIds },
            props.apiConfig?.shareApi
        );
        const shareUrl = `${window.location.origin}${window.location.pathname}#/share?ShareId=${response.ShareId}`;
        await copyToClipboard(shareUrl, {
            onSuccess: () => {
                const msg = getMessage(MessageCode.COPY_SUCCESS);
                MessagePlugin[msg.type](msg.message);
            },
            onError: () => {
                const msg = getMessage(MessageCode.COPY_FAILED);
                MessagePlugin[msg.type](msg.message);
                emit('message', MessageCode.COPY_FAILED, msg.message);
            },
        });
    } catch (error) {
        const msg = getMessage(MessageCode.SHARE_FAILED);
        MessagePlugin[msg.type](msg.message);
        emit('message', MessageCode.SHARE_FAILED, msg.message);
    }
};

const handleToggleSidebar = () => {
    sidebarVisible.value = !sidebarVisible.value;
};

const handleSelectApplication = (app: Application) => {
    console.log('handleSelectApplication',app)
    if (useApiMode.value) {
        internalCurrentApplication.value = app;
        internalCurrentConversation.value = undefined;
        internalChatList.value = [];
    }
    // 移动端选择应用后收起侧边栏
    if (props.isMobile) {
        sidebarVisible.value = false;
    }
    emit('selectApplication', app);
};

const handleSelectConversation = async (conversation: ChatConversation) => {
    if (useApiMode.value) {
        internalCurrentConversation.value = conversation;
        // 清空聊天列表，让 InfiniteLoading 来加载数据
        internalChatList.value = [];
    }
    // 移动端选择对话后收起侧边栏
    if (props.isMobile) {
        sidebarVisible.value = false;
    }
    emit('selectConversation', conversation);
};

const handleCreateConversation = () => {
    if (useApiMode.value) {
        internalCurrentConversation.value = undefined;
        internalChatList.value = [];
    }
    emit('createConversation');
};

const handleClose = () => {
    emit('close');
};

const handleFullscreen = () => {
    emit('fullscreen', !props.isFullscreen);
};

// 内部复制处理
const handleInternalCopy = async (content: string | undefined, type: string) => {
    await copyToClipboard(content, {
        onSuccess: () => {
            const msg = getMessage(MessageCode.COPY_SUCCESS);
            MessagePlugin[msg.type](msg.message);
        },
        onError: () => {
            const msg = getMessage(MessageCode.COPY_FAILED);
            MessagePlugin[msg.type](msg.message);
            emit('message', MessageCode.COPY_FAILED, msg.message);
        },
    });
    emit('copy', content, type);
};

// 内部文件上传处理（API 模式）
const handleInternalUploadFile = async (files: File[]) => {
    if (!useApiMode.value) {
        emit('uploadFile', files);
        return;
    }

    for (const file of files) {
        try {
            const response = await uploadFile(file, currentApplicationId.value, props.apiConfig?.uploadApi);
            // 上传成功后添加到文件列表
            const senderRef = mainLayoutRef.value?.getChatRef()?.getSenderRef();
            if (senderRef && response) {
                senderRef.addFile({
                    name: file.name,
                    url: response.Url || response.url,
                    status: 'done',
                });
            }
        } catch (error) {
            const msg = getMessage(MessageCode.FILE_UPLOAD_FAILED);
            MessagePlugin[msg.type](msg.message);
            emit('message', MessageCode.FILE_UPLOAD_FAILED, msg.message);
        }
    }
    emit('uploadFile', files);
};

// 组件挂载时自动加载数据
onMounted(async () => {
    if (useApiMode.value && props.autoLoad) {
        await Promise.all([
            loadApplications(),
            loadConversations(),
            loadUserInfo(),
        ]);
    }
});

// 暴露方法供外部调用
defineExpose({
    loadApplications,
    loadConversations,
    loadConversationDetail,
    loadUserInfo,
    notifyLoaded: () => mainLayoutRef.value?.notifyLoaded(),
    notifyComplete: () => mainLayoutRef.value?.notifyComplete(),
});
</script>

<template>
    <t-layout class="page-container">
        <t-content class="content">
            <!-- 移动端毛玻璃遮罩 -->
            <div 
                v-if="isMobile && sidebarVisible" 
                class="mobile-overlay" 
                @click="handleToggleSidebar"
            ></div>
            <SideLayout 
                :visible="sidebarVisible"
                :applications="actualApplications"
                :currentApplicationId="currentApplicationId"
                :conversations="actualConversations"
                :currentConversationId="currentConversationId"
                :userAvatarUrl="actualUser?.avatarUrl"
                :userAvatarName="actualUser?.avatarName"
                :userName="actualUser?.name"
                :theme="theme"
                :languageOptions="languageOptions"
                :isMobile="isMobile"
                :maxAppLen="maxAppLen"
                :i18n="sideI18n"
                @toggleSidebar="handleToggleSidebar"
                @selectApplication="handleSelectApplication"
                @selectConversation="handleSelectConversation"
                @toggleTheme="emit('toggleTheme')"
                @changeLanguage="(key) => emit('changeLanguage', key)"
                @logout="emit('logout')"
                @userClick="emit('userClick')"
            >
                <template #sider-logo>
                    <slot name="sider-logo">
                        <LogoArea :logoUrl="logoUrl" :title="logoTitle" />
                    </slot>
                </template>
            </SideLayout>
            <MainLayout 
                ref="mainLayoutRef"
                :currentApplicationAvatar="currentApplicationAvatar"
                :currentApplicationName="currentApplicationName"
                :currentApplicationGreeting="currentApplicationGreeting"
                :currentApplicationOpeningQuestions="currentApplicationOpeningQuestions"
                :currentApplicationId="currentApplicationId"
                :chatId="currentConversationId"
                :chatList="actualChatList"
                :isChatting="actualIsChatting"
                :modelOptions="modelOptions"
                :selectModel="selectModel"
                :isDeepThinking="isDeepThinking"
                :isMobile="isMobile"
                :theme="theme"
                :showSidebarToggle="!sidebarVisible"
                :aiWarningText="aiWarningText"
                :createConversationText="createConversationText"
                :i18n="chatI18n"
                :chatItemI18n="chatItemI18n"
                :senderI18n="senderI18n"
                :useInternalRecord="useApiMode"
                :asrUrlApi="apiConfig?.asrUrlApi"
                @toggleSidebar="handleToggleSidebar"
                @createConversation="handleCreateConversation"
                @close="handleClose"
                @send="handleInternalSend"
                @stop="handleInternalStop"
                @loadMore="handleInternalLoadMore"
                @rate="handleInternalRate"
                @share="handleInternalShare"
                @copy="handleInternalCopy"
                @modelChange="(option: any) => emit('modelChange', option)"
                @toggleDeepThinking="emit('toggleDeepThinking')"
                @uploadFile="handleInternalUploadFile"
                @startRecord="emit('startRecord')"
                @stopRecord="emit('stopRecord')"
                @message="(code: MessageCode, message: string) => emit('message', code, message)"
                @conversationChange="(conversationId: string) => emit('conversationChange', conversationId)"
            >
                <template #header-fullscreen-content v-if="showFullscreenButton">
                    <CustomizedIcon name="fullscreen" :theme="theme" @click="handleFullscreen"/>
                </template>
                <template #header-close-content v-if="showCloseButton">
                    <CustomizedIcon name="logout_close" :theme="theme" @click="handleClose"/>
                </template>
            </MainLayout>
        </t-content>
    </t-layout>
</template>

<style scoped>
.page-container {
    height: 100%;
    width: 100%;
}
.content {
    display: flex;
    height: 100%;
    width:100%;
    position: relative;
}
/* 移动端毛玻璃遮罩 */
.mobile-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 99;
}
</style>
