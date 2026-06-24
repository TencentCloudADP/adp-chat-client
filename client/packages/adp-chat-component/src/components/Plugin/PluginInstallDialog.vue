<template>
    <t-dialog
        v-model:visible="visible"
        header="添加工具"
        :footer="false"
        :close-on-overlay-click="false"
        width="min(900px, calc(100vw - 40px))"
    >
        <div class="plugin-dialog">
            <!-- Tab 切换栏（分割线样式） -->
            <div class="plugin-dialog__header">
                <DividerTabs v-model="activeTab" :options="tabOptions" @update:model-value="onTabChange" />
                <div class="plugin-dialog__actions">
                    <t-checkbox v-model="filterFavorite" @change="doReset">收藏</t-checkbox>
                    
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
                    <t-input v-model="searchKeyword" placeholder="搜索工具"  clearable class="plugin-dialog__search" @change="onSearch">
                        <template #prefix-icon><CustomizedIcon  remote name="basic_search_line" size="xs" :show-hover-bg="false" :theme="theme" /></template>
                    </t-input>
                    <t-popup trigger="click" placement="bottom-right">
                        <t-tooltip :content="sortLabel" placement="top"><span class="plugin-dialog__sort-btn">
                            <CustomizedIcon remote :name="sortIcon" size="s" :show-hover-bg="false" :theme="theme" />
                        </span></t-tooltip>
                        <template #content>
                            <div class="plugin-dialog__sort-menu">
                                <t-tag v-for="opt in sortOptions" :key="opt.value"
                                    :variant="selectedSort === opt.value ? 'dark' : 'light'"
                                    :theme="selectedSort === opt.value ? 'primary' : 'default'"
                                    class="plugin-dialog__sort-item"
                                    shape="square"
                                    @click="selectedSort = opt.value; doReset()">
                                    {{ opt.label }}
                                </t-tag>
                            </div>
                        </template>
                    </t-popup>
                </div>
            </div>

            <!-- 分类标签栏 -->
            <div v-if="activeTab === 'inner'" class="plugin-dialog__categories-wrapper">
                <div ref="categoriesRef" class="plugin-dialog__categories" @scroll="updateScrollState">
                    <span v-for="cat in categories" :key="cat.value"
                        :class="['plugin-dialog__cat-tag', { 'is-active': activeCategory === cat.value }]"
                        @click="activeCategory = cat.value">{{ cat.label }}</span>
                </div>
                <div class="plugin-dialog__scroll-btns">
                    <span
                        :class="['plugin-dialog__scroll-btn', { 'is-disabled': !canScrollLeft }]"
                        @click="scrollCategories(-1)"
                    >
                        <CustomizedIcon remote name="arrow_left_small_line" size="xs" :show-hover-bg="false" :theme="theme" />
                    </span>
                    <span
                        :class="['plugin-dialog__scroll-btn', { 'is-disabled': !canScrollRight }]"
                        @click="scrollCategories(1)"
                    >
                        <CustomizedIcon remote name="arrow_right_small_line" size="xs" :show-hover-bg="false" :theme="theme" />
                    </span>
                </div>
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
                            <span v-else class="plugin-card__icon-fb"><CustomizedIcon remote name="basic_plugin_line" size="s" :show-hover-bg="false" :theme="theme" /></span>
                        </div>
                        <div class="plugin-card__info">
                            <div class="plugin-card__title-row">
                                <t-tooltip :content="itemName(item)" placement="top"><span class="plugin-card__name">{{ itemName(item) }}</span></t-tooltip>
                                <TagWithColor v-if="itemFinanceType(item) === 3" color="orange" :theme="theme">公测</TagWithColor>
                                <TagWithColor v-if="itemFinanceType(item) === 2" color="purple" icon="basic_vip_line" :theme="theme">官方收费</TagWithColor>
                                <TagWithColor v-if="getCreateTypeLabel(item)" color="gray" :theme="theme">{{ getCreateTypeLabel(item) }}</TagWithColor>
                                <TagWithColor v-if="itemCategory(item)" color="gray" :theme="theme">{{ itemCategory(item) }}</TagWithColor>
                                <span v-if="itemStatus(item) === 2" class="plugin-card__error-dot">不可用</span>
                            </div>
                            <t-tooltip :content="itemDesc(item)" placement="top"><div class="plugin-card__desc">{{ itemDesc(item) }}</div></t-tooltip>
                            <div class="plugin-card__footer">
                                <span v-if="itemCreator(item)" class="plugin-card__author">@{{ itemCreator(item) }}</span>
                                <span v-if="itemCreator(item)" class="plugin-card__sep">|</span>
                                <span class="plugin-card__tool-count">含{{ itemToolCount(item) }}个工具</span>
                                <span class="plugin-card__sep">|</span>
                                <span class="plugin-card__fav">
                                    <CustomizedIcon remote :name="item.IsFavorite || item.is_favorite ? 'basic_star_fill' : 'basic_star_line'" size="xxs" :show-hover-bg="false" :theme="theme" :color="(item.IsFavorite || item.is_favorite) ? 'var(--td-warning-color)' : 'var(--td-text-color-placeholder)'" />
                                    {{ (item.IsFavorite || item.is_favorite) ? '已收藏' : '收藏' }}
                                </span>
                                <template v-if="getCreateType(item) === 2">
                                    <span class="plugin-card__sep">|</span>
                                    <span class="plugin-card__refresh" :class="{ 'is-loading': item._toolsLoading }" @click.stop="onUpdatePlugin(item)">
                                        <CustomizedIcon remote name="basic_refresh_line" size="xxs" :show-hover-bg="false" :theme="theme" />
                                        更新
                                    </span>
                                </template>
                                <template v-if="itemStatus(item) !== 2">
                                    <span v-if="checkIsAllAdd(item)" class="plugin-card__added-text">已全部添加</span>
                                    <span v-else class="plugin-card__sep">|</span>
                                    <t-button v-if="!checkIsAllAdd(item)" variant="text" theme="primary" size="small"
                                        :loading="addingKey === `plugin-${itemId(item)}`"
                                        :disabled="!!addingKey && addingKey !== `plugin-${itemId(item)}`"
                                        @click.stop="onAddAll(item)">
                                        全部添加
                                    </t-button>
                                </template>
                            </div>
                        </div>
                        <div class="plugin-card__expand-arrow">
                            <CustomizedIcon remote :class="['plugin-card__arrow-icon', { 'is-expanded': expandedId === itemId(item) }]" name="arrow_down_line" size="xxs" :show-hover-bg="false" :theme="theme" />
                        </div>
                        <!-- 精选标记 -->
                        <div v-if="item.IsFeatured" class="plugin-card__featured">
                            <CustomizedIcon remote name="basic_official_account_line" size="xxs" :show-hover-bg="false" :theme="theme" color="var(--td-stack-color, #9b6ef9)" />
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
                                        <t-tooltip :content="getToolName(tool)" placement="top"><span class="plugin-card__tool-name">{{ getToolName(tool) }}</span></t-tooltip>
                                        <TagWithColor v-if="getToolFinanceType(tool) === 3" color="orange" :theme="theme">公测</TagWithColor>
                                        <TagWithColor v-if="getToolFinanceType(tool) === 2" color="purple" icon="basic_vip_line" :theme="theme">官方收费</TagWithColor>
                                    </div>
                                    <t-tooltip :content="getToolDesc(tool)" placement="top"><div class="plugin-card__tool-desc">{{ getToolDesc(tool) }}</div></t-tooltip>
                                    <div v-if="getToolTags(tool).length > 0" class="plugin-card__tool-tags">
                                        <TagWithColor v-for="(tag, idx) in getToolTags(tool)" :key="idx" color="gray" :theme="theme">{{ tag }}</TagWithColor>
                                    </div>
                                </div>
                                <div class="plugin-card__tool-action">
                                    <t-button v-if="isToolAdded(tool)" variant="outline" theme="default" size="small" disabled>已添加</t-button>
                                    <t-button v-else  theme="primary" size="small"
                                        :loading="addingKey === `tool-${getToolId(tool)}`"
                                        :disabled="!!addingKey && addingKey !== `tool-${getToolId(tool)}`"
                                        @click.stop="onAddSingle(item, tool)">
                                        <template #icon><CustomizedIcon color="var(--td-font-white-1)" remote name="basic_new_line" size="xxs" :show-hover-bg="false" :theme="theme" /></template>
                                        添加
                                    </t-button>
                                </div>
                            </div>
                            <div v-if="getItemTools(item).length === 0" class="plugin-card__tool-empty">暂无工具信息</div>
                        </div>
                        <!-- 不可用状态 -->
                        <div v-else class="plugin-card__expand plugin-card__expand--error">
                            <CustomizedIcon remote name="basic_error_fill" size="xxs" :show-hover-bg="false" :theme="theme" color="var(--td-error-color)" />
                            <span>该 server 已失效，无法拉取到相应内容</span>
                        </div>
                    </template>
                </div>
            </div>

            <t-pagination size="small" v-if="total > pageSize" v-model="pageNumber" :total="total" :page-size="pageSize"  class="plugin-dialog__pagination" @change="fetchList" />
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
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import {
    Dialog as TDialog, Button as TButton, Tag as TTag, Loading as TLoading,
    Input as TInput, Checkbox as TCheckbox,
    Pagination as TPagination, Popup as TPopup, Tooltip as TTooltip, MessagePlugin,
} from 'tdesign-vue-next';
import CustomizedIcon from '../CustomizedIcon.vue';
import TagWithColor from '../Common/TagWithColor.vue';
import {
    fetchPluginList, fetchPluginCategories, PluginClassEnum,
    bindAgentTool, buildToolConfig, buildPluginConfig,
} from '../../service/connectorPluginApi';
import McpFieldDialog from './McpFieldDialog.vue';
import DividerTabs from '../Common/DividerTabs.vue';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';

interface Props extends ThemeProps {
    modelValue: boolean;
    applicationId?: string;
    /** Agent ID（从 useAgentStore 获取） */
    agentId?: string;
    /** 已安装的工具 ID 列表，用于判断"已添加"状态 */
    installedToolIds?: string[];
}
const props = withDefaults(defineProps<Props>(), { ...themePropsDefaults, modelValue: false, applicationId: '', agentId: '', installedToolIds: () => [] });
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
const tabOptions = [{ label: '工具', value: 'inner' }, { label: '自定义工具', value: 'custom' }];
const activeCategory = ref('all');
const filterVisible = ref(false);
const filterFavorite = ref(false);
const searchKeyword = ref('');
const canScrollLeft = ref(false);
const canScrollRight = ref(false);
const categoriesRef = ref<HTMLDivElement | null>(null);
const selectedSort = ref(3);
const loading = ref(false);
const cardList = ref<Record<string, unknown>[]>([]);
/** 过滤掉需要填写 MCP Header/Query 字段的插件 */
const filteredCardList = computed(() => cardList.value.filter(item => !checkNeedFillFields(item)));
const pageNumber = ref(1);
const pageSize = 15;
const total = ref(0);
const expandedId = ref('');
const categories = ref<Array<{ label: string; value: string }>>([{ label: '全部', value: 'all' }]);
const sortOptions = [{ label: '默认排序', value: 3 }, { label: '按热门排序', value: 4 }, { label: '按更新时间排序', value: 2 }];
const sortLabel = computed(() => sortOptions.find(o => o.value === selectedSort.value)?.label || '默认排序');
const sortIcon = computed(() => { if (selectedSort.value === 4) return 'basic_hot_line'; if (selectedSort.value === 2) return 'basic_time_line'; return 'basic_move_v_line'; });

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
/** 分类 key → 中文名映射表 */
const categoryMap = ref<Record<string, string>>({});
function itemCategory(i: Record<string, unknown>) {
    const key = (i.CategoryKey || i.category_key || '') as string;
    return categoryMap.value[key] || key;
}
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
        const map: Record<string, string> = {};
        result.categories.forEach(c => { map[c.category_key] = c.category_name; });
        categoryMap.value = map;
        categories.value = [{ label: '全部', value: 'all' }, ...result.categories.map(c => ({ label: c.category_name, value: c.category_key }))];
        nextTick(() => updateScrollState());
    } catch (e) { console.error(e); }
}

function updateScrollState() {
    const el = categoriesRef.value;
    if (!el) return;
    nextTick(() => {
        canScrollLeft.value = el.scrollLeft > 0;
        canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
    });
}
function scrollCategories(dir: number) {
    const el = categoriesRef.value;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.6 * dir, behavior: 'smooth' });
}

onMounted(() => {
    nextTick(() => updateScrollState());
});

async function fetchList() {
    if (!props.applicationId) return;
    loading.value = true;
    try {
        const result = await fetchPluginList({
            applicationId: props.applicationId, pluginClass: PluginClassEnum.NORMAL,
            query: searchKeyword.value || undefined, pageNumber: pageNumber.value, pageSize,
            sortType: selectedSort.value,
            categoryKeys: activeCategory.value !== 'all' ? [activeCategory.value] : [],
            favoriteOnly: filterFavorite.value || undefined,
            pluginTypes: activeTab.value === 'custom' ? [0] : (filterValue.value.plugintypes || []).length > 0 ? filterValue.value.plugintypes! : [1, 2],
            financeTypeList: activeTab.value === 'custom' ? undefined : (filterValue.value.financetypes || []).length > 0 ? filterValue.value.financetypes : undefined,
            createTypes: activeTab.value === 'custom' ? undefined : (filterValue.value.createtypes || []).length > 0 ? filterValue.value.createtypes : undefined,
        });
        // 归一化收藏字段，筛选收藏时强制标记
        cardList.value = result.plugins.map((p: Record<string, unknown>) => ({
            ...p,
            is_favorite: filterFavorite.value ? true : !!(p.IsFavorite || p.is_favorite),
            IsFavorite: filterFavorite.value ? true : !!(p.IsFavorite || p.is_favorite),
        }));
        total.value = result.total;
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
@import url('../../styles/dialog-common.css');

.plugin-dialog { display: flex; flex-direction: column; gap: var(--td-comp-paddingTB-m); height: 560px; overflow-y: auto; }
.plugin-dialog__header { display: flex; align-items: center; justify-content: space-between; gap: var(--td-comp-paddingTB-m); }
.plugin-dialog__actions { display: flex; align-items: center; gap: var(--td-size-4); flex-shrink: 0; }
.plugin-dialog__sort-btn { border: 1px solid var(--td-border-level-1-color); width: var(--td-comp-size-m); height: var(--td-comp-size-m); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; border-radius: var(--td-size-2); transition: background 0.15s; color: var(--td-text-color-secondary); }
.plugin-dialog__sort-btn:hover { background: var(--td-bg-color-container-active); }
.plugin-dialog__sort-menu { display: flex; flex-wrap: wrap; gap: var(--td-size-3); padding: var(--td-size-2); min-width: 140px; }
.plugin-dialog__sort-item { cursor: pointer; }
.plugin-dialog__filter-trigger { display: inline-flex; align-items: center; height: var(--td-comp-size-m); padding: 0 var(--td-size-4); font-size: var(--td-font-size-body-medium); color: var(--td-text-color-secondary); border: 1px solid var(--td-component-border); border-radius: var(--td-radius-default); cursor: pointer; white-space: nowrap; background: var(--td-bg-color-container); min-width: 70px; box-sizing: border-box; }
.plugin-dialog__filter-trigger:hover { border-color: var(--td-brand-color); }
.plugin-dialog__filter-panel { padding: var(--td-size-4); min-width: 200px; max-height: 300px; overflow-y: auto; }
.plugin-dialog__filter-group { margin-bottom: var(--td-size-4); }
.plugin-dialog__filter-group-title { font-size: var(--td-font-size-body-small); font-weight: 500; color: var(--td-text-color-secondary); padding: var(--td-size-2) 0; }
.plugin-dialog__filter-option { padding: var(--td-size-1) 0; }
.plugin-dialog__list { display: flex; flex-direction: column; gap: var(--td-comp-paddingTB-m); padding-right: var(--td-size-2); }
.plugin-dialog__pagination { display: flex; justify-content: center; flex-shrink: 0; }

/* 插件卡片特有 */
.plugin-card { border-radius: var(--td-radius-large); border: 1px solid var(--td-component-border); background: var(--td-bg-color-container); box-shadow: 0 4px 16px rgba(0, 55, 159, 0.04); transition: box-shadow 0.2s; position: relative; }
.plugin-card:hover { box-shadow: 0 4px 24px rgba(0, 55, 159, 0.10); }
.plugin-card__main { align-items: flex-start; cursor: pointer; position: relative; }
.plugin-card__icon-area { padding-top: var(--td-size-1); flex-shrink: 0; }
.plugin-card__info { display: flex; flex-direction: column; gap: var(--td-size-2); }
.plugin-card__title-row { gap: var(--td-size-3); }
.plugin-card__error-dot { font-size: var(--td-font-size-body-small); color: var(--td-error-color); padding-left: var(--td-comp-paddingTB-m); position: relative; }
.plugin-card__error-dot::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: var(--td-size-4); height: var(--td-size-4); border-radius: 50%; background: var(--td-error-color); }
.plugin-card__sep { color: var(--td-component-border); }
.plugin-card__fav { display: inline-flex; align-items: center; gap: var(--td-size-1); }
.plugin-card__refresh { cursor: pointer; display: inline-flex; align-items: center; gap: var(--td-size-1); transition: color 0.15s; }
.plugin-card__refresh:hover { color: var(--td-brand-color); }
.plugin-card__refresh.is-loading { opacity: 0.5; pointer-events: none; }
.plugin-card__added-text { font-size: var(--td-font-size-body-small); color: var(--td-text-color-placeholder); white-space: nowrap; }
.plugin-card__expand-arrow { position: absolute; right: var(--td-size-6); top: 50%; transform: translateY(-50%); }
.plugin-card__arrow-icon { transition: transform 0.3s; color: var(--td-text-color-placeholder); font-size: var(--td-font-size-body-small); }
.plugin-card__arrow-icon.is-expanded { transform: rotate(180deg); }
.plugin-card__featured { position: absolute; top: 0; right: 0; padding: var(--td-size-2) var(--td-size-4); font-size: var(--td-font-size-body-small); line-height: var(--td-size-6); color: var(--td-stack-color, #9b6ef9); background: var(--td-stack-color-light, #f3edff); border-radius: 0 var(--td-radius-large) 0 var(--td-size-4); display: flex; align-items: center; gap: var(--td-size-1); }

/* 展开的子工具区域 */
.plugin-card__expand { border-top: 1px solid var(--td-component-border); padding: var(--td-comp-paddingTB-m) var(--td-size-6) var(--td-comp-paddingTB-m) 72px; display: flex; flex-direction: column; gap: var(--td-size-4); border-radius: 0 0 var(--td-radius-large) var(--td-radius-large); }
.plugin-card__expand--error { flex-direction: row; align-items: center; gap: var(--td-size-4); color: var(--td-error-color); font-size: var(--td-font-size-body-small); }
.plugin-card__tool-item { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--td-comp-paddingTB-m); padding: var(--td-size-4) 0; border-bottom: 1px solid var(--td-component-border); }
.plugin-card__tool-item:last-child { border-bottom: none; }
.plugin-card__tool-content { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: var(--td-size-2); }
.plugin-card__tool-title-row { display: flex; align-items: center; gap: var(--td-size-3); }
.plugin-card__tool-name { font-size: var(--td-font-size-body-small); font-weight: 500; color: var(--td-text-color-primary); }
.plugin-card__tool-desc { font-size: var(--td-font-size-body-small); color: var(--td-text-color-placeholder); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.plugin-card__tool-tags { display: flex; gap: var(--td-size-2); flex-wrap: wrap; }
.plugin-card__tool-empty { font-size: var(--td-font-size-body-small); color: var(--td-text-color-placeholder); text-align: center; padding: var(--td-size-4) 0; }

/* ── 移动端适配 ── */
@media (max-width: 600px) {
    .plugin-dialog {
        height: 60vh;
        overflow-y: auto;
        gap: var(--td-size-4);
    }
    /* 头部分两行：Tab 一行，筛选项一行 */
    .plugin-dialog__header {
        flex-wrap: wrap;
        gap: var(--td-size-4);
    }
    .plugin-dialog__actions {
        width: 100%;
        flex-wrap: wrap;
        gap: var(--td-size-2);
    }
    .plugin-dialog__search {
        flex: 1;
        min-width: 0;
    }
    .plugin-dialog__filter-trigger {
        min-width: auto;
        flex-shrink: 0;
    }
    .plugin-dialog__sort-btn {
        flex-shrink: 0;
    }
    /* 卡片：紧凑布局 */
    .plugin-card__main {
        flex-wrap: wrap;
        padding: var(--td-size-4);
        gap: var(--td-size-4);
    }
    .plugin-card__icon-area {
        padding-top: 0;
    }
    .plugin-card__icon,
    .plugin-card__icon-fb {
        width: var(--td-comp-size-m);
        height: var(--td-comp-size-m);
    }
    .plugin-card__info {
        flex-basis: calc(100% - 60px);
    }
    .plugin-card__name {
        max-width: 160px;
    }
    /* 展开箭头防止换行 */
    .plugin-card__expand-arrow {
        right: var(--td-size-4);
    }
    /* footer 紧凑 */
    .plugin-card__footer {
        gap: var(--td-size-1);
    }
    /* 展开区域缩小左内边距 */
    .plugin-card__expand {
        padding-left: var(--td-size-6);
    }
}
</style>
