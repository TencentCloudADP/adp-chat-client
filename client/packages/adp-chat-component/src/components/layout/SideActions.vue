<script setup lang="ts">
/**
 * 侧边栏快捷入口
 *
 * 用于在侧边抽屉顶部集中放置"新建任务 / 定时任务"等入口按钮。
 *
 * 使用方式：
 * 1. 默认按钮：仅需传入 activeKey，通过 emit('action', key) 接收点击
 *    <SideActions :active-key="activeKey" @action="onAction" />
 *
 * 2. 自定义按钮列表：通过 items 完全覆盖默认按钮
 *    <SideActions :items="[{ key: 'foo', label: 'Foo', icon: 'basic_star_line' }]" ... />
 *
 * 参考 smart-webim/conversation-list.vue 中的 .new-task-btn 结构与交互。
 */
import { computed } from 'vue';
import CustomizedIcon from '../CustomizedIcon.vue';
import type { ThemeProps, SideI18n } from '../../model/type';
import { themePropsDefaults, defaultSideI18n } from '../../model/type';

/** 快捷入口项 */
export interface SideActionItem {
    /** 唯一标识，作为点击事件参数返回给上层 */
    key: string;
    /** 显示文案 */
    label: string;
    /** 图标名（默认走 CustomizedIcon 的 remote 图标库；如需本地图标可关闭 remote） */
    icon: string;
    /** 是否使用远程图标库（默认 true） */
    remote?: boolean;
    /** 图标尺寸 */
    iconSize?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';
}

interface Props extends ThemeProps {
    /**
     * 自定义按钮列表。若不传，则使用 i18n 生成默认按钮：
     *   - key: 'new-task'         icon: 'basic_newchat_line'   （始终显示，新建对话）
     *   - key: 'cron-task'        icon: 'basic_time_line'      （showCronTask=true 时显示，默认 true）
     *   - key: 'channel-list'     icon: 'basic_time_line'      （showChannelList=true 时显示）
     *
     * 注：远程终端不再作为快捷入口，改为下方 SideLayout 的分组列表呈现。
     */
    items?: SideActionItem[];
    /** 当前处于激活态的按钮 key */
    activeKey?: string;
    /** 是否显示"定时任务"入口（在使用默认按钮时生效） */
    showCronTask?: boolean;
    /** 是否显示"展开列表"入口（远程终端选中时生效） */
    showChannelList?: boolean;
    /** 侧边栏国际化文本（用于默认按钮文案） */
    i18n?: SideI18n;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    items: undefined,
    activeKey: '',
    showCronTask: true,
    showChannelList: false,
    i18n: () => ({}),
});

const emit = defineEmits<{
    /** 点击某个入口按钮 */
    (e: 'action', key: string, item: SideActionItem): void;
}>();

/** 合并默认 i18n */
const mergedI18n = computed<Required<SideI18n>>(() => ({
    ...defaultSideI18n,
    ...props.i18n,
}));

/** 若未传 items，则生成默认按钮列表 */
const displayItems = computed<SideActionItem[]>(() => {
    if (props.items && props.items.length > 0) {
        return props.items;
    }
    const list: SideActionItem[] = [
        {
            key: 'new-task',
            label: mergedI18n.value.newTask,
            icon: 'basic_newchat_line',
            remote: true,
            iconSize: 'xs',
        },
    ];
    if (props.showCronTask) {
        list.push({
            key: 'cron-task',
            label: mergedI18n.value.cronTask,
            icon: 'basic_time_line',
            remote: true,
            iconSize: 'xs',
        });
    }
    if (props.showChannelList) {
        list.push({
            key: 'channel-list',
            label: mergedI18n.value.channelList || '展开列表',
            icon: 'basic_time_line',
            remote: true,
            iconSize: 'xs',
        });
    }
    return list;
});

const handleClick = (item: SideActionItem) => {
    emit('action', item.key, item);
};
</script>

<template>
    <div class="side-actions" :class="{ 'is-dark': theme === 'dark' }">
        <div
            v-for="item in displayItems"
            :key="item.key"
            class="side-action-btn"
            :class="{ active: item.key === activeKey }"
            role="button"
            tabindex="0"
            @click="handleClick(item)"
            @keydown.enter.prevent="handleClick(item)"
            @keydown.space.prevent="handleClick(item)"
        >
            <CustomizedIcon
                :name="item.icon"
                :remote="item.remote !== false"
                :size="item.iconSize || 'xs'"
                :theme="theme"
                :show-hover-bg="false"
                class="side-action-icon"
            />
            <span class="side-action-text">{{ item.label }}</span>
        </div>
    </div>
</template>

<style scoped>
.side-actions {
    display: flex;
    flex-direction: column;
    gap: var(--td-size-1);
    padding: 0 4px;
    box-sizing: border-box;
}

.side-action-btn {
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0 var(--td-size-4);
    border-radius: var(--td-radius-default, 4px);
    cursor: pointer;
    box-sizing: border-box;
    color: var(--td-text-color-primary);
    transition: background-color 0.2s ease, color 0.2s ease;
    user-select: none;
}

.side-action-btn:hover {
    background-color: var(--td-bg-color-container-hover, rgba(0, 0, 0, 0.03));
}

.side-action-btn.active {
    background-color: var(--td-bg-color-container-active, rgba(0, 0, 0, 0.06));
}

.side-action-btn:focus-visible {
    outline: 2px solid var(--td-brand-color, #0052d9);
    outline-offset: 1px;
}

.side-action-icon {
    flex-shrink: 0;
}

.side-action-text {
    margin-left: var(--td-size-4);
    font-size: 13px;
    font-weight: 500;
    line-height: 1;
    color: inherit;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* 暗色主题下，激活态用更亮的背景 */
.side-actions.is-dark .side-action-btn:hover {
    background-color: var(--td-bg-color-container-hover, rgba(255, 255, 255, 0.08));
}

.side-actions.is-dark .side-action-btn.active {
    background-color: var(--td-bg-color-container-active, rgba(255, 255, 255, 0.12));
}
</style>
