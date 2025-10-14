<script setup lang="ts">
import { ref } from 'vue';
import { SearchIcon } from 'tdesign-icons-vue-next';

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
            <search-icon class="icon" size="16" />
        </template>
    </t-input>
</template>

<style scoped></style>
