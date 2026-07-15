<template>
    <div class="cron-task-container">
        <CronTaskPanel
            v-if="currentView === 'list'"
            ref="panelRef"
            :application-id="applicationId"
            :space-id="spaceId"
            :theme="theme"
            :language="language"
            :i18n="props.i18n"
            :model-options="modelOptions"
            :folder-options="folderOptions"
            :page-size="pageSize"
            @select-task="handleSelectTask"
            @run-and-view="onRunAndView"
            @optimize-prompt="onOptimizePrompt"
            @refresh="onRefresh"
        />
        <CronTaskDetail
            v-else-if="currentView === 'detail'"
            :task="currentTask"
            :application-id="applicationId"
            :space-id="spaceId"
            :theme="theme"
            :language="language"
            :i18n="props.i18n"
            :model-options="modelOptions"
            :folder-options="folderOptions"
            :poll-interval="pollInterval"
            @back="handleBackToList"
            @switch-to-chat="onSwitchToChat"
            @action-done="onActionDone"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CronTaskPanel from './CronTaskPanel.vue';
import CronTaskDetail from './CronTaskDetail.vue';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
import type {
    CronTaskI18n,
    TimerTask,
    TimerTaskSummary,
} from '../../model/cronTask';

interface Option { label: string; value: string }

interface Props extends ThemeProps {
    /** 应用 ID（/adp 代理必需） */
    applicationId: string;
    /** 空间 ID */
    spaceId?: string;
    /** 语言 */
    language?: string;
    /** i18n 覆盖 */
    i18n?: Partial<CronTaskI18n>;
    /** 模型选项（编辑对话框用） */
    modelOptions?: Option[];
    /** 关联文件夹选项（编辑对话框用） */
    folderOptions?: Option[];
    /** 分页大小 */
    pageSize?: number;
    /** 详情页运行日志轮询间隔（ms） */
    pollInterval?: number;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    spaceId: '',
    language: 'zh-CN',
    i18n: () => ({}),
    modelOptions: () => [],
    folderOptions: () => [],
    pageSize: 20,
    pollInterval: 10 * 1000,
});

const emit = defineEmits<{
    (e: 'run-and-view', task: any): void;
    (e: 'optimize-prompt', content: string): void;
    (e: 'refresh'): void;
    (e: 'switch-to-chat', payload: { task: any; sessionId?: string; logId?: string }): void;
    (e: 'action-done', action: string, task: any): void;
    (e: 'view-change', view: 'list' | 'detail'): void;
}>();

// ============================================================
// 视图切换
// ============================================================
type ViewType = 'list' | 'detail';
const currentView = ref<ViewType>('list');
const currentTask = ref<TimerTaskSummary | TimerTask | null>(null);
const panelRef = ref<InstanceType<typeof CronTaskPanel> | null>(null);

function handleSelectTask(task: TimerTaskSummary | TimerTask) {
    currentTask.value = task;
    currentView.value = 'detail';
    emit('view-change', 'detail');
}

function handleBackToList() {
    currentView.value = 'list';
    currentTask.value = null;
    emit('view-change', 'list');
    // 返回列表时刷新一次，感知详情页可能的变更（暂停/编辑/删除/立即执行）
    panelRef.value?.refreshAfterAction?.();
}

/** 供外部调用：直接进入指定任务详情 */
function showTaskDetail(task: TimerTaskSummary | TimerTask) {
    currentTask.value = task;
    currentView.value = 'detail';
    emit('view-change', 'detail');
}

/** 供外部调用：手动刷新列表 */
function refreshList() {
    return panelRef.value?.fetchList?.();
}

// ============================================================
// 事件透传
// ============================================================
function onRunAndView(task: any) {
    emit('run-and-view', task);
}
function onOptimizePrompt(content: string) {
    emit('optimize-prompt', content);
}
function onRefresh() {
    emit('refresh');
}
function onSwitchToChat(payload: { task: any; sessionId?: string; logId?: string }) {
    emit('switch-to-chat', payload);
}
function onActionDone(action: string, task: any) {
    emit('action-done', action, task);
}

defineExpose({ showTaskDetail, refreshList });
</script>

<style scoped>
.cron-task-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>
