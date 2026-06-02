<!--
  对话列表组件
  @description 用于展示和管理用户的聊天会话列表，支持切换会话
-->
<script setup lang="tsx">
import { computed } from 'vue';
import type { ChatConversation } from '../model/chat-v2';

interface Props {
    /** 会话列表 */
    conversations: ChatConversation[];
    /** 当前选中的会话ID */
    currentConversationId?: string;
}

const props = withDefaults(defineProps<Props>(), {
    conversations: () => [],
    currentConversationId: ''
});

const emit = defineEmits<{
    (e: 'select', conversation: ChatConversation): void;
}>();

/**
 * 按最后活跃时间倒序排列的会话列表
 */
const sortedConversations = computed(() => {
    return [...props.conversations].sort(
        (a, b) => b.LastActiveAt - a.LastActiveAt
    );
});

/**
 * 格式化更新时间
 * 规则：当天 HH:mm、1~6 天内 x天前、7 天及以上 M/D
 * @param time 秒级或毫秒级时间戳
 */
const formatUpdateTime = (time: number): string => {
    if (!time) return '';
    const ts = time < 1e12 ? time * 1000 : time;
    const target = new Date(ts);
    if (isNaN(target.getTime())) return '';

    const now = new Date();
    const todayStart = new Date(
        now.getFullYear(), now.getMonth(), now.getDate()
    ).getTime();
    const targetDayStart = new Date(
        target.getFullYear(), target.getMonth(), target.getDate()
    ).getTime();

    if (targetDayStart === todayStart) {
        const hh = String(target.getHours()).padStart(2, '0');
        const mm = String(target.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    }

    const diffDays = Math.floor(
        (todayStart - targetDayStart) / (24 * 60 * 60 * 1000)
    );
    if (diffDays >= 1 && diffDays <= 6) {
        return `${diffDays}天前`;
    }
    return `${target.getMonth() + 1}/${target.getDate()}`;
};

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
        <div class="history-header">
            <span class="history-header__title">对话列表</span>
        </div>
        <!-- 会话项列表 -->
        <div
            v-for="item in sortedConversations"
            :key="item.Id"
            class="history-item"
            :class="{ active: currentConversationId === item.Id }"
            @click="handleClick(item)"
        >
            <div class="history-title" :title="item.Title">{{ item.Title }}</div>
            <span v-if="item.LastActiveAt" class="history-time">
                {{ formatUpdateTime(item.LastActiveAt) }}
            </span>
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
    line-height: var(--td-comp-size-s);
    color: var(--td-text-color-primary);
    padding-left: var(--td-comp-paddingLR-s);
    display: flex;
    align-items: center;
    margin-bottom: var(--td-comp-margin-s);
}

.history-header__title {
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

.history-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.history-time {
    flex-shrink: 0;
    margin-left: 8px;
    font-size: var(--td-font-size-link-small);
    color: var(--td-text-color-placeholder);
}
</style>
