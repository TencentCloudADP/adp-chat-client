<script lang="ts">
import type { FilePreviewI18n, ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';

export interface FilePreviewLayoutProps extends ThemeProps {
    /** 是否显示预览面板 */
    visible?: boolean;
    /** 当前会话ID */
    conversationId?: string;
    /** 当前应用ID */
    applicationId?: string;
    /** 国际化文本 */
    i18n?: FilePreviewI18n;
}
</script>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import { Icon as TIcon } from 'tdesign-vue-next';
import FilePreview from '../FilePreview/index.vue';
import FileDir from '../FileDir/index.vue';
import { defaultFilePreviewI18n } from '../../model/type';
import { describeConversation } from '../../service/api';
import CustomizedIcon from '../CustomizedIcon.vue';


const props = withDefaults(defineProps<FilePreviewLayoutProps>(), {
    ...themePropsDefaults,
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
 * 当前预览的文件路径（原始路径，如 /workdir/main.py）
 */
const previewFilePath = ref('');

/** 从路径中提取文件名 */
const previewFileName = computed(() => {
    if (!previewFilePath.value) return '';
    const parts = previewFilePath.value.split('/');
    return parts[parts.length - 1] || '';
});

/** 是否显示文档列表列（从工具调用查看时隐藏） */
const dirVisible = ref(true);

/** 统一管理的 workspaceId，作为 prop 传给子组件，避免子组件重复请求 */
const workspaceId = ref('');

/** 正在进行中的 fetchWorkspaceId 请求 */
let fetchWorkspaceIdPromise: Promise<string> | null = null;

/**
 * 获取 workspaceId（带缓存和并发控制），结果保存到 workspaceId ref 中
 */
async function fetchWorkspaceId(): Promise<string> {
    if (workspaceId.value) return workspaceId.value;
    if (!props.conversationId || !props.applicationId) return '';

    if (fetchWorkspaceIdPromise) return fetchWorkspaceIdPromise;

    fetchWorkspaceIdPromise = (async () => {
        try {
            const res = await describeConversation(
                { ConversationId: props.conversationId, Type: 5 },
                props.applicationId
            );
            workspaceId.value = res.Workspace?.WorkspaceId || '';
        } catch (error) {
            console.error('[FilePreviewLayout] 获取 workspaceId 失败:', error);
        }
        fetchWorkspaceIdPromise = null;
        return workspaceId.value;
    })();

    return fetchWorkspaceIdPromise;
}

// 监听 conversationId / applicationId 变化，重置缓存（不立即请求，等 FileDir 展示时再请求）
watch(
    [() => props.conversationId, () => props.applicationId],
    () => {
        workspaceId.value = '';
        fetchWorkspaceIdPromise = null;
    },
);

// 监听面板可见性和文件列表可见性，FileDir 真正展示时才去获取 workspaceId
watch(
    [() => props.visible, dirVisible],
    ([panelVisible, dirShow]) => {
        if (panelVisible && dirShow && !workspaceId.value && props.applicationId) {
            fetchWorkspaceId();
        }
    },
);

// ========== 拖拽调整预览面板宽度 ==========
const previewPanelWidth = ref(600);
const MIN_PANEL_WIDTH = 280;
const MAX_PANEL_WIDTH = 1000;

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
 * 将文件路径传给 FilePreview，由 FilePreview 内部调用 FetchFile 获取预览 URL
 */
const handleFileDirSelect = async (entry: { name: string; type: string; path: string }) => {
    if (!props.applicationId) return;

    // 设置文件路径，FilePreview 组件内部会自动发起 fetchFile 请求
    previewFilePath.value = entry.path;

    emit('select', entry);
};

/**
 * 处理预览错误
 */
const handlePreviewError = (err: Error) => {
    console.error('[FilePreviewLayout] FilePreview error:', err);
};

/**
 * 关闭文档列表列（由 FileDir 的关闭按钮触发）
 * 只隐藏文档列表列，不关闭整个面板
 */
const handleCloseDir = () => {
    dirVisible.value = false;
    // 如果没有预览文件，则关闭整个面板
    if (!previewFilePath.value) {
        emit('close');
    }
};

/**
 * 关闭文件预览区域（由 FilePreview 关闭按钮触发）
 * 如果当前文档列表是隐藏的（通过"查看"打开的纯预览模式），则直接关闭整个面板
 */
const handleClosePreview = () => {
    previewFilePath.value = '';
    if (!dirVisible.value) {
        emit('close');
    }
};

/**
 * 切换文档列表列的可见性（由预览区标题栏图标触发）
 */
const toggleDirVisible = () => {
    dirVisible.value = !dirVisible.value;
};

/**
 * 规范化文件路径：将 agent 宿主路径转换为 workspace 文件系统路径
 * agent 工具操作的路径如 /root/file.html，需要转换为 /workdir/file.html
 */
function normalizeFilePath(path: string): string {
    if (!path) return path;
    if (path.startsWith('/workdir/') || path === '/workdir') return path;
    if (!path.startsWith('/')) {
        // 相对路径，如 "常用公式整理.md"，直接拼接 /workdir/
        return '/workdir/' + path;
    }
    // 绝对路径，将第一级目录替换为 /workdir，如 /root/a/b.html -> /workdir/a/b.html
    const parts = path.split('/');
    // parts[0] 是空字符串（路径以 / 开头），parts[1] 是第一级目录
    if (parts.length > 2) {
        parts[1] = 'workdir';
        return parts.join('/');
    }
    // 形如 /filename.html 的情况
    return '/workdir/' + path.slice(1);
}

defineExpose({
    /**
     * 设置预览文件路径，等 workspaceId 就绪后再设置，确保预览能正常加载
     * @param path 文件路径
     * @param options.showDir 是否显示文档列表列，默认 true
     */
    setPreviewPath: async (path: string, options?: { showDir?: boolean }) => {
        dirVisible.value = options?.showDir !== false;
        await fetchWorkspaceId();
        previewFilePath.value = normalizeFilePath(path);
    },
    /**
     * 重置为文档列表初始状态（清空预览文件，显示文档列表）
     */
    resetToList: () => {
        previewFilePath.value = '';
        dirVisible.value = true;
    },
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
            <div class="file-preview-panel__body" :class="{ 'has-preview': !!previewFilePath }">
                <FileDir
                    v-if="dirVisible"
                    :conversation-id="conversationId"
                    class="file-preview-panel__dir"
                    :application-id="applicationId"
                    :workspace-id="workspaceId"
                    :doc-list-text="i18n.docList"
                    :refresh-text="i18n.refresh"
                    :download-text="i18n.download"
                    :download-started-text="i18n.downloadStarted"
                    :loading-text="i18n.loading"
                    @select="handleFileDirSelect"
                    @close="handleCloseDir"                    
                />
                <!-- 文件预览 -->
                <div v-if="previewFilePath" class="file-preview-panel__preview" :class="{ 'file-preview-panel__preview--full': !dirVisible }">
                    <!-- 预览标题栏 -->
                    <div class="file-preview-panel__preview-header">
                        <span class="file-preview-panel__toggle-dir" @click="toggleDirVisible" :title="dirVisible ? i18n.hideDocList : i18n.showDocList">
                            <CustomizedIcon remote size="xs" :showHoverBg="false"  name="chart_structure_line" :theme="theme"/>
                        </span>
                        <span class="file-preview-panel__preview-title">{{ previewFileName }}</span>
                        <span class="file-preview-panel__close" @click="handleClosePreview">
                            <CustomizedIcon remote size="xs" :showHoverBg="false"  name="basic_close_line" :theme="theme"/>
                        </span>
                    </div>
                    <FilePreview
                        class="file-preview-panel__preview-content"
                        :file-path="previewFilePath"
                        :application-id="applicationId"
                        :workspace-id="workspaceId"
                        :loading-text="i18n.loading"
                        :loading-preview-text="i18n.loadingPreview"
                        :preview-failed-text="i18n.previewFailed"
                        :retry-text="i18n.retry"
                        :unsupported-text="i18n.unsupported"
                        @error="handlePreviewError"
                    />
                </div>
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
    display: flex;
    flex-direction: column;
}

/* 无目录列表时预览区占满宽度 */
.file-preview-panel__preview--full {
    width: 100%;
}

.file-preview-panel__preview-header {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--td-border-level-1-color, #e7e7e7);
    flex-shrink: 0;
    gap: 4px;
}

.file-preview-panel__toggle-dir {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    color: var(--td-text-color-secondary, #666);
    transition: background-color 0.2s, color 0.2s;
    flex-shrink: 0;
}

.file-preview-panel__toggle-dir:hover {
    background-color: var(--td-bg-color-container-hover, #f3f3f3);
    color: var(--td-text-color-primary);
}

.file-preview-panel__preview-title {
    flex: 1;
    font-size: var(--td-font-size-body-medium);
    font-weight: 600;
    color: var(--td-text-color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.file-preview-panel__close {
    cursor: pointer;
    font-size: 16px;
    color: var(--td-text-color-secondary);
    line-height: 1;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s, color 0.2s;
    flex-shrink: 0;
}

.file-preview-panel__close:hover {
    background-color: var(--td-bg-color-container-hover, #f3f3f3);
    color: var(--td-text-color-primary);
}

.file-preview-panel__preview-content {
    flex: 1;
    min-height: 0;
}
</style>
