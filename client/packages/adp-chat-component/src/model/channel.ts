/**
 * 渠道设置弹窗相关类型定义与国际化
 *
 * C 端 claw 模式的 IM 渠道配置：
 *   - 当前支持：企微智能机器人（10014）、微信 ClawBot（10015）
 *   - 接口 scene 统一传 1（C_END）
 */

import {
    type ChannelItem,
    ClawChannelStatus,
    ChannelType,
} from '../service/channelApi';

import wecomIcon from '../assets/wecom_icon.png';
import wechatIcon from '../assets/wechat_icon.png';

// 重导出服务层类型，方便组件集中引入
export { ClawChannelStatus, ChannelType };
export type { ChannelItem };

// ============================================================
// 渠道显示配置
// ============================================================

/** 企微智能机器人（WebSocket） */
export const CHANNEL_WECOM_ROBOT_KEY = 'wecom_robot_ws' as const;
/** 微信 ClawBot */
export const CHANNEL_WECHAT_CLAWBOT_KEY = 'wechat_clawbot' as const;

/** C 端支持的渠道类型列表（与 webim 对齐） */
export const SUPPORTED_CHANNEL_TYPES = [
    ChannelType.WECOM_ROBOT_WS,   // 10014
    ChannelType.WECHAT_CLAWBOT,   // 10015
] as const;

/** 渠道类型 → 图标图片资源映射（与 webim 对齐，使用图片而非 iconfont） */
export const CHANNEL_ICON_MAP: Record<number, string> = {
    [ChannelType.WECOM_ROBOT_WS]: wecomIcon,
    [ChannelType.WECHAT_CLAWBOT]: wechatIcon,
};

/** 渠道类型 → 显示名称 key 映射 */
export const CHANNEL_NAME_KEYS: Record<number, string> = {
    [ChannelType.WECOM_ROBOT_WS]: 'channelNameWecomRobot',
    [ChannelType.WECHAT_CLAWBOT]: 'channelNameWechatClawBot',
};

// ============================================================
// 弹窗展示用的渠道行数据
// ============================================================

/** 弹窗列表中每一行的展示数据 */
export interface ChannelRow {
    /** 渠道类型枚举值 */
    channelType: number;
    /** 渠道 ID（后端分配的雪花 ID，未创建时为空） */
    channelId: number;
    /** 显示名称 */
    label: string;
    /** 图标名称 */
    icon: string;
    /** 配置状态 */
    connectStatus: ClawChannelStatus;
    /** 更新时间 */
    updateTime: number;
    /** 原始后端数据（用于详情/重新配置等场景透传） */
    raw: ChannelItem | null;
}

// ============================================================
// I18n 接口
// ============================================================

/** 渠道设置弹窗国际化文本 */
export interface ChannelSettingsI18n {
    /** 弹窗标题 */
    title?: string;
    /** 渠道类型列标题 */
    columnChannelType?: string;
    /** 配置状态列标题 */
    columnStatus?: string;
    /** 操作列标题 */
    columnAction?: string;
    /** 已配置 */
    statusConfigured?: string;
    /** 未配置 */
    statusUnconfigured?: string;
    /** 已失效 */
    statusInvalid?: string;
    /** 详情 */
    actionDetail?: string;
    /** 配置 */
    actionConfigure?: string;
    /** 重新配置 */
    actionReconfigure?: string;
    /** 重新配置确认文案 */
    reconfigureConfirmText?: string;
    /** 清除 */
    actionClear?: string;
    /** 清除确认文案 */
    clearConfirmText?: string;
    /** 确定清除 */
    confirmClear?: string;
    /** 取消 */
    cancel?: string;
    /** 渠道类型名称 */
    channelNameWecomRobot?: string;
    /** 渠道类型名称 - 微信 ClawBot */
    channelNameWechatClawBot?: string;
    /** 加载中 */
    loading?: string;
    /** 详情弹窗标题后缀（对齐 webim："{渠道名} 渠道配置"） */
    detailTitleSuffix?: string;
    /** 详情：Bot ID 字段标签 */
    detailBotIdLabel?: string;
    /** 详情：Secret 字段标签 */
    detailSecretLabel?: string;
    /** 详情：iLink 账号 ID 字段标签（微信 ClawBot） */
    detailIlinkIdLabel?: string;
    /** 详情：空值占位文案 */
    detailEmptyValue?: string;
    /** 详情：关闭按钮文案（知道了） */
    detailGotIt?: string;
}

/** 渠道设置弹窗 i18n 中文默认值 */
export const defaultChannelSettingsI18n: Required<ChannelSettingsI18n> = {
    title: '渠道设置',
    columnChannelType: '渠道类型',
    columnStatus: '配置状态',
    columnAction: '操作',
    statusConfigured: '已配置',
    statusUnconfigured: '未配置',
    statusInvalid: '已失效',
    actionDetail: '详情',
    actionConfigure: '配置',
    actionReconfigure: '重新配置',
    reconfigureConfirmText: '重新配置，将覆盖当前绑定的账号和对话历史纪录',
    actionClear: '清除',
    clearConfirmText: '确认清除配置吗，原渠道将无法使用',
    confirmClear: '确定清除',
    cancel: '取消',
    channelNameWecomRobot: '企微智能机器人',
    channelNameWechatClawBot: '微信',
    loading: '加载中...',
    detailTitleSuffix: '渠道配置',
    detailBotIdLabel: 'Bot ID',
    detailSecretLabel: 'Secret',
    detailIlinkIdLabel: 'iLink 账号 ID',
    detailEmptyValue: '暂无',
    detailGotIt: '知道了',
};

/** 渠道设置弹窗 i18n 英文默认值 */
export const defaultChannelSettingsI18nEn: Required<ChannelSettingsI18n> = {
    title: 'Channel Settings',
    columnChannelType: 'Channel Type',
    columnStatus: 'Status',
    columnAction: 'Action',
    statusConfigured: 'Configured',
    statusUnconfigured: 'Not Configured',
    statusInvalid: 'Invalid',
    actionDetail: 'Detail',
    actionConfigure: 'Configure',
    actionReconfigure: 'Reconfigure',
    reconfigureConfirmText: 'Reconfiguring will overwrite the currently bound account and conversation history',
    actionClear: 'Clear',
    clearConfirmText: 'Are you sure you want to clear the configuration? The original channel will become unavailable.',
    confirmClear: 'Confirm Clear',
    cancel: 'Cancel',
    channelNameWecomRobot: 'WeCom Bot',
    channelNameWechatClawBot: 'WeChat',
    loading: 'Loading...',
    detailTitleSuffix: 'Channel Config',
    detailBotIdLabel: 'Bot ID',
    detailSecretLabel: 'Secret',
    detailIlinkIdLabel: 'iLink Account ID',
    detailEmptyValue: 'None',
    detailGotIt: 'Got it',
};
