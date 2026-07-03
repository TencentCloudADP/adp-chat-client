<template>
    <div class="at-mention-panel" :class="{ 'at-mention-panel--keyboard': isKeyboardNavigating }">
        <!-- 左栏：分类列表 -->
        <div class="at-mention-panel__categories">
            <div
                v-for="(cat, idx) in categoryList"
                :key="cat.key"
                :class="['at-mention-panel__category', {
                    'at-mention-panel__category--active': activeCategory === cat.key,
                    'at-mention-panel__category--focused': isKeyboardNavigating && focusZone === 'category' && categoryIndex === idx
                }]"
                @mouseenter="onCategoryHover(idx)"
                @click="onCategoryClick(cat)"
            >
                <div class="at-mention-panel__category-inner">
                    <CustomizedIcon remote :name="cat.icon" size="s" :show-hover-bg="false" />
                    <span class="at-mention-panel__category-name">{{ cat.label }}</span>
                </div>
            </div>
        </div>

        <!-- 右栏：子项列表 -->
        <div class="at-mention-panel__submenu">
            <div v-if="activeItems.length === 0" class="at-mention-panel__empty">{{ mergedI18n.mentionEmpty }}</div>
            <div
                v-for="(item, idx) in activeItems"
                :key="item.id"
                :class="['at-mention-panel__subitem', { 'at-mention-panel__subitem--focused': isKeyboardNavigating && focusZone === 'submenu' && subitemIndex === idx }]"
                @mouseenter="onSubitemHover(idx)"
                @click="onSelectItem(item)"
            >
                <img v-if="item.iconUrl" :src="item.iconUrl" class="at-mention-panel__subitem-icon" @error="(e) => (e.target as HTMLImageElement).style.display='none'" />
                <span v-else class="at-mention-panel__subitem-icon at-mention-panel__subitem-icon--fallback">
                    <CustomizedIcon remote :name="activeCat?.icon || 'basic_bulb_line'" size="s" :show-hover-bg="false" />
                </span>
                <span class="at-mention-panel__subitem-name" :title="item.displayName">{{ item.displayName }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import CustomizedIcon from '../CustomizedIcon.vue';
import type { NormalizedSkill, SkillsI18n } from '../../model/skills';
import { defaultSkillsI18n, defaultSkillsI18nEn } from '../../model/skills';

/** 分类配置 */
interface Category {
    key: string;
    label: string;
    icon: string;
    items: NormalizedSkill[];
}

interface Props {
    installedSkills?: NormalizedSkill[];
    installedConnectors?: NormalizedSkill[];
    installedTools?: NormalizedSkill[];
    installedKnowledge?: NormalizedSkill[];
    searchKeyword?: string;
    /** 国际化文本 */
    i18n?: SkillsI18n;
    /** 当前语言标识 */
    language?: string;
}

const props = withDefaults(defineProps<Props>(), {
    installedSkills: () => [],
    installedConnectors: () => [],
    installedTools: () => [],
    installedKnowledge: () => [],
    searchKeyword: '',
    i18n: () => ({}),
    language: 'zh-CN',
});

const mergedI18n = computed(() => {
    const defaults = props.language?.startsWith('en') ? defaultSkillsI18nEn : defaultSkillsI18n;
    return { ...defaults, ...props.i18n };
});

const emit = defineEmits<{
    (e: 'select', item: { type: string; id: string; name: string; displayName: string; categoryLabel: string }): void;
    (e: 'close'): void;
}>();

const activeCategory = ref('skills');
const focusZone = ref<'category' | 'submenu'>('category');
const categoryIndex = ref(0);
const subitemIndex = ref(0);
const isKeyboardNavigating = ref(false);

/** 按 id 去重，保留首次出现的项 */
function dedupe(items: NormalizedSkill[]): NormalizedSkill[] {
    const seen = new Set<string>();
    return items.filter((item) => {
        const key = item.id || item.name;
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

const categoryList = computed<Category[]>(() => {
    const list: Category[] = [];
    if (props.installedSkills.length) list.push({ key: 'skills', label: mergedI18n.value.skills || 'Skills', icon: 'basic_bulb_line', items: dedupe(props.installedSkills) });
    if (props.installedConnectors.length) list.push({ key: 'connectors', label: mergedI18n.value.connector || '连接器', icon: 'basic_connector_line', items: dedupe(props.installedConnectors) });
    if (props.installedTools.length) list.push({ key: 'tools', label: mergedI18n.value.tools || '工具', icon: 'basic_plugin_line', items: dedupe(props.installedTools) });
    if (props.installedKnowledge.length) list.push({ key: 'knowledgeBase', label: mergedI18n.value.knowledgeBase || '知识库', icon: 'basic_book_line', items: dedupe(props.installedKnowledge) });
    return list;
});

const activeCat = computed(() => categoryList.value.find(c => c.key === activeCategory.value));
const activeItems = computed(() => {
    const items = activeCat.value?.items || [];
    const kw = props.searchKeyword.trim().toLowerCase();
    if (!kw) return items;
    return items.filter(i => (i.displayName || '').toLowerCase().includes(kw));
});



function onCategoryHover(idx: number) {
    if (isKeyboardNavigating.value) return;
    const cat = categoryList.value[idx];
    if (cat) activeCategory.value = cat.key;
}

function onCategoryClick(cat: Category) {
    activeCategory.value = cat.key;
    focusZone.value = 'submenu';
    subitemIndex.value = 0;
}

function onSubitemHover(idx: number) {
    if (isKeyboardNavigating.value) return;
    subitemIndex.value = idx;
}

function onSelectItem(item: NormalizedSkill) {
    emit('select', {
        type: activeCategory.value,
        id: item.id,
        name: item.name,
        displayName: item.displayName,
        categoryLabel: activeCat.value?.label || '',
    });
}

/** 键盘导航 */
function handleKeydown(e: KeyboardEvent): boolean {
    isKeyboardNavigating.value = true;
    if (e.key === 'ArrowUp') { _moveVertical(-1); return true; }
    if (e.key === 'ArrowDown') { _moveVertical(1); return true; }
    if (e.key === 'ArrowRight') {
        if (focusZone.value === 'category') { focusZone.value = 'submenu'; subitemIndex.value = 0; return true; }
    }
    if (e.key === 'ArrowLeft') {
        if (focusZone.value === 'submenu') { focusZone.value = 'category'; return true; }
    }
    if (e.key === 'Enter') {
        if (focusZone.value === 'category') {
            const cat = categoryList.value[categoryIndex.value];
            if (cat) { activeCategory.value = cat.key; focusZone.value = 'submenu'; subitemIndex.value = 0; }
            return true;
        }
        const item = activeItems.value[subitemIndex.value];
        if (item) { onSelectItem(item); }
        return true;
    }
    if (e.key === 'Escape') { emit('close'); return true; }
    return false;
}

function _moveVertical(delta: number) {
    if (focusZone.value === 'category') {
        const len = categoryList.value.length;
        categoryIndex.value = (categoryIndex.value + delta + len) % len;
        const cat = categoryList.value[categoryIndex.value];
        if (cat) activeCategory.value = cat.key;
        subitemIndex.value = 0;
    } else {
        const len = activeItems.value.length;
        if (!len) return;
        subitemIndex.value = (subitemIndex.value + delta + len) % len;
    }
}

function resetNavigation() {
    isKeyboardNavigating.value = false;
    focusZone.value = 'category';
    categoryIndex.value = 0;
    subitemIndex.value = 0;
}

defineExpose({ handleKeydown, resetNavigation });
</script>

<style scoped>
/* ── 面板容器 ── */
.at-mention-panel {
    display: flex;
    background: var(--td-bg-color-container);
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08), 0 8px 32px rgba(0, 0, 0, 0.06);
    border: 1px solid var(--td-component-stroke);
    overflow: hidden;
    width: 320px;
    height: 280px;
}

/* ── 左栏：分类列表 ── */
.at-mention-panel__categories {
    width: 130px;
    border-right: 1px solid var(--td-component-border);
    overflow-y: auto;
    padding: 4px 0;
    flex-shrink: 0;
    scrollbar-width: thin;
    scrollbar-color: var(--td-scrollbar-color, rgba(0,0,0,.12)) transparent;
}

.at-mention-panel__category {
    cursor: pointer;
    transition: background 0.12s ease;
}

.at-mention-panel__category:hover {
    background: var(--td-bg-color-container-active);
}

.at-mention-panel__category--active {
    background: var(--td-bg-color-container-active);
}

.at-mention-panel__category--focused {
    background: var(--td-brand-color-light);
}

.at-mention-panel__category-inner {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 10px;
    height: 36px;
    font-size: 13px;
    color: var(--td-text-color-primary);
}

.at-mention-panel__category-name {
    flex: 1;
    white-space: nowrap;
}

.at-mention-panel__category-arrow {
    color: var(--td-text-color-placeholder);
    opacity: 0.6;
    transition: opacity 0.15s ease;
}

.at-mention-panel__category--active .at-mention-panel__category-arrow {
    opacity: 1;
}

/* ── 右栏：子项列表 ── */
.at-mention-panel__submenu {
    flex: 1;
    overflow-y: auto;
    padding: 4px 0;
    min-width: 0;
    scrollbar-width: thin;
    scrollbar-color: var(--td-scrollbar-color, rgba(0,0,0,.12)) transparent;
}

.at-mention-panel__submenu::-webkit-scrollbar {
    width: 4px;
}

.at-mention-panel__submenu::-webkit-scrollbar-thumb {
    background: var(--td-scrollbar-color, rgba(0,0,0,.12));
    border-radius: 4px;
}

.at-mention-panel__submenu::-webkit-scrollbar-track {
    background: transparent;
}

.at-mention-panel__subitem {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 10px;
    height: 36px;
    cursor: pointer;
    transition: background 0.12s ease;
}

.at-mention-panel__subitem:hover {
    background: var(--td-bg-color-container-active);
}

.at-mention-panel__subitem--focused {
    background: var(--td-brand-color-light);
}

.at-mention-panel__subitem-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    color: var(--td-text-color-secondary);
}

.at-mention-panel__subitem-icon--fallback {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--td-bg-color-secondarycontainer);
}

.at-mention-panel__subitem-name {
    font-size: 13px;
    color: var(--td-text-color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.at-mention-panel__empty {
    padding: 24px 8px;
    color: var(--td-text-color-placeholder);
    font-size: 12px;
    text-align: center;
}
</style>
