<template>
    <t-dialog
        v-model:visible="visible"
        :header="i18n.addSkills"
        :footer="false"
        width="800px"
        :close-on-overlay-click="false"
        @close="onClose"
    >
        <div class="skills-install">
            <!-- Tabs -->
            <t-tabs v-if="tabsReady" v-model="activeTab" class="skills-install__tabs">
                <t-tab-panel value="builtin" :label="i18n.builtinSkills" />
                <t-tab-panel value="shared" :label="i18n.sharedSkills" />
                <t-tab-panel value="custom" :label="i18n.customSkills" />
            </t-tabs>

            <!-- 筛选栏 -->
            <div class="skills-install__filter">
                <!-- 内置 Skills：分类滚动 + 复选框 + 搜索 -->
                <template v-if="activeTab === 'builtin'">
                    <div class="skills-install__filter-row">
                        <div class="skills-install__categories-wrapper">
                            <t-button
                                variant="text"
                                size="small"
                                shape="square"
                                :disabled="!canScrollLeft"
                                @click="scrollCategories(-1)"
                            >
                                <template #icon><t-icon name="chevron-left" /></template>
                            </t-button>
                            <div ref="categoriesRef" class="skills-install__categories" @scroll="updateScrollState">
                                <span
                                    v-for="cat in categories"
                                    :key="cat.value"
                                    :class="['skills-install__category', { 'is-active': activeCategory === cat.value }]"
                                    @click="activeCategory = cat.value"
                                >{{ cat.label }}</span>
                            </div>
                            <t-button
                                variant="text"
                                size="small"
                                shape="square"
                                :disabled="!canScrollRight"
                                @click="scrollCategories(1)"
                            >
                                <template #icon><t-icon name="chevron-right" /></template>
                            </t-button>
                        </div>
                        <div class="skills-install__filter-actions">
                            <t-checkbox v-model="filterOfficial">官方</t-checkbox>
                            <t-checkbox v-model="filterFavorite">收藏</t-checkbox>
                            <t-input
                                v-model="searchKeyword"
                                :placeholder="i18n.search"
                                size="small"
                                clearable
                                class="skills-install__search"
                            >
                                <template #prefix-icon><t-icon name="search" /></template>
                            </t-input>
                        </div>
                    </div>
                </template>

                <!-- 企业共享 / 自定义：收藏 + 搜索 -->
                <template v-else>
                    <div class="skills-install__filter-row skills-install__filter-row--simple">
                        <t-checkbox v-if="activeTab === 'custom'" v-model="filterShareStatus">企业共享</t-checkbox>
                        <t-checkbox v-model="filterFavorite">收藏</t-checkbox>
                        <t-input
                            v-model="searchKeyword"
                            :placeholder="i18n.search"
                            size="small"
                            clearable
                            class="skills-install__search"
                        >
                            <template #prefix-icon><t-icon name="search" /></template>
                        </t-input>
                    </div>
                </template>
            </div>

            <!-- Skill 列表（触底加载更多） -->
            <div class="skills-install__list" @scroll="onListScroll">
                <t-loading v-if="loading" size="small" class="skills-install__loading" />
                <template v-else>
                    <div v-if="skillList.length > 0" class="skills-install__items">
                        <div
                            v-for="skill in skillList"
                            :key="(skill.skill_id as string)"
                            class="skills-install__card"
                        >
                            <div class="skill-card__body">
                                <img
                                    v-if="skillIcon(skill)"
                                    :src="skillIcon(skill)"
                                    class="skill-card__icon"
                                    @error="onCardIconError($event)"
                                />
                                <span v-else class="skill-card__icon-fallback">
                                    <t-icon name="lightbulb" />
                                </span>
                                <div class="skill-card__info">
                                    <div class="skill-card__header">
                                        <span class="skill-card__name">{{ skillName(skill) }}</span>
                                        <t-tag
                                            v-if="isPaidSkill(skill)"
                                            theme="warning"
                                            variant="light"
                                            size="small"
                                        >付费</t-tag>
                                    </div>
                                    <span class="skill-card__desc" :title="skillDesc(skill)">{{ skillDesc(skill) }}</span>
                                    <div class="skill-card__meta">
                                        <span v-if="skillAuthor(skill)" class="skill-card__author">@{{ skillAuthor(skill) }}</span>
                                        <span v-if="skillVersion(skill)" class="skill-card__version">v{{ skillVersion(skill) }}</span>
                                    </div>
                                </div>
                                <div class="skill-card__actions">
                                    <t-button
                                        v-if="isInstalled(skill.skill_id as string)"
                                        size="small"
                                        variant="outline"
                                        theme="default"
                                        disabled
                                    >{{ i18n.installed }}</t-button>
                                    <t-button
                                        v-else
                                        size="small"
                                        variant="outline"
                                        theme="primary"
                                        :loading="busyId === (skill.skill_id as string)"
                                        :disabled="isLimitReached && !busyId"
                                        @click="onInstallSkill(skill)"
                                    >{{ i18n.install }}</t-button>
                                    <span
                                        class="skill-card__favorite"
                                        :class="{ 'is-favorite': skill.is_favorite }"
                                        @click="onToggleFavorite(skill)"
                                    >
                                        <t-icon :name="skill.is_favorite ? 'star-filled' : 'star'" :style="{ color: skill.is_favorite ? '#f8c544' : 'var(--td-text-color-placeholder)' }" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="skills-install__empty">暂无数据</div>
                </template>
                <t-loading v-if="loadingMore" size="small" class="skills-install__loading-more" />
            </div>
        </div>
    </t-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import {
    Dialog as TDialog,
    Tabs as TTabs,
    TabPanel as TTabPanel,
    Button as TButton,
    Tag as TTag,
    Loading as TLoading,
    Input as TInput,
    Checkbox as TCheckbox,
    Icon as TIcon,
    MessagePlugin,
} from 'tdesign-vue-next';
import type { SkillsI18n } from '../../model/skills';
import { defaultSkillsI18n, defaultSkillsI18nEn } from '../../model/skills';
import { fetchSkillCategories, fetchSkillSummaryList, installSkill as installSkillApi } from '../../service/skillsApi';

interface Props {
    modelValue: boolean;
    installedSkillIds?: string[];
    applicationId?: string;
    spaceId?: string;
    i18n?: Partial<SkillsI18n>;
    language?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    installedSkillIds: () => [],
    applicationId: '',
    spaceId: '',
    i18n: () => ({}),
    language: 'zh-CN',
});

const emit = defineEmits<{
    (e: 'update:modelValue', val: boolean): void;
    (e: 'skill-installed', skill: Record<string, unknown>): void;
    (e: 'skill-uninstalled', skill: Record<string, unknown>): void;
    (e: 'close'): void;
}>();

const i18n = computed<Required<SkillsI18n>>(() => {
    const defaults = props.language?.startsWith('en') ? defaultSkillsI18nEn : defaultSkillsI18n;
    return { ...defaults, ...props.i18n };
});

const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});

// ─── 状态 ──────────────────────────────────────────────
const tabsReady = ref(false);
const activeTab = ref('builtin');
const activeCategory = ref('all');
const filterOfficial = ref(false);
const filterFavorite = ref(false);
const filterShareStatus = ref(false);
const searchKeyword = ref('');
const loading = ref(false);
const loadingMore = ref(false);
const skillList = ref<Record<string, unknown>[]>([]);
const pageNumber = ref(0);
const pageSize = 20;
const totalCount = ref(0);
const fetchVersion = ref(0);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);
const busyId = ref('');
const categoriesRef = ref<HTMLDivElement | null>(null);

const categories = ref<Array<{ label: string; value: string }>>([{ label: '全部', value: 'all' }]);

// 已安装 ID 集合
const installedIds = computed(() => new Set(props.installedSkillIds));

// 当前已安装数量（已安装集合 + 列表中已安装的）
const currentInstalledCount = computed(() => installedIds.value.size);

const isLimitReached = computed(() => currentInstalledCount.value >= 80);

// 搜索防抖定时器
let searchTimer: ReturnType<typeof setTimeout> | null = null;

// ─── Skill 数据辅助 ────────────────────────────────────
function getProfile(s: Record<string, unknown>): Record<string, unknown> {
    return (s.profile || s.Profile || {}) as Record<string, unknown>;
}

function skillIcon(s: Record<string, unknown>): string {
    const p = getProfile(s);
    return (p.icon_url || p.IconUrl || '') as string;
}

function skillName(s: Record<string, unknown>): string {
    const p = getProfile(s);
    return (p.display_name || p.DisplayName || p.name || p.Name || '') as string;
}

function skillDesc(s: Record<string, unknown>): string {
    const p = getProfile(s);
    return (p.display_description || p.DisplayDescription || p.description || p.Description || '') as string;
}

function skillAuthor(s: Record<string, unknown>): string {
    const p = getProfile(s);
    return (p.creator || p.Creator || '') as string;
}

function skillVersion(s: Record<string, unknown>): string {
    return (s.current_version || s.CurrentVersion || '') as string;
}

function isPaidSkill(s: Record<string, unknown>): boolean {
    const p = getProfile(s);
    return (p.billing_type || p.BillingType || 0) === 1;
}

function isInstalled(skillId: string): boolean {
    return installedIds.value.has(skillId);
}

function onCardIconError(e: Event) {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
        const fb = parent.querySelector('.skill-card__icon-fallback') as HTMLElement;
        if (fb) fb.style.display = 'inline-flex';
    }
}

// ─── API ───────────────────────────────────────────────
async function fetchCategories() {
    if (!props.applicationId) return;
    try {
        const result = await fetchSkillCategories({ applicationId: props.applicationId });
        categories.value = [
            { label: '全部', value: 'all' },
            ...result.categories.map((c) => ({
                label: c.category_name,
                value: c.category_key,
            })),
        ];
    } catch (e) {
        console.error('[SkillsInstallDialog] fetchCategories error:', e);
    }
}

function buildFilters(): Array<{ key: string; values: string[] }> {
    const list: Array<{ key: string; values: string[] }> = [];
    if (activeTab.value === 'builtin') {
        if (filterOfficial.value) {
            list.push({ key: 'type', values: ['1'] }); // OFFICIAL
        } else {
            list.push({ key: 'type', values: ['1', '2'] }); // OFFICIAL + THIRD_PARTY
        }
        if (activeCategory.value && activeCategory.value !== 'all') {
            list.push({ key: 'CategoryKey', values: [activeCategory.value] });
        }
    } else if (activeTab.value === 'shared') {
        list.push({ key: 'type', values: ['4'] }); // SHARED
    } else {
        // custom tab
        list.push({ key: 'type', values: ['3'] }); // CUSTOM
        if (filterShareStatus.value) {
            list.push({ key: 'ShareStatus', values: ['1'] });
        }
    }
    return list;
}

async function fetchSkillList(append = false) {
    if (!props.applicationId) return;
    if (!append) {
        loading.value = true;
        skillList.value = [];
    } else {
        loadingMore.value = true;
    }

    const version = ++fetchVersion.value;
    try {
        // TODO: spaceId 后续从实际空间上下文获取
        const spId = props.spaceId || 'default_space';
        const result = await fetchSkillSummaryList({
            applicationId: props.applicationId,
            space_id: spId,
            page_size: pageSize,
            page_number: pageNumber.value,
            query: searchKeyword.value || undefined,
            filter_list: buildFilters(),
            favorite_only: filterFavorite.value || undefined,
        });

        if (version !== fetchVersion.value) return;

        const list = (result.skill_list || []).map((s: Record<string, unknown>) => ({
            ...s,
            installed: installedIds.value.has((s.skill_id || '') as string),
        }));

        skillList.value = append ? [...skillList.value, ...list] : list;
        totalCount.value = result.total_count;
    } catch (e) {
        console.error('[SkillsInstallDialog] fetchSkillList error:', e);
        if (!append) skillList.value = [];
    } finally {
        loading.value = false;
        loadingMore.value = false;
    }
}

function resetAndFetch() {
    pageNumber.value = 0;
    totalCount.value = 0;
    fetchSkillList();
}

// ─── 分类滚动 ──────────────────────────────────────────
function scrollCategories(direction: number) {
    const el = categoriesRef.value;
    if (!el) return;
    el.scrollBy({ left: direction * 120, behavior: 'smooth' });
}

function updateScrollState() {
    const el = categoriesRef.value;
    if (!el) return;
    canScrollLeft.value = el.scrollLeft > 2;
    canScrollRight.value = el.scrollLeft < el.scrollWidth - el.clientWidth - 2;
}

// ─── 列表滚动触底加载 ──────────────────────────────────
function onListScroll(e: Event) {
    const el = e.target as HTMLElement;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    if (nearBottom && !loadingMore.value && skillList.value.length < totalCount.value) {
        pageNumber.value++;
        fetchSkillList(true);
    }
}

// ─── 安装/收藏 ─────────────────────────────────────────
async function onInstallSkill(skill: Record<string, unknown>) {
    if (!props.applicationId) return;
    const sid = (skill.skill_id || '') as string;
    if (isInstalled(sid)) {
        emit('skill-uninstalled', skill);
        return;
    }
    if (isLimitReached.value) {
        MessagePlugin.warning('已达到最大安装数量');
        return;
    }
    busyId.value = sid;
    try {
        await installSkillApi({
            applicationId: props.applicationId,
            space_id: props.spaceId || 'default_space',
            source: 2,
            skill_id: sid,
            version_id: (skill.current_version_id || '') as string,
        });
        MessagePlugin.success('添加成功');
        emit('skill-installed', skill);
    } catch (e) {
        console.error('[SkillsInstallDialog] install error:', e);
        MessagePlugin.error('安装失败');
    } finally {
        busyId.value = '';
    }
}

function onToggleFavorite(skill: Record<string, unknown>) {
    // TODO: 调用 FavoriteSkill / UnfavoriteSkill API
    skill.is_favorite = !skill.is_favorite;
    MessagePlugin.success(skill.is_favorite ? '已收藏' : '已取消收藏');
}

// ─── 生命周期 / 监听 ──────────────────────────────────
watch(() => props.modelValue, (val) => {
    if (val) {
        fetchCategories();
        resetAndFetch();
        nextTick(() => { tabsReady.value = true; });
    } else {
        tabsReady.value = false;
    }
});

watch(activeTab, () => {
    activeCategory.value = 'all';
    filterOfficial.value = false;
    filterFavorite.value = false;
    filterShareStatus.value = false;
    searchKeyword.value = '';
    resetAndFetch();
});

watch([activeCategory, filterOfficial, filterFavorite, filterShareStatus], () => {
    resetAndFetch();
});

watch(searchKeyword, () => {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => resetAndFetch(), 300);
});

function onClose() {
    emit('close');
}
</script>

<style scoped>
.skills-install {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 560px;
    overflow: hidden;
}
.skills-install__tabs {
    flex-shrink: 0;
}
.skills-install__filter {
    flex-shrink: 0;
}
.skills-install__filter-row {
    display: flex;
    align-items: center;
    gap: 12px;
}
.skills-install__filter-row--simple {
    flex-wrap: wrap;
}
.skills-install__categories-wrapper {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
    min-width: 0;
}
.skills-install__filter-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}
.skills-install__categories-wrapper {
    display: flex;
    align-items: center;
    gap: 4px;
}
.skills-install__categories {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    flex: 1;
    scrollbar-width: none;
}
.skills-install__categories::-webkit-scrollbar {
    display: none;
}
.skills-install__category {
    flex-shrink: 0;
    padding: 2px 12px;
    font-size: 12px;
    border-radius: 16px;
    cursor: pointer;
    color: var(--td-text-color-secondary);
    background: var(--td-bg-color-secondarycontainer);
    white-space: nowrap;
    transition: all 0.2s;
}
.skills-install__category:hover {
    color: var(--td-brand-color);
    background: var(--td-brand-color-light);
}
.skills-install__category.is-active {
    color: #fff;
    background: var(--td-brand-color);
    font-weight: 500;
}
.skills-install__filter-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}
.skills-install__search {
    width: 160px;
    flex-shrink: 0;
}
.skills-install__list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    max-height: 380px;
}
.skills-install__list::-webkit-scrollbar {
    width: 4px;
}
.skills-install__list::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: rgba(17, 32, 70, 0.13);
}
.skills-install__loading {
    display: flex;
    justify-content: center;
    padding: 48px 0;
}
.skills-install__loading-more {
    padding: 16px 0;
}
.skills-install__items {
    display: flex;
    flex-direction: column;
}
.skills-install__empty {
    text-align: center;
    padding: 48px 0;
    color: var(--td-text-color-placeholder);
    font-size: 14px;
}

/* Skill 卡片 */
.skills-install__card {
    border-bottom: 1px solid var(--td-component-border);
    padding: 12px 0;
}
.skills-install__card:hover {
    background: var(--td-bg-color-container-hover);
}
.skill-card__body {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 0 4px;
}
.skill-card__icon {
    width: 48px;
    height: 48px;
    border-radius: 6px;
    object-fit: cover;
    flex-shrink: 0;
}
.skill-card__icon-fallback {
    width: 48px;
    height: 48px;
    border-radius: 6px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--td-text-color-secondary);
    background: var(--td-bg-color-secondarycontainer);
}
.skill-card__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.skill-card__header {
    display: flex;
    align-items: center;
    gap: 6px;
}
.skill-card__name {
    font-size: 14px;
    font-weight: 500;
    color: var(--td-text-color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.skill-card__desc {
    font-size: 12px;
    color: var(--td-text-color-secondary);
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 340px;
}
.skill-card__meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: var(--td-text-color-placeholder);
}
.skill-card__author {
    cursor: pointer;
}
.skill-card__author:hover {
    color: var(--td-brand-color);
}
.skill-card__actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    margin-top: 4px;
}
.skill-card__favorite {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    padding: 4px;
    border-radius: 4px;
    transition: background 0.15s;
}
.skill-card__favorite:hover {
    background: var(--td-bg-color-container-active);
}
</style>
