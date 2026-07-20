<template>
    <div class="divider-tabs">
        <template v-for="(opt, idx) in options" :key="opt.value">
            <span
                :class="['divider-tabs__item', { 'is-active': modelValue === opt.value }]"
                @click="onSelect(opt.value)"
            >{{ opt.label }}</span>
            <span v-if="idx < options.length - 1" class="divider-tabs__divider">|</span>
        </template>
    </div>
</template>

<script setup lang="ts">
export interface DividerTabOption {
    label: string;
    value: string;
}

interface Props {
    modelValue: string;
    options: DividerTabOption[];
}

const props = withDefaults(defineProps<Props>(), { modelValue: '', options: () => [] });

const emit = defineEmits<{
    (e: 'update:modelValue', v: string): void;
}>();

function onSelect(value: string) {
    emit('update:modelValue', value);
}
</script>

<style scoped>
.divider-tabs {
    display: flex;
    align-items: center;
    gap: var(--td-size-5);
    flex-shrink: 0;
    font-size: var(--td-font-size-body-medium);
}
.divider-tabs__item {
    cursor: pointer;
    color: var(--td-text-color-secondary);
    transition: color 0.15s;
    user-select: none;
}
.divider-tabs__item:hover {
    color: var(--td-text-color-primary);
}
.divider-tabs__item.is-active {
    color: var(--td-brand-color);
    font-weight: 500;
}
.divider-tabs__divider {
    color: var(--td-component-border);
    user-select: none;
}
</style>
