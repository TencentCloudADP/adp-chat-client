<script setup lang="ts">

import Chat from '@/components/Chat/Index.vue';
import SidebarToggle from '@/components/SidebarToggle.vue';
import ChatAreaToogle from '@/components/ChatAreaToogle.vue';
import { useUiStore } from '@/stores/ui';
const uiStore = useUiStore();

</script>

<template>
    <div class="main-layout">
        <Chat :draggable="uiStore.chatAreaDraggable" />
        <!-- 收起/展开侧边栏按钮 -->
        <SidebarToggle />
        <!-- 收起/展开聊天内容区域按钮 -->
        <ChatAreaToogle />
    </div>
</template>

<style scoped>
.main-layout {
    height: 100%;
    position: relative;
    padding: var(--td-comp-size-xxxl);
}
</style>
