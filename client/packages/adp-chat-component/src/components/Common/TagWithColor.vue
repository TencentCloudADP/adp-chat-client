<template>
    <span class="tag-with-color" :class="[`tag-with-color--${color}`]">
        <slot name="icon">
            <CustomizedIcon v-if="icon" remote :name="icon" size="xs" :show-hover-bg="false" :theme="theme" />
        </slot>
        <slot />
    </span>
</template>

<script setup lang="ts">
import CustomizedIcon from '../CustomizedIcon.vue';
import type { ThemeType } from '../../model/type';

interface Props {
    /** 颜色主题：purple / green / orange / blue / gray */
    color: 'purple' | 'green' | 'orange' | 'blue' | 'gray';
    /** 图标名称（remote） */
    icon?: string;
    /** 主题模式 */
    theme?: ThemeType;
}

withDefaults(defineProps<Props>(), {
    icon: '',
    theme: 'light',
});
</script>

<style scoped>
.tag-with-color {
    display: inline-flex;
    align-items: center;
    gap: var(--td-size-1);
    height: var(--td-size-7);
    padding: 0 var(--td-size-3);
    border-radius: var(--td-radius-default);
    font-size: var(--td-font-size-body-small);
    line-height: 1;
    white-space: nowrap;
    border: 1px solid transparent;
}
/* 紫色 - 官方收费（无 TDesign 变量，保留硬编码） */
.tag-with-color--purple {
    color: #6649D9;
    background: #F1ECFF;
    border-color: #DCD0FF;
}
/* 绿色 - 安全 */
.tag-with-color--green {
    color: var(--td-success-color);
    background: var(--td-success-color-light);
    border-color: var(--td-success-color-2);
}
/* 橙色 - 疑似风险 / 公测 */
.tag-with-color--orange {
    color: var(--td-warning-color);
    background: var(--td-warning-color-light);
    border-color: var(--td-warning-color-2);
}
/* 蓝色 - 企业共享 */
.tag-with-color--blue {
    color: var(--td-brand-color);
    background: var(--td-brand-color-light);
    border-color: var(--td-brand-color-2);
}
/* 灰色 - 通用标签（类型/分类等） */
.tag-with-color--gray {
    color: var(--td-text-color-secondary);
    background: var(--td-bg-color-secondarycontainer);
    border-color: transparent;
}
</style>
