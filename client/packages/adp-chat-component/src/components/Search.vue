<script setup lang="ts">
import { ref } from 'vue';
import CustomizedIcon from './CustomizedIcon.vue';
import { Input as TInput } from 'tdesign-vue-next';

interface Props {
    /** 占位符文本 */
    placeholder?: string;
}

withDefaults(defineProps<Props>(), {
    placeholder: '搜索'
})

const emit = defineEmits<{
    (e: 'search', value: string): void;
    (e: 'focus'): void;
    (e: 'blur'): void;
}>();

const isSearchFocus = ref(false);
const searchData = ref('');

const changeSearchFocus = (value: boolean) => {
    if (!value) {
        searchData.value = '';
        emit('blur');
    } else {
        emit('focus');
    }
    isSearchFocus.value = value;
};

const handleInput = (value: string) => {
    searchData.value = value;
    emit('search', value);
};
</script>

<template>
    <t-input 
        :placeholder="placeholder" 
        :value="searchData"
        @blur="changeSearchFocus(false)" 
        @focus="changeSearchFocus(true)"
        @change="handleInput"
        borderless
    >
        <template #prefix-icon>
            <CustomizedIcon name="search"/> 
        </template>
    </t-input>
</template>

<style scoped></style>
