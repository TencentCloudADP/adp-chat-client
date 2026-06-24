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
                    <CustomizedIcon remote name="arrow_right2_line" size="s" :show-hover-bg="false" class="at-mention-panel__category-arrow" />
                </div>
            </div>
        </div>

        <!-- 右栏：子项列表 -->
        <div class="at-mention-panel__submenu">
            <div v-if="activeItems.length === 0" class="at-mention-panel__empty">暂无可选项目</div>
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
import type { NormalizedSkill } from '../../model/skills';

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
    searchKeyword?: string;
}

const props = withDefaults(defineProps<Props>(), {
    installedSkills: () => [],
    installedConnectors: () => [],
    installedTools: () => [],
    searchKeyword: '',
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

const categoryList = computed<Category[]>(() => {
    const list: Category[] = [];
    if (props.installedSkills.length) list.push({ key: 'skills', label: 'Skills', icon: 'basic_bulb_line', items: props.installedSkills });
    if (props.installedConnectors.length) list.push({ key: 'connectors', label: '连接器', icon: 'basic_api_line', items: props.installedConnectors });
    if (props.installedTools.length) list.push({ key: 'tools', label: '工具', icon: 'basic_plugin_line', items: props.installedTools });
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

<style lang="less" scoped>
.at-mention-panel {
    display: flex;
    background: var(--td-bg-color-container);
    border-radius: 6px;
    box-shadow: var(--td-shadow-2);
    overflow: hidden;
    width: 320px;
    height: 280px;
}

.at-mention-panel__categories {
    width: 110px;
    border-right: 1px solid var(--td-component-border);
    overflow-y: auto;
    padding: 4px 0;
    flex-shrink: 0;
}

.at-mention-panel__category {
    cursor: pointer;
    transition: background 0.15s;
    &:hover { background: var(--td-bg-color-container-active); }
    &--active { background: var(--td-bg-color-container-active); }
    &--focused { background: var(--td-brand-color-light); }
}

.at-mention-panel__category-inner {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    font-size: 13px;
    color: var(--td-text-color-primary);
}

.at-mention-panel__category-name {
    flex: 1;
    white-space: nowrap;
}

.at-mention-panel__category-arrow {
    color: var(--td-text-color-placeholder);
}

.at-mention-panel__submenu {
    flex: 1;
    overflow-y: auto;
    padding: 4px 0;
    min-width: 0;
}

.at-mention-panel__subitem {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    cursor: pointer;
    transition: background 0.15s;
    &:hover { background: var(--td-bg-color-container-active); }
    &--focused { background: var(--td-brand-color-light); }
}

.at-mention-panel__subitem-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    color: var(--td-text-color-secondary);
    &--fallback {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: var(--td-bg-color-secondarycontainer);
    }
}

.at-mention-panel__subitem-name {
    font-size: 13px;
    color: var(--td-text-color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.at-mention-panel__empty {
    padding: 8px;
    color: var(--td-text-color-placeholder);
    font-size: 12px;
    text-align: center;
}
</style>
