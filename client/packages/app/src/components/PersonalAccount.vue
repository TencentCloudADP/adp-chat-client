<script setup lang="ts">
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

</script>

<template>
    <div class="personal-account">
        <t-avatar :imageProps="{
            lazy: true,
            loading: ''
        }" v-if="userStore.avatarUrl" size="small" :image="userStore.avatarUrl" />
        <t-avatar :imageProps="{
            lazy: true,
            loading: ''
        }" v-else size="small">{{ userStore.avatarName
        }}</t-avatar>
        <span class="user-name">{{ userStore.name }}</span>
    </div>
</template>

<style scoped>
.personal-account {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: var(--td-comp-margin-xs);
}

.user-name {
    color: var(--td-text-color-primary);
    font-size: var(--td-font-size-title-medium);
    font-weight: 600;
}
</style>
