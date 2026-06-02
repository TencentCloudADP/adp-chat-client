<!-- 文件列表组件，嵌入输入框内 -->
<template>
    <div v-if="fileList.length > 0" class="file-inline-container">
        <DocFileCard
            v-for="(file, index) in fileList"
            :key="file.uid || index"
            :file="file"
            :theme="theme"
            :mode="mode"
            @delete="handleDelete(index)"
        />
    </div>
</template>

<script setup lang="ts">
import DocFileCard from './DocFileCard.vue';
import type { FileProps } from '../../model/file';
import type { ThemeProps, ChatMode } from '../../model/type';
import { themePropsDefaults } from '../../model/type';

interface Props extends ThemeProps {
    fileList: FileProps[];
    mode?: ChatMode;
}

withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    fileList: () => [],
    mode: 'claw',
});

const emit = defineEmits<{
    (e: 'delete', index: number): void;
}>();

const handleDelete = (index: number) => {
    emit('delete', index);
};
</script>

<style scoped>
.file-inline-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 8px 12px;
    align-items: flex-end;
}
</style>
