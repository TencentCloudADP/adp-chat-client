<script setup lang="ts">
import Logo from '@/assets/img/logo.svg';
// import Logo from '@/assets/img/logo.png';
import SidebarToggle from '@/components/SidebarToggle.vue';

const getLogo = () => {
    return Logo;
};

// 使用 Vite define 注入的版本号（构建时替换为实际值）
const version = __APP_VERSION__;

</script>

<template>
    <div class="header-logo-container">
        <div class="header-logo-left">
            <img :src="getLogo()" alt="Logo" class="header-logo" />
            <div class="header-title-container">
                <span class="header-title">{{ $t('project.projectName') }}</span>
                <span class="header-version">v{{ version }}</span>
            </div>
        </div>
        <SidebarToggle class="header-toggle" />
    </div>
</template>

<style scoped>
.header-logo-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 var(--td-comp-paddingLR-s);
    padding-right: 0 !important;
}

.header-logo-left {
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.header-logo {
    height: var(--td-size-12);
}

.header-title-container {
    display: flex;
    flex-direction: column;
    margin-left: var(--td-comp-margin-s);
}

.header-title {
    font-size: var(--td-font-size-title-medium);
    font-weight: 400;
    margin: 0;
    line-height: 1.2;
}

.header-version {
    font-size: var(--td-font-size-body-small);
    color: var(--td-text-color-placeholder);
    margin-top: 2px;
    line-height: 1;
}

.header-toggle {
    flex-shrink: 0;
}
</style>
