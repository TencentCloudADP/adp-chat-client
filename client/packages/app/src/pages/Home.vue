<script setup lang="ts">
import { ADPChat, type ApiConfig, type Application, type ChatConversation } from 'adp-chat-component';
import { onMounted, computed, ref, watch } from 'vue'
import { useUiStore } from '@/stores/ui'
import { logout } from '@/service/login';
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n';
import { languageMap } from '@/i18n';
import { getBaseURL } from '@/utils/url';
import Logo from '@/assets/img/favicon.ico';

const router = useRouter()
const uiStore = useUiStore()
const route = useRoute()
const { t } = useI18n();

// 当前选中的应用和会话（用于 URL 同步）
const currentApplicationId = ref<string>('');
const currentConversationId = ref<string>('');

// API 配置 - 使用组件自动加载数据

const apiConfig: ApiConfig = {
    baseURL: getBaseURL(),
    timeout: 1000 * 60,
    apiDetailConfig: {
        applicationListApi: '/application/list',
        conversationListApi: '/chat/conversations',
        conversationDetailApi: '/chat/messages',
        sendMessageApi: '/chat/message',
        rateApi: '/feedback/rate',
        shareApi: '/share/create',
        userInfoApi: '/account/info',
        uploadApi: '/file/upload',
        asrUrlApi: '/helper/asr/url',
    }
};

// 语言选项
const languageOptions = computed(() => {
    return Object.entries(languageMap).map(([key, value]) => ({
        key,
        value
    }));
});

// 侧边栏国际化
const sideI18n = computed(() => ({
    more: t('common.more'),
    collapse: t('common.collapse'),
    today: t('common.today'),
    recent: t('common.recent'),
    switchTheme: t('sider.switchTheme'),
    selectLanguage: t('sider.selectLanguage'),
    logout: t('account.logout'),
}));

// 聊天国际化
const chatI18n = computed(() => ({
    loading: t('common.loading'),
    thinking: t('common.thinking'),
    checkAll: t('operation.checkAll'),
    shareFor: t('operation.shareFor'),
    copyUrl: t('operation.copyUrl'),
    cancelShare: t('operation.cancelShare'),
    sendError: t('conversation.sendError'),
    networkError: t('conversation.networkError'),
}));

// ChatItem 国际化
const chatItemI18n = computed(() => ({
    thinking: t('conversation.thinking'),
    deepThinkingFinished: t('conversation.deepThinkingFinished'),
    deepThinkingExpand: t('conversation.deepThinkingExpand'),
    copy: t('operation.copy'),
    replay: t('operation.replay'),
    share: t('operation.share'),
    good: t('operation.good'),
    bad: t('operation.bad'),
    thxForGood: t('operation.thxForGood'),
    thxForBad: t('operation.thxForBad'),
    references: t('sender.references'),
}));

// Sender 国际化
const senderI18n = computed(() => ({
    placeholder: t('conversation.input.placeholder'),
    placeholderMobile: t('conversation.input.placeholderMobile'),
    uploadImg: t('sender.uploadImg'),
    startRecord: t('sender.startRecord'),
    stopRecord: t('sender.stopRecord'),
    answering: t('sender.answering'),
    notSupport: t('sender.notSupport'),
    uploadError: t('sender.uploadError'),
    recordTooLong: t('sender.recordTooLong'),
}));

/**
 * 页面挂载时执行的生命周期钩子
 * 1. 获取用户信息
 * 2. 初始化应用列表
 * 3. 更新聊天列表
 */
onMounted(async () => {
    console.log('[onMounted]');

    // url参数 -> store
    updateFromUrl();
});

/**
 * 页面url路径、参数处理
 * 1. url参数处理应该在pages层面，不能在组件里读写url参数（组件需要通过store，或者组件参数间接使用url参数）
 * 2. url参数和store应该保持一致，优先级：url参数 > store
 */

// URL 参数处理
const updateFromUrl = () => {
    console.log('updateFromUrl',route.params)
    if (!route.params.conversationId) {
        currentApplicationId.value = route.params.applicationId as string || '';
        currentConversationId.value = '';
    } else {
        currentConversationId.value = route.params.conversationId as string;
    }
}

// 监听路由参数变化
watch(() => route.params.applicationId, () => updateFromUrl());
watch(() => route.params.conversationId, () => updateFromUrl());

// 更新 URL
const updateUrl = () => {
    if (currentConversationId.value === '') {
        if (currentApplicationId.value) {
            router.push({ name: 'app', params: { applicationId: currentApplicationId.value } });
        }
    } else {
        router.push({ name: 'home', params: { conversationId: currentConversationId.value } });
    }
}

// 事件处理函数
const handleSelectApplication = (app: Application) => {
    currentApplicationId.value = app.ApplicationId || '';
    currentConversationId.value = '';
    updateUrl();
};

const handleSelectConversation = (conversation: ChatConversation) => {
    currentConversationId.value = conversation.Id;
    currentApplicationId.value = conversation.ApplicationId;
    updateUrl();
};

const handleCreateConversation = () => {
    currentConversationId.value = '';
    updateUrl();
};

const handleToggleTheme = () => {
    const newTheme = uiStore.theme === 'light' ? 'dark' : 'light';
    uiStore.setTheme(newTheme);
};

const handleChangeLanguage = (key: string) => {
    uiStore.setLanguage(key as 'en' | 'zh');
};

const handleLogout = () => {
    logout(() => router.replace({ name: 'login' }));
};

// 数据加载完成回调
const handleDataLoaded = (type: 'applications' | 'conversations' | 'chatList' | 'user', data: any) => {
    // 初始化时从 URL 同步状态
    if (type === 'applications' && data.length > 0) {
        // 如果 URL 没有指定应用，默认选中第一个
        if (!currentApplicationId.value && !currentConversationId.value) {
            currentApplicationId.value = data[0].ApplicationId;
        }
        updateUrl();
    }
};

// 会话变化回调
const handleConversationChange = (conversationId: string) => {
    currentConversationId.value = conversationId;
    updateUrl();
};
</script>

<template>
    <ADPChat
        :apiConfig="apiConfig"
        :autoLoad="true"
        :theme="uiStore.theme || 'light'"
        :languageOptions="languageOptions"
        :isSidePanelOverlay="uiStore.isMobile"
        :showCloseButton="false"
        :showOverlayButton="false"
        :logoUrl="Logo"
        :currentApplicationId="currentApplicationId"
        :currentConversationId="currentConversationId"
        :aiWarningText="t('common.aiWarning')"
        :createConversationText="t('conversation.createConversation')"
        :sideI18n="sideI18n"
        :chatI18n="chatI18n"
        :chatItemI18n="chatItemI18n"
        :senderI18n="senderI18n"
        @selectApplication="handleSelectApplication"
        @selectConversation="handleSelectConversation"
        @createConversation="handleCreateConversation"
        @toggleTheme="handleToggleTheme"
        @changeLanguage="handleChangeLanguage"
        @logout="handleLogout"
        @dataLoaded="handleDataLoaded"
        @conversationChange="handleConversationChange"
    />
</template>

<style scoped>
</style>
