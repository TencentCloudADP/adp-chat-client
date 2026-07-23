<!--
  远程终端列表
  @description
    专门用于侧边栏的"远程终端"分组，独立于通用 SideGroupList：
      1. 支持内部拉取渠道列表（useInternalFetch=true）—— 对齐 SideLayout 的 conversationListApi 用法
      2. 支持折叠 / 展开
      3. 标题右侧带「设置」按钮（始终显示，点击打开渠道设置弹窗）
      4. 空态占位（"暂无远程终端"），空数据也保留标题与设置入口
      5. UI 风格参考 HistoryList.vue（分组标题小号灰字 + 列表项 hover / active 态）
    交互结构参考：smart-webim/src/pages/assist-chat/component/conversation-list.vue 中的
    task-group 用法与 fetchChannelList / handleChannelSetting 行为
-->
<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import CustomizedIcon from '../CustomizedIcon.vue';
import ChannelSettingsDialog from '../Channel/ChannelSettingsDialog.vue';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
import type { ChannelApiConfig } from '../../service/channelApi';
import { describeChannelList, type ChannelItem } from '../../service/channelApi';
import type { ChannelSettingsI18n } from '../../model/channel';
import { CHANNEL_ICON_MAP, CHANNEL_NAME_KEYS, ClawChannelStatus } from '../../model/channel';

/** 远程终端项数据结构 */
export interface RemoteTerminalItem {
    /** 唯一 id（对应后端 channel_id） */
    id: string;
    /** 显示名称 */
    label: string;
    /**
     * 前置图标（可选）。默认按远程图标库解析（CustomizedIcon remote）。
     * 若某类渠道用本地图标，可将 iconRemote=false 一并传入。
     */
    icon?: string;
    /** 是否远程图标，默认 true */
    iconRemote?: boolean;
    /** 附加字段（如原始 channel_type、update_time 等），透传给上层事件 */
    raw?: Record<string, any>;
    /** 禁用点击（如未完成配置的占位） */
    disabled?: boolean;
}

interface Props extends ThemeProps {
    /** 分组标题，默认「远程终端」 */
    title?: string;
    /**
     * 外部传入的终端列表（兜底数据源）。
     * - useInternalFetch=false（默认）：直接渲染这个列表
     * - useInternalFetch=true：以内部拉取结果为准，仅作为初始渲染兜底
     */
    items?: RemoteTerminalItem[];
    /** 当前激活的终端 id */
    activeId?: string;
    /** 空态占位文案 */
    emptyText?: string;

    /**
     * 是否由本组件主动请求终端列表。
     * true 时会调用 channelListApi，并将 { spaceId } 作为 query 传给后端。
     * 默认 false —— 保持"父层灌数据"的用法。
     */
    useInternalFetch?: boolean;
    /** 拉取渠道列表的接口路径（仅 useInternalFetch=true 时生效） */
    channelListApi?: string;
    /** 拉接口时的 spaceId 参数（仅 useInternalFetch=true 时生效） */
    spaceId?: string;
    /**
     * 从接口原始响应到 RemoteTerminalItem[] 的适配器。
     * 因不同后端 schema 不同（有的返回 { channels: [...] }，字段命名也可能差异），
     * 由父层显式给出映射，避免组件内部硬编码耦合业务字段。
     */
    responseAdapter?: (raw: unknown) => RemoteTerminalItem[];

    /** 是否默认折叠 */
    defaultCollapsed?: boolean;
    /** 是否显示右侧「设置」按钮（默认显示） */
    showSetting?: boolean;
    /** 设置按钮 tooltip 文案 */
    settingTip?: string;
    /** 设置按钮图标名（默认 basic_setting_line） */
    settingIcon?: string;

    // ---- 渠道设置弹窗相关 ----
    /** 应用 ID（渠道设置弹窗的 ApplicationId，传了才会在点设置按钮时弹出渠道设置弹窗） */
    channelSettingAppId?: string;
    /** C 端 claw 模式：归属用户 ID */
    channelSettingUserId?: string;
    /** C 端 claw 模式：agent 运行态 ID */
    channelSettingAgentId?: string;
    /** 渠道 API 配置覆盖 */
    channelApiConfig?: ChannelApiConfig;
    /** 渠道设置弹窗 i18n 覆盖 */
    channelSettingsI18n?: Partial<ChannelSettingsI18n>;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    title: '远程终端',
    items: () => [],
    activeId: '',
    emptyText: '暂无远程终端',
    useInternalFetch: false,
    channelListApi: '',
    spaceId: '',
    responseAdapter: undefined,
    defaultCollapsed: false,
    showSetting: true,
    settingTip: '渠道设置',
    settingIcon: 'basic_setting_line',
    channelSettingAppId: '',
    channelSettingUserId: '',
    channelSettingAgentId: '',
    channelApiConfig: () => ({}),
    channelSettingsI18n: () => ({}),
});

const emit = defineEmits<{
    /** 选中一个远程终端 */
    (e: 'select', item: RemoteTerminalItem): void;
    /** 点击「设置」按钮 */
    (e: 'setting'): void;
    /** 折叠状态变更 */
    (e: 'toggleCollapse', collapsed: boolean): void;
    /** 内部拉取成功回调（父层可基于此做副作用） */
    (e: 'loaded', items: RemoteTerminalItem[]): void;
    /** 内部拉取失败回调 */
    (e: 'loadError', err: unknown): void;
}>();

// ---------------- 内部状态 ----------------

/** 折叠状态：受控于 defaultCollapsed 初值，之后由自身维护，并通过 emit 通知父层 */
const collapsed = ref(props.defaultCollapsed);

/** 渠道设置弹窗可见性 */
const channelSettingsVisible = ref(false);

/** 内部拉取到的列表（仅 useInternalFetch=true 时有值） */
const internalList = ref<RemoteTerminalItem[]>([]);

/** 拉取中标志，避免并发 */
const loading = ref(false);

/** 最终展示的列表 */
const displayItems = computed<RemoteTerminalItem[]>(() => {
    if (props.useInternalFetch) return internalList.value;
    return props.items || [];
});

// ---------------- 内部拉取 ----------------

/**
 * 通过 DescribeChannelList 接口拉取已绑定的远程终端列表。
 * 仅当 useInternalFetch=true 且 channelSettingAppId 存在时执行。
 * 只展示已连接成功的渠道（connectStatus === SUCCESS），对齐 webim 的 terminalFieldMap 行为。
 */
const fetchList = async () => {
    if (!props.useInternalFetch) return;
    if (!props.channelSettingAppId) return;
    if (loading.value) return;
    loading.value = true;
    try {
        const res = await describeChannelList(
            { applicationId: props.channelSettingAppId, pageSize: 100 },
        );
        // 只展示已连接的渠道
        const items: RemoteTerminalItem[] = res.channelList
            .filter((ch: ChannelItem) => ch.connectStatus === ClawChannelStatus.SUCCESS)
            .map((ch: ChannelItem) => {
                const iconUrl = CHANNEL_ICON_MAP[ch.channelType] || '';
                return {
                    id: String(ch.channelId),
                    label: ch.channelName,
                    icon: iconUrl,
                    iconRemote: false,  // 使用本地图片，非 iconfont
                    raw: { ...ch, channelType: ch.channelType },
                } as RemoteTerminalItem;
            });
        internalList.value = items;
        emit('loaded', items);
    } catch (err) {
        emit('loadError', err);
        console.error('[RemoteTerminalList] fetchList error:', err);
    } finally {
        loading.value = false;
    }
};

/**
 * 绑定成功后的延迟刷新：
 * 后端"新增/更新渠道"接口返回成功时，数据尚未完全同步到查询接口
 * （典型征兆：立即拉 DescribeChannelList 会返回带重复条目的脏数据）。
 * 因此这里加 1s 延迟兜底；同时用 refreshTimer 做防抖，避免用户快速连续绑定 /
 * ChannelSettingsDialog 多次 emit('refreshed') 时产生并发拉取。
 */
const REFRESH_DELAY_AFTER_BIND = 1000;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

const refreshAfterBind = () => {
    if (refreshTimer) {
        clearTimeout(refreshTimer);
    }
    refreshTimer = setTimeout(() => {
        refreshTimer = null;
        fetchList();
    }, REFRESH_DELAY_AFTER_BIND);
};

// 首次挂载 + channelSettingAppId 变化时自动拉取
onMounted(() => {
    if (props.useInternalFetch && props.channelSettingAppId) fetchList();
});

onBeforeUnmount(() => {
    if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
    }
});
watch(
    () => [props.useInternalFetch, props.channelSettingAppId],
    ([enabledNew], [enabledOld]) => {
        if (props.useInternalFetch && props.channelSettingAppId) fetchList();
        else if (enabledOld && !enabledNew) internalList.value = [];
    }
);

// ---------------- 事件处理 ----------------

const toggleCollapse = () => {
    collapsed.value = !collapsed.value;
    emit('toggleCollapse', collapsed.value);
};

const handleSelect = (item: RemoteTerminalItem) => {
    if (item.disabled) return;
    emit('select', item);
};

const handleSetting = (event: Event) => {
    event.stopPropagation();
    channelSettingsVisible.value = true;
    emit('setting');
};

// ---------------- 暴露给父层 ----------------

defineExpose({
    /** 手动刷新（如设置渠道后回调） */
    reload: fetchList,
    /** 展开 */
    expand: () => {
        if (!collapsed.value) return;
        collapsed.value = false;
        emit('toggleCollapse', false);
    },
    /** 折叠 */
    collapse: () => {
        if (collapsed.value) return;
        collapsed.value = true;
        emit('toggleCollapse', true);
    },
});
</script>

<template>
    <div class="remote-terminal-list">
        <!-- 头部：折叠 caret + 标题 + 设置按钮 -->
        <div
            class="rt-header"
            :class="{ collapsed }"
            role="button"
            tabindex="0"
            @click="toggleCollapse"
            @keydown.enter.prevent="toggleCollapse"
            @keydown.space.prevent="toggleCollapse"
        >
            <!-- <CustomizedIcon
                name="arrow_line_expand"
                remote
                size="xs"
                :theme="theme"
                :show-hover-bg="false"
                class="rt-header__caret"
            /> -->
            <span class="rt-header__title">{{ title }}</span>
            <span
                v-if="showSetting"
                class="rt-header__setting"
                :title="settingTip"
                role="button"
                tabindex="0"
                @click="handleSetting"
                @keydown.enter.stop.prevent="handleSetting($event)"
            >
                <CustomizedIcon
                    :name="settingIcon"
                    remote
                    size="xs"
                    :theme="theme"
                    :show-hover-bg="false"
                />
            </span>
        </div>

        <!-- 列表体：折叠时整体隐藏 -->
        <div v-show="!collapsed" class="rt-body">
            <div
                v-for="item in displayItems"
                :key="item.id"
                class="rt-item"
                :class="{
                    active: activeId === item.id,
                    'is-disabled': item.disabled,
                }"
                @click="handleSelect(item)"
            >
                <!-- 渠道图标：本地图片用 <img>，iconfont 用 CustomizedIcon -->
                <img
                    v-if="item.icon && item.iconRemote === false"
                    class="rt-item__img"
                    :src="item.icon"
                    :alt="item.label"
                />
                <CustomizedIcon
                    v-else-if="item.icon"
                    :name="item.icon"
                    :remote="item.iconRemote !== false"
                    size="xs"
                    :theme="theme"
                    :show-hover-bg="false"
                    class="rt-item__icon"
                />
                <div class="rt-item__label" :title="item.label">{{ item.label }}</div>
            </div>
            <div v-if="displayItems.length === 0" class="rt-empty">
                {{ emptyText }}
            </div>
        </div>
    </div>

    <!-- 渠道设置弹窗 -->
    <ChannelSettingsDialog
        v-model="channelSettingsVisible"
        :application-id="channelSettingAppId"
        :user-id="channelSettingUserId"
        :agent-id="channelSettingAgentId"
        :api-config="channelApiConfig"
        :i18n="channelSettingsI18n"
        :theme="theme"
        @refreshed="refreshAfterBind"
    />
</template>

<style scoped>
.remote-terminal-list {
    width: 100%;
    padding: 0 var(--td-size-2);
    margin-bottom: var(--td-comp-margin-xs, 4px);
}

/* ---------------- 标题栏 ---------------- */
.rt-header {
    height: var(--td-comp-size-s);
    line-height: var(--td-comp-size-s);
    padding-left: var(--td-comp-paddingLR-s);
    padding-right: 4px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: var(--td-text-color-placeholder);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: var(--td-radius-medium);
    transition: background 0.15s ease;
    user-select: none;
}

.rt-header:hover {
    background: var(--td-bg-color-container-hover);
}

.rt-header:focus-visible {
    outline: 2px solid var(--td-brand-color);
    outline-offset: 1px;
}

.rt-header__caret {
    flex-shrink: 0;
    margin-right: var(--td-size-2);
    transition: transform 0.2s ease;
}

.rt-header.collapsed .rt-header__caret {
    transform: rotate(-90deg);
}

.rt-header__title {
    flex: 1;
    min-width: 0;
    color: var(--td-text-color-placeholder);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.rt-header__setting {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    margin-left: var(--td-size-2);
    border-radius: var(--td-radius-small);
    color: var(--td-text-color-placeholder);
    cursor: pointer;
    opacity: 1;
    transition: background 0.15s ease, color 0.15s ease;
}

.rt-header__setting:hover {
    background: var(--td-bg-color-container-active);
    color: var(--td-text-color-primary);
}

.rt-header__setting:focus-visible {
    outline: 2px solid var(--td-brand-color);
    outline-offset: 1px;
}

/* ---------------- 列表体 ---------------- */
.rt-body {
    margin-top: var(--td-comp-margin-xs, 4px);
}

.rt-item {
    min-height: 36px;
    line-height: var(--td-line-height-body-small);
    cursor: pointer;
    padding: var(--td-size-4) 10px;
    border-radius: var(--td-radius-medium);
    transition: background 0.15s ease, color 0.15s ease;
    color: var(--td-text-color-primary);
    display: flex;
    align-items: center;
    font-size: var(--td-font-size-body-medium);
    margin-bottom: var(--td-size-1);
}

.rt-item.active {
    background: var(--td-bg-color-container-active);
    font-weight: 500;
}

.rt-item:hover:not(.active):not(.is-disabled) {
    background: var(--td-bg-color-container-hover);
}

.rt-item.is-disabled {
    cursor: not-allowed;
    color: var(--td-text-color-disabled);
}

.rt-item__icon {
    flex-shrink: 0;
    margin-right: var(--td-size-4);
}

.rt-item__img {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-right: var(--td-size-4);
    border-radius: var(--td-radius-small);
    object-fit: contain;
}

.rt-item__label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.rt-empty {
    padding: 8px var(--td-comp-paddingLR-s, 10px);
    font-size: var(--td-font-size-body-small, 12px);
    color: var(--td-text-color-placeholder);
    line-height: var(--td-line-height-body-small);
}
</style>
