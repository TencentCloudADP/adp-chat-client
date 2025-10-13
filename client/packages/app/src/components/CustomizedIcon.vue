<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
const uiStore = useUiStore();

interface Props {
    svg: string;
    size?: string;
}

defineProps<Props>();

</script>

<template>
    <img :src="svg" class="customeized-icon" :class="{ 'svg-dark-mode': uiStore.theme === 'dark', [size]: size }" />
</template>

<style scoped>
.svg-dark-mode {
    filter: brightness(0) invert(1);
}
.customeized-icon.l{
    width: var(--td-size-7);
    height: var(--td-size-7);
}
</style>
