<!--
  侧边栏分组列表组件
  @description
    通用的"标题 + 若干列表项"分组，用于在侧边栏承载「定时任务」「远程终端」「最近任务」等分组。
    UI 风格参考 HistoryList.vue，保持整体一致；结构参考 smart-webim/conversation-list.vue 的 task-group。
    组件本身不关心业务语义，仅负责渲染 + 事件外抛，具体数据 / 图标 / 激活态由父层决定。
-->
<script setup lang="ts">
import { computed } from 'vue';
import { Icon as TIcon } from 'tdesign-vue-next';
import CustomizedIcon from '../CustomizedIcon.vue';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';

/** 分组列表项 */
export interface SideGroupItem {
    /** 唯一 id，作为选中 / 事件参数 */
    id: string;
    /** 显示文案（会做 ellipsis） */
    label: string;
    /**
     * 前置图标名（可选）。传了就在标题前显示一枚小图标。
     * 默认走 CustomizedIcon 的远程图标库；若需本地图标可通过 iconRemote=false 关闭。
     */
    icon?: string;
    /** 是否远程图标（默认 true） */
    iconRemote?: boolean;
    /** 右上角的辅助文字（如更新时间），仅在非 hover/active 状态显示 */
    extraText?: string;
    /** 禁用点击（如未完成配置的远程终端占位） */
    disabled?: boolean;
}

interface Props extends ThemeProps {
    /** 分组标题（如"定时任务"/"远程终端"） */
    title: string;
    /** 列表项 */
    items?: SideGroupItem[];
    /** 当前选中项 id */
    activeId?: string;
    /**
     * 空数据时是否隐藏整个分组。true 表示 items 为空则完全不渲染，避免出现空标题。
     * 默认 true。
     */
    hideWhenEmpty?: boolean;
    /**
     * 是否显示右侧删除按钮（hover / active 才可见）。
     * 默认 false —— 定时任务 / 远程终端类分组一般不由这里发起删除。
     */
    showDelete?: boolean;
    /** 分组标题右侧「设置 / 添加」入口图标（如"渠道设置"）。传了才显示。 */
    headerActionIcon?: string;
    /** 分组标题右侧入口 tooltip 文案 */
    headerActionTip?: string;
    /**
     * 空数据时展示的占位文案，仅在 hideWhenEmpty=false 时生效。
     * 不传则使用默认「暂无数据」。
     */
    emptyText?: string;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    items: () => [],
    activeId: '',
    hideWhenEmpty: true,
    showDelete: false,
    headerActionIcon: '',
    headerActionTip: '',
    emptyText: '暂无数据',
});

const emit = defineEmits<{
    /** 点击某个列表项 */
    (e: 'select', item: SideGroupItem): void;
    /** 点击某项右侧删除按钮 */
    (e: 'delete', item: SideGroupItem): void;
    /** 点击分组标题右侧的「设置 / 添加」入口 */
    (e: 'headerAction'): void;
}>();

const shouldRender = computed(() => {
    if (props.hideWhenEmpty && props.items.length === 0) return false;
    return true;
});

const handleClick = (item: SideGroupItem) => {
    if (item.disabled) return;
    emit('select', item);
};

const handleDeleteClick = (event: Event, item: SideGroupItem) => {
    event.stopPropagation();
    if (item.disabled) return;
    emit('delete', item);
};

const handleHeaderAction = (event: Event) => {
    event.stopPropagation();
    emit('headerAction');
};
</script>

<template>
    <div v-if="shouldRender" class="side-group-list">
        <div class="side-group-header">
            <span class="side-group-header__title">{{ title }}</span>
            <span
                v-if="headerActionIcon"
                class="side-group-header__action"
                :title="headerActionTip"
                role="button"
                tabindex="0"
                @click="handleHeaderAction"
                @keydown.enter.prevent="handleHeaderAction($event)"
            >
                <CustomizedIcon
                    :name="headerActionIcon"
                    remote
                    size="xs"
                    :theme="theme"
                    :show-hover-bg="false"
                />
            </span>
        </div>
        <div
            v-for="item in items"
            :key="item.id"
            class="side-group-item"
            :class="{
                active: activeId === item.id,
                'is-disabled': item.disabled,
            }"
            @click="handleClick(item)"
        >
            <CustomizedIcon
                v-if="item.icon"
                :name="item.icon"
                :remote="item.iconRemote !== false"
                size="xs"
                :theme="theme"
                :show-hover-bg="false"
                class="side-group-item__icon"
            />
            <div class="side-group-item__label" :title="item.label">{{ item.label }}</div>
            <span
                v-if="showDelete && !item.disabled"
                class="side-group-item__delete"
                aria-label="删除"
                role="button"
                tabindex="0"
                @click="handleDeleteClick($event, item)"
                @keydown.enter.stop.prevent="handleDeleteClick($event, item)"
            >
                <TIcon name="delete" size="14px" />
            </span>
            <span v-else-if="item.extraText" class="side-group-item__extra">
                {{ item.extraText }}
            </span>
        </div>
        <!-- 空态占位：仅当 hideWhenEmpty=false 且 items 为空时展示 -->
        <div v-if="items.length === 0" class="side-group-empty">
            {{ emptyText }}
        </div>
    </div>
</template>

<style scoped>
.side-group-list {
    width: 100%;
    padding: 0 var(--td-size-2);
    margin-bottom: var(--td-comp-margin-xs, 4px);
}

.side-group-header {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    height: var(--td-comp-size-s);
    line-height: var(--td-comp-size-s);
    color: var(--td-text-color-placeholder);
    padding-left: var(--td-comp-paddingLR-s);
    padding-right: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--td-comp-margin-xs);
}

.side-group-header__title {
    color: var(--td-text-color-placeholder);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.03em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.side-group-header__action {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: var(--td-radius-small);
    color: var(--td-text-color-placeholder);
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
}

.side-group-header__action:hover {
    background: var(--td-bg-color-container-hover);
    color: var(--td-text-color-primary);
}

.side-group-header__action:focus-visible {
    outline: 2px solid var(--td-brand-color);
    outline-offset: 1px;
}

.side-group-item {
    min-height: 36px;
    line-height: var(--td-line-height-body-small);
    cursor: pointer;
    padding: var(--td-size-4) 10px;
    border-radius: var(--td-radius-medium);
    transition: background 0.15s ease, color 0.15s ease;
    color: var(--td-text-color-primary);
    display: flex;
    align-items: center;
    font-size: var(--td-font-size-body-medium);
    margin-bottom: var(--td-size-1);
}

.side-group-item.active {
    background: var(--td-bg-color-container-active);
    font-weight: 500;
}

.side-group-item:hover:not(.active):not(.is-disabled) {
    background: var(--td-bg-color-container-hover);
}

.side-group-item.is-disabled {
    cursor: not-allowed;
    color: var(--td-text-color-disabled);
}

.side-group-item__icon {
    flex-shrink: 0;
    margin-right: var(--td-size-4);
}

.side-group-item__label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.side-group-item__extra {
    flex-shrink: 0;
    margin-left: var(--td-size-4);
    font-size: 11px;
    color: var(--td-text-color-placeholder);
    opacity: 0;
    transition: opacity 0.15s ease;
}

.side-group-item:not(:hover):not(.active) .side-group-item__extra {
    opacity: 1;
}

/* hover / active 时让位给删除按钮（若开启） */
.side-group-item:hover .side-group-item__extra,
.side-group-item.active .side-group-item__extra {
    display: none;
}

.side-group-item__delete {
    flex-shrink: 0;
    margin-left: var(--td-size-4);
    display: none;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: var(--td-radius-small);
    color: var(--td-text-color-placeholder);
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
}

.side-group-item:hover .side-group-item__delete,
.side-group-item.active .side-group-item__delete {
    display: inline-flex;
}

.side-group-item__delete:hover {
    background: var(--td-bg-color-container-active);
    color: var(--td-error-color);
}

.side-group-item__delete:focus-visible {
    outline: 2px solid var(--td-brand-color);
    outline-offset: 1px;
}

.side-group-empty {
    padding: 8px var(--td-comp-paddingLR-s, 10px);
    font-size: var(--td-font-size-body-small, 12px);
    color: var(--td-text-color-placeholder);
    line-height: var(--td-line-height-body-small);
}
</style>
