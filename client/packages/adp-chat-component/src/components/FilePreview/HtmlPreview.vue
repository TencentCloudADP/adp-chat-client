<template>
    <div class="html-preview">
        <div v-if="loading" class="preview-loading">
            <div class="loading-spinner"></div>
        </div>

        <div v-if="errorMsg" class="preview-error">
            <div class="preview-error__icon">⚠️</div>
            <p class="preview-error__text">{{ errorMsg }}</p>
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
@import './preview-common.css';

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

/* HtmlPreview 的 loading 使用绝对定位覆盖 iframe */
.preview-loading {
    position: absolute;
    inset: 0;
    background: var(--td-bg-color-container);
    z-index: 1;
}
</style>
