/**
 * 自定义图标组件
 * 
 * 用于显示SVG雪碧图图标，支持不同尺寸和主题模式
 * 使用 vite-plugin-svg-icons 插件实现雪碧图功能
 * 
 * @example
 * <!-- 基础用法 -->
 * <CustomizedIcon name="search" />
 * 
 * <!-- 指定尺寸 -->
 * <CustomizedIcon name="grid" size="xs" />
 * 
 * <!-- 原生图标（不应用暗色模式滤镜） -->
 * <CustomizedIcon name="send_fill" nativeIcon />
 * 
 * <!-- 禁用 hover 背景 -->
 * <CustomizedIcon name="arrow_up_small" :showHoverBg="false" />
 * 
 * <!-- 暗色主题 -->
 * <CustomizedIcon name="copy" theme="dark" />
 */
<script setup lang="ts">
import { computed } from 'vue';

/**
 * 组件属性接口
 */
interface Props {
    /** SVG图标的名称，对应 src/assets/icons 目录下的文件名（不含扩展名） */
    name: string;
    /** 图标尺寸，可选值：'xs' | 's' | 'm' | 'l' | 'xl' */
    size?: 'xs' | 's' | 'm' | 'l' | 'xl';
    /** 是否使用原生图标样式（不应用主题滤镜），适用于彩色图标 */
    nativeIcon?: boolean;
    /** hover是否显示背景色 */
    showHoverBg?: boolean;
    /** 主题模式，用于控制暗色模式下的图标显示 */
    theme?: 'light' | 'dark';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'm',
  nativeIcon: false,
  showHoverBg: true,
  theme: 'light'
})

/**
 * 计算 SVG symbol 的引用 ID
 * 格式与 vite.config.ts 中的 symbolId 配置对应：'icon-[name]'
 */
const symbolId = computed(() => `#icon-${props.name}`)

</script>

<template>
    <svg 
        class="customeized-icon" 
        :class="{
            'showHoverBg': showHoverBg,
            'normal': !nativeIcon,
            'svg-dark-mode': theme === 'dark',
            [`size-${size}`]: size 
        }" 
        aria-hidden="true"
    >
        <use :href="symbolId" :xlink:href="symbolId" />
    </svg>
</template>

<style scoped>
/* 暗色模式滤镜 - 仅对非原生图标生效 */
.svg-dark-mode.normal use {
    filter: brightness(0) invert(1);
}

/* 尺寸样式 - xs: 超小 */
.customeized-icon.size-xs {   
    width: var(--td-comp-size-xxxs, 16px);
    height: var(--td-comp-size-xxxs, 16px);
}

/* 尺寸样式 - s: 小 */
.customeized-icon.size-s {   
    width: var(--td-comp-size-xs, 20px);
    height: var(--td-comp-size-xs, 20px);
    padding: var(--td-comp-paddingLR-xxs, 2px);
}

/* 尺寸样式 - m: 中（默认） */
.customeized-icon.size-m {
    width: var(--td-comp-size-m, 32px);
    height: var(--td-comp-size-m, 32px);
    padding: var(--td-pop-padding-m, 4px);
}

/* 尺寸样式 - l: 大 */
.customeized-icon.size-l {
    width: var(--td-comp-size-l, 40px);
    height: var(--td-comp-size-l, 40px);
    padding: var(--td-pop-padding-l, 8px);
}

/* 尺寸样式 - xl: 超大 */
.customeized-icon.size-xl {
    width: var(--td-comp-size-xl, 48px);
    height: var(--td-comp-size-xl, 48px);
    padding: var(--td-pop-padding-xl, 12px);
}

/* 基础样式 */
.customeized-icon {
    border-radius: var(--td-radius-default, 4px);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    transition: background-color 0.2s ease;
}

/* hover 背景效果 - 仅对非原生图标生效 */
.customeized-icon.normal.showHoverBg:hover {
    background-color: var(--td-bg-color-container-active, rgba(0, 0, 0, 0.05));
}

/* 暗色模式下的 hover 背景 */
.customeized-icon.svg-dark-mode.normal.showHoverBg:hover {
    background-color: var(--td-bg-color-container-active, rgba(255, 255, 255, 0.1));
}
</style>
