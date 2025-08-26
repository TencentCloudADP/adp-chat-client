<script setup lang="ts">
import Chat from '@/components/Chat/Index.vue';
import SidebarToggle from '@/components/SidebarToggle.vue';

</script>

<template>
    <div class="main-layout">
        <Chat  />
        <!-- 收起/展开侧边栏按钮 -->
        <SidebarToggle />
    </div>
</template>

<style scoped>
.main-layout {
    height: 100%;
    position: relative;
    padding: var(--td-comp-size-xxxl);
}
</style>
