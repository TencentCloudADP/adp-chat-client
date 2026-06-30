<!-- 聊天主界面组件，负责消息展示、发送、历史加载等 -->
<template>
    <!-- 聊天内容容器 -->
    <div id="chat-content" class="chat-box">
        <!-- 聊天组件 -->
        <TChat ref="chatRef" :class="{ isChatting: isChatting }" :reverse="false" style="height: 100%; flex: 1; min-width: 0;" :clear-history="false"
            @scroll="handleChatScroll" @clear="clearConfirm">
            <!-- 默认问题提示 -->
            <template v-if="chatList.length <= 0 && !messageLoading && !chatId">
                <AppType
                    :currentApplicationAvatar="currentApplicationAvatar"
                    :currentApplicationName="currentApplicationName"
                    :currentApplicationGreeting="currentApplicationGreeting"
                    :currentApplicationOpeningQuestions="currentApplicationOpeningQuestions"
                    :isMobile="isMobile"
                    :isOverlay="isOverlay"
                    :i18n="i18n"
                    :language="language"
                    @selectQuestion="getDefaultQuestion"
                />
            </template>
            <!-- 聊天消息列表 -->
            <template v-else>
                <div class="content selectable" :class="{ isMobile: isMobile, isFull: chatList.length <= 0 }">
                    <InfiniteLoading v-if="chatId" :identifier="chatId" direction="top" @infinite="infiniteHandler">
                        <template #spinner>
                            <div>
                                <TLoading size="small">
                                    <template #text>
                                        <span class="thinking-text">
                                            {{ `${i18n.loading}...` }}
                                        </span>
                                    </template>
                                    <template #indicator>
                                        <CustomizedIcon class="thinking-icon" name="thinking" :theme="theme" nativeIcon />
                                    </template>
                                </TLoading>
                            </div>
                        </template>
                        <template #no-more>
                            <div></div>
                        </template>
                        <template #no-results>
                            <div></div>
                        </template>
                    </InfiniteLoading>
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
                                :mode="props.mode"
                                :language="props.language"
                                :i18n="chatItemI18n"
                                :chat-i18n="i18n"
                                :mentionSkills="mentionSkills"
                                :mentionTools="mentionTools"
                                :mentionConnectors="mentionConnectors"
                                @resend="onResend"
                                @share="onShare"
                                @rate="onRate"
                                @copy="onCopy"
                                @sendMessage="inputEnter"
                                @widgetEvent="onWidgetEvent"
                            />
                        </div>
                    </div>
                </div>
            </template>
            <!-- 底部发送区域 -->
            <template #footer>
                <!-- 回到底部按钮 -->
                <BackToBottom 
                    v-show="chatId && ((isShowToBottom && !isChatting) || hasUserScrolled)"
                    :loading="isChatting" 
                    :theme="theme"
                    @click="handleClickBackToBottom" 
                />
                <TCard v-if="isSelecting" size="small" class="share-setting-container"  shadow
                    bodyClassName="share-setting-card">
                    <div class="share-setting-content">
                        <TCheckbox :indeterminate="selectedIds.length !== chatList.length && selectedIds.length !== 0"
                            :checked="checkall" @change="handleCheckAll">{{ i18n.checkAll }}</TCheckbox>
                        <TDivider layout="vertical"></TDivider>
                        <div class="share-text">
                            {{ i18n.shareFor }}
                            <div class="icon__share-copy" :class="{ disabled: selectedIds.length <= 0 }"
                                @click="handleCopyShare()">
                                <CustomizedIcon remote size="xs" name="basic_relation_line" :theme="theme" />
                                <span>{{ i18n.copyUrl }}</span>
                            </div>
                        </div>
                        <TDivider layout="vertical"></TDivider>
                        <div class="icon__share-close" @click="handleCloseShare()">
                            <span>{{ i18n.cancelShare }}</span>
                        </div>
                    </div>
                </TCard>

                <Sender 
                    ref="senderRef" 
                    :isStreamLoad="isChatting" 
                    :isMobile="isMobile"
                    :theme="theme"
                    :mode="props.mode"
                    :language="props.language"
                    :i18n="senderI18n"
                    :useInternalRecord="useInternalRecord"
                    :asrUrlApi="asrUrlApi"
                    :enableVoiceInput="props.enableVoiceInput"
                    :isUploading="props.isUploading"
                    :currentApplicationId="props.currentApplicationId"
                    :enableSkills="props.enableSkills && agentDetailAvailable"
                    :enableModelSelector="props.enableModelSelector && agentDetailAvailable"
                    :enableConnector="props.enableConnector && agentDetailAvailable"
                    :enableTools="props.enableTools && agentDetailAvailable"
                    :spaceId="props.skillsSpaceId"
                    :skillsApplicationId="skillsAppId"
                    @stop="onStop"
                    @send="handleSend"
                    @uploadFile="handleUploadFile"
                    @startRecord="handleStartRecord"
                    @stopRecord="handleStopRecord"
                    @message="handleMessage"
                    @mention-list-update="onMentionListUpdate"
                />
            </template>
        </TChat>
    </div>
</template>

<script setup lang="tsx">
import { ref, watch, computed, onMounted, onUnmounted, nextTick, toRefs } from 'vue'
import InfiniteLoading from 'vue-infinite-loading'
import { Chat as TChat } from '@tdesign-vue-next/chat'
import { Checkbox, Loading as TLoading, Card as TCard, Checkbox as TCheckbox, Divider as TDivider } from 'tdesign-vue-next'
import type { Record } from '../../model/chat-v2'
import type { NormalizedSkill, AgentSkillInfo } from '../../model/skills'
import { normalizeSkill } from '../../composables/useSkills'
import { useAgentStore } from '../../composables/useAgentStore'

import { ScoreValue } from '../../model/chat-v2'
import type { FileProps } from '../../model/file';
import { MessageCode } from '../../model/messages';
import type { ChatRelatedProps, ChatI18n, ChatItemI18n, SenderI18n } from '../../model/type'
import { chatRelatedPropsDefaults, defaultChatI18n, defaultChatI18nEn, defaultChatItemI18n, defaultChatItemI18nEn, defaultSenderI18n, defaultSenderI18nEn } from '../../model/type'

import AppType from './AppType.vue'
import Sender from './Sender.vue'
import BackToBottom from './BackToBottom.vue'
import ChatItem from './ChatItem.vue'
import CustomizedIcon from '../CustomizedIcon.vue';

export interface Props extends ChatRelatedProps {
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
    /** 是否启用语音输入 */
    enableVoiceInput?: boolean;
    /** 是否正在上传文件 */
    isUploading?: boolean;
    /** 是否显示遮罩层 */
    isOverlay?: boolean;
    /** 是否启用 Skills 功能 */
    enableSkills?: boolean;
    /** 是否显示模型选择器 */
    enableModelSelector?: boolean;
    /** 是否显示连接器按钮 */
    enableConnector?: boolean;
    /** 是否显示工具按钮 */
    enableTools?: boolean;
    /** Skills 空间 ID */
    skillsSpaceId?: string;
    /** Skills 应用 ID（/adp/ 转发需要） */
    skillsApplicationId?: string;
}

const props = withDefaults(defineProps<Props>(), {
    ...chatRelatedPropsDefaults,
    chatId: '',
    chatList: () => [],
    isChatting: false,
    currentApplicationId: '',
    currentApplicationAvatar: '',
    currentApplicationName: '',
    currentApplicationGreeting: '',
    currentApplicationOpeningQuestions: () => [],
    i18n: () => ({}),
    chatItemI18n: () => ({}),
    senderI18n: () => ({}),
    useInternalRecord: false,
    asrUrlApi: '',
    enableVoiceInput: true,
    isUploading: false,
    isOverlay: false,
    enableSkills: false,
    enableModelSelector: false,
    enableConnector: false,
    enableTools: false,
    skillsSpaceId: '',
    skillsApplicationId: '',
});

// 解构 props 以便在模板中使用
const {
    chatId,
    currentApplicationAvatar,
    currentApplicationName,
    currentApplicationGreeting,
    currentApplicationOpeningQuestions,
    isChatting,
    isOverlay,
    isMobile,
    theme,
    useInternalRecord,
    asrUrlApi
} = toRefs(props);

// 合并默认值和传入值（根据 language 选择对应语言的默认值）
const i18n = computed(() => {
    const defaults = props.language?.startsWith('en') ? defaultChatI18nEn : defaultChatI18n;
    return { ...defaults, ...props.i18n };
});

const chatItemI18n = computed(() => {
    const defaults = props.language?.startsWith('en') ? defaultChatItemI18nEn : defaultChatItemI18n;
    return { ...defaults, ...props.chatItemI18n };
});

const senderI18n = computed(() => {
    const defaults = props.language?.startsWith('en') ? defaultSenderI18nEn : defaultSenderI18n;
    return { ...defaults, ...props.senderI18n };
});

/** Skills 用的 ApplicationId：优先 skillsApplicationId，否则用当前应用 ID */
const skillsAppId = computed(() => {
    const val = props.skillsApplicationId || props.currentApplicationId || '';
    return val;
});

const { getAgentDetailByAppId } = useAgentStore();

/** 标记 getAgentDetailByAppId 是否返回了有效数据，用于和外部传入的 enable* props 做 AND 运算 */
const agentDetailAvailable = ref(false);

// 调试：持续打印 currentApplicationId 变化
watch(() => props.currentApplicationId, (v) => {
    console.log('[Chat/Index] currentApplicationId prop changed:', v, 'skillsAppId:', skillsAppId.value);
}, { immediate: true });

const emit = defineEmits<{
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
    /** widget 事件（用于与 SSE/对话流交互） */
    (e: 'widgetEvent', event: CustomEvent, widgetRunId: string, widgetId: string, recordId: string): void;
}>();

/**
 * 内部聊天列表（用于本地状态管理）
 */
const internalChatList = ref<Record[]>([]);

/**
 * mention 列表：由 Sender 在拉取 Skills/Tools 后 emit，
 * 透传给 ChatItem → MdContent，用于把消息文本中的 @skill:/@tool: 还原为蓝色 chip
 */
const mentionSkills = ref<NormalizedSkill[]>([]);
const mentionTools = ref<NormalizedSkill[]>([]);
const mentionConnectors = ref<NormalizedSkill[]>([]);

/** Sender mention 列表更新事件处理 */
function onMentionListUpdate(payload: { skills: NormalizedSkill[]; tools: NormalizedSkill[]; connectors: NormalizedSkill[] }) {
    // eslint-disable-next-line no-console
    console.log('[Chat/Index] onMentionListUpdate received',
        'skills:', (payload.skills || []).length,
        'tools:', (payload.tools || []).length,
        'connectors:', (payload.connectors || []).length);
    mentionSkills.value = payload.skills || [];
    mentionTools.value = payload.tools || [];
    mentionConnectors.value = payload.connectors || [];
}

/**
 * 独立拉取 mention 数据（标准/claw 両モード共通）
 * Sender の Skills ボタン表示に関わらず、ロードすれば使えるように
 */
async function refreshMentionLists() {
    const appId = skillsAppId.value;
    if (!appId) return;
    try {
        const result = await getAgentDetailByAppId(appId);
        // 请求返回后，如果应用 ID 已经变化，丢弃过期结果
        if (skillsAppId.value !== appId) return;
        if (!result) {
            agentDetailAvailable.value = false;
            return;
        }
        agentDetailAvailable.value = true;
        // skills
        mentionSkills.value = ((result.skills || []) as AgentSkillInfo[])
            .filter((s) => !!s.DisplayName)
            .map(normalizeSkill);
        // tools / connectors（Sender.vue と同様の解析ロジック）
        const plugins = result.plugins || [];
        const pluginClassMap = new Map<string, number>();
        for (const p of plugins) {
            const pid = (p.PluginId || p.plugin_id || '') as string;
            if (pid) pluginClassMap.set(pid, (p.PluginClass ?? p.plugin_class ?? 0) as number);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const allTools = (result.tools || []) as any[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parseRaw = (t: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cfg = (t.Config || t.config || {}) as any;
            const raw = String(t.tool_name || t.ToolName || t.name || t.Name || cfg.description || cfg.Description || '');
            const idx = raw.lastIndexOf('/');
            return idx > -1 ? { displayName: raw.slice(0, idx), name: raw.slice(idx + 1) } : { displayName: raw, name: raw };
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const getPluginId = (t: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cfg = (t.Config || t.config || {}) as any;
            return (cfg.plugin_id || cfg.pluginid || cfg.PluginId || '') as string;
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const toolPluginName = (t: any) =>
            String(t.plugin_name || t.PluginName || t.PluginDisplayName || t.plugin_display_name || '');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const buildItem = (t: any) => {
            const { displayName, name } = parseRaw(t);
            const pluginName = toolPluginName(t);
            let finalDisplayName = displayName;
            if (!displayName || displayName === name) {
                finalDisplayName = (pluginName && pluginName !== name) ? `${pluginName}/${name}` : (displayName || name);
            }
            return {
                id: (t.tool_id || t.ToolId || '') as string,
                name: name || ((t.tool_id || t.ToolId || '') as string),
                displayName: finalDisplayName || displayName || name || '',
                iconUrl: (t.IconUrl || t.icon_url || '') as string,
            } as NormalizedSkill;
        };
        mentionConnectors.value = allTools
            .filter((t) => pluginClassMap.get(getPluginId(t)) === 1)
            .map(buildItem);
        mentionTools.value = allTools
            .filter((t) => pluginClassMap.get(getPluginId(t)) === 0)
            .map(buildItem);
    } catch (e) {
        agentDetailAvailable.value = false;
        // eslint-disable-next-line no-console
        console.warn('[Chat/Index] refreshMentionLists failed:', e);
    }
    // eslint-disable-next-line no-console
    console.log('[Chat/Index] refreshMentionLists done',
        'skills:', mentionSkills.value.length,
        'tools:', mentionTools.value.length,
        'connectors:', mentionConnectors.value.length);
}

/** skillsAppId 変化時に mention データを独立取得 */
watch(skillsAppId, (val) => {
    if (val) refreshMentionLists();
}, { immediate: true });

/**
 * 计算属性：实际使用的聊天列表
 */
const chatList = computed(() => props.chatList.length > 0 ? props.chatList : internalChatList.value);

/**
 * 是否处于选择分享状态
 */
const isSelecting = ref(false)

/**
 * 选中的消息ID列表
 */
const selectedIds = ref<string[]>([])

/**
 * 是否全选（根据 selectedIds 与 chatList 对比计算）
 */
const checkall = computed(() => selectedIds.value.length > 0 && selectedIds.value.length === chatList.value.length);

const handleCheckAll = (checked: boolean) => {
    if (checked) {
        selectedIds.value = chatList.value.map(i => i.RecordId)
    } else {
        selectedIds.value = [];
    }
}

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
 * 聊天组件引用
 */
const chatRef = ref<{ scrollToBottom?: (options?: { behavior?: string }) => void } | null>(null)

/**
 * 是否显示回到底部按钮
 */
const isShowToBottom = ref(false)

/**
 * 上次滚动位置
 */
const lastScrollTop = ref(0)

/**
 * 用户是否手动滚动
 */
const hasUserScrolled = ref(false)

/**
 * 滚动到底部
 */
const backToBottom = () => {
    if (!(chatRef.value && chatRef.value.scrollToBottom)) return;
    if (hasUserScrolled.value) return;
    chatRef.value.scrollToBottom({
        behavior: 'smooth',
    });
}

/**
 * 点击回到底部按钮
 */
const handleClickBackToBottom = () => {
    hasUserScrolled.value = false;
    backToBottom()
}

/**
 * 聊天滚动事件
 */
const handleChatScroll = function ({ e }: { e: Event }) {
    if (messageLoading.value) return;
    const scrollTop = (e.target as HTMLElement).scrollTop
    const clientHeight = (e.target as HTMLElement).clientHeight
    const scrollHeight = (e.target as HTMLElement).scrollHeight
    const isToBottom = clientHeight + scrollTop < scrollHeight - 2
    isShowToBottom.value = isToBottom

    if (lastScrollTop.value - scrollTop > 4 && props.isChatting) {
        hasUserScrolled.value = true
    }
    if (!isToBottom) {
        hasUserScrolled.value = false
    }
    lastScrollTop.value = scrollTop
}

/**
 * footer高度观察器
 */
let footerResizeObserver: ResizeObserver | null = null

/**
 * 更新footer高度CSS变量
 */
const updateFooterHeight = () => {
    const footer = document.querySelector('.t-chat__footer') as HTMLElement
    if (footer) {
        const height = footer.offsetHeight
        document.documentElement.style.setProperty('--chat-footer-height', `${height + 60}px`)
    }
}

onMounted(() => {
    nextTick(() => {
        const footer = document.querySelector('.t-chat__footer') as HTMLElement
        if (footer) {
            updateFooterHeight()
            footerResizeObserver = new ResizeObserver(() => {
                updateFooterHeight()
            })
            footerResizeObserver.observe(footer)
        }
    })
})

onUnmounted(() => {
    if (footerResizeObserver) {
        footerResizeObserver.disconnect()
        footerResizeObserver = null
    }
})

/**
 * 设置默认问题
 */
const getDefaultQuestion = (value: string) => {
    inputEnter(value)
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
 * 是否正在加载更多
 */
const isLoadingMore = ref(false);

/**
 * 无限加载状态引用
 */
const infiniteLoadingState = ref<{ loaded: () => void; complete: () => void } | null>(null)

/**
 * 无限加载处理函数
 */
const infiniteHandler = function ($state: { loaded: () => void; complete: () => void }) {
    // 如果没有 chatId，直接返回
    if (!props.chatId) {
        return
    }
    
    // 如果正在聊天中，直接完成加载
    if (props.isChatting) {
        $state.complete()
        return
    }
    
    // 如果正在加载更多，忽略此次调用（不保存状态，让之前的加载继续）
    if (isLoadingMore.value) {
        return
    }
    
    isLoadingMore.value = true
    messageLoading.value = true
    
    // 保存状态引用，供外部调用
    infiniteLoadingState.value = $state
    
    // 获取最早的记录ID
    const firstRecord = chatList.value[0]
    const lastRecordId = chatList.value.length > 0 && firstRecord ? (firstRecord.RecordId ?? '') : ''
    
    // 触发 loadMore 事件，由父组件处理数据加载
    emit('loadMore', props.chatId, lastRecordId)
}

/**
 * 通知无限加载已加载更多数据
 */
const notifyLoaded = () => {
    isLoadingMore.value = false
    messageLoading.value = false
    infiniteLoadingState.value?.loaded()
    infiniteLoadingState.value = null
}

/**
 * 通知无限加载已完成（没有更多数据）
 */
const notifyComplete = () => {
    isLoadingMore.value = false
    messageLoading.value = false
    infiniteLoadingState.value?.complete()
    infiniteLoadingState.value = null
}

/**
 * 发送消息
 */
const inputEnter = function (queryVal: string | undefined, fileList?: FileProps[]) {
    if (props.isChatting) {
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

const extractRecordText = (record: Record): string => {
    const messages = record.Messages ?? [];
    if (messages.length === 0) return '';
    const target = record.Role === 'user'
        ? (messages.find(msg => msg.Type === 'question') ?? messages[0])
        : (messages.find(msg => msg.Type === 'reply') ?? messages[0]);
    if (!target) return '';
    return (target.Contents ?? []).map(content => content.Text ?? '').filter(text => text.length > 0).join('\n');
};

/**
 * 重新发送消息
 */
const onResend = (RelatedRecordId: string | undefined, recordId?: string) => {
    let related: Record | undefined;

    if (RelatedRecordId) {
        related = chatList.value.find((record: Record) => record.RecordId === RelatedRecordId);
    }

    // 当 RelatedRecordId 为空或找不到对应记录时，通过 assistant 自身的 recordId 定位后向前查找 user 消息
    if (!related) {
        let searchStart = chatList.value.length - 1;
        if (recordId) {
            const idx = chatList.value.findIndex((record: Record) => record.RecordId === recordId);
            if (idx >= 0) searchStart = idx;
        }
        for (let i = searchStart; i >= 0; i--) {
            if (chatList.value[i]?.Role === 'user') {
                related = chatList.value[i];
                break;
            }
        }
    }

    if (!related) return;
    inputEnter(extractRecordText(related));
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
const onCopy = (rowtext: string | undefined, content: string | undefined, type: string) => {
    emit('copy', rowtext, content, type);
}

/**
 * 处理 widget 事件
 * @param event - widget 事件
 * @param widgetRunId - widget run id
 * @param widgetId - widget id
 * @param recordId - 消息 record id
 */
const onWidgetEvent = (event: CustomEvent, widgetRunId: string, widgetId: string, recordId: string) => {
    emit('widgetEvent', event, widgetRunId, widgetId, recordId);
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
const handleMessage = (code: MessageCode, message: string) => {
    emit('message', code, message);
}

// 监听chatId变化
watch(
    () => props.chatId,
    (newId) => {
        isSelecting.value = false;
        selectedIds.value = [];
        isLoadingMore.value = false;
        infiniteLoadingState.value = null;
        emit('conversationChange', newId);
    },
    { immediate: true },
)

/**
 * 暴露给父组件的方法
 */
defineExpose({
    clearConfirm,
    getSenderRef: () => senderRef.value,
    notifyLoaded,
    notifyComplete,
    backToBottom,
    setHasUserScrolled: (value: boolean) => { hasUserScrolled.value = value },
})
</script>

<style scoped>
/* ── 主容器 ── */
.upload-loading {
    position: absolute;
    bottom: 12px;
    z-index: 2;
}

.chat-box {
    height: 100%;
    position: relative;
    display: flex;
}

.chat-item__content {
    display: flex;
    align-items: self-start;
}

/* ── 分享设置浮层 ── */
.share-setting-container {
    z-index: 10;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -6px;
    translate: 0 -100%;
    width: max-content;
}

.share-setting-content {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    gap: 4px;
}

.icon__share-copy {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background: var(--td-bg-color-container-hover);
    border-radius: var(--td-radius-medium);
    padding: 5px 14px;
    margin-left: 10px;
    margin-right: 4px;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
}

.icon__share-copy:hover {
    background: var(--td-bg-color-container-active);
}

.icon__share-copy:active {
    background: var(--td-bg-color-container-active);
    opacity: 0.85;
}

.share-text {
    display: flex;
    align-items: center;
}

.icon__share-copy.disabled {
    cursor: not-allowed;
    opacity: 0.25;
    pointer-events: none;
}

.icon__share-copy span:nth-child(1) {
    margin-right: 4px;
}

.icon__share-close {
    cursor: pointer;
    margin-left: 10px;
    padding: 2px 4px;
    color: var(--td-text-color-secondary);
    border-radius: var(--td-radius-default);
    transition: color 0.15s ease, background 0.15s ease;
}

.icon__share-close:hover {
    color: var(--td-text-color-primary);
    background: var(--td-bg-color-container-hover);
}

/* ── 加载状态 ── */
.thinking-text {
    color: var(--td-text-color-secondary);
    font-size: 14px;
    margin-left: 4px;
}

.thinking-icon {
    animation: rotate 2s linear infinite;
    width: var(--td-comp-size-xs);
    height: var(--td-comp-size-xs);
    padding: 0;
}

/* ── 内容区 ── */
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

/* ── Footer 区域 ── */
:deep(.t-chat__footer) {
    display: flex;
    justify-content: center;
    padding: 0 16px;
}

/* ── 消息列表间距 ── */
:deep(.content .chat-item__content) {
    padding-bottom: 16px;
    margin-left: var(--td-size-4);
}

:deep(.content .chat-item__content:last-child) {
    padding-bottom: 24px;
}

/* ── 聊天列表容器 ── */
:deep(.t-chat__list) {
    padding: 0 20px;
    overflow-y: scroll;
    scrollbar-width: thin;
    scrollbar-color: var(--td-scrollbar-color, rgba(0,0,0,.12)) transparent;
}

:deep(.t-chat__list::-webkit-scrollbar) {
    width: 5px;
}

:deep(.t-chat__list::-webkit-scrollbar-thumb) {
    background: var(--td-scrollbar-color, rgba(0,0,0,.12));
    border-radius: 4px;
}

:deep(.t-chat__list::-webkit-scrollbar-track) {
    background: transparent;
}

/* 确保 AppType 组件容器有足够高度实现垂直居中 */
:deep(.t-chat__list > div) {
    height: 100%;
}

:deep(.t-chat__list .content) {
    width: 100%;
    max-width: 820px;
    margin: 0 auto;
}

/* ── 分享卡片覆盖 ── */
:deep(.share-setting-content .t-card__body) {
    padding: 10px 20px 10px 16px;
}

:deep(.share-setting-card) {
    box-sizing: border-box;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08), 0 8px 32px rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    border: 1px solid var(--td-component-stroke);
    padding: 8px 20px 8px 16px !important;
}

:deep(.share-setting-container) {
    border: none;
    box-sizing: border-box;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08), 0 8px 32px rgba(0, 0, 0, 0.06);
    border-radius: 12px;
}

/* ── 移动端分享面板 ── */
.share-setting-content.isMobile {
    font-size: 12px;
}

.share-setting-content.isMobile .icon__share-copy {
    padding: 3px 10px;
    margin-left: 8px;
    margin-right: 3px;
}

.share-setting-content.isMobile .icon__share-copy :deep(svg) {
    width: 14px;
    height: 14px;
}

.share-setting-content.isMobile .icon__share-close {
    margin-left: 8px;
    padding-left: 0;
}

:deep(.share-setting-container.isMobile .share-setting-card) {
    padding: 6px 10px;
}

:deep(.share-setting-container.isMobile) {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 4px 24px rgba(0, 0, 0, 0.08);
}

@media (prefers-reduced-motion: reduce) {
    .thinking-icon {
        animation: none;
    }
}
</style>
