<script setup lang="ts">
import LogoArea from '@/components/LogoArea.vue';
import CodeBase from '@/components/CodeBase.vue';
import DocumentHelper from '@/components/DocumentHelper.vue';
import PersonalAccount from '@/components/PersonalAccount.vue';
import ThemeSwitcher from '@/components/ThemeSwitcher.vue';
import LanguageSelector from '@/components/LanguageSelector.vue';
import Settings from '@/components/Settings.vue';
</script>

<template>
    <div class="header-content">
        <LogoArea :title="$t('project.projectName')" />
        <div class="header-actions">
            <CodeBase url="https://github.com/Tencent/tdesign-vue-next" />
            <DocumentHelper url="https://tdesign.tencent.com/vue-next/docs/vue/quick-start" />
            <PersonalAccount />
            <ThemeSwitcher />
            <LanguageSelector />
            <Settings />
        </div>
    </div>
</template>

<style scoped>
.header-content {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 var(--td-comp-paddingLR-xl);
}

.header-actions {
    margin-left: auto;
    display: flex;
    gap: var(--td-comp-paddingLR-m);
}

:deep(.t-icon) {
    font-size: 20px;
}
</style>
