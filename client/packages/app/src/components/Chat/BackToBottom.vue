<script setup lang="ts">
import CustomizedIcon from '@/components/CustomizedIcon.vue';
import ArrowDownMediumIcon from '@/assets/icons/arrow_down_medium.svg';
import backToBottomLoadingIcon from '@/assets/icons/loading.svg';
const props = defineProps<{
    loading?: boolean,
    backToBottom: () => void;
}>();

</script>

<template>
    <div class="bottom-icon" @click="props.backToBottom">
        <div class="bottom-icon-container">
            <CustomizedIcon  v-if="loading" nativeIcon class="loading" :svg="backToBottomLoadingIcon"/>  
            <CustomizedIcon disablePadding size="m" nativeIcon :svg="ArrowDownMediumIcon"/>  
        </div>
    </div>
</template>

<style scoped>
.bottom-icon{
    position: absolute;
    left: 50%;
    top: calc((var(--td-comp-size-xs) + var(--td-comp-size-l) ) * -1);
    cursor: pointer;

    background: #FFFFFF;
    box-shadow: 0px 0px 1px rgba(18, 19, 25, 0.08), 0px 0px 8px rgba(18, 19, 25, 0.08), 0px 16px 32px rgba(18, 19, 25, 0.16);
    border-radius: 9999px;
}
.bottom-icon-container{
    width:  var(--td-comp-size-l);
    height:var(--td-comp-size-l);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}
.bottom-icon-container .loading{
    width: var(--td-comp-size-l);
    height: var(--td-comp-size-l);
    position: absolute;
    top: 0;
    left: 0;
    z-index:2;
    animation: rotate 2s linear infinite;
    padding: 0px;
}
</style>
