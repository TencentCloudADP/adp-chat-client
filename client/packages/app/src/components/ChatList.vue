<!--
  聊天列表组件
  @description 用于展示和管理用户的聊天会话列表，支持新建、切换和操作会话
-->
<script setup lang="tsx">
import { computed, ref, nextTick } from 'vue';
import moment from 'moment';
import { useI18n } from 'vue-i18n';
import { useChatStore } from '@/stores/chat';

import { useRouter } from 'vue-router';
import type { ChatConversation } from '@/model/chat'
import { fetchChatList } from '@/stores/chat';
import { handleDeleteConversation, handleUpdateConversationTitle } from '@/service/chat';
import { MessagePlugin } from 'tdesign-vue-next';
import CustomizedIcon from '@/components/CustomizedIcon.vue';


const router = useRouter();
const { t } = useI18n();
/**
 * 聊天状态管理
 * @type {Store}
 */
const chatStore = useChatStore();

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
 * 重命名相关状态
 */
const editingId = ref<string | null>(null);
const editingTitle = ref('');
const editingInputRef = ref<HTMLInputElement | null>(null);

/**
 * 删除确认对话框状态
 */
const deleteDialogVisible = ref(false);
const itemToDelete = ref<ChatConversation | null>(null);

/**
 * 下拉菜单的显示状态映射，用于控制每个菜单的显示/隐藏
 */
const dropdownVisible = ref<Record<string, boolean>>({});

/**
 * 开始重命名
 */
const handleStartRename = async (item: ChatConversation) => {
    // 关闭下拉菜单
    dropdownVisible.value[item.Id] = false;
    editingId.value = item.Id;
    editingTitle.value = item.Title;
    await nextTick();
    editingInputRef.value?.focus();
    editingInputRef.value?.select();
};

/**
 * 取消重命名
 */
const handleCancelRename = () => {
    editingId.value = null;
    editingTitle.value = '';
};

/**
 * 确认重命名
 */
const handleConfirmRename = async (item: ChatConversation) => {
    if (!editingTitle.value.trim() || editingTitle.value === item.Title) {
        editingId.value = null;
        return;
    }
    try {
        await handleUpdateConversationTitle({
            ConversationId: item.Id,
            Title: editingTitle.value.trim(),
        });
        await fetchChatList(item.Id);
        MessagePlugin.success(t('operation.editName'));
    } catch (e) {
        // 错误提示在 service 层已经处理
    } finally {
        editingId.value = null;
        editingTitle.value = '';
    }
};

/**
 * 显示删除确认对话框
 */
const handleDelete = (item: ChatConversation) => {
    // 关闭下拉菜单
    dropdownVisible.value[item.Id] = false;
    itemToDelete.value = item;
    deleteDialogVisible.value = true;
};

/**
 * 确认删除会话
 */
const handleConfirmDelete = async () => {
    if (!itemToDelete.value) return;
    
    try {
        await handleDeleteConversation({ ConversationId: itemToDelete.value.Id });
        await fetchChatList();
        deleteDialogVisible.value = false;
        itemToDelete.value = null;
    } catch (e) {
        // 错误提示在 service 层已经处理
    }
};

/**
 * 取消删除
 */
const handleCancelDelete = () => {
    deleteDialogVisible.value = false;
    itemToDelete.value = null;
};
</script>

<template>
    <!-- 会话列表容器 -->
    <div class="history-list">
        <!-- TODO: 增加时间分类 -->
        <!-- 会话项列表 -->
        <div v-for="(list, index) in conversationsHistoryList" :key="index" class="history-item-container">
            <block v-if="list.data.length > 0">
                <div class="history-header">
                    <!-- 列表头部 -->
                    <span class="history-header__time">{{ list.time }}</span>
                </div>
                <div
                    v-for="item in list.data"
                    :key="item.Id"
                    class="history-item"
                    :class="{ active: currentConversationId === item.Id }"
                    @click="handleClick(item)"
                >
                    <div class="history-title">
                        <span
                            v-if="editingId !== item.Id"
                            class="history-title-text"
                            :title="item.Title"
                        >
                            {{ item.Title }}
                        </span>
                        <input
                            v-else
                            :ref="(el: any) => { if (el) editingInputRef = el }"
                            v-model="editingTitle"
                            class="history-title-input"
                            type="text"
                            :placeholder="t('operation.editName')"
                            @click.stop
                            @keyup.enter="handleConfirmRename(item)"
                            @keyup.esc="editingId = null; editingTitle = ''"
                            @blur="handleConfirmRename(item)"
                        />
                    </div>
                    <div class="history-dropdown" @click.stop>
                        <t-dropdown 
                            v-model:visible="dropdownVisible[item.Id]"
                            trigger="click"
                        >
                            <span class="history-dropdown-trigger">
                                <CustomizedIcon name="more" size="xs" :showHoverBg="false" />
                            </span>
                            <t-dropdown-menu>
                                <t-dropdown-item>
                                    <div @click.stop="handleStartRename(item)" class="dropdown-item">
                                        {{ t('operation.editName') }}
                                    </div>
                                </t-dropdown-item>
                                <t-dropdown-item>
                                    <div @click.stop="handleDelete(item)" class="dropdown-item">
                                        {{ t('operation.delete') }}
                                    </div>
                                </t-dropdown-item>
                            </t-dropdown-menu>
                        </t-dropdown>
                    </div>
                </div>
            </block>

        </div>

    </div>

    <!-- 删除确认对话框 -->
    <t-dialog
        v-model:visible="deleteDialogVisible"
        :header="t('operation.delete')"
        :width="400"
        :close-on-overlay-click="false"
        attach="body"
        @close="handleCancelDelete"
    >
        <p>{{ t('conversation.deleteConfirm') }}</p>
        <template #footer>
            <t-space>
                <t-button theme="default" @click="handleCancelDelete">
                    {{ t('operation.cancel') }}
                </t-button>
                <t-button theme="danger" @click="handleConfirmDelete">
                    {{ t('operation.confirm') }}
                </t-button>
            </t-space>
        </template>
    </t-dialog>
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
    /* margin-top: var(--td-comp-margin-l); */
    margin-top: 0px;
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
    display: flex;
    align-items: center;
    justify-content: center;
}

.history-dropdown-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 3px;
    border-radius: 50%;
    transition: background-color 0.2s ease, color 0.2s ease;
    color: var(--td-text-color-placeholder);
    background-color: transparent;
}

.history-dropdown-trigger:hover {
    background-color: var(--td-bg-color-container-hover);
    color: var(--td-brand-color);
}

.history-dropdown-trigger:hover :deep(.customeized-icon) {
    background-color: transparent !important;
}

.history-title {
    max-width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    align-items: center;
}

.history-title-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.history-title-input {
    width: 100%;
    min-width: 0;
    border: none;
    border-bottom: 1px solid var(--td-brand-color);
    border-radius: 0;
    padding: 2px 4px;
    font-size: var(--td-font-size-body-medium);
    outline: none;
    background: transparent;
    color: var(--td-text-color-primary);
    flex: 1;
}

.history-item:hover .history-dropdown {
    visibility: visible;
}

.history-title__time {
    font-size: var(--td-font-size-link-small)
}

.dropdown-item {
    width: 100%;
    cursor: pointer;
    padding: var(--td-comp-paddingTB-xs) var(--td-comp-paddingLR-s);
}
</style>
