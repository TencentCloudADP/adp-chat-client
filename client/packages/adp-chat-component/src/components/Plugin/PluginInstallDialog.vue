<template>
    <t-dialog
        v-model:visible="visible"
        header="添加工具"
        :footer="false"
        width="800px"
        :close-on-overlay-click="false"
    >
        <div class="plugin-dialog">
            <!-- Tabs + 筛选栏 -->
            <div class="plugin-dialog__header">
                <t-tabs v-model="activeTab" class="plugin-dialog__tabs" @change="onTabChange">
                    <t-tab-panel value="inner" label="工具" />
                    <t-tab-panel value="custom" label="自定义工具" />
                </t-tabs>
                <div class="plugin-dialog__actions">
                    <t-popup trigger="click" placement="bottom-right">
                        <span class="plugin-dialog__sort-btn" :title="sortLabel">
                            <t-icon :name="sortIcon" />
                        </span>
                        <template #content>
                            <div class="plugin-dialog__sort-menu">
                                <div v-for="opt in sortOptions" :key="opt.value"
                                    :class="['plugin-dialog__sort-item', { 'is-selected': selectedSort === opt.value }]"
                                    @click="selectedSort = opt.value; doReset()">
                                    <span>{{ opt.label }}</span>
                                </div>
                            </div>
                        </template>
                    </t-popup>
                    <t-popup v-if="activeTab === 'inner' || activeTab === 'custom'" v-model:visible="filterVisible" trigger="click" placement="bottom-right">
                        <span class="plugin-dialog__filter-trigger">{{ filterLabel }}</span>
                        <template #content>
                            <div class="plugin-dialog__filter-panel">
                                <div v-for="group in filterGroups" :key="group.key" class="plugin-dialog__filter-group">
                                    <div class="plugin-dialog__filter-group-title">{{ group.title }}</div>
                                    <div v-for="opt in group.options" :key="opt.value" class="plugin-dialog__filter-option">
                                        <t-checkbox :checked="isFilterChecked(group.key, opt.value)" @change="(v:boolean)=>onFilterCheck(group.key, opt.value, v)">{{ opt.text }}</t-checkbox>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </t-popup>
                    <t-checkbox v-model="filterFavorite" @change="doReset">收藏</t-checkbox>
                    <t-input v-model="searchKeyword" placeholder="搜索工具" size="small" clearable class="plugin-dialog__search" @change="onSearch">
                        <template #prefix-icon><t-icon name="search" /></template>
                    </t-input>
                </div>
            </div>

            <!-- 分类标签栏 -->
            <div v-if="activeTab === 'inner'" class="plugin-dialog__cat-bar">
                <span v-for="cat in categories" :key="cat.value"
                    :class="['plugin-dialog__cat-tag', { 'is-active': activeCategory === cat.value }]"
                    @click="activeCategory = cat.value">{{ cat.label }}</span>
            </div>

            <!-- 卡片列表 -->
            <div v-if="loading" class="plugin-dialog__loading"><t-loading size="large" text="加载中..." /></div>
            <div v-else-if="filteredCardList.length === 0" class="plugin-dialog__empty">暂无数据</div>
            <div v-else class="plugin-dialog__list">
                <div v-for="item in filteredCardList" :key="itemId(item)"
                    class="plugin-card"
                    :class="{ 'is-expanded': expandedId === itemId(item) }">
                    <!-- 插件主卡片 -->
                    <div class="plugin-card__main" @click="onExpand(item)">
                        <div class="plugin-card__icon-area">
                            <img v-if="itemIcon(item)" :src="itemIcon(item)" class="plugin-card__icon" @error="onIconError" />
                            <span v-else class="plugin-card__icon-fb"><t-icon name="tools" /></span>
                        </div>
                        <div class="plugin-card__info">
                            <div class="plugin-card__title-row">
                                <span class="plugin-card__name" :title="itemName(item)">{{ itemName(item) }}</span>
                                <t-tag v-if="itemFinanceType(item) === 3" color="orange" size="small">公测</t-tag>
                                <t-tag v-if="itemFinanceType(item) === 2" color="purple" size="small">付费</t-tag>
                                <t-tag v-if="getCreateTypeLabel(item)" color="gray" size="small">{{ getCreateTypeLabel(item) }}</t-tag>
                                <t-tag v-if="itemCategory(item)" color="gray" size="small">{{ itemCategory(item) }}</t-tag>
                                <span v-if="itemStatus(item) === 2" class="plugin-card__error-dot">不可用</span>
                            </div>
                            <div class="plugin-card__desc" :title="itemDesc(item)">{{ itemDesc(item) }}</div>
                            <div class="plugin-card__footer">
                                <span v-if="itemCreator(item)" class="plugin-card__author">@{{ itemCreator(item) }}</span>
                                <span v-if="itemCreator(item)" class="plugin-card__sep">|</span>
                                <span class="plugin-card__tool-count">含{{ itemToolCount(item) }}个工具</span>
                                <span class="plugin-card__sep">|</span>
                                <span class="plugin-card__fav" @click.stop="onToggleFav(item)">
                                    <t-icon :name="item.IsFavorite || item.is_favorite ? 'star-filled' : 'star'" :style="{ color: (item.IsFavorite || item.is_favorite) ? '#f8c544' : 'var(--td-text-color-placeholder)', fontSize: '14px' }" />
                                    {{ (item.IsFavorite || item.is_favorite) ? '已收藏' : '收藏' }}
                                </span>
                                <template v-if="getCreateType(item) === 2">
                                    <span class="plugin-card__sep">|</span>
                                    <span class="plugin-card__refresh" :class="{ 'is-loading': item._toolsLoading }" @click.stop="onUpdatePlugin(item)">
                                        <t-icon name="refresh" :style="{ fontSize: '14px' }" />
                                        更新
                                    </span>
                                </template>
                            </div>
                        </div>
                        <div class="plugin-card__right">
                            <template v-if="itemStatus(item) !== 2">
                                <span v-if="checkIsAllAdd(item)" class="plugin-card__added-text">已全部添加</span>
                                <t-button v-else size="small" variant="text" theme="primary"
                                    :loading="addingKey === `plugin-${itemId(item)}`"
                                    :disabled="!!addingKey && addingKey !== `plugin-${itemId(item)}`"
                                    @click.stop="onAddAll(item)">全部添加</t-button>
                            </template>
                        </div>
                        <div class="plugin-card__expand-arrow">
                            <t-icon :class="['plugin-card__arrow-icon', { 'is-expanded': expandedId === itemId(item) }]" name="chevron-down" />
                        </div>
                        <!-- 精选标记 -->
                        <div v-if="item.IsFeatured" class="plugin-card__featured">
                            <t-icon name="verified" :style="{ fontSize: '14px', color: 'var(--td-brand-color)' }" />
                            精选
                        </div>
                    </div>

                    <!-- 展开的子工具列表 -->
                    <template v-if="expandedId === itemId(item)">
                        <!-- 正常状态：展示子工具 -->
                        <div v-if="itemStatus(item) !== 2" class="plugin-card__expand">
                            <div v-for="tool in getItemTools(item)" :key="getToolId(tool)" class="plugin-card__tool-item">
                                <div class="plugin-card__tool-content">
                                    <div class="plugin-card__tool-title-row">
                                        <span class="plugin-card__tool-name">{{ getToolName(tool) }}</span>
                                        <t-tag v-if="getToolFinanceType(tool) === 3" color="orange" size="small">公测</t-tag>
                                        <t-tag v-if="getToolFinanceType(tool) === 2" color="purple" size="small">付费</t-tag>
                                    </div>
                                    <div class="plugin-card__tool-desc" :title="getToolDesc(tool)">{{ getToolDesc(tool) }}</div>
                                    <div v-if="getToolTags(tool).length > 0" class="plugin-card__tool-tags">
                                        <t-tag v-for="(tag, idx) in getToolTags(tool)" :key="idx" size="small" variant="light">{{ tag }}</t-tag>
                                    </div>
                                </div>
                                <div class="plugin-card__tool-action">
                                    <template v-if="isToolAdded(tool)">
                                        <t-button size="small" variant="outline" theme="default" disabled>已添加</t-button>
                                        <t-button size="small" variant="text" theme="danger"
                                            :loading="addingKey === `del-${getToolId(tool)}`"
                                            :disabled="!!addingKey && addingKey !== `del-${getToolId(tool)}`"
                                            @click.stop="onDeleteTool(item, tool)">删除</t-button>
                                    </template>
                                    <t-button v-else size="small" variant="outline" theme="primary"
                                        :loading="addingKey === `tool-${getToolId(tool)}`"
                                        :disabled="!!addingKey && addingKey !== `tool-${getToolId(tool)}`"
                                        @click.stop="onAddSingle(item, tool)">添加</t-button>
                                </div>
                            </div>
                            <div v-if="getItemTools(item).length === 0" class="plugin-card__tool-empty">暂无工具信息</div>
                        </div>
                        <!-- 不可用状态 -->
                        <div v-else class="plugin-card__expand plugin-card__expand--error">
                            <t-icon name="error-circle-filled" :style="{ color: 'var(--td-error-color)', fontSize: '16px' }" />
                            <span>该 server 已失效，无法拉取到相应内容</span>
                        </div>
                    </template>
                </div>
            </div>

            <t-pagination v-if="total > pageSize" v-model="pageNumber" :total="total" :page-size="pageSize" size="small" class="plugin-dialog__pagination" @change="fetchList" />
        </div>

        <!-- MCP 字段填写弹窗 -->
        <McpFieldDialog
            v-model="showFieldDialog"
            :required-headers="fieldDialogHeaders"
            :required-query="fieldDialogQuery"
            @confirm="(e: any) => onFieldConfirm(e)"
            @cancel="onFieldCancel"
        />
    </t-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
    Dialog as TDialog, Button as TButton, Tag as TTag, Loading as TLoading, Icon as TIcon,
    Tabs as TTabs, TabPanel as TTabPanel, Input as TInput, Checkbox as TCheckbox,
    Pagination as TPagination, Popup as TPopup, MessagePlugin,
} from 'tdesign-vue-next';
import {
    fetchPluginList, fetchPluginCategories, PluginClassEnum,
    bindAgentTool, unbindAgentTool, buildToolConfig, buildPluginConfig,
} from '../../service/connectorPluginApi';
import McpFieldDialog from './McpFieldDialog.vue';

interface Props {
    modelValue: boolean;
    applicationId?: string;
    /** Agent ID（从 useAgentStore 获取） */
    agentId?: string;
    /** 已安装的工具 ID 列表，用于判断"已添加"状态 */
    installedToolIds?: string[];
}
const props = withDefaults(defineProps<Props>(), { modelValue: false, applicationId: '', agentId: '', installedToolIds: () => [] });
const emit = defineEmits<{
    (e: 'update:modelValue', v: boolean): void;
    /** 全部添加（整个插件）— 接口调用完毕后 emit */
    (e: 'install', item: Record<string, unknown>): void;
    /** 单个工具添加 — 接口调用完毕后 emit */
    (e: 'install-tool', payload: { plugin: Record<string, unknown>; tool: Record<string, unknown> }): void;
    /** 绑定成功后通知父组件刷新数据 */
    (e: 'installed'): void;
}>();

const visible = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) });
const activeTab = ref('inner');
const activeCategory = ref('all');
const filterFavorite = ref(false);
const filterVisible = ref(false);
const searchKeyword = ref('');
const selectedSort = ref(3);
const loading = ref(false);
const cardList = ref<Record<string, unknown>[]>([]);
/** 过滤掉需要填写 MCP Header/Query 字段的插件 */
const filteredCardList = computed(() => cardList.value.filter(item => !checkNeedFillFields(item)));
const pageNumber = ref(1);
const pageSize = 12;
const total = ref(0);
const expandedId = ref('');
const categories = ref<Array<{ label: string; value: string }>>([{ label: '全部', value: 'all' }]);
const sortOptions = [{ label: '默认排序', value: 3 }, { label: '按热门排序', value: 4 }, { label: '按更新时间排序', value: 2 }];
const sortLabel = computed(() => sortOptions.find(o => o.value === selectedSort.value)?.label || '默认排序');
const sortIcon = computed(() => { if (selectedSort.value === 4) return 'chart-bubble'; if (selectedSort.value === 2) return 'time'; return 'swap'; });

/** 本次会话中已添加的 toolId（乐观更新留痕） */
const localAddedToolIds = ref<Set<string>>(new Set());

const filterValue = ref<Record<string, number[]>>({
    plugintypes: [1, 2], financetypes: [2, 3, 0], createtypes: [2, 0, 1, 3],
});

const filterGroups = ref([
    { key: 'financetypes', title: '付费方式', options: [{ text: '官方收费', value: 2 }, { text: '公测', value: 3 }, { text: '其他', value: 0 }] },
    { key: 'plugintypes', title: '来源', options: [{ text: '官方工具', value: 1 }, { text: '三方工具', value: 2 }] },
    { key: 'createtypes', title: '类型', options: [{ text: 'MCP类', value: 2 }, { text: 'API类', value: 0 }, { text: '代码类', value: 1 }, { text: '应用类', value: 3 }] },
]);

const filterLabel = computed(() => {
    const count = Object.values(filterValue.value).reduce((s, a) => s + a.length, 0);
    return count > 0 ? `已选 ${count} 项` : '全部';
});

function isFilterChecked(key: string, val: number) { return (filterValue.value[key] || []).includes(val); }
function onFilterCheck(key: string, val: number, checked: boolean) {
    const arr = filterValue.value[key] || [];
    if (checked && !arr.includes(val)) arr.push(val);
    else if (!checked) { const idx = arr.indexOf(val); if (idx > -1) arr.splice(idx, 1); }
    filterValue.value = { ...filterValue.value, [key]: arr };
    doReset();
}

/* ===== 数据提取辅助函数 ===== */
let searchTimer: ReturnType<typeof setTimeout> | null = null;
function itemId(i: Record<string, unknown>) { return ((i.plugin_id || i.PluginId) as string) || ''; }
function itemIcon(i: Record<string, unknown>) { return (i.icon_url || i.IconUrl || '') as string; }
function itemName(i: Record<string, unknown>) { return (i.plugin_name || i.PluginName || i.Name || '') as string; }
function itemDesc(i: Record<string, unknown>) { return (i.plugin_desc || i.PluginDesc || i.Desc || '') as string; }
function itemCreator(i: Record<string, unknown>) { return ((i.UserInfo as Record<string, unknown>)?.Name || i.creator || i.Creator || '') as string; }
function itemCategory(i: Record<string, unknown>) { return (i.CategoryKey || i.category_key || '') as string; }
function itemFinanceType(i: Record<string, unknown>) { return (i.FinanceType || i.finance_type || 0) as number; }
function itemStatus(i: Record<string, unknown>) { return (i.Status || i.status || 0) as number; }
function getCreateType(i: Record<string, unknown>) { return (i.CreateType || i.create_type || 0) as number; }
function getCreateTypeLabel(i: Record<string, unknown>) { const t = getCreateType(i); if (t === 2) return 'MCP'; if (t === 0) return 'API'; if (t === 1) return '代码'; if (t === 3) return '应用'; return ''; }
function getItemTools(i: Record<string, unknown>): Record<string, unknown>[] { return ((i.tools || i.Tools || i.ToolList) as Record<string, unknown>[] | undefined) || []; }
function itemToolCount(i: Record<string, unknown>) { const tools = getItemTools(i); return tools.length > 0 ? tools.length : ((i.tool_count || i.ToolCount || 0) as number); }
function onIconError(e: Event) { (e.target as HTMLImageElement).style.display = 'none'; }

/* ===== 子工具数据提取 ===== */
function getToolId(t: Record<string, unknown>) { return ((t.ToolId || t.tool_id || t.id) as string) || ''; }
function getToolName(t: Record<string, unknown>) { return ((t.Name || t.ToolName || t.tool_name || t.name) as string) || ''; }
function getToolDesc(t: Record<string, unknown>) { return ((t.Desc || t.ToolDesc || t.tool_desc || t.description) as string) || ''; }
function getToolFinanceType(t: Record<string, unknown>) { return (t.FinanceType || t.finance_type || 0) as number; }
function getToolTags(t: Record<string, unknown>): string[] {
    const body = (t.Body || t.body || []) as Array<Record<string, unknown>>;
    return body.map(tag => ((tag.Name || tag.name) as string) || '').filter(Boolean);
}

/* ===== 已添加状态 ===== */
function isToolAdded(tool: Record<string, unknown>): boolean {
    const tid = getToolId(tool);
    if (!tid) return false;
    return props.installedToolIds.includes(tid) || localAddedToolIds.value.has(tid);
}
function checkIsAllAdd(item: Record<string, unknown>): boolean {
    const tools = getItemTools(item);
    if (tools.length === 0) return false;
    return tools.every(t => isToolAdded(t));
}

/* ===== API 交互 ===== */
async function fetchCategories() {
    if (!props.applicationId) return;
    try {
        const result = await fetchPluginCategories({ applicationId: props.applicationId, pluginClass: 0 });
        categories.value = [{ label: '全部', value: 'all' }, ...result.categories.map(c => ({ label: c.category_name, value: c.category_key }))];
    } catch (e) { console.error(e); }
}

async function fetchList() {
    if (!props.applicationId) return;
    loading.value = true;
    try {
        const result = await fetchPluginList({
            applicationId: props.applicationId, pluginClass: PluginClassEnum.NORMAL,
            query: searchKeyword.value || undefined, pageNumber: pageNumber.value, pageSize,
            sortType: selectedSort.value,
            categoryKeys: activeCategory.value !== 'all' ? [activeCategory.value] : [],
            favoriteOnly: filterFavorite.value,
            pluginTypes: activeTab.value === 'custom' ? [0] : (filterValue.value.plugintypes || []).length > 0 ? filterValue.value.plugintypes! : [1, 2],
            financeTypeList: activeTab.value === 'custom' ? undefined : (filterValue.value.financetypes || []).length > 0 ? filterValue.value.financetypes : undefined,
            createTypes: activeTab.value === 'custom' ? undefined : (filterValue.value.createtypes || []).length > 0 ? filterValue.value.createtypes : undefined,
        });
        cardList.value = result.plugins; total.value = result.total;
    } catch (e) { console.error(e); } finally { loading.value = false; }
}

/* ===== 事件处理 ===== */
function doReset() { pageNumber.value = 1; fetchList(); }
function onSearch() { if (searchTimer) clearTimeout(searchTimer); searchTimer = setTimeout(doReset, 300); }
function onTabChange() { activeCategory.value = 'all'; filterFavorite.value = false; filterValue.value = { plugintypes: [1, 2], financetypes: [2, 3, 0], createtypes: [2, 0, 1, 3] }; searchKeyword.value = ''; selectedSort.value = 3; doReset(); }
function onExpand(item: Record<string, unknown>) { const id = itemId(item); expandedId.value = expandedId.value === id ? '' : id; }

/** 正在执行绑定的按钮 key */
const addingKey = ref('');

async function doBindAgentTool(pluginItem: Record<string, unknown>, toolItems: Record<string, unknown>[]) {
    if (!props.applicationId || !props.agentId) {
        throw new Error('缺少应用 ID 或 Agent ID，无法绑定工具');
    }
    const pluginId = (pluginItem.PluginId || pluginItem.plugin_id || '') as string;
    const pluginClass = Number(pluginItem.PluginClass || pluginItem.plugin_class || 0);
    const isConnector = pluginClass === 1;
    const toolList = isConnector ? undefined : toolItems.map(t => buildToolConfig(pluginItem, t));
    const plugin = buildPluginConfig(pluginItem);

    await bindAgentTool({
        applicationId: props.applicationId,
        appId: props.applicationId,
        agentId: props.agentId,
        pluginId,
        toolSource: Number(toolItems[0]?.ToolSource || toolItems[0]?.tool_source || 0),
        toolList,
        plugin,
    });
}

/* ===== MCP 字段填写弹窗 ===== */
const showFieldDialog = ref(false);
const fieldDialogHeaders = ref<Record<string, unknown>[]>([]);
const fieldDialogQuery = ref<Record<string, unknown>[]>([]);
/** 待完成绑定的上下文（字段填写确认后使用） */
let pendingFieldAction: { plugin: Record<string, unknown>; tools: Record<string, unknown>[]; mode: 'all' | 'single' } | null = null;

/**
 * 检查插件是否需要先填写 MCP Headers/Query
 * MCP 类（CreateType===2）且有未填写的 required headers/query 时需要
 * API 类（CreateType===0）且支持 CAM 授权（AuthType===2）时需要
 */
function checkNeedFillFields(plugin: Record<string, unknown>): boolean {
    const createType = Number(plugin.CreateType || plugin.create_type || 0);
    const authType = Number(plugin.AuthType || plugin.auth_type || 0);
    if (createType === 2) {
        const headers = getRequiredHeaders(plugin);
        const query = getRequiredQuery(plugin);
        return (headers.length + query.length) > 0;
    }
    if (authType === 2 && createType === 0) {
        return true;
    }
    return false;
}

function getRequiredHeaders(plugin: Record<string, unknown>): Record<string, unknown>[] {
    const headers = (plugin.Headers || plugin.headers || []) as Record<string, unknown>[];
    return headers.filter(h => {
        const hasValue = !!(h.ParamValue || h.param_value);
        const hasInput = !!(h.Input || h.input);
        const hidden = !!(h.GlobalHidden || h.global_hidden);
        return (!hasValue || !hasInput) && !hidden;
    });
}

function getRequiredQuery(plugin: Record<string, unknown>): Record<string, unknown>[] {
    const query = (plugin.Query || plugin.query || []) as Record<string, unknown>[];
    return query.filter(q => {
        const hasValue = !!(q.ParamValue || q.param_value);
        const hasInput = !!(q.Input || q.input);
        const hidden = !!(q.GlobalHidden || q.global_hidden);
        return (!hasValue || !hasInput) && !hidden;
    });
}

function onFieldConfirm(payload: { headers: Array<Record<string, unknown>>; query: Array<Record<string, unknown>> }) {
    if (!pendingFieldAction) return;
    const { plugin, tools, mode } = pendingFieldAction;
    pendingFieldAction = null;
    /* 将填写结果写回插件对象 */
    plugin.Headers = payload.headers;
    plugin.Query = payload.query;
    if (mode === 'all') {
        doAddAllAfterFields(plugin, tools);
    } else if (tools[0]) {
        doAddSingleAfterFields(plugin, tools[0]);
    }
}

function onFieldCancel() {
    pendingFieldAction = null;
}

async function doAddAllAfterFields(item: Record<string, unknown>, tools: Record<string, unknown>[]) {
    const key = `plugin-${itemId(item)}`;
    addingKey.value = key;
    try {
        await doBindAgentTool(item, tools);
        tools.forEach(t => { const tid = getToolId(t); if (tid) localAddedToolIds.value.add(tid); });
        emit('install', item);
        emit('installed');
        MessagePlugin.success('已添加');
    } catch (e) {
        console.error('[BindAgentTool] 绑定失败:', e);
        MessagePlugin.error('工具绑定失败');
    } finally {
        addingKey.value = '';
    }
}

async function doAddSingleAfterFields(plugin: Record<string, unknown>, tool: Record<string, unknown>) {
    const tid = getToolId(tool);
    const key = `tool-${tid}`;
    addingKey.value = key;
    try {
        await doBindAgentTool(plugin, [tool]);
        if (tid) localAddedToolIds.value.add(tid);
        emit('install-tool', { plugin, tool });
        emit('installed');
        MessagePlugin.success('已添加');
    } catch (e) {
        console.error('[BindAgentTool] 绑定失败:', e);
        MessagePlugin.error('工具绑定失败');
    } finally {
        addingKey.value = '';
    }
}

async function onAddAll(item: Record<string, unknown>) {
    if (addingKey.value) return;
    const tools = getItemTools(item).filter(t => !isToolAdded(t));
    if (tools.length === 0) {
        MessagePlugin.info('所有工具已添加');
        return;
    }
    if (checkNeedFillFields(item) && !props.installedToolIds.some(tid => getItemTools(item).map(getToolId).includes(tid))) {
        fieldDialogHeaders.value = getRequiredHeaders(item);
        fieldDialogQuery.value = getRequiredQuery(item);
        pendingFieldAction = { plugin: item, tools, mode: 'all' };
        showFieldDialog.value = true;
        return;
    }
    doAddAllAfterFields(item, tools);
}

async function onAddSingle(plugin: Record<string, unknown>, tool: Record<string, unknown>) {
    if (addingKey.value) return;
    if (checkNeedFillFields(plugin) && !props.installedToolIds.some(tid => getItemTools(plugin).map(getToolId).includes(tid))) {
        fieldDialogHeaders.value = getRequiredHeaders(plugin);
        fieldDialogQuery.value = getRequiredQuery(plugin);
        pendingFieldAction = { plugin, tools: [tool], mode: 'single' };
        showFieldDialog.value = true;
        return;
    }
    doAddSingleAfterFields(plugin, tool);
}

async function onDeleteTool(plugin: Record<string, unknown>, tool: Record<string, unknown>) {
    const tid = getToolId(tool);
    const key = `del-${tid}`;
    if (addingKey.value) return;
    addingKey.value = key;
    try {
        if (!props.applicationId || !props.agentId) {
            MessagePlugin.warning('缺少应用 ID 或 Agent ID，无法删除工具');
            return;
        }
        const pluginId = (plugin.PluginId || plugin.plugin_id || '') as string;
        await unbindAgentTool({
            applicationId: props.applicationId,
            appId: props.applicationId,
            agentId: props.agentId,
            pluginId,
            toolId: tid,
        });
        localAddedToolIds.value.delete(tid);
        emit('installed');
        MessagePlugin.success('已删除');
    } catch (e) {
        console.error('[UnbindAgentTool] 解绑失败:', e);
        MessagePlugin.error('工具删除失败');
    } finally {
        addingKey.value = '';
    }
}

function onToggleFav(item: Record<string, unknown>) {
    if (item.IsFavorite !== undefined) { item.IsFavorite = !item.IsFavorite; }
    else { item.is_favorite = !item.is_favorite; }
}

async function onUpdatePlugin(item: Record<string, unknown>) {
    if (item._toolsLoading) return;
    item._toolsLoading = true;
    try {
        await fetchList();
        MessagePlugin.success('已更新工具列表');
    } catch (e) {
        console.error(e);
    } finally {
        item._toolsLoading = false;
    }
}

/* ===== Watchers ===== */
watch(activeCategory, () => { doReset(); });
watch(() => props.modelValue, (val) => {
    if (val) {
        activeTab.value = 'inner';
        activeCategory.value = 'all';
        filterFavorite.value = false;
        filterValue.value = { plugintypes: [1, 2], financetypes: [2, 3, 0], createtypes: [2, 0, 1, 3] };
        searchKeyword.value = '';
        selectedSort.value = 3;
        pageNumber.value = 1;
        expandedId.value = '';
        localAddedToolIds.value = new Set();
        fetchCategories();
        fetchList();
    }
});
</script>

<style scoped>
.plugin-dialog { display: flex; flex-direction: column; gap: 12px; height: 560px; overflow: hidden; }
.plugin-dialog__header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.plugin-dialog__tabs { flex-shrink: 0; }
.plugin-dialog__actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.plugin-dialog__sort-btn { width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 4px; transition: background 0.15s; color: var(--td-text-color-secondary); }
.plugin-dialog__sort-btn:hover { background: var(--td-bg-color-container-active); }
.plugin-dialog__sort-menu { padding: 4px; min-width: 140px; }
.plugin-dialog__sort-item { padding: 6px 12px; font-size: 13px; cursor: pointer; border-radius: 4px; }
.plugin-dialog__sort-item:hover { background: var(--td-bg-color-container-active); }
.plugin-dialog__sort-item.is-selected { color: var(--td-brand-color); font-weight: 500; }
.plugin-dialog__filter-trigger { display: inline-flex; align-items: center; height: 28px; padding: 0 8px; font-size: 12px; color: var(--td-text-color-secondary); border: 1px solid var(--td-component-border); border-radius: 4px; cursor: pointer; white-space: nowrap; background: var(--td-bg-color-container); min-width: 100px; }
.plugin-dialog__filter-trigger:hover { border-color: var(--td-brand-color); }
.plugin-dialog__filter-panel { padding: 8px; min-width: 200px; max-height: 300px; overflow-y: auto; }
.plugin-dialog__filter-group { margin-bottom: 8px; }
.plugin-dialog__filter-group-title { font-size: 12px; font-weight: 500; color: var(--td-text-color-secondary); padding: 4px 0; }
.plugin-dialog__filter-option { padding: 2px 0; }
.plugin-dialog__search { width: 160px; }
.plugin-dialog__cat-bar { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; flex-shrink: 0; }
.plugin-dialog__cat-bar::-webkit-scrollbar { display: none; }
.plugin-dialog__cat-tag { flex-shrink: 0; padding: 4px 12px; font-size: 12px; border-radius: 16px; cursor: pointer; color: var(--td-text-color-secondary); background: var(--td-bg-color-secondarycontainer); white-space: nowrap; transition: all 0.2s; }
.plugin-dialog__cat-tag:hover { color: var(--td-brand-color); background: var(--td-brand-color-light); }
.plugin-dialog__cat-tag.is-active { color: #fff; background: var(--td-brand-color); font-weight: 500; }
.plugin-dialog__loading { display: flex; justify-content: center; padding: 48px 0; }
.plugin-dialog__empty { text-align: center; padding: 48px 0; color: var(--td-text-color-placeholder); font-size: 14px; }
.plugin-dialog__list { display: flex; flex-direction: column; flex: 1; overflow-y: auto; min-height: 0; gap: 12px; padding-right: 4px; }
.plugin-dialog__list::-webkit-scrollbar { width: 4px; }
.plugin-dialog__list::-webkit-scrollbar-thumb { border-radius: 2px; background: rgba(17, 32, 70, 0.13); }
.plugin-dialog__pagination { display: flex; justify-content: center; flex-shrink: 0; }

/* 插件卡片 */
.plugin-card { border-radius: var(--td-radius-large); border: 1px solid var(--td-component-border); background: var(--td-bg-color-container); box-shadow: 0 4px 16px rgba(0, 55, 159, 0.04); transition: box-shadow 0.2s; position: relative; }
.plugin-card:hover { box-shadow: 0 4px 24px rgba(0, 55, 159, 0.10); }
.plugin-card.is-expanded { border-color: var(--td-brand-color); }
.plugin-card__main { display: flex; align-items: flex-start; gap: 16px; padding: 16px; cursor: pointer; position: relative; }
.plugin-card__icon-area { padding-top: 2px; flex-shrink: 0; }
.plugin-card__icon { width: 40px; height: 40px; border-radius: var(--td-radius-large); object-fit: cover; border: 1px solid var(--td-component-border); box-sizing: border-box; }
.plugin-card__icon-fb { width: 40px; height: 40px; border-radius: var(--td-radius-large); display: inline-flex; align-items: center; justify-content: center; color: var(--td-text-color-secondary); background: var(--td-bg-color-secondarycontainer); border: 1px solid var(--td-component-border); box-sizing: border-box; }
.plugin-card__info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.plugin-card__title-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.plugin-card__name { font-size: 14px; font-weight: 500; color: var(--td-text-color-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 300px; }
.plugin-card__error-dot { font-size: 12px; color: var(--td-error-color); padding-left: 12px; position: relative; }
.plugin-card__error-dot::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 8px; height: 8px; border-radius: 50%; background: var(--td-error-color); }
.plugin-card__desc { font-size: 12px; color: var(--td-text-color-placeholder); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.plugin-card__footer { display: flex; align-items: center; gap: 6px; width: 100%; font-size: 12px; color: var(--td-text-color-placeholder); flex-wrap: wrap; }
.plugin-card__author { color: var(--td-text-color-secondary); }
.plugin-card__sep { color: var(--td-component-border); }
.plugin-card__tool-count { color: var(--td-brand-color); }
.plugin-card__fav { cursor: pointer; display: inline-flex; align-items: center; gap: 2px; transition: color 0.15s; }
.plugin-card__fav:hover { color: var(--td-text-color-primary); }
.plugin-card__refresh { cursor: pointer; display: inline-flex; align-items: center; gap: 2px; transition: color 0.15s; }
.plugin-card__refresh:hover { color: var(--td-brand-color); }
.plugin-card__refresh.is-loading { opacity: 0.5; pointer-events: none; }
.plugin-card__right { flex-shrink: 0; display: flex; align-items: center; padding-top: 8px; }
.plugin-card__added-text { font-size: 12px; color: var(--td-text-color-placeholder); white-space: nowrap; }
.plugin-card__expand-arrow { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); }
.plugin-card__arrow-icon { transition: transform 0.3s; color: var(--td-text-color-placeholder); font-size: 12px; }
.plugin-card__arrow-icon.is-expanded { transform: rotate(180deg); }
.plugin-card__featured { position: absolute; top: 0; right: 0; padding: 2px 8px; font-size: 12px; color: var(--td-brand-color); background: var(--td-brand-color-light); border-radius: 0 var(--td-radius-large) 0 8px; display: flex; align-items: center; gap: 2px; }

/* 展开的子工具区域 */
.plugin-card__expand { border-top: 1px solid var(--td-component-border); padding: 12px 16px 12px 72px; display: flex; flex-direction: column; gap: 8px; background: var(--td-bg-color-secondarycontainer); border-radius: 0 0 var(--td-radius-large) var(--td-radius-large); }
.plugin-card__expand--error { flex-direction: row; align-items: center; gap: 8px; color: var(--td-error-color); font-size: 13px; }
.plugin-card__tool-item { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 8px 0; border-bottom: 1px solid var(--td-component-border); }
.plugin-card__tool-item:last-child { border-bottom: none; }
.plugin-card__tool-content { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.plugin-card__tool-title-row { display: flex; align-items: center; gap: 6px; }
.plugin-card__tool-name { font-size: 13px; font-weight: 500; color: var(--td-text-color-primary); }
.plugin-card__tool-desc { font-size: 12px; color: var(--td-text-color-placeholder); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.plugin-card__tool-tags { display: flex; gap: 4px; flex-wrap: wrap; }
.plugin-card__tool-action { flex-shrink: 0; padding-top: 2px; display: flex; align-items: center; gap: 4px; }
.plugin-card__tool-empty { font-size: 12px; color: var(--td-text-color-placeholder); text-align: center; padding: 8px 0; }
</style>
