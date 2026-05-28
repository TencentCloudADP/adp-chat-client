<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import FilePreview from '../FilePreview/index.vue';
import FileDir from '../FileDir/index.vue';
import type { FilePreviewI18n } from '../../model/type';
import { defaultFilePreviewI18n } from '../../model/type';

interface Props {
    /** 是否显示预览面板 */
    visible?: boolean;
    /** 当前会话ID */
    conversationId?: string;
    /** 当前应用ID */
    applicationId?: string;
    /** 国际化文本 */
    i18n?: FilePreviewI18n;
}

const props = withDefaults(defineProps<Props>(), {
    visible: false,
    conversationId: '',
    applicationId: '',
    i18n: () => ({}),
});

// 合并默认值和传入值
const i18n = computed(() => ({
    ...defaultFilePreviewI18n,
    ...props.i18n,
}));

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'select', entry: { name: string; type: string; path: string }): void;
}>();

/**
 * 当前预览的文件 URL
 */
const previewFileUrl = ref('');

// ========== 拖拽调整预览面板宽度 ==========
const previewPanelWidth = ref(480);
const MIN_PANEL_WIDTH = 280;
const MAX_PANEL_WIDTH = 900;

let isResizing = false;
let startX = 0;
let startWidth = 0;

const onResizeStart = (e: MouseEvent) => {
    isResizing = true;
    startX = e.clientX;
    startWidth = previewPanelWidth.value;
    document.addEventListener('mousemove', onResizeMove);
    document.addEventListener('mouseup', onResizeEnd);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
};

const onResizeMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const diff = startX - e.clientX;
    let newWidth = startWidth + diff;
    newWidth = Math.max(MIN_PANEL_WIDTH, Math.min(MAX_PANEL_WIDTH, newWidth));
    previewPanelWidth.value = newWidth;
};

const onResizeEnd = () => {
    isResizing = false;
    document.removeEventListener('mousemove', onResizeMove);
    document.removeEventListener('mouseup', onResizeEnd);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
};

onUnmounted(() => {
    document.removeEventListener('mousemove', onResizeMove);
    document.removeEventListener('mouseup', onResizeEnd);
});

/**
 * 处理文件目录点击选中
 */
const handleFileDirSelect = (entry: { name: string; type: string; path: string }) => {
    previewFileUrl.value = 'https://ci-qta-cq-1251704708.cos.ap-chongqing.myqcloud.com/data/doc/abnormalinput/special_font.doc';
    emit('select', entry);
};

/**
 * 处理预览错误
 */
const handlePreviewError = (err: Error) => {
    console.error('[FilePreviewLayout] FilePreview error:', err);
};

/**
 * 关闭整个文件面板（由 FileDir 触发）
 */
const handleCloseAll = () => {
    previewFileUrl.value = '';
    emit('close');
};

/**
 * 仅关闭文件预览区域（由 FilePreview 触发）
 */
const handleClosePreview = () => {
    previewFileUrl.value = '';
};

defineExpose({
    /** 设置预览文件 URL */
    setPreviewUrl: (url: string) => { previewFileUrl.value = url; },
});
</script>

<template>
    <div v-if="visible" class="file-preview-layout">
        <!-- 可拖拽分割线 -->
        <div class="resize-divider" @mousedown="onResizeStart">
            <div class="resize-divider__line"></div>
        </div>
        <!-- 文档预览面板 -->
        <div class="file-preview-panel" :style="{ width: previewPanelWidth + 'px' }">
            <div class="file-preview-panel__body" :class="{ 'has-preview': !!previewFileUrl }">
                <FileDir
                    :conversation-id="conversationId"
                    class="file-preview-panel__dir"
                    :application-id="applicationId"
                    :doc-list-text="i18n.docList"
                    :refresh-text="i18n.refresh"
                    @select="handleFileDirSelect"
                    @close="handleCloseAll"
                />
                <FilePreview
                    v-if="previewFileUrl"
                    class="file-preview-panel__preview"
                    :preview-url="previewFileUrl"
                    :loading-text="i18n.loading"
                    :loading-preview-text="i18n.loadingPreview"
                    :preview-failed-text="i18n.previewFailed"
                    :retry-text="i18n.retry"
                    @error="handlePreviewError"
                    @close="handleClosePreview"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
.file-preview-layout {
    display: flex;
    height: 100%;
    flex-shrink: 0;
}

.file-preview-panel {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--td-bg-color-container, #fff);
    flex-shrink: 0;
}

.resize-divider {
    width: 1px;
    height: 100%;
    cursor: col-resize;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
    z-index: 10;
}

.resize-divider:hover .resize-divider__line,
.resize-divider:active .resize-divider__line {
    background-color: var(--td-brand-color, #0052d9);
}

.resize-divider__line {
    width: 1px;
    height: 100%;
    background-color: var(--td-border-level-1-color, #e7e7e7);
    transition: background-color 0.2s;
}

.file-preview-panel__body {
    display: flex;
    flex: 1;
    overflow: hidden;
}

.file-preview-panel__dir {
    flex: 1;
    min-width: 150px;
}

/* 有文件预览时，dir 限制最大 300px，默认 50% */
.has-preview .file-preview-panel__dir {
    flex: none;
    width: 50%;
    max-width: 300px;
}

.file-preview-panel__preview {
    flex: 1;
    min-width: 0;
}
</style>
