<!--
  聊天列表组件
  @description 用于展示和管理用户的聊天会话列表，支持切换会话
-->
<script setup lang="tsx">
import { computed } from 'vue';
import moment from 'moment';
import type { ChatConversation } from '../model/chat';

interface Props {
    /** 会话列表 */
    conversations: ChatConversation[];
    /** 当前选中的会话ID */
    currentConversationId?: string;
    /** "今天"文本 */
    todayText?: string;
    /** "最近"文本 */
    recentText?: string;
}

const props = withDefaults(defineProps<Props>(), {
    conversations: () => [],
    currentConversationId: '',
    todayText: '今天',
    recentText: '最近'
});

const emit = defineEmits<{
    (e: 'select', conversation: ChatConversation): void;
}>();

/**
 * 会话历史分类项接口
 */
interface ConversationHistoryItem {
    time: string
    data: ChatConversation[]
}

const conversationsHistoryList = computed<ConversationHistoryItem[]>(() => {
    const now = moment();
    const isToday = (timestamp: number) => moment(timestamp * 1000).isSame(now, 'day');

    const { today, history } = props.conversations.reduce(
        (acc, chat) => {
            isToday(chat.LastActiveAt) ? acc.today.push(chat) : acc.history.push(chat);
            return acc;
        },
        { today: [] as ChatConversation[], history: [] as ChatConversation[] }
    );
    return [
        { time: props.todayText, data: today.sort((a, b) => b.LastActiveAt - a.LastActiveAt) },
        { time: props.recentText, data: history.sort((a, b) => b.LastActiveAt - a.LastActiveAt) }
    ];
});

/**
 * 点击会话项的处理函数
 */
const handleClick = (detail: ChatConversation) => {
    emit('select', detail);
};
</script>

<template>
    <!-- 会话列表容器 -->
    <div class="history-list">
        <!-- 会话项列表 -->
        <div v-for="(list, index) in conversationsHistoryList" :key="index" class="history-item-container">
            <div v-if="list.data.length > 0">
                <div class="history-header">
                    <!-- 列表头部 -->
                    <span class="history-header__time">{{ list.time }}</span>
                </div>
                <div v-for="item in list.data" :key="item.Id" class="history-item"
                    :class="{ active: currentConversationId === item.Id }" @click="handleClick(item)">
                    <div class="history-title">{{ item.Title }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.history-list {
    width: 100%;
}

.history-header {
    font-size: var(--td-font-size-mark-small);
    height: var(--td-comp-size-s);
    line-height:var(--td-comp-size-s);
    color: var(--td-text-color-primary);
    padding-left: var(--td-comp-paddingLR-s);
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.history-item-container + .history-item-container{
    margin-top: var(--td-comp-margin-l);
}

.history-header__time {
    color: var(--td-text-color-placeholder);
    font-size: var(--td-font-size-mark-small);
}

.history-item {
    height: var(--td-comp-size-m);
    line-height: var(--td-comp-size-m);
    cursor: pointer;
    padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-s);
    border-radius: var(--td-radius-medium);
    transition: background 0.2s;
    color: var(--td-text-color-primary);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--td-font-size-body-medium);
}


.history-item.active {
    background: var(--td-bg-color-container-active);
}
.history-item:hover {
    background: var(--td-bg-color-container-active);
}

.history-dropdown {
    visibility: hidden;
}


.history-title {
    max-width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.history-dropdown {
    visibility: hidden;
}

.history-item:hover .history-dropdown {
    visibility: visible;
}

.history-title__time {
    font-size: var(--td-font-size-link-small)
}
</style>
