<!--
  企微智能机器人渠道配置弹窗
  @description
    对应 proto ChannelType = 10014（WECOM_ROBOT_WS）
    新建：调用 CreateChannel（scene=1, channel_type=10014, WecomRobot.Websocket）
    重新配置：调用 ModifyChannel（channel_id 已存在时）
    交互对齐 webim 的 wecom-bot-config-dialog
-->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
    Dialog as TDialog,
    Form as TForm,
    FormItem as TFormItem,
    Input as TInput,
    Button as TButton,
    MessagePlugin,
} from 'tdesign-vue-next';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
import {
    type ChannelItem,
    type ChannelSettingsI18n,
    ChannelType,
    defaultChannelSettingsI18n,
    defaultChannelSettingsI18nEn,
} from '../../model/channel';
import { createChannel, modifyChannel } from '../../service/channelApi';

// ============================================================
// Props / Emits
// ============================================================

interface Props extends ThemeProps {
    modelValue: boolean;
    /** 应用 ID */
    applicationId: string;
    /** C 端归属用户 ID */
    userId?: string;
    /** C 端 claw agent 运行态 ID */
    agentId?: string;
    /**
     * 编辑中的渠道数据
     * - 首次配置：null（创建新渠道）
     * - 重新配置：{ channelId, spec }（修改已有渠道）
     */
    editingChannel: ChannelItem | null;
    i18n?: Partial<ChannelSettingsI18n>;
    language?: string;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    modelValue: false,
    applicationId: '',
    userId: '',
    agentId: '',
    editingChannel: null,
    i18n: () => ({}),
    language: 'zh-CN',
});

const emit = defineEmits<{
    (e: 'update:modelValue', val: boolean): void;
    (e: 'submitted'): void;
    (e: 'close'): void;
}>();

// ============================================================
// I18n
// ============================================================

const mergedI18n = computed<Required<ChannelSettingsI18n>>(() => {
    const defaults = props.language?.startsWith('en')
        ? defaultChannelSettingsI18nEn
        : defaultChannelSettingsI18n;
    return { ...defaults, ...props.i18n };
});

// ============================================================
// v-model
// ============================================================

const visible = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v),
});

// ============================================================
// 表单
// ============================================================

const formRef = ref<InstanceType<typeof TForm> | null>(null);

const formData = ref({
    botId: '',
    botSecret: '',
});

const submitting = ref(false);

/** 是否为重新配置模式 */
const isModify = computed(() => {
    return props.editingChannel !== null && props.editingChannel.channelId > 0;
});

/** 对话框标题 */
const dialogTitle = computed(() => {
    return isModify.value ? '重新配置企微智能机器人' : '企微智能机器人渠道配置';
});

// 弹窗打开时初始化表单
watch(() => props.modelValue, (val) => {
    if (val) {
        formData.value = { botId: '', botSecret: '' };
        if (props.editingChannel) {
            // 尝试从已有渠道数据中回填
            const spec = props.editingChannel.spec || {};
            const wecomRobot = (spec as any).WecomRobot || (spec as any).wecom_robot || {};
            const ws = wecomRobot.Websocket || wecomRobot.websocket || {};
            formData.value.botId = (ws.BotId || ws.bot_id || '') as string;
            formData.value.botSecret = (ws.BotSecret || ws.bot_secret || '') as string;
        }
    }
});

// ============================================================
// 提交
// ============================================================

const handleSubmit = async () => {
    const valid = await formRef.value?.validate();
    if (valid !== true && valid !== undefined) return;

    submitting.value = true;
    try {
        const channelConfig = {
            WecomRobot: {
                Websocket: {
                    BotId: formData.value.botId,
                    BotSecret: formData.value.botSecret,
                    BindType: 2, // 填写表单绑定（对齐 webim）
                },
            },
        };

        if (isModify.value) {
            // 重新配置：调用 ModifyChannel
            await modifyChannel(
                {
                    applicationId: props.applicationId,
                    channelId: props.editingChannel!.channelId,
                    channelType: ChannelType.WECOM_ROBOT_WS,
                    channelName: '企微智能机器人',
                    channelConfig,
                    userAgent: {
                        userId: props.userId || '',
                        agentId: props.agentId || '',
                    },
                },
            );
            MessagePlugin.success('重新配置成功');
        } else {
            // 首次配置：调用 CreateChannel
            await createChannel(
                {
                    applicationId: props.applicationId,
                    channelType: ChannelType.WECOM_ROBOT_WS,
                    channelName: '企微智能机器人',
                    channelConfig,
                    userAgent: {
                        userId: props.userId || '',
                        agentId: props.agentId || '',
                    },
                },
            );
            MessagePlugin.success('渠道创建成功');
        }

        emit('submitted');
        visible.value = false;
    } catch (err: any) {
        MessagePlugin.error(err?.message || '配置失败');
    } finally {
        submitting.value = false;
    }
};

const handleClose = () => {
    emit('close');
};

// 表单校验规则
const rules = {
    botId: [{ required: true, message: '请输入 Bot ID', trigger: 'blur' }],
    botSecret: [{ required: true, message: '请输入 Bot Secret', trigger: 'blur' }],
};
</script>

<template>
    <Teleport to="body">
        <t-dialog
            v-model:visible="visible"
            :header="dialogTitle"
            :footer="false"
            :close-on-overlay-click="false"
            width="520px"
            class="wecom-bot-config-dialog"
            @close="handleClose"
        >
            <div class="wbc-body">
                <!-- 提示信息（对齐 webim step-tip） -->
                <div class="wbc-tip">
                    <span class="wbc-tip__dot" />
                    <div class="wbc-tip__text">
                        <span>获取凭证：</span>
                        <a class="wbc-tip__link" href="javascript:void(0)">点击链接</a>
                        <span>用企微扫码快速获取。</span>
                        <br />
                        <span>重要提示：一个企微机器人只能绑定一个空间的智能工作台。</span>
                    </div>
                </div>

                <t-form
                    ref="formRef"
                    :data="formData"
                    :rules="rules"
                    label-align="left"
                    label-width="70px"
                    class="wbc-form"
                >
                    <t-form-item label="Bot ID" name="botId" :required-mark="true">
                        <t-input
                            v-model="formData.botId"
                            placeholder="请输入"
                            clearable
                        />
                    </t-form-item>
                    <t-form-item label="Secret" name="botSecret" :required-mark="true">
                        <t-input
                            v-model="formData.botSecret"
                            placeholder="请输入"
                            type="password"
                            clearable
                        />
                    </t-form-item>
                </t-form>

                <div class="wbc-footer">
                    <t-button theme="primary" size="large" :loading="submitting" @click="handleSubmit">确定</t-button>
                    <t-button size="large" @click="visible = false">取消</t-button>
                </div>
            </div>
        </t-dialog>
    </Teleport>
</template>

<style scoped>
/* ---- 弹窗主体对齐 webim ---- */
.wecom-bot-config-dialog :deep(.t-dialog__body) {
    padding: 0 24px 0;
}

.wbc-body {
    width: 100%;
}

/* ---- 提示（对齐 webim step-tip） ---- */
.wbc-tip {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    padding: 10px 12px;
    margin-bottom: 20px;
    background: #ECF9FF;
    border-radius: 3px;
}

.wbc-tip__dot {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    margin-top: 2px;
    background: #1492FF;
    border-radius: 50%;
}

.wbc-tip__text {
    font-size: 12px;
    color: rgba(1, 11, 50, 0.61);
    line-height: 20px;
}

.wbc-tip__link {
    color: #1492FF;
    text-decoration: none;
    cursor: pointer;
}

.wbc-tip__link:hover {
    text-decoration: underline;
}

/* ---- 表单（对齐 webim credential-form） ---- */
.wbc-form {
    margin-bottom: 8px;
}

.wbc-form :deep(.t-form__item) {
    margin-bottom: 20px;
}

.wbc-form :deep(.t-form__label) {
    font-size: 13px;
    color: rgba(0, 1, 10, 0.93);
}

/* ---- Footer（对齐 webim：居中、大按钮） ---- */
.wbc-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 16px 0 0;
}
</style>
