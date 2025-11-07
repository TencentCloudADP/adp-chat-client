/**
 * 自定义图标组件
 * 
 * 用于显示SVG图标，支持不同尺寸和主题模式
 * 可以根据需要显示悬停背景效果
 */
<script setup lang="ts">
import { computed } from 'vue';
import { useUiStore } from '@/stores/ui';
const uiStore = useUiStore();

/**
 * 组件属性接口
 */
interface Props {
    name: string;/** SVG图标的名称 */
    /** 图标尺寸，可选值：'l' | 'xl' */
    size?: string;
    /** 是否使用原生图标样式（不应用主题滤镜） */
    nativeIcon?: boolean;
    /** hover是否显示背景色 */
    showHoverBg?:boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'm',
  nativeIcon: false,
  showHoverBg: true
})

const symbolId = computed(() => `#icon-${props.name}`)

</script>

<template>
    <svg class="customeized-icon " :class="{'showHoverBg':showHoverBg,'normal':!nativeIcon,'svg-dark-mode': uiStore.theme === 'dark',[`size-${size}`]:size }" aria-hidden="true">
        <use :href="symbolId" :xlink="symbolId" />
    </svg>
</template>

<style scoped>
.svg-dark-mode.normal use{
    filter: brightness(0) invert(1);
}
.customeized-icon.size-xs{   
    width: var(--td-comp-size-xxxs);
    height: var(--td-comp-size-xxxs);
}
.customeized-icon.size-s{   
    width: var(--td-comp-size-xs);
    height: var(--td-comp-size-xs);
    padding: var(--td-comp-paddingLR-xxs);
}
.customeized-icon.size-m{
    width: var(--td-comp-size-m);
    height: var(--td-comp-size-m);
    padding: var(--td-pop-padding-m);
}
.customeized-icon.size-l{
     width: var(--td-comp-size-l);
    height: var(--td-comp-size-l);
    padding: var(--td-pop-padding-l);
}
.customeized-icon{
    border-radius: var(--td-radius-default);
    cursor: pointer;
}
.customeized-icon.normal.showHoverBg:hover{
    background-color: var(--td-bg-color-container-active);
}
</style>
