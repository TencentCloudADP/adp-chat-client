<!--
  渠道详情弹窗
  @description
    展示已配置渠道的详细信息（只读），样式对齐 webim channel-detail-dialog：
      - 标题："{渠道名} 渠道配置"
      - 表单式只读字段：
          * 企微智能机器人（10014）：Bot ID + Secret（脱敏展示）
          * 微信 ClawBot（10015）：iLink 账号 ID
      - 底部单个居中「知道了」按钮
-->
<script setup lang="ts">
import { computed } from 'vue';
import {
    Dialog as TDialog,
    Button as TButton,
    Input as TInput,
} from 'tdesign-vue-next';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
import {
    type ChannelRow,
    type ChannelSettingsI18n,
    ChannelType,
    defaultChannelSettingsI18n,
    defaultChannelSettingsI18nEn,
} from '../../model/channel';

// ============================================================
// Props / Emits
// ============================================================

interface Props extends ThemeProps {
    modelValue: boolean;
    /** 详情数据 */
    channelRow: ChannelRow | null;
    i18n?: Partial<ChannelSettingsI18n>;
    language?: string;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    modelValue: false,
    channelRow: null,
    i18n: () => ({}),
    language: 'zh-CN',
});

const emit = defineEmits<{
    (e: 'update:modelValue', val: boolean): void;
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
// 显示数据
// ============================================================

/** 弹窗标题："{渠道名} 渠道配置"（对齐 webim titleText） */
const titleText = computed(() => {
    const name = props.channelRow?.label || '';
    return `${name} ${mergedI18n.value.detailTitleSuffix}`.trim();
});

/** WecomRobot websocket 相关信息 */
const wecomRobotInfo = computed(() => {
    if (!props.channelRow?.raw) return { botId: '' };
    const spec = props.channelRow.raw.spec || {};
    const wecomRobot = (spec as any).WecomRobot || (spec as any).wecom_robot || {};
    const ws = wecomRobot.Websocket || wecomRobot.websocket || {};
    return {
        botId: (ws.BotId || ws.bot_id || '') as string,
    };
});

/** WechatClawBot 相关信息 */
const wechatClawbotInfo = computed(() => {
    if (!props.channelRow?.raw) return { botId: '', wechatUserId: '' };
    const spec = props.channelRow.raw.spec || {};
    const clawbot = (spec as any).WechatClawBot || (spec as any).wechat_clawbot || {};
    return {
        botId: (clawbot.BotId || clawbot.bot_id || '') as string,
        wechatUserId: (clawbot.WechatUserId || clawbot.wechat_user_id || clawbot.UserId || clawbot.user_id || '') as string,
    };
});

/** Secret 后端不返回，有 botId 时做脱敏占位展示（对齐 webim secretDisplay） */
const secretDisplay = computed(() => (wecomRobotInfo.value.botId ? '*******************************************' : ''));

const handleClose = () => {
    visible.value = false;
};
</script>

<template>
    <Teleport to="body">
        <t-dialog
            v-model:visible="visible"
            :header="titleText"
            :footer="false"
            width="508px"
            :placement="'center'"
            class="channel-detail-dialog"
        >
            <div class="cdd-body">
                <!-- 企微智能机器人：Bot ID + Secret（脱敏） -->
                <template v-if="channelRow && channelRow.channelType === ChannelType.WECOM_ROBOT_WS">
                    <div class="cdd-form-item">
                        <div class="cdd-label">
                            {{ mergedI18n.detailBotIdLabel }}<span class="cdd-required">*</span>
                        </div>
                        <t-input
                            :value="wecomRobotInfo.botId"
                            :placeholder="mergedI18n.detailEmptyValue"
                            readonly
                            disabled
                        />
                    </div>
                    <div class="cdd-form-item">
                        <div class="cdd-label">
                            {{ mergedI18n.detailSecretLabel }}<span class="cdd-required">*</span>
                        </div>
                        <t-input
                            :value="secretDisplay"
                            :placeholder="mergedI18n.detailEmptyValue"
                            type="password"
                            readonly
                            disabled
                        />
                    </div>
                </template>

                <!-- 微信 ClawBot：iLink 账号 ID -->
                <template v-else-if="channelRow && channelRow.channelType === ChannelType.WECHAT_CLAWBOT">
                    <div class="cdd-form-item">
                        <div class="cdd-label">{{ mergedI18n.detailIlinkIdLabel }}</div>
                        <t-input
                            :value="wechatClawbotInfo.wechatUserId"
                            :placeholder="mergedI18n.detailEmptyValue"
                            readonly
                            disabled
                        />
                    </div>
                </template>
            </div>

            <template #footer>
                <div class="cdd-footer">
                    <t-button theme="primary" size="large" @click="handleClose">
                        {{ mergedI18n.detailGotIt }}
                    </t-button>
                </div>
            </template>
        </t-dialog>
    </Teleport>
</template>

<style scoped>
/* 对齐 webim：左对齐、表单式字段 */
.channel-detail-dialog :deep(.t-dialog__body) {
    text-align: left;
}

.cdd-body {
    padding: var(--td-size-2) 0 var(--td-size-4);
}

.cdd-form-item {
    margin-bottom: var(--td-size-7);
}

.cdd-form-item:last-child {
    margin-bottom: 0;
}

.cdd-label {
    font-size: 13px;
    color: var(--td-text-color-primary);
    margin-bottom: var(--td-size-3);
}

.cdd-required {
    color: var(--td-error-color, #e34d59);
    margin-left: var(--td-size-1);
}

.cdd-footer {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
