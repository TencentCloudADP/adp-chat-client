<script setup lang="ts">
import CustomizedIcon from './CustomizedIcon.vue';
import type { ThemeProps } from '../model/type';
import { themePropsDefaults } from '../model/type';

withDefaults(defineProps<ThemeProps>(), {
    ...themePropsDefaults
});

const emit = defineEmits<{
    (e: 'toggle'): void;
}>();

const handleClick = () => {
    emit('toggle');
};
</script>

<template>
    <CustomizedIcon remote class="sidebar-icon" name="basic_sidebarchat_line" :theme="theme" @click="handleClick"/>
</template>

<style scoped>
</style>
