<template>
    <t-dialog
        v-model:visible="visible"
        header="管理连接器"
        :footer="false"
        :close-on-overlay-click="false"
        width="min(900px, calc(100vw - 40px))"
    >
        <div class="connector-manage">
            <!-- 顶部筛选栏 -->
            <div class="connector-manage__filter-bar">
                <t-input
                    v-model="searchKeyword"
                    placeholder="搜索连接器"
                    clearable
                    class="connector-manage__search"
                    @change="onSearchChange"
                >
                    <template #prefix-icon><CustomizedIcon remote name="basic_search_line" size="xs" :show-hover-bg="false" :theme="theme" /></template>
                </t-input>
                <t-checkbox v-model="enabledOnly" @change="onEnabledOnlyChange">已启用</t-checkbox>
            </div>

            <!-- 列表区 -->
            <div v-if="loading" class="connector-manage__loading">
                <t-loading size="small"  text="加载中..." />
            </div>
            <div v-else-if="displayList.length === 0" class="connector-manage__empty">
                <span>{{ enabledOnly ? '暂无已启用的连接器' : '暂无连接器' }}</span>
            </div>
        <div v-else class="connector-manage__list">
                <div v-for="item in displayList" :key="item.pluginId" class="connector-item">
                    <div class="connector-item__icon">
                        <img v-if="item.iconUrl" :src="item.iconUrl" @error="onIconError" />
                        <span v-else class="connector-item__icon-fb"><CustomizedIcon remote name="basic_link_line" size="s" :show-hover-bg="false" :theme="theme" /></span>
                    </div>
                    <div class="connector-item__info">
                        <div class="connector-item__title">
                            <span class="connector-item__name" :title="item.name">{{ item.name }}</span>
                            <t-tag v-if="item.isInner" variant="light">预置</t-tag>
                        </div>
                        <div class="connector-item__desc" :title="item.desc">
                            {{ item.desc || '暂无描述' }}
                        </div>
                    </div>
                    <div class="connector-item__actions">
                        <!-- 启用开关 -->
                        <t-switch
                            :model-value="item.enabled"
                            :loading="togglingId === item.pluginId"
                            :disabled="!!togglingId && togglingId !== item.pluginId"
                            @change="(v) => onToggleEnabled(item, v as boolean)"
                        />
                    </div>
                </div>
            </div>

            <!-- 分页 -->
            <t-pagination
                v-if="!enabledOnly && total > pageSize"
                v-model="pageNumber"
                :total="total"
                :page-size="pageSize"
                :page-size-options="[]"
                size="small"
                class="connector-manage__pagination"
                @change="fetchList"
            />
        </div>

    </t-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
    Dialog as TDialog, Tag as TTag, Loading as TLoading,
    Input as TInput, Checkbox as TCheckbox, Switch as TSwitch, Pagination as TPagination, MessagePlugin,
} from 'tdesign-vue-next';
import CustomizedIcon from '../CustomizedIcon.vue';
import {
    fetchPluginList, PluginClassEnum,
} from '../../service/connectorPluginApi';
import useAgentStore from '../../composables/useAgentStore';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';

interface Props extends ThemeProps {
    modelValue: boolean;
    applicationId?: string;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    modelValue: false,
    applicationId: '',
});

const { getAgentIdByAppId, getAgentDetailByAppId, resetAgentStore, modifyAgent } = useAgentStore();

const emit = defineEmits<{
    (e: 'update:modelValue', v: boolean): void;
    /** 连接器启用/关闭/连接状态变更后通知父组件刷新 */
    (e: 'change'): void;
}>();

const visible = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v),
});

interface ConnectorItem {
    pluginId: string;
    name: string;
    desc: string;
    iconUrl: string;
    isInner: boolean;
    /** 是否已启用（已绑定到当前 Agent） */
    enabled: boolean;
    /** 原始数据 */
    raw: Record<string, unknown>;
}

const loading = ref(false);
const searchKeyword = ref('');
const enabledOnly = ref(false);
const pageNumber = ref(1);
const pageSize = 15;
const total = ref(0);
const cardList = ref<ConnectorItem[]>([]);
const togglingId = ref('');

/** 已启用的连接器集合（来自 fetchGlobalAgent 的 plugins 中 PluginClass===1 的项） */
const installedConnectors = ref<Record<string, unknown>[]>([]);

/**
 * 从 AgentPlugin 结构中提取 PluginId。
 * DescribeAgentDetail 返回的 PluginList 每项为 AgentPlugin { Config: AgentPluginConfig, Name, ... }，
 * PluginId 位于 Config 子对象中，需要兼容顶层和 Config 嵌套两种情况。
 */
function extractPluginId(p: Record<string, unknown>): string {
    const directId = (p.PluginId || p.plugin_id || '') as string;
    if (directId) return directId;
    const config = (p.Config || p.config) as Record<string, unknown> | undefined;
    return config ? ((config.PluginId || config.plugin_id || '') as string) : '';
}

const installedIdSet = computed(() => {
    const s = new Set<string>();
    installedConnectors.value.forEach((p) => {
        const id = extractPluginId(p);
        if (id) s.add(id);
    });
    return s;
});

/** 显示列表：已启用模式下从 installedConnectors 派生 + 关键字过滤；否则使用 ListPlugins 拉取的列表 */
const displayList = computed<ConnectorItem[]>(() => {
    if (enabledOnly.value) {
        const kw = searchKeyword.value.trim().toLowerCase();
        return installedConnectors.value
            .map((p) => buildItemFromInstalled(p))
            .filter((it) => !kw || it.name.toLowerCase().includes(kw) || it.desc.toLowerCase().includes(kw));
    }
    // cardList 中的 enabled 是构建时的静态快照，需要依赖最新的 installedIdSet 动态派生
    return cardList.value.map((item) => ({
        ...item,
        enabled: installedIdSet.value.has(item.pluginId),
    }));
});

function buildItemFromInstalled(p: Record<string, unknown>): ConnectorItem {
    const pluginId = extractPluginId(p);
    return {
        pluginId,
        name: (p.Name || p.PluginName || p.plugin_name || '') as string,
        desc: (p.Desc || p.PluginDesc || p.plugin_desc || p.Introduction || '') as string,
        iconUrl: (p.IconUrl || p.icon_url || '') as string,
        isInner: Number(p.PluginType || p.plugin_type || 0) === 1,
        enabled: true,
        raw: p,
    };
}

function buildItemFromList(p: Record<string, unknown>): ConnectorItem {
    const pluginId = extractPluginId(p);
    return {
        pluginId,
        name: (p.Name || p.PluginName || p.plugin_name || '') as string,
        desc: (p.Desc || p.PluginDesc || p.plugin_desc || p.Introduction || '') as string,
        iconUrl: (p.IconUrl || p.icon_url || '') as string,
        isInner: Number(p.PluginType || p.plugin_type || 0) === 1,
        enabled: installedIdSet.value.has(pluginId),
        raw: p,
    };
}

function onIconError(e: Event) { (e.target as HTMLImageElement).style.display = 'none'; }

let searchTimer: ReturnType<typeof setTimeout> | null = null;

function onSearchChange() {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        if (enabledOnly.value) return;
        pageNumber.value = 1;
        fetchList();
    }, 300);
}

function onEnabledOnlyChange() {
    pageNumber.value = 1;
    if (!enabledOnly.value) {
        fetchList();
    }
}

/** 拉取已启用的连接器列表，可选是否先清除缓存 */
async function fetchInstalled(clearCache = false) {
    if (!props.applicationId) return;
    try {
        if (clearCache) {
            resetAgentStore(props.applicationId);
        }
        const detail = await getAgentDetailByAppId(props.applicationId);
        // DescribeAgentDetail 返回的 plugins 中 PluginClass 字段可能未正确赋值（为0），
        // 因此不再依赖该字段过滤，直接使用全部 plugins 作为已绑定集合
        installedConnectors.value = (detail?.plugins || []) as Record<string, unknown>[];
    } catch (e) {
        console.error('[ConnectorDialog] fetchInstalled error:', e);
    }
}

/** 拉取连接器市场列表 */
async function fetchList() {
    if (!props.applicationId) return;
    loading.value = true;
    try {
        const result = await fetchPluginList({
            applicationId: props.applicationId,
            pluginClass: PluginClassEnum.CONNECTOR,
            query: searchKeyword.value || undefined,
            pageNumber: pageNumber.value,
            pageSize,
            // 不区分 tag / 类型，全量拉
            pluginTypes: [0, 1, 2],
        });
        cardList.value = result.plugins.map(buildItemFromList);
        total.value = result.total;
    } catch (e) {
        console.error('[ConnectorDialog] fetchList error:', e);
    } finally {
        loading.value = false;
    }
}

/**
 * 将 ListPlugins 返回的 PluginHeader/PluginQuery（{ParamName, ParamValue, GlobalHidden, IsRequired}）
 * 转换为 ModifyAgent 所需的 AgentPluginParameter（{Name, IsGlobalHidden, IsRequired, Input}）格式。
 */
function convertPluginParams(params: Record<string, unknown>[]): Record<string, unknown>[] {
    return params.map((h) => ({
        Name: h.ParamName ?? h.Name ?? '',
        IsGlobalHidden: h.GlobalHidden ?? h.IsGlobalHidden ?? false,
        IsRequired: h.IsRequired ?? false,
        Input: h.Input ?? (h.ParamValue ? { Type: 0, Value: h.ParamValue } : null),
    }));
}

/**
 * 从 AgentPlugin 或 PluginInfo 中提取字段，组装 AgentPluginConfig 并设置 OAuthConsent=1。
 *
 * 兼容两种数据源：
 * - DescribeAgentDetail 返回的 AgentPlugin：{ Config: { PluginId, HeaderParameterList, ... }, ... }
 * - ListPlugins 返回的 PluginInfo：{ PluginId, Headers, Query, AuthType, ... }
 */
function buildPluginConfigFromAgent(p: Record<string, unknown>) {
    const config = (p.Config ?? p) as Record<string, unknown>;
    const pluginId = (config.PluginId ?? p.PluginId ?? '') as string;

    // 优先取 AgentPlugin.Config 中的 HeaderParameterList/QueryParameterList（DescribeAgentDetail 数据源）
    // 若不存在则从 PluginInfo 的 Headers/Query 转换（ListPlugins 数据源）
    let headerList = config.HeaderParameterList as Record<string, unknown>[] | undefined;
    if (!headerList || !Array.isArray(headerList) || headerList.length === 0) {
        const rawHeaders = (p.Headers ?? p.headers) as Record<string, unknown>[] | undefined;
        headerList = rawHeaders && Array.isArray(rawHeaders) ? convertPluginParams(rawHeaders) : [];
    }

    let queryList = config.QueryParameterList as Record<string, unknown>[] | undefined;
    if (!queryList || !Array.isArray(queryList) || queryList.length === 0) {
        const rawQuery = (p.Query ?? p.query) as Record<string, unknown>[] | undefined;
        queryList = rawQuery && Array.isArray(rawQuery) ? convertPluginParams(rawQuery) : [];
    }

    return {
        PluginId: pluginId,
        HeaderParameterList: headerList,
        QueryParameterList: queryList,
        EnableCamRoleAuth: config.EnableCamRoleAuth ?? p.EnableCamRoleAuth ?? false,
        OAuthConsent: 1, // 强制设为使用者授权
        AuthType: config.AuthType ?? p.AuthType ?? 0,
    };
}

/** 切换启用状态：直接通过 ModifyAgent 更新 plugin_list */
async function onToggleEnabled(item: ConnectorItem, val: boolean) {
    if (togglingId.value) return;
    const agentId = await getAgentIdByAppId(props.applicationId);
    if (!props.applicationId || !agentId) {
        MessagePlugin.warning('缺少应用 ID 或 Agent ID');
        return;
    }
    togglingId.value = item.pluginId;
    try {
        // 获取当前 Agent 配置中的 plugin_list
        const detail = await getAgentDetailByAppId(props.applicationId);
        const currentPlugins = detail?.plugins || [];

        let pluginList;
        if (val) {
            // 开启：在现有 plugin_list 基础上追加当前 item（避免重复）
            const existingList = currentPlugins
                .filter((p) => extractPluginId(p) !== item.pluginId)
                .map(buildPluginConfigFromAgent);
            // 从 item.raw（DescribeAgentDetail 返回的 AgentPlugin）中回填 Config 字段
            existingList.push(buildPluginConfigFromAgent(item.raw));
            pluginList = existingList;
        } else {
            // 关闭：从 plugin_list 中删除对应 item
            pluginList = currentPlugins
                .filter((p) => extractPluginId(p) !== item.pluginId)
                .map(buildPluginConfigFromAgent);
        }

        await modifyAgent(
            props.applicationId,
            agentId,
            { PluginList: pluginList },
            ['plugin_list'],
        );

        MessagePlugin.success(val ? '已开启' : '已关闭');
        // 刷新已启用列表，清除缓存确保拿到最新数据
        await fetchInstalled();
    } catch (e) {
        console.error('[ConnectorDialog] toggle error:', e);
        MessagePlugin.error(val ? '开启失败' : '关闭失败');
    } finally {
        togglingId.value = '';
    }
}

watch(() => props.modelValue, (val) => {
    if (val) {
        searchKeyword.value = '';
        enabledOnly.value = false;
        pageNumber.value = 1;
        fetchInstalled();
        fetchList();
    }
});
</script>

<style scoped>
.connector-manage { display: flex; flex-direction: column; gap: 12px; height: 540px; overflow: hidden; }
.connector-manage__filter-bar { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.connector-manage__search { width: 240px; }
.connector-manage__loading { display: flex; align-items: center; justify-content: center; flex: 1; }
.connector-manage__empty { display: flex; align-items: center; justify-content: center; flex: 1; color: var(--td-text-color-placeholder); font-size: 13px; }
.connector-manage__list { flex: 1; overflow-y: auto; min-height: 0; display: flex; flex-direction: column; padding-right: 8px; }
.connector-manage__list::-webkit-scrollbar { width: 4px; }
.connector-manage__list::-webkit-scrollbar-thumb { border-radius: 2px; background: rgba(17, 32, 70, 0.13); }
.connector-manage__pagination { display: flex; justify-content: center; flex-shrink: 0; }

.connector-item { display: flex; align-items: center; gap: 16px; padding: 14px 0; border-bottom: 1px solid rgba(0, 44, 85, 0.08); transition: background 0.15s; }
.connector-item:last-child { border-bottom: none; }
.connector-item:hover { background: var(--td-bg-color-container-hover); }
.connector-item__icon { flex-shrink: 0; width: 40px; }
.connector-item__icon img { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(0, 44, 85, 0.08); box-sizing: border-box; }
.connector-item__icon-fb { width: 40px; height: 40px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; background: var(--td-bg-color-secondarycontainer); color: var(--td-text-color-placeholder); border: 1px solid rgba(0, 44, 85, 0.08); box-sizing: border-box; }
.connector-item__info { flex: 1; min-width: 0; overflow: hidden; }
.connector-item__title { display: flex; align-items: center; gap: 6px; flex-wrap: nowrap; overflow: hidden; }
.connector-item__name { font-size: 15px; font-weight: 500; color: var(--td-text-color-primary); line-height: 24px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 360px; }
.connector-item__desc { font-size: 13px; color: var(--td-text-color-placeholder); line-height: 20px; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.connector-item__actions { flex-shrink: 0; display: flex; align-items: center; gap: 12px; }
</style>
