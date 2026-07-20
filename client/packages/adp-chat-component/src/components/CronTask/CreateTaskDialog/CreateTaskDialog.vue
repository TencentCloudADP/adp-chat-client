<template>
    <t-dialog
        v-model:visible="innerVisible"
        :header="dialogTitle"
        :close-on-overlay-click="true"
        :close-on-esc-keydown="!confirmLoading && !detailLoading"
        :footer="false"
        width="640px"
        class="cron-create-task-dialog"
        @close="handleClose"
    >
        <div class="cron-create-task-dialog__body">
            <!-- 任务名称 -->
            <div class="cron-create-task-dialog__form-item">
                <div class="cron-create-task-dialog__label">
                    {{ i18n.taskNameLabel }}
                    <span class="cron-create-task-dialog__required">*</span>
                </div>
                <t-input
                    v-model="taskName"
                    :placeholder="i18n.taskNamePlaceholder"
                    :maxlength="50"
                />
            </div>

            <!-- 提示词 -->
            <div class="cron-create-task-dialog__form-item">
                <PromptInput
                    ref="promptInputRef"
                    v-model="promptValue"
                    :max-length="10000"
                    :disable-folder="isEdit"
                    :language="language"
                    :i18n="i18n"
                    :model-options="modelOptions"
                    :folder-options="folderOptions"
                    @model-change="handleModelChange"
                    @folder-change="handleFolderChange"
                />
            </div>

            <!-- 执行频率 -->
            <div class="cron-create-task-dialog__form-item">
                <FrequencySelector
                    ref="frequencySelectorRef"
                    :language="language"
                    :i18n="i18n"
                />
            </div>

            <!-- 推送渠道 -->
            <div class="cron-create-task-dialog__form-item">
                <PushChannel
                    ref="pushChannelRef"
                    :language="language"
                    :i18n="i18n"
                    @change="scrollBodyToBottom"
                />
            </div>

            <!-- 编辑模式：详情加载遮罩 -->
            <div v-if="detailLoading" class="cron-create-task-dialog__loading-mask">
                <t-loading size="small" />
            </div>
        </div>

        <div class="cron-create-task-dialog__footer">
            <t-button theme="default" :disabled="confirmLoading" @click="handleClose">
                {{ i18n.cancel }}
            </t-button>
            <t-button
                theme="primary"
                :loading="confirmLoading"
                :disabled="detailLoading"
                @click="handleConfirm"
            >
                {{ i18n.confirm }}
            </t-button>
        </div>
    </t-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import {
    Dialog as TDialog,
    Input as TInput,
    Button as TButton,
    Loading as TLoading,
    MessagePlugin,
} from 'tdesign-vue-next';
import PromptInput from './PromptInput.vue';
import FrequencySelector from './FrequencySelector.vue';
import PushChannel from './PushChannel.vue';
import type { CronTaskI18n, TimerTask, TimerTaskSummary } from '../../../model/cronTask';
import {
    TimerCreateSource,
    TimerScheduleType,
    TimerPushChannel,
    getCronTaskI18nByLanguage,
} from '../../../model/cronTask';
import {
    createTimerTask,
    modifyTimerTask,
    describeTimerTask,
} from '../../../service/cronTaskApi';
import { getTimerId } from '../../../utils/cronTask';

interface Option { label: string; value: string }

interface Props {
    visible: boolean;
    editingTask?: TimerTaskSummary | TimerTask | null;
    applicationId: string;
    spaceId?: string;
    language?: string;
    i18n?: Partial<CronTaskI18n>;
    modelOptions?: Option[];
    folderOptions?: Option[];
}

const props = withDefaults(defineProps<Props>(), {
    visible: false,
    editingTask: null,
    spaceId: '',
    language: 'zh-CN',
    i18n: () => ({}),
    modelOptions: () => [],
    folderOptions: () => [],
});

const emit = defineEmits<{
    (e: 'update:visible', v: boolean): void;
    (e: 'success', payload: { isEdit: boolean }): void;
    (e: 'close'): void;
}>();

const i18n = computed<Required<CronTaskI18n>>(() => ({
    ...getCronTaskI18nByLanguage(props.language),
    ...props.i18n,
}));

const isEdit = computed(() => !!props.editingTask);
const dialogTitle = computed(() => (isEdit.value ? i18n.value.dialogTitleEdit : i18n.value.dialogTitleCreate));

// ============================================================
// 状态
// ============================================================
const innerVisible = computed({
    get: () => props.visible,
    set: (v) => emit('update:visible', v),
});

const taskName = ref('');
const promptValue = ref('');
const selectedModel = ref<string>('');
const selectedFolder = ref<string>('');
const confirmLoading = ref(false);
const detailLoading = ref(false);

const promptInputRef = ref<InstanceType<typeof PromptInput> | null>(null);
const frequencySelectorRef = ref<InstanceType<typeof FrequencySelector> | null>(null);
const pushChannelRef = ref<InstanceType<typeof PushChannel> | null>(null);

// ============================================================
// 交互
// ============================================================
function handleModelChange(model: string) {
    selectedModel.value = model;
}

function handleFolderChange(folder: string) {
    selectedFolder.value = folder;
}

function scrollBodyToBottom() {
    nextTick(() => {
        const body = document.querySelector('.cron-create-task-dialog__body');
        if (body) body.scrollTo({ top: (body as HTMLElement).scrollHeight, behavior: 'smooth' });
    });
}

// 等待子组件 ref 就绪（dialog 打开瞬间子树尚在挂载）
function _waitChildrenReady(maxTries = 20): Promise<boolean> {
    return new Promise((resolve) => {
        let tries = 0;
        const check = () => {
            const ready = promptInputRef.value && frequencySelectorRef.value && pushChannelRef.value;
            if (ready || tries >= maxTries) {
                resolve(!!ready);
                return;
            }
            tries += 1;
            nextTick(() => setTimeout(check, 16));
        };
        check();
    });
}

// ============================================================
// 组装 & 提交
// ============================================================

/** 从 cron 表达式解析出 TimeOfDay */
function _cronToTimeOfDay(cron: string): { Hour: number; Minute: number } {
    const parts = (cron || '').trim().split(/\s+/);
    if (parts.length >= 2) {
        return { Hour: Number(parts[1]) || 0, Minute: Number(parts[0]) || 0 };
    }
    return { Hour: 9, Minute: 0 };
}

function _buildSchedule(freq: ReturnType<NonNullable<typeof frequencySelectorRef.value>['getFormData']>) {
    const schedule: Record<string, any> = {
        Timezone: freq.timezone || 'Asia/Shanghai',
    };
    switch (freq.type) {
        case 'daily':
            schedule.ScheduleType = TimerScheduleType.DAILY;
            schedule.Daily = { TimeOfDay: _cronToTimeOfDay(freq.cron || '') };
            break;
        case 'weekly':
            schedule.ScheduleType = TimerScheduleType.WEEKLY;
            schedule.Weekly = {
                Times: (freq.weekDays || []).map((day) => ({
                    // proto 1..7 表示周一..周日
                    Weekday: day === 0 ? 7 : day,
                    TimeOfDay: _cronToTimeOfDay(freq.cron || ''),
                })),
            };
            break;
        case 'interval':
            schedule.ScheduleType = TimerScheduleType.INTERVAL;
            schedule.Interval = {
                Value: freq.intervalValue || 1,
                // 1 = HOUR
                Unit: 1,
                StartAt:
                    freq.startDate && freq.startTime ? `${freq.startDate}T${freq.startTime}:00` : '',
            };
            break;
        case 'once':
            schedule.ScheduleType = TimerScheduleType.ONCE;
            schedule.Once = {
                FireTime: freq.date && freq.time ? `${freq.date}T${freq.time}:00` : '',
            };
            break;
        case 'cron':
            schedule.ScheduleType = TimerScheduleType.CRON;
            schedule.Cron = { Expression: freq.cron || '' };
            break;
        default:
            schedule.ScheduleType = TimerScheduleType.DAILY;
            schedule.Daily = { TimeOfDay: { Hour: 9, Minute: 0 } };
    }
    return schedule;
}

function _buildPushConfig(pushData: { channel: number; webhookUrl: string }) {
    const config: Record<string, any> = { PushChannel: pushData.channel || TimerPushChannel.NONE };
    if (pushData.channel === TimerPushChannel.WECOM_BOT) {
        config.WecomBot = { WebhookUrl: pushData.webhookUrl || '' };
    }
    return config;
}

async function handleConfirm() {
    if (confirmLoading.value) return;

    if (!taskName.value || !taskName.value.trim()) {
        MessagePlugin.warning(i18n.value.taskNamePlaceholder);
        return;
    }
    if (taskName.value.trim().length > 50) {
        MessagePlugin.warning(i18n.value.taskNamePlaceholder);
        return;
    }

    if (!promptInputRef.value) return;
    const promptResult = promptInputRef.value.validate();
    if (!promptResult.valid) {
        MessagePlugin.warning(promptResult.message || i18n.value.promptPlaceholder);
        return;
    }

    if (!frequencySelectorRef.value) return;
    const freqResult = frequencySelectorRef.value.validate();
    if (!freqResult.valid) {
        MessagePlugin.warning(freqResult.message || i18n.value.frequencyLabel);
        return;
    }

    if (!pushChannelRef.value) return;
    const pushResult = pushChannelRef.value.validate();
    if (!pushResult.valid) {
        MessagePlugin.warning(pushResult.message || i18n.value.pushLabel);
        return;
    }

    const promptData = promptInputRef.value.getFormData();
    const freqData = frequencySelectorRef.value.getFormData();
    const pushData = pushChannelRef.value.getFormData();

    const profile: Record<string, any> = {
        TaskName: taskName.value.trim(),
        PromptContent: promptData.prompt,
        CreateSource: TimerCreateSource.MANUAL,
        ModelName: promptData.modelId || '',
        ConversationId: promptData.workspaceId || '',
    };
    const config: Record<string, any> = {
        Schedule: _buildSchedule(freqData),
        Push: _buildPushConfig(pushData),
    };

    confirmLoading.value = true;
    try {
        if (isEdit.value) {
            const timerId = getTimerId(props.editingTask || {});
            if (!timerId) throw new Error('missing timer id');
            await modifyTimerTask(
                {
                    SpaceId: props.spaceId,
                    TimerId: timerId,
                    Profile: profile,
                    Config: config,
                    UpdateMask: {
                        Paths: [
                            'profile.task_name',
                            'profile.prompt_content',
                            'profile.model_name',
                            'profile.conversation_id',
                            'config.schedule',
                            'config.push',
                        ],
                    },
                },
                props.applicationId,
            );
            MessagePlugin.success(i18n.value.updateSuccess);
        } else {
            await createTimerTask(
                {
                    SpaceId: props.spaceId,
                    Profile: profile as any,
                    Config: config as any,
                },
                props.applicationId,
            );
            MessagePlugin.success(i18n.value.createSuccess);
        }
        emit('success', { isEdit: isEdit.value });
        handleClose();
    } catch (e) {
        console.error('[CreateTaskDialog] submit failed:', e);
        MessagePlugin.error(isEdit.value ? i18n.value.updateFailed : i18n.value.createFailed);
    } finally {
        confirmLoading.value = false;
    }
}

function handleClose() {
    innerVisible.value = false;
    emit('close');
}

// ============================================================
// 表单重置 / 回填
// ============================================================

async function resetForm() {
    taskName.value = '';
    promptValue.value = '';
    selectedModel.value = '';
    selectedFolder.value = '';
    await _waitChildrenReady();
    promptInputRef.value?.resetForm();
    frequencySelectorRef.value?.resetForm();
    pushChannelRef.value?.resetForm();
}

async function fillFormWithTask(task: TimerTaskSummary | TimerTask) {
    const timerId = getTimerId(task);
    if (!timerId) return;

    await resetForm();
    detailLoading.value = true;
    try {
        const detail: any = await describeTimerTask(
            { SpaceId: props.spaceId, TimerId: timerId },
            props.applicationId,
        );

        const profile = detail?.profile || detail?.Profile || {};
        const config = detail?.config || detail?.Config || {};

        taskName.value = profile.task_name ?? profile.TaskName ?? '';
        const promptText = profile.prompt_content ?? profile.PromptContent ?? profile.prompt ?? profile.Prompt ?? '';
        const modelId = profile.model_name ?? profile.ModelName ?? profile.model_id ?? profile.ModelId ?? '';
        const workspaceId =
            profile.conversation_id ?? profile.ConversationId ?? profile.workspace_id ?? profile.WorkspaceId ?? '';
        const schedule = config.schedule ?? config.Schedule ?? null;
        const pushConfig = config.push ?? config.Push ?? config.push_config ?? config.PushConfig ?? null;

        promptValue.value = promptText;

        await _waitChildrenReady();
        promptInputRef.value?.setFormData({
            prompt: promptText,
            modelId,
            workspaceId,
        });
        if (schedule) frequencySelectorRef.value?.setFormData(schedule);
        if (pushConfig) pushChannelRef.value?.setFormData(pushConfig);
    } catch (e) {
        console.error('[CreateTaskDialog] fillFormWithTask failed:', e);
        MessagePlugin.error(i18n.value.loadFailed);
    } finally {
        detailLoading.value = false;
    }
}

// visible 变化时初始化表单
watch(
    () => props.visible,
    (val) => {
        if (!val) return;
        if (isEdit.value && props.editingTask) {
            fillFormWithTask(props.editingTask);
        } else {
            resetForm();
        }
    },
);

defineExpose({ resetForm, fillFormWithTask });
</script>

<style scoped>
.cron-create-task-dialog__body {
    padding: 0 var(--td-size-2) var(--td-size-2);
    max-height: min(450px, calc(100vh - 240px));
    overflow-y: auto;
    position: relative;
}

.cron-create-task-dialog__form-item {
    margin-bottom: var(--td-size-7);
}

.cron-create-task-dialog__form-item:last-child {
    margin-bottom: 0;
}

.cron-create-task-dialog__label {
    font-size: var(--td-font-size-body-medium);
    font-weight: 500;
    color: var(--td-text-color-primary);
    line-height: var(--td-line-height-body-medium);
    margin-bottom: var(--td-size-4);
}

.cron-create-task-dialog__required {
    color: var(--td-error-color, #e54545);
    margin-left: var(--td-size-1);
}

.cron-create-task-dialog__loading-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.7);
    z-index: 10;
}

.cron-create-task-dialog__footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--td-size-4);
    padding-top: 12px;
    border-top: 1px solid var(--td-component-border, rgba(0, 0, 0, 0.08));
    margin-top: var(--td-size-5);
}
</style>
