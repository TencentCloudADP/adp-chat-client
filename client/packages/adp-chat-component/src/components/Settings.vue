<script setup lang="tsx">
import CustomizedIcon from './CustomizedIcon.vue';
import type { ThemeProps, LanguageOption } from '../model/type';
import { themePropsDefaults, defaultLanguageOptions } from '../model/type';
import { Space as TSpace, Dropdown as TDropdown, DropdownMenu as TDropdownMenu, DropdownItem as TDropdownItem, Button as TButton } from 'tdesign-vue-next';

interface Props extends ThemeProps {
    /** 语言选项列表 */
    languageOptions?: LanguageOption[];
    /** 切换主题文本 */
    switchThemeText?: string;
    /** 选择语言文本 */
    selectLanguageText?: string;
    /** 退出登录文本 */
    logoutText?: string;
}

withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    languageOptions: () => defaultLanguageOptions,
    switchThemeText: '切换主题',
    selectLanguageText: '选择语言',
    logoutText: '退出登录'
});

const emit = defineEmits<{
    (e: 'toggleTheme'): void;
    (e: 'changeLanguage', key: string): void;
    (e: 'logout'): void;
}>();

/**
 * 切换主题模式（light <-> dark）。
 */
const toggleTheme = () => {
    emit('toggleTheme');
};

const handleLanguageChange = (key: string) => {
    emit('changeLanguage', key);
};

const handleLogout = () => {
    emit('logout');
};
</script>

<template>
    <t-space>
        <t-dropdown maxColumnWidth="280px" >
            <t-button theme="default" shape="square" variant="text">
                <CustomizedIcon name="setting" :theme="theme" />
            </t-button>
            
            <t-dropdown-menu>
                <t-dropdown-item>
                    <div @click="toggleTheme" class="dropdown-item">
                        <CustomizedIcon size="m" name="stars" :theme="theme" />
                        {{ switchThemeText }}
                    </div>
                </t-dropdown-item>

                <t-dropdown-item>
                    <div class="dropdown-item">
                        <CustomizedIcon size="m" name="url" :theme="theme" />
                        {{ selectLanguageText }}
                    </div>
                    <t-dropdown-menu>
                        <t-dropdown-item v-for="lang in languageOptions" :key="lang.key"
                            @click="handleLanguageChange(lang.key)">
                            <div class="operations-dropdown-container-item">
                                {{ lang.value }}
                            </div>
                        </t-dropdown-item>
                    </t-dropdown-menu>
                </t-dropdown-item>

                <t-dropdown-item>
                    <div @click="handleLogout" class="dropdown-item">
                        <CustomizedIcon name="quit" size="m" :theme="theme" />
                        {{ logoutText }}
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
