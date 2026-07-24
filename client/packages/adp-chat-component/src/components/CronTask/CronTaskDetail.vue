<template>
    <div class="cron-task-detail">
        <!-- 头部 -->
        <div class="cron-task-detail__header">
            <span class="cron-task-detail__back" @click="handleBack">
                <CustomizedIcon
                    remote
                    name="arrow_left_small_line"
                    size="xs"
                    :show-hover-bg="false"
                    :theme="theme"
                />
            </span>
            <span class="cron-task-detail__title">
                {{ taskName || i18n.detail }}
            </span>
        </div>

        <!-- 主体 -->
        <div class="cron-task-detail__body">
            <template v-if="currentTask">
                <!-- 提示词 -->
                <div class="cron-task-detail__section">
                    <div class="cron-task-detail__section-title">{{ i18n.prompt }}</div>
                    <div class="cron-task-detail__section-content">
                        <div class="cron-task-detail__desc">{{ taskPrompt || '—' }}</div>
                    </div>
                </div>

                <!-- 调度信息 + 操作 -->
                <div class="cron-task-detail__schedule">
                    <div class="cron-task-detail__schedule-left">
                        <span
                            class="cron-task-detail__status"
                            :class="`cron-task-detail__status--${statusClass}`"
                        >
                            <span class="cron-task-detail__status-dot" />
                            {{ statusText }}
                        </span>
                        <span class="cron-task-detail__schedule-text">
                            {{ scheduleDescription }}
                        </span>
                    </div>
                    <div class="cron-task-detail__actions">
                        <t-button
                            v-if="taskStatus === TimerTaskStatus.ACTIVE"
                            size="small"
                            variant="text"
                            :disabled="actionLoading"
                            @click="handlePause"
                        >
                            <template #icon>
                                <CustomizedIcon remote name="basic_pause_line" size="xxs" :theme="theme" />
                            </template>
                            {{ i18n.pause }}
                        </t-button>
                        <t-button
                            v-else-if="taskStatus === TimerTaskStatus.PAUSED"
                            size="small"
                            variant="text"
                            :disabled="actionLoading"
                            @click="handleResume"
                        >
                            <template #icon>
                                <CustomizedIcon remote name="basic_play_round_line" size="xxs" :theme="theme" />
                            </template>
                            {{ i18n.resume }}
                        </t-button>
                        <t-button size="small" variant="text" :disabled="actionLoading" @click="handleEdit">
                            <template #icon>
                                <CustomizedIcon remote name="basic_edit_line" size="xxs" :theme="theme" />
                            </template>
                            {{ i18n.edit }}
                        </t-button>
                        <t-button
                            size="small"
                            variant="text"
                            theme="danger"
                            :disabled="actionLoading"
                            @click="handleDelete"
                        >
                            <template #icon>
                                <CustomizedIcon remote name="basic_delete_line" size="xxs" :theme="theme" />
                            </template>
                            {{ i18n.del }}
                        </t-button>
                        <t-button
                            size="small"
                            theme="primary"
                            :loading="actionLoading"
                            @click="handleRunNow"
                        >
                            <template #icon>
                                <CustomizedIcon remote name="basic_play_line" size="xxs" :theme="theme" />
                            </template>
                            {{ i18n.runNow }}
                        </t-button>
                    </div>
                </div>

                <!-- 运行日志 -->
                <div class="cron-task-detail__section cron-task-detail__section--logs">
                    <div class="cron-task-detail__section-title">{{ i18n.runLog }}</div>
                    <div ref="logListRef" class="cron-task-detail__log-list" @scroll="handleLogScroll">
                        <div
                            v-for="log in executionLogs"
                            :key="log.LogId || `${log.TimerId}-${log.TriggerTime}`"
                            class="cron-task-detail__log-item"
                            @click="handleLogClick(log)"
                        >
                            <div class="cron-task-detail__log-header">
                                <span class="cron-task-detail__log-time">{{ log._timeLabel }}</span>
                                <span
                                    class="cron-task-detail__log-status"
                                    :class="`cron-task-detail__log-status--${log._statusClass}`"
                                >
                                    {{ log._statusText }}
                                </span>
                                <span v-if="!log.IsRead" class="cron-task-detail__log-dot" />
                            </div>
                            <div class="cron-task-detail__log-content">
                                {{ log._content }}
                            </div>
                        </div>

                        <div v-if="logsLoadingMore" class="cron-task-detail__log-tip">
                            {{ i18n.loading }}
                        </div>
                        <div
                            v-else-if="!hasMoreLogs && executionLogs.length"
                            class="cron-task-detail__log-tip"
                        >
                            {{ i18n.noRunLog }}
                        </div>
                        <div v-if="!executionLogs.length && !logsLoading" class="cron-task-detail__log-empty">
                            {{ i18n.noRunLog }}
                        </div>
                    </div>
                </div>
            </template>

            <div v-else class="cron-task-detail__placeholder">
                <span>{{ i18n.noRunLog }}</span>
            </div>
        </div>

        <!-- 编辑对话框 -->
        <CreateTaskDialog
            v-model:visible="editDialogVisible"
            :editing-task="editingTask"
            :application-id="applicationId"
            :space-id="spaceId"
            :language="language"
            :i18n="props.i18n"
            :model-options="modelOptions"
            :folder-options="folderOptions"
            @success="handleEditSuccess"
            @close="editDialogVisible = false"
        />

        <!-- 删除对话框 -->
        <DeleteTaskDialog
            v-model:visible="deleteDialogVisible"
            :task="currentTask"
            :application-id="applicationId"
            :space-id="spaceId"
            :language="language"
            :i18n="props.i18n"
            :theme="theme"
            @success="handleDeleteSuccess"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { Button as TButton, MessagePlugin } from 'tdesign-vue-next';
import CustomizedIcon from '../CustomizedIcon.vue';
import CreateTaskDialog from './CreateTaskDialog/CreateTaskDialog.vue';
import DeleteTaskDialog from './DeleteTaskDialog.vue';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
import type {
    CronTaskI18n,
    TimerTask,
    TimerTaskSummary,
    TimerRunLog,
} from '../../model/cronTask';
import {
    TimerTaskStatus,
    TimerRunStatus,
    getCronTaskI18nByLanguage,
} from '../../model/cronTask';
import {
    describeTimerTask,
    describeTimerTaskRunLogList,
    pauseTimerTask,
    resumeTimerTask,
    runTimerTaskNow,
} from '../../service/cronTaskApi';
import {
    getTimerId,
    getTaskName,
    getPromptContent,
    getPolicySummary,
    getTaskStatus,
    formatRelativeTime,
} from '../../utils/cronTask';

interface Option { label: string; value: string }

interface Props extends ThemeProps {
    /** 任务（可以只是 Summary） */
    task: TimerTaskSummary | TimerTask | null;
    /** 应用 ID */
    applicationId: string;
    /** 空间 ID */
    spaceId?: string;
    /** 语言 */
    language?: string;
    /** i18n 覆盖 */
    i18n?: Partial<CronTaskI18n>;
    /** 模型选项（编辑对话框用） */
    modelOptions?: Option[];
    /** 文件夹选项（编辑对话框用） */
    folderOptions?: Option[];
    /** 轮询间隔（ms），默认 10s */
    pollInterval?: number;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    task: null,
    spaceId: '',
    language: 'zh-CN',
    i18n: () => ({}),
    modelOptions: () => [],
    folderOptions: () => [],
    pollInterval: 10 * 1000,
});

const emit = defineEmits<{
    (e: 'back'): void;
    (e: 'switch-to-chat', payload: { task: any; sessionId?: string; logId?: string }): void;
    (e: 'action-done', action: 'pause' | 'resume' | 'edit' | 'delete' | 'run', task: any): void;
}>();

const i18n = computed<Required<CronTaskI18n>>(() => ({
    ...getCronTaskI18nByLanguage(props.language),
    ...props.i18n,
}));

// ============================================================
// 状态
// ============================================================
const taskDetail = ref<TimerTask | null>(null);
const runLogs = ref<TimerRunLog[]>([]);
const logsLoading = ref(false);
const logsLoadingMore = ref(false);
const hasMoreLogs = ref(true);
const currentPage = ref(1);
const pageSize = ref(20);
const pollTimer = ref<ReturnType<typeof setInterval> | null>(null);

const editDialogVisible = ref(false);
const editingTask = ref<TimerTaskSummary | TimerTask | null>(null);
const deleteDialogVisible = ref(false);
const actionLoading = ref(false);

const logListRef = ref<HTMLDivElement | null>(null);

// 统一数据源
const currentTask = computed(() => taskDetail.value || props.task);
const taskStatus = computed(() => (currentTask.value ? getTaskStatus(currentTask.value) : 0));
const statusClass = computed(() => {
    if (!currentTask.value) return '';
    return (
        {
            [TimerTaskStatus.ACTIVE]: 'active',
            [TimerTaskStatus.PAUSED]: 'paused',
            [TimerTaskStatus.COMPLETED]: 'stopped',
        } as Record<number, string>
    )[taskStatus.value] || 'stopped';
});
const statusText = computed(() => {
    if (!currentTask.value) return '';
    return (
        {
            [TimerTaskStatus.ACTIVE]: i18n.value.running,
            [TimerTaskStatus.PAUSED]: i18n.value.paused,
            [TimerTaskStatus.COMPLETED]: i18n.value.completed,
        } as Record<number, string>
    )[taskStatus.value] || '';
});
const taskName = computed(() => (currentTask.value ? getTaskName(currentTask.value) : ''));
const taskPrompt = computed(() => (currentTask.value ? getPromptContent(currentTask.value) : ''));
const scheduleDescription = computed(() =>
    currentTask.value ? getPolicySummary(currentTask.value) || '—' : '',
);

// ============================================================
// 日志渲染
// ============================================================
function getLogStatusValue(log: any): number {
    return Number(log.run_status ?? log.RunStatus ?? log.status ?? 0);
}

function getLogTriggerTime(log: any): string | number | undefined {
    return log.trigger_time ?? log.TriggerTime ?? log.start_time ?? log.StartTime ?? log.scheduled_fire_time;
}

function getLogSessionId(log: any): string {
    return log.session_id ?? log.SessionId ?? '';
}

function getLogContent(log: any): string {
    return (
        log.result_message ?? log.ResultMessage ?? log.result_summary ?? log.error_message ?? log.ErrorMessage ?? ''
    );
}

function getLogUnread(log: any): boolean {
    // is_read=false 表示未读；若字段缺失则默认 false（不显示红点）
    const read = log.is_read ?? log.IsRead;
    return read === false;
}

const executionLogs = computed(() =>
    runLogs.value.map((log: any) => {
        const status = getLogStatusValue(log);
        return {
            ...log,
            _timeLabel: formatRelativeTime(getLogTriggerTime(log)),
            _statusClass: getLogStatusClass(status),
            _statusText: getLogStatusText(status),
            _content: getLogContent(log),
            IsRead: !getLogUnread(log),
        };
    }),
);

function getLogStatusClass(status: number): string {
    const map: Record<number, string> = {
        [TimerRunStatus.PENDING]: 'pending',
        [TimerRunStatus.RUNNING]: 'running',
        [TimerRunStatus.RETRY_WAIT]: 'pending',
        [TimerRunStatus.SUCCESS]: 'success',
        [TimerRunStatus.DEAD]: 'failed',
        [TimerRunStatus.CANCELLED]: 'pending',
    };
    return map[status] || 'pending';
}

function getLogStatusText(status: number): string {
    const map: Record<number, string> = {
        [TimerRunStatus.PENDING]: props.language?.startsWith('en') ? 'Pending' : '等待执行',
        [TimerRunStatus.RUNNING]: props.language?.startsWith('en') ? 'Running' : '正在执行',
        [TimerRunStatus.RETRY_WAIT]: props.language?.startsWith('en') ? 'Retrying' : '等待重试',
        [TimerRunStatus.SUCCESS]: props.language?.startsWith('en') ? 'Success' : '执行成功',
        [TimerRunStatus.DEAD]: props.language?.startsWith('en') ? 'Failed' : '执行失败',
        [TimerRunStatus.CANCELLED]: props.language?.startsWith('en') ? 'Canceled' : '已取消',
    };
    return map[status] || '';
}

// ============================================================
// 数据加载
// ============================================================
async function fetchTaskDetail(timerId: string) {
    try {
        const detail: any = await describeTimerTask(
            { SpaceId: props.spaceId, TimerId: timerId },
            props.applicationId,
        );
        taskDetail.value = detail || null;
    } catch (e) {
        console.error('[CronTaskDetail] fetchTaskDetail failed:', e);
        taskDetail.value = null;
    }
}

async function fetchRunLogs(timerId: string) {
    logsLoading.value = true;
    currentPage.value = 1;
    hasMoreLogs.value = true;
    try {
        const res: any = await describeTimerTaskRunLogList(
            {
                SpaceId: props.spaceId,
                TimerId: timerId,
                PageNumber: 1,
                PageSize: pageSize.value,
            },
            props.applicationId,
        );
        const list: TimerRunLog[] = res?.run_log_list || res?.LogList || [];
        runLogs.value = list;
        if (list.length < pageSize.value) hasMoreLogs.value = false;
        _startPolling();
    } catch (e) {
        console.error('[CronTaskDetail] fetchRunLogs failed:', e);
        runLogs.value = [];
    } finally {
        logsLoading.value = false;
    }
}

async function loadMoreLogs() {
    const timerId = currentTask.value ? getTimerId(currentTask.value) : '';
    if (!timerId || logsLoadingMore.value || !hasMoreLogs.value) return;
    logsLoadingMore.value = true;
    const nextPage = currentPage.value + 1;
    try {
        const res: any = await describeTimerTaskRunLogList(
            {
                SpaceId: props.spaceId,
                TimerId: timerId,
                PageNumber: nextPage,
                PageSize: pageSize.value,
            },
            props.applicationId,
        );
        const list: TimerRunLog[] = res?.run_log_list || res?.LogList || [];
        if (list.length < pageSize.value) hasMoreLogs.value = false;
        runLogs.value = [...runLogs.value, ...list];
        currentPage.value = nextPage;
    } catch (e) {
        console.error('[CronTaskDetail] loadMoreLogs failed:', e);
    } finally {
        logsLoadingMore.value = false;
    }
}

function handleLogScroll() {
    const el = logListRef.value;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 50) {
        loadMoreLogs();
    }
}

function _startPolling() {
    _stopPolling();
    pollTimer.value = setInterval(() => {
        _pollRefreshLogs();
    }, props.pollInterval);
}

function _stopPolling() {
    if (pollTimer.value) {
        clearInterval(pollTimer.value);
        pollTimer.value = null;
    }
}

async function _pollRefreshLogs() {
    const timerId = currentTask.value ? getTimerId(currentTask.value) : '';
    if (!timerId) return;
    const totalSize = currentPage.value * pageSize.value;
    try {
        const res: any = await describeTimerTaskRunLogList(
            {
                SpaceId: props.spaceId,
                TimerId: timerId,
                PageNumber: 1,
                PageSize: totalSize,
            },
            props.applicationId,
        );
        const list: TimerRunLog[] = res?.run_log_list || res?.LogList || [];
        runLogs.value = list;
        if (list.length < totalSize) hasMoreLogs.value = false;
    } catch (e) {
        console.error('[CronTaskDetail] poll failed:', e);
    }
}

// ============================================================
// 操作
// ============================================================
function handleBack() {
    _stopPolling();
    emit('back');
}

function handleLogClick(log: any) {
    const sessionId = getLogSessionId(log);
    if (sessionId) {
        emit('switch-to-chat', {
            task: currentTask.value,
            sessionId,
            logId: log.fire_instance_id ?? log.LogId,
        });
    }
}

async function handlePause() {
    const timerId = currentTask.value ? getTimerId(currentTask.value) : '';
    if (!timerId) return;
    actionLoading.value = true;
    try {
        await pauseTimerTask({ SpaceId: props.spaceId, TimerId: timerId }, props.applicationId);
        MessagePlugin.success(i18n.value.pauseSuccess);
        await fetchTaskDetail(timerId);
        emit('action-done', 'pause', currentTask.value);
    } catch (e) {
        console.error('[CronTaskDetail] pause failed:', e);
        MessagePlugin.error(i18n.value.pauseFailed);
    } finally {
        actionLoading.value = false;
    }
}

async function handleResume() {
    const timerId = currentTask.value ? getTimerId(currentTask.value) : '';
    if (!timerId) return;
    actionLoading.value = true;
    try {
        await resumeTimerTask({ SpaceId: props.spaceId, TimerId: timerId }, props.applicationId);
        MessagePlugin.success(i18n.value.resumeSuccess);
        await fetchTaskDetail(timerId);
        emit('action-done', 'resume', currentTask.value);
    } catch (e) {
        console.error('[CronTaskDetail] resume failed:', e);
        MessagePlugin.error(i18n.value.resumeFailed);
    } finally {
        actionLoading.value = false;
    }
}

function handleEdit() {
    editingTask.value = currentTask.value;
    editDialogVisible.value = true;
}

function handleEditSuccess() {
    editDialogVisible.value = false;
    editingTask.value = null;
    const timerId = currentTask.value ? getTimerId(currentTask.value) : '';
    if (timerId) fetchTaskDetail(timerId);
    emit('action-done', 'edit', currentTask.value);
}

function handleDelete() {
    deleteDialogVisible.value = true;
}

function handleDeleteSuccess() {
    _stopPolling();
    emit('action-done', 'delete', currentTask.value);
    handleBack();
}

async function handleRunNow() {
    const timerId = currentTask.value ? getTimerId(currentTask.value) : '';
    if (!timerId) return;
    actionLoading.value = true;
    try {
        await runTimerTaskNow({ SpaceId: props.spaceId, TimerId: timerId }, props.applicationId);
        MessagePlugin.success(i18n.value.runNowSuccess);
        await _pollRefreshLogs();
        _startPolling();
        emit('action-done', 'run', currentTask.value);
    } catch (e) {
        console.error('[CronTaskDetail] run failed:', e);
        MessagePlugin.error(i18n.value.runNowFailed);
    } finally {
        actionLoading.value = false;
    }
}

// ============================================================
// 生命周期
// ============================================================
watch(
    () => props.task,
    (val) => {
        if (val) {
            const id = getTimerId(val);
            if (id) {
                fetchTaskDetail(id);
                fetchRunLogs(id);
            }
        } else {
            _stopPolling();
        }
    },
    { immediate: true },
);

onBeforeUnmount(() => {
    _stopPolling();
});
</script>

<style scoped>
.cron-task-detail {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--td-bg-color-container, #fff);
}

.cron-task-detail__header {
    display: flex;
    align-items: center;
    padding: var(--td-size-6) var(--td-size-7);
    border-bottom: 1px solid var(--td-component-border, rgba(18, 42, 79, 0.08));
    flex-shrink: 0;
}

.cron-task-detail__back {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: var(--td-radius-small);
    cursor: pointer;
    margin-right: var(--td-size-4);
    transition: background-color 0.2s ease;
}

.cron-task-detail__back:hover {
    background: var(--td-bg-color-container-hover, rgba(36, 56, 97, 0.05));
}

.cron-task-detail__title {
    font-size: var(--td-font-size-body-large);
    font-weight: 600;
    line-height: var(--td-line-height-body-large);
    color: var(--td-text-color-primary);
    max-width: 70%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.cron-task-detail__body {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: var(--td-size-7) var(--td-size-8);
}

.cron-task-detail__section {
    flex-shrink: 0;
    margin-bottom: var(--td-size-8);
}

.cron-task-detail__section-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--td-text-color-primary);
    margin-bottom: var(--td-size-5);
}

.cron-task-detail__section-content {
    font-size: var(--td-font-size-body-medium);
    color: var(--td-text-color-secondary);
    line-height: 1.8;
    background: var(--td-bg-color-container-hover, rgba(36, 56, 97, 0.03));
    border-radius: var(--td-radius-medium);
    padding: var(--td-size-5) var(--td-size-6);
    max-height: 156px;
    overflow-y: auto;
}

.cron-task-detail__desc {
    white-space: pre-wrap;
    word-break: break-word;
}

.cron-task-detail__schedule {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--td-size-8);
    font-size: 13px;
    flex-wrap: wrap;
    gap: var(--td-size-5);
}

.cron-task-detail__schedule-left {
    display: flex;
    align-items: center;
    gap: var(--td-size-4);
}

.cron-task-detail__actions {
    display: flex;
    align-items: center;
    gap: var(--td-size-2);
    flex-shrink: 0;
}

.cron-task-detail__status {
    display: flex;
    align-items: center;
    color: var(--td-text-color-placeholder);
}

.cron-task-detail__status-dot {
    width: 8px;
    height: 8px;
    border-radius: var(--td-radius-circle);
    margin-right: var(--td-size-2);
    background: rgba(1, 11, 50, 0.25);
    flex-shrink: 0;
}

.cron-task-detail__status--active .cron-task-detail__status-dot {
    background: var(--td-success-color, #0fb87f);
}

.cron-task-detail__status--paused .cron-task-detail__status-dot {
    background: var(--td-warning-color, #ff8345);
}

.cron-task-detail__status--stopped .cron-task-detail__status-dot {
    background: rgba(1, 11, 50, 0.25);
}

.cron-task-detail__schedule-text {
    color: var(--td-text-color-placeholder);
}

.cron-task-detail__section--logs {
    display: flex;
    flex-direction: column;
    min-height: 0;
    flex: 1;
    margin-bottom: 0;
}

.cron-task-detail__log-list {
    position: relative;
    border-radius: var(--td-radius-default);
    overflow-y: auto;
    flex: 1;
    min-height: 0;
}

.cron-task-detail__log-item {
    position: relative;
    padding: var(--td-size-6) var(--td-size-4);
    border-bottom: 1px solid var(--td-component-border, rgba(18, 42, 79, 0.08));
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.cron-task-detail__log-item:last-child {
    border-bottom: 0;
}

.cron-task-detail__log-item:hover {
    background: var(--td-bg-color-container-hover, rgba(36, 56, 97, 0.05));
}

.cron-task-detail__log-header {
    display: flex;
    align-items: center;
    margin-bottom: var(--td-size-2);
}

.cron-task-detail__log-time {
    font-size: var(--td-font-size-body-small);
    font-weight: 500;
    color: var(--td-text-color-secondary);
    margin-right: var(--td-size-4);
}

.cron-task-detail__log-status {
    font-size: var(--td-font-size-body-small);
    color: var(--td-text-color-placeholder);
}

.cron-task-detail__log-status--success {
    color: var(--td-success-color, #0fb87f);
}

.cron-task-detail__log-status--failed {
    color: var(--td-error-color, #e54545);
}

.cron-task-detail__log-status--running {
    color: var(--td-brand-color, #0052d9);
}

.cron-task-detail__log-content {
    font-size: 13px;
    color: var(--td-text-color-placeholder);
    line-height: var(--td-line-height-body-small);
    word-break: break-word;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.cron-task-detail__log-dot {
    width: 8px;
    height: 8px;
    border-radius: var(--td-radius-circle);
    background: var(--td-error-color, #f75559);
    margin-left: auto;
    flex-shrink: 0;
}

.cron-task-detail__log-empty,
.cron-task-detail__log-tip {
    padding: var(--td-size-5) 0;
    text-align: center;
    font-size: var(--td-font-size-body-small);
    color: var(--td-text-color-placeholder);
}

.cron-task-detail__placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--td-text-color-placeholder);
    font-size: var(--td-font-size-body-medium);
}
</style>
