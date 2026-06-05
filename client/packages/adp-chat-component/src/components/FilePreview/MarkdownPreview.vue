<template>
    <div class="markdown-preview">
        <!-- 加载状态 -->
        <div v-if="loading" class="preview-loading">
            <div class="loading-spinner"></div>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="errorMsg" class="preview-error">
            <div class="preview-error__icon">⚠️</div>
            <p class="preview-error__text">{{ errorMsg }}</p>
        </div>

        <!-- Markdown 内容渲染 -->
        <div v-else class="markdown-preview-scroll">
            <MdContent
                :content="content"
                role="assistant"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import MdContent from '../Common/MdContent.vue';

interface Props {
    /** Markdown 文件的访问 URL */
    url: string;
    /** 文件名，用于错误提示 */
    fileName?: string;
    /** 加载失败提示文本 */
    errorText?: string;
}

const props = withDefaults(defineProps<Props>(), {
    fileName: '',
    errorText: 'Markdown 加载失败',
});

const emit = defineEmits<{
    (e: 'error', error: Error): void;
}>();

const loading = ref(false);
const errorMsg = ref('');
const content = ref('');

/**
 * fetch Markdown 文件内容
 */
async function loadMarkdown(url: string) {
    loading.value = true;
    errorMsg.value = '';
    content.value = '';

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        content.value = await response.text();
    } catch (e) {
        const err = e as Error;
        errorMsg.value = props.errorText;
        emit('error', err);
    } finally {
        loading.value = false;
    }
}

watch(
    () => props.url,
    (newUrl) => {
        errorMsg.value = '';
        content.value = '';
        if (newUrl) {
            loadMarkdown(newUrl);
        }
    },
    { immediate: true }
);
</script>

<style scoped>
@import './preview-common.css';

.markdown-preview {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background: var(--td-bg-color-container);
}

.markdown-preview-scroll {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: var(--td-comp-paddingLR-l) var(--td-comp-paddingLR-xl);
    box-sizing: border-box;
}
</style>
