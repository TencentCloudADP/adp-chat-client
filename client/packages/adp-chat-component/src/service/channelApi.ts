/**
 * 渠道 API 服务
 * 通过 /adp/<Action> 通用转发端点调用 app_channel/v2 接口
 * 对应 proto：app/app_channel/v2/external.proto
 *   - CreateChannel / DescribeChannel / DescribeChannelList / ModifyChannel / DeleteChannel
 * 所有调用 scene 固定为 1（C_END / claw 模式）
 */
import { httpService } from './httpService';

// ============================================================
// 配置
// ============================================================

/** 渠道 API 路径配置 */
export interface ChannelApiConfig {
    /** 创建渠道 */
    createChannelApi?: string;
    /** 获取渠道详情 */
    describeChannelApi?: string;
    /** 获取渠道列表 */
    describeChannelListApi?: string;
    /** 修改渠道 */
    modifyChannelApi?: string;
    /** 删除渠道 */
    deleteChannelApi?: string;
}

export const defaultChannelApiConfig: ChannelApiConfig = {
    createChannelApi: '/adp/CreateChannel',
    describeChannelApi: '/adp/DescribeChannel',
    describeChannelListApi: '/adp/DescribeChannelList',
    modifyChannelApi: '/adp/ModifyChannel',
    deleteChannelApi: '/adp/DeleteChannel',
};

// ============================================================
// 类型定义
// ============================================================

/** 渠道场景（proto ChannelScene） */
export enum ChannelScene {
    B_END = 0,  // B 端场景（应用发布渠道）
    C_END = 1,  // C 端场景（claw 模式 IM 渠道）
}

/** C 端渠道连接状态（proto ClawChannelStatus） */
export enum ClawChannelStatus {
    UNSPECIFIED = 0,
    INIT = 1,    // 初始
    SUCCESS = 2, // 连接成功
    FAIL = 3,    // 连接失败
}

/** 渠道类型枚举（proto common/v2 ChannelType） */
export enum ChannelType {
    UNSPECIFIED = 0,
    WECOM = 10002,               // 企微应用
    WXKF = 10004,                // 微信客服
    YUANBAO_WECOM_ROBOT = 10009, // 企微智能机器人
    LINE = 10011,                // LINE
    TELEGRAM = 10012,            // Telegram
    DINGTALK = 10013,            // 钉钉机器人
    WECOM_ROBOT_WS = 10014,      // 企微智能机器人（WebSocket 长连接）
    WECHAT_CLAWBOT = 10015,      // 微信 iLink ClawBot
}

/** 接口返回的原始渠道项 */
export interface ChannelRawItem {
    ChannelId?: number;
    ChannelStatus?: number;
    ConnectStatus?: number;
    CreateTime?: number;
    UpdateTime?: number;
    Updater?: string;
    Spec?: ChannelSpecRaw;
    [key: string]: unknown;
}

/** 接口返回的原始 ChannelSpec */
export interface ChannelSpecRaw {
    Scene?: number;
    ChannelType?: number;
    ChannelName?: string;
    Description?: string;
    UserAgent?: {
        UserId?: string;
        AgentId?: string;
    };
    [key: string]: unknown;
}

/** 规范化后的渠道项（组件内使用） */
export interface ChannelItem {
    channelId: number;
    channelType: number;
    channelName: string;
    description: string;
    connectStatus: ClawChannelStatus;
    createTime: number;
    updateTime: number;
    spec: ChannelSpecRaw;
}

/** DescribeChannelList 请求参数 */
export interface DescribeChannelListParams {
    applicationId: string;
    pageNumber?: number;
    pageSize?: number;
    /** 过滤条件 */
    filterList?: Array<{ Name: string; ValueList: string[]; Operator: number }>;
}

/** DescribeChannelList 响应 */
export interface DescribeChannelListResponse {
    totalCount: number;
    channelList: ChannelItem[];
}

/** CreateChannel 请求参数 */
export interface CreateChannelParams {
    applicationId: string;
    channelType: number;
    channelName?: string;
    description?: string;
    /**
     * C 端 claw 模式专用：归属用户 + agent 运行态标识
     * 对应 proto UserAgentReference { UserId, AgentId }
     */
    userAgent?: {
        userId: string;
        agentId: string;
    };
    /** 渠道类型对应的配置（proto ChannelSpec oneof channel_config） */
    channelConfig?: Record<string, unknown>;
}

/** DescribeChannel 请求参数 */
export interface DescribeChannelParams {
    applicationId: string;
    channelId: number;
}

/** DeleteChannel 请求参数 */
export interface DeleteChannelParams {
    applicationId: string;
    channelId: number;
}

/** ModifyChannel 请求参数 */
export interface ModifyChannelParams {
    applicationId: string;
    channelId: number;
    channelType?: number;
    channelName?: string;
    description?: string;
    channelConfig?: Record<string, unknown>;
    userAgent?: {
        userId: string;
        agentId: string;
    };
    /** 更新字段掩码 */
    updateMask?: string[];
}

// ============================================================
// 通用请求封装
// ============================================================

async function forwardRequest(
    url: string,
    applicationId: string,
    payload: Record<string, unknown> = {},
): Promise<Record<string, unknown>> {
    const response = await httpService.post(url, { ApplicationId: applicationId, Payload: payload });
    const data = (response?.Response || response || {}) as Record<string, unknown>;
    if (data.Error && typeof data.Error === 'object') {
        const err = data.Error as Record<string, unknown>;
        const code = (err.Code || '') as string;
        const message = (err.Message || '请求失败') as string;
        throw new Error(`[${code}] ${message}`);
    }
    return data;
}

// ============================================================
// 数据转换
// ============================================================

/** 将原始渠道数据标准化为 ChannelItem */
function normalizeChannelItem(raw: ChannelRawItem): ChannelItem {
    const spec = raw.Spec || {};
    return {
        channelId: (raw.ChannelId || 0) as number,
        channelType: (spec.ChannelType || raw.ChannelType || 0) as number,
        channelName: (spec.ChannelName || raw.ChannelName || '') as string,
        description: (spec.Description || raw.Description || '') as string,
        connectStatus: ((raw.ConnectStatus ?? raw.ChannelStatus ?? ClawChannelStatus.UNSPECIFIED) as ClawChannelStatus),
        createTime: (raw.CreateTime || 0) as number,
        updateTime: (raw.UpdateTime || 0) as number,
        spec: spec as ChannelSpecRaw,
    };
}

// ============================================================
// API 方法
// ============================================================

/**
 * 获取渠道列表（scene=1，C 端 claw 模式）
 */
export async function describeChannelList(
    params: DescribeChannelListParams,
    apiPath?: string,
): Promise<DescribeChannelListResponse> {
    const data = await forwardRequest(
        apiPath || defaultChannelApiConfig.describeChannelListApi!,
        params.applicationId,
        {
            AppId: params.applicationId,
            Scene: ChannelScene.C_END,
            PageNumber: (params.pageNumber ?? 1) - 1,
            PageSize: params.pageSize ?? 100,
            FilterList: params.filterList || [],
        },
    );
    const rawList = (data.ChannelList || data.channel_list || []) as ChannelRawItem[];
    return {
        totalCount: (data.TotalCount || data.total_count || 0) as number,
        channelList: rawList.map(normalizeChannelItem),
    };
}

/**
 * 获取渠道详情
 */
export async function describeChannel(
    params: DescribeChannelParams,
    apiPath?: string,
): Promise<ChannelItem> {
    const data = await forwardRequest(
        apiPath || defaultChannelApiConfig.describeChannelApi!,
        params.applicationId,
        {
            AppId: params.applicationId,
            ChannelId: params.channelId,
            Scene: ChannelScene.C_END,
        },
    );
    const raw = (data.Channel || data.channel || data) as ChannelRawItem;
    return normalizeChannelItem(raw);
}

/**
 * 创建渠道
 */
export async function createChannel(
    params: CreateChannelParams,
    apiPath?: string,
): Promise<{ channelId: number; qrcodeUrl?: string }> {
    const spec: Record<string, unknown> = {
        Scene: ChannelScene.C_END,
        ChannelType: params.channelType,
        ChannelName: params.channelName || '',
        Description: params.description || '',
    };
    // C 端归属信息（scene=C_END 时必传，值从调用方获取或留空）
    spec.UserAgent = {
        UserId: params.userAgent?.userId || '',
        AgentId: params.userAgent?.agentId || '',
    };
    // 合并渠道配置（如 WecomRobot, WechatClawBot 等）
    if (params.channelConfig) {
        Object.assign(spec, params.channelConfig);
    }
    const data = await forwardRequest(
        apiPath || defaultChannelApiConfig.createChannelApi!,
        params.applicationId,
        {
            AppId: params.applicationId,
            Spec: spec,
        },
    );
    return {
        channelId: (data.ChannelId || data.channel_id || 0) as number,
        qrcodeUrl: (data.QrcodeUrl || data.qrcode_url || '') as string,
    };
}

/**
 * 修改渠道
 */
export async function modifyChannel(
    params: ModifyChannelParams,
    apiPath?: string,
): Promise<void> {
    const spec: Record<string, unknown> = {};
    /** Spec JSON name → UpdateMask Path（proto snake_case，对齐协议注释） */
    const SPEC_FIELD_MASK_PATHS: Record<string, string> = {
        ChannelType: 'spec.channel_type',
        ChannelName: 'spec.channel_name',
        Description: 'spec.description',
        UserAgent: 'spec.user_agent',
        WecomRobot: 'spec.wecom_robot',
        WechatClawBot: 'spec.wechat_clawbot',
        Wechatapp: 'spec.wechat',
        WecomApp: 'spec.wecom_app',
        Lark: 'spec.lark',
        Line: 'spec.line',
        Telegram: 'spec.telegram',
        DingTalk: 'spec.ding_talk',
        WechatCustomerService: 'spec.wechat_customer_service',
    };

    if (params.channelType !== undefined) spec.ChannelType = params.channelType;
    if (params.channelName !== undefined) spec.ChannelName = params.channelName;
    if (params.description !== undefined) spec.Description = params.description;
    if (params.userAgent && (params.userAgent.userId || params.userAgent.agentId)) {
        spec.UserAgent = {
            UserId: params.userAgent.userId || '',
            AgentId: params.userAgent.agentId || '',
        };
    }
    if (params.channelConfig) Object.assign(spec, params.channelConfig);

    // 自动生成 UpdateMask：遍历 spec 中的 key，映射为 PascalCase 字段路径
    const maskPaths: string[] = params.updateMask || [];
    if (maskPaths.length === 0) {
        for (const key of Object.keys(spec)) {
            const maskPath = SPEC_FIELD_MASK_PATHS[key];
            if (maskPath) {
                maskPaths.push(maskPath);
            }
        }
    }

    await forwardRequest(
        apiPath || defaultChannelApiConfig.modifyChannelApi!,
        params.applicationId,
        {
            AppId: params.applicationId,
            ChannelId: params.channelId,
            Scene: ChannelScene.C_END,
            Spec: spec,
            UpdateMask: maskPaths.length > 0 ? { Paths: maskPaths } : undefined,
        },
    );
}

/**
 * 删除渠道
 */
export async function deleteChannel(
    params: DeleteChannelParams,
    apiPath?: string,
): Promise<void> {
    await forwardRequest(
        apiPath || defaultChannelApiConfig.deleteChannelApi!,
        params.applicationId,
        {
            AppId: params.applicationId,
            ChannelId: params.channelId,
            Scene: ChannelScene.C_END,
        },
    );
}
