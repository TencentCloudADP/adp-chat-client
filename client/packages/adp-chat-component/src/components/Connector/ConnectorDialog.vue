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
                            <!-- 连接状态指示点：需要鉴权的连接器始终显示，反映"已连接/未连接" -->
                            <span
                                v-if="item.needAuth"
                                class="connector-item__status"
                                :class="item.connected ? 'is-success' : 'is-warning'"
                            >
                                <span class="connector-item__status-dot"></span>
                                <span class="connector-item__status-label">
                                    {{ item.connected ? '已连接' : '未连接' }}
                                </span>
                            </span>
                        </div>
                        <div class="connector-item__desc" :title="item.desc">
                            {{ item.desc || '暂无描述' }}
                        </div>
                    </div>
                    <div class="connector-item__actions">
                        <!-- 连接按钮：需要鉴权的连接器始终可见，文案随连接状态切换 -->
                        <t-button
                            v-if="item.needAuth"
                            variant="outline"
                            theme="primary"
                            size="small"
                            @click="onConnect(item)"
                        >
                            {{ item.connected ? '重新连接' : '连接' }}
                        </t-button>
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

        <!-- 连接表单子弹窗 -->
        <ConnectorConnectDialog
            v-model="showConnect"
            :connector="connectingConnector"
            :application-id="applicationId"
            :agent-id="agentIdMap[applicationId] || ''"
            @connected="onConnected"
        />
    </t-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
    Dialog as TDialog, Button as TButton, Tag as TTag, Loading as TLoading,
    Input as TInput, Checkbox as TCheckbox, Switch as TSwitch, Pagination as TPagination, MessagePlugin,
} from 'tdesign-vue-next';
import CustomizedIcon from '../CustomizedIcon.vue';
import {
    fetchPluginList, bindAgentTool, unbindAgentTool, buildPluginConfig, PluginClassEnum,
} from '../../service/connectorPluginApi';
import useAgentStore from '../../composables/useAgentStore';
import ConnectorConnectDialog from './ConnectorConnectDialog.vue';
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

const { agentIdMap, getAgentIdByAppId, getAgentDetailByAppId, resetAgentStore } = useAgentStore();

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
    /** 是否已连接（鉴权信息已填） */
    connected: boolean;
    /** 是否需要鉴权（AuthMode !== 0） */
    needAuth: boolean;
    /** 原始数据，用于传给连接弹窗 */
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
const installedIdSet = computed(() => {
    const s = new Set<string>();
    installedConnectors.value.forEach((p) => {
        const id = (p.PluginId || p.plugin_id || '') as string;
        if (id) s.add(id);
    });
    return s;
});

/**
 * 判断 plugin 参数项是否已被填值（用于"已连接"状态推导）
 * 兼容三种结构：
 * 1. 旧 PascalCase：{ ParamValue }
 * 2. 旧 snake_case：{ param_value }
 * 3. 新 snake_case 协议：{ parameter_name, input: { input_type, user_input_value: { value_list, values } | system_variable | custom_var_id | env_var_id | app_var_id } }
 */
function hasParamValue(it: Record<string, unknown>): boolean {
    if (it.ParamValue || it.param_value) return true;
    const input = (it.input || it.Input || null) as Record<string, unknown> | null;
    if (!input) return false;
    const userVal = input.user_input_value as Record<string, unknown> | undefined;
    if (userVal) {
        const list = (userVal.value_list || userVal.values) as unknown[] | undefined;
        if (Array.isArray(list) && list.length > 0) return true;
    }
    if (input.system_variable || input.custom_var_id || input.env_var_id || input.app_var_id) return true;
    return false;
}

/** 已连接（鉴权信息已填）：plugin 中 header_parameter_list/query_parameter_list 任一项有取值 */
const connectedIdSet = computed(() => {
    const s = new Set<string>();
    installedConnectors.value.forEach((p) => {
        const id = (p.PluginId || p.plugin_id || '') as string;
        if (!id) return;
        const headers = (p.HeaderParameterList || p.header_parameter_list || []) as Record<string, unknown>[];
        const query = (p.QueryParameterList || p.query_parameter_list || []) as Record<string, unknown>[];
        if ([...headers, ...query].some(hasParamValue)) s.add(id);
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
    // cardList 中的 enabled/connected 是构建时的静态快照，
    // 需要依赖最新的 installedIdSet / connectedIdSet 动态派生状态
    return cardList.value.map((item) => ({
        ...item,
        enabled: installedIdSet.value.has(item.pluginId),
        connected: connectedIdSet.value.has(item.pluginId),
    }));
});

function buildItemFromInstalled(p: Record<string, unknown>): ConnectorItem {
    const pluginId = (p.PluginId || p.plugin_id || '') as string;
    // 已绑定接口：鉴权类型字段名为 auth_type（0=无鉴权 / 2=CAM / 3=OAuth）
    const authType = Number(p.AuthType || p.auth_type || 0);
    const headers = (p.HeaderParameterList || p.header_parameter_list || []) as Record<string, unknown>[];
    const query = (p.QueryParameterList || p.query_parameter_list || []) as Record<string, unknown>[];
    return {
        pluginId,
        name: (p.Name || p.PluginName || p.plugin_name || '') as string,
        desc: (p.Desc || p.PluginDesc || p.plugin_desc || p.Introduction || '') as string,
        iconUrl: (p.IconUrl || p.icon_url || '') as string,
        isInner: Number(p.PluginType || p.plugin_type || 0) === 1,
        enabled: true,
        needAuth: authType !== 0,
        connected: [...headers, ...query].some(hasParamValue),
        raw: p,
    };
}

function buildItemFromList(p: Record<string, unknown>): ConnectorItem {
    const pluginId = (p.PluginId || p.plugin_id || '') as string;
    // 列表接口：鉴权类型字段名为 AuthType（PascalCase）；AuthMode 是 OAuth 授权范围，非鉴权类型
    const authType = Number(p.AuthType || p.auth_type || 0);
    const enabled = installedIdSet.value.has(pluginId);
    return {
        pluginId,
        name: (p.Name || p.PluginName || p.plugin_name || '') as string,
        desc: (p.Desc || p.PluginDesc || p.plugin_desc || p.Introduction || '') as string,
        iconUrl: (p.IconUrl || p.icon_url || '') as string,
        isInner: Number(p.PluginType || p.plugin_type || 0) === 1,
        enabled,
        needAuth: authType !== 0,
        connected: connectedIdSet.value.has(pluginId),
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

/** 切换启用状态 */
async function onToggleEnabled(item: ConnectorItem, val: boolean) {
    if (togglingId.value) return;
    const agentId = await getAgentIdByAppId(props.applicationId);
    if (!props.applicationId || !agentId) {
        MessagePlugin.warning('缺少应用 ID 或 Agent ID');
        return;
    }
    togglingId.value = item.pluginId;
    try {
        if (val) {
            // 开启：BindAgentTool（连接器仅 plugin 维度）
            await bindAgentTool({
                applicationId: props.applicationId,
                appId: props.applicationId,
                agentId,
                pluginId: item.pluginId,
                toolSource: 0,
                plugin: buildPluginConfig(item.raw),
            });
            MessagePlugin.success('已开启');
        } else {
            // 关闭：UnbindAgentTool（连接器整体卸载，tool_id 省略）
            await unbindAgentTool({
                applicationId: props.applicationId,
                appId: props.applicationId,
                agentId,
                pluginId: item.pluginId,
                toolId: '',
            });
            MessagePlugin.success('已关闭');
        }
        // 刷新已启用列表，清除缓存确保拿到最新数据
        await fetchInstalled(true);
        // emit('change');
    } catch (e) {
        console.error('[ConnectorDialog] toggle error:', e);
        MessagePlugin.error(val ? '开启失败' : '关闭失败');
    } finally {
        togglingId.value = '';
    }
}

const showConnect = ref(false);
const connectingConnector = ref<Record<string, unknown> | null>(null);

function onConnect(item: ConnectorItem) {
    connectingConnector.value = item.raw;
    showConnect.value = true;
}

async function onConnected() {
    await fetchInstalled(true);
    emit('change');
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
.connector-item__status { display: inline-flex; align-items: center; gap: 4px; padding: 0 6px; height: 20px; font-size: 12px; border-radius: 10px; }
.connector-item__status.is-success { color: var(--td-success-color, #00a870); background: rgba(0, 168, 112, 0.08); }
.connector-item__status.is-warning { color: var(--td-warning-color, #ed7b2f); background: rgba(237, 123, 47, 0.08); }
.connector-item__status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.connector-item__actions { flex-shrink: 0; display: flex; align-items: center; gap: 12px; }
</style>
