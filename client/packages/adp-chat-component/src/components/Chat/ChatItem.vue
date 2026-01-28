<!-- 聊天消息项组件，支持 Markdown、深度思考、操作按钮等 -->
<script setup lang="tsx">
import { ref, computed } from 'vue';
import type { Content, Message, QuoteInfo, Record as RecordV2, Reference as ReferenceV2 } from '../../model/chat-v2';
import { ScoreValue } from '../../model/chat-v2';
import type { CommonLayoutProps, ChatItemI18n } from '../../model/type';
import { commonLayoutPropsDefaults, defaultChatItemI18n } from '../../model/type';
import {  ChatItem as TChatItem } from '@tdesign-vue-next/chat';
import { Tooltip, Loading as TLoading, Link as TLink, Dialog as TDialog } from 'tdesign-vue-next';
import OptionCard from '../Common/OptionCard.vue';
import MdContent from '../Common/MdContent.vue';
import CustomizedIcon from '../CustomizedIcon.vue';

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
}

const props = withDefaults(defineProps<Props>(), {
    isLastMsg: false,
    showActions: true,
    ...commonLayoutPropsDefaults,
    i18n: () => ({})
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
}>();

// 响应式变量
type ChatRecord = RecordV2 & { Score?: typeof ScoreValue[keyof typeof ScoreValue] };
type QuoteInfoLike = QuoteInfo;
type ReferenceLike = ReferenceV2;

const record = ref(props.item as ChatRecord);
const expandStatus = ref(false);
const referenceDialogVisible = ref(false);
const activeReference = ref<ReferenceLike | null>(null);

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
        .map((content) => content.Text ?? '')
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

const collectFromContents = <T,>(picker: (content: Content) => T[] | undefined): T[] => {
    const values: T[] = [];
    for (const message of messages.value) {
        for (const content of message.Contents ?? []) {
            const picked = picker(content);
            if (picked?.length) {
                values.push(...picked);
            }
        }
    }
    return values;
};

const optionCards = computed(() => {
    return collectFromContents((content) => content.Image?.OptionCards ?? []);
});

const quoteInfos = computed<QuoteInfoLike[]>(() => {
    return collectFromContents((content) => content.Image?.QuoteInfos ?? []);
});

const references = computed<ReferenceLike[]>(() => {
    return collectFromContents((content) => content.Image?.References ?? []);
});

const isFinal = computed(() => {
    return record.value.Status !== 'processing';
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
 */
const isRated = () => {
    return recordScore.value != ScoreValue.Unknown && recordScore.value !== undefined;
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
            <MdContent content={content} role="system" theme={props.theme} key={index} />
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

const openReferenceDialog = (reference: ReferenceLike) => {
    activeReference.value = reference;
    referenceDialogVisible.value = true;
};

const isSliceReference = (reference: ReferenceLike) => {
    return reference.Type === 2 && Boolean(reference.PageContent || reference.OrgData);
};

const getReferenceTitle = (reference: ReferenceLike) => {
    return reference.DocName || reference.Name || '未命名来源';
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
    <!-- 聊天项组件 -->
    <TChatItem animation="skeleton" :role="isFromSelf ? 'user' : 'assistant'" :text-loading="false"
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
                <div v-if="isFromSelf" class="user-message">
                    <MdContent :content="displayText" role="user" :theme="theme" :quoteInfos="quoteInfos" />
                    <CustomizedIcon :size="isMobile ? 'm' : 's'" v-if="showActions && !isMobile" class="control-icon copy-icon" name="copy" :theme="theme"
                        @click="(e: any) => copyContent(e, displayText, 'user')" />
                    <CustomizedIcon :size="isMobile ? 'm' : 's'" v-if="showActions && !isMobile" class="control-icon share-icon" name="share" :theme="theme"
                        @click="share(item)" />
                </div>
                <MdContent v-else :content="displayText" role="assistant" :theme="theme" :quoteInfos="quoteInfos" />
                <OptionCard v-if="optionCards && optionCards.length" :cards="optionCards" :sendMessage="handleSendMessage" />
                <div class="references-container"
                    v-if="references && references.length > 0 && isFinal">
                    <span class="title">{{ i18n.references }}: </span>
                    <ol class="reference-list">
                        <li
                            v-for="(reference, idx) in references"
                            :key="`${reference.Id || reference.Url || reference.Name || idx}-${idx}`"
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
                                {{ reference.Name }}
                            </TLink>
                            <span v-else class="reference-link">
                                {{ reference.Name }}
                            </span>
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
        :width="isMobile ? '92%' : '720px'"
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
                {{ getReferenceContent(activeReference) }}
            </div>
        </div>
    </TDialog>
</template>

<style scoped>
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

.reference-slice__meta {
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
    white-space: pre-wrap;
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
