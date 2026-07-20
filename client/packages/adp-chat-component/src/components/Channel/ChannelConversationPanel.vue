<!--
  渠道会话列表面板（右推，样式对齐 FileDir / FilePreviewLayout）
  @description
    - 右侧推开一列，中间保留 MainLayout 会话主区
    - 头部风格与 FileDir 一致：title + refresh + close
    - 通过 CAPI DescribeConversationList 按 UserId 过滤（每个渠道绑定唯一的 UserAgent.UserId，
      对齐 adp-b2c capi.go 的 DescribeConversationList 用法；ChannelId 待 CAPI SDK 开放后再启用）
    - 点击列表项触发 select(conversationId)，父层复用 handleSelectConversation
      → 触发 chatId 变化 → Chat 组件内部 InfiniteLoading 自动 loadMore 加载历史消息
    - 支持 activeConversationId 高亮当前选中项
  @参考
    - smart-webim channel-drawer.vue：轮询 + 竞态保护 + activeConversationId
    - adp-b2c capi.go DescribeConversationList：UserId / AgentId 过滤参数
    - FileDir/index.vue：header 结构、hover / active 视觉
-->
<script setup lang="ts">
import { ref, watch, onBeforeUnmount, computed } from 'vue';
import { Icon as TIcon } from 'tdesign-vue-next';
import { describeConversationList, defaultApiDetailConfig } from '../../service/api';
import type { CapiConversationItem } from '../../service/api';
import CustomizedIcon from '../CustomizedIcon.vue';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';

interface ConversationItem {
    /** 会话 ID */
    id: string;
    /** 会话标题 */
    title: string;
    /** 最后活跃时间（毫秒） */
    lastActiveAt: number;
}

interface Props extends ThemeProps {
    /** 面板可见性 */
    visible: boolean;
    /** 应用 ID（CAPI 请求必填） */
    applicationId: string;
    /**
     * 渠道绑定的 UserId（来自 channel.spec.UserAgent.UserId）
     * 这是渠道过滤的核心字段：ADP 里每个渠道对应一个专属 UserId，
     * 传该值后 DescribeConversationList 只返回属于此渠道的会话（对齐 adp-b2c）
     */
    userId?: string;
    /** 渠道绑定的 AgentId（来自 channel.spec.UserAgent.AgentId，进一步限定 Agent 维度） */
    agentId?: string;
    /** 渠道 ID（仅作为语义标记与 watch 触发源，暂不透传 CAPI） */
    channelId?: string;
    /** 渠道显示名（用于标题） */
    channelLabel?: string;
    /** 当前激活的会话 ID（高亮） */
    activeConversationId?: string;
    /** DescribeConversationList API 路径（可覆盖默认 /adp/DescribeConversationList） */
    describeConversationListApi?: string;
    /** 单页数量 */
    pageSize?: number;
    /** 轮询间隔（ms），0 表示不轮询 */
    pollInterval?: number;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    visible: false,
    applicationId: '',
    userId: '',
    agentId: '',
    channelId: '',
    channelLabel: '',
    activeConversationId: '',
    describeConversationListApi: '',
    pageSize: 50,
    pollInterval: 10000,
});

const emit = defineEmits<{
    /** 选中一条会话 */
    (e: 'select', conversationId: string): void;
    /** 关闭面板 */
    (e: 'close'): void;
    /** 列表拉取完成（用于父层感知空态等） */
    (e: 'loaded', items: ConversationItem[]): void;
}>();

const loading = ref(false);
const refreshing = ref(false);
const conversations = ref<ConversationItem[]>([]);

/** 竞态保护：递增的请求序号，防止快速切换渠道 / 轮询与首次拉取叠加 */
let lastFetchId = 0;
/** 轮询 timer */
let pollingTimer: ReturnType<typeof setInterval> | null = null;

const panelTitle = computed(() => (props.channelLabel ? `${props.channelLabel}会话` : '渠道会话'));

/**
 * 归一化 CAPI 返回项 → ConversationItem
 * UpdateTime / CreateTime 可能是 ISO 字符串或数字字符串（毫秒），做统一处理
 */
const normalizeItem = (raw: CapiConversationItem): ConversationItem => {
    const timeStr = String(raw.UpdateTime || raw.CreateTime || '');
    let ts = 0;
    if (timeStr) {
        const numeric = Number(timeStr);
        // 纯数字：CAPI 常用 ms 时间戳；非数字则按 ISO 字符串解析
        ts = Number.isFinite(numeric) && numeric > 0 ? numeric : Date.parse(timeStr) || 0;
    }
    return {
        id: raw.ConversationId || '',
        title: (raw.Title as string) || '未命名',
        lastActiveAt: ts,
    };
};

const fetchConversations = async (silent = false) => {
    if (!props.applicationId) {
        conversations.value = [];
        return;
    }
    // 渠道过滤：后台确认 DescribeConversationList 按 channel_id 查询，必须有 channelId
    if (!props.channelId) {
        conversations.value = [];
        return;
    }
    const fetchId = ++lastFetchId;
    if (!silent) loading.value = true;
    try {
        // 后台确认：在原有传参基础上「新增 ChannelId」按渠道过滤（CAPI v2 / X-TC-Version 2026-05-20）。
        // 原有 UserId / AgentId 传参保持不变。
        const { conversations: list } = await describeConversationList(
            {
                AppId: props.applicationId,
                UserId: props.userId || undefined,
                AgentId: props.agentId || undefined,
                ChannelId: props.channelId,
                Offset: 0,
                Limit: props.pageSize,
            },
            props.applicationId,
            props.describeConversationListApi || defaultApiDetailConfig.describeConversationListApi,
        );
        // 竞态保护：如已有更新请求，丢弃本次
        if (fetchId !== lastFetchId) return;
        const next = list
            .map(normalizeItem)
            .filter((c) => c.id)
            .sort((a, b) => b.lastActiveAt - a.lastActiveAt);
        conversations.value = next;
        // 调试日志：便于排查"ChannelId 传了但拿到空"场景（对照后端 CAPI 日志）
        console.debug('[ChannelConversationPanel] fetched', {
            channelId: props.channelId,
            userId: props.userId,
            count: next.length,
            raw: list,
        });
        emit('loaded', next);
    } catch (err) {
        if (fetchId !== lastFetchId) return;
        console.error('[ChannelConversationPanel] fetch error:', err);
        conversations.value = [];
    } finally {
        if (fetchId === lastFetchId && !silent) {
            loading.value = false;
        }
    }
};

/** 手动刷新按钮 */
const handleRefresh = async () => {
    if (refreshing.value) return;
    refreshing.value = true;
    try {
        await fetchConversations(true);
    } finally {
        refreshing.value = false;
    }
};

/** 启停轮询（对齐 webim channel-drawer） */
const startPolling = () => {
    stopPolling();
    if (!props.pollInterval || props.pollInterval <= 0) return;
    pollingTimer = setInterval(() => {
        fetchConversations(true);
    }, props.pollInterval);
};
const stopPolling = () => {
    if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
    }
};

// visible / applicationId / channelId 变化时重新拉取 + 启停轮询
watch(
    [() => props.visible, () => props.applicationId, () => props.channelId],
    ([vis, appId, cid]) => {
        if (vis && appId && cid) {
            fetchConversations();
            startPolling();
        } else {
            stopPolling();
            if (!cid) conversations.value = [];
        }
    },
    { immediate: true },
);

onBeforeUnmount(() => {
    stopPolling();
});

const handleSelect = (conv: ConversationItem) => {
    emit('select', conv.id);
    // 不关闭面板，保持展开供用户继续切换（对齐 webim handleSelectChannelConversation）
};

/** 时间格式化：小于 1 分钟显示"刚刚"，小于 1 小时显示"N 分钟前"，小于 1 天显示"N 小时前"，超过 1 天显示"MM/DD" */
const formatTime = (ts: number): string => {
    if (!ts) return '';
    const d = new Date(ts);
    if (!Number.isFinite(d.getTime())) return '';
    const diffMin = Math.floor((Date.now() - d.getTime()) / 60000);
    if (diffMin < 1) return '刚刚';
    if (diffMin < 60) return `${diffMin}分钟前`;
    if (diffMin < 1440) return `${Math.floor(diffMin / 60)}小时前`;
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
};

defineExpose({
    /** 供父层手动刷新（例如新建会话完成后） */
    reload: () => fetchConversations(),
});
</script>

<template>
    <div v-if="visible" class="channel-conversation-panel">
        <!-- Header：结构对齐 FileDir header（title + refresh + close） -->
        <div class="ccp-header">
            <span class="ccp-header__title">{{ panelTitle }}</span>
            <div class="ccp-header__actions">
                <span class="ccp-header__action" :title="'刷新'" @click="handleRefresh">
                    <CustomizedIcon
                        remote
                        size="xs"
                        :showHoverBg="false"
                        :class="{ 'icon-spinning': refreshing }"
                        name="basic_refresh_line"
                        :theme="theme"
                    />
                </span>
                <span class="ccp-header__action" :title="'关闭'" @click="emit('close')">
                    <CustomizedIcon
                        remote
                        size="xs"
                        :showHoverBg="false"
                        name="basic_close_line"
                        :theme="theme"
                    />
                </span>
            </div>
        </div>

        <!-- Body：loading / empty / list 三态 -->
        <div class="ccp-body">
            <div v-if="loading" class="ccp-loading">
                <TIcon name="loading" class="icon-spinning" />
                <span>加载中...</span>
            </div>
            <div v-else-if="conversations.length === 0" class="ccp-empty">
                <CustomizedIcon
                    remote
                    nativeIcon
                    name="default_wait"
                    class="ccp-empty__icon"
                    :showHoverBg="false"
                    :theme="theme"
                />
                <p class="ccp-empty__text">暂无会话</p>
            </div>
            <div v-else class="ccp-list">
                <div
                    v-for="conv in conversations"
                    :key="conv.id"
                    class="ccp-item"
                    :class="{ active: activeConversationId === conv.id }"
                    @click="handleSelect(conv)"
                >
                    <span class="ccp-item__title" :title="conv.title">{{ conv.title }}</span>
                    <span class="ccp-item__time">{{ formatTime(conv.lastActiveAt) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.channel-conversation-panel {
    width: 320px;
    min-width: 320px;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /* 对齐 FileDir：右推面板需要一条左边框与主区分离 */
    border-left: 1px solid var(--td-border-level-1-color);
    background: var(--td-bg-color-container);
    flex-shrink: 0;
}

/* ---------------- Header（对齐 .file-dir-header） ---------------- */
.ccp-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--td-comp-paddingTB-m) var(--td-comp-paddingLR-l);
    border-bottom: 1px solid var(--td-border-level-1-color);
    flex-shrink: 0;
    line-height: 31px;
}

.ccp-header__title {
    font-size: var(--td-font-size-body-medium);
    font-weight: 600;
    color: var(--td-text-color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.ccp-header__actions {
    display: flex;
    align-items: center;
    gap: var(--td-comp-margin-xs);
    flex-shrink: 0;
}

.ccp-header__action {
    cursor: pointer;
    color: var(--td-text-color-secondary);
    line-height: 1;
    display: flex;
    padding: var(--td-comp-paddingLR-xs);
    align-items: center;
    justify-content: center;
    border-radius: var(--td-radius-small);
    transition: background-color 0.2s, color 0.2s;
}

.ccp-header__action:hover {
    background-color: var(--td-bg-color-container-hover);
    color: var(--td-text-color-primary);
}

.icon-spinning {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* ---------------- Body ---------------- */
.ccp-body {
    flex: 1;
    overflow-y: auto;
    padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-s);
}

.ccp-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--td-comp-margin-s);
    padding: var(--td-comp-paddingTB-xxl, 40px) 0;
    color: var(--td-text-color-placeholder);
    font-size: var(--td-font-size-body-small);
}

/* 空状态：对齐 webim channel-drawer（占满面板、垂直居中的插画 + 灰字） */
.ccp-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: var(--td-comp-margin-xl, 16px);
}

/* 空状态插画：对齐 webim task-list-panel 的 120px default_wait（覆盖 CustomizedIcon 默认 size 尺寸/内边距） */
.ccp-empty :deep(.customeized-icon.ccp-empty__icon) {
    width: 120px;
    height: 120px;
    padding: 0;
}

.ccp-empty__text {
    margin: 0;
    font-size: var(--td-font-size-body-small, 13px);
    line-height: var(--td-line-height-body-small);
    color: var(--td-text-color-placeholder);
}

.ccp-list {
    display: flex;
    flex-direction: column;
    gap: var(--td-size-1);
}

/* ---------------- 列表项（对齐 .rt-item / t-tree__item hover 效果） ---------------- */
.ccp-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px var(--td-comp-paddingLR-s);
    cursor: pointer;
    border-radius: var(--td-radius-medium);
    transition: background 0.15s ease, color 0.15s ease;
    font-size: var(--td-font-size-body-medium);
    color: var(--td-text-color-primary);
    min-height: 36px;
}

.ccp-item:hover:not(.active) {
    background: var(--td-bg-color-container-hover);
}

.ccp-item.active {
    background: var(--td-bg-color-container-active);
    font-weight: 500;
}

.ccp-item__title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.ccp-item__time {
    font-size: var(--td-font-size-body-small);
    color: var(--td-text-color-placeholder);
    flex-shrink: 0;
    margin-left: var(--td-size-5);
}
</style>
