<template>
    <div class="html-preview">
        <div v-if="loading" class="html-preview-loading">
            <div class="loading-spinner"></div>
        </div>

        <div v-if="errorMsg" class="html-preview-error">
            <div class="error-icon">⚠️</div>
            <p class="error-text">{{ errorMsg }}</p>
        </div>

        <!--
            HTML 沙箱 iframe：
            - sandbox="allow-scripts" 不含 allow-same-origin，
              确保 iframe 无法访问父页面的 cookie、storage 和 DOM
            - 通过 Blob URL 加载，避免直接渲染远程 HTML
        -->
        <iframe
            v-if="blobUrl && !errorMsg"
            :src="blobUrl"
            sandbox="allow-scripts"
            class="html-preview-iframe"
            :title="fileName"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';

interface Props {
    /** HTML 文件的访问 URL */
    url: string;
    /** 文件名，用于 iframe title */
    fileName?: string;
    /** 加载失败提示文本 */
    errorText?: string;
}

const props = withDefaults(defineProps<Props>(), {
    fileName: '',
    errorText: 'HTML 加载失败',
});

const emit = defineEmits<{
    (e: 'error', error: Error): void;
}>();

const loading = ref(false);
const errorMsg = ref('');
const blobUrl = ref('');

/**
 * 释放 Blob URL，防止内存泄漏
 */
function revokeBlobUrl() {
    if (blobUrl.value) {
        URL.revokeObjectURL(blobUrl.value);
        blobUrl.value = '';
    }
}

/**
 * 加载 HTML 内容并转为 Blob URL
 * sandbox="allow-scripts" 不含 allow-same-origin，
 * 确保 iframe 无法访问父页面的 cookie、storage 和 DOM
 */
async function loadHtml(url: string) {
    loading.value = true;
    errorMsg.value = '';
    revokeBlobUrl();

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        const blob = new Blob([text], { type: 'text/html' });
        blobUrl.value = URL.createObjectURL(blob);
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
        if (newUrl) {
            loadHtml(newUrl);
        } else {
            revokeBlobUrl();
        }
    },
    { immediate: true }
);

onUnmounted(() => {
    revokeBlobUrl();
});
</script>

<style scoped>
.html-preview {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.html-preview-iframe {
    width: 100%;
    height: 100%;
    border: none;
    flex: 1;
}

/* 加载状态 */
.html-preview-loading {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    z-index: 1;
}

.loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e8e8e8;
    border-top-color: var(--td-brand-color);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* 错误状态 */
.html-preview-error {
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
    font-size: var(--td-font-size-body-small);
    color: var(--td-error-color);
    margin: 0;
}
</style>
