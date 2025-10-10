<script setup lang="ts">
import SidebarToggle from '@/components/SidebarToggle.vue';
import HistoryList from '@/components/ChatList.vue';
import LogoArea from '@/components/LogoArea.vue';
import PersonalAccount from '@/components/PersonalAccount.vue';
import Settings from '@/components/Settings.vue';
import ThemeSwitcher from '@/components/ThemeSwitcher.vue';
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();
</script>

<template>
    <t-drawer :visible="uiStore.drawerVisible" placement="left" mode="push" size="400px" show-in-attached-element
        :show-overlay="false">
        <div class="drawer-content">
            <SidebarToggle />
            <HistoryList />
        </div>
        <template #header>
            <LogoArea :title="$t('project.projectName')" />
        </template>
        <template #footer>
            <div class="drawer-footer">
                <PersonalAccount />
                <ThemeSwitcher />
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

.drawer-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
