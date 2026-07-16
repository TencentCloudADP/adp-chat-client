<!-- ADP 聊天布局主组件，支持 API 模式和 Props 模式 -->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick, toRefs, provide } from 'vue';
import { Layout as TLayout, Content as TContent, MessagePlugin, DialogPlugin, Tooltip, Icon as TIcon } from 'tdesign-vue-next';

// TLayout, TContent 已导入，模板中使用对应组件
import MainLayout from './MainLayout.vue';
import SideLayout from './SideLayout.vue';
import FilePreviewLayout from './FilePreviewLayout.vue';
import LogoArea from '../LogoArea.vue';
import CustomizedIcon from '../CustomizedIcon.vue';
import CronTask from '../CronTask/CronTask.vue';
import type { Application, AppPattern } from '../../model/application';
import type { ChatConversation, Record, Reference, SseEvent, Content, ErrorEvent } from '../../model/chat-v2';
import type { CronTaskI18n, TimerTask, TimerTaskSummary } from '../../model/cronTask';
import type { FileProps } from '../../model/file';
import { ScoreValue } from '../../model/chat-v2';
import type { ApiConfig } from '../../service/api';
import {
    fetchApplicationList,
    // fetchConversationList 已移入 SideLayout 内部使用（方案 B：SideLayout 按 appId 主动拉取）
    deleteConversation,
    fetchConversationDetail,
    fetchReferenceDetails,
    createConversation,
    ConversationType,
    sendMessage,
    rateMessage,
    createShare,
    fetchUserInfo,
    uploadFile,
    parseFile,
    fetchSystemConfig
} from '../../service/api';
import type { SystemConfig } from '../../service/api';
import { MessageCode } from '../../model/messages';
import { fetchSSE } from '../../model/sseRequest-reasoning';
import { applySseEventToRecord } from '../../utils/mergeRecord-v2';
import { hydrateType2References } from '../../utils/reference';
import { copyToClipboard } from '../../utils/clipboard';
import { useApiConfig } from '../../composables';
import { computeIsMobile } from '../../utils/device';
import {
    handleWidgetEvent as routeWidgetEvent,
    disableWidgetsByRecordId,
} from '../../widget';
import type { WidgetActionRequest } from '../../widget';
import type { 
    LanguageOption, 
    UserInfo,
    SideI18n, 
    ChatI18n, 
    ChatItemI18n, 
    SenderI18n,
    FilePreviewI18n,
    ThemeProps,
    OverlayProps,
    ChatMode
} from '../../model/type';
import { 
    defaultLanguageOptions,
    themePropsDefaults,
    overlayPropsDefaults,
    defaultFilePreviewI18n,
    defaultFilePreviewI18nEn,
    defaultChatI18n,
    defaultChatI18nEn,
    defaultChatItemI18n,
    defaultChatItemI18nEn,
    defaultSenderI18n,
    defaultSenderI18nEn,
    defaultSideI18n,
    defaultSideI18nEn
} from '../../model/type';
import { useAgentStore } from '../../composables/useAgentStore';


export interface Props extends ThemeProps, OverlayProps {
    /** 当前语言标识，用于自动选择内部默认 i18n（如 'zh-CN'、'en-US'） */
    language?: string;
    /** 聊天模式：claw-简化模式（无文件预览/无解析进度），standard-标准模式 */
    mode?: ChatMode;
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
    showCloseButton?: boolean;
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
    /** 文件预览面板国际化文本 */
    filePreviewI18n?: FilePreviewI18n;
    /** API 配置 - 如果传入则使用 HTTP 请求获取数据 */
    apiConfig?: ApiConfig;
    /** 是否自动加载数据（仅在使用 apiConfig 时生效） */
    autoLoad?: boolean;
    /** 是否启用 Skills 功能 */
    enableSkills?: boolean;
    /** Skills 空间 ID */
    skillsSpaceId?: string;
    /** Skills 应用 ID（/adp/ 转发需要） */
    skillsApplicationId?: string;
    /** 定时任务国际化文本 */
    cronTaskI18n?: Partial<CronTaskI18n>;
    /** 定时任务：模型选项 */
    cronTaskModelOptions?: Array<{ label: string; value: string }>;
    /** 定时任务：关联文件夹选项 */
    cronTaskFolderOptions?: Array<{ label: string; value: string }>;
    /** 定时任务：列表分页大小 */
    cronTaskPageSize?: number;
    /** 定时任务：详情页运行日志轮询间隔（ms） */
    cronTaskPollInterval?: number;
    /** 是否在侧边栏显示"定时任务"入口 */
    enableCronTask?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    ...overlayPropsDefaults,
    language: 'zh-CN',
    mode: 'standard',
    isOverlay: false,
    width: 0,
    height: 0,
    container: 'body',
    isSidePanelOverlay: true,
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
    showCloseButton: true,
    aiWarningText: '内容由AI生成，仅供参考',
    apiConfig: () => ({}),
    autoLoad: true,
    enableSkills: true,
    skillsSpaceId: '',
    skillsApplicationId: '',
    cronTaskI18n: () => ({}),
    cronTaskModelOptions: () => [],
    cronTaskFolderOptions: () => [],
    cronTaskPageSize: 20,
    cronTaskPollInterval: 10 * 1000,
    enableCronTask: true,
});

const { getAgentIdByAppId, watchApplicationId, agentIdMap } = useAgentStore();

const emit = defineEmits<{
    (e: 'selectApplication', app: Application): void;
    (e: 'selectConversation', conversation: ChatConversation): void;
    /** 删除会话（用户在侧栏确认删除后触发；API 模式下删除已完成再 emit，非 API 模式仅透传） */
    (e: 'deleteConversation', conversation: ChatConversation): void;
    (e: 'createConversation'): void;
    (e: 'toggleTheme'): void;
    (e: 'changeLanguage', key: string): void;
    (e: 'logout'): void;
    (e: 'userClick'): void;
    (e: 'close'): void;
    (e: 'overlay', isOverlay: boolean): void;
    (e: 'send', query: string, fileList: FileProps[], conversationId: string, applicationId: string): void;
    (e: 'stop'): void;
    (e: 'loadMore', conversationId: string, lastRecordId: string): void;
    (e: 'rate', conversationId: string, recordId: string, score: typeof ScoreValue[keyof typeof ScoreValue]): void;
    (e: 'share', conversationId: string, applicationId: string, recordIds: string[]): void;
    (e: 'copy', rowtext: string | undefined, content: string | undefined, type: string): void;
    (e: 'uploadFile', files: File[]): void;
    (e: 'uploadStatus', status: 'uploading' | 'done'): void;
    (e: 'startRecord'): void;
    (e: 'stopRecord'): void;
    (e: 'message', code: MessageCode, message: string): void;
    (e: 'conversationChange', conversationId: string): void;
    (e: 'dataLoaded', type: 'applications' | 'conversations' | 'chatList' | 'user' | 'systemConfig', data: any): void;
    /** Widget 事件（用于与 SSE/对话流交互） */
    (e: 'widgetEvent', event: CustomEvent, widgetRunId: string, widgetId: string, recordId: string): void;
    /** 定时任务面板可见性变化 */
    (e: 'cronTaskVisibleChange', visible: boolean): void;
    /** 定时任务：立即执行并查看 */
    (e: 'cronTaskRunAndView', task: TimerTask | TimerTaskSummary): void;
    /** 定时任务：切换到聊天窗口（携带任务 & 会话 / 日志 Id） */
    (e: 'cronTaskSwitchToChat', payload: { task: TimerTask | TimerTaskSummary; sessionId?: string; logId?: string }): void;
    /** 定时任务：某个操作完成（新增/编辑/删除/暂停/恢复/立即执行等） */
    (e: 'cronTaskActionDone', action: string, task: TimerTask | TimerTaskSummary): void;
    /** 定时任务：优化 Prompt */
    (e: 'cronTaskOptimizePrompt', content: string): void;
}>();

// 解构 props 保持响应式
const { theme } = toRefs(props);

const sidebarVisible = ref(!props.isSidePanelOverlay);
const mainLayoutRef = ref<InstanceType<typeof MainLayout> | null>(null);
const sideLayoutRef = ref<InstanceType<typeof SideLayout> | null>(null);
const filePreviewLayoutRef = ref<InstanceType<typeof FilePreviewLayout> | null>(null);

// 文件预览面板显示状态
const filePreviewVisible = ref(false);

// 定时任务面板显示状态（覆盖会话窗口）
const cronTaskVisible = ref(false);

/**
 * 打开定时任务面板
 * 同时关闭文件预览面板，避免同时叠加
 */
const openCronTask = () => {
    if (cronTaskVisible.value) return;
    cronTaskVisible.value = true;
    filePreviewVisible.value = false;
    emit('cronTaskVisibleChange', true);
};

/**
 * 关闭定时任务面板
 */
const closeCronTask = () => {
    if (!cronTaskVisible.value) return;
    cronTaskVisible.value = false;
    emit('cronTaskVisibleChange', false);
};

/**
 * 切换文件预览面板显示
 * 打开时重置为纯文档列表状态，不保留上次预览态
 */
const toggleFilePreview = () => {
    if (filePreviewVisible.value) {
        filePreviewVisible.value = false;
    } else {
        filePreviewVisible.value = true;
        nextTick(() => {
            filePreviewLayoutRef.value?.resetToList();
        });
    }
};

/**
 * 打开文件预览面板
 */
const openFilePreview = () => {
    filePreviewVisible.value = true;
};

/**
 * 关闭文件预览面板
 */
const closeFilePreview = () => {
    filePreviewVisible.value = false;
};

/**
 * 打开文件预览并定位到指定路径（不展示文档列表列）
 */
const viewFile = (filePath: string) => {
    if (!filePath) return;
    openFilePreview();
    nextTick(() => {
        filePreviewLayoutRef.value?.setPreviewPath(filePath, { showDir: false });
    });
};

provide('viewFile', viewFile);

// 上传状态
const isUploading = ref(false);

// 合并 i18n 配置（根据 language 选择对应语言的默认值）
const mergedChatItemI18n = computed(() => {
    const defaults = props.language?.startsWith('en') ? defaultChatItemI18nEn : defaultChatItemI18n;
    return { ...defaults, ...props.chatItemI18n };
});

// 合并文件预览 i18n 配置（根据 language 选择对应语言的默认值）
const mergedFilePreviewI18n = computed(() => {
    const defaults = props.language?.startsWith('en') ? defaultFilePreviewI18nEn : defaultFilePreviewI18n;
    return { ...defaults, ...props.filePreviewI18n };
});

// 合并侧边栏 i18n（顶栏"定时任务"按钮 tooltip 复用 sideI18n.cronTask）
const mergedSideI18n = computed(() => {
    const defaults = props.language?.startsWith('en') ? defaultSideI18nEn : defaultSideI18n;
    return { ...defaults, ...props.sideI18n };
});

// 计算是否为移动端模式（内部计算，不再依赖外部传入）
const isMobile = computed(() => {
    return computeIsMobile({
        isOverlay: props.isOverlay,
        width: props.width,
        height: props.height,
        container: props.container,
    });
});

provide('isMobile', isMobile);

// 内部数据状态（当使用 API 时）
const internalApplications = ref<Application[]>([]);
const internalConversations = ref<ChatConversation[]>([]);
const internalUser = ref<{ id?: string; avatarUrl?: string; avatarName?: string; name?: string }>({});
const internalCurrentApplication = ref<Application | undefined>(undefined);
const internalCurrentConversation = ref<ChatConversation | undefined>(undefined);

// 用于确保 applications 列表加载完成后再判断模式
let resolveApplicationsReady: () => void;
const applicationsReadyPromise = new Promise<void>((resolve) => {
    resolveApplicationsReady = resolve;
});


const internalSystemConfig = ref<SystemConfig>({ EnableVoiceInput: true });
const referenceDetailCache = new Map<string, Reference>();
const referenceDetailPendingKeys = new Set<string>();

interface ConversationRuntimeState {
    records: Record[];
    isChatting: boolean;
    abortController: AbortController | null;
    applicationId?: string;
}

type ConversationRuntimeStateMap = {
    [key: string]: ConversationRuntimeState;
};

const conversationRuntimeStates = ref<ConversationRuntimeStateMap>({});
const currentConversationStateKey = ref('');
let pendingConversationSeq = 0;

const createPendingConversationKey = () => `pending-conversation:${Date.now()}:${pendingConversationSeq++}`;

const getConversationRuntimeState = (key: string) => {
    if (!key) {
        return undefined;
    }
    return conversationRuntimeStates.value[key];
};

const ensureConversationRuntimeState = (key: string) => {
    if (!key) {
        return undefined;
    }
    let state = conversationRuntimeStates.value[key];
    if (!state) {
        state = {
            records: [],
            isChatting: false,
            abortController: null,
        };
        conversationRuntimeStates.value[key] = state;
    }
    return state;
};

const getConversationRecords = (key: string) => {
    return getConversationRuntimeState(key)?.records ?? [];
};

const isConversationChatting = (key: string) => {
    return getConversationRuntimeState(key)?.isChatting ?? false;
};

const setConversationRecords = (key: string, records: Record[], applicationId?: string) => {
    const state = ensureConversationRuntimeState(key);
    if (!state) {
        return [];
    }
    state.records = records;
    if (applicationId) {
        state.applicationId = applicationId;
    }
    return state.records;
};

const setConversationApplicationId = (key: string, applicationId?: string) => {
    if (!key || !applicationId) {
        return;
    }
    const state = ensureConversationRuntimeState(key);
    if (!state) {
        return;
    }
    state.applicationId = applicationId;
};

const moveConversationRuntimeState = (fromKey: string, toKey: string, applicationId?: string) => {
    if (!fromKey) {
        setConversationApplicationId(toKey, applicationId);
        return toKey;
    }
    if (!toKey || fromKey === toKey) {
        setConversationApplicationId(fromKey, applicationId);
        return fromKey;
    }

    const fromState = getConversationRuntimeState(fromKey);
    if (!fromState) {
        setConversationApplicationId(toKey, applicationId);
        return toKey;
    }

    conversationRuntimeStates.value[toKey] = fromState;
    if (applicationId) {
        fromState.applicationId = applicationId;
    }
    delete conversationRuntimeStates.value[fromKey];
    return toKey;
};

const stopConversationStream = (key: string) => {
    const state = getConversationRuntimeState(key);
    if (!state) {
        return;
    }
    if (state.abortController) {
        state.abortController.abort();
        state.abortController = null;
    }
    state.isChatting = false;
};

// 判断是否使用 API 模式（始终启用）
const useApiMode = computed(() => true);

// 是否启用语音输入
const enableVoiceInput = computed(() => internalSystemConfig.value.EnableVoiceInput);

// 合并默认值和传入值的 chatI18n（根据 language 选择对应语言的默认值）
const mergedChatI18n = computed(() => {
    const defaults = props.language?.startsWith('en') ? defaultChatI18nEn : defaultChatI18n;
    return { ...defaults, ...props.chatI18n };
});

// 合并默认值和传入值的 senderI18n（根据 language 选择对应语言的默认值）
const mergedSenderI18n = computed(() => {
    const defaults = props.language?.startsWith('en') ? defaultSenderI18nEn : defaultSenderI18n;
    return { ...defaults, ...props.senderI18n };
});

// 使用 composable 统一管理 API 配置
const { mergedApiDetailConfig } = useApiConfig({
    apiConfig: computed((): ApiConfig | undefined => props.apiConfig),
});

const isStreamAbortError = (msg: unknown) => {
    return !!(
        msg &&
        typeof msg === 'object' &&
        (
            ('name' in msg && msg.name === 'AbortError') ||
            ('code' in msg && msg.code === 'ERR_CANCELED')
        )
    );
};

/**
 * 将错误信息写入指定会话的 placeholder-agent Record，使其在消息列表中以气泡形式展示。
 * 如果写入成功返回 true，否则返回 false（外层可兜底 toast）。
 */
const writeErrorToRecords = (conversationKey: string, errorMessage: string, errorEvent?: ErrorEvent): boolean => {
    const targetState = getConversationRuntimeState(conversationKey);
    if (!targetState) return false;

    const placeholderIdx = targetState.records.findIndex(
        (r) => r.RecordId === 'placeholder-agent' || (r.Role === 'assistant' && r.Status === 'processing')
    );
    if (placeholderIdx === -1) return false;

    const record = targetState.records[placeholderIdx]!;
    record.Status = 'error';
    record.StatusDesc = errorMessage;
    record.RecordId = errorEvent?.RecordId || record.RecordId;
    record.Messages = [
        {
            Type: 'reply',
            MessageId: `error-${Date.now()}`,
            Name: 'error',
            Title: '',
            Status: 'error',
            StatusDesc: '',
            Contents: [{ Type: 'text', Text: errorMessage }],
        },
    ];

    // 滚动到底部以展示错误消息
    if (currentConversationStateKey.value === conversationKey) {
        nextTick(() => {
            mainLayoutRef.value?.getChatRef()?.backToBottom();
        });
    }
    return true;
};

const handleStreamFailure = (msg: unknown, errorEvent?: ErrorEvent, conversationKey?: string) => {
    if (isStreamAbortError(msg)) {
        return;
    }
    if (msg && typeof msg === 'object' && 'response' in msg && msg.response && typeof msg.response === 'object') {
        const response = msg.response as { status?: number };
        if (response.status === 401) {
            const loginExpiredText = mergedChatI18n.value.loginExpired;
            MessagePlugin.error(loginExpiredText);
            emit('message', MessageCode.SEND_MESSAGE_FAILED, loginExpiredText);
            return;
        }
    }
    if (msg && typeof msg === 'object' && 'code' in msg && msg.code === 'ERR_NETWORK') {
        const networkErrorText = mergedChatI18n.value.networkError;
        MessagePlugin.error(networkErrorText);
        emit('message', MessageCode.NETWORK_ERROR, networkErrorText);
        return;
    }
    if (typeof msg === 'string' && conversationKey) {
        // SSE error 事件：将错误渲染到消息气泡中（支持 Markdown 链接）
        if (writeErrorToRecords(conversationKey, msg, errorEvent)) {
            emit('message', MessageCode.SEND_MESSAGE_FAILED, msg);
            return;
        }
    }
    if (typeof msg === 'string') {
        // 兜底：写入失败则 toast
        MessagePlugin.error(msg);
        emit('message', MessageCode.SEND_MESSAGE_FAILED, msg);
        return;
    }
    const sendErrorText = mergedChatI18n.value.sendError;
    MessagePlugin.error(sendErrorText);
    emit('message', MessageCode.SEND_MESSAGE_FAILED, sendErrorText);
};

const hydrateReferences = async (
    records: Record[],
    options: { applicationId?: string; shareId?: string } = {}
) => {
    if (records.length === 0) {
        return;
    }

    try {
        await hydrateType2References(records, {
            ...options,
            cache: referenceDetailCache,
            pending: referenceDetailPendingKeys,
            fetcher: (params) => fetchReferenceDetails(params, mergedApiDetailConfig.value.referenceDetailApi),
        });
    } catch (error) {
        console.error('补充引用切片失败:', error);
    }
};

// 实际使用的数据（优先使用 props，否则使用内部数据）
const actualApplications = computed(() => 
    props.applications.length > 0 ? props.applications : internalApplications.value
);
const actualConversations = computed(() => 
    props.conversations.length > 0 ? props.conversations : internalConversations.value
);
const actualChatList = computed(() => 
    props.chatList.length > 0 ? props.chatList : getConversationRecords(currentConversationStateKey.value)
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
    useApiMode.value ? isConversationChatting(currentConversationStateKey.value) : props.isChatting
);

/**
 * 所有正在进行中的会话 Id 集合
 * 用途：透传给 HistoryList 让侧栏对应项显示转圈
 * 数据源：conversationRuntimeStates 中 isChatting=true 的 key
 * 注意：key 既包含真实 conversationId，也包含 pending-conversation:* 占位 key（乐观 UI 场景），
 *      两种 key 都会出现在 internalConversations 里，所以直接命中即可
 */
const chattingConversationIds = computed(() =>
    Object.entries(conversationRuntimeStates.value)
        .filter(([, state]) => state?.isChatting)
        .map(([key]) => key)
);

// 计算属性
const currentApplicationId = computed(() => actualCurrentApplication.value?.ApplicationId || '');
// 在最外层监听 currentApplicationId 变化，自动触发 Agent 拉取
watchApplicationId(currentApplicationId);
const currentApplicationAvatar = computed(() => actualCurrentApplication.value?.Avatar || '');

/** 当前用户 ID（来自 /account/info 返回的 Id） */
const currentUserId = computed(() => internalUser.value?.id || '');
/** 当前应用的 agent ID（来自 useAgentStore 缓存，由 watchApplicationId 自动拉取） */
const currentAgentId = computed(() => agentIdMap.value[currentApplicationId.value] || '');
const currentApplicationName = computed(() => actualCurrentApplication.value?.Name || '');
// Skills 的 ApplicationId 优先用显式配置，否则回退到当前应用 ID
const skillsAppId = computed(() => props.skillsApplicationId || currentApplicationId.value);
// Skills 空间 ID：优先从当前应用接口返回的 SpaceId 获取，否则回退到显式 props
const resolvedSpaceId = computed(() => actualCurrentApplication.value?.SpaceId || props.skillsSpaceId || 'default_space');
const currentApplicationGreeting = computed(() => actualCurrentApplication.value?.Greeting || '');
const currentApplicationOpeningQuestions = computed(() => actualCurrentApplication.value?.OpeningQuestions || []);
const currentConversationId = computed(() => props.currentConversationId || actualCurrentConversation.value?.Id || '');

/**
 * 聊天模式：优先使用 props.mode 手动配置，否则从当前应用的 Pattern 自动推导
 * Pattern='ClawAgent' → mode='claw'，其他值或 null → mode='standard'
 */
const chatMode = computed<ChatMode>(() => {
    if (props.mode !== 'standard') {
        return props.mode;
    }
    const pattern = actualCurrentApplication.value?.Pattern as AppPattern | null | undefined;
    if (pattern === 'ClawAgent') {
        return 'claw';
    }
    return 'standard';
});

// API 数据加载方法
const loadApplications = async () => {
    if (!useApiMode.value) {
        resolveApplicationsReady();
        return;
    }
    try {
        const data = await fetchApplicationList(mergedApiDetailConfig.value.applicationListApi);
        internalApplications.value = data;
        // 默认选中第一个应用
        if (data.length > 0 && !internalCurrentApplication.value) {
            internalCurrentApplication.value = data[0];
        }
        emit('dataLoaded', 'applications', data);
    } catch (error) {
        const text = mergedChatI18n.value.getAppListFailed;
        MessagePlugin.error(text);
        emit('message', MessageCode.GET_APP_LIST_FAILED, text);
    } finally {
        resolveApplicationsReady();
    }
};

/**
 * 会话列表加载入口（方案 B：由 SideLayout 内部按 currentApplicationId 主动拉取）
 *
 * 变更说明：
 * - 后端请求由 SideLayout.fetchList() 发起，本函数改为委托到 sideLayoutRef.reload()
 * - internalConversations 保留作为"业务判断镜像"（isConversationChatting、getConversationDisplayName、
 *   SSE 事件里判断占位是否存在等仍读它），通过 handleSideConversationsChange 由 SideLayout 事件反向同步
 * - 若 SideLayout 尚未挂载（首次加载最早期），本函数是 no-op，不会阻塞其它并行初始化流程
 */
const loadConversations = async () => {
    if (!useApiMode.value) return;
    if (!sideLayoutRef.value) return;
    await sideLayoutRef.value.reload();
};

/**
 * SideLayout 内部会话列表变化时的镜像同步：
 * SideLayout 是权威源，Index 只做镜像，供 chattingConversationIds / SSE 占位查询 等业务判断使用。
 */
const handleSideConversationsChange = (list: ChatConversation[]) => {
    internalConversations.value = list;
};

/**
 * SideLayout 拉取后端成功后触发（区别于乐观 UI 变更）
 * 保留 dataLoaded 事件语义，供外部业务感知
 */
const handleSideConversationsLoaded = (list: ChatConversation[]) => {
    emit('dataLoaded', 'conversations', list);
};

/**
 * SideLayout 拉取后端失败时的错误提示（保持与原 loadConversations 的错误行为一致）
 */
const handleSideFetchError = (_error: unknown) => {
    const text = mergedChatI18n.value.getConversationListFailed;
    MessagePlugin.error(text);
    emit('message', MessageCode.GET_CONVERSATION_LIST_FAILED, text);
};

const loadConversationDetail = async (conversationId: string) => {
    if (!useApiMode.value || !conversationId) return;
    // 确保 applications 列表已加载完成
    await applicationsReadyPromise;
    try {
        const response = await fetchConversationDetail(
            { ConversationId: conversationId },
            mergedApiDetailConfig.value.conversationDetailApi
        );
        const records: Record[] = response?.Response?.Records || [];
        const applicationId = response?.Response?.ApplicationId || '';

        setConversationRecords(conversationId, records, applicationId);
        await hydrateReferences(records, { applicationId });
        emit('dataLoaded', 'chatList', records);
    } catch (error) {
        const text = mergedChatI18n.value.getConversationDetailFailed;
        MessagePlugin.error(text);
        emit('message', MessageCode.GET_CONVERSATION_DETAIL_FAILED, text);
    }
};

const loadUserInfo = async () => {
    if (!useApiMode.value) return;
    try {
        const data = await fetchUserInfo(mergedApiDetailConfig.value.userInfoApi);
        internalUser.value = {
            id: data.Id || '',
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

const loadSystemConfig = async () => {
    if (!useApiMode.value) return;
    try {
        const data = await fetchSystemConfig(mergedApiDetailConfig.value.systemConfigApi);
        internalSystemConfig.value = data;
        emit('dataLoaded', 'systemConfig', internalSystemConfig.value);
    } catch (error) {
        // 系统配置获取失败不影响主流程，默认不启用语音输入
        console.error('获取系统配置失败:', error);
    }
};

// 内部发送消息处理（API 模式）
const handleInternalSend = async (query: string, fileList: FileProps[], conversationId: string, applicationId: string) => {
    if (isUploading.value) return;
    if (!useApiMode.value) {
        emit('send', query, fileList, conversationId, applicationId);
        return;
    }

    // 乐观 UI 需要在函数最开始就记录"进入时是不是新会话"
    // 因为后面走 agentId 分支会同步调 createConversation，把 conversationId 从空变成真实 Id，
    // 那样后续判断就分不清了。
    const isNewConversationSend = !conversationId;

    const agentId = await getAgentIdByAppId(applicationId);

    // 如果存在 agentId 且没有 conversationId，则先调用 CreateConversation 获取
    if (agentId && !conversationId) {
        try {
            conversationId = await createConversation(
                {
                    Type: ConversationType.CONVERSATION_TYPE_VISITOR,
                    AppId: applicationId,
                    AgentId: agentId,
                },
                applicationId
            );
        } catch (error) {
            console.error('CreateConversation 失败:', error);
            return;
        }

        // 成功创建后立即同步内部状态 + 通知外部，确保：
        // 1) currentConversationStateKey 绑定到新 conversationId（与点击侧栏会话的行为一致）
        // 2) ApplicationId 关联到该 conversation
        // 3) 向外 emit('conversationChange')，让父组件同步 currentConversationId（更新 URL / 路由等）
        if (conversationId) {
            currentConversationStateKey.value = conversationId;
            setConversationApplicationId(conversationId, applicationId);
            emit('conversationChange', conversationId);
        }
    }

    let streamConversationKey = conversationId || currentConversationStateKey.value || createPendingConversationKey();
    currentConversationStateKey.value = streamConversationKey;
    const streamState = ensureConversationRuntimeState(streamConversationKey);
    if (!streamState) {
        return;
    }
    streamState.isChatting = true;
    streamState.applicationId =
        applicationId ||
        streamState.applicationId ||
        internalCurrentConversation.value?.ApplicationId ||
        internalCurrentApplication.value?.ApplicationId;
    // 重置用户滚动状态
    mainLayoutRef.value?.getChatRef()?.setHasUserScrolled(false);

    // 乐观 UI：新会话首条消息发送时，先在侧栏插入占位会话
    // 覆盖两种"新会话"路径：
    //   1) 走 CreateConversation 提前拿到真实 Id（agentId 分支）：streamConversationKey 是真实 Id
    //   2) 未走 CreateConversation，靠 SSE 首事件回吐 Id：streamConversationKey 是 pending-conversation:*
    // 两者都需要占位，因为无论哪种，此刻侧栏都还没这条会话（loadConversations 尚未刷新）
    // - Id 用 streamConversationKey，保证 HistoryList 的 active 高亮命中
    // - Title 用用户首条消息前 40 字符（后端也会基于首条 query 生成摘要）
    // - LastActiveAt 用当前时间，保证在 sortedConversations 中排最上
    // - 路径 1：SSE 结束后无 IsNewConversation 事件，占位靠 loadConversations 时把 pending 过滤后由真实项覆盖
    //          → 因此路径 1 的占位替换依赖 SSE finish/success 中的 loadConversations 调用（见后端事件处理）
    // - 路径 2：SSE 首事件（IsNewConversation=true）就地替换 pending 项
    if (isNewConversationSend) {
        const optimisticTitle = (query || '').replace(/\s+/g, ' ').trim().slice(0, 40) || 'New chat';
        const nowSec = Math.floor(Date.now() / 1000);
        const optimisticConversation: ChatConversation = {
            Id: streamConversationKey,
            AccountId: '',
            Title: optimisticTitle,
            LastActiveAt: nowSec,
            CreatedAt: nowSec,
            ApplicationId: applicationId || internalCurrentApplication.value?.ApplicationId || '',
        };
        // 幂等：避免同一 key 被重复插入
        if (!internalConversations.value.some(c => c.Id === streamConversationKey)) {
            // 方案 B：SideLayout 是权威源；本地镜像通过 SideLayout 的 @conversationsChange 事件同步，
            // 无需再手动写 internalConversations（写了也会被 change 事件覆盖，语义不冲突，但避免出现"镜像先于源"的窗口）
            sideLayoutRef.value?.addOptimistic(optimisticConversation);
        }
    }

    const timestamp = Date.now();
    const baseExtraInfo = (isFromSelf: boolean) => ({
        RequestId: '',
        TraceId: '',
        Elapsed: 0,
        StartTime: timestamp,
        IsFromSelf: isFromSelf,
    });

    // 构建用户消息展示内容（图片和文档都作为 file Content 展示）
    const userContents: Content[] = [{ Type: 'text', Text: query }];
    for (const file of fileList) {
        if (file.status === 'done' && file.url) {
            const extName = file.name?.split('.').pop() || '';
            userContents.push({
                Type: 'file',
                File: { DocId: file.docId || '0', FileName: file.name || '', FileUrl: file.url, FileSize: String(file.size || 0), FileType: extName },
            });
        }
    }

    // 创建用户消息占位
    const userRecord: Record = {
        Role: 'user',
        RecordId: 'placeholder-user',
        ConversationId: conversationId || streamConversationKey,
        Status: 'success',
        StatusDesc: '',
        Messages: [
            {
                Type: 'question',
                MessageId: `placeholder-user-${timestamp}`,
                Name: 'question',
                Title: '',
                Status: 'success',
                StatusDesc: '',
                Contents: userContents,
            },
        ],
        ExtraInfo: baseExtraInfo(true),
    };
    streamState.records.push(userRecord);

    // 创建助手消息占位
    const assistantRecord: Record = {
        Role: 'assistant',
        RecordId: 'placeholder-agent',
        ConversationId: conversationId || streamConversationKey,
        Status: 'processing',
        StatusDesc: '',
        Messages: [],
        ExtraInfo: baseExtraInfo(false),
    };
    streamState.records.push(assistantRecord);

    // 发送消息后滚动到底部
    nextTick(() => {
        mainLayoutRef.value?.getChatRef()?.backToBottom();
    });

    streamState.abortController = new AbortController();

    const contents: Content[] = [{ Type: 'text', Text: query }];
    // 将所有已上传成功的文件（图片和文档）以 file content 格式加入
    for (const file of fileList) {
        if (file.status === 'done' && file.url) {
            const extName = file.name?.split('.').pop() || '';
            contents.push({
                Type: 'file',
                File: {
                    DocId: file.docId || '0',
                    FileName: file.name || '',
                    FileUrl: file.url,
                    FileSize: String(file.size || 0),
                    FileType: extName,
                },
            });
        }
    }
    await fetchSSE(
        () => {
            return sendMessage(
                {
                    Contents: contents,
                    ConversationId: conversationId || undefined,
                    ApplicationId: applicationId,
                    FileInfos: fileList,
                },
                { signal: streamState.abortController?.signal },
                mergedApiDetailConfig.value.sendMessageApi
            );
        },
        {
            success(event: SseEvent) {
                if (event.Type === 'conversation') {
                    // 创建新的对话，重新调用 chatlist 接口更新列表
                    loadConversations();
                    if (event.Payload.IsNewConversation) {
                        const previousKey = streamConversationKey;
                        streamConversationKey = moveConversationRuntimeState(
                            previousKey,
                            event.Payload.Id,
                            event.Payload.ApplicationId || streamState.applicationId
                        );
                        if (currentConversationStateKey.value === previousKey) {
                            currentConversationStateKey.value = streamConversationKey;
                            internalCurrentConversation.value = event.Payload;
                        }
                        // 乐观 UI：把占位项（pending key）就地替换为真实会话
                        // 若 loadConversations() 已经先返回，pending 项在 SideLayout 端已被覆盖（fetchList 里以后端为准），
                        // 此时 replaceConversation 找不到对应 Id，方法内部 no-op
                        if (internalConversations.value.some(c => c.Id === previousKey)) {
                            sideLayoutRef.value?.replaceConversation(previousKey, event.Payload);
                        }
                    }
                    return;
                }

                const targetState = ensureConversationRuntimeState(streamConversationKey);
                if (!targetState) {
                    return;
                }
                const resolvedApplicationId =
                    targetState.applicationId ||
                    applicationId ||
                    internalCurrentApplication.value?.ApplicationId;

                const replacePlaceholder = (placeholderId: string, next: Record): Record | undefined => {
                    const placeholderIdx = targetState.records.findIndex(item => item.RecordId === placeholderId);
                    if (placeholderIdx !== -1) {
                        targetState.records.splice(placeholderIdx, 1, next);
                        return next;
                    }
                    return undefined;
                };

                const updateRecord = (next: Record, placeholderId: string): Record => {
                    const idx = targetState.records.findIndex(item => item.RecordId === next.RecordId);
                    if (idx !== -1) {
                        if (targetState.records[idx] !== undefined) {
                            Object.assign(targetState.records[idx], next);
                            return targetState.records[idx] as Record;
                        }
                        return next;
                    }
                    const replaced = replacePlaceholder(placeholderId, next);
                    if (replaced) {
                        return replaced;
                    }
                    targetState.records.push(next);
                    return next;
                };

                if (event.Type === 'request_ack') {
                    // 用户消息：替换占位
                    const placeholderUser = targetState.records.find(item => item.RecordId === 'placeholder-user');
                    const nextUser = applySseEventToRecord(event, placeholderUser);
                    if (nextUser) {
                        const appliedUser = updateRecord(nextUser, 'placeholder-user');
                        void hydrateReferences([appliedUser], { applicationId: resolvedApplicationId });
                    }
                } else {
                    // 助手消息：只用占位 + lastRecord
                    const lastIndex = targetState.records.length - 1;
                    const lastRecord = targetState.records[lastIndex];
                    const baseAssistant =
                        lastRecord && (lastRecord.RecordId === 'placeholder-agent' || lastRecord.Role === 'assistant')
                            ? lastRecord
                            : undefined;
                    const nextAssistant = applySseEventToRecord(event, baseAssistant);
                    if (nextAssistant) {
                        const appliedAssistant = updateRecord(nextAssistant, 'placeholder-agent');
                        void hydrateReferences([appliedAssistant], { applicationId: resolvedApplicationId });
                    }
                }

                // 每次收到数据后滚动到底部
                if (currentConversationStateKey.value === streamConversationKey) {
                    nextTick(() => {
                        mainLayoutRef.value?.getChatRef()?.backToBottom();
                    });
                }
            },
            complete(isOk) {
                const targetState = getConversationRuntimeState(streamConversationKey);
                if (targetState) {
                    targetState.isChatting = false;
                    targetState.abortController = null;
                }
                if (!isOk) {
                    return;
                }
                // 乐观 UI：路径 1（agentId 分支已提前拿到真实 conversationId）不会触发 SSE 的 conversation 事件，
                // 需要在 SSE 完成后主动刷一次列表，让后端返回的真实会话（含正式 Title / LastActiveAt）覆盖占位项。
                // 路径 2 已在 success 事件里就地替换过，这里的 loadConversations 只是"顺带兜底"，代价可以接受。
                if (isNewConversationSend) {
                    loadConversations();
                }
                // 完成后滚动到底部并延迟重置用户滚动状态
                if (currentConversationStateKey.value === streamConversationKey) {
                    nextTick(() => {
                        mainLayoutRef.value?.getChatRef()?.backToBottom();
                        setTimeout(() => {
                            mainLayoutRef.value?.getChatRef()?.setHasUserScrolled(false);
                        }, 500);
                    });
                }
            },
            fail(msg, errorEvent) {
                // 乐观 UI 回滚：SSE 失败时，若本次是新会话发送、且占位仍在，清掉避免侧栏残留死条目
                // 覆盖两种占位：pending-conversation:* 前缀（路径 2）和真实 Id 占位（路径 1，agentId 分支）
                if (isNewConversationSend) {
                    if (internalConversations.value.some(c => c.Id === streamConversationKey)) {
                        sideLayoutRef.value?.removeConversation(streamConversationKey);
                    }
                }
                handleStreamFailure(msg, errorEvent, streamConversationKey);
            }
        }
    );
};

// 内部停止处理（API 模式）
const handleInternalStop = () => {
    stopConversationStream(currentConversationStateKey.value);
    emit('stop');
};

// 内部加载更多处理（API 模式）
const handleInternalLoadMore = async (conversationId: string, lastRecordId: string) => {
    if (!useApiMode.value) {
        emit('loadMore', conversationId, lastRecordId);
        return;
    }

    // 确保 applications 列表已加载完成
    await applicationsReadyPromise;

    try {
        const response = await fetchConversationDetail(
            { ConversationId: conversationId, LastRecordId: lastRecordId },
            mergedApiDetailConfig.value.conversationDetailApi
        );
        const newRecords: Record[] = response?.Response?.Records || [];
        const applicationId = response?.Response?.ApplicationId || internalCurrentApplication.value?.ApplicationId || '';

        if (newRecords.length > 0) {
            await hydrateReferences(newRecords, { applicationId });
            const targetState = ensureConversationRuntimeState(conversationId);
            if (targetState) {
                targetState.records = [...newRecords, ...targetState.records];
                if (applicationId) {
                    targetState.applicationId = applicationId;
                }
            }
            mainLayoutRef.value?.notifyLoaded();
        } else {
            mainLayoutRef.value?.notifyComplete();
        }
        nextTick(() => {
            if (!lastRecordId) {
                mainLayoutRef.value?.getChatRef()?.backToBottom();
            }
        })
    } catch (error) {
        mainLayoutRef.value?.notifyComplete();
        const text = mergedChatI18n.value.loadMoreFailed;
        MessagePlugin.error(text);
        emit('message', MessageCode.LOAD_MORE_FAILED, text);
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
        const record = getConversationRecords(conversationId).find(r => r.RecordId === recordId);
        if (record) {
            record.Score = score;
        }
        // 显示感谢反馈信息（使用 i18n 文案）
        const message = score === ScoreValue.Like ? mergedChatItemI18n.value.thxForGood : score === ScoreValue.Dislike ? mergedChatItemI18n.value.thxForBad : '';
        if (message) {
            MessagePlugin.info(message);
        }
    } catch (error) {
        const text = mergedChatI18n.value.rateFailed;
        MessagePlugin.error(text);
        emit('message', MessageCode.RATE_FAILED, text);
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
                MessagePlugin.success(mergedChatI18n.value.copySuccess);
            },
            onError: () => {
                const text = mergedChatI18n.value.copyFailed;
                MessagePlugin.error(text);
                emit('message', MessageCode.COPY_FAILED, text);
            },
        });
    } catch (error) {
        const text = mergedChatI18n.value.shareFailed;
        MessagePlugin.error(text);
        emit('message', MessageCode.SHARE_FAILED, text);
    }
};

const handleToggleSidebar = () => {
    sidebarVisible.value = !sidebarVisible.value;
};

const handleSelectApplication = (app: Application) => {
    if (useApiMode.value) {
        internalCurrentApplication.value = app;
        internalCurrentConversation.value = undefined;
        currentConversationStateKey.value = '';
        // 清空 Sender 中的已选文件和输入内容
        const senderRef = mainLayoutRef.value?.getChatRef()?.getSenderRef();
        if (senderRef) {
            senderRef.changeSenderVal('', []);
        }
    }
    // 切换应用时关闭文件预览面板 & 定时任务面板
    closeFilePreview();
    closeCronTask();
    // 移动端选择应用后收起侧边栏
    if (isMobile.value || props.isSidePanelOverlay) {
        sidebarVisible.value = false;
    }
    emit('selectApplication', app);
};

const handleSelectConversation = async (conversation: ChatConversation) => {
    const isSameConversation =
        conversation.Id === internalCurrentConversation.value?.Id &&
        currentConversationStateKey.value === conversation.Id;

    if (isSameConversation) {
        if (isMobile.value) {
            sidebarVisible.value = false;
        }
        return;
    }

    if (useApiMode.value) {
        internalCurrentConversation.value = conversation;
        currentConversationStateKey.value = conversation.Id;
        setConversationApplicationId(conversation.Id, conversation.ApplicationId);
    }
    // 切换会话时关闭文件预览面板 & 定时任务面板
    closeFilePreview();
    closeCronTask();
    // 移动端选择对话后收起侧边栏
    if (isMobile.value) {
        sidebarVisible.value = false;
    }
    emit('selectConversation', conversation);
};

const handleCreateConversation = () => {
    if (useApiMode.value) {
        internalCurrentConversation.value = undefined;
        currentConversationStateKey.value = '';
    }
    // 创建新会话时关闭文件预览面板 & 定时任务面板
    closeFilePreview();
    closeCronTask();
    emit('createConversation');
};

/**
 * 定时任务面板 → 切回聊天：关闭覆盖层，透传给外部
 */
const handleCronTaskSwitchToChat = (payload: { task: TimerTask | TimerTaskSummary; sessionId?: string; logId?: string }) => {
    closeCronTask();
    emit('cronTaskSwitchToChat', payload);
};

/**
 * SideActions 快捷入口点击：
 * - key === 'cron-task'：打开定时任务面板（等同于顶栏 header-action 的 openCronTask）
 * - 其它 key：暂无内部处理逻辑（如需扩展可在此追加分支）
 */
const handleSideAction = (key: string) => {
    if (key === 'cron-task') {
        openCronTask();
    }
};

/**
 * 侧栏删除会话
 * 流程：
 *   1) 保护：进行中会话不允许删（HistoryList 里已过滤，这里再兜底一次）
 *   2) 弹二次确认（避免误操作）
 *   3) 乐观 UI：先从侧栏移除 → 请求后端 → 失败则回滚 + 提示
 *   4) 如果删的是当前会话，清空 chat 主区（视觉上退回到空态）
 *   5) 对 pending 占位（未真正落库的乐观项）：跳过后端调用，本地移除即可
 *   6) 清理 conversationRuntimeStates 中对应 key，避免残留状态影响 chattingConversationIds 计算
 * 非 API 模式：仅向外 emit，由父组件自处理
 */
const handleDeleteConversation = (conversation: ChatConversation) => {
    if (!conversation?.Id) return;

    if (!useApiMode.value) {
        emit('deleteConversation', conversation);
        return;
    }

    // 兜底：进行中会话禁止删除
    if (isConversationChatting(conversation.Id)) {
        MessagePlugin.warning('会话正在进行中，请先停止后再删除');
        return;
    }

    const isPendingPlaceholder = conversation.Id.startsWith('pending-conversation:');
    const title = (conversation.Title || '').slice(0, 40) || '该会话';

    const confirmDialog = DialogPlugin.confirm({
        header: '删除会话',
        body: `确认删除"${title}"？删除后不可恢复。`,
        confirmBtn: { content: '删除', theme: 'danger' },
        cancelBtn: '取消',
        onConfirm: async () => {
            confirmDialog.hide();

            // 乐观 UI：立即从侧栏移除
            // 通过 SideLayout 的 snapshot 拿到当前权威源快照用于失败回滚
            const prevList = sideLayoutRef.value?.snapshot?.() ?? internalConversations.value.slice();
            sideLayoutRef.value?.removeConversation(conversation.Id);

            // 如果删的是当前会话，清空主区状态
            const wasCurrent =
                internalCurrentConversation.value?.Id === conversation.Id ||
                currentConversationStateKey.value === conversation.Id;
            if (wasCurrent) {
                internalCurrentConversation.value = undefined;
                currentConversationStateKey.value = '';
                closeFilePreview();
            }

            // pending 占位：从未落库，仅清本地 runtime state
            if (isPendingPlaceholder) {
                delete conversationRuntimeStates.value[conversation.Id];
                return;
            }

            try {
                await deleteConversation(
                    conversation.Id,
                    mergedApiDetailConfig.value.conversationDeleteApi,
                );
                // 后端成功：清理对应 runtime state（历史 records / applicationId 等）
                delete conversationRuntimeStates.value[conversation.Id];
                emit('deleteConversation', conversation);
            } catch (err: any) {
                // 404：会话已经被其他端/其他 tab 删除，视为成功，UI 不回滚
                // 避免"我看到的还在，但后端说不存在"这种拧巴的状态
                const status = err?.response?.status ?? err?.status;
                if (status === 404) {
                    delete conversationRuntimeStates.value[conversation.Id];
                    emit('deleteConversation', conversation);
                    return;
                }
                // 其它错误：回滚，把这条塞回原位置
                sideLayoutRef.value?.rollback(prevList);
                if (wasCurrent) {
                    internalCurrentConversation.value = conversation;
                    currentConversationStateKey.value = conversation.Id;
                }
                MessagePlugin.error('删除失败，请稍后重试');
                console.error('删除会话失败:', err);
            }
        },
    });
};

const handleClose = () => {
    emit('close');
};

const handleOverlay = () => {
    emit('overlay', !props.isOverlay);
};

// 内部复制处理
const handleInternalCopy = async (rowtext: string | undefined, content: string | undefined, type: string) => {
    await copyToClipboard(content, {
        rawText: rowtext,
        isMobile: isMobile.value,
        onSuccess: () => {
            MessagePlugin.success(mergedChatI18n.value.copySuccess);
        },
        onError: () => {
            const text = mergedChatI18n.value.copyFailed;
            MessagePlugin.error(text);
            emit('message', MessageCode.COPY_FAILED, text);
        },
    });
    emit('copy', rowtext, content, type);
};

/**
 * 发送 widget_action SSE 请求
 * 从 handleInternalWidgetEvent 中提取的 SSE 通信逻辑
 */
const sendWidgetActionSSE = async (conversationId: string, applicationId: string, widgetAction: WidgetActionRequest) => {
    let streamConversationKey = conversationId || currentConversationStateKey.value || createPendingConversationKey();
    currentConversationStateKey.value = streamConversationKey;
    const streamState = ensureConversationRuntimeState(streamConversationKey);
    if (!streamState) return;

    streamState.isChatting = true;
    streamState.applicationId = applicationId || streamState.applicationId;
    mainLayoutRef.value?.getChatRef()?.setHasUserScrolled(false);

    const timestamp = Date.now();
    const baseExtraInfo = (isFromSelf: boolean) => ({
        RequestId: '',
        TraceId: '',
        Elapsed: 0,
        StartTime: timestamp,
        IsFromSelf: isFromSelf,
    });

    // 创建助手消息占位
    const assistantRecord: Record = {
        Role: 'assistant',
        RecordId: 'placeholder-agent',
        ConversationId: conversationId || streamConversationKey,
        Status: 'processing',
        StatusDesc: '',
        Messages: [],
        ExtraInfo: baseExtraInfo(false),
    };
    streamState.records.push(assistantRecord);

    nextTick(() => {
        mainLayoutRef.value?.getChatRef()?.backToBottom();
    });

    streamState.abortController = new AbortController();

    const contents = [{ Type: 'widget_action', WidgetAction: widgetAction }];

    await fetchSSE(
        () => sendMessage(
            {
                Contents: contents,
                ConversationId: conversationId || undefined,
                ApplicationId: applicationId,
            },
            { signal: streamState.abortController?.signal },
            mergedApiDetailConfig.value.sendMessageApi
        ),
        {
            success(sseEvent: SseEvent) {
                if (sseEvent.Type === 'conversation') {
                    loadConversations();
                    if (sseEvent.Payload.IsNewConversation) {
                        const previousKey = streamConversationKey;
                        streamConversationKey = moveConversationRuntimeState(
                            previousKey,
                            sseEvent.Payload.Id,
                            sseEvent.Payload.ApplicationId || streamState.applicationId
                        );
                        if (currentConversationStateKey.value === previousKey) {
                            currentConversationStateKey.value = streamConversationKey;
                            internalCurrentConversation.value = sseEvent.Payload;
                        }
                    }
                    return;
                }

                const targetState = ensureConversationRuntimeState(streamConversationKey);
                if (!targetState) return;

                const resolvedApplicationId =
                    targetState.applicationId ||
                    applicationId ||
                    internalCurrentApplication.value?.ApplicationId;

                const replacePlaceholder = (placeholderId: string, next: Record): Record | undefined => {
                    const placeholderIdx = targetState.records.findIndex(item => item.RecordId === placeholderId);
                    if (placeholderIdx !== -1) {
                        targetState.records.splice(placeholderIdx, 1, next);
                        return next;
                    }
                    return undefined;
                };

                const updateRecord = (next: Record, placeholderId: string): Record => {
                    const idx = targetState.records.findIndex(item => item.RecordId === next.RecordId);
                    if (idx !== -1) {
                        if (targetState.records[idx] !== undefined) {
                            Object.assign(targetState.records[idx], next);
                            return targetState.records[idx] as Record;
                        }
                        return next;
                    }
                    const replaced = replacePlaceholder(placeholderId, next);
                    if (replaced) return replaced;
                    targetState.records.push(next);
                    return next;
                };

                // Widget action 的 request_ack 包含用户消息记录
                if (sseEvent.Type === 'request_ack') {
                    const nextUser = applySseEventToRecord(sseEvent, undefined);
                    if (nextUser) {
                        const placeholderIdx = targetState.records.findIndex(item => item.RecordId === 'placeholder-agent');
                        if (placeholderIdx !== -1) {
                            targetState.records.splice(placeholderIdx, 0, nextUser);
                        } else {
                            const lastIdx = targetState.records.length - 1;
                            targetState.records.splice(lastIdx, 0, nextUser);
                        }
                    }
                    return;
                } else {
                    const lastIndex = targetState.records.length - 1;
                    const lastRecord = targetState.records[lastIndex];
                    const baseAssistant =
                        lastRecord && (lastRecord.RecordId === 'placeholder-agent' || lastRecord.Role === 'assistant')
                            ? lastRecord
                            : undefined;
                    const nextAssistant = applySseEventToRecord(sseEvent, baseAssistant);
                    if (nextAssistant) {
                        const appliedAssistant = updateRecord(nextAssistant, 'placeholder-agent');
                        void hydrateReferences([appliedAssistant], { applicationId: resolvedApplicationId });
                    }
                }
            },
            complete(isOk) {
                const targetState = conversationRuntimeStates.value[streamConversationKey];
                if (targetState) {
                    targetState.isChatting = false;
                    targetState.abortController = null;
                }
                if (!isOk) {
                    return;
                }
                if (currentConversationStateKey.value === streamConversationKey) {
                    nextTick(() => {
                        mainLayoutRef.value?.getChatRef()?.backToBottom();
                    });
                }
            },
            fail(msg, errorEvent) {
                handleStreamFailure(msg, errorEvent, streamConversationKey);
            }
        }
    );
};

// 内部 Widget 事件处理（API 模式）
const handleInternalWidgetEvent = async (event: CustomEvent, widgetRunId: string, widgetId: string, recordId: string) => {
    // 使用集中式事件处理器进行路由分发
    const result = routeWidgetEvent(event, widgetRunId, widgetId);
    
    // sys.go_to_url / sys.download 等本地处理完成的事件
    if (result.handled) {
        emit('widgetEvent', event, widgetRunId, widgetId, recordId);
        return;
    }
    
    // sys.chat / sys.clarify - 需要发送 SSE 请求
    if (result.widgetActionRequest) {
        // 检查是否正在进行请求
        const currentKey = currentConversationStateKey.value;
        if (currentKey && isConversationChatting(currentKey)) {
            console.warn('[layout/Index] widget action: 正在进行请求，跳过此次提交');
            if (recordId) {
                disableWidgetsByRecordId(recordId);
            }
            return;
        }
        
        // 先禁用该消息下的所有 widgets（防止重复提交）
        if (recordId) {
            disableWidgetsByRecordId(recordId);
        }
        
        if (!useApiMode.value) {
            emit('widgetEvent', event, widgetRunId, widgetId, recordId);
            return;
        }
        
        const conversationId = internalCurrentConversation.value?.Id || currentConversationStateKey.value;
        const applicationId = internalCurrentApplication.value?.ApplicationId || '';
        
        if (!conversationId) {
            console.warn('[layout/Index] widget action: 没有当前会话');
            emit('widgetEvent', event, widgetRunId, widgetId, recordId);
            return;
        }
        
        // 发送 widget_action SSE 请求
        await sendWidgetActionSSE(conversationId, applicationId, result.widgetActionRequest);
        
        emit('widgetEvent', event, widgetRunId, widgetId, recordId);
        return;
    }
    
    // 其他事件类型，只向外传递
    emit('widgetEvent', event, widgetRunId, widgetId, recordId);
};

// 内部文件上传处理（API 模式）
const handleInternalUploadFile = async (files: File[]) => {
    if (!useApiMode.value) {
        emit('uploadFile', files);
        return;
    }

    if (isUploading.value) return;

    isUploading.value = true;
    emit('uploadStatus', 'uploading');

    const senderRef = mainLayoutRef.value?.getChatRef()?.getSenderRef();

    for (const file of files) {
        const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
        const category = file.type.startsWith('image/') ? 'image' : 'document';

        // 立即添加文件到列表，状态为 uploading，显示 loading
        if (senderRef) {
            senderRef.addFile({
                uid,
                name: file.name,
                url: '',
                size: file.size,
                type: file.type,
                category,
                status: 'uploading',
            });
        }

        try {
            const response = await uploadFile(file, currentApplicationId.value, mergedApiDetailConfig.value.uploadApi, chatMode.value);
            if (senderRef && response) {
                const fileUrl = response.Url || response.url;
                senderRef.updateFile(uid, {
                    url: fileUrl,
                    status: 'done',
                });

                // standard 模式下，非图片文件需要调用实时文档解析获取 doc_id
                if (chatMode.value === 'standard' && category === 'document' && mergedApiDetailConfig.value.fileParseApi) {
                    const extName = file.name.split('.').pop() || '';
                    try {
                        const parseResult = await parseFile({
                            ApplicationId: currentApplicationId.value,
                            FileName: file.name,
                            FileType: extName,
                            FileUrl: fileUrl,
                            CosUrl: response.CosUrl || response.cos_url || '',
                            CosBucket: response.CosBucket || response.cos_bucket || '',
                            ETag: response.ETag || response.e_tag || '',
                            CosHash: response.CosHash || response.cos_hash || '',
                            Size: String(file.size || 0),
                        }, mergedApiDetailConfig.value.fileParseApi);

                        if (parseResult && parseResult.doc_id && parseResult.doc_id !== '0') {
                            senderRef.updateFile(uid, { docId: parseResult.doc_id });
                        }
                    } catch (parseError) {
                        console.warn('文档解析失败，将使用 FileUrl 模式:', parseError);
                    }
                }
            }
        } catch (error) {
            if (senderRef) {
                senderRef.removeFile(uid);
            }
            const uploadErrorText = mergedSenderI18n.value.uploadError;
            MessagePlugin.error(uploadErrorText);
            emit('message', MessageCode.FILE_UPLOAD_FAILED, uploadErrorText);
        }
    }

    isUploading.value = false;
    emit('uploadStatus', 'done');
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
            if (foundConv && (
                foundConv.Id !== internalCurrentConversation.value?.Id ||
                currentConversationStateKey.value !== foundConv.Id
            )) {
                internalCurrentConversation.value = foundConv;
                currentConversationStateKey.value = foundConv.Id;
                setConversationApplicationId(foundConv.Id, foundConv.ApplicationId);
                // 如果会话有关联的应用，且未指定 appId，则自动切换应用
                if (!appId && foundConv.ApplicationId && apps.length > 0) {
                    const convApp = apps.find(app => app.ApplicationId === foundConv.ApplicationId);
                    if (convApp) {
                        internalCurrentApplication.value = convApp;
                    }
                }
            }
        } else if (!convId && prevConvId) {
            // ID 从有值变为空时，清空当前会话
            internalCurrentConversation.value = undefined;
            currentConversationStateKey.value = '';
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

// 监听外部传入的 currentConversation 对象变化，同步内部状态
watch([() => props.currentConversation, () => actualApplications.value], async ([newConversation, apps]) => {
    if (newConversation && (
        newConversation.Id !== internalCurrentConversation.value?.Id ||
        currentConversationStateKey.value !== newConversation.Id
    )) {
        internalCurrentConversation.value = newConversation;
        currentConversationStateKey.value = newConversation.Id;
        setConversationApplicationId(newConversation.Id, newConversation.ApplicationId);
        // 同时更新对应的应用
        if (newConversation.ApplicationId && apps.length > 0) {
            const foundApp = apps.find(app => app.ApplicationId === newConversation.ApplicationId);
            if (foundApp) {
                internalCurrentApplication.value = foundApp;
            }
        }
    }
}, { immediate: true });

// 组件挂载时自动加载数据
onMounted(async () => {
    if (useApiMode.value && props.autoLoad) {
        // axios 配置已由 useApiConfig composable 自动处理
        // 先加载用户信息和系统配置，因为如果配置了AUTO_CREATE_ACCOUNT，会在加载用户信息时创建账户
        await Promise.all([
            loadUserInfo(),
            loadSystemConfig(),
        ]);
        await Promise.all([
            loadApplications(),
            loadConversations(),
        ]);
    }
});

onUnmounted(() => {
    Object.values(conversationRuntimeStates.value).forEach((state) => {
        state.abortController?.abort();
        state.abortController = null;
        state.isChatting = false;
    });
});

// 暴露方法供外部调用
defineExpose({
    loadApplications,
    loadConversations,
    loadConversationDetail,
    loadUserInfo,
    loadSystemConfig,
    notifyLoaded: () => mainLayoutRef.value?.notifyLoaded(),
    notifyComplete: () => mainLayoutRef.value?.notifyComplete(),
    openFilePreview,
    closeFilePreview,
    getFilePreviewRef: () => filePreviewLayoutRef.value,
    openCronTask,
    closeCronTask,
    isCronTaskVisible: () => cronTaskVisible.value,
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
                ref="sideLayoutRef"
                :isMobile="isMobile"
                :visible="sidebarVisible"
                :applications="actualApplications"
                :currentApplicationId="currentApplicationId"
                :currentApplication="actualCurrentApplication"
                :conversations="actualConversations"
                :useInternalFetch="useApiMode"
                :conversationListApi="mergedApiDetailConfig.conversationListApi"
                :currentConversationId="currentConversationId"
                :chattingConversationIds="chattingConversationIds"
                :userAvatarUrl="actualUser?.avatarUrl"
                :userAvatarName="actualUser?.avatarName"
                :userName="actualUser?.name"
                :theme="theme"
                :languageOptions="languageOptions"
                :isSidePanelOverlay="isSidePanelOverlay"
                :maxAppLen="maxAppLen"
                :i18n="props.sideI18n"
                :showCronTaskAction="enableCronTask"
                :sideActionActiveKey="cronTaskVisible ? 'cron-task' : ''"
                :channelSettingUserId="currentUserId"
                :channelSettingAgentId="currentAgentId"
                @toggleSidebar="handleToggleSidebar"
                @selectApplication="handleSelectApplication"
                @selectConversation="handleSelectConversation"
                @deleteConversation="handleDeleteConversation"
                @toggleTheme="emit('toggleTheme')"
                @changeLanguage="(key) => emit('changeLanguage', key)"
                @logout="emit('logout')"
                @userClick="emit('userClick')"
                @conversationsChange="handleSideConversationsChange"
                @conversationsLoaded="handleSideConversationsLoaded"
                @fetchError="handleSideFetchError"
                @sideAction="handleSideAction"
            >
                <template #sider-logo v-if="(logoUrl || logoTitle) || $slots['sider-logo']">
                    <slot name="sider-logo">
                        <LogoArea v-if="logoUrl || logoTitle" :logoUrl="logoUrl" :title="logoTitle" />
                    </slot>
                </template>
            </SideLayout>
            <div class="main-area">
            <MainLayout
                v-show="!cronTaskVisible"
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
                :language="props.language"
                :mode="chatMode"
                :showSidebarToggle="!sidebarVisible"
                :aiWarningText="aiWarningText"
                :i18n="props.chatI18n"
                :chatItemI18n="props.chatItemI18n"
                :senderI18n="props.senderI18n"
                :useInternalRecord="useApiMode"
                :asrUrlApi="mergedApiDetailConfig.asrUrlApi"
                :enableVoiceInput="enableVoiceInput"
                :isUploading="isUploading"
                :isOverlay="props.isOverlay"
                :enableSkills="props.enableSkills"
                :skillsSpaceId="resolvedSpaceId"
                :skillsApplicationId="skillsAppId"
                :suggestionApi="mergedApiDetailConfig.suggestionListApi"
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
                @uploadStatus="(status: 'uploading' | 'done') => emit('uploadStatus', status)"
                @startRecord="emit('startRecord')"
                @stopRecord="emit('stopRecord')"
                @message="(code: MessageCode, message: string) => emit('message', code, message)"
                @conversationChange="(conversationId: string) => emit('conversationChange', conversationId)"
                @widgetEvent="handleInternalWidgetEvent"
            >
                <template #header-actions>
                    <Tooltip v-if="enableCronTask" :content="mergedSideI18n.cronTask" destroyOnClose showArrow theme="default">
                        <span
                            class="header-action-btn"
                            :class="{ 'header-action-btn--active': cronTaskVisible }"
                            @click="openCronTask"
                        >
                            <CustomizedIcon remote name="basic_time_line" :theme="theme" />
                        </span>
                    </Tooltip>
                    <Tooltip v-if="!isMobile && chatMode !== 'standard'" :content="mergedFilePreviewI18n.openFileList" destroyOnClose showArrow theme="default">
                        <span class="open-file-list-btn" @click="toggleFilePreview">
                            <CustomizedIcon name="open_file_list" :theme="theme" />
                        </span>
                    </Tooltip>
                </template>
                <template #header-overlay-content v-if="showOverlayButton || $slots['header-overlay-content']">
                    <slot name="header-overlay-content">
                        <CustomizedIcon class="header-overlay-icon" v-if="showOverlayButton" name="overlay" :theme="theme" @click="handleOverlay"/>
                    </slot>
            </template>
                <template #header-close-content v-if="showCloseButton || $slots['header-close-content']">
                    <slot name="header-close-content">
                        <CustomizedIcon class="header-overlay-icon" v-if="showCloseButton" name="logout_close" :theme="theme" @click="handleClose"/>
                    </slot>
                </template>
            </MainLayout>
            <CronTask
                v-if="enableCronTask"
                v-show="cronTaskVisible"
                class="cron-task-overlay"
                :application-id="currentApplicationId"
                :space-id="resolvedSpaceId"
                :theme="theme"
                :language="props.language"
                :i18n="cronTaskI18n"
                :model-options="cronTaskModelOptions"
                :folder-options="cronTaskFolderOptions"
                :page-size="cronTaskPageSize"
                :poll-interval="cronTaskPollInterval"
                @run-and-view="(task: TimerTask | TimerTaskSummary) => emit('cronTaskRunAndView', task)"
                @optimize-prompt="(content: string) => emit('cronTaskOptimizePrompt', content)"
                @refresh="() => { /* 交由内部处理 */ }"
                @switch-to-chat="handleCronTaskSwitchToChat"
                @action-done="(action: string, task: TimerTask | TimerTaskSummary) => emit('cronTaskActionDone', action, task)"
            />
            <FilePreviewLayout
                ref="filePreviewLayoutRef"
                :visible="filePreviewVisible"
                :conversationId="currentConversationId"
                :applicationId="currentApplicationId"
                :i18n="mergedFilePreviewI18n"
                @close="closeFilePreview"
            />
            </div>
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
    background: var(--td-mask-disabled);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 99;
}
.header-overlay-icon{
    margin-left: var(--td-size-4);
}

.open-file-list-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--td-comp-size-m);
    height: var(--td-comp-size-m);
    border-radius: var(--td-radius-medium);
    cursor: pointer;
    color: var(--td-text-color-secondary);
    transition: all 0.2s;
}

.open-file-list-btn:hover {
    color: var(--td-brand-color);
    background: var(--td-bg-color-container-hover);
}

/* 顶栏通用图标按钮（定时任务等） */
.header-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--td-comp-size-m);
    height: var(--td-comp-size-m);
    border-radius: var(--td-radius-medium);
    cursor: pointer;
    color: var(--td-text-color-secondary);
    transition: all 0.2s;
    margin-right: 4px;
}

.header-action-btn:hover {
    color: var(--td-brand-color);
    background: var(--td-bg-color-container-hover);
}

.header-action-btn--active {
    color: var(--td-brand-color);
    background: var(--td-bg-color-container-active);
}

/* 主区容器：让 MainLayout 与 CronTask 覆盖层共享同一区域 */
.main-area {
    flex: 1;
    min-width: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
}
/* 定时任务覆盖层：填充主区，覆盖会话窗口 */
.cron-task-overlay {
    position: absolute;
    inset: 0;
    background: var(--td-bg-color-container);
    z-index: 2;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
</style>
