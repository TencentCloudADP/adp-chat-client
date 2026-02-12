<!-- 聊天消息项组件，支持 Markdown、深度思考、操作按钮等 -->
<script setup lang="tsx">
import { ref, computed } from 'vue';
import type { Record, AgentThought } from '../../model/chat';
import { ScoreValue } from '../../model/chat';
import type { CommonLayoutProps, ChatItemI18n } from '../../model/type';
import { commonLayoutPropsDefaults, defaultChatItemI18n } from '../../model/type';
import {  ChatItem as TChatItem } from '@tdesign-vue-next/chat';
import { Tooltip, Loading as TLoading, Link as TLink } from 'tdesign-vue-next';
import OptionCard from '../Common/OptionCard.vue';
import MdContent from '../Common/MdContent.vue';
import CustomizedIcon from '../CustomizedIcon.vue';

interface Props extends CommonLayoutProps {
    /** 当前聊天记录项 */
    item: Record;
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
    (e: 'rate', record: Record, score: typeof ScoreValue[keyof typeof ScoreValue]): void;
    (e: 'copy', rowtext: string | undefined, content: string | undefined, type: string): void;
    (e: 'sendMessage', message: string): void;
}>();

// 响应式变量
const record = ref(props.item);
const expandStatus = ref(false);

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
const isRated = (record: Record) => {
    return record.Score != ScoreValue.Unknown && record.Score !== undefined;
};

/**
 * 对消息进行评分（点赞/踩）
 */
const rate = async (record: Record, score: typeof ScoreValue[keyof typeof ScoreValue]) => {
    if (isRated(record)) return;
    emit('rate', record, score);
};

/**
 * 分享消息
 */
const share = async (record: Record) => {
    let shareList = [record.RecordId]
    if (record.RelatedRecordId) {
        shareList.push(record.RelatedRecordId)
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
const renderReasoningContent = (reasoningContent: AgentThought | undefined) => {
    if (!reasoningContent) return <div></div>;
    return (
        <div>
            {reasoningContent.Procedures?.map((procedure, index) => (
            <MdContent content={procedure.Debugging?.DisplayContent || procedure.Debugging?.Content || ''} role="system" theme={props.theme} key={index} />
            ))}
        </div>
    );
};

const renderReasoning = (item: Record) => {
    if (!item.AgentThought) {
        return false
    } else {
        return {
            collapsed: props.isLastMsg && !props.isStreamLoad,
            expandIcon:false,
            expandIconPlacement: 'right' as const,
            onExpandChange:(e: boolean) =>{
                expandStatus.value = e;
            },
            collapsePanelProps: {
                expandIcon:false,
                header: renderHeader(),
                content: renderReasoningContent(item.AgentThought)
            }
        }
    }
}

const handleSendMessage = (message: string) => {
    emit('sendMessage', message);
};
</script>

<template>
    <!-- 聊天项组件 -->
    <TChatItem animation="skeleton" :role="!item.IsFromSelf ? 'assistant' : 'user'" :text-loading="false"
        :reasoning="renderReasoning(item)" >
        <!-- 内容插槽 -->
        <template #content>
            <div v-if="isLastMsg && isStreamLoad && !item.Content && !item.AgentThought" class="loading-container">
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
                <div v-if="item.IsFromSelf" class="user-message">
                    <MdContent :content="item.Content" role="user" :theme="theme" :quoteInfos="item.QuoteInfos" />
                    <CustomizedIcon :size="isMobile ? 'm' : 's'" v-if="showActions && !isMobile" class="control-icon copy-icon" name="copy" :theme="theme"
                        @click="(e: any) => copyContent(e, item.Content, 'user')" />
                    <CustomizedIcon :size="isMobile ? 'm' : 's'" v-if="showActions && !isMobile" class="control-icon share-icon" name="share" :theme="theme"
                        @click="share(item)" />
                </div>
                <MdContent v-else :content="item.Content" role="assistant" :theme="theme" :quoteInfos="item.QuoteInfos" />
                <OptionCard v-if="item.OptionCards && item.OptionCards.length" :cards="item.OptionCards" :sendMessage="handleSendMessage" />
                <div class="references-container"
                    v-if="item.References && item.References.length > 0 && !(item.IsFinal === false)">
                    <span class="title">{{ i18n.references }}: </span>
                    <ol>
                        <li v-for="(reference, idx) in item.References" :key="idx">
                            <TLink theme="primary" :href="reference.Url" target="_blank" rel="noopener noreferrer">{{ reference.Name }}</TLink>
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
                        @click="(e: any) => copyContent(e, item.Content, 'assistant')" />
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
                        :class="{ disabled: isRated(record) && record.Score !== ScoreValue.Like, 'not-allowed': isRated(record) }"
                        :color="record.Score === ScoreValue.Like ? 'var(--td-brand-color)' : undefined"
                        class="control-icon icon" name="thumbs_up" :theme="theme" @click="rate(item, ScoreValue.Like)" />
                </Tooltip>
                <Tooltip :content="i18n.bad" destroyOnClose showArrow theme="default">
                    <CustomizedIcon
                        :size="isMobile ? 'm' : 's'"
                        :class="{ disabled: isRated(record) && record.Score !== ScoreValue.Dislike, 'not-allowed': isRated(record) }"
                        :color="record.Score === ScoreValue.Dislike ? 'var(--td-brand-color)' : undefined"
                        class="control-icon icon" name="thumbs_down" :theme="theme" @click="rate(item, ScoreValue.Dislike)" />
                </Tooltip>
            </div>
        </template>
    </TChatItem>
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
