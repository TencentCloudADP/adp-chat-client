<script setup lang="ts">

const toggleSettingPanel = () => {
    // Implement logic to toggle the settings panel
    console.log('Toggling settings panel...');
};

</script>

<template>
    <t-tooltip placement="bottom" :content="$t('header.systemSettings')">
        <t-button theme="default" shape="square" variant="text" @click="toggleSettingPanel">
            <t-icon name="setting" />
        </t-button>
    </t-tooltip>
</template>

<style scoped></style>
