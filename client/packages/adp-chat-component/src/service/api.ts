/**
 * API 服务模块
 * 提供各种数据接口的请求方法
 */
import { httpService } from './httpService';
import type { Application } from '../model/application';
import type { ChatConversation, Record, ChatConversationProps } from '../model/chat';
import type { AxiosRequestConfig } from 'axios';

/**
 * API 路径配置接口
 */
export interface ApiConfig {
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
}

/**
 * 默认 API 路径配置
 */
export const defaultApiConfig: ApiConfig = {
    applicationListApi: '/application/list',
    conversationListApi: '/chat/conversations',
    conversationDetailApi: '/chat/messages',
    sendMessageApi: '/chat/message',
    rateApi: '/feedback/rate',
    shareApi: '/share/create',
    userInfoApi: '/account/info',
    uploadApi: '/file/upload',
    asrUrlApi: '/helper/asr/url',
};

/**
 * 加载应用列表
 * @param apiPath API 路径
 */
export const fetchApplicationList = async (apiPath?: string): Promise<Application[]> => {
    const url = apiPath || defaultApiConfig.applicationListApi!;
    try {
        const response: { Applications: Application[] } = await httpService.get(url);
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
    const url = apiPath || defaultApiConfig.conversationListApi!;
    try {
        const response: ChatConversation[] = await httpService.get(url);
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
    const url = apiPath || defaultApiConfig.conversationDetailApi!;
    try {
        const response = await httpService.get(url, params);
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
    const url = apiPath || defaultApiConfig.sendMessageApi!;
    const _options = {
        responseType: 'stream',
        adapter: 'fetch',
        timeout: 1000 * 600,
        ...options,
    } as AxiosRequestConfig;
    return httpService.post(url, params, _options);
};

/**
 * 评分
 * @param params 评分参数
 * @param apiPath API 路径
 */
export const rateMessage = async (params: object, apiPath?: string): Promise<any> => {
    const url = apiPath || defaultApiConfig.rateApi!;
    try {
        const response = await httpService.post(url, params);
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
    const url = apiPath || defaultApiConfig.shareApi!;
    try {
        const response = await httpService.post(url, params);
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
    const url = apiPath || defaultApiConfig.userInfoApi!;
    try {
        const response: { Info: { Name: string; Avatar: string } } = await httpService.get(url);
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
    const basePath = apiPath || defaultApiConfig.uploadApi!;
    // 构建带参数的 URL
    const params = new URLSearchParams();
    if (applicationId) {
        params.append('ApplicationId', applicationId);
    }
    if (file.type) {
        params.append('Type', file.type);
    }
    const url = params.toString() ? `${basePath}?${params.toString()}` : basePath;
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
    const url = apiPath || defaultApiConfig.asrUrlApi!;
    try {
        const response = await httpService.get(url);
        return response;
    } catch (error) {
        console.error('获取ASR URL失败:', error);
        throw error;
    }
};
