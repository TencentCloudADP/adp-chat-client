<template>
    <div class="cron-task-card" @click="onCardClick">
        <!-- 顶部：标题 + 状态 -->
        <div class="card-header">
            <span class="card-title" :title="taskName">{{ taskName }}</span>
            <span class="card-status" :class="`card-status--${statusClass}`">
                <span class="status-dot" />
                {{ statusText }}
            </span>
        </div>

        <!-- 中间：策略摘要 + 成功/失败次数 -->
        <div class="card-tags">
            <t-tooltip :content="scheduleText" placement="top">
                <span class="card-tags__time">
                    <CustomizedIcon
                        remote
                        name="basic_time_line"
                        size="xxs"
                        :show-hover-bg="false"
                        :theme="theme"
                    />
                    <span class="card-tags__time-text">{{ scheduleText }}</span>
                </span>
            </t-tooltip>
            <span v-if="successCount > 0" class="card-tags__count card-tags__count--success">
                <CustomizedIcon
                    remote
                    name="basic_finish_line"
                    size="xxs"
                    :show-hover-bg="false"
                    :theme="theme"
                />
                {{ successCount }}
            </span>
            <span v-if="failureCount > 0" class="card-tags__count card-tags__count--fail">
                <CustomizedIcon
                    remote
                    name="basic_close_line"
                    size="xxs"
                    :show-hover-bg="false"
                    :theme="theme"
                />
                {{ failureCount }}
            </span>
        </div>

        <!-- 底部：操作按钮 -->
        <div class="card-actions">
            <t-tooltip v-if="taskStatus === TimerTaskStatus.ACTIVE" :content="i18n.pause" placement="top">
                <t-button
                    size="small"
                    variant="text"
                    shape="square"
                    :disabled="actionLoading"
                    @click.stop="emit('pause', task)"
                >
                    <CustomizedIcon
                        remote
                        name="basic_pause_line"
                        size="xs"
                        :show-hover-bg="false"
                        :theme="theme"
                    />
                </t-button>
            </t-tooltip>
            <t-tooltip v-else-if="taskStatus === TimerTaskStatus.PAUSED" :content="i18n.resume" placement="top">
                <t-button
                    size="small"
                    variant="text"
                    shape="square"
                    :disabled="actionLoading"
                    @click.stop="emit('resume', task)"
                >
                    <CustomizedIcon
                        remote
                        name="basic_play_round_line"
                        size="xs"
                        :show-hover-bg="false"
                        :theme="theme"
                    />
                </t-button>
            </t-tooltip>
            <t-tooltip :content="i18n.edit" placement="top">
                <t-button
                    size="small"
                    variant="text"
                    shape="square"
                    :disabled="actionLoading"
                    @click.stop="emit('edit', task)"
                >
                    <CustomizedIcon
                        remote
                        name="basic_edit_line"
                        size="xs"
                        :show-hover-bg="false"
                        :theme="theme"
                    />
                </t-button>
            </t-tooltip>
            <t-tooltip :content="i18n.del" placement="top">
                <t-button
                    size="small"
                    variant="text"
                    shape="square"
                    :disabled="actionLoading"
                    @click.stop="emit('delete', task)"
                >
                    <CustomizedIcon
                        remote
                        name="basic_delete_line"
                        size="xs"
                        :show-hover-bg="false"
                        :theme="theme"
                    />
                </t-button>
            </t-tooltip>
            <t-button
                size="small"
                theme="primary"
                variant="outline"
                :disabled="actionLoading"
                :loading="actionLoading"
                @click.stop="emit('run', task)"
            >
                <template #icon>
                    <CustomizedIcon
                        remote
                        name="basic_play_line"
                        size="xxs"
                        :show-hover-bg="false"
                        :theme="theme"
                    />
                </template>
                {{ i18n.runNow }}
            </t-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
    Button as TButton,
    Tooltip as TTooltip,
} from 'tdesign-vue-next';
import CustomizedIcon from '../CustomizedIcon.vue';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
import type { CronTaskI18n, TimerTaskSummary, TimerTask } from '../../model/cronTask';
import { TimerTaskStatus, getCronTaskI18nByLanguage } from '../../model/cronTask';
import {
    getTaskName,
    getPolicySummary,
    getTaskStatus,
    getSuccessCount,
    getFailureCount,
} from '../../utils/cronTask';

interface Props extends ThemeProps {
    /** 任务数据（Summary 或 完整 Task） */
    task: TimerTaskSummary | TimerTask | Record<string, any>;
    /** 是否处于操作 loading 态 */
    actionLoading?: boolean;
    /** i18n 覆盖 */
    i18n?: Partial<CronTaskI18n>;
    /** 语言 */
    language?: string;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    actionLoading: false,
    i18n: () => ({}),
    language: 'zh-CN',
});

const emit = defineEmits<{
    (e: 'click', task: Props['task']): void;
    (e: 'pause', task: Props['task']): void;
    (e: 'resume', task: Props['task']): void;
    (e: 'edit', task: Props['task']): void;
    (e: 'delete', task: Props['task']): void;
    (e: 'run', task: Props['task']): void;
}>();

const i18n = computed<Required<CronTaskI18n>>(() => ({
    ...getCronTaskI18nByLanguage(props.language),
    ...props.i18n,
}));

const taskName = computed(() => getTaskName(props.task));
const taskStatus = computed(() => getTaskStatus(props.task));
const successCount = computed(() => getSuccessCount(props.task));
const failureCount = computed(() => getFailureCount(props.task));

const scheduleText = computed(() => getPolicySummary(props.task) || '-');

const statusClass = computed(() => {
    switch (taskStatus.value) {
        case TimerTaskStatus.ACTIVE:
            return 'active';
        case TimerTaskStatus.PAUSED:
            return 'paused';
        case TimerTaskStatus.COMPLETED:
            return 'stopped';
        default:
            return 'stopped';
    }
});

const statusText = computed(() => {
    switch (taskStatus.value) {
        case TimerTaskStatus.ACTIVE:
            return i18n.value.running;
        case TimerTaskStatus.PAUSED:
            return i18n.value.paused;
        case TimerTaskStatus.COMPLETED:
            return i18n.value.completed;
        default:
            return '';
    }
});

function onCardClick() {
    emit('click', props.task);
}
</script>

<style scoped>
.cron-task-card {
    display: flex;
    flex-direction: column;
    height: 120px;
    padding: var(--td-size-6);
    background: var(--td-bg-color-container, #fff);
    border: 1px solid var(--td-border-level-2-color, rgba(17, 32, 70, 0.13));
    border-radius: var(--td-radius-medium, 6px);
    cursor: pointer;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
    box-sizing: border-box;
}

.cron-task-card:hover {
    border-color: var(--td-border-level-3-color, rgba(17, 32, 70, 0.2));
    box-shadow: 0 2px 8px rgba(18, 19, 25, 0.08), 0 0 1px rgba(18, 19, 25, 0.08);
}

/* 顶部 */
.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 24px;
}

.card-title {
    flex: 1;
    min-width: 0;
    font-size: var(--td-font-size-body-large);
    font-weight: 500;
    line-height: var(--td-line-height-body-large);
    color: var(--td-text-color-primary, rgba(0, 1, 10, 0.93));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card-status {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    margin-left: var(--td-size-5);
    font-size: 13px;
    line-height: var(--td-line-height-body-small);
    color: var(--td-text-color-secondary, rgba(1, 11, 50, 0.41));
}

.card-status .status-dot {
    width: 8px;
    height: 8px;
    margin-right: var(--td-size-2);
    border-radius: var(--td-radius-circle);
    background: rgba(1, 11, 50, 0.25);
}

.card-status--active .status-dot {
    background: var(--td-success-color, #0fb87f);
}

.card-status--paused .status-dot {
    background: var(--td-warning-color, #ff8345);
}

.card-status--stopped .status-dot {
    background: rgba(1, 11, 50, 0.25);
}

/* 标签行 */
.card-tags {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: var(--td-size-3);
    margin-top: 4px;
    overflow: hidden;
}

.card-tags__time {
    flex: 1 1 auto;
    min-width: 0;
    display: inline-flex;
    align-items: center;
    gap: var(--td-size-2);
    padding: 2px 8px;
    background: var(--td-bg-color-component, rgba(0, 0, 0, 0.04));
    color: var(--td-text-color-secondary, rgba(1, 11, 50, 0.6));
    border-radius: var(--td-radius-default, 4px);
    font-size: var(--td-font-size-body-small);
    line-height: 18px;
    overflow: hidden;
}

.card-tags__time-text {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.card-tags__count {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: var(--td-size-1);
    padding: 2px 8px;
    border-radius: var(--td-radius-default, 4px);
    font-size: var(--td-font-size-body-small);
    line-height: 18px;
}

.card-tags__count--success {
    color: var(--td-success-color, #0fb87f);
    background: var(--td-success-color-light, rgba(15, 184, 127, 0.1));
}

.card-tags__count--fail {
    color: var(--td-error-color, #d54941);
    background: var(--td-error-color-light, rgba(213, 73, 65, 0.1));
}

/* 底部操作 */
.card-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--td-size-3);
    margin-top: auto;
}
</style>
