<template>
    <div class="file-preview-wrapper">
        <!-- 关闭按钮 -->
        <span class="file-preview-close" @click="emit('close')">✕</span>

        <!-- 不支持预览的格式 -->
        <div v-if="!previewType" class="file-preview-unsupported">
            <div class="unsupported-icon">📄</div>
            <p class="unsupported-text">{{ props.unsupportedText }}</p>
        </div>

        <!-- 文档预览（Word / PDF / PPT / Excel 等） -->
        <DocPreview
            v-else-if="previewType === 'doc'"
            ref="docPreviewRef"
            class="file-preview-inner"
            :file-path="filePath"
            :application-id="applicationId"
            :workspace-id="workspaceId"
            :sdk-url="sdkUrl"
            :loading-text="loadingText"
            :loading-preview-text="loadingPreviewText"
            :preview-failed-text="previewFailedText"
            :retry-text="retryText"
            @error="(err) => emit('error', err)"
        />

        <!-- 图片预览（PNG / JPG / GIF / BMP / WEBP / SVG） -->
        <ImagePreview
            v-else-if="previewType === 'image'"
            class="file-preview-inner"
            :url="fileUrl"
            :file-name="fileName"
            :error-text="previewFailedText"
            @error="(err) => emit('error', err)"
        />

        <!-- HTML 沙箱预览 -->
        <HtmlPreview
            v-else-if="previewType === 'html'"
            class="file-preview-inner"
            :url="fileUrl"
            :file-name="fileName"
            :error-text="previewFailedText"
            @error="(err) => emit('error', err)"
        />

        <!-- Markdown 预览 -->
        <MarkdownPreview
            v-else-if="previewType === 'markdown'"
            class="file-preview-inner"
            :url="fileUrl"
            :file-name="fileName"
            :error-text="previewFailedText"
            @error="(err) => emit('error', err)"
        />

        <!-- 代码预览（Monaco Editor） -->
        <CodePreview
            v-else-if="previewType === 'code'"
            class="file-preview-inner"
            :url="fileUrl"
            :file-name="fileName"
            :error-text="previewFailedText"
            @error="(err) => emit('error', err)"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import DocPreview from './DocPreview.vue';
import ImagePreview from './ImagePreview.vue';
import HtmlPreview from './HtmlPreview.vue';
import MarkdownPreview from './MarkdownPreview.vue';
import CodePreview from './CodePreview.vue';

/** 文档类扩展名集合 */
const DOC_EXTENSIONS = new Set([
    'pdf',
    'doc', 'docx',
    'ppt', 'pptx',
    'xls', 'xlsx',
]);

/** 图片类扩展名集合 */
const IMAGE_EXTENSIONS = new Set([
    'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp',
]);

/** 代码类扩展名集合 */
const CODE_EXTENSIONS = new Set([
    'js', 'ts', 'jsx', 'tsx',
    'json', 'yaml', 'yml',
    'py', 'sh', 'bash',
    'css', 'less', 'scss',
    'xml', 'vue', 'php', 'rb',
    'sql', 'java', 'go',
    'rs', 'c', 'cpp', 'h', 'hpp',
    'swift', 'kt', 'dart', 'r',
    'toml', 'ini', 'env',
    'dockerfile', 'makefile', 'gitignore',
    'txt', 'log', 'csv',
]);

/**
 * 根据文件路径获取扩展名（小写）
 */
function getExtension(path: string): string {
    return path.split('.').pop()?.toLowerCase() || '';
}

/**
 * 根据扩展名判断预览类型
 * - 'doc'   → 文档预览（COSDocPreviewSDK）
 * - 'image' → 图片预览（img 标签 / SVG Blob）
 * - 'html'  → HTML 沙箱预览（Blob iframe）
 * - null    → 不支持预览
 */
function resolvePreviewType(path: string): 'doc' | 'image' | 'html' | 'markdown' | 'code' | null {
    if (!path) return null;
    const ext = getExtension(path);
    if (DOC_EXTENSIONS.has(ext)) return 'doc';
    if (IMAGE_EXTENSIONS.has(ext)) return 'image';
    if (ext === 'svg') return 'image';
    if (ext === 'html' || ext === 'htm') return 'html';
    if (ext === 'md' || ext === 'markdown') return 'markdown';
    if (CODE_EXTENSIONS.has(ext)) return 'code';
    return null;
}

interface Props {
    /**
     * 文件路径（如 /workdir/main.py），文档预览时组件内部调用 fetchFile 获取 COS URL；
     * 图片/HTML 预览时请同时传入 fileUrl 作为直接访问地址。
     */
    filePath?: string;
    /**
     * 文件的直接访问 URL，供图片预览和 HTML 预览使用。
     * 文档预览（doc 类型）不需要此字段，内部会自动调用 fetchFile。
     */
    fileUrl?: string;
    /** 文件名（含扩展名），供图片/HTML 预览组件使用 */
    fileName?: string;
    /** 应用 ID */
    applicationId?: string;
    /** 工作空间 ID */
    workspaceId?: string;
    /** SDK JS 文件的 URL 路径（文档预览使用） */
    sdkUrl?: string;
    /** 加载中文本 */
    loadingText?: string;
    /** 加载文档预览中文本 */
    loadingPreviewText?: string;
    /** 预览加载失败文本 */
    previewFailedText?: string;
    /** 重试按钮文本 */
    retryText?: string;
    /** 不支持预览时的提示文本 */
    unsupportedText?: string;
}

const props = withDefaults(defineProps<Props>(), {
    filePath: '',
    fileUrl: '',
    fileName: '',
    applicationId: '',
    workspaceId: '',
    sdkUrl: 'src/assets/sdk-v0.2.1.js',
    loadingText: '正在加载...',
    loadingPreviewText: '正在加载文档预览...',
    previewFailedText: '预览加载失败',
    retryText: '重试',
    unsupportedText: '暂不支持预览该文件格式',
});

const emit = defineEmits<{
    /** 预览加载出错 */
    (e: 'error', error: Error): void;
    /** 关闭预览 */
    (e: 'close'): void;
}>();

/** 当前文件对应的预览类型 */
const previewType = computed(() => resolvePreviewType(props.filePath || props.fileName || props.fileUrl));

/** DocPreview 子组件引用，用于透传 expose 方法 */
const docPreviewRef = ref<InstanceType<typeof DocPreview> | null>(null);

// ========== 公开方法（透传给外部） ==========

defineExpose({
    /** 重试预览（仅文档预览支持） */
    retry: () => docPreviewRef.value?.retry(),
    /** 销毁预览实例（仅文档预览支持） */
    destroy: () => docPreviewRef.value?.destroy(),
    /** 获取文档 SDK 实例（仅文档预览时有效） */
    getInstance: () => docPreviewRef.value?.getInstance() ?? null,
});
</script>

<style scoped>
.file-preview-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.file-preview-close {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 10;
    cursor: pointer;
    font-size: 14px;
    color: var(--td-text-color-secondary, #666);
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background-color 0.2s, color 0.2s;
}

.file-preview-close:hover {
    background-color: var(--td-bg-color-container-hover, #f3f3f3);
    color: var(--td-text-color-primary, #333);
}

.file-preview-inner {
    width: 100%;
    flex: 1;
    min-height: 0;
}

/* 不支持预览 */
.file-preview-unsupported {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    gap: 12px;
}

.unsupported-icon {
    font-size: 40px;
}

.unsupported-text {
    font-size: 14px;
    color: #999;
    margin: 0;
}
</style>
