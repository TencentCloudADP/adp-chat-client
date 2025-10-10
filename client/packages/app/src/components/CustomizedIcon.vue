<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
const uiStore = useUiStore();

interface Props {
    svg: string;
}

defineProps<Props>();

</script>

<template>
    <img :src="svg" :class="{ 'svg-dark-mode': uiStore.theme === 'dark' }" />
</template>

<style scoped>
.svg-dark-mode {
    filter: brightness(0) invert(1);
}
</style>
