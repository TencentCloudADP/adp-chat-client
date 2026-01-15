<script setup lang="ts">
import { computed } from 'vue';
import type { Application } from '../../model/application';
import type { ChatConversation } from '../../model/chat';
import ApplicationList from '../ApplicationList.vue';
import HistoryList from '../HistoryList.vue';
import PersonalAccount from '../PersonalAccount.vue';
import Settings from '../Settings.vue';
import SidebarToggle from '../SidebarToggle.vue';
import { Drawer as TDrawer, Divider as TDivider } from 'tdesign-vue-next';

interface LanguageOption {
    key: string;
    value: string;
}

interface Props {
    /** 是否显示侧边栏 */
    visible?: boolean;
    /** 应用列表 */
    applications?: Application[];
    /** 当前选中的应用ID */
    currentApplicationId?: string;
    /** 会话列表 */
    conversations?: ChatConversation[];
    /** 当前选中的会话ID */
    currentConversationId?: string;
    /** 用户头像URL */
    userAvatarUrl?: string;
    /** 用户头像文字 */
    userAvatarName?: string;
    /** 用户名称 */
    userName?: string;
    /** 主题模式 */
    theme?: 'light' | 'dark';
    /** 语言选项列表 */
    languageOptions?: LanguageOption[];
    /** 是否为移动端 */
    isMobile?: boolean;
    /** 最大应用显示数量 */
    maxAppLen?: number;
    /** 国际化文本 */
    i18n?: {
        more?: string;
        collapse?: string;
        today?: string;
        recent?: string;
        switchTheme?: string;
        selectLanguage?: string;
        logout?: string;
    };
}

const props = withDefaults(defineProps<Props>(), {
    visible: true,
    applications: () => [],
    currentApplicationId: '',
    conversations: () => [],
    currentConversationId: '',
    userAvatarUrl: '',
    userAvatarName: '',
    userName: '',
    theme: 'light',
    languageOptions: () => [
        { key: 'zh-CN', value: '简体中文' },
        { key: 'en-US', value: 'English' }
    ],
    isMobile: false,
    maxAppLen: 4,
    i18n: () => ({})
});

// 默认 i18n 配置
const defaultI18n = {
    more: '更多',
    collapse: '收起',
    today: '今天',
    recent: '最近',
    switchTheme: '切换主题',
    selectLanguage: '选择语言',
    logout: '退出登录'
};

// 合并默认值和传入值
const i18n = computed(() => ({
    ...defaultI18n,
    ...props.i18n
}));

const emit = defineEmits<{
    (e: 'toggleSidebar'): void;
    (e: 'selectApplication', app: Application): void;
    (e: 'selectConversation', conversation: ChatConversation): void;
    (e: 'toggleTheme'): void;
    (e: 'changeLanguage', key: string): void;
    (e: 'logout'): void;
    (e: 'userClick'): void;
}>();

const mode = computed(() => props.isMobile ? 'overlay' : 'push');

const handleToggleSidebar = () => {
    emit('toggleSidebar');
};

const handleSelectApplication = (app: Application) => {
    emit('selectApplication', app);
};

const handleSelectConversation = (conversation: ChatConversation) => {
    emit('selectConversation', conversation);
};

const handleToggleTheme = () => {
    emit('toggleTheme');
};

const handleChangeLanguage = (key: string) => {
    emit('changeLanguage', key);
};

const handleLogout = () => {
    emit('logout');
};

const handleUserClick = () => {
    emit('userClick');
};
</script>

<template>
    <div class="custome-drawer-container" :class="{ 'drawer-open': visible, 'drawer-closed': !visible, 'is-mobile': isMobile }">
        <t-drawer 
            drawerClassName="custome-drawer" 
            size="280px" 
            :visible="visible" 
            placement="left" 
            :mode="mode"
            :show-overlay="false"
            show-in-attached-element
        >
            <div class="drawer-content">
                <div class="drawer-control">
                    <SidebarToggle @toggle="handleToggleSidebar" />
                </div>
                <div class="drawer-scrollable">
                    <ApplicationList 
                        :applications="applications" 
                        :currentApplicationId="currentApplicationId"
                        :maxAppLen="maxAppLen"
                        :moreText="i18n.more"
                        :collapseText="i18n.collapse"
                        @select="handleSelectApplication"
                    />
                    <t-divider />
                    <HistoryList 
                        :conversations="conversations" 
                        :currentConversationId="currentConversationId"
                        :todayText="i18n.today"
                        :recentText="i18n.recent"
                        @select="handleSelectConversation"
                    />
                </div>
            </div>
            <template #header>
                <slot name="sider-logo"></slot>
            </template>
            <template #footer>
                <div class="drawer-footer">
                    <PersonalAccount 
                        :avatarUrl="userAvatarUrl"
                        :avatarName="userAvatarName"
                        :name="userName"
                        @click="handleUserClick"
                    />
                    <Settings 
                        :theme="theme"
                        :languageOptions="languageOptions"
                        :switchThemeText="i18n.switchTheme"
                        :selectLanguageText="i18n.selectLanguage"
                        :logoutText="i18n.logout"
                        @toggleTheme="handleToggleTheme"
                        @changeLanguage="handleChangeLanguage"
                        @logout="handleLogout"
                    />
                </div>
            </template>
        </t-drawer>
    </div>
</template>

<style scoped>
.drawer-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.drawer-control {
    display: flex;
    justify-content: flex-start;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    z-index: 1;
    background: inherit;
}

.drawer-scrollable {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-color: var(--td-scrollbar-color) transparent;
    scrollbar-width: thin;
}

.drawer-scrollable::-webkit-scrollbar {
    width: var(--td-size-4);
    background: transparent;
}

.drawer-scrollable::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    background-clip: content-box;
    background-color: var(--td-scrollbar-color);
    border-radius: 15px;
}

.drawer-scrollable::-webkit-scrollbar-thumb:hover {
    background-color: var(--td-scrollbar-hover-color);
}

.drawer-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.custome-drawer-container{
    position: relative;
    width: 280px;
    margin-left: 0 !important;
    transition: all 0.3s ease;
}
.custome-drawer-container.drawer-open {
    opacity: 1;
    transform: translateX(0);
}
.custome-drawer-container.drawer-closed {
    opacity: 0.7;
    transform: translateX(-10px);
    width: 0;
    overflow: hidden;
}
/* 移动端 overlay 模式 */
.custome-drawer-container.is-mobile {
    position: absolute;
    z-index: 100;
    height: 100%;
}
.custome-drawer-container.is-mobile.drawer-open {
    width: 280px;
}
.custome-drawer-container.is-mobile.drawer-closed {
    width: 0;
}
:deep(.custome-drawer .t-drawer__content-wrapper){
    box-shadow: none;
}
:deep(.t-drawer__header ){
    border-bottom: none !important;
}
:deep(.t-drawer__body) {
    padding-right: 0;
}
</style>
