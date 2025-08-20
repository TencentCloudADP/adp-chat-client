<script setup lang="ts">
const props = defineProps<{
    url: string;
}>();

const navToHelper = () => {
    window.open(props.url);
};

</script>

<template>
    <t-tooltip placement="bottom" :content="$t('帮助文档')">
        <t-button theme="default" shape="square" variant="text" @click="navToHelper">
            <t-icon name="help-circle" />
        </t-button>
    </t-tooltip>
</template>

<style scoped></style>
