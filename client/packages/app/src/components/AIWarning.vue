<script setup lang="ts">


</script>

<template>
    <div class="ai-warning">
        {{ $t('common.aiWarning') }},
        {{ $t('common.comply') }} 
        <t-link theme="primary"> {{ $t('common.Service') }} </t-link>  
        {{ $t('common.and') }} 
        <t-link theme="primary"> {{ $t('common.Privacy') }} </t-link> 
    </div>
</template>

<style scoped>
.ai-warning {
    text-align: center;
    color: var(--td-text-color-placeholder);
    font-size: var(--td-font-size-body-small);
}
</style>
