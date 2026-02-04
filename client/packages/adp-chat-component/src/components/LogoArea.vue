<script setup lang="ts">
interface Props {
    /** Logo图片URL */
    logoUrl?: string;
    /** 标题文本 */
    title?: string;
}

withDefaults(defineProps<Props>(), {
    logoUrl: '',
    title: ''
})
</script>

<template>
    <div class="header-logo-container">
        <img v-if="logoUrl" :src="logoUrl" alt="Logo" class="header-logo" />
        <span v-if="title" class="header-title">{{ title }}</span>
    </div>
</template>

<style scoped>
.header-logo-container {
    display: flex;
    align-items: center;
    padding: 0 var(--td-comp-paddingLR-s);
}

.header-logo {
    height: var(--td-size-9);
}

.header-title {
    font-size: var(--td-font-size-title-large);
    font-weight: 400;
    margin: 0;
    margin-left: var(--td-comp-margin-s);
}
</style>
