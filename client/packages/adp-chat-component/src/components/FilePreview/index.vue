<template>
    <div class="file-preview-wrapper">
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
            v-else-if="previewType === 'image' && resolvedFileUrl"
            class="file-preview-inner"
            :url="resolvedFileUrl"
            :file-name="resolvedFileName"
            :error-text="previewFailedText"
            @error="(err) => emit('error', err)"
        />

        <!-- HTML 沙箱预览 -->
        <HtmlPreview
            v-else-if="previewType === 'html' && resolvedFileUrl"
            class="file-preview-inner"
            :url="resolvedFileUrl"
            :file-name="resolvedFileName"
            :error-text="previewFailedText"
            @error="(err) => emit('error', err)"
        />

        <!-- Markdown 预览 -->
        <MarkdownPreview
            v-else-if="previewType === 'markdown' && resolvedFileUrl"
            class="file-preview-inner"
            :url="resolvedFileUrl"
            :file-name="resolvedFileName"
            :error-text="previewFailedText"
            @error="(err) => emit('error', err)"
        />

        <!-- 代码预览（Monaco Editor） -->
        <CodePreview
            v-else-if="previewType === 'code' && resolvedFileUrl"
            class="file-preview-inner"
            :url="resolvedFileUrl"
            :file-name="resolvedFileName"
            :error-text="previewFailedText"
            @error="(err) => emit('error', err)"
        />
    </div>
</template>

<script lang="ts">
export type { FilePreviewProps } from '../../model/file-preview';
export type { SDKInstance } from '../../model/file-preview';
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import DocPreview from './DocPreview.vue';
import ImagePreview from './ImagePreview.vue';
import HtmlPreview from './HtmlPreview.vue';
import MarkdownPreview from './MarkdownPreview.vue';
import CodePreview from './CodePreview.vue';
import { getFileDownloadUrl } from '../../service/api';
import type { FilePreviewProps } from '../../model/file-preview';

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

const props = withDefaults(defineProps<FilePreviewProps>(), {
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

/**
 * 非 doc 类型文件的实际访问 URL
 * 优先使用外部传入的 fileUrl；否则通过 getFileDownloadUrl 生成同域代理链接
 */
const resolvedFileUrl = ref('');

/** 文件名：从 filePath 或 fileName 中提取 */
const resolvedFileName = computed(() => {
    if (props.fileName) return props.fileName;
    if (props.filePath) return props.filePath.split('/').pop() || '';
    return '';
});

watch(
    [() => props.filePath, () => props.fileUrl, () => props.workspaceId, previewType],
    ([newPath, newFileUrl, newWorkspaceId, newType]) => {
        // doc 类型由 DocPreview 内部处理，不需要这里获取
        if (newType === 'doc') {
            resolvedFileUrl.value = '';
            return;
        }

        // 如果外部直接传了 fileUrl，直接使用
        if (newFileUrl) {
            resolvedFileUrl.value = newFileUrl;
            return;
        }

        // 通过后端代理生成同域下载 URL（无需异步请求，直接拼 URL）
        if (!newPath || !props.applicationId || !newWorkspaceId) {
            resolvedFileUrl.value = '';
            return;
        }

        resolvedFileUrl.value = getFileDownloadUrl(
            {
                app_id: props.applicationId,
                workspace_id: newWorkspaceId,
                path: newPath,
            },
            props.applicationId
        );
    },
    { immediate: true }
);

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
