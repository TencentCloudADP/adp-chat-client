<template>
    <div class="doc-preview-wrapper">
        <!-- 加载中状态 -->
        <div v-if="loading" class="doc-preview-loading">
            <div class="loading-spinner"></div>
            <p class="loading-text">{{ currentLoadingText }}</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="errorMsg" class="doc-preview-error">
            <div class="error-icon">⚠️</div>
            <p class="error-text">{{ errorMsg }}</p>
            <button class="retry-btn" @click="retry">{{ props.retryText }}</button>
        </div>

        <!-- 预览容器 -->
        <div
            v-show="!loading && !errorMsg"
            ref="previewContainer"
            id="file-preview-container"
            class="doc-preview-container"
        ></div>
    </div>
</template>

<script lang="ts">
import type { SDKConfigOptions, SDKInstance, GetPreviewUrlOptions } from '../../model/file-preview';

export interface DocPreviewProps {
    /**
     * 文件路径（如 /workdir/main.py），组件内部会调用 fetchFile 获取 COS 预览 URL
     */
    filePath?: string;
    /** 应用 ID */
    applicationId?: string;
    /** 工作空间 ID */
    workspaceId?: string;
    /** SDK JS 文件的 URL 路径 */
    sdkUrl?: string;
    /** 加载中文本 */
    loadingText?: string;
    /** 加载文档预览中文本 */
    loadingPreviewText?: string;
    /** 预览加载失败文本 */
    previewFailedText?: string;
    /** 重试按钮文本 */
    retryText?: string;
}

/** SDK 加载后在 window 上暴露的全局对象 */
declare global {
    interface Window {
        COSDocPreviewSDK: {
            config: (options: SDKConfigOptions) => SDKInstance;
            getPreviewUrl: (options: GetPreviewUrlOptions) => Promise<string>;
            getPreviewUrlAndToken: (options: GetPreviewUrlOptions) => Promise<any>;
        };
        WPS: {
            config: (options: SDKConfigOptions) => SDKInstance;
        };
    }
}
</script>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { fetchFile } from '../../service/api';

const props = withDefaults(defineProps<DocPreviewProps>(), {
    filePath: '',
    applicationId: '',
    workspaceId: '',
    sdkUrl: 'src/assets/sdk-v0.2.1.js',
    loadingText: '正在加载...',
    loadingPreviewText: '正在加载文档预览...',
    previewFailedText: '预览加载失败',
    retryText: '重试',
});

const emit = defineEmits<{
    /** 预览加载出错 */
    (e: 'error', error: Error): void;
}>();

const previewContainer = ref<HTMLDivElement>();
const loading = ref(false);
const errorMsg = ref('');
const currentLoadingText = ref(props.loadingText);

let previewInstance: SDKInstance | null = null;

// ========== SDK 动态加载 ==========

/**
 * 动态加载 JS SDK
 * 通过创建 <script> 标签注入到 document.head 中
 */
function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        // SDK 已加载则直接返回
        if (window.COSDocPreviewSDK) {
            resolve();
            return;
        }

        // 检查是否已有相同 src 的 script 标签正在加载
        const existingScript = document.querySelector(
            `script[src="${src}"]`
        ) as HTMLScriptElement | null;
        if (existingScript) {
            if (window.COSDocPreviewSDK) {
                resolve();
            } else {
                existingScript.addEventListener('load', () => resolve());
                existingScript.addEventListener('error', () =>
                    reject(new Error(`SDK 脚本加载失败: ${src}`))
                );
            }
            return;
        }

        // 动态创建 script 标签
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`SDK 脚本加载失败: ${src}`));
        document.head.appendChild(script);
    });
}

// ========== 文档预览 ==========

/**
 * 使用 COSDocPreviewSDK.config() 初始化在线文档预览
 */
async function initSDKPreview(previewUrl: string) {
    await loadScript(props.sdkUrl);

    if (!window.COSDocPreviewSDK) {
        throw new Error('COSDocPreviewSDK 加载后未能找到全局对象');
    }

    // 销毁旧实例
    destroyPreview();

    const preUrl = decodeURIComponent(previewUrl);

    // 创建 iframe 并设置预览地址
    if (previewContainer.value) {
        previewInstance = window.COSDocPreviewSDK.config({
            mount: previewContainer.value,
            url: preUrl,
            mode: 'normal',
            commonOptions: {
                isShowHeader: false,
                isShowTopArea: false
            },
            wordOptions: {
                isShowDocMap: false,
                isBestScale: true
            }
        });
    }
}

// ========== 主入口逻辑 ==========

/**
 * 初始化预览
 * 1. 调用 fetchFile 获取 COS 预签名 URL
 * 2. 使用 SDK 初始化文档预览
 */
async function initPreview() {
    if (!props.filePath || !props.applicationId || !props.workspaceId) return;

    loading.value = true;
    errorMsg.value = '';

    try {
        // 第一步：调用 fetchFile 获取 COS URL
        currentLoadingText.value = props.loadingText;
        const result = await fetchFile(
            {
                app_id: props.applicationId,
                workspace_id: props.workspaceId,
                path: props.filePath,
            },
            props.applicationId,
            { timeout: 120000 } // 延长超时到 120s，文件转存服务较慢
        );

        if (!result.preview_url) {
            throw new Error('文件转存失败：未返回预览链接');
        }

        // 第二步：使用预览 URL 初始化 SDK 预览
        currentLoadingText.value = props.loadingPreviewText;
        await initSDKPreview(result.preview_url);
        loading.value = false;
    } catch (error) {
        loading.value = false;
        const err = error as Error;
        errorMsg.value = err.message || props.previewFailedText;
        console.error('[DocPreview] Init failed:', err);
        emit('error', err);
    }
}

/**
 * 销毁预览实例
 */
function destroyPreview() {
    if (previewInstance) {
        try {
            previewInstance.destroy();
        } catch (e) {
            // ignore destroy errors
        }
        previewInstance = null;
    }

    // 清理容器内的 iframe
    if (previewContainer.value) {
        previewContainer.value.innerHTML = '';
    }
}

/**
 * 重试预览
 */
function retry() {
    errorMsg.value = '';
    initPreview();
}

// ========== 公开方法 ==========

/**
 * 获取当前 SDK 实例
 */
function getInstance(): SDKInstance | null {
    return previewInstance;
}

defineExpose({
    retry,
    destroy: destroyPreview,
    getInstance,
});

// ========== 生命周期 ==========

watch(
    () => props.filePath,
    (newPath, oldPath) => {
        if (newPath !== oldPath) {
            destroyPreview();
            if (newPath) {
                initPreview();
            }
        }
    }
);

watch(
    () => props.workspaceId,
    (newId, oldId) => {
        if (newId && newId !== oldId && props.filePath && !previewInstance && !loading.value) {
            initPreview();
        }
    }
);

onMounted(() => {
    if (props.filePath) {
        initPreview();
    }
});

onUnmounted(() => {
    destroyPreview();
});
</script>

<style scoped>
.doc-preview-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.doc-preview-container {
    width: 100%;
    height: 100%;
    flex: 1;
    position: relative;
    overflow: hidden;
}

.doc-preview-container :deep(iframe) {
    width: 100% !important;
    height: 100% !important;
    border: none !important;
}

/* 加载状态 */
.doc-preview-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    gap: 12px;
}

.loading-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid #e8e8e8;
    border-top-color: #0052d9;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.loading-text {
    font-size: 14px;
    color: #666;
    margin: 0;
}

/* 错误状态 */
.doc-preview-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    gap: 12px;
}

.error-icon {
    font-size: 40px;
}

.error-text {
    font-size: 14px;
    color: #e34d59;
    margin: 0;
    text-align: center;
    max-width: 80%;
    word-break: break-word;
}

.retry-btn {
    padding: 6px 20px;
    font-size: 14px;
    color: #fff;
    background-color: #0052d9;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.retry-btn:hover {
    background-color: #003cab;
}
</style>
