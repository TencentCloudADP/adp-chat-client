<script setup lang="ts">
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
import CustomizedIcon from '../CustomizedIcon.vue';

interface Props extends ThemeProps {
    loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    ...themePropsDefaults,
});

const emit = defineEmits<{
    (e: 'click'): void;
}>();

const handleClick = () => {
    emit('click');
};
</script>

<template>
    <div class="bottom-icon" @click="handleClick">
        <div class="bottom-icon-container">
            <CustomizedIcon v-if="loading" nativeIcon class="loading" name="loading" :theme="theme" />
            <CustomizedIcon size="m" nativeIcon name="arrow_down_medium" :theme="theme" />
        </div>
    </div>
</template>

<style scoped>
.bottom-icon {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: calc((var(--td-comp-size-xs) + var(--td-comp-size-l)) * -1);
    cursor: pointer;
    background: var(--td-bg-color-container);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.06);
    border: 1px solid var(--td-component-stroke);
    border-radius: 9999px;
    transition: box-shadow 0.15s ease, transform 0.1s ease;
}

.bottom-icon:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12), 0 0 1px rgba(0, 0, 0, 0.06);
}

.bottom-icon:active {
    transform: translateX(-50%) scale(0.94);
}

.bottom-icon-container {
    width: var(--td-comp-size-l);
    height: var(--td-comp-size-l);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.bottom-icon-container .loading {
    width: var(--td-comp-size-l);
    height: var(--td-comp-size-l);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    animation: rotate 2s linear infinite;
    padding: 0;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

@media (prefers-reduced-motion: reduce) {
    .bottom-icon {
        transition: none;
    }
    .bottom-icon-container .loading {
        animation: none;
    }
}
</style>
