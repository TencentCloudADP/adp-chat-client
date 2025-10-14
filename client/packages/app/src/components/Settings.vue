<script setup lang="tsx">
import { languageMap } from '@/i18n';
import { useUiStore } from '@/stores/ui';
import { useRouter } from 'vue-router';
import { logout } from '@/service/login';

const router = useRouter();
const uiStore = useUiStore();

/**
 * 切换主题模式（light <-> dark）。
 */
const toggleTheme = () => {
    const previousTheme = uiStore.theme;
    const newTheme = previousTheme === 'light' ? 'dark' : 'light';
    uiStore.setTheme(newTheme);
};

const handleLogout = () => {
    logout(() => router.replace('/login'));
};
</script>

<template>
    <t-space>
        <t-dropdown maxColumnWidth="300px">
            <t-button theme="default" shape="square" variant="text">
                <t-icon name="setting-1" />
            </t-button>
            <t-dropdown-menu>
                <t-dropdown-item>
                    <div @click="toggleTheme" class="dropdown-item">
                        <t-icon :name="uiStore.theme === 'light' ? 'mode-light' : 'moon'" />
                        {{ $t('sider.switchTheme') }}
                    </div>
                </t-dropdown-item>

                <t-dropdown-item>
                    <div class="dropdown-item">
                        <t-icon name="translate" />
                        {{ $t('sider.selectLanguage') }}
                    </div>
                    <t-dropdown-menu>
                        <t-dropdown-item v-for="(value, key) in languageMap" :key="key"
                            @click="uiStore.setLanguage(key)">
                            <div class="operations-dropdown-container-item">
                                {{ value }}
                            </div>
                        </t-dropdown-item>
                    </t-dropdown-menu>
                </t-dropdown-item>

                <t-dropdown-item>
                    <div @click="handleLogout" class="dropdown-item">
                        <t-icon name="poweroff"></t-icon>
                        {{ $t('account.logout') }}
                    </div>
                </t-dropdown-item>
            </t-dropdown-menu>
        </t-dropdown>
    </t-space>
</template>

<style scoped>
.dropdown-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: var(--td-comp-paddingLR-m);
}

.t-icon {
    font-size: var(--td-font-size-title-large);
}
</style>
