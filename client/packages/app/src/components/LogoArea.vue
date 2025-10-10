<script setup lang="ts">
import Logo from '@/assets/img/favicon.ico';

const getLogo = () => {
    return Logo;
};

</script>

<template>
    <div class="header-logo-container">
        <img :src="getLogo()" alt="Logo" class="header-logo" />
        <t-divider layout="vertical">
            <span class="header-title">{{ $t('project.projectName') }}</span>
        </t-divider>
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
}
</style>
