<script setup lang="ts">
import Logo from '@/assets/img/logo.svg';
// import Logo from '@/assets/img/logo.png';
import SidebarToggle from '@/components/SidebarToggle.vue';

const getLogo = () => {
    return Logo;
};

</script>

<template>
    <div class="header-logo-container">
        <div class="header-logo-left">
            <img :src="getLogo()" alt="Logo" class="header-logo" />
            <span class="header-title">{{ $t('project.projectName') }}</span>
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
    height: var(--td-size-9);
}

.header-title {
    font-size: var(--td-font-size-title-large);
    font-weight: 400;
    margin: 0;
    margin-left: var(--td-comp-margin-s);
}

.header-toggle {
    flex-shrink: 0;
}
</style>
