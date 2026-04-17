<!-- 聊天消息项组件，支持 Markdown、深度思考、操作按钮等 -->
<script setup lang="tsx">
import { ref, computed, watch } from 'vue';
import type { Content, Message, QuoteInfo, Record as RecordV2, Reference as ReferenceV2 } from '../../model/chat-v2';
import { ScoreValue } from '../../model/chat-v2';
import type { CommonLayoutProps, ChatItemI18n } from '../../model/type';
import { commonLayoutPropsDefaults, defaultChatItemI18n } from '../../model/type';
import {  ChatItem as TChatItem } from '@tdesign-vue-next/chat';
import { Tooltip, Loading as TLoading, Link as TLink, Dialog as TDialog } from 'tdesign-vue-next';
import OptionCard from '../Common/OptionCard.vue';
import MdContent from '../Common/MdContent.vue';
import WidgetActionTag from '../Common/WidgetActionTag.vue';
import CustomizedIcon from '../CustomizedIcon.vue';
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
}

const props = withDefaults(defineProps<Props>(), {
    isLastMsg: false,
    showActions: true,
    language: 'zh-CN',
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

const reasoningContents = computed(() => {    
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

const quoteInfos = computed<QuoteInfoLike[]>(() => {
    return collectFromMessageContents(primaryMessage.value, (content) => content.QuoteInfos ?? []);
});

const references = computed<ReferenceLike[]>(() => {
    return collectFromMessageContents(primaryMessage.value, (content) => content.References ?? []);
});

const isFinal = computed(() => {
    return record.value.Status !== 'processing';
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
            <div v-if="isLastMsg && isStreamLoad && !displayText && reasoningContents.length === 0" class="loading-container">
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
                    <MdContent 
                        :content="displayText" 
                        role="user" 
                        :theme="theme" 
                        :quoteInfos="quoteInfos"
                        :language="language"
                        :recordId="item.RecordId"
                        @widgetEvent="handleWidgetEvent"
                    />
                    <CustomizedIcon :size="isMobile ? 'm' : 's'" v-if="showActions && !isMobile" class="control-icon copy-icon" name="copy" :theme="theme"
                        @click="(e: any) => copyContent(e, displayText, 'user')" />
                    <CustomizedIcon :size="isMobile ? 'm' : 's'" v-if="showActions && !isMobile" class="control-icon share-icon" name="share" :theme="theme"
                        @click="share(item)" />
                </div>
                <MdContent 
                    v-else 
                    :content="displayText" 
                    role="assistant" 
                    :theme="theme" 
                    :quoteInfos="quoteInfos"
                    :language="language"
                    :recordId="item.RecordId"
                    :disable="!isLastMsg"
                    @widgetEvent="handleWidgetEvent"
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
                        :class="{ disabled: isRated() && recordScore !== ScoreValue.Like, 'not-allowed': isRated() || !canRate }"
                        class="control-icon icon"
                        :name="recordScore === ScoreValue.Like ? 'thumbs_up_active' : 'thumbs_up'"
                        :nativeIcon="record.Score === ScoreValue.Like"
                        :theme="theme" @click="rate(item, ScoreValue.Like)" />
                </Tooltip>
                <Tooltip :content="i18n.bad" destroyOnClose showArrow theme="default">
                    <CustomizedIcon
                        :size="isMobile ? 'm' : 's'"
                        :class="{ disabled: isRated() && recordScore !== ScoreValue.Dislike, 'not-allowed': isRated() || !canRate }"
                        class="control-icon icon"
                        :name="recordScore === ScoreValue.Dislike ? 'thumbs_down_active' : 'thumbs_down'"
                        :nativeIcon="record.Score === ScoreValue.Dislike"
                        :theme="theme" @click="rate(item, ScoreValue.Dislike)" />
                </Tooltip>
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

.flex {
    display: flex;
    align-items: center;
}

/* 用户消息的复制和分享图标样式 */
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
.user-message .copy-icon:hover,
.user-message .share-icon:hover,
.icon:hover {
    color: var(--td-brand-color);
}

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
</style>
