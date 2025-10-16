/**
 * 自定义图标组件
 * 
 * 用于显示SVG图标，支持不同尺寸和主题模式
 * 可以根据需要显示悬停背景效果
 */
<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
const uiStore = useUiStore();

/**
 * 组件属性接口
 */
interface Props {
    /** SVG图标的路径或URL */
    svg: string;
    /** 图标尺寸，可选值：'l' | 'xl' */
    size?: string;
    /** 是否显示悬停背景效果 */
    showHoverBackground?: boolean;
    /** 是否使用原生图标样式（不应用主题滤镜） */
    nativeIcon?: boolean;
}

defineProps<Props>();

</script>

<template>
    <img :src="svg" class="customeized-icon" :class="{'normal':!nativeIcon,'hoverShadow': showHoverBackground,'svg-dark-mode': uiStore.theme === 'dark',[`size-${size}`]:size }" />
</template>

<style scoped>
.svg-dark-mode.normal {
    filter: brightness(0) invert(1);
}
.customeized-icon.size-l{
    width: var(--td-size-7);
    height: var(--td-size-7);
}
.customeized-icon.size-xl{
    width: var(--td-size-9);
    height: var(--td-size-9);
}
.customeized-icon-container{
    width: 100%;
    height: 100%;
}
.customeized-icon{
    cursor: pointer;
    padding: var(--td-pop-padding-s);
}
.hoverShadow:hover{
     /* TODO: 支持配置hover背景色 */
    /* background-color: var(--td-bg-color-container-active);
    border-radius: var(--td-radius-default); */
}
</style>
