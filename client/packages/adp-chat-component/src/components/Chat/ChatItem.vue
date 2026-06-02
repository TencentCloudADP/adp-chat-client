<!-- 聊天消息项组件，支持 Markdown、深度思考、操作按钮等 -->
<script setup lang="tsx">
import { ref, computed, watch } from 'vue';
import type { Content, Message, QuoteInfo, Record as RecordV2, Reference as ReferenceV2, FileInfo } from '../../model/chat-v2';
import { ScoreValue } from '../../model/chat-v2';
import type { CommonLayoutProps, ChatItemI18n, ChatMode } from '../../model/type';
import { commonLayoutPropsDefaults, defaultChatItemI18n } from '../../model/type';
import {  ChatItem as TChatItem } from '@tdesign-vue-next/chat';
import { Tooltip, Loading as TLoading, Link as TLink, Dialog as TDialog } from 'tdesign-vue-next';
import OptionCard from '../Common/OptionCard.vue';
import MdContent from '../Common/MdContent.vue';
import MessageFileCard from '../Common/MessageFileCard.vue';
import AssistantFileCard from '../Common/AssistantFileCard.vue';
import WidgetActionTag from '../Common/WidgetActionTag.vue';
import CustomizedIcon from '../CustomizedIcon.vue';
import CollapsibleMessageGroup from './CollapsibleMessageGroup.vue';
import type { CollapseKind } from './CollapsibleMessageGroup.vue';
import { widgetContentToMarkdown } from '../../utils/mergeRecord-v2';

interface Props extends CommonLayoutProps {
    /** 当前聊天记录项 */
    item: RecordV2;
    /** 当前项的索引 */
    index: number;
    /** 是否为最后一条消息 */
    isLastMsg?: boolean;
    /** 是否正在加载 */
    loading: boolean;
    /** 是否为流式加载 */
    isStreamLoad: boolean;
    /** 是否显示操作按钮 */
    showActions?: boolean;
    /** 国际化文本 */
    i18n?: ChatItemI18n;
    /** 当前语言标识（如 'zh-CN'、'en-US'），用于 widget 国际化 */
    language?: string;
    /** 聊天模式：claw-简化模式, standard-标准模式 */
    mode?: ChatMode;
}

const props = withDefaults(defineProps<Props>(), {
    isLastMsg: false,
    showActions: true,
    language: 'zh-CN',
    mode: 'standard',
    ...commonLayoutPropsDefaults,
    i18n: () => ({}),
});

// 合并默认值和传入值
const i18n = computed(() => ({
    ...defaultChatItemI18n,
    ...props.i18n
}));

const emit = defineEmits<{
    (e: 'resend', relatedRecordId: string | undefined): void;
    (e: 'share', recordIds: string[]): void;
    (e: 'rate', record: RecordV2, score: typeof ScoreValue[keyof typeof ScoreValue]): void;
    (e: 'copy', rowtext: string | undefined, content: string | undefined, type: string): void;
    (e: 'sendMessage', message: string): void;
    /** widget 事件（用于与 SSE/对话流交互） */
    (e: 'widgetEvent', event: CustomEvent, widgetRunId: string, widgetId: string, recordId: string): void;
}>();

// 响应式变量
type ChatRecord = RecordV2 & { Score?: typeof ScoreValue[keyof typeof ScoreValue] };
type QuoteInfoLike = QuoteInfo;
type ReferenceLike = ReferenceV2;

const record = ref(props.item as ChatRecord);
const expandStatus = ref(false);
const referenceDialogVisible = ref(false);
const activeReference = ref<ReferenceLike | null>(null);

// 监听 props.item 变化，同步到 record
// 这是必要的，因为 placeholder 消息的 RecordId 会在 SSE 返回后被更新
watch(
    () => props.item,
    (newItem) => {
        record.value = newItem as ChatRecord;
    },
    { deep: true }
);

const isFromSelf = computed(() => {
    return record.value.Role === 'user';
});

const messages = computed(() => record.value.Messages ?? []);

const primaryMessage = computed(() => {
    const list = messages.value;
    if (list.length === 0) return undefined;
    if (isFromSelf.value) {
        return list.find((msg) => msg.Type === 'question') ?? list[0];
    }
    return list.find((msg) => msg.Type === 'reply');
});

const extractMessageText = (message?: Message) => {
    if (!message?.Contents?.length) return '';
    return message.Contents
        .map((content) => {
            const parts: string[] = [];
            
            // 先处理文本内容（如果有）
            if (content.Text) {
                parts.push(content.Text);
            }
            
            // 处理 widget 类型内容，转换为 Markdown 代码块
            if (content.Type === 'widget' && content.Widget) {
                const widgetMarkdown = widgetContentToMarkdown(content);
                if (widgetMarkdown) {
                    parts.push(widgetMarkdown);
                }
            }
            
            return parts.join('');
        })
        .filter((text) => text.length > 0)
        .join('\n');
};

const displayText = computed(() => {
    return extractMessageText(primaryMessage.value);
});

const reasoningMessages = computed(() => {
    return messages.value.filter((msg) => msg.Type === 'thought');
});

/**
 * 根据消息类型和工具名称返回折叠分类
 * 支持 tool_call、task_execution、thought 类型
 */
function getCollapseKindForMsg(msg: Message): CollapseKind | '' {
    if (msg.Type === 'thought') return 'thought';
    if (msg.Type !== 'tool_call' && msg.Type !== 'task_execution') return '';
    const toolName = msg.ExtraInfo?.ToolName || '';
    if (['websearch', 'web_search'].includes(toolName)) return 'search';
    if (['read', 'grep', 'glob'].includes(toolName)) return 'read';
    if (['write', 'edit'].includes(toolName)) return 'write';
    return 'tools';
}

/**
 * 渲染项类型
 */
interface RenderItem {
    kind: 'collapse' | 'reply';
    collapseKind?: CollapseKind;
    messages?: Message[];
    message?: Message;
}

/**
 * 将 Record.Messages 拆分为渲染项列表：
 * - 连续的 tool_call/thought 归入同一个折叠组
 * - reply 独立渲染
 * 无论 mode 是 claw 还是 standard，只要有 tool_call 就启用分组渲染
 */
const renderItems = computed<RenderItem[]>(() => {
    if (isFromSelf.value) return [];

    const list = messages.value;
    if (list.length === 0) return [];

    const hasToolCall = list.some(m => m.Type === 'tool_call' || m.Type === 'task_execution');
    if (!hasToolCall) return [];

    const items: RenderItem[] = [];
    let collapseBuffer: Message[] = [];

    const flushCollapse = () => {
        if (collapseBuffer.length > 0) {
            items.push({
                kind: 'collapse',
                collapseKind: 'mixed',
                messages: [...collapseBuffer],
            });
            collapseBuffer = [];
        }
    };

    for (const msg of list) {
        const collapseKind = getCollapseKindForMsg(msg);

        if (collapseKind === '') {
            // reply / question / recommendation / notice — 不可折叠
            if (msg.Type === 'reply') {
                flushCollapse();
                items.push({ kind: 'reply', message: msg });
            }
            // 其他类型暂不处理
        } else if (collapseKind === 'thought' && !hasToolCall) {
            // 没有 tool_call 时，thought 不进入折叠组（由原有 reasoning 逻辑处理）
            continue;
        } else {
            // 可折叠消息：tool_call 或 thought（有 tool_call 时）
            collapseBuffer.push(msg);
        }
    }

    // 最后一组折叠消息
    flushCollapse();

    return items;
});

/**
 * 是否使用分组渲染模式（有 tool_call/task_execution 消息时启用，不限制 mode）
 * 确保历史对话和 SSE 对话保持一致的渲染规则
 */
const useClawRender = computed(() => {
    if (isFromSelf.value) return false;
    return messages.value.some(m => m.Type === 'tool_call' || m.Type === 'task_execution');
});

/**
 * 判断最后一个折叠组是否处于流式状态
 */
const isLastCollapseStreaming = computed(() => {
    if (!useClawRender.value) return false;
    if (!props.isLastMsg || !props.isStreamLoad) return false;
    const items = renderItems.value;
    if (items.length === 0) return false;
    return items[items.length - 1]!.kind === 'collapse';
});

/**
 * 判断是否任务终止（最后是折叠组，无后续 reply，且 Record 已完成）
 */
const isTerminated = computed(() => {
    if (!useClawRender.value) return false;
    if (record.value.Status === 'processing') return false;
    const items = renderItems.value;
    if (items.length === 0) return false;
    const lastItem = items[items.length - 1]!;
    if (lastItem.kind !== 'collapse') return false;
    // 有错误状态时视为终止
    return record.value.Status === 'error' || record.value.Status === 'failed';
});

const reasoningContents = computed(() => {
    // claw 模式下，thought 已在折叠组中渲染，不再显示独立的 reasoning 面板
    if (useClawRender.value) return [];
    return reasoningMessages.value
        .map((msg) => extractMessageText(msg))
        .filter((text) => text.length > 0);
});

const collectFromMessageContents = <T,>(message: Message | undefined, picker: (content: Content) => T[] | undefined): T[] => {
    const values: T[] = [];
    for (const content of message?.Contents ?? []) {
        const picked = picker(content);
        if (picked?.length) {
            values.push(...picked);
        }
    }
    return values;
};

const optionCards = computed(() => {
    return collectFromMessageContents(primaryMessage.value, (content) => content.OptionCards ?? []);
});

const fileAttachments = computed<FileInfo[]>(() => {
    const files: FileInfo[] = [];
    const seen = new Set<string>();
    const msgs = isFromSelf.value ? [primaryMessage.value] : [primaryMessage.value];
    for (const msg of msgs) {
        if (!msg?.Contents?.length) continue;
        for (const content of msg.Contents) {
            if (content.Type === 'file' && content.File) {
                const key = content.File.FileUrl || content.File.FileName || '';
                if (key && seen.has(key)) continue;
                if (key) seen.add(key);
                files.push(content.File);
            }
        }
    }
    return files;
});

/** 图片 MIME 类型前缀 */
const IMAGE_TYPE_RE = /^image\//i
/** 通过文件名判断图片 */
const IMAGE_EXT_RE = /\.(jpg|jpeg|png|bmp|webp|gif)$/i

const imageAttachments = computed<FileInfo[]>(() => {
    return fileAttachments.value.filter(f =>
        IMAGE_TYPE_RE.test(f.FileType || '') || IMAGE_EXT_RE.test(f.FileName || '')
    );
});

const docAttachments = computed<FileInfo[]>(() => {
    return fileAttachments.value.filter(f =>
        !IMAGE_TYPE_RE.test(f.FileType || '') && !IMAGE_EXT_RE.test(f.FileName || '')
    );
});

/** 点击图片附件，新窗口打开预览 */
const openImagePreview = (file: FileInfo) => {
    const url = file.FileUrl || file.Url;
    if (url) window.open(url, '_blank');
};

const quoteInfos = computed<QuoteInfoLike[]>(() => {
    const source = useClawRender.value ? lastReplyMessage.value : primaryMessage.value;
    return collectFromMessageContents(source, (content) => content.QuoteInfos ?? []);
});

const references = computed<ReferenceLike[]>(() => {
    const source = useClawRender.value ? lastReplyMessage.value : primaryMessage.value;
    return collectFromMessageContents(source, (content) => content.References ?? []);
});

/**
 * claw 模式下的最后一条 reply 消息（用于提取 references 等）
 */
const lastReplyMessage = computed(() => {
    if (!useClawRender.value) return primaryMessage.value;
    const replies = messages.value.filter(m => m.Type === 'reply');
    return replies.length > 0 ? replies[replies.length - 1] : undefined;
});

const isFinal = computed(() => {
    return record.value.Status !== 'processing';
});

/**
 * 回复时间（从 ExtraInfo.StartTime 提取）
 * - 今天：显示 hh:mm:ss
 * - 今年过去日期：显示 M月D日
 * - 过去年份：显示 YYYY年M月D日
 */
const replyTime = computed(() => {
    const startTime = record.value.ExtraInfo?.StartTime;
    if (!startTime) return '';
    const ts = Number(startTime);
    if (!ts) return '';
    const date = new Date(ts);
    const now = new Date();
    const isToday = date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();
    const isThisYear = date.getFullYear() === now.getFullYear();

    if (isToday) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    } else if (isThisYear) {
        return `${date.getMonth() + 1}月${date.getDate()}日`;
    } else {
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }
});

/**
 * 判断用户消息是否是 widget action 类型
 * widget action 类型的消息应该显示为 "已进行操作" 样式，而不是原始 JSON 内容
 */
const isWidgetAction = computed(() => {
    if (!isFromSelf.value) return false;
    const message = primaryMessage.value;
    if (!message?.Contents?.length) return false;
    // 检查是否有 widget_action 类型的 content
    return message.Contents.some(content => content.Type === 'widget_action');
});

const recordScore = computed(() => record.value.Score);

const canRate = computed(() => {
    return record.value.ExtraInfo?.CanRating !== false;
});

/**
 * 复制内容到剪贴板
 */
async function copyContent(event: any, content: string | undefined, type: string): Promise<void> {
    let rowtext: string | undefined;
    const container = event?.target as HTMLElement;
    const markdownElements = container?.closest('.t-chat__content')?.querySelectorAll('.markdown-body');
    rowtext = markdownElements && markdownElements.length > 0 
        ? markdownElements[markdownElements.length - 1]?.textContent || undefined 
        : undefined;
    emit('copy', rowtext, content, type);
}

/**
 * 判断是否已评分
 * 注意：服务端可能返回 null/undefined/0，这些都视为"未评分"
 */
const isRated = () => {
    const score = recordScore.value;
    return score !== undefined && score !== null && score !== ScoreValue.Unknown;
};

/**
 * 对消息进行评分（点赞/踩）
 */
const rate = async (target: RecordV2, score: typeof ScoreValue[keyof typeof ScoreValue]) => {
    if (!canRate.value || isRated()) return;
    emit('rate', target, score);
};

/**
 * 分享消息
 */
const share = async (target: RecordV2) => {
    let shareList = [target.RecordId]
    if (target.RelatedRecordId) {
        shareList.push(target.RelatedRecordId)
    }
    emit('share', shareList);
};

/**
 * 渲染推理模块的头部自定义内容
 */
const renderHeader = () => {
    const endText = expandStatus.value ? i18n.value.deepThinkingFinished : i18n.value.deepThinkingExpand;
    return (
        <div class="flex collapsed-thinking-text">
            <span>{endText}</span>
        </div>
    );
};

/**
 * 渲染推理内容
 */
const renderReasoningContent = (contents: string[]) => {
    if (contents.length === 0) return <div></div>;
    return (
        <div>
            {contents.map((content, index) => (
            <MdContent 
                content={content} 
                role="system" 
                theme={props.theme} 
                mode={props.mode}
                language={props.language}
                key={index} 
            />
            ))}
        </div>
    );
};

const renderReasoning = () => {
    if (reasoningContents.value.length === 0) {
        return false;
    }
    return {
        collapsed: props.isLastMsg && !props.isStreamLoad,
        expandIcon: false,
        expandIconPlacement: 'right' as const,
        onExpandChange: (e: boolean) => {
            expandStatus.value = e;
        },
        collapsePanelProps: {
            expandIcon: false,
            header: renderHeader(),
            content: renderReasoningContent(reasoningContents.value),
        },
    };
};

const getReferenceUrl = (reference: ReferenceLike) => {
    return reference.Url || reference.DocRefer?.Url || reference.WebSearchRefer?.Url;
};

const handleSendMessage = (message: string) => {
    emit('sendMessage', message);
};

/**
 * 处理 widget 事件
 * @param event - widget 事件
 * @param widgetRunId - widget run id
 * @param widgetId - widget id
 */
const handleWidgetEvent = (event: CustomEvent, widgetRunId: string, widgetId: string) => {
    // 向上传递事件，附带当前消息的 recordId
    emit('widgetEvent', event, widgetRunId, widgetId, record.value.RecordId || '');
};

const openReferenceDialog = (reference: ReferenceLike) => {
    activeReference.value = reference;
    referenceDialogVisible.value = true;
};

const isSliceReference = (reference: ReferenceLike) => {
    return reference.Type === 2 && Boolean(reference.PageContent || reference.OrgData);
};

const getReferenceId = (reference: ReferenceLike) => {
    return reference.Id || reference.DocRefer?.ReferenceId || reference.ReferBizId || reference.DocRefer?.ReferBizId;
};

const getReferenceTitle = (reference: ReferenceLike) => {
    return reference.DocRefer?.DocName || reference.DocName || reference.Name || '未命名来源';
};

const getReferenceContent = (reference: ReferenceLike) => {
    return reference.PageContent || reference.OrgData || '';
};

const getReferenceMeta = (reference: ReferenceLike) => {
    const meta: string[] = [];
    if (reference.PageInfos && reference.PageInfos.length > 0) {
        meta.push(`P${reference.PageInfos.join(', ')}`);
    }
    if (reference.SheetInfos && reference.SheetInfos.length > 0) {
        meta.push(reference.SheetInfos.join(', '));
    }
    return meta.join(' · ');
};

const getReferencePreview = (reference: ReferenceLike) => {
    return getReferenceContent(reference).replace(/\s+/g, ' ').trim();
};

const referenceDialogTitle = computed(() => {
    if (!activeReference.value) {
        return i18n.value.referenceSlice;
    }
    return getReferenceTitle(activeReference.value);
});
</script>

<template>
    <!-- Widget action 类型的用户消息：独立于 TChatItem 居中显示 -->
    <div v-if="isFromSelf && isWidgetAction" class="widget-action-row">
        <WidgetActionTag :text="i18n.actionPerformed" />
    </div>
    <!-- 聊天项组件 -->
    <TChatItem v-else animation="skeleton" :role="isFromSelf ? 'user' : 'assistant'" :text-loading="false"
        :reasoning="renderReasoning()" >
        <!-- 内容插槽 -->
        <template #content>
            <div v-if="isLastMsg && isStreamLoad && !displayText && reasoningContents.length === 0 && !useClawRender" class="loading-container">
                <TLoading  size="small">
                    <template #text>
                        <span class="thinking-text">
                            {{ `${i18n.thinking}...` }}
                        </span>
                    </template>
                    <template #indicator>
                        <CustomizedIcon class="thinking-icon" name="thinking" :theme="theme" nativeIcon :showHoverBg="false"/>
                    </template>
                </TLoading>
            </div>
            <div v-else>
                <!-- 普通用户消息 -->
                <div v-if="isFromSelf" class="user-message">
                    <!-- 图片附件：独立于文字气泡展示（claw 模式下已在文本中渲染） -->
                    <div v-if="imageAttachments.length > 0 && mode !== 'claw'" class="image-attachments">
                        <img
                            v-for="(file, idx) in imageAttachments"
                            :key="'img-' + idx"
                            :src="file.FileUrl || file.Url"
                            :alt="file.FileName"
                            class="msg-inline-image"
                            @click="openImagePreview(file)"
                        />
                    </div>
                    <!-- 文件附件：card 形式展示（claw 模式下已在文本中渲染） -->
                    <div v-if="docAttachments.length > 0 && mode !== 'claw'" class="file-attachments">
                        <MessageFileCard
                            v-for="(file, idx) in docAttachments"
                            :key="'doc-' + idx"
                            :file="file"
                            :theme="theme"
                        />
                    </div>
                    <MdContent 
                        :content="displayText" 
                        role="user" 
                        :theme="theme" 
                        :mode="mode"
                        :quoteInfos="quoteInfos"
                        :language="language"
                        :recordId="item.RecordId"
                        :enableScale="isMobile"
                        @widgetEvent="handleWidgetEvent"
                    />
                    <span>
                    <CustomizedIcon :size="isMobile ? 'm' : 's'" v-if="showActions && !isMobile" class="control-icon copy-icon" name="copy" :theme="theme"
                        @click="(e: any) => copyContent(e, displayText, 'user')" />
                    <CustomizedIcon :size="isMobile ? 'm' : 's'" v-if="showActions && !isMobile" class="control-icon share-icon" name="share" :theme="theme"
                        @click="share(item)" />
                    </span>
                </div>
                <!-- claw 模式分组渲染：tool_call 折叠 + reply 独立展示 -->
                <div v-else-if="useClawRender" class="claw-render">
                    <template v-for="(renderItem, rIdx) in renderItems" :key="'ri-' + rIdx">
                        <CollapsibleMessageGroup
                            v-if="renderItem.kind === 'collapse'"
                            :kind="renderItem.collapseKind || 'mixed'"
                            :messages="renderItem.messages || []"
                            :isStreaming="isLastCollapseStreaming && rIdx === renderItems.length - 1"
                            :isTerminated="isTerminated && rIdx === renderItems.length - 1"
                            :theme="theme"
                            :language="language"
                        />
                        <MdContent
                            v-else-if="renderItem.kind === 'reply'"
                            :content="extractMessageText(renderItem.message)"
                            role="assistant"
                            :theme="theme"
                            :mode="mode"
                            :language="language"
                            :recordId="item.RecordId"
                            :disable="!isLastMsg"
                            :enableScale="isMobile"
                            @widgetEvent="handleWidgetEvent"
                        />
                    </template>
                </div>
                <MdContent 
                    v-else 
                    :content="displayText" 
                    role="assistant" 
                    :theme="theme" 
                    :mode="mode"
                    :quoteInfos="quoteInfos"
                    :language="language"
                    :recordId="item.RecordId"
                    :disable="!isLastMsg"
                    :enableScale="isMobile"
                    @widgetEvent="handleWidgetEvent"
                />
                <!-- assistant 图片附件 -->
                <div v-if="!isFromSelf && imageAttachments.length > 0 && mode === 'claw'" class="image-attachments">
                    <img
                        v-for="(file, idx) in imageAttachments"
                        :key="'assistant-img-' + idx"
                        :src="file.FileUrl || file.Url"
                        :alt="file.FileName"
                        class="msg-inline-image"
                        @click="openImagePreview(file)"
                    />
                </div>
                <!-- assistant 文件附件卡片：仅 claw 模式展示，standard 模式下文件链接已在 markdown 中渲染 -->
                <AssistantFileCard
                    v-if="!isFromSelf && docAttachments.length > 0 && mode === 'claw'"
                    :files="docAttachments"
                    :theme="theme"
                />
                <OptionCard v-if="optionCards && optionCards.length" :cards="optionCards" :sendMessage="handleSendMessage" />
                <div class="references-container"
                    v-if="references && references.length > 0 && isFinal">
                    <span class="title">{{ i18n.references }}: </span>
                    <ol class="reference-list">
                        <li
                            v-for="(reference, idx) in references"
                            :key="`${getReferenceId(reference) || getReferenceUrl(reference) || getReferenceTitle(reference) || idx}-${idx}`"
                            class="reference-list__item"
                        >
                            <button
                                v-if="isSliceReference(reference)"
                                type="button"
                                class="reference-slice__trigger"
                                @click="openReferenceDialog(reference)"
                            >
                                <div class="reference-slice__header">
                                    <span class="reference-slice__name">{{ getReferenceTitle(reference) }}</span>
                                </div>
                                <div v-if="getReferenceMeta(reference)" class="reference-slice__meta">
                                    {{ getReferenceMeta(reference) }}
                                </div>
                                <div class="reference-slice__preview">
                                    {{ getReferencePreview(reference) }}
                                </div>
                            </button>
                            <TLink
                                v-else-if="getReferenceUrl(reference)"
                                class="reference-link"
                                theme="primary"
                                :href="getReferenceUrl(reference)"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {{ getReferenceTitle(reference) }}
                            </TLink>
                            <span v-else class="reference-link">
                                {{ getReferenceTitle(reference) }}
                            </span>
                            <div v-if="getReferenceMeta(reference)" class="reference-link__meta">
                                {{ getReferenceMeta(reference) }}
                            </div>
                        </li>
                    </ol>
                </div>
            </div>
        </template>
        <!-- 操作按钮插槽 -->
        <template #actions v-if="showActions" >
            <div v-show="!isStreamLoad || !isLastMsg" class="actions-container" :class="{ isMobile: isMobile }">
                <Tooltip :content="i18n.copy" destroyOnClose showArrow theme="default">
                    <CustomizedIcon :size="isMobile ? 'm' : 's'" class="control-icon copy-icon icon" name="copy" :theme="theme"
                        @click="(e: any) => copyContent(e, displayText, 'assistant')" />
                </Tooltip>
                <Tooltip :content="i18n.replay" destroyOnClose showArrow theme="default">
                    <CustomizedIcon :size="isMobile ? 'm' : 's'" class="control-icon icon" name="refresh" :theme="theme"
                        @click="emit('resend', item.RelatedRecordId)" />
                </Tooltip>
                <Tooltip :content="i18n.share" destroyOnClose showArrow theme="default">
                    <CustomizedIcon :size="isMobile ? 'm' : 's'" class="control-icon share-icon icon" name="share" :theme="theme" @click="share(item)" />
                </Tooltip>
                <Tooltip :content="i18n.good" destroyOnClose showArrow theme="default">
                    <CustomizedIcon
                        :size="isMobile ? 'm' : 's'"
                        :class="{ disabled: !canRate || (isRated() && recordScore !== ScoreValue.Like), 'not-allowed': isRated() || !canRate }"
                        class="control-icon icon"
                        :name="recordScore === ScoreValue.Like ? 'thumbs_up_active' : 'thumbs_up'"
                        :nativeIcon="record.Score === ScoreValue.Like"
                        :theme="theme" @click="rate(item, ScoreValue.Like)" />
                </Tooltip>
                <Tooltip :content="i18n.bad" destroyOnClose showArrow theme="default">
                    <CustomizedIcon
                        :size="isMobile ? 'm' : 's'"
                        :class="{ disabled: !canRate || (isRated() && recordScore !== ScoreValue.Dislike), 'not-allowed': isRated() || !canRate }"
                        class="control-icon icon"
                        :name="recordScore === ScoreValue.Dislike ? 'thumbs_down_active' : 'thumbs_down'"
                        :nativeIcon="record.Score === ScoreValue.Dislike"
                        :theme="theme" @click="rate(item, ScoreValue.Dislike)" />
                </Tooltip>
                <Tooltip :content="i18n.aiDisclaimer" destroyOnClose showArrow theme="default">
                    <CustomizedIcon :size="isMobile ? 'm' : 's'" class="control-icon icon" name="info" :theme="theme" />
                </Tooltip>
                <span v-if="replyTime" class="actions-divider"></span>
                <span v-if="replyTime" class="actions-time">{{ replyTime }}</span>
            </div>
        </template>
    </TChatItem>
    <TDialog
        v-model:visible="referenceDialogVisible"
        :header="referenceDialogTitle"
        :footer="false"
        :width="isMobile ? '92%' : '80%'"
        top="5vh"
        destroy-on-close
    >
        <div v-if="activeReference" class="reference-dialog">
            <div v-if="getReferenceMeta(activeReference)" class="reference-dialog__meta">
                {{ getReferenceMeta(activeReference) }}
            </div>
            <div v-if="getReferenceUrl(activeReference)" class="reference-dialog__link">
                <TLink theme="primary" :href="getReferenceUrl(activeReference)" target="_blank" rel="noopener noreferrer">
                    {{ i18n.openSource }}
                </TLink>
            </div>
            <div class="reference-dialog__content">
                <MdContent
                    :content="getReferenceContent(activeReference)"
                    role="assistant"
                    :theme="theme"
                    :mode="mode"
                    :language="language"
                />
            </div>
        </div>
    </TDialog>
</template>

<style scoped>
/* Widget action 独立行：在对话区域整行居中 */
.widget-action-row {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--td-comp-margin-l);
}

/* claw 模式分组渲染容器 */
.claw-render {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

.flex {
    display: flex;
    align-items: center;
}

/* 用户消息的复制和分享图标样式 */
.user-message {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.user-message .copy-icon,
.user-message .share-icon {
    opacity: 0;
    transition: opacity 0.2s ease;
    cursor: pointer;
}

.check-circle {
    color: var(--td-success-color-5);
    font-size: var(--td-font-size-title-large);
    margin-right: var(--td-comp-margin-s);
}
.control-icon{
    padding:var(--td-comp-paddingLR-xxs); 
    margin-right: var(--td-comp-margin-s); 
}
.copy-icon{
    padding-left: 0;
}
.icon.disabled {
    opacity: 0.25;
    cursor: not-allowed;
}
.icon.not-allowed {
    cursor: not-allowed;
}

/* 用户消息图标悬停效果 */
.user-message:hover .copy-icon,
.user-message:hover .share-icon {
    opacity: 1;
}

/* 操作按钮容器样式 */
.actions-container {
    display: flex;
    align-items: center;
    list-style: none;
    padding: var(--td-pop-padding-s);
    overflow: hidden;
    position: relative;
    padding-left: 0;
}
.actions-divider {
    width: 1px;
    height: 12px;
    background: var(--td-border-level-2-color, rgba(0, 0, 0, 0.1));
    margin-left: 4px;
}
.actions-time {
    font-size: 12px;
    color: var(--td-text-color-placeholder);
    line-height: 24px;
    margin-left: 12px;
    white-space: nowrap;
}
.collapsed-thinking-text{
    color: var(--td-text-color-placeholder);
}
.loading-container {
    padding: 0;
}

.thinking-text{
    color: var(--td-text-color-primary);
    font-size: var(--td-font-size-link-medium);
    margin-left: var(--td-comp-margin-xs)
}
.thinking-icon{
    animation: rotate 2s linear infinite;
    width: var(--td-comp-size-xs);
    height: var(--td-comp-size-xs);
    padding: 0;
}

.references-container {
    margin: 0px var(--td-comp-margin-l) var(--td-comp-margin-xl) var(--td-comp-margin-l);
}

.references-container .title {
    color: var(--td-text-color-secondary);
    display: inline-block;
    margin-bottom: var(--td-comp-margin-s);
}

.reference-list {
    margin: 0;
    padding-left: var(--td-comp-margin-l);
}

.reference-list__item + .reference-list__item {
    margin-top: var(--td-comp-margin-s);
}

.reference-slice__trigger {
    width: 100%;
    display: block;
    text-align: left;
    padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-m);
    border: 1px solid var(--td-component-border);
    border-radius: var(--td-radius-medium);
    background: var(--td-bg-color-container-hover);
    cursor: pointer;
}

.reference-slice__trigger:hover {
    background: var(--td-bg-color-container-select);
}

.reference-slice__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--td-comp-margin-s);
}

.reference-slice__name {
    color: var(--td-text-color-primary);
    font-weight: 600;
}

.reference-slice__meta,
.reference-link__meta {
    color: var(--td-text-color-placeholder);
    font-size: var(--td-font-size-body-small);
    margin-top: var(--td-comp-margin-xxs);
}

.reference-slice__preview {
    color: var(--td-text-color-secondary);
    margin-top: var(--td-comp-margin-xs);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-word;
}

.reference-link {
    word-break: break-word;
}

.reference-dialog {
    max-height: min(70vh, 720px);
    overflow: auto;
}

.reference-dialog__meta {
    color: var(--td-text-color-placeholder);
    font-size: var(--td-font-size-body-small);
    margin-bottom: var(--td-comp-margin-xs);
}

.reference-dialog__link {
    margin-bottom: var(--td-comp-margin-s);
}

.reference-dialog__content {
    color: var(--td-text-color-primary);
    word-break: break-word;
    line-height: 1.7;
}

.loading-container {
    padding: 0;
}
:deep(.t-chat__actions-margin){
    width: 100%;
    padding: 0;
    margin-left: 0;
}
.isMobile .share-icon{
    position: absolute;
    right: 0;
    margin-right: 0;
}
.isMobile .control-icon{
    border: 1px solid var(--td-component-border);
    border-radius: var(--td-radius-medium);
    padding: calc(var(--td-pop-padding-m) - 1px);
}
.chat-item__container.loading{
    padding-bottom: 32px;
}

.file-attachments {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 8px 0;
}

.image-attachments {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 8px 0 ;
}

.msg-inline-image {
    max-width: 200px;
    max-height: 200px;
    border-radius: 8px;
    object-fit: contain;
    cursor: pointer;
    display: block;
}

.msg-inline-image:hover {
    opacity: 0.9;
}
</style>
