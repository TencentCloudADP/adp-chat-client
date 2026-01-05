<script setup lang="ts">
import CustomizedIcon from './CustomizedIcon.vue';

interface Props {
    /** 提示文本 */
    tooltipText?: string;
}

withDefaults(defineProps<Props>(), {
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
            <CustomizedIcon name="new_conversation" />
        </t-button>
    </t-tooltip>
</template>

<style scoped></style>
