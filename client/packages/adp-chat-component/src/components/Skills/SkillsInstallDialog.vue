<template>
    <t-dialog
        v-model:visible="visible"
        :header="i18n.addSkills"
        :footer="false"
        :close-on-overlay-click="false"
        @close="onClose"
        width="min(900px, calc(100vw - 40px))"
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
                            <div ref="categoriesRef" class="skills-install__categories" @scroll="updateScrollState">
                                <span
                                    v-for="cat in categories"
                                    :key="cat.value"
                                    :class="['skills-install__category', { 'is-active': activeCategory === cat.value }]"
                                    @click="activeCategory = cat.value"
                                >{{ cat.label }}</span>
                            </div>
                            <div class="skills-install__scroll-btns">
                                <span
                                    :class="['skills-install__scroll-btn', { 'is-disabled': !canScrollLeft }]"
                                    @click="scrollCategories(-1)"
                                >
                                    <CustomizedIcon remote name="arrow_left_small_line" size="xs" :show-hover-bg="false" :theme="theme" />
                                </span>
                                <span
                                    :class="['skills-install__scroll-btn', { 'is-disabled': !canScrollRight }]"
                                    @click="scrollCategories(1)"
                                >
                                    <CustomizedIcon remote name="arrow_right_small_line" size="xs" :show-hover-bg="false" :theme="theme" />
                                </span>
                            </div>
                        </div>
                        <div class="skills-install__filter-actions">
                            <t-checkbox v-model="filterOfficial">官方</t-checkbox>
                            <t-checkbox v-model="filterFavorite">收藏</t-checkbox>
                            <t-input
                                v-model="searchKeyword"
                                :placeholder="i18n.search"
                                
                                clearable
                                class="skills-install__search"
                            >
                                <template #prefix-icon><CustomizedIcon remote name="basic_search_line" size="xs" :show-hover-bg="false" :theme="theme" /></template>
                            </t-input>
                        </div>
                    </div>
                </template>

                <!-- 企业共享 / 自定义：搜索 -->
                <template v-else>
                    <div class="skills-install__filter-row skills-install__filter-row--simple">
                        <t-checkbox v-model="filterFavorite">收藏</t-checkbox>
                        <t-checkbox v-if="activeTab === 'custom'" v-model="filterShareStatus">企业共享</t-checkbox>
                        <t-input
                            v-model="searchKeyword"
                            :placeholder="i18n.search"
                            
                            clearable
                            class="skills-install__search"
                        >
                            <template #prefix-icon><CustomizedIcon remote name="basic_search_line" size="s" :show-hover-bg="false" :theme="theme" /></template>
                        </t-input>
                    </div>
                </template>
            </div>

            <!-- Skill 列表（触底加载更多） -->
            <div class="skills-install__list" @scroll="onListScroll">
                <t-loading v-if="loading"  class="skills-install__loading" />
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
                                    <CustomizedIcon remote name="basic_bulb_line" size="s" :show-hover-bg="false" :theme="theme" />
                                </span>
                                <div class="skill-card__info">
                                    <div class="skill-card__header">
                                        <t-tooltip :content="skillName(skill)" placement="top"><span class="skill-card__name">{{ skillName(skill) }}</span></t-tooltip>
                                        <!-- 安全 / 疑似风险 tag -->
                                        <t-tooltip
                                            v-if="showSafetyTag(skill)"
                                            :content="safetyTooltip(skill)"
                                            placement="top"
                                        >
                                            <TagWithColor
                                                :color="isSuspectedRisk(skill) ? 'orange' : 'green'"
                                                icon="basic_verification_code_line"
                                                :theme="theme"
                                            >
                                                {{ isSuspectedRisk(skill) ? '疑似风险' : '安全' }}
                                                <CustomizedIcon
                                                    remote
                                                    v-if="safetyReportUrl(skill)"
                                                    name="arrow_up_right2_line"
                                                    size="xxs"
                                                    :show-hover-bg="false"
                                                    :theme="theme"
                                                    class="skill-card__tag-suffix"
                                                    @click.stop="onOpenReport(safetyReportUrl(skill))"
                                                />
                                            </TagWithColor>
                                        </t-tooltip>
                                        <!-- 企业共享 tag -->
                                        <t-tooltip
                                            v-if="isSharedSkill(skill)"
                                            :content="sharedTooltip(skill)"
                                            placement="top"
                                        >
                                            <TagWithColor color="blue" :theme="theme">企业共享</TagWithColor>
                                        </t-tooltip>
                                        <!-- 付费 tag -->
                                        <t-tooltip
                                            v-if="isPaidSkill(skill)"
                                            content="包含官方付费工具"
                                            placement="top"
                                        >
                                            <TagWithColor color="purple" icon="basic_vip_line" :theme="theme">官方收费</TagWithColor>
                                        </t-tooltip>
                                    </div>
                                    <t-tooltip v-if="skillDesc(skill)" :content="skillDesc(skill)" placement="top"><div class="skill-card__desc">{{ skillDesc(skill) }}</div></t-tooltip>
                                    <t-tooltip v-if="skillAuthor(skill) || skillVersion(skill)" :content="(skillAuthor(skill) ? '@' + skillAuthor(skill) : '') + (skillVersion(skill) ? (skillAuthor(skill) ? ' | ' : '') + 'v' + skillVersion(skill) : '')" placement="top"><div class="skill-card__meta">
                                        <span v-if="skillAuthor(skill)" class="skill-card__author">@{{ skillAuthor(skill) }}</span>
                                        <span v-if="skillAuthor(skill) && skillVersion(skill)" class="skill-card__meta-divider">|</span>
                                        <span v-if="skillVersion(skill)" class="skill-card__version">v{{ skillVersion(skill) }}</span>
                                    </div></t-tooltip>
                                </div>
                                <div class="skill-card__actions">
                                    <t-button
                                        v-if="isInstalled(skill)"
                                        
                                        variant="outline"
                                        theme="default"
                                        size="small"
                                        disabled
                                    >{{ i18n.installed }}</t-button>
                                    <t-button
                                        v-else
                                        
                                        theme="primary"
                                        size="small"
                                        :loading="busyId === (skill.skill_id as string)"
                                        :disabled="isLimitReached && !busyId"
                                        @click="onInstallSkill(skill)"
                                    >{{ i18n.install }}</t-button>
                                    <span
                                        class="skill-card__favorite"
                                        :class="{ 'is-favorite': skill.is_favorite }"
                                    >
                                        <CustomizedIcon
                                            :name="skill.is_favorite ? 'basic_star_fill' : 'basic_star_line'"
                                            size="xs"
                                            :show-hover-bg="false"
                                            :theme="theme"
                                            :color="(skill.is_favorite ? '#f8c544' : 'var(--td-text-color-placeholder)')"
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="skills-install__empty">暂无数据</div>
                </template>
                <t-loading v-if="loadingMore"  class="skills-install__loading-more" />
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
    Loading as TLoading,
    Tooltip as TTooltip,
    Input as TInput,
    Checkbox as TCheckbox,
   
    MessagePlugin,
} from 'tdesign-vue-next';
import type { SkillsI18n } from '../../model/skills';
import { defaultSkillsI18n, defaultSkillsI18nEn } from '../../model/skills';
import { fetchSkillCategories, fetchSkillSummaryList, modifyAgentSkillList } from '../../service/skillsApi';
import CustomizedIcon from '../CustomizedIcon.vue';
import TagWithColor from '../Common/TagWithColor.vue';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
import useAgentStore from '../../composables/useAgentStore';

interface Props extends ThemeProps {
    modelValue: boolean;
    installedSkillIds?: string[];
    /** 已安装 skill 的完整原始数据列表，用于 ModifyAgent 时合并构造完整 skill_list */
    installedSkills?: Record<string, unknown>[];
    applicationId?: string;
    spaceId?: string;
    i18n?: Partial<SkillsI18n>;
    language?: string;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    modelValue: false,
    installedSkillIds: () => [],
    installedSkills: () => [],
    applicationId: '',
    spaceId: '',
    i18n: () => ({}),
    language: 'zh-CN',
});

const { getAgentIdByAppId } = useAgentStore();

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

// ─── Tag 判定 ─────────────────────────────────────────
// risk_level: 0=无风险, 1=低风险（疑似）, 2=中风险（疑似）, 3=高风险
function getAnalysisInfo(s: Record<string, unknown>): Record<string, unknown> {
    return (s.analysis_info || s.AnalysisInfo || {}) as Record<string, unknown>;
}

function riskLevel(s: Record<string, unknown>): number {
    const info = getAnalysisInfo(s);
    return Number(info.risk_level ?? info.RiskLevel ?? 0);
}

// 高风险（=3）不展示 tag
function showSafetyTag(s: Record<string, unknown>): boolean {
    return riskLevel(s) < 3;
}

function isSuspectedRisk(s: Record<string, unknown>): boolean {
    const lvl = riskLevel(s);
    return lvl === 1 || lvl === 2;
}

function safetyReportUrl(s: Record<string, unknown>): string {
    const info = getAnalysisInfo(s);
    return (info.security_report_url || info.SecurityReportUrl || '') as string;
}

function safetyTooltip(s: Record<string, unknown>): string {
    return isSuspectedRisk(s)
        ? '科恩实验室检测结果为"疑似风险"'
        : '科恩实验室检测结果为"安全"';
}

function onOpenReport(url: string) {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
}

// 企业共享：share_info 中存在 status===1 的记录
function getShareInfo(s: Record<string, unknown>): Array<Record<string, unknown>> {
    // 适配后已统一为 share_info，兼容原始格式
    return (s.share_info || s.ShareList || s.ShareInfo || []) as Array<Record<string, unknown>>;
}

function isSharedSkill(s: Record<string, unknown>): boolean {
    const p = getProfile(s);
    // ProviderType=4 对应企业共享类型，不重复显示 tag
    const providerType = p.type ?? p.Type ?? p.ProviderType ?? p.provider_type;
    if (providerType === 4 || providerType === '4') return false;
    return getShareInfo(s).some((item) => Number(item.Status ?? item.status) === 1);
}

function sharedTooltip(s: Record<string, unknown>): string {
    const sharedItem = getShareInfo(s).find((item) => Number(item.status ?? item.Status) === 1);
    const v = sharedItem?.share_version || sharedItem?.ShareVersion;
    return v ? `已加入"企业共享Skill" 所用版本 v${v}` : '已加入"企业共享Skill"';
}

function isInstalled(skill: Record<string, unknown>): boolean {
    const sid = (skill.skill_id || '') as string;
    return !!skill.installed || (!!sid && installedIds.value.has(sid));
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
        nextTick(() => updateScrollState());
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

        const list = (result.skill_list || []).map((s: Record<string, unknown>) => {
            // 接口返回 PascalCase，对齐 webim adaptSkillSummary，打平嵌套字段
            const profile = (s.Profile || s.profile || {}) as Record<string, unknown>;
            const classificationInfo = (s.ClassificationInfo || s.classification_info || {}) as Record<string, unknown>;
            const currentVersionInfo = (s.CurrentVersionInfo || s.current_version_info || {}) as Record<string, unknown>;
            const shareList = (s.ShareList || s.share_list || s.share_info || s.ShareInfo || []) as Array<Record<string, unknown>>;
            const analysisInfo = (currentVersionInfo.AnalysisInfo || currentVersionInfo.analysis_info || s.AnalysisInfo || s.analysis_info || {}) as Record<string, unknown>;
            const skillId = (s.SkillId || s.skill_id || '') as string;

            return {
                ...s,
                skill_id: skillId,
                is_favorite: s.IsFavorite ?? s.is_favorite ?? false,
                share_info: shareList,
                analysis_info: analysisInfo,
                current_version: (currentVersionInfo.Version || currentVersionInfo.version || s.current_version || '') as string,
                profile: {
                    ...profile,
                    // 打平 ClassificationInfo 字段到 profile
                    type: classificationInfo.ProviderType ?? classificationInfo.provider_type ?? profile.type,
                    billing_type: classificationInfo.BillingType ?? classificationInfo.billing_type ?? profile.billing_type,
                    source_link: classificationInfo.SourceLink ?? classificationInfo.source_link ?? profile.source_link,
                    category_key: classificationInfo.CategoryKey ?? classificationInfo.category_key ?? profile.category_key,
                },
                installed: installedIds.value.has(skillId),
            };
        });

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
    if (isInstalled(skill)) {
        emit('skill-uninstalled', skill);
        return;
    }
    if (isLimitReached.value) {
        MessagePlugin.warning('已达到最大安装数量');
        return;
    }
    const agentId = await getAgentIdByAppId(props.applicationId);
    if (!agentId) {
        // 无 agentId 时仅 emit，由宿主自行处理接口调用
        emit('skill-installed', skill);
        return;
    }
    busyId.value = sid;
    try {
        const existingSkills = props.installedSkills
            .filter((s) => {
                const id = (s.skill_id || s.SkillId || '') as string;
                return !!id;
            })
            .map((s) => ({
                skillId: (s.skill_id || s.SkillId || '') as string,
            }));
        const mergedSkills = [
            ...existingSkills,
            { skillId: sid },
        ];
        await modifyAgentSkillList({
            applicationId: props.applicationId,
            agentId,
            skills: mergedSkills,
        });
        emit('skill-installed', skill);
        MessagePlugin.success('添加成功');
    } catch (e) {
        console.error('[SkillsInstallDialog] ModifyAgent error:', e);
        MessagePlugin.error('添加失败');
    } finally {
        busyId.value = '';
    }
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
@import url('../../styles/dialog-common.css');

.skills-install {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 560px;
    overflow-y: auto;
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
    gap: var(--td-comp-paddingTB-m);
}
.skills-install__filter-row--simple {
    flex-wrap: wrap;
}
.skills-install__filter-actions {
    display: flex;
    align-items: center;
    gap: var(--td-size-4);
    flex-shrink: 0;
    flex-wrap: wrap;
}
.skills-install__list {
    max-height: 380px;
}
.skills-install__loading-more {
    padding: var(--td-size-6) 0;
}
.skills-install__items {
    display: flex;
    flex-direction: column;
}

/* Skill 卡片特有 */
.skills-install__card {
    border-bottom: 1px solid rgba(18, 42, 79, 0.08);
    transition: background 0.2s;
}
.skills-install__card:last-child {
    border-bottom: none;
}
.skill-card__icon,
.skill-card__icon-fallback {
    width: 60px;
    height: 60px;
    border-radius: var(--td-radius-medium);
    flex-shrink: 0;
    object-fit: cover;
    background: var(--td-brand-color-light);
}
.skill-card__icon-fallback {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--td-text-color-secondary);
}
.skill-card__tag-suffix {
    color: var(--td-text-color-placeholder);
    cursor: pointer;
    margin-left: var(--td-size-1);
}
.skill-card__tag-suffix:hover {
    color: var(--td-brand-color);
}
.skill-card__meta-divider {
    margin: 0 var(--td-size-1);
}
.skill-card__author {
    cursor: pointer;
    transition: color 0.2s;
}
.skill-card__author:hover {
    color: var(--td-brand-color);
}

/* ── 移动端适配 ── */
@media (max-width: 600px) {
    .skills-install {
        max-height: 60vh;
        overflow-y: auto;
    }
    /* 筛选行：分类 + 搜索分别占满宽 */
    .skills-install__filter-row {
        flex-wrap: wrap;
    }
    .skills-install__categories-wrapper {
        width: 100%;
        order: 1;
    }
    .skills-install__filter-actions {
        width: 100%;
        order: 2;
    }
    .skills-install__search {
        width: 100%;
        flex: 1;
    }
    /* 卡片：紧凑布局 */
    .skill-card__body {
        padding: var(--td-size-4);
        gap: var(--td-size-4);
        flex-wrap: wrap;
    }
    .skill-card__icon,
    .skill-card__icon-fallback {
        width: 48px;
        height: 48px;
    }
    .skill-card__info {
        flex-basis: calc(100% - 60px);
    }
    .skill-card__name {
        font-size: var(--td-font-size-body-medium);
    }
    .skill-card__actions {
        width: 100%;
        justify-content: flex-end;
    }
}
</style>
