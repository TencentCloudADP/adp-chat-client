<script setup lang="ts">


</script>

<template>
    <div class="ai-warning">
        {{ $t('common.aiWarning') }}
    </div>
</template>

<style scoped>
.ai-warning {
    text-align: center;
    color: var(--td-text-color-placeholder);
    font-size: var(--td-font-size-body-small);
    margin-top: var(--td-comp-margin-s);
    padding: var(--td-comp-paddingTB-xs) var(--td-comp-paddingLR-s);
}
</style>
