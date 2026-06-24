<template>
    <div class="skills-popover-wrapper">
        <!-- 触发按钮 -->
        <div
            ref="triggerRef"
            class="skills-popover-trigger"
            :class="{ 'is-active': popupVisible }"
            @click.stop="togglePopup"
        >
            <CustomizedIcon
                remote
                name="basic_bulb_line"
                size="s"
                :show-hover-bg="false"
                :theme="theme"
                :color="'var(--td-text-color-secondary)'"
            />
            <span class="skills-popover-trigger__text">{{ i18n.skills }}</span>
        </div>

        <!-- 浮层内容（手动控制显隐，通过 Teleport 挂载到 body 避免裁剪） -->
        <Teleport to="body">
            <div
                v-if="popupVisible"
                class="skills-popover-overlay"
                @click.self="popupVisible = false"
            >
                <div
                    ref="popoverRef"
                    class="skills-popover"
                    :style="popoverStyle"
                    @click.stop
                >
                    <!-- 搜索框 -->
                    <div class="skills-popover__search">
                        <t-input
                            ref="searchInputRef"
                            v-model="searchInput"
                            :placeholder="i18n.search"
                            clearable
                        >
                            <template #prefix-icon>
                                <CustomizedIcon remote name="basic_search_line" size="xs" :show-hover-bg="false" :theme="theme" />
                            </template>
                        </t-input>
                    </div>

                    <!-- Skill 列表 -->
                    <div class="skills-popover__list">
                        <t-loading v-if="loading"  class="skills-popover__loading" />
                        <template v-else>
                            <div
                                v-for="skill in filteredSkills"
                                :key="skill.id"
                                class="skills-popover__item"
                                :title="skill.displayName"
                                @click="onSelectSkill(skill)"
                            >
                                <img
                                    v-if="skill.iconUrl"
                                    :src="skill.iconUrl"
                                    class="skills-popover__icon"
                                    @error="onIconError($event)"
                                />
                                <span v-else class="skills-popover__icon-fallback">
                                    <CustomizedIcon remote name="basic_bulb_line" size="s" :show-hover-bg="false" :theme="theme" />
                                </span>
                                <span class="skills-popover__name">{{ skill.displayName }}</span>
                            </div>

                            <div v-if="filteredSkills.length === 0" class="skills-popover__empty">
                                <span v-if="searchInput">{{ i18n.noMatch }}</span>
                                <span v-else>{{ i18n.noSkills }}</span>
                            </div>
                        </template>
                    </div>

                    <!-- 分割线 -->
                    <div class="skills-popover__divider"></div>

                    <!-- 管理 Skills 入口 -->
                    <div class="skills-popover__manage" @click="onManageClick">
                        <CustomizedIcon remote name="basic_setting_line" size="s" :show-hover-bg="false" :theme="theme" />
                        <span>{{ i18n.manageSkills }}</span>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from 'vue';
import { Input as TInput, Loading as TLoading } from 'tdesign-vue-next';
import CustomizedIcon from '../CustomizedIcon.vue';
import type { NormalizedSkill, SkillsI18n, SkillSelectEvent } from '../../model/skills';
import { defaultSkillsI18n, defaultSkillsI18nEn } from '../../model/skills';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';

interface Props extends ThemeProps {
    installedSkills?: NormalizedSkill[];
    loading?: boolean;
    i18n?: Partial<SkillsI18n>;
    language?: string;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    installedSkills: () => [],
    loading: false,
    i18n: () => ({}),
    language: 'zh-CN',
});

const emit = defineEmits<{
    (e: 'select', item: SkillSelectEvent): void;
    (e: 'manage'): void;
    (e: 'visible-change', visible: boolean): void;
}>();

const i18n = computed<Required<SkillsI18n>>(() => {
    const defaults = props.language?.startsWith('en') ? defaultSkillsI18nEn : defaultSkillsI18n;
    return { ...defaults, ...props.i18n };
});

const popupVisible = ref(false);
const searchInput = ref('');
const searchInputRef = ref<InstanceType<typeof TInput> | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const popoverRef = ref<HTMLElement | null>(null);

/** 浮层定位样式（相对于 trigger 计算） */
const popoverStyle = ref<Record<string, string>>({
    position: 'absolute',
    width: '248px',
    maxWidth: '90vw',
    padding: '4px',
    borderRadius: '6px',
    background: 'var(--td-bg-color-container)',
    boxShadow: 'var(--td-shadow-2)',
});

/** 计算浮层位置（放置在 trigger 上方左对齐） */
function updatePosition() {
    if (!triggerRef.value) return;
    const rect = triggerRef.value.getBoundingClientRect();
    popoverStyle.value = {
        ...popoverStyle.value,
        top: `${rect.top - 8}px`, // 在 trigger 上方，transform 会处理
        left: `${rect.left}px`,
        transform: 'translateY(-100%)',
    };
}

/** 切换显示/隐藏 */
function togglePopup() {
    popupVisible.value = !popupVisible.value;
}

/** 显隐回调 */
watch(popupVisible, (visible) => {
    emit('visible-change', visible);
    if (visible) {
        searchInput.value = '';
        updatePosition();
        nextTick(() => {
            const inputEl = searchInputRef.value?.$el?.querySelector('input') as HTMLInputElement;
            inputEl?.focus();
        });
    }
});

/** 窗口 resize/scroll 时更新位置 */
function onResizeOrScroll() {
    if (popupVisible.value) updatePosition();
}

onMounted(() => {
    window.addEventListener('resize', onResizeOrScroll);
    window.addEventListener('scroll', onResizeOrScroll, true);
});

onUnmounted(() => {
    window.removeEventListener('resize', onResizeOrScroll);
    window.removeEventListener('scroll', onResizeOrScroll, true);
});

/** 搜索过滤 */
const filteredSkills = computed(() => {
    const kw = searchInput.value.trim().toLowerCase();
    if (!kw) return props.installedSkills;
    return props.installedSkills.filter((s) => {
        const dn = (s.displayName || '').toLowerCase();
        return dn.includes(kw);
    });
});

function onSelectSkill(skill: NormalizedSkill) {
    popupVisible.value = false;
    emit('select', {
        type: 'skills',
        id: skill.id,
        name: skill.name,
        displayName: skill.displayName,
        categoryLabel: 'Skills',
    });
}

function onManageClick() {
    popupVisible.value = false;
    emit('manage');
}

function onIconError(e: Event) {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
        const fallback = parent.querySelector('.skills-popover__icon-fallback') as HTMLElement;
        if (fallback) fallback.style.display = 'inline-flex';
    }
}

function show() {
    popupVisible.value = true;
}

function hide() {
    popupVisible.value = false;
}

defineExpose({ show, hide });
</script>

<style lang="less" scoped>
.skills-popover-wrapper {
    display: inline-flex;
    align-items: center;
}

/* 触发按钮：pill 样式，与 smart-webim 中 toolbar-pill-btn 一致 */
.skills-popover-trigger {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 16px;
    font-size: 12px;
    line-height: 16px;
    color: var(--td-text-color-primary);
    background: transparent;
    cursor: pointer;
    white-space: nowrap;
    transition: background-color 0.2s;

    &:hover,
    &.is-active {
        background: var(--td-bg-color-container-active);
    }

    &__text {
        white-space: nowrap;
    }
}
</style>

<style lang="less">
/* overlay 层：全屏透明遮罩，点击关闭浮层 */
.skills-popover-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5500;
}

/* 浮层容器 */
.skills-popover {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    gap: 4px;
    max-height: 312px;
    position: absolute;

    &__search {
        flex-shrink: 0;
        padding: 4px;
        box-sizing: border-box;

        :deep(.t-input) {
            width: 100%;
        }
    }

    &__list {
        flex: 1;
        min-height: 0;
        max-height: 220px;
        overflow-y: auto;
        padding: 0;

        &::-webkit-scrollbar {
            width: 4px;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 2px;
            background: rgba(17, 32, 70, 0.13);
        }
    }

    &__loading {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px 0;
    }

    &__item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 8px;
        height: 28px;
        font-size: 13px;
        line-height: 20px;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.15s;

        &:hover {
            background: var(--td-bg-color-container-active);
        }
    }

    &__icon {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        object-fit: cover;
    }

    &__icon-fallback {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--td-text-color-secondary);
        background: var(--td-bg-color-secondarycontainer);
    }

    &__name {
        flex: 1;
        min-width: 0;
        font-size: 13px;
        color: var(--td-text-color-primary);
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__empty {
        padding: 24px 0;
        text-align: center;
        font-size: 12px;
        color: var(--td-text-color-placeholder);
    }

    &__divider {
        flex-shrink: 0;
        margin: 4px 12px;
        height: 1px;
        background: var(--td-component-border);
    }

    &__manage {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 8px;
        height: 28px;
        font-size: 13px;
        line-height: 20px;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.15s;
        color: var(--td-text-color-secondary);

        &:hover {
            background: var(--td-bg-color-container-active);
        }
    }
}
</style>
