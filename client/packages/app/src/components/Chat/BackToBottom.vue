<script setup lang="ts">
import { ArrowDownIcon } from 'tdesign-icons-vue-next';

const props = defineProps<{
    backToBottom: () => void;
}>();

</script>

<template>
    <t-button shape="circle" class="bottomBtn" @click="props.backToBottom">
        <template #icon>
            <arrow-down-icon />
        </template>
    </t-button>
</template>

<style scoped>
.bottomBtn {
    position: absolute;
    left: 50%;
    bottom: 15%;
}
</style>
