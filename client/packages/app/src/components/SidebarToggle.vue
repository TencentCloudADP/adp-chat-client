<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import CustomizedIcon from '@/components/CustomizedIcon.vue';

const uiStore = useUiStore();

const handleClick = () => {
    uiStore.toggleDrawer();
};

</script>

<template>
    <CustomizedIcon class="sidebar-icon" name="sidebar"  @click="handleClick"/>
</template>

<style scoped>
.sidebar-icon{
    /* margin-right: var(--td-comp-margin-xs); */
    margin-right: 0;
}
</style>
