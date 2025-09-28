<script setup lang="tsx">
// 国际化工具
import { useI18n } from 'vue-i18n';
// Vue 响应式工具
import { ref } from 'vue';
// 类型定义
import type { Record, AgentThought } from '@/model/chat';
import { ScoreValue } from '@/model/chat';
// 工具函数
import { formatDisplayTime } from '@/utils/date';
// TDesign Vue 组件
import {
    ChatContent as TChatContent,
    ChatItem as TChatItem,
    ChatLoading as TChatLoading,
} from '@tdesign-vue-next/chat';
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

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

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
    switch (type) {
        case 'user':
            rowtext = container?.closest('.t-chat__content')?.querySelector('.md-content')?.textContent || undefined;
            break;
        case 'assistant':
            rowtext = container?.closest('.t-chat__content')?.querySelector('.md-content')?.textContent || undefined;
            break;
    }
    console.log('rowtext', rowtext)
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
    if(disabled) return;
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
    // TODO: 同时选择关联的问题和答案，但 user 时无法获取到 RelatedRecordId
    onShare && onShare([record.RecordId, record.RelatedRecordId]);
};

/**
 * 渲染推理模块的头部自定义内容
 * @param {boolean} flag - 思维链内容是否加载中
 * @param {Record} item - 当前消息项
 * @returns {JSX.Element} - 返回对应的头部组件
 */
const renderHeader = (flag: boolean) => {
    if (flag) {
        return <TChatLoading text={t('conversation.thinking') + '...'} />;
    }
    const endText = t('conversation.deepThinkingFinished');
    return (
        <div class="flex">
            {/* <t-icon name="check-circle" class="check-circle" /> */}
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
    if (!reasoningContent) return <div></div>;
    return (
        <div>
            {reasoningContent.Procedures?.map((procedure, index) => (
                <MdContent key={index} content={procedure.Debugging?.DisplayContent || procedure.Debugging?.Content || ''} role="system" />
            ))}
        </div>
    );
    // <TChatContent key={index} content={procedure.Debugging?.DisplayContent || procedure.Debugging?.Content || ''} role="system" />

};

const renderReasoning = (content: AgentThought | undefined) => {
    if (!content) {
        return false
    } else {
        return {
            collapsed: isLastMsg && !isStreamLoad,
            expandIconPlacement: 'right' as const,
            collapsePanelProps: {
                header: renderHeader(index === 0 && isStreamLoad && !item.Content),
                content: renderReasoningContent(item.AgentThought),
            }
        }
    }
}
</script>

<template>
    <!-- 聊天项组件 -->
    <TChatItem animation="moving" :name="item.IsLlmGenerated ? item.FromName : userStore.name"
        :role="item.IsLlmGenerated ? 'assistant' : 'user'" :variant="item.IsLlmGenerated ? undefined : 'base'"
        :text-loading="isLastMsg && loading" :reasoning="renderReasoning(item.AgentThought)">
        <!-- 时间戳插槽 -->
        <template #datetime>
            <span v-if="item.Timestamp">{{ formatDisplayTime(item.Timestamp * 1000) }}</span>
        </template>
        <!-- 头像插槽 -->
        <template #avatar>
            <t-avatar v-if="item.IsLlmGenerated" :image="item.FromAvatar" size="medium" />
            <t-avatar v-else-if="userStore.avatarUrl" :image="userStore.avatarUrl" size="medium">{{ userStore.avatarName
            }}</t-avatar>
            <t-avatar v-else size="medium">{{ userStore.avatarName }}</t-avatar>
        </template>
        <!-- 内容插槽 -->
        <template #content>
            <div v-if="!item.IsLlmGenerated" class="user-message">
                <!-- <TChatContent :content="item.Content" /> -->
                <MdContent :content="item.Content" role="user" />
                <t-icon name="copy" class="copy-icon" @click="(e: any) => copyContent(e, item.Content, 'user')" />
                <t-icon class="share-icon" name="share" @click="share(item)" />
            </div>
            <!-- <TChatContent v-else :content="item.Content" /> -->
            <MdContent v-else :content="item.Content" />
            <div class="references-container"
                v-if="item.References && item.References.length > 0 && !(item.IsFinal === false)">
                <span class="title">{{ $t('sender.references') }}: </span>
                <ol>
                    <li v-for="(reference, index) in item.References">
                        <t-link theme="primary" :href="reference.Url" target="_blank">{{ reference.Name }}</t-link>
                    </li>
                </ol>
            </div>
        </template>
        <!-- 操作按钮插槽 -->
        <template #actions v-if="(!isStreamLoad || !isLastMsg) && showActions">
            <div class="actions-container">
                <Tooltip :content="t('operation.replay')" destroyOnClose showArrow theme="default">
                    <t-icon class="icon" name="refresh" @click="onResend && onResend(item.RelatedRecordId)"></t-icon>
                </Tooltip>
                <Divider layout="vertical"></Divider>
                <Tooltip :content="t('operation.good')" destroyOnClose showArrow theme="default">
                    <t-icon class="icon" :class="{ active: record.Score === ScoreValue.Like,disabled: record.Score != ScoreValue.Unknown && record.Score !== undefined} " name="thumb-up-2"
                        @click="rate(item, ScoreValue.Like)" />
                </Tooltip>
                <Tooltip :content="t('operation.bad')" destroyOnClose showArrow theme="default">
                    <t-icon class="icon" :class="{ active: record.Score === ScoreValue.Dislike,disabled: record.Score != ScoreValue.Unknown && record.Score !== undefined}" name="thumb-down-1"
                        @click="rate(item, ScoreValue.Dislike)" />
                </Tooltip>
                <Tooltip :content="t('operation.copy')" destroyOnClose showArrow theme="default">
                    <t-icon class="icon" name="copy" @click="(e: any) => copyContent(e, item.Content, 'assistant')" />
                </Tooltip>
                <Tooltip :content="t('operation.share')" destroyOnClose showArrow theme="default">
                    <t-icon class="icon" name="share" @click="share(item)" />
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
    margin-left: 8px;
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
    font-size: 20px;
    margin-right: 8px;
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
    padding: 3px;
    background-color: var(--td-bg-color-secondarycontainer);
    border-radius: var(--td-radius-medium);
    border: 1px solid var(--td-border-level-2-color);
    overflow: hidden;
}

.references-container {
    margin: 0px 14px 20px 14px;
}

.references-container .title {
    color: var(--td-text-color-secondary);
}
</style>
