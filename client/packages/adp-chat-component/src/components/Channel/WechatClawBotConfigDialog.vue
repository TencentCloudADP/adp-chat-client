<!--
  微信 ClawBot 渠道配置弹窗
  @description
    对应 proto ChannelType = 10015（WECHAT_CLAWBOT）
    创建：调用 CreateChannel（scene=1, channel_type=10015, WechatClawBot={}）
    后端返回 qrcode_url，用 qrcode 库在客户端生成二维码图片
    轮询 Channel 的 qrcode_status 直到确认/过期
    交互对齐 webim 的 wechat-config-dialog：
      - wait/scanned/confirmed/expired 四状态
      - confirmed 后延迟 1.5s 自动关闭
      - expired 时停止轮询，显示刷新入口
-->
<script setup lang="ts">
import { ref, computed, watch, onUnmounted, nextTick } from 'vue';
import {
    Dialog as TDialog,
    Button as TButton,
    Loading as TLoading,
} from 'tdesign-vue-next';
import QRCode from 'qrcode';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
import {
    type ChannelItem,
    type ChannelSettingsI18n,
    ChannelType,
    defaultChannelSettingsI18n,
    defaultChannelSettingsI18nEn,
} from '../../model/channel';
import { createChannel, describeChannel } from '../../service/channelApi';

// ============================================================
// Props / Emits
// ============================================================

interface Props extends ThemeProps {
    modelValue: boolean;
    applicationId: string;
    userId?: string;
    agentId?: string;
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
    (e: 'submitted', payload: { isModify: boolean; channelType: number }): void;
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
// 二维码状态常量（透传 iLink / proto qrcode_status）
// ============================================================

const QRCODE_STATUS = {
    WAIT: 'wait',
    SCANED: 'scaned',
    CONFIRMED: 'confirmed',
    EXPIRED: 'expired',
} as const;

const POLL_INTERVAL = 3000;
const CONFIRMED_CLOSE_DELAY = 1500;

// ============================================================
// 状态
// ============================================================

/** 后端返回的原始 qrcode URL（微信 liteapp 页面） */
const qrcodeUrl = ref('');
/** 客户端生成的二维码 dataURL（qrcode.toDataURL 输出） */
const qrDataUrl = ref('');
/** 二维码状态：wait / scaned / confirmed / expired */
const qrcodeStatus = ref('');
const channelId = ref(0);
const errorMsg = ref('');

let pollTimer: ReturnType<typeof setInterval> | null = null;
let confirmedCloseTimer: ReturnType<typeof setTimeout> | null = null;

/** 是否在加载中 */
const isLoading = ref(false);

const isModify = computed(() => {
    return props.editingChannel !== null && props.editingChannel.channelId > 0;
});

const dialogTitle = computed(() => {
    return isModify.value ? '重新配置微信' : '微信渠道配置';
});

// ============================================================
// 提示文案（对齐 webim 的 qrcodeTipText）
// ============================================================

const qrcodeTipText = computed(() => {
    if (qrcodeStatus.value === QRCODE_STATUS.CONFIRMED) {
        return '已成功绑定微信ClawBot';
    }
    if (qrcodeStatus.value === QRCODE_STATUS.EXPIRED) {
        return '二维码已过期，点击刷新';
    }
    if (qrcodeStatus.value === QRCODE_STATUS.SCANED) {
        return '扫码成功，请在微信中确认';
    }
    return '微信扫码授权';
});

// ============================================================
// 生命周期
// ============================================================

const stopPolling = () => {
    if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
    }
};

const clearConfirmedCloseTimer = () => {
    if (confirmedCloseTimer) {
        clearTimeout(confirmedCloseTimer);
        confirmedCloseTimer = null;
    }
};

onUnmounted(() => {
    stopPolling();
    clearConfirmedCloseTimer();
});

watch(() => props.modelValue, (val) => {
    if (val) {
        initFlow();
    } else {
        qrcodeUrl.value = '';
        qrDataUrl.value = '';
        qrcodeStatus.value = '';
        stopPolling();
        clearConfirmedCloseTimer();
    }
});

// ============================================================
// 流程控制
// ============================================================

/** 生成二维码 dataURL */
const generateQrDataUrl = async (text: string): Promise<string> => {
    try {
        return await QRCode.toDataURL(text, {
            width: 240,
            margin: 1,
            color: { dark: '#000000', light: '#ffffff' },
            errorCorrectionLevel: 'H',
        });
    } catch {
        return '';
    }
};

/** 初始化流程 */
const initFlow = async () => {
    qrcodeUrl.value = '';
    qrDataUrl.value = '';
    qrcodeStatus.value = '';
    errorMsg.value = '';
    channelId.value = 0;
    isLoading.value = true;
    stopPolling();
    clearConfirmedCloseTimer();

    try {
        const result = await createChannel({
            applicationId: props.applicationId,
            channelType: ChannelType.WECHAT_CLAWBOT,
            channelName: '微信',
            description: '',
            channelConfig: { WechatClawBot: {} },
            userAgent: {
                userId: props.userId || '',
                agentId: props.agentId || '',
            },
        });

        channelId.value = result.channelId;

        if (result.qrcodeUrl) {
            qrcodeUrl.value = result.qrcodeUrl;
            // 客户端生成二维码图片
            qrDataUrl.value = await generateQrDataUrl(result.qrcodeUrl);
            await nextTick();
            // 开始轮询二维码状态
            startStatusPolling();
        } else {
            errorMsg.value = '未获取到二维码，请刷新重试';
        }
    } catch (err: any) {
        errorMsg.value = err?.message || '创建渠道失败';
    } finally {
        isLoading.value = false;
    }
};

// ============================================================
// 轮询（对齐 webim：查 DescribeChannel 取 qrcode_status）
// ============================================================

const startStatusPolling = () => {
    stopPolling();
    pollTimer = setInterval(() => {
        fetchChannelStatus();
    }, POLL_INTERVAL);

    // 立即拉取一次
    fetchChannelStatus();
};

/** 单次查询渠道状态 */
const fetchChannelStatus = async () => {
    if (!channelId.value) return;
    try {
        const channel = await describeChannel({
            applicationId: props.applicationId,
            channelId: channelId.value,
        });
        // 从 spec 中读取 qrcode_status 字段
        const spec = channel.spec || {};
        const clawbot = (spec as any).WechatClawBot || (spec as any).wechat_clawbot || {};
        const status = (clawbot.QrcodeStatus || clawbot.qrcode_status || '') as string;
        qrcodeStatus.value = status;

        if (status === QRCODE_STATUS.CONFIRMED) {
            stopPolling();
            clearConfirmedCloseTimer();
            confirmedCloseTimer = setTimeout(() => {
                visible.value = false;
                emit('submitted', { isModify: isModify.value, channelType: ChannelType.WECHAT_CLAWBOT });
            }, CONFIRMED_CLOSE_DELAY);
        } else if (status === QRCODE_STATUS.EXPIRED) {
            stopPolling();
        }
    } catch {
        // 轮询失败忽略
    }
};

// ============================================================
// 事件处理
// ============================================================

const handleRefresh = () => {
    initFlow();
};

const handleDone = () => {
    stopPolling();
    clearConfirmedCloseTimer();
    emit('submitted', { isModify: isModify.value, channelType: ChannelType.WECHAT_CLAWBOT });
    visible.value = false;
};

const handleClose = () => {
    stopPolling();
    clearConfirmedCloseTimer();
    emit('close');
};
</script>

<template>
    <Teleport to="body">
        <t-dialog
            v-model:visible="visible"
            :header="dialogTitle"
            :footer="false"
            :close-on-overlay-click="false"
            width="420px"
            class="wechat-clawbot-config-dialog"
            @close="handleClose"
        >
            <div class="wcc-body">
                <!-- 加载中 -->
                <div v-if="isLoading" class="wcc-status">
                    <t-loading size="medium" />
                    <p>正在生成二维码...</p>
                </div>

                <!-- 已确认成功 -->
                <template v-else-if="qrcodeStatus === QRCODE_STATUS.CONFIRMED">
                    <div class="wcc-qrcode-wrapper">
                        <div class="wcc-success-icon">✓</div>
                    </div>
                </template>

                <!-- 已过期 -->
                <template v-else-if="qrcodeStatus === QRCODE_STATUS.EXPIRED">
                    <div class="wcc-qrcode-wrapper wcc-qrcode-wrapper--expired" @click="handleRefresh">
                        <svg class="wcc-refresh-icon" viewBox="0 0 24 24" width="48" height="48">
                            <path fill="currentColor" d="M17.65 6.35A7.96 7.96 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                        </svg>
                    </div>
                </template>

                <!-- 二维码展示 / 扫码中 -->
                <template v-else-if="qrDataUrl">
                    <div class="wcc-qrcode-wrapper">
                        <img
                            class="wcc-qrcode-img"
                            :src="qrDataUrl"
                            alt="扫码绑定微信 ClawBot"
                        />
                    </div>
                </template>

                <!-- 空态 / 错误 -->
                <div v-else-if="errorMsg" class="wcc-status wcc-status--fail">
                    <p class="wcc-error-text">{{ errorMsg }}</p>
                </div>

                <p class="wcc-qrcode-tip">{{ qrcodeTipText }}</p>

                <div class="wcc-footer">
                    <template v-if="errorMsg">
                        <t-button theme="default" @click="visible = false">关闭</t-button>
                        <t-button theme="primary" @click="handleRefresh">重试</t-button>
                    </template>
                    <template v-else-if="qrcodeStatus === QRCODE_STATUS.CONFIRMED">
                        <t-button theme="primary" @click="handleDone">完成</t-button>
                    </template>
                    <template v-else>
                        <t-button theme="default" @click="visible = false">取消</t-button>
                    </template>
                </div>
            </div>
        </t-dialog>
    </Teleport>
</template>

<style scoped>
/* ---- 弹窗对齐 webim ---- */
.wechat-clawbot-config-dialog :deep(.t-dialog__body) {
    padding: 24px;
    text-align: center;
}

.wcc-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0;
}

.wcc-status {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    flex: 1;
    justify-content: center;
    color: rgba(1, 11, 50, 0.61);
    font-size: 14px;
}

/* ---- 二维码容器（对齐 webim .qrcode-wrapper 240x240） ---- */
.wcc-qrcode-wrapper {
    width: 240px;
    height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.wcc-qrcode-wrapper--expired {
    cursor: pointer;
    background: rgba(1, 11, 50, 0.04);
    border-radius: 4px;
    transition: background 0.2s;
}

.wcc-qrcode-wrapper--expired:hover {
    background: rgba(1, 11, 50, 0.08);
}

.wcc-qrcode-img {
    width: 240px;
    height: 240px;
    display: block;
}

.wcc-refresh-icon {
    color: rgba(1, 11, 50, 0.61);
}

/* ---- 成功图标（对齐 webim） ---- */
.wcc-qrcode-wrapper .wcc-success-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #34c759;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
}

/* ---- 提示文案 ---- */
.wcc-qrcode-tip {
    margin-top: 16px;
    font-size: 13px;
    color: rgba(1, 11, 50, 0.61);
    text-align: center;
}

.wcc-error-text {
    color: #e54545;
    font-size: 14px;
    text-align: center;
}

/* ---- 底部按钮（居中） ---- */
.wcc-footer {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
    width: 100%;
}
</style>
