<template>
    <div class="image-preview">
        <div v-if="loading" class="preview-loading">
            <div class="loading-spinner"></div>
        </div>

        <div v-else-if="errorMsg" class="preview-error">
            <div class="preview-error__icon">⚠️</div>
            <p class="preview-error__text">{{ errorMsg }}</p>
        </div>

        <!-- SVG：通过 Blob URL + img 标签渲染，天然禁止内嵌脚本执行 -->
        <!-- 普通图片：直接用 img 标签渲染 -->
        <div v-else-if="displayUrl" class="image-preview-content">
            <img
                :src="displayUrl"
                :alt="fileName"
                class="image-preview-img"
                @error="onImgError"
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, computed } from 'vue';

/** SVG 扩展名集合，需要走 Blob URL 渲染 */
const SVG_EXT = new Set(['svg']);

interface Props {
    /** 图片的访问 URL */
    url: string;
    /** 文件名（含扩展名），用于判断是否为 SVG */
    fileName?: string;
    /** 加载失败提示文本 */
    errorText?: string;
}

const props = withDefaults(defineProps<Props>(), {
    fileName: '',
    errorText: '图片加载失败',
});

const emit = defineEmits<{
    (e: 'error', error: Error): void;
}>();

const loading = ref(false);
const errorMsg = ref('');
const blobUrl = ref('');

/** 当前文件扩展名 */
const ext = computed(() => props.fileName.split('.').pop()?.toLowerCase() || '');

/** 是否为 SVG（需要走 Blob URL 渲染） */
const isSvg = computed(() => SVG_EXT.has(ext.value));

/** 最终展示的图片 URL：SVG 用 blobUrl，普通图片直接用 url */
const displayUrl = computed(() => {
    if (!props.url) return '';
    if (isSvg.value) return blobUrl.value;
    return props.url;
});

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
 * 加载 SVG 内容并转为 Blob URL
 * img 标签加载 SVG Blob 时自动禁止脚本执行和外部资源引用
 */
async function loadSvg(url: string) {
    loading.value = true;
    errorMsg.value = '';
    revokeBlobUrl();

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        const blob = new Blob([text], { type: 'image/svg+xml' });
        blobUrl.value = URL.createObjectURL(blob);
    } catch (e) {
        const err = e as Error;
        errorMsg.value = props.errorText;
        emit('error', err);
    } finally {
        loading.value = false;
    }
}

function onImgError() {
    errorMsg.value = props.errorText;
    emit('error', new Error(props.errorText));
}

watch(
    () => props.url,
    (newUrl) => {
        errorMsg.value = '';
        if (!newUrl) return;
        if (isSvg.value) {
            loadSvg(newUrl);
        }
        // 普通图片直接通过 computed displayUrl 展示，无需额外处理
    },
    { immediate: true }
);

onUnmounted(() => {
    revokeBlobUrl();
});
</script>

<style scoped>
@import './preview-common.css';

.image-preview {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    background: var(--td-bg-color-page);
}

.image-preview-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
}

.image-preview-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
}
</style>
