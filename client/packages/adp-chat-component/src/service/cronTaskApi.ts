/**
 * 定时任务（CronTask）API 服务
 *
 * 所有请求都通过 /adp 代理，遵循目标项目的统一约定：
 * POST { ApplicationId, Payload }
 */
import { httpService } from './httpService';
import { defaultApiDetailConfig } from './api';
import type {
    TimerTask,
    TimerTaskSummary,
    TimerRunLog,
    TimerProfile,
    TimerConfig,
    TimerTaskStatusValue,
} from '../model/cronTask';

// ============================================================
// 扩展默认 API 路径
// ============================================================

/**
 * CronTask 相关 API 路径
 * 会在模块加载时合并到 defaultApiDetailConfig 中，
 * 上层通过 `apiConfig.apiDetailConfig` 可覆盖。
 */
export interface CronTaskApiPaths {
    createTimerTaskApi?: string;
    modifyTimerTaskApi?: string;
    describeTimerTaskApi?: string;
    describeTimerTaskSummaryListApi?: string;
    pauseTimerTaskApi?: string;
    resumeTimerTaskApi?: string;
    deleteTimerTaskApi?: string;
    runTimerTaskNowApi?: string;
    describeTimerTaskRunLogListApi?: string;
    markTimerTaskRunLogReadApi?: string;
}

export const defaultCronTaskApiPaths: Required<CronTaskApiPaths> = {
    createTimerTaskApi: '/adp/CreateTimerTask',
    modifyTimerTaskApi: '/adp/ModifyTimerTask',
    describeTimerTaskApi: '/adp/DescribeTimerTask',
    describeTimerTaskSummaryListApi: '/adp/DescribeTimerTaskSummaryList',
    pauseTimerTaskApi: '/adp/PauseTimerTask',
    resumeTimerTaskApi: '/adp/ResumeTimerTask',
    deleteTimerTaskApi: '/adp/DeleteTimerTask',
    runTimerTaskNowApi: '/adp/RunTimerTaskNow',
    describeTimerTaskRunLogListApi: '/adp/DescribeTimerTaskRunLogList',
    markTimerTaskRunLogReadApi: '/adp/MarkTimerTaskRunLogRead',
};

// 合并到全局默认配置，供 useApiConfig 消费
Object.assign(defaultApiDetailConfig, defaultCronTaskApiPaths);

// 让 ApiDetailConfig 类型层面也感知这些字段（模块增强）
declare module './api' {
    interface ApiDetailConfig extends CronTaskApiPaths {}
}

// ============================================================
// 请求 & 响应
// ============================================================

/** CreateTimerTask 请求 Payload */
export interface CreateTimerTaskPayload {
    SpaceId?: string;
    Profile: TimerProfile;
    Config: TimerConfig;
}

export interface CreateTimerTaskResponse {
    Response: {
        TimerId: string;
        RequestId?: string;
    };
}

/**
 * 新建定时任务
 */
export const createTimerTask = async (
    payload: CreateTimerTaskPayload,
    applicationId: string,
    apiPath?: string,
): Promise<string> => {
    const path = apiPath || defaultApiDetailConfig.createTimerTaskApi!;
    const response: CreateTimerTaskResponse = await httpService.post(path, {
        ApplicationId: applicationId,
        Payload: payload,
    });
    return response.Response.TimerId;
};

/** ModifyTimerTask 请求 Payload */
export interface ModifyTimerTaskPayload {
    SpaceId?: string;
    TimerId: string;
    Profile?: Partial<TimerProfile>;
    Config?: Partial<TimerConfig>;
    /** FieldMask：需要更新的字段路径列表 */
    UpdateMask: { Paths: string[] };
}

/**
 * 修改定时任务（局部更新）
 */
export const modifyTimerTask = async (
    payload: ModifyTimerTaskPayload,
    applicationId: string,
    apiPath?: string,
): Promise<void> => {
    const path = apiPath || defaultApiDetailConfig.modifyTimerTaskApi!;
    await httpService.post(path, {
        ApplicationId: applicationId,
        Payload: payload,
    });
};

/** DescribeTimerTask 请求 Payload */
export interface DescribeTimerTaskPayload {
    SpaceId?: string;
    TimerId: string;
}

export interface DescribeTimerTaskResponse {
    Response: {
        Task: TimerTask;
        RequestId?: string;
    };
}

/**
 * 获取任务详情
 */
export const describeTimerTask = async (
    payload: DescribeTimerTaskPayload,
    applicationId: string,
    apiPath?: string,
): Promise<TimerTask> => {
    const path = apiPath || defaultApiDetailConfig.describeTimerTaskApi!;
    const response: DescribeTimerTaskResponse = await httpService.post(path, {
        ApplicationId: applicationId,
        Payload: payload,
    });
    return response.Response.Task;
};

/** DescribeTimerTaskSummaryList 请求 Payload */
export interface DescribeTimerTaskSummaryListPayload {
    SpaceId?: string;
    /** 页码，从 0 开始 */
    PageNumber?: number;
    /** 每页数量 */
    PageSize?: number;
    /** 状态过滤 */
    StatusList?: TimerTaskStatusValue[];
}

export interface DescribeTimerTaskSummaryListResponse {
    Response: {
        TotalCount: number;
        TaskList?: TimerTaskSummary[];
        RequestId?: string;
    };
}

/**
 * 获取任务摘要列表（分页）
 */
export const describeTimerTaskSummaryList = async (
    payload: DescribeTimerTaskSummaryListPayload,
    applicationId: string,
    apiPath?: string,
): Promise<DescribeTimerTaskSummaryListResponse['Response']> => {
    const path = apiPath || defaultApiDetailConfig.describeTimerTaskSummaryListApi!;
    const response: DescribeTimerTaskSummaryListResponse = await httpService.post(path, {
        ApplicationId: applicationId,
        Payload: payload,
    });
    return response.Response;
};

export interface TimerIdPayload {
    SpaceId?: string;
    TimerId: string;
}

/**
 * 暂停任务
 */
export const pauseTimerTask = async (
    payload: TimerIdPayload,
    applicationId: string,
    apiPath?: string,
): Promise<void> => {
    const path = apiPath || defaultApiDetailConfig.pauseTimerTaskApi!;
    await httpService.post(path, {
        ApplicationId: applicationId,
        Payload: payload,
    });
};

/**
 * 恢复任务
 */
export const resumeTimerTask = async (
    payload: TimerIdPayload,
    applicationId: string,
    apiPath?: string,
): Promise<void> => {
    const path = apiPath || defaultApiDetailConfig.resumeTimerTaskApi!;
    await httpService.post(path, {
        ApplicationId: applicationId,
        Payload: payload,
    });
};

/**
 * 删除任务
 */
export const deleteTimerTask = async (
    payload: TimerIdPayload,
    applicationId: string,
    apiPath?: string,
): Promise<void> => {
    const path = apiPath || defaultApiDetailConfig.deleteTimerTaskApi!;
    await httpService.post(path, {
        ApplicationId: applicationId,
        Payload: payload,
    });
};

export interface RunTimerTaskNowResponse {
    Response: {
        /** 触发后生成的运行日志 ID / 会话 ID（可选） */
        LogId?: string;
        SessionId?: string;
        RequestId?: string;
    };
}

/**
 * 立即执行一次
 */
export const runTimerTaskNow = async (
    payload: TimerIdPayload,
    applicationId: string,
    apiPath?: string,
): Promise<RunTimerTaskNowResponse['Response']> => {
    const path = apiPath || defaultApiDetailConfig.runTimerTaskNowApi!;
    const response: RunTimerTaskNowResponse = await httpService.post(path, {
        ApplicationId: applicationId,
        Payload: payload,
    });
    return response.Response;
};

/** DescribeTimerTaskRunLogList 请求 Payload */
export interface DescribeTimerTaskRunLogListPayload {
    SpaceId?: string;
    TimerId: string;
    PageNumber?: number;
    PageSize?: number;
}

export interface DescribeTimerTaskRunLogListResponse {
    Response: {
        TotalCount: number;
        LogList?: TimerRunLog[];
        RequestId?: string;
    };
}

/**
 * 获取任务运行日志
 */
export const describeTimerTaskRunLogList = async (
    payload: DescribeTimerTaskRunLogListPayload,
    applicationId: string,
    apiPath?: string,
): Promise<DescribeTimerTaskRunLogListResponse['Response']> => {
    const path = apiPath || defaultApiDetailConfig.describeTimerTaskRunLogListApi!;
    const response: DescribeTimerTaskRunLogListResponse = await httpService.post(path, {
        ApplicationId: applicationId,
        Payload: payload,
    });
    return response.Response;
};

/** MarkTimerTaskRunLogRead 请求 Payload */
export interface MarkTimerTaskRunLogReadPayload {
    SpaceId?: string;
    TimerId: string;
    /** 要标记为已读的 LogId 列表；为空时标记全部 */
    LogIds?: string[];
}

/**
 * 标记运行日志已读
 */
export const markTimerTaskRunLogRead = async (
    payload: MarkTimerTaskRunLogReadPayload,
    applicationId: string,
    apiPath?: string,
): Promise<void> => {
    const path = apiPath || defaultApiDetailConfig.markTimerTaskRunLogReadApi!;
    await httpService.post(path, {
        ApplicationId: applicationId,
        Payload: payload,
    });
};
