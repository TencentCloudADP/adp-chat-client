<script setup lang="ts">
import SidebarToggle from '@/components/SidebarToggle.vue';
import ApplicationList from '@/components/ApplicationList.vue';
import HistoryList from '@/components/ChatList.vue';
import LogoArea from '@/components/LogoArea.vue';
import PersonalAccount from '@/components/PersonalAccount.vue';
import Settings from '@/components/Settings.vue';
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();
</script>

<template>
    <t-drawer :visible="uiStore.drawerVisible" placement="left" :mode="uiStore.isMobile ? 'overlay' : 'push'"
        :show-overlay="false">
        <div class="drawer-content">
            <div class="drawer-control">
                <SidebarToggle />
            </div>
            <ApplicationList />
            <t-divider />
            <HistoryList />
        </div>
        <template #header>
            <LogoArea />
        </template>
        <template #footer>
            <div class="drawer-footer">
                <PersonalAccount />
                <Settings />
            </div>
        </template>
    </t-drawer>
</template>

<style scoped>
.drawer-content {
    display: flex;
    flex-direction: column;
}

.drawer-control {
    display: flex;
    justify-content: flex-start;
}

.drawer-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
