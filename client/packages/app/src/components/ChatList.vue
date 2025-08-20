<script setup lang="tsx">
import { ref } from 'vue';
import { useChatStore } from '@/stores/chat';
import { mockChatList } from '@/model/chat';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const chatStore = useChatStore();

const chatList = mockChatList;

const options = [
    {
        content: t('移动到分组'),
        value: 1,
        prefixIcon: () => <t-icon name="folder-move" />,
    },
    {
        content: t('编辑名称'),
        value: 2,
        prefixIcon: () => <t-icon name="edit-2" />,
    },
    {
        content: t('分享'),
        value: 3,
        prefixIcon: () => <t-icon name="share-1" />,
    },
    {
        content: t('置顶'),
        value: 4,
        prefixIcon: () => <t-icon name="pin" />,
    },
    {
        content: t('删除'),
        value: 5,
        theme: 'error',
        prefixIcon: () => <t-icon name="delete" />,
    },
];

const hoverId = ref('');

const handleClick = (id: string) => {
    chatStore.setActiveId(id);
};
</script>

<template>
    <div class="history-list">
        <div class="history-header">{{ t('聊天') }}</div>
        <div v-for="item in chatList" :key="item.id" class="history-item"
            :class="{ active: chatStore.activeId === item.id, hover: hoverId === item.id }"
            @click="handleClick(item.id)" @mouseenter="hoverId = item.id" @mouseleave="hoverId = ''">
            <div class="history-title">{{ item.title }}</div>
            <div class="history-dropdown" @click.stop="">
                <t-dropdown :id="`history-dropdown-${item.id}`" :options="options" placement="bottom"
                    :attach="`history-dropdown-${item.id}`" maxColumnWidth="200">
                    <t-button variant="text" shape="square" size="small">
                        <t-icon name="ellipsis" />
                    </t-button>
                </t-dropdown>
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

.history-item.hover {
    background: var(--td-bg-color-container-hover);
}

.history-item.active {
    background: var(--td-brand-color-light);
    color: var(--td-brand-color);
}

.history-dropdown {
    visibility: hidden;
}

.history-item.hover .history-dropdown {
    visibility: visible;
}

.history-title {
    max-width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
