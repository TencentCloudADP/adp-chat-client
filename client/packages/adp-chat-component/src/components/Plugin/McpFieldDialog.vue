<template>
    <t-dialog
        v-model:visible="visible"
        :header="mergedI18n.mcpFieldTitle"
        :confirm-btn="null"
        :cancel-btn="null"
        :close-on-overlay-click="false"
        width="min(440px, calc(100vw - 40px))"
    >
        <div class="mcp-field-dialog">
            <!-- <t-form ref="formRef" :data="formData" layout="vertical" label-align="top" @submit="onSubmit"> -->
            <t-form ref="formRef" :data="formData" layout="vertical" label-align="top">
                <template v-if="headers.length > 0">
                    <div class="mcp-field-dialog__section-title">Headers</div>
                    <t-form-item
                        v-for="(item, idx) in headers"
                        :key="`h-${idx}`"
                        :label="item.param_name"
                        :name="`headers_${idx}`"
                        :rules="item.is_required ? [{ required: true, message: mergedI18n.fieldRequired }] : []"
                    >
                        <t-input v-model="item._value" :placeholder="formatPleaseInput(item.param_name)"  />
                    </t-form-item>
                </template>
                <template v-if="query.length > 0">
                    <div class="mcp-field-dialog__section-title">Query</div>
                    <t-form-item
                        v-for="(item, idx) in query"
                        :key="`q-${idx}`"
                        :label="item.param_name"
                        :name="`query_${idx}`"
                        :rules="item.is_required ? [{ required: true, message: mergedI18n.fieldRequired }] : []"
                    >
                        <t-input v-model="item._value" :placeholder="formatPleaseInput(item.param_name)"  />
                    </t-form-item>
                </template>
                <div class="mcp-field-dialog__footer">
                    <t-button theme="primary" type="submit" :loading="submitting" >{{ mergedI18n.confirmAndAdd }}</t-button>
                    <t-button variant="outline"  @click="onCancel">{{ mergedI18n.cancel }}</t-button>
                </div>
            </t-form>
        </div>
    </t-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Dialog as TDialog, Form as TForm, FormItem as TFormItem, Input as TInput, Button as TButton } from 'tdesign-vue-next';
import type { SkillsI18n } from '../../model/skills';
import { defaultSkillsI18n, defaultSkillsI18nEn } from '../../model/skills';

interface FieldItem {
    param_name: string;
    param_value: string;
    is_required?: boolean;
    global_hidden?: boolean;
    input?: Record<string, unknown>;
    _value: string;
}

interface Props {
    modelValue: boolean;
    requiredHeaders?: Array<Record<string, unknown>>;
    requiredQuery?: Array<Record<string, unknown>>;
    /** 国际化文本 */
    i18n?: Partial<SkillsI18n>;
    /** 语言：'en-*' 走英文 */
    language?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    requiredHeaders: () => [],
    requiredQuery: () => [],
    i18n: () => ({}),
    language: '',
});
const emit = defineEmits<{
    (e: 'update:modelValue', v: boolean): void;
    (e: 'confirm', payload: { headers: Array<Record<string, unknown>>; query: Array<Record<string, unknown>> }): void;
    (e: 'cancel'): void;
}>();

const mergedI18n = computed<Required<SkillsI18n>>(() => {
    const defaults = props.language?.startsWith('en') ? defaultSkillsI18nEn : defaultSkillsI18n;
    return { ...defaults, ...props.i18n };
});
function formatPleaseInput(name: string): string {
    return (mergedI18n.value.pleaseInput || '').replace('{name}', name);
}

const visible = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) });
const formRef = ref<InstanceType<typeof TForm> | null>(null);
const submitting = ref(false);
const headers = ref<FieldItem[]>([]);
const query = ref<FieldItem[]>([]);
const formData = ref<Record<string, string>>({});

watch(() => props.modelValue, (val) => {
    if (val) {
        headers.value = (props.requiredHeaders || []).map((h) => ({
            param_name: (h.param_name || h.ParamName || h.Name || h.name || '') as string,
            param_value: (h.param_value || h.ParamValue || h.DefaultValue || '') as string,
            is_required: !!(h.is_required ?? true),
            global_hidden: !!(h.global_hidden || h.GlobalHidden),
            input: (h.input || h.Input || undefined) as Record<string, unknown> | undefined,
            _value: (h.param_value || h.ParamValue || h.DefaultValue || '') as string,
        }));
        query.value = (props.requiredQuery || []).map((q) => ({
            param_name: (q.param_name || q.ParamName || q.Name || q.name || '') as string,
            param_value: (q.param_value || q.ParamValue || q.DefaultValue || '') as string,
            is_required: !!(q.is_required ?? true),
            global_hidden: !!(q.global_hidden || q.GlobalHidden),
            input: (q.input || q.Input || undefined) as Record<string, unknown> | undefined,
            _value: (q.param_value || q.ParamValue || q.DefaultValue || '') as string,
        }));
        const fd: Record<string, string> = {};
        headers.value.forEach((h, i) => { fd[`headers_${i}`] = h._value; });
        query.value.forEach((q, i) => { fd[`query_${i}`] = q._value; });
        formData.value = fd;
    }
});

async function onSubmit({ validateResult }: { validateResult: boolean }) {
    if (!validateResult) return;
    submitting.value = true;
    try {
        const resultHeaders = headers.value.map(h => ({ ...h, param_value: h._value, input: h._value ? { InputType: 1, UserInputValue: { Values: [h._value] } } : h.input }));
        const resultQuery = query.value.map(q => ({ ...q, param_value: q._value, input: q._value ? { InputType: 1, UserInputValue: { Values: [q._value] } } : q.input }));
        emit('confirm', { headers: resultHeaders, query: resultQuery });
        visible.value = false;
    } finally { submitting.value = false; }
}

function onCancel() { emit('cancel'); visible.value = false; }
</script>

<style scoped>
.mcp-field-dialog { max-height: 400px; overflow-y: auto; }
.mcp-field-dialog__section-title { font-size: var(--td-font-size-body-small); font-weight: 500; color: var(--td-text-color-secondary); margin-bottom: var(--td-size-4); margin-top: 4px; }
.mcp-field-dialog__footer { display: flex; gap: var(--td-size-4); justify-content: flex-end; margin-top: var(--td-size-6); padding-top: 12px; border-top: 1px solid var(--td-component-border); }
</style>
