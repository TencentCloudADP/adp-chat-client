<script setup lang="ts">
import Search from '@/components/Search.vue';
import GroupList from '@/components/GroupList.vue';
import HistoryList from '@/components/ChatList.vue';
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();
</script>

<template>
    <t-drawer :visible="uiStore.drawerVisible" placement="left" mode="push" size="small" show-in-attached-element
        :show-overlay="false" :footer="false">
        <div class="drawer-content">
            <!-- <Search /> -->
            <!-- <GroupList /> -->
            <HistoryList />
        </div>
    </t-drawer>
</template>

<style scoped>
.drawer-content {
    display: flex;
    flex-direction: column;
    gap: var(--td-comp-paddingLR-m);
}
</style>
