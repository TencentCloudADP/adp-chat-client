<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
const uiStore = useUiStore();

interface Props {
    svg: string;
    size?: string;
    showHoverBackground?:boolean;
    nativeIcon?:boolean;
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
