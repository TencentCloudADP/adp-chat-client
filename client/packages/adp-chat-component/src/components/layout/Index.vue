<!-- 控制尺寸、展开和收起 -->
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Layout as TLayout, Content as TContent, MessagePlugin } from 'tdesign-vue-next';

// TLayout, TContent 已导入，模板中使用对应组件
import MainLayout from './MainLayout.vue';
import SideLayout from './SideLayout.vue';
import LogoArea from '../LogoArea.vue';
import CustomizedIcon from '../CustomizedIcon.vue';
import type { Application } from '../../model/application';
import type { ChatConversation, Record } from '../../model/chat';
import type { FileProps } from '../../model/file';
import { ScoreValue } from '../../model/chat';
import type { ApiConfig, ApiDetailConfig } from '../../service/api';
import {
    fetchApplicationList,
    fetchConversationList,
    fetchConversationDetail,
    sendMessage,
    rateMessage,
    createShare,
    fetchUserInfo,
    uploadFile,
    defaultApiDetailConfig,
} from '../../service/api';
import { MessageCode, getMessage } from '../../model/messages';
import { fetchSSE } from '../../model/sseRequest-reasoning';
import { mergeRecord } from '../../utils/util';
import { copyToClipboard } from '../../utils/clipboard';
import { configureAxios } from '../../service/httpService';
import { computeIsMobile } from '../../utils/device';
import type { 
    LanguageOption, 
    UserInfo,
    SideI18n, 
    ChatI18n, 
    ChatItemI18n, 
    SenderI18n,
    ThemeProps,
    FullscreenProps
} from '../../model/type';
import { 
    defaultLanguageOptions,
    themePropsDefaults,
    fullscreenPropsDefaults
} from '../../model/type';

export interface Props extends ThemeProps, FullscreenProps {
    /** 是否为浮层模式 */
    isOverlay?: boolean;
    /** 宽度（仅在 isOverlay 为 true 时用于计算 isMobile） */
    width?: string | number;
    /** 高度（仅在 isOverlay 为 true 时用于计算 isMobile） */
    height?: string | number;
    /** 容器选择器（仅在非 isOverlay 模式用于计算 isMobile） */
    container?: string;
    /** 侧边栏是否使用overlay模式 */
    isSidePanelOverlay?: boolean;
    /** 应用列表 */
    applications?: Application[];
    /** 当前选中的应用 */
    currentApplication?: Application;
    /** 当前选中的应用 ID（优先级高于 currentApplication） */
    currentApplicationId?: string;
    /** 会话列表 */
    conversations?: ChatConversation[];
    /** 当前选中的会话 */
    currentConversation?: ChatConversation;
    /** 当前选中的会话 ID（优先级高于 currentConversation） */
    currentConversationId?: string;
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
    /** 是否显示关闭按钮 */
    isShowCloseButton?: boolean;
    /** AI警告文本 */
    aiWarningText?: string;
    /** 新建对话提示文本 */
    createConversationText?: string;
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
    ...themePropsDefaults,
    ...fullscreenPropsDefaults,
    isOverlay: false,
    width: 0,
    height: 0,
    container: 'body',
    isSidePanelOverlay: false,
    applications: () => [],
    currentApplicationId: '',
    conversations: () => [],
    currentConversationId: '',
    chatList: () => [],
    isChatting: false,
    user: () => ({}),
    languageOptions: () => defaultLanguageOptions,
    logoUrl: '',
    logoTitle: '',
    maxAppLen: 4,
    isShowCloseButton: true,
    aiWarningText: '内容由AI生成，仅供参考',
    createConversationText: '新建对话',
    apiConfig: () => ({}),
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
    (e: 'copy', rowtext: string | undefined, content: string | undefined, type: string): void;
    (e: 'uploadFile', files: File[]): void;
    (e: 'startRecord'): void;
    (e: 'stopRecord'): void;
    (e: 'message', code: MessageCode, message: string): void;
    (e: 'conversationChange', conversationId: string): void;
    (e: 'dataLoaded', type: 'applications' | 'conversations' | 'chatList' | 'user', data: any): void;
}>();

const sidebarVisible = ref(!props.isSidePanelOverlay);
const mainLayoutRef = ref<InstanceType<typeof MainLayout> | null>(null);

// 计算是否为移动端模式（内部计算，不再依赖外部传入）
const isMobile = computed(() => {
    return computeIsMobile({
        isOverlay: props.isOverlay,
        width: props.width,
        height: props.height,
        container: props.container,
    });
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

// 判断是否使用 API 模式（始终启用）
const useApiMode = computed(() => true);

// 合并后的 API 详细配置（用户配置 + 默认配置）
const mergedApiDetailConfig = computed<ApiDetailConfig>(() => ({
    ...defaultApiDetailConfig,
    ...props.apiConfig?.apiDetailConfig,
}));

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
    useApiMode.value ? internalIsChatting.value : props.isChatting
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
        const data = await fetchApplicationList(mergedApiDetailConfig.value.applicationListApi);
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
        const data = await fetchConversationList(mergedApiDetailConfig.value.conversationListApi);
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
            mergedApiDetailConfig.value.conversationDetailApi
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
        const data = await fetchUserInfo(mergedApiDetailConfig.value.userInfoApi);
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
                mergedApiDetailConfig.value.sendMessageApi
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
            mergedApiDetailConfig.value.conversationDetailApi
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
            mergedApiDetailConfig.value.rateApi
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
            mergedApiDetailConfig.value.shareApi
        );
        const shareUrl = `${window.location.origin}${window.location.pathname}#/share?ShareId=${response.ShareId}`;
        await copyToClipboard(shareUrl, {
            isMobile: isMobile.value,
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
    if (useApiMode.value) {
        internalCurrentApplication.value = app;
        internalCurrentConversation.value = undefined;
        internalChatList.value = [];
    }
    // 移动端选择应用后收起侧边栏
    if (isMobile.value || props.isSidePanelOverlay) {
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
    if (isMobile.value) {
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
const handleInternalCopy = async (rowtext: string | undefined, content: string | undefined, type: string) => {
    await copyToClipboard(content, {
        rawText: rowtext,
        isMobile: isMobile.value,
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
    emit('copy', rowtext, content, type);
};

// 内部文件上传处理（API 模式）
const handleInternalUploadFile = async (files: File[]) => {
    if (!useApiMode.value) {
        emit('uploadFile', files);
        return;
    }

    for (const file of files) {
        try {
            const response = await uploadFile(file, currentApplicationId.value, mergedApiDetailConfig.value.uploadApi);
            // 上传成功后添加到文件列表
            const senderRef = mainLayoutRef.value?.getChatRef()?.getSenderRef();
            if (senderRef && response) {
                senderRef.addFile({
                    uid: `${Date.now()}-${file.name}`,
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

// 记录上一次的 ID 值，用于判断变化
let prevConvId: string | undefined = undefined;

// 监听外部传入的 currentApplicationId 和 currentConversationId 变化
watch(
    [
        () => props.currentApplicationId,
        () => props.currentConversationId,
        () => actualApplications.value,
        () => actualConversations.value
    ],
    async ([appId, convId, apps, conversations]) => {
        // 处理应用 ID 变化
        if (appId && apps.length > 0) {
            const foundApp = apps.find(app => app.ApplicationId === appId);
            if (foundApp && foundApp.ApplicationId !== internalCurrentApplication.value?.ApplicationId) {
                internalCurrentApplication.value = foundApp;
            }
        }

        // 处理会话 ID 变化
        if (convId && conversations.length > 0) {
            const foundConv = conversations.find(conv => conv.Id === convId);
            if (foundConv && foundConv.Id !== internalCurrentConversation.value?.Id) {
                internalCurrentConversation.value = foundConv;
                // 如果会话有关联的应用，且未指定 appId，则自动切换应用
                if (!appId && foundConv.ApplicationId && apps.length > 0) {
                    const convApp = apps.find(app => app.ApplicationId === foundConv.ApplicationId);
                    if (convApp) {
                        internalCurrentApplication.value = convApp;
                    }
                }
                // 如果是 API 模式，自动加载会话详情
                if (useApiMode.value) {
                    internalChatList.value = [];
                    await loadConversationDetail(foundConv.Id);
                }
            }
        } else if (!convId && prevConvId) {
            // ID 从有值变为空时，清空当前会话
            internalCurrentConversation.value = undefined;
            internalChatList.value = [];
        }

        // 更新上一次的值
        prevConvId = convId;
    },
    { immediate: true }
);

// 监听外部传入的 currentApplication 对象变化，同步内部状态
watch(() => props.currentApplication, (newApp) => {
    if (newApp) {
        internalCurrentApplication.value = newApp;
    }
}, { immediate: true });

// 监听外部传入的 currentConversation 对象变化，同步内部状态并加载会话详情
watch([() => props.currentConversation, () => actualApplications.value], async ([newConversation, apps]) => {
    if (newConversation && newConversation.Id !== internalCurrentConversation.value?.Id) {
        internalCurrentConversation.value = newConversation;
        // 同时更新对应的应用
        if (newConversation.ApplicationId && apps.length > 0) {
            const foundApp = apps.find(app => app.ApplicationId === newConversation.ApplicationId);
            if (foundApp) {
                internalCurrentApplication.value = foundApp;
            }
        }
        // 如果是 API 模式，自动加载会话详情
        if (useApiMode.value) {
            internalChatList.value = [];
            await loadConversationDetail(newConversation.Id);
        }
    }
}, { immediate: true });

// 组件挂载时自动加载数据
onMounted(async () => {
    if (useApiMode.value && props.autoLoad) {
        // 配置 axios 实例（baseURL、timeout 等）
        if (props.apiConfig) {
            const { apiDetailConfig, ...axiosConfig } = props.apiConfig;
            if (Object.keys(axiosConfig).length > 0) {
                configureAxios(axiosConfig);
            }
        }
        // 先加载用户信息，因为如果配置了AUTO_CREATE_ACCOUNT，会在加载用户信息时创建账户
        await loadUserInfo()
        await Promise.all([
            loadApplications(),
            loadConversations(),
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
    <TLayout class="page-container">
        <TContent class="content">
            <!-- 移动端毛玻璃遮罩 -->
            <div 
                v-if="isSidePanelOverlay && sidebarVisible" 
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
                :isSidePanelOverlay="isSidePanelOverlay"
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
                <template #sider-logo v-if="(logoUrl || logoTitle) || $slots['sider-logo']">
                    <slot name="sider-logo">
                        <LogoArea v-if="logoUrl || logoTitle" :logoUrl="logoUrl" :title="logoTitle" />
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
                :isMobile="isMobile"
                :theme="theme"
                :showSidebarToggle="!sidebarVisible"
                :aiWarningText="aiWarningText"
                :createConversationText="createConversationText"
                :i18n="chatI18n"
                :chatItemI18n="chatItemI18n"
                :senderI18n="senderI18n"
                :useInternalRecord="useApiMode"
                :asrUrlApi="mergedApiDetailConfig.asrUrlApi"
                @toggleSidebar="handleToggleSidebar"
                @createConversation="handleCreateConversation"
                @close="handleClose"
                @send="handleInternalSend"
                @stop="handleInternalStop"
                @loadMore="handleInternalLoadMore"
                @rate="handleInternalRate"
                @share="handleInternalShare"
                @copy="handleInternalCopy"
                @uploadFile="handleInternalUploadFile"
                @startRecord="emit('startRecord')"
                @stopRecord="emit('stopRecord')"
                @message="(code: MessageCode, message: string) => emit('message', code, message)"
                @conversationChange="(conversationId: string) => emit('conversationChange', conversationId)"
            >
                <template #header-fullscreen-content v-if="isShowFullscreenButton || $slots['header-fullscreen-content']">
                    <slot name="header-fullscreen-content">
                        <CustomizedIcon v-if="isShowFullscreenButton" name="fullscreen" :theme="theme" @click="handleFullscreen"/>
                    </slot>
                </template>
                <template #header-close-content v-if="isShowCloseButton || $slots['header-close-content']">
                    <slot name="header-close-content">
                        <CustomizedIcon v-if="isShowCloseButton" name="logout_close" :theme="theme" @click="handleClose"/>
                    </slot>
                </template>
            </MainLayout>
        </TContent>
    </TLayout>
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
