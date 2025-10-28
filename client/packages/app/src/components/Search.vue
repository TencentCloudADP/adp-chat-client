<script setup lang="ts">
import { ref } from 'vue';
import CustomizedIcon from '@/components/CustomizedIcon.vue';
import SearchIcon from '@/assets/icons/search.svg';

const isSearchFocus = ref(false);
const searchData = ref('');
const changeSearchFocus = (value: boolean) => {
    if (!value) {
        searchData.value = '';
    }
    isSearchFocus.value = value;
};
</script>

<template>
    <t-input :placeholder="$t('operation.search')" @blur="changeSearchFocus(false)" @focus="changeSearchFocus(true)"
        borderless>
        <template #prefix-icon>
            <CustomizedIcon :svg="SearchIcon"/> 
        </template>
    </t-input>
</template>

<style scoped></style>
