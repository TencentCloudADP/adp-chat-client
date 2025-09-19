<!--
  聊天列表组件
  @description 用于展示和管理用户的聊天会话列表，支持新建、切换和操作会话
-->
<script setup lang="tsx">
import { computed } from 'vue';
import moment from 'moment';
import { useI18n } from 'vue-i18n';
import { useChatStore } from '@/stores/chat';
import { useRouter } from 'vue-router';
import type { ChatConversation } from '@/model/chat'
const router = useRouter();
const { t } = useI18n();
/**
 * 聊天状态管理
 * @type {Store}
 */
const chatStore = useChatStore();
/**
 * 操作选项配置
 * @type {Array<{content: string, value: number, prefixIcon?: Function, theme?: string}>}
 */
const options = [
    {
        content: t('group.moveToGroup'),
        value: 1,
        prefixIcon: () => <t-icon name="folder-move" />,
    },
    {
        content: t('operation.editName'),
        value: 2,
        prefixIcon: () => <t-icon name="edit-2" />,
    },
    {
        content: t('operation.share'),
        value: 3,
        prefixIcon: () => <t-icon name="share-1" />,
    },
    {
        content: t('operation.pin'),
        value: 4,
        prefixIcon: () => <t-icon name="pin" />,
    },
    {
        content: t('operation.delete'),
        value: 5,
        theme: 'error',
        prefixIcon: () => <t-icon name="delete" />,
    },
];
/**
 * 当前选中的会话ID
 * @type {ComputedRef<string>}
 */
const currentConversationId = computed(() => chatStore.currentConversationId);
/**
 * 会话列表
 * @type {ComputedRef<ChatConversation[]>}
 */
const conversations = computed(() => chatStore.conversations)

/**
 * 会话历史分类项接口
 * @interface ConversationHistoryItem
 * @property {string} time - 分类时间标签（如"今天"、"最近"）
 * @property {ChatConversation[]} data - 该分类下的会话列表
 */
interface ConversationHistoryItem {
    time: string
    data: ChatConversation[]
}

const conversationsHistoryList = computed<ConversationHistoryItem[]>(() => {
    const now = moment();
    const isToday = (timestamp: number) => moment(timestamp * 1000).isSame(now, 'day');

    const { today, history } = conversations.value.reduce(
        (acc, chat) => {
            isToday(chat.LastActiveAt) ? acc.today.push(chat) : acc.history.push(chat);
            return acc;
        },
        { today: [] as ChatConversation[], history: [] as ChatConversation[] }
    );
    return [
        { time: t('common.today'), data: today.sort((a, b) => b.LastActiveAt - a.LastActiveAt) },
        { time: t('common.recent'), data: history.sort((a, b) => b.LastActiveAt - a.LastActiveAt) }
    ];
});

/**
 * 点击会话项的处理函数
 * @param {ChatConversation} detail - 会话详情
 */
const handleClick = (detail: ChatConversation) => {
    chatStore.setCurrentConversation(detail);
    router.push({ name: 'Home', query: { conversationId: detail.Id } });
};

/**
 * 创建新会话的处理函数
 */
const handleCreateNewChat = () => {
    router.push({ name: 'Home' })
    chatStore.setCurrentConversation({
        Id: "",
        AccountId: "",
        Title: "",
        LastActiveAt: 0,
        CreatedAt: 0
    });
}
</script>

<template>
    <!-- 会话列表容器 -->
    <div class="history-list">
        <div class="history-header">
            <!-- 列表头部 -->
            <span>{{ t('conversation.conversation') }}</span>
            <t-popup :content="t('conversation.createConversation')" trigger="hover">
                <t-button variant="text" shape="square" size="small" @click="handleCreateNewChat">
                    <t-icon name="plus" />
                </t-button>
            </t-popup>
        </div>
        <!-- TODO: 增加时间分类 -->
        <!-- 会话项列表 -->
        <div v-for="(list, index) in conversationsHistoryList" :key="index">
            <div class="history-header">
                <!-- 列表头部 -->
                <span class="history-header__time">{{ list.time }}</span>
            </div>
            <div v-for="item in list.data" :key="item.Id" class="history-item"
                :class="{ active: currentConversationId === item.Id }" @click="handleClick(item)">
                <div class="history-title">{{ item.Title }}</div>
                <!-- 操作下拉菜单 -->
                <!-- <div class="history-dropdown" @click.stop="">
                    <t-dropdown :id="`history-dropdown-${item.Id}`" :options="options" placement="bottom"
                        :attach="`history-dropdown-${item.Id}`" maxColumnWidth="200">
                        <t-button variant="text" shape="square" size="small">
                            <t-icon name="ellipsis" />
                        </t-button>
                    </t-dropdown>
                </div> -->
            </div>
        </div>

    </div>
</template>

<style scoped>
.history-list {
    width: 100%;
    background: var(--td-bg-color-container);
    border-radius: var(--td-radius-default);
    padding: var(--td-comp-paddingTB-s) 0;
}

.history-header {
    font-size: var(--td-font-size-mark-small);
    color: var(--td-text-color-primary);
    padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-l);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.history-header__time {
    color: var(--td-text-color-secondary);
    font-weight: 600;
}

.history-item {
    cursor: pointer;
    padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-l);
    border-radius: var(--td-radius-default);
    transition: background 0.2s;
    color: var(--td-text-color-secondary);
    display: flex;
    justify-content: space-between;
    align-items: center;
}


.history-item.active {
    background: var(--td-brand-color-light);
    color: var(--td-brand-color);
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
