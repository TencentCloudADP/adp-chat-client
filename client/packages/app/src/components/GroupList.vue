<script setup lang="tsx">
import { ref } from 'vue';
import { useGroupStore } from '@/stores/group';
import { mockGroupList } from '@/model/group';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const groupStore = useGroupStore();

const groupList = mockGroupList;

const options = [
    {
        content: t('operation.editName'),
        value: 1,
        prefixIcon: () => <t-icon name="edit-2" />,
    },
    {
        content: t('operation.pin'),
        value: 2,
        prefixIcon: () => <t-icon name="pin" />,
    },
    {
        content: t('operation.delete'),
        value: 3,
        theme: 'error',
        prefixIcon: () => <t-icon name="delete" />,
    },
];

const hoverId = ref('');

const handleClick = (id: string) => {
    groupStore.setActiveId(id);
};
</script>

<template>
    <div class="group-list">
        <div class="group-header">
            <span>{{ $t('group.group') }}</span>
            <t-popup :content="$t('group.createGroup')" trigger="hover">
                <t-button variant="text" shape="square" size="small">
                    <t-icon name="plus" />
                </t-button>
            </t-popup>
        </div>
        <div v-for="item in groupList" :key="item.id" class="group-item"
            :class="{ active: groupStore.activeId === item.id, hover: hoverId === item.id }"
            @click="handleClick(item.id)" @mouseenter="hoverId = item.id" @mouseleave="hoverId = ''">
            <div class="group-title">
                <t-icon name="folder-1" class="group-title-icon" />
                <span class="group-title-content">{{ item.title }}</span>
            </div>
            <div class="group-dropdown" @click.stop="">
                <t-dropdown :id="`group-dropdown-${item.id}`" :options="options" placement="bottom"
                    :attach="`group-dropdown-${item.id}`" maxColumnWidth="200">
                    <t-button variant="text" shape="square" size="small">
                        <t-icon name="ellipsis" />
                    </t-button>
                </t-dropdown>
            </div>
        </div>
    </div>
</template>

<style scoped>
.group-list {
    width: 100%;
    background: var(--td-bg-color-container);
    border-radius: var(--td-radius-default);
    padding: var(--td-comp-paddingTB-s) 0;
}

.group-header {
    font-size: var(--td-font-size-mark-small);
    color: var(--td-text-color-primary);
    padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-l);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.group-item {
    cursor: pointer;
    padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-l);
    border-radius: var(--td-radius-default);
    transition: background 0.2s;
    color: var(--td-text-color-secondary);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.group-item.hover {
    background: var(--td-bg-color-container-hover);
}

.group-item.active {
    background: var(--td-brand-color-light);
    color: var(--td-brand-color);
}

.group-title {
    font-size: var(--td-font-size-title-small);
    display: flex;
    align-items: center;
    width: 80%;
}

.group-title-icon {
    margin-right: var(--td-comp-margin-xs);
}

.group-dropdown {
    visibility: hidden;
}

.group-item.hover .group-dropdown {
    visibility: visible;
}

.group-title-content {
    max-width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
