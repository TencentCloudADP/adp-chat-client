<!--
  渠道设置弹窗
  @description
    C 端 claw 模式下的 IM 渠道配置管理弹窗。
    对齐 webim 的 channel-setting-dialog 交互模式：
      - 列表通过 DescribeChannelList（scene=1）拉取
      - 三列：渠道类型 / 配置状态 / 操作
      - 操作：详情（仅已配置时显示）、配置（未配置/已失效）、
              重新配置（已配置时带二次确认）、清除（已配置时带二次确认）
    SUPPORTED_CHANNELS 对齐 webim：10014 企微智能机器人、10015 微信 ClawBot
-->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
    Dialog as TDialog,
    Table as TTable,
    Popconfirm as TPopconfirm,
    Loading as TLoading,
    MessagePlugin,
} from 'tdesign-vue-next';
import CustomizedIcon from '../CustomizedIcon.vue';
import WecomBotConfigDialog from './WecomBotConfigDialog.vue';
import WechatClawBotConfigDialog from './WechatClawBotConfigDialog.vue';
import ChannelDetailDialog from './ChannelDetailDialog.vue';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
import {
    type ChannelItem,
    type ChannelRow,
    type ChannelSettingsI18n,
    ClawChannelStatus,
    ChannelType,
    defaultChannelSettingsI18n,
    defaultChannelSettingsI18nEn,
    SUPPORTED_CHANNEL_TYPES,
    CHANNEL_ICON_MAP,
    CHANNEL_NAME_KEYS,
} from '../../model/channel';
import {
    describeChannelList,
    describeChannel,
    deleteChannel,
    defaultChannelApiConfig,
    type ChannelApiConfig,
    type DescribeChannelListResponse,
} from '../../service/channelApi';

// ============================================================
// Props / Emits
// ============================================================

interface Props extends ThemeProps {
    /** 控制弹窗显示 */
    modelValue: boolean;
    /** 应用 ID（作为 /adp/ 请求的 ApplicationId） */
    applicationId: string;
    /** C 端 claw 模式：归属用户 ID（对应 proto UserAgentReference.UserId） */
    userId?: string;
    /** C 端 claw 模式：claw agent 运行态 ID（对应 proto UserAgentReference.AgentId） */
    agentId?: string;
    /** API 路径覆盖配置 */
    apiConfig?: ChannelApiConfig;
    /** 国际化文本覆盖 */
    i18n?: Partial<ChannelSettingsI18n>;
    /** 语言 */
    language?: string;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    applicationId: '',
    userId: '',
    agentId: '',
    apiConfig: () => ({}),
    i18n: () => ({}),
    language: 'zh-CN',
});

const emit = defineEmits<{
    (e: 'update:modelValue', val: boolean): void;
    /** 列表刷新后通知父组件 */
    (e: 'refreshed', list: ChannelItem[]): void;
    /** 渠道数据加载完成 */
    (e: 'loaded', res: DescribeChannelListResponse): void;
    /** 渠道数据加载失败 */
    (e: 'loadError', err: unknown): void;
    /** 配置渠道（首次配置或重新配置） */
    (e: 'configure', item: ChannelItem): void;
}>();

// ============================================================
// I18n 合并
// ============================================================

const mergedI18n = computed<Required<ChannelSettingsI18n>>(() => {
    const defaults = props.language?.startsWith('en')
        ? defaultChannelSettingsI18nEn
        : defaultChannelSettingsI18n;
    return { ...defaults, ...props.i18n };
});

// ============================================================
// v-model 双向绑定
// ============================================================

const visible = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v),
});

// ============================================================
// 数据状态
// ============================================================

const loading = ref(false);
const rawChannelList = ref<ChannelItem[]>([]);
const clearLoadingMap = ref<Record<number, boolean>>({});

// 子配置弹窗状态
type SubDialogType = 'none' | 'detail' | 'wecomBot' | 'wechatClawBot';
const subDialogType = ref<SubDialogType>('none');
const editingChannelItem = ref<ChannelItem | null>(null);
const detailRow = ref<ChannelRow | null>(null);

/** API 路径 */
const apiConfig = computed(() => ({
    ...defaultChannelApiConfig,
    ...props.apiConfig,
}));

/**
 * 获取渠道类型显示名称
 */
const getChannelLabel = (channelType: number): string => {
    const key = CHANNEL_NAME_KEYS[channelType] || '';
    const i18n = mergedI18n.value as Record<string, string>;
    return i18n[key] || `Channel ${channelType}`;
};

/**
 * 获取渠道类型图标
 */
const getChannelIcon = (channelType: number): string => {
    return CHANNEL_ICON_MAP[channelType] || 'app_line';
};

/**
 * 获取配置状态显示文本
 */
const getStatusText = (connectStatus: ClawChannelStatus): string => {
    if (connectStatus === ClawChannelStatus.SUCCESS) return mergedI18n.value.statusConfigured;
    if (connectStatus === ClawChannelStatus.FAIL) return mergedI18n.value.statusInvalid;
    return mergedI18n.value.statusUnconfigured;
};

/**
 * 是否已配置
 */
const isConfigured = (row: ChannelRow): boolean => {
    return row.connectStatus === ClawChannelStatus.SUCCESS
        || row.connectStatus === ClawChannelStatus.FAIL;
};

/**
 * 是否已失效
 */
const isInvalid = (row: ChannelRow): boolean => {
    return row.connectStatus === ClawChannelStatus.FAIL;
};

/**
 * 合并后端数据与支持列表，将 ChannelItem[] 转为弹窗展示用的 ChannelRow[]
 */
const channelRows = computed<ChannelRow[]>(() => {
    return SUPPORTED_CHANNEL_TYPES.map((channelType) => {
        // 找到该渠道类型下已配置或已失效的记录（优先）；否则取第一条
        const sameTypeItems = rawChannelList.value.filter(
            (item) => item.channelType === channelType,
        );
        if (!sameTypeItems.length) {
            return {
                channelType,
                channelId: 0,
                label: getChannelLabel(channelType),
                icon: getChannelIcon(channelType),
                connectStatus: ClawChannelStatus.UNSPECIFIED,
                updateTime: 0,
                raw: null,
            } as ChannelRow;
        }
        const preferred = sameTypeItems.find(
            (item) =>
                item.connectStatus === ClawChannelStatus.SUCCESS
                || item.connectStatus === ClawChannelStatus.FAIL,
        );
        const target = preferred || sameTypeItems[0]!;
        return {
            channelType,
            channelId: target!.channelId,
            label: getChannelLabel(channelType),
            icon: getChannelIcon(channelType),
            connectStatus: target!.connectStatus,
            updateTime: target!.updateTime,
            raw: target,
        } as ChannelRow;
    });
});

// ============================================================
// 数据加载
// ============================================================

/**
 * 刷新渠道列表
 */
const refreshList = async () => {
    if (!props.applicationId) return;
    loading.value = true;
    try {
        const res = await describeChannelList(
            { applicationId: props.applicationId, pageSize: 100 },
            apiConfig.value.describeChannelListApi,
        );
        rawChannelList.value = res.channelList;
        emit('loaded', res);
        emit('refreshed', res.channelList);
    } catch (err) {
        emit('loadError', err);
    } finally {
        loading.value = false;
    }
};

// 弹窗打开时刷新列表
watch(() => props.modelValue, (val) => {
    if (val) {
        refreshList();
    }
});

// ============================================================
// 操作处理
// ============================================================

/** 打开渠道配置弹窗（根据渠道类型路由到对应子组件） */
const openConfigDialog = async (row: ChannelRow, isReconfigure: boolean) => {
    if (isReconfigure && row.channelId) {
        // 重新配置 / 已失效：先拉取渠道详情，确保子对话框拿到完整数据
        try {
            const detail = await describeChannel(
                { applicationId: props.applicationId, channelId: row.channelId },
                apiConfig.value.describeChannelApi,
            );
            editingChannelItem.value = detail;
        } catch {
            // 拉取失败则用列表中的已有数据兜底
            editingChannelItem.value = row.raw;
        }
    } else if (isReconfigure && row.raw) {
        editingChannelItem.value = row.raw;
    } else {
        // 首次配置：无旧数据
        editingChannelItem.value = null;
    }

    if (row.channelType === ChannelType.WECOM_ROBOT_WS) {
        subDialogType.value = 'wecomBot';
    } else if (row.channelType === ChannelType.WECHAT_CLAWBOT) {
        subDialogType.value = 'wechatClawBot';
    }
};

/** 详情 */
const handleDetail = (row: ChannelRow) => {
    detailRow.value = row;
    subDialogType.value = 'detail';
};

/** 配置（首次） */
const handleConfigure = (row: ChannelRow) => {
    openConfigDialog(row, false);
};

/** 重新配置确认 */
const handleReconfigureConfirm = (row: ChannelRow) => {
    openConfigDialog(row, true);
};

/** 失效状态：直接重新配置 */
const handleReconfigureDirect = (row: ChannelRow) => {
    openConfigDialog(row, true);
};

/** 子配置弹窗提交后刷新列表 */
const handleConfigSubmitted = async () => {
    subDialogType.value = 'none';
    editingChannelItem.value = null;
    await refreshList();
};

/** 子配置弹窗关闭 */
const handleConfigClose = () => {
    subDialogType.value = 'none';
    editingChannelItem.value = null;
};

/** 清除 */
const handleClearConfirm = async (row: ChannelRow) => {
    if (!row.channelId) return;
    clearLoadingMap.value[row.channelType] = true;
    try {
        await deleteChannel(
            { applicationId: props.applicationId, channelId: row.channelId },
            apiConfig.value.deleteChannelApi,
        );
        MessagePlugin.success('清除成功');
        await refreshList();
    } catch (err) {
        MessagePlugin.error('清除失败');
    } finally {
        clearLoadingMap.value[row.channelType] = false;
    }
};

// ============================================================
// 暴露给父组件
// ============================================================

defineExpose({
    refresh: refreshList,
});

// ============================================================
// 样式：状态点颜色
// ============================================================

const getStatusDotClass = (connectStatus: ClawChannelStatus) => {
    if (connectStatus === ClawChannelStatus.SUCCESS) return 'dot--success';
    if (connectStatus === ClawChannelStatus.FAIL) return 'dot--fail';
    return 'dot--unspecified';
};
</script>

<template>
    <Teleport to="body">
    <t-dialog
        v-model:visible="visible"
        :header="mergedI18n.title"
        :footer="false"
        :close-on-overlay-click="false"
        width="560px"
        :placement="'center'"
        class="channel-settings-dialog"
    >
        <div class="csd-body">
            <!-- 表格区域 -->
            <div v-if="loading" class="csd-loading">
                <t-loading size="small" :text="mergedI18n.loading" />
            </div>
            <t-table
                v-else
                class="csd-table"
                :data="channelRows"
                :columns="[
                    { colKey: 'channelType', title: mergedI18n.columnChannelType, width: 240 },
                    { colKey: 'connectStatus', title: mergedI18n.columnStatus, width: 120 },
                    { colKey: 'action', title: mergedI18n.columnAction },
                ]"
                row-key="channelType"
                :bordered="false"
                :stripe="false"
                :hover="true"
            >
                <!-- 渠道类型列 -->
                <template #channelType="{ row }">
                    <div class="csd-channel-cell">
                        <img
                            v-if="row.icon"
                            class="csd-channel-icon"
                            :src="row.icon"
                            :alt="row.label"
                        />
                        <CustomizedIcon
                            v-else
                            name="basic_app_line"
                            remote
                            size="s"
                            :theme="theme"
                        />
                        <span class="csd-channel-name">{{ row.label }}</span>
                    </div>
                </template>

                <!-- 配置状态列 -->
                <template #connectStatus="{ row }">
                    <div class="csd-status-cell">
                        <span class="csd-status-dot" :class="getStatusDotClass(row.connectStatus)"></span>
                        <span class="csd-status-text">{{ getStatusText(row.connectStatus) }}</span>
                    </div>
                </template>

                <!-- 操作列 -->
                <template #action="{ row }">
                    <div class="csd-action-cell">
                        <!-- 已失效：直接重新配置 -->
                        <template v-if="isInvalid(row)">
                            <span class="csd-action-link" @click="handleReconfigureDirect(row)">
                                {{ mergedI18n.actionConfigure }}
                            </span>
                        </template>

                        <!-- 未配置：首次配置 -->
                        <template v-else-if="!isConfigured(row)">
                            <span class="csd-action-link" @click="handleConfigure(row)">
                                {{ mergedI18n.actionConfigure }}
                            </span>
                        </template>

                        <!-- 已配置：详情 + 重新配置 + 清除 -->
                        <template v-else>
                            <!-- 详情（仅企微机器人 10014 显示） -->
                            <span
                                v-if="row.channelType === ChannelType.WECOM_ROBOT_WS"
                                class="csd-action-link"
                                @click="handleDetail(row)"
                            >{{ mergedI18n.actionDetail }}</span>

                            <!-- 重新配置确认 -->
                            <t-popconfirm
                                :content="mergedI18n.reconfigureConfirmText"
                                :confirm-btn="mergedI18n.actionReconfigure"
                                :cancel-btn="mergedI18n.cancel"
                                @confirm="handleReconfigureConfirm(row)"
                            >
                                <span class="csd-action-link">{{ mergedI18n.actionReconfigure }}</span>
                            </t-popconfirm>

                            <!-- 清除确认 -->
                            <t-popconfirm
                                :content="mergedI18n.clearConfirmText"
                                :confirm-btn="{ content: mergedI18n.confirmClear, theme: 'warning' }"
                                :cancel-btn="mergedI18n.cancel"
                                @confirm="handleClearConfirm(row)"
                            >
                                <span class="csd-action-link csd-action-link--danger">{{ mergedI18n.actionClear }}</span>
                            </t-popconfirm>
                        </template>
                    </div>
                </template>
            </t-table>
        </div>
    </t-dialog>

    <!-- 详情子弹窗 -->
    <ChannelDetailDialog
        :model-value="subDialogType === 'detail'"
        :channel-row="detailRow"
        :i18n="i18n"
        :language="language"
        @update:model-value="(v: boolean) => { if (!v) subDialogType = 'none'; }"
    />

    <!-- 企微智能机器人配置弹窗 -->
    <WecomBotConfigDialog
        :model-value="subDialogType === 'wecomBot'"
        :application-id="applicationId"
        :user-id="userId"
        :agent-id="agentId"
        :editing-channel="editingChannelItem"
        :i18n="i18n"
        :language="language"
        @submitted="handleConfigSubmitted"
        @close="handleConfigClose"
        @update:model-value="(v: boolean) => { if (!v) subDialogType = 'none'; }"
    />

    <!-- 微信 ClawBot 配置弹窗 -->
    <WechatClawBotConfigDialog
        :model-value="subDialogType === 'wechatClawBot'"
        :application-id="applicationId"
        :user-id="userId"
        :agent-id="agentId"
        :editing-channel="editingChannelItem"
        :i18n="i18n"
        :language="language"
        @submitted="handleConfigSubmitted"
        @close="handleConfigClose"
        @update:model-value="(v: boolean) => { if (!v) subDialogType = 'none'; }"
    />
    </Teleport>
</template>

<style scoped>
/* ---- 弹窗主体对齐 webim ---- */
.channel-settings-dialog :deep(.t-dialog__body) {
    padding: 0 24px 24px;
}

.csd-body {
    min-height: 120px;
}

.csd-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 48px 0;
}

/* ---- 表格（对齐 webim 原生 table 样式） ---- */
.csd-table :deep(.t-table__header th) {
    background: rgba(36, 56, 97, 0.04);
    color: rgba(1, 11, 50, 0.61);
    font-weight: 400;
    font-size: 12px;
    padding: 8px 12px;
    border: none;
}

.csd-table :deep(.t-table__body td) {
    padding: 14px 12px;
    font-size: 13px;
    vertical-align: middle;
    border-bottom: 1px solid rgba(18, 42, 79, 0.06);
}

.csd-table :deep(.t-table__body tr:last-child td) {
    border-bottom: none;
}

.csd-table :deep(.t-table) {
    border-collapse: collapse;
    table-layout: fixed;
}

/* ---- 渠道类型 ---- */
.csd-channel-cell {
    display: flex;
    align-items: center;
    gap: 8px;
}

.csd-channel-icon {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    object-fit: contain;
}

.csd-channel-name {
    font-size: 13px;
    color: rgba(0, 1, 10, 0.93);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* ---- 配置状态 ---- */
.csd-status-cell {
    display: flex;
    align-items: center;
    gap: 6px;
}

.csd-status-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
}

.csd-status-dot.dot--unspecified { background: rgba(1, 11, 50, 0.26); }
.csd-status-dot.dot--success { background: #34c759; }
.csd-status-dot.dot--fail { background: #e54545; }

.csd-status-text {
    font-size: 13px;
    color: rgba(1, 11, 50, 0.61);
}

/* ---- 操作 ---- */
.csd-action-cell {
    display: flex;
    align-items: center;
}

.csd-action-link {
    font-size: 13px;
    color: #3370ff;
    cursor: pointer;
    margin-right: 12px;
    white-space: nowrap;
}

.csd-action-link:hover { opacity: 0.8; }

.csd-action-link:last-child { margin-right: 0; }

.csd-action-link--danger { color: #e54545; }
</style>
