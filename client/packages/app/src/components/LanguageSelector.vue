<script setup lang="ts">
import { languageMap } from '@/i18n';
import { useUiStore } from '@/stores/ui';
const uiStore = useUiStore();

</script>

<template>
    <t-dropdown :min-column-width="130" placement="bottom">
        <template #dropdown>
            <t-dropdown-menu>
                <t-dropdown-item v-for="(value, key) in languageMap" :key="key" @click="uiStore.setLanguage(key)">
                    <div class="operations-dropdown-container-item">
                        {{ value }}
                    </div>
                </t-dropdown-item>
            </t-dropdown-menu>
        </template>
        <t-button theme="default" variant="text">
            <div>{{ languageMap[uiStore.language] }}</div>
            <template #suffix><t-icon name="chevron-down" /></template>
        </t-button>
    </t-dropdown>
</template>

<style scoped>
.operations-dropdown-container-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

:deep(.t-icon) {
    font-size: var(--td-font-size-title-large);
    margin-right: var(--td-comp-margin-xs);
}
</style>
