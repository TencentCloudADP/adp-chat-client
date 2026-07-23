<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Application } from '../../model/application';
import type { ChatConversation } from '../../model/chat-v2';
import ApplicationList from '../ApplicationList.vue';
import HistoryList from '../HistoryList.vue';
import PersonalAccount from '../PersonalAccount.vue';
import Settings from '../Settings.vue';
import CustomizedIcon from '../CustomizedIcon.vue';
import SideActions from './SideActions.vue';
import type { SideActionItem } from './SideActions.vue';
import SideGroupList from './SideGroupList.vue';
import type { SideGroupItem } from './SideGroupList.vue';
import RemoteTerminalList from './RemoteTerminalList.vue';
import type { RemoteTerminalItem } from './RemoteTerminalList.vue';
import { Drawer as TDrawer, Avatar as TAvatar, Tooltip as TTooltip } from 'tdesign-vue-next';
import { httpService } from '../../service/httpService';

// TDrawer, TAvatar, TTooltip 已导入，模板中使用相应组件
import type { LanguageOption, SideI18n, CommonLayoutProps, ChatMode } from '../../model/type';
import { defaultLanguageOptions, defaultSideI18n, commonLayoutPropsDefaults } from '../../model/type';

interface Props extends CommonLayoutProps {
    /** 是否显示侧边栏，默认值：isSidePanelOverlay 为 true 时为 false，否则为 true */
    visible?: boolean;
    /** 侧边栏是否使用overlay模式（覆盖内容区域） */
    isSidePanelOverlay?: boolean;
    /** 应用列表 */
    applications?: Application[];
    /** 当前选中的应用ID */
    currentApplicationId?: string;
    /** 当前选中的应用对象（用于显示头像/名称，未传时会尝试从 applications 中按 id 匹配） */
    currentApplication?: Application;
    /**
     * 外部传入的会话列表（fallback 模式使用）。
     * 当 useInternalFetch=true 时，SideLayout 会自己按 currentApplicationId 请求后端列表，
     * 此 prop 仅在初始渲染 / 未启用内部拉取时作为兜底数据源。
     */
    conversations?: ChatConversation[];
    /** 当前选中的会话ID */
    currentConversationId?: string;
    /** 正在进行中（流式请求未完成）的会话 Id 集合，透传给 HistoryList 显示 loading */
    chattingConversationIds?: string[];
    /** 用户头像URL */
    userAvatarUrl?: string;
    /** 用户头像文字 */
    userAvatarName?: string;
    /** 用户名称 */
    userName?: string;
    /** 语言选项列表 */
    languageOptions?: LanguageOption[];
    /** 最大应用显示数量 */
    maxAppLen?: number;
    /** 国际化文本 */
    i18n?: SideI18n;
    /**
     * 是否由 SideLayout 内部按 currentApplicationId 主动请求会话列表。
     * true 时会 watch currentApplicationId，切换/变更时自动拉取 conversationListApi，
     *   并将 { ApplicationId } 作为 query 参数传给后端。
     * false（默认）时保持原行为：仅渲染外部传入的 conversations。
     */
    useInternalFetch?: boolean;
    /**
     * 会话列表接口路径，仅在 useInternalFetch=true 时使用。
     * 默认 '/chat/conversations'，与 defaultApiDetailConfig.conversationListApi 保持一致。
     */
    conversationListApi?: string;
    /** 是否在会话视图中显示 SideActions 快捷入口（默认 true） */
    showSideActions?: boolean;
    /** 自定义 SideActions 按钮列表；不传则使用默认（新建任务/定时任务） */
    sideActionItems?: SideActionItem[];
    /** SideActions 当前激活的按钮 key */
    sideActionActiveKey?: string;
    /** 是否显示"定时任务"入口（sideActionItems 未传时生效，默认 true） */
    showCronTaskAction?: boolean;

    // ==== 分组列表：定时任务 / 远程终端 ====
    /** 定时任务列表数据（参考 smart-webim task-group 的定时任务分组） */
    cronTaskItems?: SideGroupItem[];
    /** 当前激活的定时任务 id */
    currentCronTaskId?: string;
    /** 是否显示"定时任务"分组（空列表且此项为 true 时会隐藏，交给 SideGroupList hideWhenEmpty） */
    showCronTaskList?: boolean;

    // -- 远程终端分组（独立封装为 RemoteTerminalList，支持折叠 / 内部拉取 / 右上角设置按钮） --
    /** 远程终端列表数据（useInternalFetch=false 时使用） */
    remoteTerminalItems?: RemoteTerminalItem[];
    /** 当前激活的远程终端 id */
    currentRemoteTerminalId?: string;
    /** 是否显示"远程终端"分组 */
    showRemoteTerminalList?: boolean;
    /** 是否显示"展开列表"入口（已弃用，改为 header actions 中管理） */
    showChannelActions?: boolean;
    /** 远程终端分组是否默认折叠 */
    remoteTerminalDefaultCollapsed?: boolean;
    /**
     * 是否由 RemoteTerminalList 内部主动请求终端列表。
     * true 时会调用 remoteTerminalListApi 并将 { spaceId } 作为 query 传给后端。
     */
    remoteTerminalUseInternalFetch?: boolean;
    /** 远程终端接口路径（仅 remoteTerminalUseInternalFetch=true 时生效） */
    remoteTerminalListApi?: string;
    /** 拉取远程终端时使用的 spaceId */
    remoteTerminalSpaceId?: string;
    /** 从远程终端接口响应到 RemoteTerminalItem[] 的适配器 */
    remoteTerminalResponseAdapter?: (raw: unknown) => RemoteTerminalItem[];
    /** 渠道设置弹窗的应用 ID（传了才会在点击远程终端设置按钮时打开内置渠道设置弹窗） */
    channelSettingAppId?: string;
    /** 渠道设置弹窗：C 端归属用户 ID */
    channelSettingUserId?: string;
    /** 渠道设置弹窗：C 端 claw agent 运行态 ID */
    channelSettingAgentId?: string;
    /**
     * 聊天模式（由父层 Index.vue 统一推导后透传）：
     * - 'claw'：显示 SideActions（新建任务/定时任务入口）、RemoteTerminalList、SideGroupList（定时任务分组）
     * - 'standard' 或未传：隐藏上述三块
     * 语义与 Index.vue 内的 `chatMode` 计算属性一致，避免子组件再自己按 Pattern 推导。
     */
    chatMode?: ChatMode;
}

const props = withDefaults(defineProps<Props>(), {
    ...commonLayoutPropsDefaults,
    visible: undefined,
    isSidePanelOverlay: true,
    applications: () => [],
    currentApplicationId: '',
    currentApplication: undefined,
    conversations: () => [],
    currentConversationId: '',
    chattingConversationIds: () => [],
    userAvatarUrl: '',
    userAvatarName: '',
    userName: '',
    languageOptions: () => defaultLanguageOptions,
    maxAppLen: 4,
    i18n: () => ({}),
    useInternalFetch: false,
    conversationListApi: '/chat/conversations',
    showSideActions: true,
    sideActionItems: undefined,
    sideActionActiveKey: '',
    showCronTaskAction: true,
    cronTaskItems: () => [],
    currentCronTaskId: '',
    showCronTaskList: true,
    remoteTerminalItems: () => [],
    currentRemoteTerminalId: '',
    showRemoteTerminalList: true,
    showChannelActions: false,
    remoteTerminalDefaultCollapsed: false,
    remoteTerminalUseInternalFetch: true,
    remoteTerminalListApi: '',
    remoteTerminalSpaceId: '',
    remoteTerminalResponseAdapter: undefined,
    channelSettingAppId: '',
    channelSettingUserId: '',
    channelSettingAgentId: '',
    chatMode: 'standard',
});

// 合并默认值和传入值
const i18n = computed(() => ({
    ...defaultSideI18n,
    ...props.i18n
}));

/** 渠道设置弹窗的 applicationId：优先取显式传入的 channelSettingAppId，否则 fallback 到 currentApplicationId */
const resolvedChannelSettingAppId = computed(() => {
    return props.channelSettingAppId || props.currentApplicationId || '';
});

// visible 的实际值：如果传入了 visible 则使用传入值，否则根据 isSidePanelOverlay 决定
const actualVisible = computed(() => {
    if (props.visible !== undefined) {
        return props.visible;
    }
    // isSidePanelOverlay 为 true 时默认不显示，否则默认显示
    return !props.isSidePanelOverlay;
});

const emit = defineEmits<{
    (e: 'toggleSidebar'): void;
    (e: 'selectApplication', app: Application): void;
    (e: 'selectConversation', conversation: ChatConversation): void;
    (e: 'deleteConversation', conversation: ChatConversation): void;
    (e: 'toggleTheme'): void;
    (e: 'changeLanguage', key: string): void;
    (e: 'logout'): void;
    (e: 'userClick'): void;
    /** 用户点"切换应用"按钮：可用于父层清空当前会话等；不强制处理 */
    (e: 'switchApplication'): void;
    /** 内部会话列表发生变化时抛出（拉取完成 / 乐观增删 / 替换 / 回滚 均触发） */
    (e: 'conversationsChange', list: ChatConversation[]): void;
    /** 内部拉取成功后抛出（区分乐观 UI 变更） */
    (e: 'conversationsLoaded', list: ChatConversation[]): void;
    /** 内部拉取失败 */
    (e: 'fetchError', error: unknown): void;
    /** 点击 SideActions 快捷入口（如 new-task / cron-task） */
    (e: 'sideAction', key: string, item: SideActionItem): void;
    /** 选中定时任务列表项 */
    (e: 'selectCronTask', item: SideGroupItem): void;
    /** 选中远程终端列表项 */
    (e: 'selectRemoteTerminal', item: RemoteTerminalItem): void;
    /** 点击"远程终端"分组标题右侧的设置入口（如渠道设置） */
    (e: 'remoteTerminalSetting'): void;
    /** 远程终端内部拉取完成（remoteTerminalUseInternalFetch=true 时触发） */
    (e: 'remoteTerminalLoaded', items: RemoteTerminalItem[]): void;
}>();

const mode = computed(() => props.isSidePanelOverlay  ? 'overlay' : 'push');
const drawerSize = '260px';

/**
 * 侧边栏内部视图模式：
 * - 'application'：显示应用列表（初始态 / 用户点"切换应用"）
 * - 'conversation'：显示"当前应用条 + 会话列表"
 * 当外部选中了应用（currentApplicationId 有值）时自动进入 conversation；
 * 用户点"切换应用"按钮 → 回到 application 视图（此时不清空 currentApplicationId，仅是 UI 层展开选择）。
 */
const viewMode = ref<'application' | 'conversation'>(
    props.currentApplicationId ? 'conversation' : 'application'
);

watch(
    () => props.currentApplicationId,
    (newId, oldId) => {
        if (newId && !oldId) {
            viewMode.value = 'conversation';
            return;
        }
        if (!newId && oldId) {
            viewMode.value = 'application';
            return;
        }
        if (newId && oldId && newId !== oldId) {
            viewMode.value = 'conversation';
        }
    }
);

/** 当前应用对象（优先用 prop 传入的，否则按 id 从列表中匹配） */
const displayCurrentApplication = computed<Application | undefined>(() => {
    if (props.currentApplication) return props.currentApplication;
    if (!props.currentApplicationId) return undefined;
    return props.applications.find(a => a.ApplicationId === props.currentApplicationId);
});

/**
 * 当前是否为 Claw 模式。
 * 直接采用父层 Index.vue 透传的 chatMode（其已按 props.mode / 当前应用 Pattern 综合推导），
 * 保持全局一致；子组件不再独立推导 Pattern，避免"Index 内一套、SideLayout 内另一套"的分裂。
 * 仅 claw 模式下才展示：SideActions（新建任务/定时任务入口）、
 * RemoteTerminalList（远程终端分组）、SideGroupList（定时任务分组）。
 */
const isClawApplication = computed<boolean>(() => props.chatMode === 'claw');

/**
 * 内部会话列表（权威源）：
 * - useInternalFetch=true 时，由 watch(currentApplicationId) 触发 fetchList() 填充
 * - 支持通过 defineExpose 暴露的 addOptimistic / replaceConversation / removeConversation /
 *   rollback / reload 由父组件在 SSE 事件、删除操作等场景反向调用维护乐观 UI
 */
const internalList = ref<ChatConversation[]>([]);

/**
 * 最终展示的会话列表：
 * - useInternalFetch=true：使用 internalList；再兜底按 currentApplicationId 过滤一次
 *   （防御性：若后端未按 appId 过滤返回全量，前端仍收敛到当前应用；但对老数据无 ApplicationId 字段场景保留原列表）
 * - useInternalFetch=false：沿用原行为，直接使用外部传入 conversations（不做 appId 过滤，保持向后兼容）
 */
const displayConversations = computed<ChatConversation[]>(() => {
    if (!props.useInternalFetch) {
        return props.conversations;
    }
    if (!props.currentApplicationId) return [];
    const hasApplicationIdField = internalList.value.some(c => !!c.ApplicationId);
    if (!hasApplicationIdField) return internalList.value;
    return internalList.value.filter(
        c =>
            c.ApplicationId === props.currentApplicationId
            // 兼容乐观占位：pending-conversation:* 前缀的项不带 ApplicationId 或与当前 app 匹配，也保留
            || c.Id?.startsWith?.('pending-conversation:')
    );
});

/** 触发 conversationsChange emit 的统一入口 */
const setInternalList = (list: ChatConversation[]) => {
    internalList.value = list;
    emit('conversationsChange', list);
};

/** 拉取状态 */
const isFetching = ref(false);
/**
 * 用于防止并发拉取时旧请求覆盖新请求结果：
 * 每发起一次请求就 +1，返回时若与最新 token 不匹配则丢弃结果
 */
let fetchToken = 0;

/** 按当前 appId 请求会话列表 */
const fetchList = async () => {
    if (!props.useInternalFetch) return;
    if (!props.currentApplicationId) {
        // 切到未选应用状态，清空本地缓存避免残留
        setInternalList([]);
        return;
    }
    const currentToken = ++fetchToken;
    isFetching.value = true;
    try {
        // 后端参数名未定：先按 ApplicationId 作为 query 传，后端接不到就返回全量或空
        // 前端 displayConversations 还会做一次防御性过滤，最终展示仍是当前 app 的会话
        const data: ChatConversation[] = await httpService.get(
            props.conversationListApi,
            { ApplicationId: props.currentApplicationId }
        );
        if (currentToken !== fetchToken) return; // 有更新的请求已发起，丢弃本次结果
        const list = Array.isArray(data) ? data : [];
        // 保留仍在流式中的乐观占位（pending-conversation:*），拉取结果不覆盖它们
        const backendIds = new Set(list.map(c => c.Id));
        const activePendings = internalList.value.filter(
            c => c.Id?.startsWith?.('pending-conversation:') && !backendIds.has(c.Id)
        );
        const next = activePendings.length > 0 ? [...activePendings, ...list] : list;
        setInternalList(next);
        emit('conversationsLoaded', list);
    } catch (error) {
        if (currentToken !== fetchToken) return;
        emit('fetchError', error);
    } finally {
        if (currentToken === fetchToken) {
            isFetching.value = false;
        }
    }
};

/**
 * watch currentApplicationId 变化 → 重拉列表
 * immediate：初次挂载时也拉一次（若已有 currentApplicationId）
 */
watch(
    () => props.currentApplicationId,
    (newId, oldId) => {
        if (!props.useInternalFetch) return;
        if (newId === oldId) return;
        // 切应用时先清空本地列表，避免闪一下旧应用的会话
        internalList.value = [];
        fetchList();
    },
    { immediate: true }
);

/**
 * 若 useInternalFetch 从 false 变为 true，也补一次拉取
 */
watch(
    () => props.useInternalFetch,
    (enabled) => {
        if (enabled && props.currentApplicationId) {
            fetchList();
        }
    }
);

const handleSelectApplication = (app: Application) => {
    // 选中应用后自动切到会话视图（watch 也会兜底）
    viewMode.value = 'conversation';
    emit('selectApplication', app);
};

/** 点"切换应用"按钮：展开应用选择列表 */
const handleSwitchApplication = () => {
    viewMode.value = 'application';
    emit('switchApplication');
};

const handleSelectConversation = (conversation: ChatConversation) => {
    emit('selectConversation', conversation);
};

const handleDeleteConversation = (conversation: ChatConversation) => {
    emit('deleteConversation', conversation);
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

/** SideActions 快捷入口点击：透传给父层，key 由 SideActions 内部定义 */
const handleSideAction = (key: string, item: SideActionItem) => {
    emit('sideAction', key, item);
};

/** 选中一个定时任务：透传给父层 */
const handleSelectCronTask = (item: SideGroupItem) => {
    emit('selectCronTask', item);
};

/** 选中一个远程终端：透传给父层 */
const handleSelectRemoteTerminal = (item: RemoteTerminalItem) => {
    emit('selectRemoteTerminal', item);
};

/** 远程终端分组「渠道设置」入口点击 */
const handleRemoteTerminalSetting = () => {
    emit('remoteTerminalSetting');
};

/** 远程终端组件 ref，便于父层通过 defineExpose 反向调用 reload() */
const remoteTerminalRef = ref<InstanceType<typeof RemoteTerminalList> | null>(null);

/** 远程终端内部拉取完成回调 */
const handleRemoteTerminalLoaded = (items: RemoteTerminalItem[]) => {
    emit('remoteTerminalLoaded', items);
};

/** 触发远程终端列表刷新（父层通过 defineExpose 调用） */
const reloadRemoteTerminals = () => {
    remoteTerminalRef.value?.reload?.();
};

/* -------------------------------------------------------------------------
 * 对外暴露的乐观 UI 操作方法
 * 由父组件（Index.vue）在 SSE 事件 / 删除会话等场景反向调用，
 * 使 SideLayout 内部 internalList 与 Index.vue 中业务判断保持一致。
 * 只在 useInternalFetch=true 时才起作用；非该模式下这些方法是 no-op。
 * ------------------------------------------------------------------------- */

/** 将一条乐观占位插入列表顶部（幂等：Id 已存在则不重复插入） */
const addOptimistic = (conv: ChatConversation) => {
    if (!props.useInternalFetch) return;
    if (!conv?.Id) return;
    if (internalList.value.some(c => c.Id === conv.Id)) return;
    setInternalList([conv, ...internalList.value]);
};

/** 将 oldId 的占位就地替换为 newConv（Id 不存在则跳过，不做插入） */
const replaceConversation = (oldId: string, newConv: ChatConversation) => {
    if (!props.useInternalFetch) return;
    const idx = internalList.value.findIndex(c => c.Id === oldId);
    if (idx === -1) return;
    const next = [...internalList.value];
    next.splice(idx, 1, newConv);
    setInternalList(next);
};

/** 从列表中移除指定 Id（不存在则跳过） */
const removeConversation = (id: string) => {
    if (!props.useInternalFetch) return;
    if (!id) return;
    const next = internalList.value.filter(c => c.Id !== id);
    if (next.length === internalList.value.length) return;
    setInternalList(next);
};

/** 用给定列表覆盖内部列表（用于删除失败回滚等场景） */
const rollback = (list: ChatConversation[]) => {
    if (!props.useInternalFetch) return;
    setInternalList(Array.isArray(list) ? [...list] : []);
};

/** 强制重新按当前 appId 拉取列表 */
const reload = () => {
    return fetchList();
};

/** 只读获取当前内部列表（便于父组件回滚时保存快照） */
const snapshot = (): ChatConversation[] => internalList.value.slice();

defineExpose({
    addOptimistic,
    replaceConversation,
    removeConversation,
    rollback,
    reload,
    snapshot,
    /** 手动刷新远程终端列表（用于渠道设置回调等场景） */
    reloadRemoteTerminals,
});
</script>

<template>
    <div class="custome-drawer-container" :class="{ 'drawer-open': actualVisible, 'drawer-closed': !actualVisible, 'is-mobile': isSidePanelOverlay }">
        <TDrawer 
            drawerClassName="custome-drawer" 
            :size="drawerSize" 
            :visible="actualVisible" 
            placement="left" 
            :mode="mode"
            :show-overlay="true"
            show-in-attached-element
        >
            <div class="drawer-content">
                <div class="drawer-scrollable">
                    <!-- 应用选择视图：初次进入 or 用户点"切换应用" -->
                    <ApplicationList
                        v-if="viewMode === 'application'"
                        :applications="applications"
                        :currentApplicationId="currentApplicationId"
                        :maxAppLen="maxAppLen"
                        :moreText="i18n.more"
                        :collapseText="i18n.collapse"
                        :theme="theme"
                        @select="handleSelectApplication"
                    />
                    <!-- 会话视图：显示当前应用条 + 会话列表 -->
                    <template v-else>
                        <div v-if="displayCurrentApplication" class="current-application">
                            <TAvatar
                                :imageProps="{ lazy: true, loading: '' }"
                                :image="displayCurrentApplication.Avatar"
                                size="20px"
                                class="current-application__avatar"
                            />
                            <span class="current-application__name" :title="displayCurrentApplication.Name">
                                {{ displayCurrentApplication.Name }}
                            </span>
                            <TTooltip :content="i18n.switchApplication" destroyOnClose showArrow theme="default">
                                <span class="current-application__switch" @click="handleSwitchApplication">
                                    <CustomizedIcon remote name="basic_grid_view_line" size="xs" :showHoverBg="false" :theme="theme" />
                                </span>
                            </TTooltip>
                        </div>
                        <!-- 快捷入口：新建任务 / 定时任务，参考 smart-webim/conversation-list 顶部两个 new-task-btn -->
                        <SideActions
                            v-if="showSideActions && isClawApplication"
                            :items="sideActionItems"
                            :active-key="sideActionActiveKey"
                            :show-cron-task="showCronTaskAction"
                            :show-channel-list="showChannelActions"
                            :i18n="i18n"
                            :theme="theme"
                            class="side-actions-slot"
                            @action="handleSideAction"
                        />
                        <!--
                          分组列表区，UI 结构参考 HistoryList、内容结构参考 smart-webim task-group：
                          1. 远程终端分组
                          2. 定时任务分组
                          3. 最近任务分组（即原 HistoryList）
                        -->
                        <!-- 远程终端：独立封装组件，自带折叠 / 右侧设置按钮 / 空态占位 / 可选内部拉取 -->
                        <RemoteTerminalList
                            v-if="showRemoteTerminalList && isClawApplication"
                            ref="remoteTerminalRef"
                            :title="i18n.remoteTerminal || '远程终端'"
                            :items="remoteTerminalItems"
                            :active-id="currentRemoteTerminalId"
                            :empty-text="i18n.remoteTerminalEmpty || '暂无远程终端'"
                            :default-collapsed="remoteTerminalDefaultCollapsed"
                            :setting-tip="i18n.remoteTerminalSetting || '渠道设置'"
                            :use-internal-fetch="remoteTerminalUseInternalFetch"
                            :channel-list-api="remoteTerminalListApi"
                            :space-id="remoteTerminalSpaceId"
                            :response-adapter="remoteTerminalResponseAdapter"
                            :channel-setting-app-id="resolvedChannelSettingAppId"
                            :channel-setting-user-id="channelSettingUserId"
                            :channel-setting-agent-id="channelSettingAgentId"
                            :theme="theme"
                            @select="handleSelectRemoteTerminal"
                            @setting="handleRemoteTerminalSetting"
                            @loaded="handleRemoteTerminalLoaded"
                        />
                        <SideGroupList
                            v-if="showCronTaskList && isClawApplication"
                            :title="i18n.cronTask || '定时任务'"
                            :items="cronTaskItems"
                            :active-id="currentCronTaskId"
                            :theme="theme"
                            @select="handleSelectCronTask"
                        />
                        <HistoryList
                            :conversations="displayConversations"
                            :currentConversationId="currentConversationId"
                            :chattingConversationIds="chattingConversationIds"
                            :todayText="i18n.today"
                            :recentText="i18n.recent"
                            @select="handleSelectConversation"
                            @delete="handleDeleteConversation"
                        />
                    </template>
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
                        :isMobile="isMobile"
                        @toggleTheme="handleToggleTheme"
                        @changeLanguage="handleChangeLanguage"
                        @logout="handleLogout"
                    />
                </div>
            </template>
        </TDrawer>
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
    padding-right: var(--td-size-4);
    padding-left: 4px;
}

/* 当前应用条：显示 avatar + 名称 + 切换应用按钮，风格对齐 ApplicationList 的选中项 */
.current-application {
    display: flex;
    align-items: center;
    height: var(--td-comp-size-xl);
    padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-s);
    border-radius: var(--td-radius-medium);
    color: var(--td-text-color-primary);
    font-size: var(--td-font-size-body-medium);
    margin-bottom: var(--td-comp-margin-xs);
}

.current-application__avatar {
    margin-right: var(--td-comp-margin-xs);
    flex-shrink: 0;
}

.current-application__name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: var(--td-font-weight-medium, 500);
}

.current-application__switch {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--td-comp-size-s);
    height: var(--td-comp-size-s);
    border-radius: var(--td-radius-medium);
    cursor: pointer;
    color: var(--td-text-color-secondary);
    transition: all 0.2s;
    flex-shrink: 0;
    margin-left: var(--td-comp-margin-xs);
}

.current-application__switch:hover {
    color: var(--td-brand-color);
    background: var(--td-bg-color-container-hover);
}

/* 快捷入口容器：与上方"当前应用条"、下方 HistoryList 保持视觉呼吸 */
.side-actions-slot {
    margin-bottom: var(--td-comp-margin-s, 8px);
}

.drawer-scrollable::-webkit-scrollbar {
    width: 6px;
    background: transparent;
}

.drawer-scrollable::-webkit-scrollbar-thumb {
    border: 1.5px solid transparent;
    background-clip: content-box;
    background-color: var(--td-scrollbar-color);
    border-radius: var(--td-radius-round);
}

.drawer-scrollable::-webkit-scrollbar-thumb:hover {
    background-color: var(--td-scrollbar-hover-color);
}

.drawer-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--td-size-4);
    border-top: 1px solid var(--td-component-stroke);
}

.custome-drawer-container{
    position: relative;
    width: 260px;
    margin-left: 0 !important;
    flex-shrink: 0;
    transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
}
.custome-drawer-container.is-mobile {
    margin-left: 0 !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.custome-drawer-container.drawer-open {
    opacity: 1;
    transform: translateX(0);
}
.custome-drawer-container.drawer-closed {
    opacity: 0;
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
    width: 260px;
}
.custome-drawer-container.is-mobile.drawer-closed {
    width: 0;
}
:deep(.custome-drawer .t-drawer__content-wrapper){
    box-shadow: none;
    background-color: var(--td-bg-color-page);
    border-right: 1px solid var(--td-component-stroke);
}
:deep(.t-drawer__header ){
    border-bottom: none !important;
    padding-bottom: var(--td-size-2);
}
:deep(.t-drawer__body) {
    padding-right: 0;
}
:deep(.t-drawer__content-wrapper){
    width: 100% !important;
}
:deep(.t-drawer__footer) {
    background: var(--td-bg-color-page) !important;
}
</style>
