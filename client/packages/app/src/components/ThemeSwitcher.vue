<script setup lang="ts">
import { useUiStore } from '@/stores/ui';

const ui = useUiStore();

/**
 * 切换主题模式（light <-> dark）。
 */
const toggleTheme = () => {
    const previousTheme = ui.theme;
    const newTheme = previousTheme === 'light' ? 'dark' : 'light';
    ui.setTheme(newTheme);
};
</script>

<template>
    <!-- 主题切换按钮，带提示气泡 -->
    <t-tooltip placement="bottom" :content="$t('header.switchTheme')">
        <t-button theme="default" shape="square" variant="text" @click="toggleTheme">
            <!-- 根据当前主题显示不同图标 -->
            <t-icon :name="ui.theme === 'light' ? 'mode-light' : 'moon'" />
        </t-button>
    </t-tooltip>
</template>

<style scoped>
/* 主题切换图标样式 */
.t-icon {
    font-size: 20px;
}
</style>
