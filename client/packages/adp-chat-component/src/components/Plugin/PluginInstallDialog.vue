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
                    <!-- SelectMulti -->
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
            <div v-if="activeTab === 'inner'" ref="catRef" class="plugin-dialog__cat-bar" @scroll="updateCatScroll">
                <span v-for="cat in categories" :key="cat.value"
                    :class="['plugin-dialog__cat-tag', { 'is-active': activeCategory === cat.value }]"
                    @click="activeCategory = cat.value">{{ cat.label }}</span>
            </div>

            <!-- 卡片列表 -->
            <div v-if="loading" class="plugin-dialog__loading"><t-loading size="large" text="加载中..." /></div>
            <div v-else-if="cardList.length === 0" class="plugin-dialog__empty">暂无数据</div>
            <div v-else class="plugin-dialog__list">
                <div v-for="item in cardList" :key="(item as any).plugin_id || (item as any).PluginId"
                    class="plugin-card"
                    :class="{ 'is-expanded': expandedId === (item.plugin_id || item.PluginId) }">
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
                                <t-tag v-if="itemCreateType(item)" color="gray" size="small">{{ itemCreateType(item) }}</t-tag>
                                <t-tag v-if="itemCategory(item)" color="gray" size="small">{{ itemCategory(item) }}</t-tag>
                            </div>
                            <div class="plugin-card__desc" :title="itemDesc(item)">{{ itemDesc(item) }}</div>
                            <div class="plugin-card__footer">
                                <span v-if="itemCreator(item)" class="plugin-card__author">@{{ itemCreator(item) }}</span>
                                <span v-if="itemCreator(item)" class="plugin-card__sep">|</span>
                                <span class="plugin-card__tool-count">含{{ itemToolCount(item) }}个工具</span>
                                <span class="plugin-card__sep">|</span>
                                <span class="plugin-card__fav" :class="{ 'is-fav': item.is_favorite }" @click.stop="onToggleFav(item)">
                                    <t-icon :name="item.is_favorite ? 'star-filled' : 'star'" :style="{ color: item.is_favorite ? '#f8c544' : 'var(--td-text-color-placeholder)', fontSize: '14px' }" />
                                    {{ item.is_favorite ? '已收藏' : '收藏' }}
                                </span>
                            </div>
                        </div>
                        <div class="plugin-card__actions">
                            <t-button v-if="isAllAdded(item)" size="small" variant="outline" theme="default" disabled>已全部添加</t-button>
                            <t-button v-else size="small" variant="outline" theme="primary" @click.stop="onAddAll(item)">全部添加</t-button>
                        </div>
                    </div>
                    <div v-if="expandedId === (item.plugin_id || item.PluginId)" class="plugin-card__expand">
                        <div v-for="(tool, ti) in ((item as any).tools || (item as any).Tools || [])" :key="ti" class="plugin-card__tool">
                            <span class="plugin-card__tool-name">{{ (tool as any).tool_name || (tool as any).ToolName || (tool as any).name || '' }}</span>
                            <span class="plugin-card__tool-desc">{{ (tool as any).tool_desc || (tool as any).ToolDesc || (tool as any).description || '' }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <t-pagination v-if="total > pageSize" v-model="pageNumber" :total="total" :page-size="pageSize" size="small" class="plugin-dialog__pagination" @change="fetchList" />
        </div>
    </t-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
    Dialog as TDialog, Button as TButton, Tag as TTag, Loading as TLoading, Icon as TIcon,
    Tabs as TTabs, TabPanel as TTabPanel, Input as TInput, Checkbox as TCheckbox,
    Pagination as TPagination, Popup as TPopup, MessagePlugin,
} from 'tdesign-vue-next';
import { fetchPluginList, fetchPluginCategories, PluginClassEnum } from '../../service/connectorPluginApi';

interface Props { modelValue: boolean; applicationId?: string; }
const props = withDefaults(defineProps<Props>(), { modelValue: false, applicationId: '' });
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void; (e: 'install', item: Record<string, unknown>): void }>();

const visible = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) });
const activeTab = ref('inner');
const activeCategory = ref('all');
const filterFavorite = ref(false);
const filterVisible = ref(false);
const searchKeyword = ref('');
const selectedSort = ref(3);
const loading = ref(false);
const cardList = ref<Record<string, unknown>[]>([]);
const pageNumber = ref(1);
const pageSize = 12;
const total = ref(0);
const expandedId = ref('');
const catRef = ref<HTMLDivElement | null>(null);
const categories = ref<Array<{ label: string; value: string }>>([{ label: '全部', value: 'all' }]);
const sortOptions = [{ label: '默认排序', value: 3 }, { label: '按热门排序', value: 4 }, { label: '按更新时间排序', value: 2 }];
const sortLabel = computed(() => sortOptions.find(o => o.value === selectedSort.value)?.label || '默认排序');
const sortIcon = computed(() => { if (selectedSort.value === 4) return 'fire'; if (selectedSort.value === 2) return 'time'; return 'swap'; });

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

let searchTimer: ReturnType<typeof setTimeout> | null = null;
function itemIcon(i: Record<string, unknown>) { return (i.icon_url || i.IconUrl || '') as string; }
function itemName(i: Record<string, unknown>) { return (i.plugin_name || i.PluginName || i.Name || '') as string; }
function itemDesc(i: Record<string, unknown>) { return (i.plugin_desc || i.PluginDesc || i.Desc || '') as string; }
function itemCreator(i: Record<string, unknown>) { return ((i.UserInfo as Record<string,unknown>)?.Name || i.creator || i.Creator || '') as string; }
function itemCategory(i: Record<string, unknown>) { return (i.CategoryKey || i.category_key || '') as string; }
function itemFinanceType(i: Record<string, unknown>) { return (i.FinanceType || i.finance_type || 0) as number; }
function itemCreateType(i: Record<string, unknown>) { const t = (i.CreateType || i.create_type || 0) as number; if (t === 2) return 'MCP'; if (t === 0) return 'API'; if (t === 1) return '代码'; if (t === 3) return '应用'; return ''; }
function itemToolCount(i: Record<string, unknown>) { const tools = (i.tools || i.Tools || i.ToolList) as Record<string, unknown>[] | undefined; return tools ? tools.length : ((i.tool_count || i.ToolCount || 0) as number); }
function isAllAdded(i: Record<string, unknown>) { return !!(i.all_added || i.AllAdded); }
function onIconError(e: Event) { (e.target as HTMLImageElement).style.display = 'none'; }
function updateCatScroll() {}

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

function doReset() { pageNumber.value = 1; fetchList(); }
function onSearch() { if (searchTimer) clearTimeout(searchTimer); searchTimer = setTimeout(doReset, 300); }
function onTabChange() { activeCategory.value = 'all'; filterFavorite.value = false; filterValue.value = { plugintypes: [1, 2], financetypes: [2, 3, 0], createtypes: [2, 0, 1, 3] }; searchKeyword.value = ''; selectedSort.value = 3; doReset(); }
function onExpand(item: Record<string, unknown>) { const id = (item.plugin_id || item.PluginId) as string; expandedId.value = expandedId.value === id ? '' : id; }
function onAddAll(item: Record<string, unknown>) { emit('install', item); item.all_added = true; MessagePlugin.success('已添加'); }
function onToggleFav(item: Record<string, unknown>) { item.is_favorite = !item.is_favorite; }
watch(activeCategory, () => { if (activeCategory.value !== 'all') doReset(); });
watch(() => props.modelValue, (val) => { if (val) { activeTab.value = 'inner'; activeCategory.value = 'all'; filterFavorite.value = false; filterValue.value = { plugintypes: [1, 2], financetypes: [2, 3, 0], createtypes: [2, 0, 1, 3] }; searchKeyword.value = ''; selectedSort.value = 3; pageNumber.value = 1; expandedId.value = ''; fetchCategories(); fetchList(); } });
</script>

<style scoped>
.plugin-dialog { display: flex; flex-direction: column; gap: 12px; height: 540px; overflow: hidden; }
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
.plugin-dialog__cat-tag { flex-shrink: 0; padding: 2px 12px; font-size: 12px; border-radius: 16px; cursor: pointer; color: var(--td-text-color-secondary); background: var(--td-bg-color-secondarycontainer); white-space: nowrap; transition: all 0.2s; }
.plugin-dialog__cat-tag:hover { color: var(--td-brand-color); background: var(--td-brand-color-light); }
.plugin-dialog__cat-tag.is-active { color: #fff; background: var(--td-brand-color); font-weight: 500; }
.plugin-dialog__loading { display: flex; justify-content: center; padding: 48px 0; }
.plugin-dialog__empty { text-align: center; padding: 48px 0; color: var(--td-text-color-placeholder); font-size: 14px; }
.plugin-dialog__list { display: flex; flex-direction: column; flex: 1; overflow-y: auto; min-height: 0; }
.plugin-dialog__list::-webkit-scrollbar { width: 4px; }
.plugin-dialog__list::-webkit-scrollbar-thumb { border-radius: 2px; background: rgba(17, 32, 70, 0.13); }
.plugin-dialog__pagination { display: flex; justify-content: center; }

.plugin-card { margin-bottom: 12px; border-radius: var(--td-radius-large); border: 1px solid var(--td-component-border); background: var(--td-bg-color-container); box-shadow: 0 4px 16px rgba(0,55,159,0.04); transition: box-shadow 0.2s; }
.plugin-card:hover { box-shadow: 0 4px 24px rgba(0,55,159,0.10); }
.plugin-card.is-expanded { border-color: var(--td-brand-color); }
.plugin-card__main { display: flex; align-items: flex-start; gap: 16px; padding: 16px; cursor: pointer; }
.plugin-card__icon-area { padding-top: 2px; }
.plugin-card__icon { width: 40px; height: 40px; border-radius: var(--td-radius-large); object-fit: cover; flex-shrink: 0; border: 1px solid var(--td-component-border); box-sizing: border-box; }
.plugin-card__icon-fb { width: 40px; height: 40px; border-radius: var(--td-radius-large); flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; color: var(--td-text-color-secondary); background: var(--td-bg-color-secondarycontainer); border: 1px solid var(--td-component-border); box-sizing: border-box; }
.plugin-card__info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.plugin-card__title-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.plugin-card__name { font-size: 14px; font-weight: 500; color: var(--td-text-color-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.plugin-card__desc { font-size: 12px; color: var(--td-text-color-placeholder); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.plugin-card__footer { display: flex; align-items: center; gap: 6px; width: 100%; font-size: 11px; color: var(--td-text-color-placeholder); }
.plugin-card__author { color: var(--td-text-color-secondary); }
.plugin-card__sep { color: var(--td-component-border); }
.plugin-card__tool-count { color: var(--td-brand-color); }
.plugin-card__fav { cursor: pointer; display: inline-flex; align-items: center; gap: 2px; }
.plugin-card__fav:hover { opacity: 0.8; }
.plugin-card__actions { flex-shrink: 0; }
.plugin-card__expand { border-top: 1px solid var(--td-component-border); padding: 8px 16px 16px 74px; display: flex; flex-direction: column; gap: 6px; background: var(--td-bg-color-secondarycontainer); border-radius: 0 0 var(--td-radius-large) var(--td-radius-large); }
.plugin-card__tool { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.plugin-card__tool-name { font-size: 12px; font-weight: 500; white-space: nowrap; }
.plugin-card__tool-desc { font-size: 11px; color: var(--td-text-color-placeholder); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: right; }
</style>
