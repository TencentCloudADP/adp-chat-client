<script setup lang="tsx">
// 国际化工具
import { useI18n } from 'vue-i18n';
// Vue 响应式工具
import { ref } from 'vue';
// 类型定义
import type { Record, AgentThought } from '@/model/chat';
import { ScoreValue } from '@/model/chat';
// TDesign Vue 组件
import {
    ChatContent as TChatContent,
    ChatItem as TChatItem,
    ChatLoading as TChatLoading,
} from '@tdesign-vue-next/chat';
import { FileCopyIcon, Share1Icon, RefreshIcon, ThumbUp2Icon, ThumbDown1Icon } from 'tdesign-icons-vue-next';
// 服务层函数
import { handleRate } from '@/service/chat';
// 状态管理
import { useChatStore } from '@/stores/chat';
// TDesign UI 组件
import { MessagePlugin, Tooltip, Divider } from 'tdesign-vue-next';
import { storeToRefs } from 'pinia';
// 工具函数
import { copy } from '@/utils/clipboard';
import MdContent from '../Common/MdContent.vue';

const { t } = useI18n();
const chatStore = useChatStore();
const { currentConversationId: chatId } = storeToRefs(chatStore);

/**
 * 组件属性定义
 * @property {Record} item - 当前聊天记录项
 * @property {number} index - 当前项的索引
 * @property {boolean} isLastMsg - 是否为最后一条消息
 * @property {boolean} loading - 是否正在加载
 * @property {boolean} isStreamLoad - 是否为流式加载
 * @property {boolean} showActions - 是否显示操作按钮
 * @property {Function} onResend - 重新发送消息的回调函数
 * @property {Function} onShare - 分享消息的回调函数
 */
const { showActions = true, item, index, isLastMsg, loading, isStreamLoad, onResend, onShare } = defineProps<{
    item: Record;
    index: number;
    isLastMsg?: boolean;
    loading: boolean;
    isStreamLoad: boolean;
    showActions?: boolean;
    onResend?: (id: string | undefined) => void;
    onShare?: (ids: string[]) => void;
}>();

// 响应式变量
const record = ref(item);

/**
 * 复制内容到剪贴板
 * @param {any} event - 事件对象
 * @param {string | undefined} content - 要复制的内容
 * @param {string} type - 内容类型（'user' 或 'assistant'）
 * @returns {Promise<void>}
 */
async function copyContent(event: any, content: string | undefined, type: string): Promise<void> {
    let rowtext: string | undefined;
    const container = event?.e.target as HTMLElement;
    const markdownElements = container?.closest('.t-chat__content')?.querySelectorAll('.markdown-body');
    rowtext = markdownElements && markdownElements.length > 0 ? markdownElements[markdownElements.length - 1]?.textContent || undefined : undefined;

    await copy(rowtext, content);
}

/**
 * 对消息进行评分（点赞/踩）
 * @param {Record} record - 当前聊天记录
 * @param {ScoreValue} score - 评分值（0: 取消, 1: 点赞, 2: 踩）
 * @returns {Promise<void>}
 */
const rate = async (record: Record, score: ScoreValue) => {
    const disabled = (record.Score != ScoreValue.Unknown && record.Score !== undefined)
    if (disabled) return;
    try {
        const _score = score;
        const msg = _score === ScoreValue.Like ? t('operation.thxForGood') : _score === ScoreValue.Dislike ? t('operation.thxForBad') : "";
        await handleRate({
            ConversationId: chatId.value,
            RecordId: record.RecordId,
            Score: _score,
        });
        // 点赞完成后立即更新 icon 状态
        record.Score = _score;
        msg && MessagePlugin.info(msg);
    } catch (err) {
        // 错误处理
    }
};

/**
 * 分享消息
 * @param {Record} record - 当前聊天记录
 * @returns {Promise<void>}
 */
const share = async (record: Record) => {
    let shareList = [record.RecordId]
    if (record.RelatedRecordId) {
        shareList.push(record.RelatedRecordId)
    }
    onShare && onShare(shareList);
};

/**
 * 渲染推理模块的头部自定义内容
 * @param {boolean} flag - 思维链内容是否加载中
 * @param {Record} item - 当前消息项
 * @returns {JSX.Element} - 返回对应的头部组件
 */
const renderHeader = () => {
    const endText = t('conversation.deepThinkingFinished');
    return (
        <div class="flex">
            <span>{endText}</span>
        </div>
    );
};

/**
 * 渲染推理内容
 * @param {AgentThought | undefined} reasoningContent - 推理内容数据
 * @returns {JSX.Element | null} - 返回渲染的推理内容或 null
 */
const renderReasoningContent = (reasoningContent: AgentThought | undefined) => {
    if (!reasoningContent) return <div>dasd</div>;
    return (
        <div>
            {reasoningContent.Procedures?.map((procedure, index) => (
                <MdContent key={index} content={procedure.Debugging?.DisplayContent || procedure.Debugging?.Content || ''} role="system" />
            ))}
        </div>
    );
};

const renderReasoning = (item: Record) => {
    if (!item.AgentThought) {
        return false
    } else {
        return {
            collapsed: isLastMsg && !isStreamLoad,
            expandIconPlacement: 'right' as const,
            collapsePanelProps: {
                header: renderHeader(),
                content: renderReasoningContent(item.AgentThought),
            }
        }
    }
}
</script>

<template>
    <!-- 聊天项组件 -->
    <TChatItem animation="skeleton" :role="!item.IsFromSelf ? 'assistant' : 'user'" :text-loading="false"
        :reasoning="renderReasoning(item)">
        <!-- 内容插槽 -->
        <template #content>
            <div v-if="isLastMsg && isStreamLoad && !item.Content && !item.AgentThought" class="loading-container">
                <t-loading :text="`${$t('common.thinking')}...`" size="small"></t-loading>
            </div>
            <div v-else>

                <div v-if="item.IsFromSelf && showActions" class="user-message">
                    <!-- <TChatContent :content="item.Content" /> -->
                    <MdContent :content="item.Content" role="user" :quoteInfos="item.QuoteInfos" />
                    <file-copy-icon class="copy-icon" @click="(e: any) => copyContent(e, item.Content, 'user')" />
                    <share-1-icon class="share-icon" @click="share(item)" />
                </div>
                <MdContent v-else :content="item.Content" role="assistant" :quoteInfos="item.QuoteInfos" />
                <div class="references-container"
                    v-if="item.References && item.References.length > 0 && !(item.IsFinal === false)">
                    <span class="title">{{ $t('sender.references') }}: </span>
                    <ol>
                        <li v-for="(reference, index) in item.References">
                            <t-link theme="primary" :href="reference.Url" target="_blank">{{ reference.Name }}</t-link>
                        </li>
                    </ol>
                </div>
            </div>

        </template>
        <!-- 操作按钮插槽 -->
        <template #actions v-if="(!isStreamLoad || !isLastMsg) && showActions">
            <div class="actions-container">
                <Tooltip :content="t('operation.replay')" destroyOnClose showArrow theme="default">
                    <refresh-icon class="icon" @click="onResend && onResend(item.RelatedRecordId)" />
                </Tooltip>
                <Tooltip :content="t('operation.copy')" destroyOnClose showArrow theme="default">
                    <file-copy-icon class="icon" @click="(e: any) => copyContent(e, item.Content, 'assistant')" />
                </Tooltip>
                <Tooltip :content="t('operation.share')" destroyOnClose showArrow theme="default">
                    <share-1-icon class="icon" @click="share(item)" />
                </Tooltip>
                <Divider layout="vertical"></Divider>
                <Tooltip :content="t('operation.good')" destroyOnClose showArrow theme="default">
                    <thumb-up-2-icon class="icon"
                        :class="{ active: record.Score === ScoreValue.Like, disabled: record.Score != ScoreValue.Unknown && record.Score !== undefined }"
                        name="thumb-up-2" @click="rate(item, ScoreValue.Like)" />
                </Tooltip>
                <Tooltip :content="t('operation.bad')" destroyOnClose showArrow theme="default">
                    <thumb-down-1-icon class="icon"
                        :class="{ active: record.Score === ScoreValue.Dislike, disabled: record.Score != ScoreValue.Unknown && record.Score !== undefined }"
                        name="thumb-down-1" @click="rate(item, ScoreValue.Dislike)" />
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
    margin-left: var(--td-comp-margin-s);
}

/* 操作按钮图标样式 */
.icon {
    margin: var(--td-comp-paddingTB-xs) var(--td-comp-paddingLR-xs);
    width: var(--td-comp-size-xxxs);
    height: var(--td-comp-size-xxxs);
    box-sizing: content-box;
    color: var(--td-text-color-primary);
    background-color: var(--td-bg-color-secondarycontainer);
    border: 0;
    cursor: pointer;
}

.check-circle {
    color: var(--td-success-color-5);
    font-size: var(--td-font-size-title-large);
    margin-right: var(--td-comp-margin-s);
}

.icon.disabled {
    opacity: 0.25;
    cursor: not-allowed;
}

.icon.active {
    color: var(--td-brand-color);
    opacity: 1;
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
    margin-top: var(--td-comp-margin-xs);
    display: flex;
    align-items: center;
    list-style: none;
    padding: var(--td-pop-padding-s);
    background-color: var(--td-bg-color-secondarycontainer);
    border-radius: var(--td-radius-medium);
    border: 1px solid var(--td-border-level-2-color);
    overflow: hidden;
}

.references-container {
    margin: 0px var(--td-comp-margin-l) var(--td-comp-margin-xl) var(--td-comp-margin-l);
}

.references-container .title {
    color: var(--td-text-color-secondary);
}

.loading-container {
    padding: 0
}
</style>
