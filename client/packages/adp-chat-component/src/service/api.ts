/**
 * API 服务模块
 * 提供与后端交互的所有请求方法
 */
import { httpService, getAxiosBaseURL } from './httpService';
import type { Application } from '../model/application';
import type { ChatConversation, Record, ChatConversationProps, Reference } from '../model/chat-v2';
import type { AxiosRequestConfig } from 'axios';

/**
 * API 详细路径配置接口
 */
export interface ApiDetailConfig {
    /** 应用列表接口路径 */
    applicationListApi?: string;
    /** 会话列表接口路径 */
    conversationListApi?: string;
    /** 删除会话接口路径 */
    conversationDeleteApi?: string;
    /** 会话详情接口路径 */
    conversationDetailApi?: string;
    /** 发送消息接口路径 */
    sendMessageApi?: string;
    /** 评分接口路径 */
    rateApi?: string;
    /** 分享接口路径 */
    shareApi?: string;
    /** 用户信息接口路径 */
    userInfoApi?: string;
    /** 文件上传接口路径 */
    uploadApi?: string;
    /** 文件解析接口路径（standard 模式下用于获取 doc_id） */
    fileParseApi?: string;
    /** 引用详情接口路径 */
    referenceDetailApi?: string;
    /** ASR 语音识别 URL 接口路径 */
    asrUrlApi?: string;
    /** 系统配置接口路径 */
    systemConfigApi?: string;
    /** 会话详情（含工作空间）接口路径 */
    describeConversationApi?: string;
    /** 目录列表接口路径 */
    listDirApi?: string;
    /** 文件获取接口路径 */
    fetchFileApi?: string;
    /** 会话消息列表接口路径（claw 模式） */
    describeConversationMessageListApi?: string;
    /** CAPI 渠道会话列表接口路径（/adp/DescribeConversationList，按 ChannelId 精准过滤） */
    describeConversationListApi?: string;
    /** 模型列表接口路径 */
    listModelApi?: string;
    /** Agent 摘要列表接口路径 */
    describeAgentSummaryListApi?: string;
    /** CopyAgentFromApp 接口路径 */
    copyAgentFromAppApi?: string;
    /** 本地 Agent 配置接口路径（GET/POST /agent/config） */
    agentConfigApi?: string;
    /** 创建会话接口路径 */
    createConversationApi?: string;
    /** 快捷按钮建议列表接口路径 */
    suggestionListApi?: string;
}

/**
 * API 配置接口（axios 配置 + API 路径配置）
 */
export interface ApiConfig extends AxiosRequestConfig {
    /** API 详细路径配置 */
    apiDetailConfig?: ApiDetailConfig;
}

/**
 * 默认 API 路径配置
 */
export const defaultApiDetailConfig: ApiDetailConfig = {
    applicationListApi: '/application/list',
    conversationListApi: '/chat/conversations',
    conversationDeleteApi: '/chat/conversation/delete',
    conversationDetailApi: '/chat/messages',
    sendMessageApi: '/chat/message',
    rateApi: '/feedback/rate',
    shareApi: '/share/create',
    userInfoApi: '/account/info',
    uploadApi: '/file/upload',
    fileParseApi: '/file/parse',
    referenceDetailApi: '/reference/detail',
    asrUrlApi: '/helper/asr/url',
    systemConfigApi: '/system/config',
    describeConversationApi: '/adp/DescribeConversation',
    listDirApi: '/adp/ListDir',
    fetchFileApi: '/adp/FetchFile',
    describeConversationMessageListApi: '/adp/DescribeConversationMessageList',
    describeConversationListApi: '/adp/DescribeConversationList',
    listModelApi: '/adp/ListModel',
    describeAgentSummaryListApi: '/adp/DescribeAgentSummaryList',
    copyAgentFromAppApi: '/adp/CopyAgentFromApp',
    agentConfigApi: '/agent/config',
    createConversationApi: '/adp/CreateConversation',
    suggestionListApi: '/suggestions',
};

export interface ReferenceDetailParams {
    ApplicationId?: string;
    ShareId?: string;
    ReferenceIds: string[];
}

/**
 * 加载应用列表
 * @param apiPath API 路径
 */
export const fetchApplicationList = async (apiPath?: string): Promise<Application[]> => {
    if (!apiPath) throw new Error('apiPath is required');
    try {
        const response: { Applications: Application[] } = await httpService.get(apiPath);
        console.log('获取应用列表成功',response)
        return response.Applications || [];
    } catch (error) {
        console.error('获取应用列表失败:', error);
        throw error;
    }
};

/**
 * 加载会话列表
 * @param apiPath API 路径
 */
export const fetchConversationList = async (apiPath?: string): Promise<ChatConversation[]> => {
    if (!apiPath) throw new Error('apiPath is required');
    try {
        const response: ChatConversation[] = await httpService.get(apiPath);
        return response || [];
    } catch (error) {
        console.error('获取会话列表失败:', error);
        throw error;
    }
};

/**
 * 删除会话
 * @param conversationId 会话 ID
 * @param apiPath API 路径（默认 /chat/conversation/delete）
 * 后端已通过 login_required + account_id 做 ownership 校验，前端只需传 ConversationId
 */
export const deleteConversation = async (
    conversationId: string,
    apiPath?: string
): Promise<void> => {
    const path = apiPath || defaultApiDetailConfig.conversationDeleteApi!;
    if (!conversationId) throw new Error('conversationId is required');
    try {
        await httpService.post(path, { ConversationId: conversationId });
    } catch (error) {
        console.error('删除会话失败:', error);
        throw error;
    }
};

/**
 * 加载会话详情
 * @param params 请求参数
 * @param apiPath API 路径
 */
export const fetchConversationDetail = async (
    params: ChatConversationProps,
    apiPath?: string
): Promise<{ Response: { ApplicationId: string; Records: Record[]; LastRecordId: string } }> => {
    if (!apiPath) throw new Error('apiPath is required');
    try {
        const response = await httpService.get(apiPath, params);
        return response;
    } catch (error) {
        console.error('获取会话详情失败:', error);
        throw error;
    }
};

/** DescribeConversationMessageList 请求参数 */
export interface DescribeConversationMessageListParams {
    /** 会话 ID */
    ConversationId: string;
    /** 查询锚点记录 ID（分页用） */
    RecordId?: string;
    /** 返回记录数量，默认 10，最大 50 */
    Limit?: number;
    /** 会话类型：1-访客 2-评测 5-API 10-工作流 20-分享 */
    Type: number;
    /** 查询方向：1-向前（更早） */
    RecordQueryDirection?: number;
}

/** DescribeConversationMessageList 响应 */
export interface DescribeConversationMessageListResponse {
    Response: {
        Messages?: Record[];
        HasMoreBefore?: boolean;
        HasMoreAfter?: boolean;
        FirstRecordId?: string;
        LastRecordId?: string;
        RequestId?: string;
    };
}

/**
 * 通过 /adp 转发调用 DescribeConversationMessageList（claw 模式专用）
 * @param params 请求参数
 * @param applicationId 应用 ID
 * @param apiPath API 路径
 */
export const fetchConversationDetailV2 = async (
    params: DescribeConversationMessageListParams,
    applicationId: string,
    apiPath?: string
): Promise<DescribeConversationMessageListResponse> => {
    const path = apiPath || defaultApiDetailConfig.describeConversationMessageListApi!;
    try {
        const response: DescribeConversationMessageListResponse = await httpService.post(
            path,
            {
                ApplicationId: applicationId,
                Payload: params,
                Version: '2025-11-12',
            }
        );
        return response;
    } catch (error) {
        console.error('获取会话详情(V2)失败:', error);
        throw error;
    }
};

/**
 * 发送消息
 * @param params 消息参数
 * @param options 请求配置
 * @param apiPath API 路径
 */
export const sendMessage = async (
    params: object,
    options?: AxiosRequestConfig,
    apiPath?: string
): Promise<any> => {
    if (!apiPath) throw new Error('apiPath is required');
    const _options = {
        responseType: 'stream',
        adapter: 'fetch',
        // 90 分钟：与服务端 SERVER_RESPONSE_TIMEOUT 对齐。
        // 注意：fetch adapter 下该 timeout 仅约束"发起请求→收到响应头"阶段，
        // 一旦拿到 Response 就会被 clearTimeout；SSE body 的 chunk 间空闲不受此限制。
        timeout: 1000 * 60 * 90,
        ...options,
    } as AxiosRequestConfig;
    return httpService.post(apiPath, params, _options);
};

/**
 * 评分
 * @param params 评分参数
 * @param apiPath API 路径
 */
export const rateMessage = async (params: object, apiPath?: string): Promise<any> => {
    if (!apiPath) throw new Error('apiPath is required');
    try {
        const response = await httpService.post(apiPath, params);
        return response;
    } catch (error) {
        console.error('评分失败:', error);
        throw error;
    }
};

/**
 * 创建分享
 * @param params 分享参数
 * @param apiPath API 路径
 */
export const createShare = async (params: object, apiPath?: string): Promise<any> => {
    if (!apiPath) throw new Error('apiPath is required');
    try {
        const response = await httpService.post(apiPath, params);
        return response;
    } catch (error) {
        console.error('创建分享失败:', error);
        throw error;
    }
};

/**
 * 获取用户信息
 * @param apiPath API 路径
 */
export const fetchUserInfo = async (apiPath?: string): Promise<{ Id: string; Name: string; Avatar: string }> => {
    if (!apiPath) throw new Error('apiPath is required');
    try {
        const response: { Info: { Id: string; Name: string; Avatar: string } } = await httpService.get(apiPath);
        return response.Info || { Id: '', Name: '', Avatar: '' };
    } catch (error) {
        console.error('获取用户信息失败:', error);
        throw error;
    }
};

/**
 * 上传文件
 * @param file 文件
 * @param applicationId 应用ID
 * @param apiPath API 路径
 */
export const uploadFile = async (file: File, applicationId?: string, apiPath?: string, mode?: string): Promise<any> => {
    if (!apiPath) throw new Error('apiPath is required');
    // 构建带参数的 URL
    const params = new URLSearchParams();
    if (applicationId) {
        params.append('ApplicationId', applicationId);
    }
    if (file.type) {
        params.append('Type', file.type);
    }
    if (mode) {
        params.append('Mode', mode);
    }
    const url = params.toString() ? `${apiPath}?${params.toString()}` : apiPath;
    try {
        const response = await httpService.post(url, file);
        return response;
    } catch (error) {
        console.error('文件上传失败:', error);
        throw error;
    }
};

/**
 * 文档解析请求参数
 */
export interface FileParseParams {
    ApplicationId: string;
    FileName: string;
    FileType: string;
    FileUrl?: string;
    CosBucket?: string;
    CosUrl?: string;
    ETag?: string;
    CosHash?: string;
    Size?: string;
    ConversationId?: string;
}

/**
 * 文档解析结果
 */
export interface FileParseResult {
    doc_id: string;
    process: number;
    status: string;
    error_message?: string;
}

/**
 * 实时文档解析（standard 模式）
 * 上传文件后调用此接口进行文档解析，获取 doc_id 供聊天使用。
 * @param params 解析参数
 * @param apiPath API 路径
 * @returns Promise<FileParseResult> 解析完成时返回包含 doc_id 的结果
 */
export const parseFile = async (params: FileParseParams, apiPath?: string): Promise<FileParseResult> => {
    if (!apiPath) throw new Error('apiPath is required');

    const response: any = await httpService.post(apiPath, params, {
        responseType: 'stream',
        adapter: 'fetch',
        timeout: 120000,
    } as AxiosRequestConfig);

    return new Promise((resolve, reject) => {
        const reader = response?.body?.getReader?.() || response?.getReader?.();
        if (!reader) {
            // 非流式响应，尝试直接解析
            if (response && typeof response === 'object' && response.doc_id) {
                resolve(response as FileParseResult);
            } else {
                reject(new Error('No readable stream in response'));
            }
            return;
        }

        const decoder = new TextDecoder();
        let lastResult: FileParseResult = { doc_id: '0', process: 0, status: 'RUNNING' };

        const read = (): void => {
            reader.read().then(({ done, value }: { done: boolean; value?: Uint8Array }) => {
                if (done) {
                    resolve(lastResult);
                    return;
                }
                const text = decoder.decode(value, { stream: true });
                const lines = text.split('\n');
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (trimmed.startsWith('data:')) {
                        try {
                            const data = JSON.parse(trimmed.slice(5).trim());
                            const payload = data.payload || data;
                            if (payload.doc_id) {
                                lastResult = {
                                    doc_id: payload.doc_id,
                                    process: payload.process || 0,
                                    status: payload.status || 'RUNNING',
                                    error_message: payload.error_message,
                                };
                            }
                            if (payload.status === 'FAILED') {
                                reject(new Error(payload.error_message || 'Document parse failed'));
                                reader.cancel();
                                return;
                            }
                        } catch (e) {
                            // 忽略解析失败的行
                        }
                    }
                }
                read();
            }).catch(reject);
        };
        read();
    });
};

/**
 * 获取引用详情
 * @param params 请求参数
 * @param apiPath API 路径
 */
export const fetchReferenceDetails = async (
    params: ReferenceDetailParams,
    apiPath?: string
): Promise<Reference[]> => {
    if (!apiPath) throw new Error('apiPath is required');
    try {
        const response: { References: Reference[] } = await httpService.post(apiPath, params);
        return response.References || [];
    } catch (error) {
        console.error('获取引用详情失败:', error);
        throw error;
    }
};

/**
 * 获取 ASR 语音识别 URL
 * @param apiPath API 路径
 */
export const getAsrUrl = async (apiPath?: string): Promise<{ url: string }> => {
    if (!apiPath) throw new Error('apiPath is required');
    try {
        const response = await httpService.get(apiPath);
        return response;
    } catch (error) {
        console.error('获取ASR URL失败:', error);
        throw error;
    }
};

/** 系统配置响应类型 */
export interface SystemConfig {
    EnableVoiceInput: boolean;
}

/**
 * 获取系统配置
 * @param apiPath API 路径
 */
export const fetchSystemConfig = async (apiPath?: string): Promise<SystemConfig> => {
    if (!apiPath) throw new Error('apiPath is required');
    try {
        const response: { Config: SystemConfig } = await httpService.get(apiPath);
        return response.Config || { EnableVoiceInput: false };
    } catch (error) {
        console.error('获取系统配置失败:', error);
        throw error;
    }
};

/** DescribeConversation 请求参数 */
export interface DescribeConversationParams {
    /** 会话 ID */
    ConversationId: string;
    /** 会话类型 */
    Type: number;
}

/** DescribeConversation 响应中 Workspace 信息 */
export interface WorkspaceInfo {
    SandboxStorage: {
        Domain: string;
        Path: string;
        TokenTag: string;
    };
    StorageType: string;
    WorkspaceId: string;
}

/** DescribeConversation 响应 */
export interface DescribeConversationResponse {
    Response: {
        AppId: string;
        ConversationId: string;
        CreateTime: string;
        RequestId: string;
        Type: number;
        UpdateTime: string;
        Workspace?: WorkspaceInfo;
    };
}

/**
 * 获取会话详情（含工作空间信息）
 * @param params 请求参数
 * @param applicationId 应用 ID
 * @param apiPath API 路径
 */
export const describeConversation = async (
    params: DescribeConversationParams,
    applicationId: string,
    apiPath?: string
): Promise<DescribeConversationResponse['Response']> => {
    const path = apiPath || defaultApiDetailConfig.describeConversationApi!;
    try {
        const response: DescribeConversationResponse = await httpService.post(
            path,
            {
                ApplicationId: applicationId,
                Payload: params,
            }
        );
        return response.Response;
    } catch (error) {
        console.error('获取会话详情失败:', error);
        throw error;
    }
};

// ============================================================
// DescribeConversationList（CAPI 渠道会话列表）
// ============================================================

/**
 * DescribeConversationList 请求参数
 * 对齐 proto chat/chat_manage/v2 DescribeConversationListReq，字段命名与 adp-b2c
 * DescribeConversationListReq 保持一致（UserId/AgentId/AppId/AppKey/Keyword/Limit/Offset）。
 * - Type：CONVERSATION_TYPE_UNSPECIFIED(0) 表示全部；渠道场景通常传 0 即可
 * - UserId：**渠道过滤的核心字段**。ADP 里每个渠道绑定一个 UserAgent（{UserId, AgentId}），
 *          传该 UserId 后 CAPI 只返回属于这个渠道用户的会话（webim 通过 UserAgent.UserId 建立
 *          会话 → 拿 UserId 反查就能得到"该渠道的会话列表"）。
 * - AgentId：可选，进一步限定到某个 Agent
 * - ChannelId：proto v2 已定义，但线上 CAPI SDK 尚未开放；启用后可替代 UserId 过滤
 * - AppKey：后端 action_version 会以 {{APP_KEY}} 兜底注入（前端不传即可）
 */
export interface DescribeConversationListParams {
    /** 会话类型，默认 0（全部） */
    Type?: number;
    /** 应用 ID */
    AppId?: string;
    /** Agent ID（可选，配合 UserId 精准过滤某个 Agent 下的会话） */
    AgentId?: string;
    /**
     * 用户 ID（渠道过滤核心）。传该字段后，action_version 里的 {{ACCOUNT_ID}} 默认注入
     * 不会覆盖此值（inject_action_payload 只在 payload 无该字段时才注入）。
     */
    UserId?: string;
    /** 渠道 ID（proto v2 已定义，线上 CAPI SDK 未开放，先保留字段） */
    ChannelId?: string;
    /** 关键词 */
    Keyword?: string;
    /** 偏移量 */
    Offset?: number;
    /** 限制数目 */
    Limit?: number;
}

/** DescribeConversationList 返回的单条会话 */
export interface CapiConversationItem {
    ConversationId: string;
    AppId?: string;
    Type?: number;
    Title?: string;
    AgentId?: string;
    CreateTime?: string;
    UpdateTime?: string;
    [key: string]: unknown;
}

/** DescribeConversationList 响应 */
export interface DescribeConversationListResponse {
    Response: {
        Conversations?: CapiConversationItem[];
        ConversationList?: CapiConversationItem[];
        TotalCount?: string | number;
        RequestId?: string;
        Error?: { Code?: string; Message?: string };
    };
}

/**
 * 通过 CAPI DescribeConversationList 拉取渠道会话列表
 * 走 /adp/DescribeConversationList 转发，可携带 ChannelId 精准过滤（对齐 webim/adp-b2c 但去掉 corp 语义）
 */
export const describeConversationList = async (
    params: DescribeConversationListParams,
    applicationId: string,
    apiPath?: string,
): Promise<{
    conversations: CapiConversationItem[];
    totalCount: number;
}> => {
    const path = apiPath || defaultApiDetailConfig.describeConversationListApi!;
    // 组装 Payload：
    // Type 默认 1（CONVERSATION_TYPE_VISITOR，访客端体验）——对齐 adp-b2c capi.go conversationType()：
    // 虽然 proto 注释说 Type=0(UNSPECIFIED) 表示全部，但线上 CAPI SDK 实际行为并非"全部"，
    // 传 0 常常拿到空列表；adp-b2c 亲测强制把 0→1 才能返回渠道产生的访客会话。
    const payload: Record<string, unknown> = { Type: params.Type || 1 };
    if (params.AppId) payload.AppId = params.AppId;
    if (params.AgentId) payload.AgentId = params.AgentId;
    // 渠道过滤：UserId 是核心，值来自 channel.spec.UserAgent.UserId（对齐 adp-b2c）。
    // 传值后 action_version 中的 {{ACCOUNT_ID}} 默认注入会被跳过。
    if (params.UserId) payload.UserId = params.UserId;
    // 注意：ChannelId 已在 proto v2 定义但线上 CAPI (2026-05-20) SDK 尚未开放，直接透传会报
    // UnknownParameter: The parameter `ChannelId` is not recognized。因此暂缓发送，等 CAPI SDK
    // 版本同步 proto 后再启用。目前渠道过滤走 UserId 兜底。
    // if (params.ChannelId) payload.ChannelId = params.ChannelId;
    if (params.Keyword) payload.Keyword = params.Keyword;
    if (typeof params.Offset === 'number') payload.Offset = params.Offset;
    if (typeof params.Limit === 'number') payload.Limit = params.Limit;

    const response: DescribeConversationListResponse = await httpService.post(path, {
        ApplicationId: applicationId,
        Payload: payload,
    });
    const data = response?.Response || ({} as DescribeConversationListResponse['Response']);
    if (data?.Error?.Code) {
        throw new Error(data.Error.Message || String(data.Error.Code));
    }
    const list = (data.Conversations || data.ConversationList || []) as CapiConversationItem[];
    const total = Number(data.TotalCount ?? list.length) || list.length;
    return { conversations: list, totalCount: total };
};

/** ListDir 请求参数 */
export interface ListDirParams {
    /** 应用 ID */
    app_id: string;
    /** 目录路径 */
    path: string;
    /** 遍历深度，默认 1 */
    depth?: number;
    /** 工作空间 ID */
    workspace_id?: string;
}

/** 文件/目录条目 */
export interface DirEntry {
    /** 文件/目录名称 */
    name: string;
    /** 类型：FILE_TYPE_DIRECTORY 或 FILE_TYPE_FILE */
    type: 'FILE_TYPE_DIRECTORY' | 'FILE_TYPE_FILE';
    /** 完整路径 */
    path: string;
    /** 文件大小（字节，字符串形式） */
    size?: string;
    /** 文件权限模式 */
    mode?: number;
    /** 权限字符串，如 "drwxr-xr-x" */
    permissions?: string;
    /** 文件所有者 */
    owner?: string;
    /** 文件所属组 */
    group?: string;
    /** 修改时间（ISO 格式） */
    modifiedTime?: string;
}

/** ListDir 响应 */
export interface ListDirResponse {
    Response: {
        entries: DirEntry[];
    };
}

/**
 * 获取目录列表
 * @param params 请求参数
 * @param applicationId 应用 ID
 * @param apiPath API 路径
 */
export const listDir = async (
    params: ListDirParams,
    applicationId: string,
    apiPath?: string
): Promise<ListDirResponse['Response']> => {
    const path = apiPath || defaultApiDetailConfig.listDirApi!;
    try {
        const response: ListDirResponse = await httpService.post(
            path,
            {
                ApplicationId: applicationId,
                Payload: params,
            }
        );
        return response.Response;
    } catch (error) {
        console.error('获取目录列表失败:', error);
        throw error;
    }
};

/** FetchFile 请求参数 */
export interface FetchFileParams {
    /** 应用 ID */
    app_id: string;
    /** 工作空间 ID */
    workspace_id: string;
    /** 文件路径，如 /workdir/main.py */
    path: string;
}

/** FetchFile 响应 */
export interface FetchFileResponse {
    Response: {
        /** HTTP 状态码 */
        status_code: number;
        /** 文件 MIME 类型 */
        content_type: string;
        /** 文件文本内容 */
        content: string;
        /** COS 预签名下载 URL */
        cos_url: string;
        /** 文档预览 URL（WebOffice 预览地址） */
        preview_url: string;
    };
}

/**
 * 获取文件并转存到 COS，返回预签名预览链接
 * @param params 请求参数
 * @param applicationId 应用 ID
 * @param requestConfig 额外的请求配置（如 timeout）
 */
export const fetchFile = async (
    params: FetchFileParams,
    applicationId: string,
    requestConfig?: { timeout?: number },
    apiPath?: string
): Promise<FetchFileResponse['Response']> => {
    const path = apiPath || defaultApiDetailConfig.fetchFileApi!;
    try {
        const response: FetchFileResponse = await httpService.post(
            path,
            {
                ApplicationId: applicationId,
                Payload: params,
            },
            requestConfig
        );
        return response.Response;
    } catch (error) {
        console.error('获取文件失败:', error);
        throw error;
    }
};

/**
 * 生成同域的文件代理下载 URL
 *
 * 后端 GET /file/download 接口会从工作空间获取文件内容后直接返回，
 * 前端使用此 URL 即可下载/预览文件，不存在跨域问题。
 *
 * @param params 文件参数
 * @param applicationId 应用配置 ID（用于定位 vendor 实例）
 * @returns 同域的文件下载 URL
 */
export const getFileDownloadUrl = (
    params: FetchFileParams,
    applicationId: string
): string => {
    const baseURL = getAxiosBaseURL().replace(/\/+$/, '');
    const queryParams = new URLSearchParams({
        ApplicationId: applicationId,
        AppId: params.app_id,
        WorkspaceId: params.workspace_id,
        Path: params.path,
    });
    return `${baseURL}/file/download?${queryParams.toString()}`;
};

/** ListModel 请求参数 */
export interface ListModelParams {
    /** 应用类型，例如 knowledge_qa */
    AppType?: string;
    /** 空间 ID，默认 default_space */
    SpaceId?: string;   
    Pattern: string;
    ModelCategory: string;
}

/** ListModel 返回的原始模型条目（后端字段，PascalCase） */
export interface ListModelRawItem {
    ModelName: string;
    AliasName?: string;
    Icon?: string;
    ModelDesc?: string;
    PromptWordsLimit?: string;
    InputLenLimit?: string | number;
    ModelTags?: string[];
    ModelUiTags?: Array<{ text: string; theme?: string; tips?: string }>;
    ResourceStatus?: number;
    IsExclusive?: boolean;
    ProviderType?: string;
    ProviderAliasName?: string;
    IsFree?: boolean;
    IsDefault?: boolean;
    IsDeepThinking?: boolean;
    ModelCategory?: string;
    [key: string]: any;
}

/** ListModel 响应 */
export interface ListModelResponse {
    Response?: {
        RequestId?: string;
        List?: ListModelRawItem[];
    };
    [key: string]: any;
}

/**
 * 获取模型列表
 * @param params 请求参数（space_id 缺省时为 'default'）
 */
export const fetchModelList = async (
    params: ListModelParams,
    applicationId: string,
): Promise<ListModelRawItem[]> => {
    const path = defaultApiDetailConfig.listModelApi!;   
    try {
        const response: ListModelResponse = await httpService.post(path, {
             ApplicationId: applicationId,
             Payload: params
        });
        return response?.Response?.List || [];
    } catch (error) {
        console.error('获取模型列表失败:', error);
        throw error;
    }
};

/** DescribeAgentSummaryList 请求 Payload */
export interface DescribeAgentSummaryListPayload {
    /** 查询范围 0-跨应用 1-单应用 */
    Scope: number;
    /** 应用 ID（Scope=SINGLE_APP 时必填） */
    AppId?: string;
    /** 1-开发域 2-生产域 */
    Domain?: number;
    /** 每页数量 */
    PageSize?: number;
    /** 页码，从 0 开始 */
    PageNumber?: number;
    /** 过滤条件 */
    FilterList?: Array<{ Name: string; Operator?: number; ValueList?: string[] }>;
}

/** Agent 摘要信息 */
export interface AgentSummary {
    AgentId: string;
    Profile?: { [key: string]: any };
    AdvancedConfig?: { [key: string]: any };
    Instructions?: string;
}

/** DescribeAgentSummaryList 响应 */
export interface DescribeAgentSummaryListResponse {
    Response: {
        TotalCount: number;
        AgentList?: AgentSummary[];
        RequestId?: string;
    };
}

/**
 * 获取 Agent 摘要列表
 * @param payload 请求 Payload
 * @param applicationId 应用 ID（作为外层 ApplicationId 透传给 /adp 代理）
 * @param apiPath 接口路径，缺省走 defaultApiDetailConfig.describeAgentSummaryListApi
 */
export const describeAgentSummaryList = async (
    payload: DescribeAgentSummaryListPayload,
    applicationId: string,
    apiPath?: string
): Promise<DescribeAgentSummaryListResponse['Response']> => {
    const path = apiPath || defaultApiDetailConfig.describeAgentSummaryListApi!;
    try {
        const response: DescribeAgentSummaryListResponse = await httpService.post(
            path,
            {
                ApplicationId: applicationId,
                Payload: payload,
            }
        );
        return response.Response;
    } catch (error) {
        console.error('获取 Agent 摘要列表失败:', error);
        throw error;
    }
};

/** AgentSource 枚举（1-开发域 2-发布域 3-用户端） */
export const AGENT_SOURCE = {
    UNSPECIFIED: 0,
    DEV: 1,
    PROD: 2,
    USER: 3,
} as const;

/** CopyAgentFromApp 请求 Payload */
export interface CopyAgentFromAppPayload {
    /** 应用 ID */
    AppId: string;
}

/** CopyAgentFromApp 响应 */
export interface CopyAgentFromAppResponse {
    Response: {
        /** 新生成的主 Agent Id */
        ParentAgentId: string;
        RequestId?: string;
    };
}

/**
 * 从应用复制 Agent，返回新生成的 AgentId
 * @param payload 请求 Payload
 * @param applicationId 应用 ID（作为外层 ApplicationId 透传给 /adp 代理）
 */
export const copyAgentFromApp = async (
    payload: CopyAgentFromAppPayload,
    applicationId: string,
): Promise<CopyAgentFromAppResponse['Response']> => {
    const path = defaultApiDetailConfig.copyAgentFromAppApi!;
    try {
        const response: CopyAgentFromAppResponse = await httpService.post(
            path,
            {
                ApplicationId: applicationId,
                Payload: {
                    Kind: 1, 
                    ...payload,
                },
            }
        );
        return response.Response;
    } catch (error) {
        console.error('CopyAgentFromApp 请求失败:', error);
        throw error;
    }
};

/** 本地 GET /agent/config 响应 */
export interface GetAgentConfigResponse {
    Response: {
        ApplicationId: string;
        AgentId: string | null;
    };
}

/**
 * 从本地后端查询当前用户在指定 application 下已绑定的 AgentId。
 * 未绑定时 AgentId 为 null。
 * @param applicationId 应用 ID
 */
export const getAgentConfig = async (
    applicationId: string,
): Promise<GetAgentConfigResponse['Response']> => {
    const path = defaultApiDetailConfig.agentConfigApi!;
    try {
        const response: GetAgentConfigResponse = await httpService.get(path, {
            ApplicationId: applicationId,
        });
        return response.Response;
    } catch (error) {
        console.error('查询本地 AgentConfig 失败:', error);
        throw error;
    }
};

/** 本地 POST /agent/config 响应 */
export interface SaveAgentConfigResponse {
    Response: {
        ApplicationId: string;
        AgentId: string;
    };
}

/**
 * 将当前用户在指定 application 下的 AgentId 上报并落库（upsert）。
 * @param applicationId 应用 ID
 * @param agentId 要绑定的 AgentId
 */
export const saveAgentConfig = async (
    applicationId: string,
    agentId: string,
): Promise<SaveAgentConfigResponse['Response']> => {
    const path = defaultApiDetailConfig.agentConfigApi!;
    try {
        const response: SaveAgentConfigResponse = await httpService.post(path, {
            ApplicationId: applicationId,
            AgentId: agentId,
        });
        return response.Response;
    } catch (error) {
        console.error('保存本地 AgentConfig 失败:', error);
        throw error;
    }
};

/** CreateConversation 会话类型 */
export const ConversationType = {
    /** Web 端会话 */
    CONVERSATION_TYPE_VISITOR: 1   
} as const;

export type ConversationTypeValue = typeof ConversationType[keyof typeof ConversationType];

/** CreateConversation 请求参数 */
export interface CreateConversationParams {
    /** 会话类型 */
    Type: ConversationTypeValue;
    /** 应用 ID */
    AppId: string;
    /** Type=CONVERSATION_TYPE_API 时必填，访客ID */
    UserId?: string;
    /** Type=CONVERSATION_TYPE_API 时必填，应用密钥 */
    AppKey?: string;
    /** Type=CONVERSATION_TYPE_SHARE 时必填，分享码 */
    ShareCode?: string;
    /** Agent ID */
    AgentId?: string;
}

/** CreateConversation 响应 */
export interface CreateConversationResponse {
    Response: {
        ConversationId: string;
    };
}

/**
 * 创建会话
 * @param params 请求参数
 * @param applicationId 应用 ID（作为外层 ApplicationId 透传给 /adp 代理）
 * @param apiPath API 路径
 */
export const createConversation = async (
    params: CreateConversationParams,
    applicationId: string,
    apiPath?: string
): Promise<string> => {
    const path = apiPath || defaultApiDetailConfig.createConversationApi!;
    try {
        const response: CreateConversationResponse = await httpService.post(
            path,
            {
                ApplicationId: applicationId,
                Payload: params,
            }
        );
        return response.Response.ConversationId;
    } catch (error) {
        console.error('创建会话失败:', error);
        throw error;
    }
};

/** 快捷按钮建议项 */
export interface SuggestionItem {
    /** 建议 ID */
    SuggestionId: string;
    /** 建议标题 */
    Title: string;
    /** 建议提示内容 */
    PromptContent: string;
}

/** 快捷按钮建议分组 */
export interface SuggestionGroup {
    /** 分组 ID */
    GroupId: string;
    /** 分组图标 URL */
    IconUrl: string;
    /** 分组名称 */
    Name: string;
    /** 分组下的建议列表 */
    SuggestionList: SuggestionItem[];
}

/** 快捷按钮建议列表响应 */
export interface SuggestionListResponse {
    Response: {
        GroupList: SuggestionGroup[];
    };
}

/**
 * 获取快捷按钮建议列表
 * @param apiPath API 路径
 */
export const fetchSuggestionList = async (apiPath?: string): Promise<SuggestionGroup[]> => {
    const path = apiPath || defaultApiDetailConfig.suggestionListApi!;
    try {
        const response: SuggestionListResponse = await httpService.get(path);
        return response?.Response?.GroupList || [];
    } catch (error) {
        console.error('获取快捷按钮建议列表失败:', error);
        throw error;
    }
};