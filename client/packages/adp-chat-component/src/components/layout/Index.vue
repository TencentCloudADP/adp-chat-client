<!-- 控制尺寸、展开和收起 -->
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Layout as TLayout, Content as TContent } from 'tdesign-vue-next';
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
} from '../../service/api';

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

const sidebarVisible = ref(true);

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
        emit('message', 'error', '获取应用列表失败');
    }
};

const loadConversations = async () => {
    if (!useApiMode.value) return;
    try {
        const data = await fetchConversationList(props.apiConfig?.conversationListApi);
        internalConversations.value = data;
        emit('dataLoaded', 'conversations', data);
    } catch (error) {
        emit('message', 'error', '获取会话列表失败');
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
        emit('message', 'error', '获取会话详情失败');
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

    // 创建用户消息
    const userRecord: Record = {
        RecordId: `user-${Date.now()}`,
        Content: query,
        IsFromSelf: true,
        Timestamp: Date.now(),
        FileInfos: fileList,
    };
    internalChatList.value.push(userRecord);

    // 创建助手消息占位
    const assistantRecord: Record = {
        RecordId: `assistant-${Date.now()}`,
        Content: '',
        IsFromSelf: false,
        Timestamp: Date.now(),
    };
    internalChatList.value.push(assistantRecord);

    try {
        abortController.value = new AbortController();
        const response: any = await sendMessage(
            {
                Query: query,
                ConversationId: conversationId || undefined,
                ApplicationId: applicationId,
                FileInfos: fileList,
            },
            { signal: abortController.value.signal },
            props.apiConfig?.sendMessageApi
        );

        // 处理 SSE 流式响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data:')) {
                    try {
                        const data = JSON.parse(line.slice(5));
                        const lastIndex = internalChatList.value.length - 1;
                        const lastRecord = internalChatList.value[lastIndex];
                        if (lastRecord) {
                            if (data.Content) {
                                lastRecord.Content = (lastRecord.Content || '') + data.Content;
                            }
                            if (data.RecordId) {
                                lastRecord.RecordId = data.RecordId;
                            }
                            if (data.ConversationId && !conversationId) {
                                // 新会话，更新会话列表
                                await loadConversations();
                                const newConversation = internalConversations.value.find(
                                    c => c.Id === data.ConversationId
                                );
                                if (newConversation) {
                                    internalCurrentConversation.value = newConversation;
                                }
                            }
                            if (data.AgentThought) {
                                lastRecord.AgentThought = data.AgentThought;
                            }
                            if (data.References) {
                                lastRecord.References = data.References;
                            }
                            if (data.IsFinal) {
                                lastRecord.IsFinal = data.IsFinal;
                            }
                        }
                    } catch (e) {
                        // 解析失败，忽略
                    }
                }
            }
        }
    } catch (error: any) {
        if (error.name !== 'AbortError') {
            console.error('发送消息失败:', error);
            emit('message', 'error', '发送消息失败');
        }
    } finally {
        internalIsChatting.value = false;
        abortController.value = null;
    }
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
        internalChatList.value = [...newRecords, ...internalChatList.value];
    } catch (error) {
        emit('message', 'error', '加载更多失败');
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
        emit('message', 'error', '评分失败');
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
        await navigator.clipboard.writeText(shareUrl);
        emit('message', 'success', '链接已复制');
    } catch (error) {
        emit('message', 'error', '分享失败');
    }
};

const handleToggleSidebar = () => {
    sidebarVisible.value = !sidebarVisible.value;
};

const handleSelectApplication = (app: Application) => {
    if (useApiMode.value) {
        internalCurrentApplication.value = app;
        internalCurrentConversation.value = undefined;
        internalChatList.value = [];
    }
    emit('selectApplication', app);
};

const handleSelectConversation = async (conversation: ChatConversation) => {
    if (useApiMode.value) {
        internalCurrentConversation.value = conversation;
        await loadConversationDetail(conversation.Id);
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

// 监听会话变化，自动加载详情
watch(
    () => actualCurrentConversation.value?.Id,
    async (newId) => {
        if (useApiMode.value && newId) {
            await loadConversationDetail(newId);
        }
    }
);

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
});
</script>

<template>
    <t-layout class="page-container">
        <t-content class="content">
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
                @toggleSidebar="handleToggleSidebar"
                @createConversation="handleCreateConversation"
                @close="handleClose"
                @send="handleInternalSend"
                @stop="handleInternalStop"
                @loadMore="handleInternalLoadMore"
                @rate="handleInternalRate"
                @share="handleInternalShare"
                @copy="(content: string | undefined, type: string) => emit('copy', content, type)"
                @modelChange="(option: any) => emit('modelChange', option)"
                @toggleDeepThinking="emit('toggleDeepThinking')"
                @uploadFile="(files: File[]) => emit('uploadFile', files)"
                @startRecord="emit('startRecord')"
                @stopRecord="emit('stopRecord')"
                @message="(type: 'warning' | 'error' | 'info' | 'success', message: string) => emit('message', type, message)"
                @conversationChange="(conversationId: string) => emit('conversationChange', conversationId)"
            >
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
}
</style>
