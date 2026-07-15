<template>
    <div class="cron-task-panel">
        <!-- 标题栏 -->
        <div class="panel-header">
            <div class="header-left">
                <span class="panel-title">{{ i18n.panelTitle }}</span>
                <t-tooltip :content="i18n.empty" placement="bottom">
                    <span class="help-icon">
                        <CustomizedIcon
                            remote
                            name="basic_help_line"
                            size="xs"
                            :show-hover-bg="false"
                            :theme="theme"
                        />
                    </span>
                </t-tooltip>
            </div>
        </div>

        <!-- 操作条 -->
        <div class="panel-action-bar">
            <t-button theme="primary" @click="onManualCreate">
                <template #icon><add-icon /></template>
                {{ i18n.createManual }}
            </t-button>          
        </div>

        <!-- 卡片列表 -->
        <div ref="panelBody" class="panel-body" @scroll="onScroll">
            <!-- 首屏加载 -->
            <div v-if="loading && list.length === 0" class="empty-state">
                <t-loading size="small" :text="i18n.loading" />
            </div>

            <!-- 空状态 -->
            <div v-else-if="list.length === 0" class="empty-state">
                <p class="empty-text">
                    {{ i18n.empty }}
                    <span class="empty-text--highlight" @click="onManualCreate">
                        {{ i18n.createManual }}
                    </span>
                </p>
            </div>

            <!-- 任务卡片列表 -->
            <div v-else class="task-card-list">
                <CronTaskCard
                    v-for="item in list"
                    :key="getTimerId(item)"
                    :task="item"
                    :action-loading="operatingTaskId === getTimerId(item)"
                    :theme="theme"
                    :language="language"
                    :i18n="i18n"
                    @click="onCardClick"
                    @pause="onPause"
                    @resume="onResume"
                    @edit="onEdit"
                    @delete="onDelete"
                    @run="onRunNow"
                />
            </div>

            <!-- 加载更多 -->
            <div v-if="loadingMore" class="load-more">
                <t-loading size="small" />
            </div>
        </div>

        <!-- 创建/编辑对话框 -->
        <CreateTaskDialog
            v-model:visible="createDialogVisible"
            :editing-task="editingTask"
            :application-id="applicationId"
            :space-id="spaceId"
            :theme="theme"
            :language="language"
            :i18n="i18n"
            :folder-options="folderOptions"
            :model-options="modelOptions"
            @success="onCreateSuccess"
            @close="onDialogClose"
        />

        <!-- 删除确认 -->
        <DeleteTaskDialog
            v-model:visible="deleteDialogVisible"
            :task="deletingTask"
            :application-id="applicationId"
            :space-id="spaceId"
            :theme="theme"
            :language="language"
            :i18n="i18n"
            @success="onDeleteSuccess"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
    Button as TButton,
    Tooltip as TTooltip,
    Loading as TLoading,
    MessagePlugin,
} from 'tdesign-vue-next';
import { AddIcon } from 'tdesign-icons-vue-next';
import CustomizedIcon from '../CustomizedIcon.vue';
import CronTaskCard from './CronTaskCard.vue';
import CreateTaskDialog from './CreateTaskDialog/CreateTaskDialog.vue';
import DeleteTaskDialog from './DeleteTaskDialog.vue';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
import type {
    CronTaskI18n,
    TimerTaskSummary,
    TimerTask,
} from '../../model/cronTask';
import { getCronTaskI18nByLanguage } from '../../model/cronTask';
import {
    describeTimerTaskSummaryList,
    pauseTimerTask,
    resumeTimerTask,
    runTimerTaskNow,
} from '../../service/cronTaskApi';
import { getTimerId } from '../../utils/cronTask';

interface FolderOption { label: string; value: string }
interface ModelOption { label: string; value: string }

interface Props extends ThemeProps {
    /** 应用 ID（/adp 代理必需） */
    applicationId: string;
    /** 空间 ID */
    spaceId?: string;
    /** 语言 */
    language?: string;
    /** i18n 覆盖 */
    i18n?: Partial<CronTaskI18n>;
    /** 关联文件夹选项（新建/编辑对话框使用） */
    folderOptions?: FolderOption[];
    /** 模型选项 */
    modelOptions?: ModelOption[];
    /** 每页大小 */
    pageSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    spaceId: '',
    language: 'zh-CN',
    i18n: () => ({}),
    folderOptions: () => [],
    modelOptions: () => [],
    pageSize: 20,
});

const emit = defineEmits<{
    (e: 'select-task', task: TimerTaskSummary | TimerTask): void;
    (e: 'run-and-view', task: TimerTaskSummary | TimerTask): void;
    (e: 'optimize-prompt', content: string): void;
    (e: 'refresh'): void;
}>();

const i18n = computed<Required<CronTaskI18n>>(() => ({
    ...getCronTaskI18nByLanguage(props.language),
    ...props.i18n,
}));

// ─── 状态 ──────────────────────────────────────────────
const panelBody = ref<HTMLDivElement | null>(null);

const list = ref<Array<TimerTaskSummary | Record<string, any>>>([]);
const page = ref(1);
const hasMore = ref(true);
const loading = ref(false);
const loadingMore = ref(false);
const operatingTaskId = ref<string | null>(null);

const createDialogVisible = ref(false);
const editingTask = ref<TimerTaskSummary | TimerTask | null>(null);

const deleteDialogVisible = ref(false);
const deletingTask = ref<TimerTaskSummary | TimerTask | null>(null);

// ─── API 调用 ──────────────────────────────────────────
async function fetchList() {
    if (loading.value) return;
    loading.value = true;
    try {
        const res = await describeTimerTaskSummaryList(
            {
                SpaceId: props.spaceId,
                PageNumber: 1,
                PageSize: props.pageSize,
            },
            props.applicationId,
        );
        // 兼容 task_list / TaskList
        const items = (res as any)?.task_list || res?.TaskList || [];
        list.value = items;
        page.value = 1;
        hasMore.value = items.length >= props.pageSize;
    } catch (e) {
        console.error('[CronTaskPanel] fetchList failed:', e);
        MessagePlugin.error(i18n.value.loadFailed);
    } finally {
        loading.value = false;
    }
}

async function fetchMore() {
    if (loadingMore.value || !hasMore.value) return;
    loadingMore.value = true;
    try {
        const next = page.value + 1;
        const res = await describeTimerTaskSummaryList(
            {
                SpaceId: props.spaceId,
                PageNumber: next,
                PageSize: props.pageSize,
            },
            props.applicationId,
        );
        const items = (res as any)?.task_list || res?.TaskList || [];
        const existing = new Set(list.value.map((t) => getTimerId(t)));
        items.forEach((t: any) => {
            if (!existing.has(getTimerId(t))) list.value.push(t);
        });
        page.value = next;
        hasMore.value = items.length >= props.pageSize;
    } catch (e) {
        console.error('[CronTaskPanel] fetchMore failed:', e);
    } finally {
        loadingMore.value = false;
    }
}

/**
 * 操作成功后按当前已加载条数重新拉取
 */
async function refreshAfterAction() {
    const total = list.value.length;
    const pages = Math.max(1, Math.ceil(total / props.pageSize));
    try {
        const requests = [];
        for (let p = 1; p <= pages; p++) {
            requests.push(
                describeTimerTaskSummaryList(
                    {
                        SpaceId: props.spaceId,
                        PageNumber: p,
                        PageSize: props.pageSize,
                    },
                    props.applicationId,
                ),
            );
        }
        const responses = await Promise.all(requests);
        const seen = new Set<string>();
        const newList: any[] = [];
        responses.forEach((res) => {
            const items = (res as any)?.task_list || res?.TaskList || [];
            items.forEach((t: any) => {
                const id = getTimerId(t);
                if (id && !seen.has(id)) {
                    seen.add(id);
                    newList.push(t);
                }
            });
        });
        list.value = newList;
        page.value = pages;
        const lastItems = ((responses[responses.length - 1] as any)?.task_list ||
            responses[responses.length - 1]?.TaskList ||
            []) as any[];
        hasMore.value = lastItems.length >= props.pageSize;
    } catch (e) {
        console.error('[CronTaskPanel] refreshAfterAction failed:', e);
    }
    emit('refresh');
}

// ─── 滚动 ──────────────────────────────────────────────
const SCROLL_THRESHOLD = 100;
function onScroll() {
    const el = panelBody.value;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD) {
        fetchMore();
    }
}

// ─── 交互 ──────────────────────────────────────────────
function onManualCreate() {
    editingTask.value = null;
    createDialogVisible.value = true;
}

function onCardClick(task: any) {
    emit('select-task', task);
}

function onDialogClose() {
    createDialogVisible.value = false;
    editingTask.value = null;
}

function onCreateSuccess() {
    refreshAfterAction();
}

function onDeleteSuccess() {
    refreshAfterAction();
}

async function onPause(task: any) {
    const id = getTimerId(task);
    operatingTaskId.value = id;
    try {
        await pauseTimerTask(
            { SpaceId: props.spaceId, TimerId: id },
            props.applicationId,
        );
        MessagePlugin.success(i18n.value.pauseSuccess);
        await refreshAfterAction();
    } catch (e) {
        console.error('[CronTaskPanel] pause failed:', e);
        MessagePlugin.error(i18n.value.pauseFailed);
    } finally {
        operatingTaskId.value = null;
    }
}

async function onResume(task: any) {
    const id = getTimerId(task);
    operatingTaskId.value = id;
    try {
        await resumeTimerTask(
            { SpaceId: props.spaceId, TimerId: id },
            props.applicationId,
        );
        MessagePlugin.success(i18n.value.resumeSuccess);
        await refreshAfterAction();
    } catch (e) {
        console.error('[CronTaskPanel] resume failed:', e);
        MessagePlugin.error(i18n.value.resumeFailed);
    } finally {
        operatingTaskId.value = null;
    }
}

function onEdit(task: any) {
    editingTask.value = task;
    createDialogVisible.value = true;
}

function onDelete(task: any) {
    deletingTask.value = task;
    deleteDialogVisible.value = true;
}

async function onRunNow(task: any) {
    const id = getTimerId(task);
    operatingTaskId.value = id;
    try {
        await runTimerTaskNow(
            { SpaceId: props.spaceId, TimerId: id },
            props.applicationId,
        );
        MessagePlugin.success(i18n.value.runNowSuccess);
        emit('run-and-view', task);
        await refreshAfterAction();
    } catch (e) {
        console.error('[CronTaskPanel] runNow failed:', e);
        MessagePlugin.error(i18n.value.runNowFailed);
    } finally {
        operatingTaskId.value = null;
    }
}

// ─── 生命周期 ──────────────────────────────────────────
onMounted(() => {
    fetchList();
});

defineExpose({
    fetchList,
    refreshAfterAction,
});
</script>

<style scoped>
.cron-task-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--td-bg-color-container, #fff);
}

/* 标题栏 */
.panel-header {
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 24px;
    flex-shrink: 0;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.panel-title {
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    color: var(--td-text-color-primary, rgba(0, 1, 10, 0.93));
}

.help-icon {
    display: inline-flex;
    color: var(--td-text-color-placeholder, rgba(1, 11, 50, 0.41));
    cursor: pointer;
}

/* 操作条 */
.panel-action-bar {
    display: flex;
    align-items: flex-start;
    height: 44px;
    padding: 0 24px;
    flex-shrink: 0;
}

/* 内容区 */
.panel-body {
    flex: 1;
    overflow-y: auto;
    padding: 0 24px 16px;
}

.panel-body::-webkit-scrollbar {
    width: 6px;
}

.panel-body::-webkit-scrollbar-track {
    background: transparent;
}

.panel-body::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: transparent;
}

.panel-body:hover::-webkit-scrollbar-thumb {
    background: rgba(17, 32, 70, 0.13);
}

/* 空状态 */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 320px;
}

.empty-text {
    font-size: 13px;
    line-height: 20px;
    color: var(--td-text-color-placeholder, rgba(1, 11, 50, 0.41));
    text-align: center;
    margin: 0;
}

.empty-text--highlight {
    color: var(--td-brand-color, #4a70ff);
    cursor: pointer;
    margin-left: 4px;
}

/* 卡片网格 */
.task-card-list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
}

@media (max-width: 900px) {
    .task-card-list {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 600px) {
    .task-card-list {
        grid-template-columns: 1fr;
    }
}

/* 加载更多 */
.load-more {
    display: flex;
    justify-content: center;
    padding: 16px 0;
}
</style>
