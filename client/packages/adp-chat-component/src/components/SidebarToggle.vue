<script setup lang="ts">
import CustomizedIcon from './CustomizedIcon.vue';

const emit = defineEmits<{
    (e: 'toggle'): void;
}>();

const handleClick = () => {
    emit('toggle');
};
</script>

<template>
    <CustomizedIcon class="sidebar-icon" name="sidebar" @click="handleClick"/>
</template>

<style scoped>
.sidebar-icon{
    margin-right: var(--td-comp-margin-l);
}
</style>
