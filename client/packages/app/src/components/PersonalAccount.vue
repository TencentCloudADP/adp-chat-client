<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { logout } from '@/service/auth';

const router = useRouter();
const userStore = useUserStore();

const handleLogout = () => {
    logout(() => router.replace('/login'));
};

</script>

<template>
    <t-dropdown maxColumnWidth="200" placement="bottom">
        <template #dropdown>
            <t-dropdown-menu>
                <t-dropdown-item>
                    <div class="operations-dropdown-container-item">
                        <t-icon name="user-circle"></t-icon>
                        {{ $t('个人中心') }}
                    </div>
                </t-dropdown-item>
                <t-dropdown-item @click="handleLogout">
                    <div class="operations-dropdown-container-item">
                        <t-icon name="poweroff"></t-icon>
                        {{ $t('退出登录') }}
                    </div>
                </t-dropdown-item>
            </t-dropdown-menu>
        </template>
        <t-button theme="default" variant="text">
            <template #icon>
                <t-avatar size="small" style="margin-right: var(--td-comp-margin-xs);">{{ userStore.avatarName
                }}</t-avatar>
            </template>
            {{ userStore.name }}
            <template #suffix><t-icon name="chevron-down" /></template>
        </t-button>
    </t-dropdown>
</template>

<style scoped>
.operations-dropdown-container-item {
    width: 100%;
    display: flex;
    align-items: center;
}

:deep(.t-icon) {
    font-size: 18px;
    margin-right: var(--td-comp-margin-xs);
}
</style>
