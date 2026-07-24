<template>
    <t-dialog
        v-model:visible="visible"
        :header="mergedI18n.addTool"
        :footer="false"
        :close-on-overlay-click="false"
        width="min(900px, calc(100vw - 40px))"
    >
        <div class="plugin-dialog">
            <!-- Tab 切换栏（分割线样式） -->
            <div class="plugin-dialog__header">
                <DividerTabs v-model="activeTab" :options="tabOptions" @update:model-value="onTabChange" />
                <div class="plugin-dialog__actions">
                    <t-checkbox v-model="filterFavorite" @change="doReset">{{ mergedI18n.favorite }}</t-checkbox>
                    
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
                    <t-input v-model="searchKeyword" :placeholder="mergedI18n.searchTool"  clearable class="plugin-dialog__search" @change="onSearch">
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
            <div v-if="loading" class="plugin-dialog__loading"><t-loading size="small" :text="mergedI18n.loading" /></div>
            <div v-else-if="filteredCardList.length === 0" class="plugin-dialog__empty">{{ mergedI18n.noData }}</div>
            <div v-else class="plugin-dialog__list">
                <div v-for="item in filteredCardList" :key="itemId(item)"
                    class="plugin-card"
                    :class="{ 'is-expanded': isExpanded(itemId(item)) }">
                    <!-- 插件主卡片 -->
                    <div class="plugin-card__main" @click="onExpand(item)">
                        <div class="plugin-card__icon-area">
                            <img v-if="itemIcon(item)" :src="itemIcon(item)" class="plugin-card__icon" @error="onIconError" />
                            <span v-else class="plugin-card__icon-fb"><CustomizedIcon remote name="basic_plugin_line" size="s" :show-hover-bg="false" :theme="theme" /></span>
                        </div>
                        <div class="plugin-card__info">
                            <div class="plugin-card__title-row">
                                <t-tooltip :content="itemName(item)" placement="top"><span class="plugin-card__name">{{ itemName(item) }}</span></t-tooltip>
                                <TagWithColor v-if="itemFinanceType(item) === 3" color="orange" :theme="theme">{{ mergedI18n.tagBeta }}</TagWithColor>
                                <TagWithColor v-if="itemFinanceType(item) === 2" color="purple" icon="basic_vip_line" :theme="theme">{{ mergedI18n.tagOfficialPaid }}</TagWithColor>
                                <TagWithColor v-if="getCreateTypeLabel(item)" color="gray" :theme="theme">{{ getCreateTypeLabel(item) }}</TagWithColor>
                                <TagWithColor v-if="itemCategory(item)" color="gray" :theme="theme">{{ itemCategory(item) }}</TagWithColor>
                                <span v-if="itemStatus(item) === 2" class="plugin-card__error-dot">{{ mergedI18n.unavailable }}</span>
                            </div>
                            <t-tooltip :content="itemDesc(item)" placement="top"><div class="plugin-card__desc">{{ itemDesc(item) }}</div></t-tooltip>
                            <div class="plugin-card__footer">
                                <span v-if="itemCreator(item)" class="plugin-card__author">@{{ itemCreator(item) }}</span>
                                <span v-if="itemCreator(item)" class="plugin-card__sep">|</span>
                                <span class="plugin-card__tool-count">{{ formatContainsTools(itemToolCount(item)) }}</span>
                                <span class="plugin-card__sep">|</span>
                                <span class="plugin-card__fav">
                                    <CustomizedIcon remote :name="item.IsFavorite || item.is_favorite ? 'basic_star_fill' : 'basic_star_line'" size="xxs" :show-hover-bg="false" :theme="theme" :color="(item.IsFavorite || item.is_favorite) ? 'var(--td-warning-color)' : 'var(--td-text-color-placeholder)'" />
                                    {{ (item.IsFavorite || item.is_favorite) ? mergedI18n.favorited : mergedI18n.favorite }}
                                </span>
                                <template v-if="getCreateType(item) === 2">
                                    <span class="plugin-card__sep">|</span>
                                    <span class="plugin-card__refresh" :class="{ 'is-loading': isUpdating(itemId(item)) }" @click.stop="onUpdatePlugin(item)">
                                        <CustomizedIcon remote name="basic_refresh_line" size="xxs" :show-hover-bg="false" :theme="theme" />
                                        {{ mergedI18n.update }}
                                    </span>
                                </template>
                                <template v-if="itemStatus(item) !== 2">
                                    <span v-if="checkIsAllAdd(item)" class="plugin-card__added-text">{{ mergedI18n.installedAll }}</span>
                                    <span v-else class="plugin-card__sep">|</span>
                                    <t-button v-if="!checkIsAllAdd(item)" variant="text" theme="primary" size="small"
                                        :loading="addingKey === `plugin-${itemId(item)}`"
                                        :disabled="!!addingKey && addingKey !== `plugin-${itemId(item)}`"
                                        @click.stop="onAddAll(item)">
                                        {{ mergedI18n.installAll }}
                                    </t-button>
                                </template>
                            </div>
                        </div>
                        <div class="plugin-card__expand-arrow">
                            <CustomizedIcon remote :class="['plugin-card__arrow-icon', { 'is-expanded': isExpanded(itemId(item)) }]" name="arrow_down_line" size="xxs" :show-hover-bg="false" :theme="theme" />
                        </div>
                        <!-- 精选标记 -->
                        <div v-if="item.IsFeatured" class="plugin-card__featured">
                            <CustomizedIcon remote name="basic_official_account_line" size="xxs" :show-hover-bg="false" :theme="theme" color="var(--td-stack-color, #9b6ef9)" />
                            {{ mergedI18n.featured }}
                        </div>
                    </div>

                    <!-- 展开的子工具列表 -->
                    <template v-if="isExpanded(itemId(item))">
                        <!-- 正常状态：展示子工具 -->
                        <div v-if="itemStatus(item) !== 2" class="plugin-card__expand">
                            <!-- 懒加载 loading -->
                            <div v-if="isExpandLoading(itemId(item))" class="plugin-card__tool-empty">
                                <t-loading size="small" :text="mergedI18n.loadingTools" />
                            </div>
                            <!-- 懒加载失败 -->
                            <template v-else-if="isExpandError(itemId(item))">
                                <div class="plugin-card__tool-empty">
                                    {{ mergedI18n.loadToolsFailed }}
                                    <span class="plugin-card__tool-retry" @click.stop="ensurePluginTools(item)">{{ mergedI18n.clickRetry }}</span>
                                </div>
                            </template>
                            <template v-else>
                                <div v-for="tool in getItemTools(item)" :key="getToolId(tool)" class="plugin-card__tool-item">
                                    <div class="plugin-card__tool-content">
                                        <div class="plugin-card__tool-title-row">
                                            <t-tooltip :content="getToolName(tool)" placement="top"><span class="plugin-card__tool-name">{{ getToolName(tool) }}</span></t-tooltip>
                                            <TagWithColor v-if="getToolFinanceType(tool) === 3" color="orange" :theme="theme">{{ mergedI18n.tagBeta }}</TagWithColor>
                                            <TagWithColor v-if="getToolFinanceType(tool) === 2" color="purple" icon="basic_vip_line" :theme="theme">{{ mergedI18n.tagOfficialPaid }}</TagWithColor>
                                        </div>
                                        <!-- 用 flex 行容器固定宽度，inline tooltip 只在文字范围内触发 -->
                                        <div class="plugin-card__tool-desc-row">
                                            <t-tooltip :content="getToolDesc(tool)" placement="top">
                                                <span class="plugin-card__tool-desc">{{ getToolDesc(tool) }}</span>
                                            </t-tooltip>
                                        </div>
                                        <div v-if="getToolTags(tool).length > 0" class="plugin-card__tool-tags">
                                            <TagWithColor v-for="(tag, idx) in getToolTags(tool)" :key="idx" color="gray" :theme="theme">{{ tag }}</TagWithColor>
                                        </div>
                                    </div>
                                    <div class="plugin-card__tool-action">
                                        <t-button v-if="isToolAdded(tool)" variant="outline" theme="default" size="small" disabled>{{ mergedI18n.toolInstalled }}</t-button>
                                        <t-button v-else  theme="primary" size="small"
                                            :loading="addingKey === `tool-${getToolId(tool)}`"
                                            :disabled="!!addingKey && addingKey !== `tool-${getToolId(tool)}`"
                                            @click.stop="onAddSingle(item, tool)">
                                            <template #icon><CustomizedIcon color="var(--td-font-white-1)" remote name="basic_new_line" size="xxs" :show-hover-bg="false" :theme="theme" /></template>
                                            {{ mergedI18n.addBtn }}
                                        </t-button>
                                    </div>
                                </div>
                                <div v-if="getItemTools(item).length === 0" class="plugin-card__tool-empty">{{ mergedI18n.noToolInfo }}</div>
                            </template>
                        </div>
                        <!-- 不可用状态 -->
                        <div v-else class="plugin-card__expand plugin-card__expand--error">
                            <CustomizedIcon remote name="basic_error_fill" size="xxs" :show-hover-bg="false" :theme="theme" color="var(--td-error-color)" />
                            <span>{{ mergedI18n.serverInvalidError }}</span>
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
            :language="language"
            :i18n="i18n"
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
    fetchPluginList, fetchPluginCategories, fetchPluginDetail, PluginClassEnum,
    bindAgentTool, buildToolConfig, buildPluginConfig,
} from '../../service/connectorPluginApi';
import McpFieldDialog from './McpFieldDialog.vue';
import DividerTabs from '../Common/DividerTabs.vue';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
import type { SkillsI18n } from '../../model/skills';
import { defaultSkillsI18n, defaultSkillsI18nEn } from '../../model/skills';
import useAgentStore from '../../composables/useAgentStore';

interface Props extends ThemeProps {
    modelValue: boolean;
    applicationId?: string;
    /** 工作空间 ID */
    spaceId?: string;
    /** 已安装的工具 ID 列表，用于判断"已添加"状态 */
    installedToolIds?: string[];
    /**
     * 已安装工具的 (pluginId, toolId) 映射。
     * 提供此 prop 后，可以在**未懒加载工具明细**的情况下，仅依据每个插件的
     * `Statistics.ToolCount` 与该插件下已绑定工具数对比，正确显示"已全部添加"。
     * 如不传，则退化为旧行为（必须展开插件、懒加载工具明细后才能判定"已全部添加"）。
     */
    installedTools?: Array<{ pluginId: string; toolId: string }>;
    /** 国际化文本（与 SkillsPopover / Sender 共享 SkillsI18n） */
    i18n?: Partial<SkillsI18n>;
    /** 语言，决定默认中/英文本，'en-*' 走英文 */
    language?: string;
}
const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    modelValue: false,
    applicationId: '',
    spaceId: '',
    installedToolIds: () => [],
    installedTools: () => [],
    i18n: () => ({}),
    language: '',
});

/** 合并默认 + 业务方传入的 i18n（与 SkillsPopover/Sender 同源 SkillsI18n） */
const mergedI18n = computed<Required<SkillsI18n>>(() => {
    const defaults = props.language?.startsWith('en') ? defaultSkillsI18nEn : defaultSkillsI18n;
    return { ...defaults, ...props.i18n };
});

/** 工具数量本地化（处理「含 N 个工具」/「Contains N tool(s)」占位符） */
function formatContainsTools(count: number): string {
    return (mergedI18n.value.containsNTools || '').replace('{count}', String(count));
}
const { getAgentIdByAppId } = useAgentStore();
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
const tabOptions = computed(() => [
    { label: mergedI18n.value.tabInner, value: 'inner' },
    { label: mergedI18n.value.tabCustom, value: 'custom' },
]);
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
/**
 * 当前已展开的插件 ID 集合（支持同时展开多个插件，互不影响）。
 * 使用 Set 而非数组：插入/移除/判存均为 O(1)。
 */
const expandedIds = ref<Set<string>>(new Set());
/** 模板友好的 helper：判断某 pluginId 是否处于展开态 */
function isExpanded(id: string): boolean {
    return expandedIds.value.has(id);
}
/**
 * 子工具懒加载缓存（pluginId -> Tool[]）。
 * DescribePluginSummaryList 不返回工具明细，需在展开卡片时按需通过 DescribePlugin 拉取。
 */
const toolDetailCache = ref<Map<string, Record<string, unknown>[]>>(new Map());
/** 正在通过 DescribePlugin 拉取工具的 pluginId 集合（多展开模式下每张卡独立 loading） */
const expandLoadingIds = ref<Set<string>>(new Set());
/** 拉取失败的 pluginId 集合（每张卡独立错误态） */
const expandErrorIds = ref<Set<string>>(new Set());
/** 正在执行"更新"操作的 pluginId 集合（per-card，互不阻塞） */
const updatingIds = ref<Set<string>>(new Set());
function isUpdating(id: string): boolean { return updatingIds.value.has(id); }
function isExpandLoading(id: string): boolean { return expandLoadingIds.value.has(id); }
function isExpandError(id: string): boolean { return expandErrorIds.value.has(id); }
const categories = ref<Array<{ label: string; value: string }>>([{ label: defaultSkillsI18n.categoryAll, value: 'all' }]);
const sortOptions = computed(() => [
    { label: mergedI18n.value.sortDefault, value: 3 },
    { label: mergedI18n.value.sortHot, value: 4 },
    { label: mergedI18n.value.sortUpdateTime, value: 2 },
]);
const sortLabel = computed(() => sortOptions.value.find(o => o.value === selectedSort.value)?.label || mergedI18n.value.sortDefault);
const sortIcon = computed(() => { if (selectedSort.value === 4) return 'basic_hot_line'; if (selectedSort.value === 2) return 'basic_time_line'; return 'basic_move_v_line'; });

/** 本次会话中已添加的 toolId（乐观更新留痕） */
const localAddedToolIds = ref<Set<string>>(new Set());

const filterValue = ref<Record<string, number[]>>({
    plugintypes: [1, 2], financetypes: [2, 3, 0], createtypes: [2, 0, 1, 3],
});

const filterGroups = computed(() => [
    { key: 'financetypes', title: mergedI18n.value.filterFinance, options: [
        { text: mergedI18n.value.tagOfficialPaid, value: 2 },
        { text: mergedI18n.value.tagBeta, value: 3 },
        { text: mergedI18n.value.filterOther, value: 0 },
    ] },
    { key: 'plugintypes', title: mergedI18n.value.filterSource, options: [
        { text: mergedI18n.value.sourceOfficial, value: 1 },
        { text: mergedI18n.value.sourceThirdParty, value: 2 },
    ] },
    { key: 'createtypes', title: mergedI18n.value.filterType, options: [
        { text: mergedI18n.value.typeMcp, value: 2 },
        { text: mergedI18n.value.typeApi, value: 0 },
        { text: mergedI18n.value.typeCode, value: 1 },
        { text: mergedI18n.value.typeApp, value: 3 },
    ] },
]);

const filterLabel = computed(() => {
    const count = Object.values(filterValue.value).reduce((s, a) => s + a.length, 0);
    return count > 0
        ? (mergedI18n.value.selectedCount || '').replace('{count}', String(count))
        : mergedI18n.value.categoryAll;
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
function getCreateTypeLabel(i: Record<string, unknown>) {
    const t = getCreateType(i);
    const m = mergedI18n.value;
    if (t === 2) return m.createTypeLabelMcp;
    if (t === 0) return m.createTypeLabelApi;
    if (t === 1) return m.createTypeLabelCode;
    if (t === 3) return m.createTypeLabelApp;
    return '';
}
/**
 * 获取插件子工具列表。
 *
 * 自 ListPlugins → DescribePluginSummaryList 升级后，列表接口不再返回工具明细，
 * 需要在展开卡片时通过 DescribePlugin 按需拉取。本函数优先级：
 *   1) 本地缓存 toolDetailCache（已通过 ensurePluginTools 拉取过）
 *   2) item 自身的 Tools / ToolList（旧协议或后端透传场景）
 */
function getItemTools(i: Record<string, unknown>): Record<string, unknown>[] {
    const id = itemId(i);
    if (id && toolDetailCache.value.has(id)) {
        return toolDetailCache.value.get(id) || [];
    }
    return ((i.tools || i.Tools || i.ToolList) as Record<string, unknown>[] | undefined) || [];
}
function itemToolCount(i: Record<string, unknown>) { const tools = getItemTools(i); return tools.length > 0 ? tools.length : ((i.tool_count || i.ToolCount || 0) as number); }
function onIconError(e: Event) { (e.target as HTMLImageElement).style.display = 'none'; }

/* ===== 子工具数据提取 ===== */
function getToolId(t: Record<string, unknown>) { return ((t.ToolId || t.tool_id || t.id) as string) || ''; }
function getToolName(t: Record<string, unknown>) { return ((t.Name || t.ToolName || t.tool_name || t.name) as string) || ''; }
// v2 工具用 Description 替代旧 Desc；保留兼容
function getToolDesc(t: Record<string, unknown>) {
    return ((t.Description || t.Desc || t.ToolDesc || t.tool_desc || t.description) as string) || '';
}
// v2 工具计费在 t.Billing.BillingType 下，旧字段 FinanceType / finance_type 保留兼容
function getToolFinanceType(t: Record<string, unknown>) {
    const billing = (t.Billing as Record<string, unknown> | undefined);
    return (billing?.BillingType ?? t.FinanceType ?? t.finance_type ?? 0) as number;
}
function getToolTags(t: Record<string, unknown>): string[] {
    // v2 工具的 Body 在 t.ToolConfig.ApiToolConfig.Body 下，旧版本 Body 直接在顶层
    const toolConfig = (t.ToolConfig as Record<string, unknown> | undefined);
    const apiToolConfig = (toolConfig?.ApiToolConfig as Record<string, unknown> | undefined);
    const body = (apiToolConfig?.Body || t.Body || t.body || []) as Array<Record<string, unknown>>;
    return body.map(tag => ((tag.Name || tag.name) as string) || '').filter(Boolean);
}

/* ===== 已添加状态 ===== */
function isToolAdded(tool: Record<string, unknown>): boolean {
    const tid = getToolId(tool);
    if (!tid) return false;
    return props.installedToolIds.includes(tid) || localAddedToolIds.value.has(tid);
}

/**
 * 判定插件下所有工具是否都已添加。
 *
 * 三档判定（按优先级）：
 *   1) 已有工具明细（缓存命中 / 旧协议 inline / 已展开）→ 用 `tools.every(isToolAdded)`
 *   2) 未拿到工具明细但传入了 installedTools → 用「该 pluginId 下已绑定工具数 + 本会话乐观新增数」
 *      与 `Statistics.ToolCount` 对比；这是升级到 DescribePluginSummaryList 后**未展开也能**正确显示
 *      "已全部添加"的关键路径
 *   3) 兜底：返回 false（旧行为，需展开后才能正确判定）
 */
function checkIsAllAdd(item: Record<string, unknown>): boolean {
    const tools = getItemTools(item);
    if (tools.length > 0) {
        return tools.every(t => isToolAdded(t));
    }
    // 列表态：仅靠 ToolCount + installedTools(pluginId,toolId) 做判定
    const pluginId = itemId(item);
    if (!pluginId) return false;
    const toolCount = Number(item.ToolCount || item.tool_count || 0);
    if (toolCount <= 0) return false;
    if (props.installedTools.length === 0) return false;
    const installedIdsForPlugin = new Set<string>();
    props.installedTools.forEach((t) => {
        if (t.pluginId === pluginId && t.toolId) installedIdsForPlugin.add(t.toolId);
    });
    // 叠加本会话乐观新增（onAddAll / onAddSingle 后立刻刷新 UI）
    localAddedToolIds.value.forEach((tid) => installedIdsForPlugin.add(tid));
    return installedIdsForPlugin.size >= toolCount;
}

/* ===== API 交互 ===== */
async function fetchCategories() {
    if (!props.applicationId) return;
    try {
        const result = await fetchPluginCategories({ applicationId: props.applicationId, pluginClass: 0 });
        const map: Record<string, string> = {};
        result.categories.forEach(c => { map[c.category_key] = c.category_name; });
        categoryMap.value = map;
        categories.value = [
            { label: mergedI18n.value.categoryAll, value: 'all' },
            ...result.categories.map(c => ({ label: c.category_name, value: c.category_key })),
        ];
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
            spaceId: props.spaceId || 'default_space',
        });
        // 归一化收藏字段，筛选收藏时强制标记
        cardList.value = result.plugins.map((p: Record<string, unknown>) => ({
            ...p,
            is_favorite: filterFavorite.value ? true : !!(p.IsFavorite || p.is_favorite),
            IsFavorite: filterFavorite.value ? true : !!(p.IsFavorite || p.is_favorite),
        }));
        total.value = result.total;
        // 列表刷新后收起所有已展开的插件，并清空工具明细缓存/loading/错误态，避免新旧数据混用
        expandedIds.value = new Set();
        toolDetailCache.value = new Map();
        expandLoadingIds.value = new Set();
        expandErrorIds.value = new Set();
        updatingIds.value = new Set();
    } catch (e) { console.error(e); } finally { loading.value = false; }
}

/* ===== 事件处理 ===== */
function doReset() { pageNumber.value = 1; fetchList(); }
function onSearch() { if (searchTimer) clearTimeout(searchTimer); searchTimer = setTimeout(doReset, 300); }
function onTabChange() { activeCategory.value = 'all'; filterFavorite.value = false; filterValue.value = { plugintypes: [1, 2], financetypes: [2, 3, 0], createtypes: [2, 0, 1, 3] }; searchKeyword.value = ''; selectedSort.value = 3; doReset(); }

/**
 * 展开/收起插件卡片（多展开模式：彼此独立，不会因为新展开收起其他卡片）。
 * 展开时若缓存未命中，按需调用 DescribePlugin 拉取工具明细。
 */
async function onExpand(item: Record<string, unknown>) {
    const id = itemId(item);
    if (!id) return;
    // 收起：若已展开则移除
    if (expandedIds.value.has(id)) {
        const next = new Set(expandedIds.value);
        next.delete(id);
        expandedIds.value = next;
        return;
    }
    // 展开：加入集合（用新 Set 触发响应式更新）
    expandedIds.value = new Set(expandedIds.value).add(id);
    // 不可用插件无需拉工具
    if (itemStatus(item) === 2) return;
    // 命中缓存或自带 ToolList（旧协议）则不发起请求
    const inlineTools = ((item.tools || item.Tools || item.ToolList) as Record<string, unknown>[] | undefined) || [];
    if (toolDetailCache.value.has(id) || inlineTools.length > 0) {
        if (!toolDetailCache.value.has(id) && inlineTools.length > 0) {
            toolDetailCache.value.set(id, inlineTools);
        }
        return;
    }
    await ensurePluginTools(item);
}

/**
 * 确保某插件的工具列表已就绪：未命中缓存则通过 DescribePlugin 拉取。
 * 同一插件并发调用只会发起一次请求（基于 expandLoadingIds 集合检测），其他调用方等待完成。
 * 多个不同插件可并发拉取，各自独立的 loading / 错误态。
 */
async function ensurePluginTools(item: Record<string, unknown>): Promise<Record<string, unknown>[]> {
    const id = itemId(item);
    if (!id) return [];
    if (toolDetailCache.value.has(id)) return toolDetailCache.value.get(id) || [];
    if (!props.applicationId) return [];
    // 该插件已在拉取中：直接退出（UI 仍显示 loading）
    if (expandLoadingIds.value.has(id)) return [];
    // 标记 loading + 清错误态（用新 Set 触发响应式）
    expandLoadingIds.value = new Set(expandLoadingIds.value).add(id);
    if (expandErrorIds.value.has(id)) {
        const next = new Set(expandErrorIds.value);
        next.delete(id);
        expandErrorIds.value = next;
    }
    try {
        const { plugin } = await fetchPluginDetail({
            applicationId: props.applicationId,
            pluginId: id,
            spaceId: props.spaceId || undefined,
        });
        const tools = (plugin?.Tools as Record<string, unknown>[] | undefined) || [];
        toolDetailCache.value.set(id, tools);
        return tools;
    } catch (e) {
        console.error('[PluginInstallDialog] DescribePlugin 失败', e);
        expandErrorIds.value = new Set(expandErrorIds.value).add(id);
        return [];
    } finally {
        if (expandLoadingIds.value.has(id)) {
            const next = new Set(expandLoadingIds.value);
            next.delete(id);
            expandLoadingIds.value = next;
        }
    }
}

/** 正在执行绑定的按钮 key */
const addingKey = ref('');

async function doBindAgentTool(pluginItem: Record<string, unknown>, toolItems: Record<string, unknown>[]) {
    if (!props.applicationId) throw new Error(mergedI18n.value.errorMissingAppId);
    const agentId = await getAgentIdByAppId(props.applicationId);
    if (!agentId) throw new Error(mergedI18n.value.errorMissingAgentId);
    const pluginId = (pluginItem.PluginId || pluginItem.plugin_id || '') as string;
    const pluginClass = Number(pluginItem.PluginClass || pluginItem.plugin_class || 0);
    const isConnector = pluginClass === 1;
    const toolList = isConnector ? undefined : toolItems.map(t => buildToolConfig(pluginItem, t));
    const plugin = buildPluginConfig(pluginItem);

    await bindAgentTool({
        applicationId: props.applicationId,
        appId: props.applicationId,
        agentId,
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
        MessagePlugin.success(mergedI18n.value.addedToast);
    } catch (e) {
        console.error('[BindAgentTool] 绑定失败:', e);
        MessagePlugin.error(mergedI18n.value.bindToolFailedToast);
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
        MessagePlugin.success(mergedI18n.value.addedToast);
    } catch (e) {
        console.error('[BindAgentTool] 绑定失败:', e);
        MessagePlugin.error(mergedI18n.value.bindToolFailedToast);
    } finally {
        addingKey.value = '';
    }
}

async function onAddAll(item: Record<string, unknown>) {
    if (addingKey.value) return;
    // 工具列表懒加载：v2 DescribePluginSummaryList 不带 ToolList，按需先拉取一次
    let tools = getItemTools(item).filter(t => !isToolAdded(t));
    if (tools.length === 0 && !toolDetailCache.value.has(itemId(item))) {
        await ensurePluginTools(item);
        tools = getItemTools(item).filter(t => !isToolAdded(t));
    }
    if (tools.length === 0) {
        MessagePlugin.info(mergedI18n.value.allToolsAddedToast);
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

/**
 * 「更新」按钮（仅 MCP 插件可用）：让后端回源 MCP server 拉最新工具列表并同步到平台。
 *
 * 实现与 webim/gpt-demo 一致：复用 DescribePlugin（后端在内部对 MCP 类型走 server 同步逻辑），
 * 不是单纯刷新 UI 列表。前端拿到新 ToolList 后写回 toolDetailCache，已展开的卡片会立即看到新工具。
 *
 * 行为：
 *   - per-card loading（基于 updatingIds 集合，多张卡可并发各自更新）
 *   - 同一插件并发点击会被去重
 *   - 成功 toast「已更新工具列表」、失败 toast「更新失败」
 *   - 不调用 fetchList()，不重排整页插件列表
 */
async function onUpdatePlugin(item: Record<string, unknown>) {
    const id = itemId(item);
    if (!id) return;
    if (updatingIds.value.has(id)) return;
    if (!props.applicationId) return;

    updatingIds.value = new Set(updatingIds.value).add(id);
    try {
        const { plugin } = await fetchPluginDetail({
            applicationId: props.applicationId,
            pluginId: id,
            spaceId: props.spaceId || undefined,
        });
        // 用新 ToolList 覆盖该插件的缓存（仅在返回非空时覆盖，对齐 webim 行为：避免误清空）
        const tools = (plugin?.Tools as Record<string, unknown>[] | undefined) || [];
        if (tools.length > 0) {
            toolDetailCache.value.set(id, tools);
        }
        // 顺手清掉该卡之前的错误态（若有）
        if (expandErrorIds.value.has(id)) {
            const next = new Set(expandErrorIds.value);
            next.delete(id);
            expandErrorIds.value = next;
        }
        MessagePlugin.success(mergedI18n.value.updatedToolList);
    } catch (e) {
        console.error('[PluginInstallDialog] onUpdatePlugin 失败', e);
        MessagePlugin.error(mergedI18n.value.updateFailed);
    } finally {
        if (updatingIds.value.has(id)) {
            const next = new Set(updatingIds.value);
            next.delete(id);
            updatingIds.value = next;
        }
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
        expandedIds.value = new Set();
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
.plugin-card__error-dot::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: var(--td-size-4); height: var(--td-size-4); border-radius: var(--td-radius-circle); background: var(--td-error-color); }
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
/**
 * 工具描述行：
 * - 外层 `.plugin-card__tool-desc-row` 独立成行，作为文字宽度边界（max-width: 100%）；
 * - 内层 `.plugin-card__tool-desc` 用 inline-block 让 hover 触发区域贴合文字宽度，
 *   避免 hover 整行空白也弹出 tooltip。
 */
.plugin-card__tool-desc-row {
    display: block;
    max-width: 100%;
    min-width: 0;
}
.plugin-card__tool-desc {
    display: inline-block;
    max-width: 100%;
    font-size: var(--td-font-size-body-small);
    color: var(--td-text-color-placeholder);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: top;
}
.plugin-card__tool-tags { display: flex; gap: var(--td-size-2); flex-wrap: wrap; }
.plugin-card__tool-empty { font-size: var(--td-font-size-body-small); color: var(--td-text-color-placeholder); text-align: center; padding: var(--td-size-4) 0; }
.plugin-card__tool-retry { color: var(--td-brand-color); cursor: pointer; }
.plugin-card__tool-retry:hover { color: var(--td-brand-color-hover); }

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
