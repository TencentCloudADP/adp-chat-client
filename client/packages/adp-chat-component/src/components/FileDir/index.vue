<template>
    <div class="file-dir-wrapper">
        <div class="file-dir-header">
            <span class="file-dir-title">{{ docListText }}</span>
            <div class="file-dir-actions">
                <span class="file-dir-action" :title="refreshText" @click="handleRefresh">
                    <t-icon name="refresh" :class="{ 'icon-spinning': refreshing }" />
                </span>
                <span class="file-dir-action file-dir-close" @click="emit('close')">✕</span>
            </div>
        </div>
        <div class="file-dir-tree">
            <t-tree
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
                    <t-icon v-if="node.getChildren() && !node.expanded" name="folder" />
                    <t-icon v-else-if="node.getChildren() && node.expanded && node.loading" name="loading" />
                    <t-icon v-else-if="node.getChildren() && node.expanded" name="folder-open" />
                    <t-icon v-else name="file" />
                </template>
                <template #operations="{ node }">
                    <span
                        v-if="!node.getChildren()"
                        class="file-download-btn"
                        title="下载"
                        @click.stop="handleDownload(node)"
                    >
                        <t-icon name="download" />
                    </span>
                </template>
            </t-tree>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Tree as TTree, Icon as TIcon, MessagePlugin } from 'tdesign-vue-next';
import { listDir, getFileDownloadUrl } from '../../service/api';
import type { DirEntry } from '../../service/api';

interface Props {
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
}

const props = withDefaults(defineProps<Props>(), {
    applicationId: '',
    conversationId: '',
    workspaceId: '',
    rootPath: '/workdir',
    docListText: '文档列表',
    refreshText: '刷新',
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
    const entries = await fetchDirEntries(props.rootPath);
    treeData.value = entries.map(entryToTreeNode);
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

    MessagePlugin.success(`开始下载: ${entry.name}`);
}

// 监听 workspaceId / applicationId 变化重新加载
watch(
    [() => props.workspaceId, () => props.applicationId],
    ([newWsId, newAppId]) => {
        if (newAppId && newWsId) {
            initRootDir();
        }
    },
    { immediate: true }
);
</script>

<style scoped>
.file-dir-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-right: 1px solid var(--td-border-level-1-color, #e7e7e7);
    background: var(--td-bg-color-container, #fff);
}

.file-dir-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--td-border-level-1-color, #e7e7e7);
    flex-shrink: 0;
}

.file-dir-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--td-text-color-primary);
}

.file-dir-actions {
    display: flex;
    align-items: center;
    gap: 4px;
}

.file-dir-action {
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
}

.file-dir-action:hover {
    background-color: var(--td-bg-color-container-hover, #f3f3f3);
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
    padding: 8px 16px;
}

:deep(.t-tree__item) {
    cursor: pointer;
}

:deep(.t-tree__item:hover) {
    background-color: var(--td-bg-color-container-hover, #f3f3f3);
}

:deep(.t-tree__item--active) {
    background-color: var(--td-brand-color-light, #ecf2fe);
}

:deep(.t-tree__label) {
    font-size: 13px;
    color: var(--td-text-color-primary);
}

.file-download-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    cursor: pointer;
    color: var(--td-text-color-secondary, #666);
    font-size: 14px;
    transition: background-color 0.2s, color 0.2s;
    flex-shrink: 0;
}

.file-download-btn:hover {
    background-color: var(--td-bg-color-container-hover, #f3f3f3);
    color: var(--td-brand-color, #0052d9);
}

.file-download-btn.is-loading {
    pointer-events: none;
    color: var(--td-brand-color, #0052d9);
}
</style>
