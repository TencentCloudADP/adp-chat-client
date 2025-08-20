<script setup lang="ts">
const props = defineProps<{
    url: string;
}>();

const navToCodeBase = () => {
    window.open(props.url);
};

</script>

<template>
    <t-tooltip placement="bottom" :content="$t('代码仓库')">
        <t-button theme="default" shape="square" variant="text" @click="navToCodeBase">
            <t-icon name="logo-github" />
        </t-button>
    </t-tooltip>
</template>

<style scoped></style>
