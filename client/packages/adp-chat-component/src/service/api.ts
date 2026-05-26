/**
 * API 服务模块
 * 提供与后端交互的所有请求方法
 */
import { httpService } from './httpService';
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
        timeout: 1000 * 600,
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
export const fetchUserInfo = async (apiPath?: string): Promise<{ Name: string; Avatar: string }> => {
    if (!apiPath) throw new Error('apiPath is required');
    try {
        const response: { Info: { Name: string; Avatar: string } } = await httpService.get(apiPath);
        return response.Info || { Name: '', Avatar: '' };
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

/** 会话类型 */
export const ConversationType = {
    /** 全部 */
    CONVERSATION_TYPE_UNSPECIFIED: 0,
    /** API 类型 */
    CONVERSATION_TYPE_API: 1,
    /** 分享类型 */
    CONVERSATION_TYPE_SHARE: 2,
} as const;

export type ConversationType = (typeof ConversationType)[keyof typeof ConversationType];

/** DescribeConversationList 请求参数 */
export interface DescribeConversationListParams {
    /** 会话类型，传 CONVERSATION_TYPE_UNSPECIFIED 表示全部 */
    Type?: ConversationType;
    /** 应用 ID */
    AppId?: string;
    /** Type=CONVERSATION_TYPE_API 时必填，访客ID */
    UserId?: string;
    /** Type=CONVERSATION_TYPE_API 时必填，应用密钥 */
    AppKey?: string;
    /** 关键词 */
    Keyword?: string;
    /** 偏移量，配合 Limit 使用，从 0 开始 */
    Offset?: number;
    /** 限制数目，配合 Offset 使用 */
    Limit?: number;
    /** Type=CONVERSATION_TYPE_SHARE 时必填，分享码 */
    ShareCode?: string;
}

/** DescribeConversationList 响应 */
export interface DescribeConversationListResponse {
    Response: {
        ConversationList?: any[];
        TotalCount?: number;
        RequestId?: string;
    };
}

/**
 * 测试代码，验证接口协议转发
 * @param params 请求参数
 * @param applicationId 应用 ID
 */
export const describeConversationList = async (
    params: DescribeConversationListParams,
    applicationId: string
): Promise<DescribeConversationListResponse> => {
    try {
        const response: DescribeConversationListResponse = await httpService.post(
            '/adp/GetAppSecret',
            {
                ApplicationId: applicationId,
                Payload: {
                    AppBizId: applicationId,
                },
            }
        );
        return response;
    } catch (error) {
        console.error('获取会话列表失败:', error);
        throw error;
    }
};
