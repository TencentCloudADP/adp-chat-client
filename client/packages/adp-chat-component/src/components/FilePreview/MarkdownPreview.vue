<template>
    <div class="markdown-preview">
        <!-- 加载状态 -->
        <div v-if="loading" class="markdown-preview-loading">
            <div class="loading-spinner"></div>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="errorMsg" class="markdown-preview-error">
            <div class="error-icon">⚠️</div>
            <p class="error-text">{{ errorMsg }}</p>
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
.markdown-preview {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background: var(--td-bg-color-container, #fff);
}

.markdown-preview-scroll {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 16px 20px;
    box-sizing: border-box;
}

/* 加载状态 */
.markdown-preview-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e8e8e8;
    border-top-color: #0052d9;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* 错误状态 */
.markdown-preview-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    gap: 8px;
}

.error-icon {
    font-size: 36px;
}

.error-text {
    font-size: 13px;
    color: #e34d59;
    margin: 0;
}
</style>
