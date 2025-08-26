<script setup lang="ts">
import HeaderLayout from '@/layout/HeaderLayout.vue'
import MainLayout from '@/layout/MainLayout.vue'
import SideLayout from '@/layout/SideLayout.vue'
import { onMounted } from 'vue'
import { fetchUserInfo } from '@/service/user';
import { initApplication } from '@/stores/apps';

onMounted(async () => {
    fetchUserInfo();
    initApplication();
});

</script>

<template>
    <t-header>
        <HeaderLayout />
    </t-header>
    <t-content>
        <div class="content">
            <t-card style="height: 100%;" :bordered="false">
                <SideLayout />
                <MainLayout />
            </t-card>
        </div>
    </t-content>
</template>

<style scoped>
.content {
    height: calc(100vh - var(--td-comp-size-xxxl));
    border: 1px solid var(--td-border-level-2-color);
    border-radius: var(--td-radius-default);
}

:deep(.t-card__body) {
    height: 100%;
}
</style>
