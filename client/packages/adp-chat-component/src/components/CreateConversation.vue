<script setup lang="ts">
import CustomizedIcon from './CustomizedIcon.vue';
import type { ThemeProps } from '../model/type';
import { themePropsDefaults } from '../model/type';
import { Tooltip as TTooltip, Button as TButton } from 'tdesign-vue-next';

interface Props extends ThemeProps {
    /** 提示文本 */
    tooltipText?: string;
}

withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    tooltipText: '新建对话'
});

const emit = defineEmits<{
    (e: 'create'): void;
}>();

const createConversation = () => {
    emit('create');
};
</script>

<template>
    <t-tooltip :content="tooltipText">
        <t-button shape="square" variant="text" @click="createConversation">
            <CustomizedIcon name="new_conversation" :theme="theme"/>
        </t-button>
    </t-tooltip>
</template>

<style scoped></style>
