<!--
  渠道详情弹窗
  @description
    展示已配置渠道的详细信息（只读）
    对齐 webim 的 channel-detail-dialog
-->
<script setup lang="ts">
import { computed } from 'vue';
import {
    Dialog as TDialog,
    Button as TButton,
    Descriptions as TDescriptions,
    DescriptionsItem as TDescriptionsItem,
} from 'tdesign-vue-next';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
import {
    type ChannelRow,
    type ChannelSettingsI18n,
    ClawChannelStatus,
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

const getStatusLabel = (status: ClawChannelStatus): string => {
    if (status === ClawChannelStatus.SUCCESS) return mergedI18n.value.statusConfigured;
    if (status === ClawChannelStatus.FAIL) return mergedI18n.value.statusInvalid;
    return mergedI18n.value.statusUnconfigured;
};

/** WecomRobot websocket 相关信息 */
const wecomRobotInfo = computed(() => {
    if (!props.channelRow?.raw) return null;
    const spec = props.channelRow.raw.spec || {};
    const wecomRobot = (spec as any).WecomRobot || (spec as any).wecom_robot || {};
    const ws = wecomRobot.Websocket || wecomRobot.websocket || {};
    return {
        botId: (ws.BotId || ws.bot_id || '-') as string,
    };
});

/** WechatClawBot 相关信息 */
const wechatClawbotInfo = computed(() => {
    if (!props.channelRow?.raw) return null;
    const spec = props.channelRow.raw.spec || {};
    const clawbot = (spec as any).WechatClawBot || (spec as any).wechat_clawbot || {};
    return {
        botId: (clawbot.BotId || clawbot.bot_id || '-') as string,
        wechatUserId: (clawbot.WechatUserId || clawbot.wechat_user_id || '-') as string,
    };
});
</script>

<template>
    <Teleport to="body">
        <t-dialog
            v-model:visible="visible"
            :header="mergedI18n.actionDetail"
            :footer="false"
            width="500px"
            class="channel-detail-dialog"
        >
            <div v-if="channelRow" class="cdd-body">
                <t-descriptions :column="1" bordered>
                    <t-descriptions-item :label="mergedI18n.columnChannelType">
                        <div class="cdd-channel-cell">
                            <img
                                v-if="channelRow.icon"
                                class="cdd-channel-icon"
                                :src="channelRow.icon"
                                :alt="channelRow.label"
                            />
                            <span>{{ channelRow.label }}</span>
                        </div>
                    </t-descriptions-item>
                    <t-descriptions-item :label="mergedI18n.columnStatus">
                        {{ getStatusLabel(channelRow.connectStatus) }}
                    </t-descriptions-item>
                    <t-descriptions-item label="Channel ID">
                        {{ channelRow.channelId || '-' }}
                    </t-descriptions-item>

                    <!-- 企微机器人特有信息 -->
                    <template v-if="channelRow.channelType === ChannelType.WECOM_ROBOT_WS && wecomRobotInfo">
                        <t-descriptions-item label="Bot ID">
                            {{ wecomRobotInfo.botId }}
                        </t-descriptions-item>
                    </template>

                    <!-- 微信 ClawBot 特有信息 -->
                    <template v-if="channelRow.channelType === ChannelType.WECHAT_CLAWBOT && wechatClawbotInfo">
                        <t-descriptions-item label="Bot ID">
                            {{ wechatClawbotInfo.botId }}
                        </t-descriptions-item>
                        <t-descriptions-item label="WeChat User ID">
                            {{ wechatClawbotInfo.wechatUserId }}
                        </t-descriptions-item>
                    </template>

                    <t-descriptions-item label="Create Time">
                        {{ channelRow.raw?.createTime ? new Date(channelRow.raw.createTime * 1000).toLocaleString() : '-' }}
                    </t-descriptions-item>
                    <t-descriptions-item label="Update Time">
                        {{ channelRow.raw?.updateTime ? new Date(channelRow.raw.updateTime * 1000).toLocaleString() : '-' }}
                    </t-descriptions-item>
                </t-descriptions>
            </div>
            <div v-else class="cdd-empty">
                暂无数据
            </div>
        </t-dialog>
    </Teleport>
</template>

<style scoped>
.cdd-body {
    padding: 4px 0;
}

.cdd-channel-cell {
    display: flex;
    align-items: center;
    gap: 8px;
}

.cdd-channel-icon {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    object-fit: contain;
}

.cdd-empty {
    padding: 40px 0;
    text-align: center;
    color: var(--td-text-color-placeholder);
}
</style>
