<template>
    <div class="file-dir-wrapper">
        <div class="file-dir-header">
            <span class="file-dir-title">{{ docListText }}</span>
            <div class="file-dir-actions">
                <span class="file-dir-action" :title="refreshText" @click="handleRefresh">
                    <CustomizedIcon remote size="xs" :showHoverBg="false" :class="{ 'icon-spinning': refreshing }" name="basic_refresh_line" :theme="theme"/>
                </span>
                <span class="file-dir-action " @click="emit('close')">
                    <CustomizedIcon remote size="xs" :showHoverBg="false"  name="basic_close_line" :theme="theme"/>
                </span>
            </div>
        </div>
        <div class="file-dir-tree">
            <div v-if="loading" class="file-dir-loading">
                <t-icon name="loading" class="icon-spinning" />
                <span>{{ loadingText }}</span>
            </div>
            <t-tree
                v-else
                :data="treeData"
                hover
                :lazy="true"
                :load="loadChildren"
                activable
                :expand-on-click-node="true"
                :keys="treeKeys"
                @click="handleNodeClick"
            >
                <template #icon="{ node }">
                    <CustomizedIcon v-if="node.getChildren() && !node.expanded" remote name="arrow_up_small_line" :theme="theme" :showHoverBg="false" size="xs" class="tree-arrow tree-arrow--collapsed" />
                    <t-icon v-else-if="node.getChildren() && node.expanded && node.loading" name="loading" />
                    <CustomizedIcon v-else-if="node.getChildren() && node.expanded" remote name="arrow_up_small_line" :theme="theme" :showHoverBg="false" size="xs" class="tree-arrow tree-arrow--expanded" />
                    <CustomizedIcon v-else remote :name="getFileIconName(node.data?.entry?.name || '')" :theme="theme" nativeIcon :showHoverBg="false" size="xs" />
                </template>
                <template #operations="{ node }">
                    <span
                        v-if="!node.getChildren()"
                        class="file-download-btn"
                        :title="props.downloadText"
                        @click.stop="handleDownload(node)"
                    >
                        <CustomizedIcon remote name="basic_download2_line" :theme="theme" nativeIcon :showHoverBg="false" size="xs" />
                    </span>
                </template>
            </t-tree>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';
import { Tree as TTree, Icon as TIcon, MessagePlugin } from 'tdesign-vue-next';
import { listDir, getFileDownloadUrl } from '../../service/api';
import CustomizedIcon from '../CustomizedIcon.vue';
import { getFileIconName } from '../../model/file';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
import type { DirEntry } from '../../service/api';

interface Props extends ThemeProps {
    /** 应用 ID */
    applicationId?: string;
    /** 会话 ID */
    conversationId?: string;
    /** 由父组件统一获取并传入的 workspaceId */
    workspaceId?: string;
    /** 根路径 */
    rootPath?: string;
    /** 文档列表标题文本 */
    docListText?: string;
    /** 刷新按钮 title 文本 */
    refreshText?: string;
    /** 下载按钮 title 文本 */
    downloadText?: string;
    /** 开始下载提示文本（{name} 为文件名占位符） */
    downloadStartedText?: string;
    /** 加载中文本 */
    loadingText?: string;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    applicationId: '',
    conversationId: '',
    workspaceId: '',
    rootPath: '/workdir',
    docListText: '文档列表',
    refreshText: '刷新',
    downloadText: '下载',
    downloadStartedText: '开始下载: {name}',
    loadingText: '加载中...',
});

const emit = defineEmits<{
    /** 点击文件节点时触发 */
    (e: 'select', entry: DirEntry): void;
    /** 关闭面板 */
    (e: 'close'): void;
}>();

/** 树形数据节点接口 */
interface TreeNode {
    /** 节点唯一标识 */
    value: string;
    /** 显示名称 */
    label: string;
    /** 是否有子节点（true 表示为目录，需懒加载） */
    children?: TreeNode[] | boolean;
    /** 原始条目数据 */
    entry: DirEntry;
}

/** t-tree 的 keys 配置 */
const treeKeys = {
    value: 'value',
    label: 'label',
    children: 'children',
};

/** 树形数据 */
const treeData = ref<TreeNode[]>([]);

/** 根目录加载中状态（目录接口请求中 或 workspaceId 尚未就绪） */
const loading = ref(false);

/**
 * 将 DirEntry 转换为 TreeNode
 */
function entryToTreeNode(entry: DirEntry): TreeNode {
    return {
        value: entry.path,
        label: entry.name,
        // 如果是目录，children 设为 true 表示需要懒加载
        children: entry.type === 'FILE_TYPE_DIRECTORY' ? true : undefined,
        entry,
    };
}

/**
 * 加载目录内容
 */
async function fetchDirEntries(path: string): Promise<DirEntry[]> {
    if (!props.applicationId) return [];

    try {
        const response = await listDir(
            {
                app_id: props.applicationId,
                path,
                depth: 1,
                workspace_id: props.workspaceId,
            },
            props.applicationId
        );
        return response.entries || [];
    } catch (error) {
        console.error('[FileDir] 加载目录失败:', error);
        return [];
    }
}

/**
 * 懒加载子节点
 * Tree 组件展开一个 children 为 true 的节点时调用
 */
async function loadChildren(node: any): Promise<TreeNode[]> {
    const path = node.data?.value || node.value;
    const entries = await fetchDirEntries(path);
    return entries.map(entryToTreeNode);
}

/**
 * 节点点击事件
 */
function handleNodeClick({ node }: { node: any }) {
    const entry = node.data?.entry as DirEntry | undefined;
    if (entry && entry.type === 'FILE_TYPE_FILE') {
        emit('select', entry);
    }
}

/**
 * 初始化加载根目录
 */
async function initRootDir() {
    loading.value = true;
    try {
        const entries = await fetchDirEntries(props.rootPath);
        treeData.value = entries.map(entryToTreeNode);
    } finally {
        loading.value = false;
    }
}

/** 刷新中状态 */
const refreshing = ref(false);

/** 刷新文件列表 */
async function handleRefresh() {
    if (refreshing.value) return;
    refreshing.value = true;
    try {
        await initRootDir();
    } finally {
        refreshing.value = false;
    }
}

/**
 * 下载文件
 * 使用同域代理 URL 直接触发浏览器下载，无跨域问题
 */
function handleDownload(node: any) {
    const entry = node.data?.entry as DirEntry | undefined;
    if (!entry || entry.type !== 'FILE_TYPE_FILE') return;

    const downloadUrl = getFileDownloadUrl(
        {
            app_id: props.applicationId,
            workspace_id: props.workspaceId,
            path: entry.path,
        },
        props.applicationId
    );

    // 通过创建隐藏的 <a> 标签触发浏览器下载
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = entry.name;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    MessagePlugin.success(props.downloadStartedText.replace('{name}', entry.name));
}

/** 等待 workspaceId 就绪的超时定时器 */
let loadingTimeoutTimer: ReturnType<typeof setTimeout> | null = null;
/** loading 超时时间（毫秒） */
const LOADING_TIMEOUT = 4000;

function clearLoadingTimeout() {
    if (loadingTimeoutTimer) {
        clearTimeout(loadingTimeoutTimer);
        loadingTimeoutTimer = null;
    }
}

// 监听 workspaceId / applicationId 变化重新加载
watch(
    [() => props.workspaceId, () => props.applicationId],
    ([newWsId, newAppId]) => {
        clearLoadingTimeout();
        if (newAppId && newWsId) {
            initRootDir();
        } else {
            // workspaceId 尚未就绪，显示 loading 状态，但设置超时
            treeData.value = [];
            loading.value = true;
            loadingTimeoutTimer = setTimeout(() => {
                // 超时后仍未获取到 workspaceId，停止 loading 显示空列表
                if (loading.value) {
                    loading.value = false;
                    treeData.value = [];
                }
            }, LOADING_TIMEOUT);
        }
    },
    { immediate: true }
);

onBeforeUnmount(() => {
    clearLoadingTimeout();
});
</script>

<style scoped>
.file-dir-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-right: 1px solid var(--td-border-level-1-color);
    background: var(--td-bg-color-container);
}

.file-dir-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--td-comp-paddingTB-m) var(--td-comp-paddingLR-l);
    border-bottom: 1px solid var(--td-border-level-1-color);
    flex-shrink: 0;
    line-height: 31px;
}

.file-dir-title {
    font-size: var(--td-font-size-body-medium);
    font-weight: 600;
    color: var(--td-text-color-primary);
}

.file-dir-actions {
    display: flex;
    align-items: center;
    gap: var(--td-comp-margin-xs);
}

.file-dir-action {
    cursor: pointer;
    color: var(--td-text-color-secondary);
    line-height: 1;
    display: flex;
    padding: var(--td-comp-paddingLR-xs);
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s, color 0.2s;
}

.file-dir-action:hover {
    background-color: var(--td-bg-color-container-hover);
    color: var(--td-text-color-primary);
}

.icon-spinning {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.file-dir-tree {
    flex: 1;
    overflow-y: auto;
    padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-l);
}

.file-dir-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--td-comp-margin-s);
    padding: var(--td-comp-paddingTB-xxl) 0;
    color: var(--td-text-color-secondary);
    font-size: var(--td-font-size-body-small);
}

:deep(.t-tree__item) {
    cursor: pointer;
}

:deep(.t-tree__item:hover) {
    background-color: var(--td-bg-color-container-hover);
}

:deep(.t-tree__item.t-is-active) {
    background-color: var(--td-brand-color-light);
}
:deep(.t-tree--hoverable .t-tree__label:not(.t-is-active):not(.t-is-checked):hover) {
    background-color: transparent;
}
:deep(.t-tree__label) {
    font-size: var(--td-font-size-body-small);
    color: var(--td-text-color-primary);
}

.file-download-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--td-comp-size-xs);
    height: var(--td-comp-size-xs);
    border-radius: var(--td-radius-default);
    cursor: pointer;
    color: var(--td-text-color-secondary);
    font-size: var(--td-font-size-body-medium);
    transition: background-color 0.2s, color 0.2s;
    flex-shrink: 0;
}

.file-download-btn:hover {
    background-color: var(--td-bg-color-container-hover);
    color: var(--td-brand-color);
}

.tree-arrow {
    transition: transform 0.2s;
}

.tree-arrow--collapsed {
    transform: rotate(90deg);
}

.tree-arrow--expanded {
    transform: rotate(180deg);
}

.file-download-btn.is-loading {
    pointer-events: none;
    color: var(--td-brand-color);
}
</style>
