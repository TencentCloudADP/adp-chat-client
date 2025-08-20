<script setup lang="ts">

const props = defineProps<{
    backToBottom: () => void;
}>();

</script>

<template>
    <t-button shape="circle" class="bottomBtn" @click="props.backToBottom">
        <template #icon>
            <t-icon name="arrow-down" />
        </template>
    </t-button>
</template>

<style scoped>
.bottomBtn {
    position: absolute;
    left: 50%;
    bottom: 30%;
}
</style>
