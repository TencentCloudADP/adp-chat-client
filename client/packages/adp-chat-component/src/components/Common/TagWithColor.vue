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
    gap: 2px;
    height: 20px;
    padding: 0 6px;
    border-radius: 3px;
    font-size: 12px;
    line-height: 1;
    white-space: nowrap;
    border: 1px solid transparent;
}
/* 紫色 - 官方收费 */
.tag-with-color--purple {
    color: #6649D9;
    background: #F1ECFF;
    border-color: #DCD0FF;
}
/* 绿色 - 安全 */
.tag-with-color--green {
    color: #00A870;
    background: #E8F8F2;
    border-color: #C5EBD9;
}
/* 橙色 - 疑似风险 / 公测 */
.tag-with-color--orange {
    color: #ED7B2F;
    background: #FFF3E8;
    border-color: #FFD9B7;
}
/* 蓝色 - 企业共享 */
.tag-with-color--blue {
    color: #0052D9;
    background: #F1F6FF;
    border-color: #D9E5FF;
}
/* 灰色 - 通用标签（类型/分类等） */
.tag-with-color--gray {
    color: var(--td-text-color-secondary);
    background: var(--td-bg-color-secondarycontainer);
    border-color: transparent;
}
</style>
