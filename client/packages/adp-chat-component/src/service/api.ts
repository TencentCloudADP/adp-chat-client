/**
 * API 服务模块
 * 提供与后端交互的所有请求方法
 */
import { httpService } from './httpService';
import type { Application } from '../model/application';
import type { ChatConversation, Record, ChatConversationProps } from '../model/chat';
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
    asrUrlApi: '/helper/asr/url',
    systemConfigApi: '/system/config',
};

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
export const uploadFile = async (file: File, applicationId?: string, apiPath?: string): Promise<any> => {
    if (!apiPath) throw new Error('apiPath is required');
    // 构建带参数的 URL
    const params = new URLSearchParams();
    if (applicationId) {
        params.append('ApplicationId', applicationId);
    }
    if (file.type) {
        params.append('Type', file.type);
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
