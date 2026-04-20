<!-- ADP 聊天布局主组件，支持 API 模式和 Props 模式 -->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick, toRefs } from 'vue';
import { Layout as TLayout, Content as TContent, MessagePlugin } from 'tdesign-vue-next';

// TLayout, TContent 已导入，模板中使用对应组件
import MainLayout from './MainLayout.vue';
import SideLayout from './SideLayout.vue';
import LogoArea from '../LogoArea.vue';
import CustomizedIcon from '../CustomizedIcon.vue';
import type { Application } from '../../model/application';
import type { ChatConversation, Record, Reference, SseEvent } from '../../model/chat-v2';
import type { FileProps } from '../../model/file';
import { ScoreValue } from '../../model/chat-v2';
import type { ApiConfig } from '../../service/api';
import {
    fetchApplicationList,
    fetchConversationList,
    fetchConversationDetail,
    fetchReferenceDetails,
    sendMessage,
    rateMessage,
    createShare,
    fetchUserInfo,
    uploadFile,
    fetchSystemConfig,
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
    ThemeProps,
    OverlayProps
} from '../../model/type';
import { 
    defaultLanguageOptions,
    themePropsDefaults,
    overlayPropsDefaults,
    defaultChatI18n,
    defaultChatI18nEn,
    defaultChatItemI18n,
    defaultChatItemI18nEn,
    defaultSenderI18n,
    defaultSenderI18nEn,
    defaultSideI18n,
    defaultSideI18nEn
} from '../../model/type';

export interface Props extends ThemeProps, OverlayProps {
    /** 当前语言标识，用于自动选择内部默认 i18n（如 'zh-CN'、'en-US'） */
    language?: string;
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
    /** API 配置 - 如果传入则使用 HTTP 请求获取数据 */
    apiConfig?: ApiConfig;
    /** 是否自动加载数据（仅在使用 apiConfig 时生效） */
    autoLoad?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    ...overlayPropsDefaults,
    language: 'zh-CN',
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
}>();

// 解构 props 保持响应式
const { theme } = toRefs(props);

const sidebarVisible = ref(!props.isSidePanelOverlay);
const mainLayoutRef = ref<InstanceType<typeof MainLayout> | null>(null);

// 上传状态
const isUploading = ref(false);

// 合并 i18n 配置
const mergedChatItemI18n = computed(() => ({
    ...defaultChatItemI18n,
    ...props.chatItemI18n
}));

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
const internalUser = ref<{ avatarUrl?: string; avatarName?: string; name?: string }>({});
const internalCurrentApplication = ref<Application | undefined>(undefined);
const internalCurrentConversation = ref<ChatConversation | undefined>(undefined);
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

const handleStreamFailure = (msg: unknown) => {
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
    if (typeof msg === 'string') {
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

// 计算属性
const currentApplicationId = computed(() => actualCurrentApplication.value?.ApplicationId || '');
const currentApplicationAvatar = computed(() => actualCurrentApplication.value?.Avatar || '');
const currentApplicationName = computed(() => actualCurrentApplication.value?.Name || '');
const currentApplicationGreeting = computed(() => actualCurrentApplication.value?.Greeting || '');
const currentApplicationOpeningQuestions = computed(() => actualCurrentApplication.value?.OpeningQuestions || []);
const currentConversationId = computed(() => props.currentConversationId || actualCurrentConversation.value?.Id || '');

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
        const text = mergedChatI18n.value.getAppListFailed;
        MessagePlugin.error(text);
        emit('message', MessageCode.GET_APP_LIST_FAILED, text);
    }
};

const loadConversations = async () => {
    if (!useApiMode.value) return;
    try {
        const data = await fetchConversationList(mergedApiDetailConfig.value.conversationListApi);
        internalConversations.value = data;
        emit('dataLoaded', 'conversations', data);
    } catch (error) {
        const text = mergedChatI18n.value.getConversationListFailed;
        MessagePlugin.error(text);
        emit('message', MessageCode.GET_CONVERSATION_LIST_FAILED, text);
    }
};

const loadConversationDetail = async (conversationId: string) => {
    if (!useApiMode.value || !conversationId) return;
    try {
        const response = await fetchConversationDetail(
            { ConversationId: conversationId },
            mergedApiDetailConfig.value.conversationDetailApi
        );
        const records = response?.Response?.Records || [];
        setConversationRecords(conversationId, records, response?.Response?.ApplicationId);
        await hydrateReferences(records, {
            applicationId: response?.Response?.ApplicationId,
        });
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
    if (!useApiMode.value) {
        emit('send', query, fileList, conversationId, applicationId);
        return;
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

    const timestamp = Date.now();
    const baseExtraInfo = (isFromSelf: boolean) => ({
        RequestId: '',
        TraceId: '',
        Elapsed: 0,
        StartTime: timestamp,
        IsFromSelf: isFromSelf,
    });

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
                Contents: [{ Type: 'text', Text: query }],
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
    const contents = [{ Type: 'text', Text: query }];

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
            fail(msg) {
                handleStreamFailure(msg);
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

    try {
        const response = await fetchConversationDetail(
            { ConversationId: conversationId, LastRecordId: lastRecordId },
            mergedApiDetailConfig.value.conversationDetailApi
        );
        const newRecords = response?.Response?.Records || [];
        if (newRecords.length > 0) {
            await hydrateReferences(newRecords, {
                applicationId: response?.Response?.ApplicationId || internalCurrentApplication.value?.ApplicationId,
            });
            const targetState = ensureConversationRuntimeState(conversationId);
            if (targetState) {
                targetState.records = [...newRecords, ...targetState.records];
                if (response?.Response?.ApplicationId) {
                    targetState.applicationId = response.Response.ApplicationId;
                }
            }
            mainLayoutRef.value?.notifyLoaded();
        } else {
            mainLayoutRef.value?.notifyComplete();
        }
        nextTick(() => {
            // 仅首次加载滚动到最底部，并开启自动滚动窗口（处理图片等异步加载）
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
    }
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
    emit('createConversation');
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
            fail(msg) {
                handleStreamFailure(msg);
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

    isUploading.value = true;
    emit('uploadStatus', 'uploading');

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
                :isMobile="isMobile"
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
                :i18n="props.sideI18n"
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
                :language="props.language"
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
.header-overlay-icon{
    margin-left: var(--td-size-4);
}
</style>
