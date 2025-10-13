<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
const uiStore = useUiStore();

interface Props {
    svg: string;
    size?: string;
    showHoverbackground?:boolean
}

defineProps<Props>();

</script>

<template>
    <img :src="svg" class="customeized-icon" :class="{ 'hoverShadow': showHoverbackground,'svg-dark-mode': uiStore.theme === 'dark', [size]: size }" />
</template>

<style scoped>
.svg-dark-mode {
    filter: brightness(0) invert(1);
}
.customeized-icon.l{
    width: var(--td-size-7);
    height: var(--td-size-7);
}
.customeized-icon.xl{
    width: var(--td-size-9);
    height: var(--td-size-9);
}
.customeized-icon{
    cursor: pointer;
}
.customeized-icon.hoverShadow:hover{
    background-color: var(--td-bg-color-container-active);
    border-radius: 2px;
}
</style>
