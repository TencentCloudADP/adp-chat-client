<template>
    <div class="cron-push-channel">
        <div class="cron-push-channel__label">{{ i18n.pushLabel }}</div>

        <t-radio-group v-model="channel" @change="onChannelChange">
            <t-radio :value="TimerPushChannel.NONE">{{ i18n.pushNone }}</t-radio>
            <t-radio :value="TimerPushChannel.WECOM_BOT">{{ i18n.pushWecomBot }}</t-radio>
            <t-radio :value="TimerPushChannel.WECHAT">{{ i18n.pushWechat }}</t-radio>
        </t-radio-group>

        <div v-if="channel === TimerPushChannel.WECOM_BOT" class="cron-push-channel__extra">
            <div class="cron-push-channel__field-label">{{ i18n.webhookUrlLabel }}</div>
            <t-input
                v-model="webhookUrl"
                :placeholder="i18n.webhookUrlPlaceholder"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    RadioGroup as TRadioGroup,
    Radio as TRadio,
    Input as TInput,
} from 'tdesign-vue-next';
import type { CronTaskI18n, TimerPushChannelValue } from '../../../model/cronTask';
import { getCronTaskI18nByLanguage, TimerPushChannel } from '../../../model/cronTask';

interface Props {
    language?: string;
    i18n?: Partial<CronTaskI18n>;
}

const props = withDefaults(defineProps<Props>(), {
    language: 'zh-CN',
    i18n: () => ({}),
});

const emit = defineEmits<{
    (e: 'change'): void;
}>();

const i18n = computed<Required<CronTaskI18n>>(() => ({
    ...getCronTaskI18nByLanguage(props.language),
    ...props.i18n,
}));

const channel = ref<TimerPushChannelValue>(TimerPushChannel.NONE);
const webhookUrl = ref<string>('');

function onChannelChange() {
    emit('change');
}

function validate(): { valid: boolean; message?: string } {
    if (channel.value === TimerPushChannel.WECOM_BOT) {
        if (!webhookUrl.value || !webhookUrl.value.trim()) {
            return { valid: false, message: i18n.value.webhookUrlPlaceholder };
        }
        // 简单校验 URL
        try {
            const u = new URL(webhookUrl.value.trim());
            if (!/^https?:$/.test(u.protocol)) {
                return { valid: false, message: i18n.value.webhookUrlPlaceholder };
            }
        } catch {
            return { valid: false, message: i18n.value.webhookUrlPlaceholder };
        }
    }
    return { valid: true };
}

function getFormData() {
    return {
        channel: channel.value,
        webhookUrl: webhookUrl.value?.trim() || '',
    };
}

function setFormData(config: any) {
    if (!config) {
        channel.value = TimerPushChannel.NONE;
        webhookUrl.value = '';
        return;
    }
    const ch = config.channel ?? config.Channel ?? config.push_channel ?? config.PushChannel;
    if (typeof ch === 'number') channel.value = ch as TimerPushChannelValue;
    const wecom = config.wecom_bot || config.WecomBot || {};
    const url = wecom.webhook_url || wecom.WebhookUrl || '';
    webhookUrl.value = url || '';
}

function resetForm() {
    channel.value = TimerPushChannel.NONE;
    webhookUrl.value = '';
}

defineExpose({ validate, getFormData, setFormData, resetForm });
</script>

<style scoped>
.cron-push-channel {
    display: flex;
    flex-direction: column;
    gap: var(--td-size-4);
}

.cron-push-channel__label {
    font-size: var(--td-font-size-body-medium);
    font-weight: 500;
    color: var(--td-text-color-primary);
    line-height: var(--td-line-height-body-medium);
}

.cron-push-channel__extra {
    display: flex;
    flex-direction: column;
    gap: var(--td-size-3);
    margin-top: 4px;
}

.cron-push-channel__field-label {
    font-size: var(--td-font-size-body-small);
    color: var(--td-text-color-secondary);
}
</style>
