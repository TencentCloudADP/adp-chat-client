<template>
    <div class="cron-prompt-input">
        <div class="cron-prompt-input__label">
            {{ i18n.promptLabel }}
            <span class="cron-prompt-input__required">*</span>
        </div>

        <t-textarea
            v-model="innerValue"
            :placeholder="i18n.promptPlaceholder"
            :maxlength="maxLength"
            :autosize="{ minRows: 4, maxRows: 10 }"
        />

        <div class="cron-prompt-input__extra">
            <div v-if="modelOptions.length > 0" class="cron-prompt-input__field">
                <span class="cron-prompt-input__field-label">{{ i18n.modelLabel }}</span>
                <t-select
                    v-model="modelId"
                    :options="modelOptions"
                    :placeholder="i18n.modelLabel"
                    filterable
                    clearable
                    size="small"
                    class="cron-prompt-input__select"
                />
            </div>
            <div v-if="folderOptions.length > 0" class="cron-prompt-input__field">
                <span class="cron-prompt-input__field-label">{{ i18n.conversationLabel }}</span>
                <t-select
                    v-model="workspaceId"
                    :options="folderOptions"
                    :placeholder="i18n.conversationPlaceholder"
                    :disabled="disableFolder"
                    filterable
                    clearable
                    size="small"
                    class="cron-prompt-input__select"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Textarea as TTextarea, Select as TSelect } from 'tdesign-vue-next';
import type { CronTaskI18n } from '../../../model/cronTask';
import { getCronTaskI18nByLanguage } from '../../../model/cronTask';

interface Option { label: string; value: string }

interface Props {
    modelValue: string;
    maxLength?: number;
    disableFolder?: boolean;
    modelOptions?: Option[];
    folderOptions?: Option[];
    language?: string;
    i18n?: Partial<CronTaskI18n>;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    maxLength: 10000,
    disableFolder: false,
    modelOptions: () => [],
    folderOptions: () => [],
    language: 'zh-CN',
    i18n: () => ({}),
});

const emit = defineEmits<{
    (e: 'update:modelValue', val: string): void;
    (e: 'model-change', val: string): void;
    (e: 'folder-change', val: string): void;
}>();

const i18n = computed<Required<CronTaskI18n>>(() => ({
    ...getCronTaskI18nByLanguage(props.language),
    ...props.i18n,
}));

const innerValue = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});

const modelId = ref<string>('');
const workspaceId = ref<string>('');

watch(modelId, (val) => emit('model-change', val));
watch(workspaceId, (val) => emit('folder-change', val));

/** 表单校验 */
function validate(): { valid: boolean; message?: string } {
    if (!innerValue.value || !innerValue.value.trim()) {
        return { valid: false, message: i18n.value.promptPlaceholder };
    }
    return { valid: true };
}

/** 获取表单数据 */
function getFormData() {
    return {
        prompt: innerValue.value?.trim() || '',
        modelId: modelId.value || '',
        workspaceId: workspaceId.value || '',
    };
}

/** 设置表单数据（编辑回填） */
function setFormData(data: { prompt?: string; modelId?: string; workspaceId?: string }) {
    if (data.prompt !== undefined) emit('update:modelValue', data.prompt || '');
    if (data.modelId !== undefined) modelId.value = data.modelId || '';
    if (data.workspaceId !== undefined) workspaceId.value = data.workspaceId || '';
}

/** 重置表单 */
function resetForm() {
    emit('update:modelValue', '');
    modelId.value = '';
    workspaceId.value = '';
}

defineExpose({ validate, getFormData, setFormData, resetForm });
</script>

<style scoped>
.cron-prompt-input {
    display: flex;
    flex-direction: column;
    gap: var(--td-size-4);
}

.cron-prompt-input__label {
    font-size: var(--td-font-size-body-medium);
    font-weight: 500;
    color: var(--td-text-color-primary);
    line-height: var(--td-line-height-body-medium);
}

.cron-prompt-input__required {
    color: var(--td-error-color, #e54545);
    margin-left: var(--td-size-1);
}

.cron-prompt-input__extra {
    display: flex;
    gap: var(--td-size-5);
    flex-wrap: wrap;
}

.cron-prompt-input__field {
    display: flex;
    align-items: center;
    gap: var(--td-size-3);
    flex: 1;
    min-width: 200px;
}

.cron-prompt-input__field-label {
    font-size: var(--td-font-size-body-small);
    color: var(--td-text-color-secondary);
    flex-shrink: 0;
}

.cron-prompt-input__select {
    flex: 1;
    min-width: 0;
}
</style>
