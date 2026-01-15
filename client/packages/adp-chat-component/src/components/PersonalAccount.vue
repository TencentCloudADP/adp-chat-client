<script setup lang="ts">
import { Avatar as TAvatar } from 'tdesign-vue-next';

interface Props {
    /** 用户头像URL */
    avatarUrl?: string;
    /** 用户头像文字（无头像时显示） */
    avatarName?: string;
    /** 用户名称 */
    name?: string;
}

withDefaults(defineProps<Props>(), {
    avatarUrl: '',
    avatarName: '',
    name: ''
});

const emit = defineEmits<{
    (e: 'click'): void;
}>();

const handleClick = () => {
    emit('click');
};
</script>

<template>
    <div class="personal-account" @click="handleClick">
        <t-avatar :imageProps="{
            lazy: true,
            loading: ''
        }" v-if="avatarUrl" size="small" :image="avatarUrl" />
        <t-avatar :imageProps="{
            lazy: true,
            loading: ''
        }" v-else size="small">{{ avatarName }}</t-avatar>
        <span class="user-name">{{ name }}</span>
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
