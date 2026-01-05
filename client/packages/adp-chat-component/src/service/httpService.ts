/**
 * HTTP 服务模块
 * 提供基础的 HTTP 请求封装
 */
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

// 默认配置
const defaultConfig: AxiosRequestConfig = {
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
};

// 创建 axios 实例
let axiosInstance: AxiosInstance = axios.create(defaultConfig);

// 标记是否设置了自定义响应拦截器
let hasCustomResponseInterceptor = false;

/**
 * 配置 axios 实例
 * @param config axios 配置
 */
export const configureAxios = (config: AxiosRequestConfig) => {
    axiosInstance = axios.create({
        ...defaultConfig,
        ...config,
    });
    // 重置拦截器标记
    hasCustomResponseInterceptor = false;
};

/**
 * 设置请求拦截器
 * @param onFulfilled 成功回调
 * @param onRejected 失败回调
 */
export const setRequestInterceptor = (
    onFulfilled?: (config: any) => any,
    onRejected?: (error: any) => any
) => {
    axiosInstance.interceptors.request.use(onFulfilled, onRejected);
};

/**
 * 设置响应拦截器
 * @param onFulfilled 成功回调
 * @param onRejected 失败回调
 */
export const setResponseInterceptor = (
    onFulfilled?: (response: AxiosResponse) => any,
    onRejected?: (error: any) => any
) => {
    hasCustomResponseInterceptor = true;
    axiosInstance.interceptors.response.use(onFulfilled, onRejected);
};

/**
 * HTTP 服务对象
 */
export const httpService = {
    /**
     * GET 请求
     * @param url 请求地址
     * @param params 请求参数
     * @param config 额外配置
     */
    async get<T = any>(url: string, params?: object, config?: AxiosRequestConfig): Promise<T> {
        const response = await axiosInstance.get(url, { params, ...config });
        // 如果设置了自定义响应拦截器，拦截器已经处理了 response.data
        return (hasCustomResponseInterceptor ? response : response.data) as T;
    },

    /**
     * POST 请求
     * @param url 请求地址
     * @param data 请求数据
     * @param config 额外配置
     */
    async post<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
        const response = await axiosInstance.post(url, data, config);
        return (hasCustomResponseInterceptor ? response : response.data) as T;
    },

    /**
     * PUT 请求
     * @param url 请求地址
     * @param data 请求数据
     * @param config 额外配置
     */
    async put<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
        const response = await axiosInstance.put(url, data, config);
        return (hasCustomResponseInterceptor ? response : response.data) as T;
    },

    /**
     * DELETE 请求
     * @param url 请求地址
     * @param config 额外配置
     */
    async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await axiosInstance.delete(url, config);
        return (hasCustomResponseInterceptor ? response : response.data) as T;
    },
};

export default httpService;
