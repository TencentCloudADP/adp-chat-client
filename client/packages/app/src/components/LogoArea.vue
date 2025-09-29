<script setup lang="ts">
import Logo from '@/assets/img/TencentCloudADPChatClient.svg';

defineProps<{
    title: string
}>()

const getLogo = () => {
    return Logo;
};

</script>

<template>
    <div class="header-logo-container">
        <img :src="getLogo()" alt="Logo" class="header-logo" />
        <!-- <t-divider layout="vertical">
            <span class="header-title">{{ title }}</span>
        </t-divider> -->
        <!-- <span class="header-title">{{ title }}</span> -->
    </div>
</template>

<style scoped>
.header-logo-container {
    display: flex;
    align-items: center;
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
