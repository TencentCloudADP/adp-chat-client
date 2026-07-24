<script setup lang="ts">
import { ADPChat, type ApiConfig, type Application, type ChatConversation } from 'adp-chat-component';
import { onMounted, computed, ref, watch } from 'vue'
import { useUiStore } from '@/stores/ui'
import { logout } from '@/service/login';
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n';
import { languageMap } from '@/i18n';
import { getBaseURL } from '@/utils/url';
import Logo from '@/assets/img/favicon.png';

const router = useRouter()
const uiStore = useUiStore()
const route = useRoute()
const { t } = useI18n();

// 当前选中的应用和会话（用于 URL 同步）
const currentApplicationId = ref<string>('');
const currentConversationId = ref<string>('');
// 当前会话是否为渠道（访客）会话：由 URL 中是否包含 /channel/ 段判定。
// 渠道会话不落地本地 chat_conversation 表（权威源在 CAPI DescribeConversationList），
// 通过该 flag 传给 ADPChat，让其直接走「渠道恢复」流程，避免走普通 /chat/messages 导致 404。
const currentConversationChannel = ref<boolean>(false);

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
        systemConfigApi: '/system/config',
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
    uploading: t('common.uploading'),
    loading: t('common.loading'),
    thinking: t('common.thinking'),
    checkAll: t('operation.checkAll'),
    shareFor: t('operation.shareFor'),
    copyUrl: t('operation.copyUrl'),
    cancelShare: t('operation.cancelShare'),
    sendError: t('conversation.sendError'),
    networkError: t('conversation.networkError'),
    loginExpired: t('conversation.loginExpired'),
    createConversation: t('conversation.createConversation'),
    copySuccess: t('common.copySuccess'),
    copyFailed: t('common.copyFailed'),
    shareFailed: t('common.shareFailed'),
    rateFailed: t('common.rateFailed'),
    loadMoreFailed: t('common.loadMoreFailed'),
    getAppListFailed: t('common.getAppListFailed'),
    getConversationListFailed: t('common.getConversationListFailed'),
    getConversationDetailFailed: t('common.getConversationDetailFailed'),
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
    asrServiceFailed: t('sender.asrServiceFailed'),
    recordFailed: t('sender.recordFailed'),
    chromeSecurityError: t('sender.chromeSecurityError'),
    browserNotSupport: t('sender.browserNotSupport'),
    audioContextNotSupport: t('sender.audioContextNotSupport'),
    webAudioApiNotSupport: t('sender.webAudioApiNotSupport'),
    mediaStreamSourceNotSupport: t('sender.mediaStreamSourceNotSupport'),
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

// URL 参数处理：
//   普通会话：/:applicationId?/:conversationId?
//   渠道会话：/:applicationId/channel/:conversationId  （route.name === 'home-channel'）
const updateFromUrl = () => {
    console.log('updateFromUrl', route.name, route.params);
    currentApplicationId.value = (route.params.applicationId as string) || '';
    currentConversationId.value = (route.params.conversationId as string) || '';
    currentConversationChannel.value = route.name === 'home-channel';
};

// 监听路由参数变化
watch(() => route.params.applicationId, () => updateFromUrl());
watch(() => route.params.conversationId, () => updateFromUrl());
// 路由名变化（普通 <-> 渠道）也要重新同步 flag
watch(() => route.name, () => updateFromUrl());

// 更新 URL
// fromChannel=true 时使用 home-channel 路由（/:appId/channel/:convId），保留刷新可复原能力
const updateUrl = (fromChannel = false) => {
    // 会话 id 必须依附在某个 applicationId 之下，避免出现无 app 的孤儿会话 URL
    const params: Record<string, string> = {};
    if (currentApplicationId.value) {
        params.applicationId = currentApplicationId.value;
        if (currentConversationId.value) {
            params.conversationId = currentConversationId.value;
        }
    }
    // 渠道会话必须有 conversationId 才能走 home-channel 路由；否则回退到 home
    const routeName = fromChannel && params.conversationId ? 'home-channel' : 'home';
    router.push({ name: routeName, params });
};

// 事件处理函数
const handleSelectApplication = (app: Application) => {
    currentApplicationId.value = app.ApplicationId || '';
    currentConversationId.value = '';
    currentConversationChannel.value = false;
    updateUrl();
};

/**
 * 选中会话（普通 / 渠道）
 * Index.vue 内部 emit 时会带 fromChannel 标识：渠道会话使用 home-channel 路由，
 * 这样刷新后能通过 URL 直接判定为渠道会话，走渠道恢复流程。
 */
const handleSelectConversation = (conversation: ChatConversation, fromChannel = false) => {
    currentConversationId.value = conversation.Id;
    currentApplicationId.value = conversation.ApplicationId;
    currentConversationChannel.value = !!fromChannel;
    updateUrl(fromChannel);
};

const handleCreateConversation = () => {
    currentConversationId.value = '';
    currentConversationChannel.value = false;
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

// 会话变化回调（由 Chat 组件内部 watch(chatId) 触发，用于新建会话后同步 URL）
// 注意：不要重置 currentConversationChannel —— 点击渠道会话时，selectConversation 已把
// channel flag 设为 true 并 push 到 home-channel 路由；随后 Chat 组件 chatId prop 变化
// 会再次触发本回调，若这里不带 fromChannel 调用 updateUrl，会立刻把 URL 覆盖回普通路径，
// 导致渠道会话选中后 URL 缺少 /channel/ 段、刷新掉会话 404。
const handleConversationChange = (conversationId: string) => {
    // 相同 id 无需重复 push（大部分场景就是同一次点击带来的回声，跳过避免覆盖）
    if (conversationId === currentConversationId.value) return;
    currentConversationId.value = conversationId;
    // 由外部（selectConversation / createConversation）的显式回调负责调整 channel flag，
    // 这里保持现状，用当前 flag 更新 URL。
    updateUrl(currentConversationChannel.value);
};
</script>

<template>
    <ADPChat
        :apiConfig="apiConfig"
        :autoLoad="true"
        :theme="uiStore.theme || 'light'"
        :language="uiStore.language || 'zh'"
        :languageOptions="languageOptions"
        :isSidePanelOverlay="uiStore.isMobile"
        :showCloseButton="false"
        :showOverlayButton="false"
        :logoUrl="Logo"
        :currentApplicationId="currentApplicationId"
        :currentConversationId="currentConversationId"
        :currentConversationChannel="currentConversationChannel"
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
