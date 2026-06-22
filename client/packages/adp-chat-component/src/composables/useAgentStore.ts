/**
 * Agent 全局 Store Composable
 *
 * 采用模块作用域单例 ref 实现的全局共享状态：所有调用 useAgentStore() 的组件
 * 拿到的都是同一份响应式数据。
 *
 * 设计要点：
 *  - agentId 按 applicationId 维度绑定存储（一个 application 对应一个当前 agentId 与一份 agentList）
 *  - 在 Sender 初始化时调用 fetchAndSetAgentId(applicationId, ...)：
 *      1) 先调用本地后端 GET /agent/config 查询 DB 中是否已绑定 agentId：
 *           - 命中：直接写入 store 并返回，跳过走外部 ADP 接口
 *           - 未命中：进入下一步
 *      2) 调用 DescribeAgentSummaryList 拿到该应用下首个 agent_id（作为 sourceAgentId）
 *      3) 调用 CopyAgent 基于该 sourceAgentId 复制出新的 agent_id
 *      4) 调用 POST /agent/config 将新 agent_id 回写本地 DB
 *      5) 把"新生成的 agent_id"绑定写入该 applicationId 的槽位（即 store 中最终保存的 id）
 *  - 业务侧通过 getAgentIdByAppId(applicationId) 或响应式 agentIdMap[applicationId] 获取
 */
import { ref, readonly, computed, type Ref, type ComputedRef } from 'vue';
import {
    describeAgentSummaryList,
    copyAgent,
    getAgentConfig,
    saveAgentConfig,
    AGENT_SOURCE,
    type AgentSummary,
    type DescribeAgentSummaryListPayload,
    type CopyAgentPayload,
} from '../service/api';

// ------------------------------ 模块作用域单例 state ------------------------------
/** 按 applicationId 绑定的 agent_id 映射：{ [applicationId]: agentId }（存储 CopyAgent 后的新 agentId） */
const agentIdMap = ref<Record<string, string>>({});
/** 按 applicationId 绑定的 source agent_id 映射（DescribeAgentSummaryList 拿到的原始 agentId） */
const sourceAgentIdMap = ref<Record<string, string>>({});
/** 按 applicationId 绑定的 Agent 摘要列表映射 */
const agentListMap = ref<Record<string, AgentSummary[]>>({});
/** 按 applicationId 维度的加载状态：{ [applicationId]: boolean } */
const loadingMap = ref<Record<string, boolean>>({});
/** 按 applicationId 维度的 inflight Promise，避免并发重复请求 */
const inflightMap = new Map<string, Promise<string>>();

/** AdpDomain：1-开发域 2-生产域 */
export const AGENT_DOMAIN = {
    DEV: 1,
    PROD: 2,
} as const;

/** SummaryScope：0-跨应用 1-单应用（按方案要求默认传 0） */
export const AGENT_SCOPE = {
    CROSS_APP: 0,
    SINGLE_APP: 1,
} as const;

/** 重新导出 AgentSource 便于业务侧使用 */
export { AGENT_SOURCE };

/** fetchAndSetAgentId 选项 */
export interface FetchAgentIdOptions {
    /** 应用 ID（作为存储 key，也透传给 /adp 代理） */
    applicationId: string;
    /** Scope，默认 0 */
    scope?: number;
    /** Domain，默认 2（生产域） */
    domain?: number;
    /** 每页数量，默认 1 */
    pageSize?: number;
    /** 页码，默认 0 */
    pageNumber?: number;
    /** DescribeAgentSummaryList 接口路径覆盖（可选） */
    apiPath?: string;
    /** CopyAgent 接口路径覆盖（可选） */
    copyAgentApiPath?: string;
    /** 本地 /agent/config 接口路径覆盖（可选） */
    agentConfigApiPath?: string;
    /** CopyAgent 时使用的 AgentSource，默认 3（用户端） */
    agentSource?: number;
    /** 是否强制刷新（默认 false，已绑定过 agentId 时不再重复请求；强制时也会跳过本地 DB 查询） */
    force?: boolean;
}

/**
 * useAgentStore：返回全局共享的 Agent 上下文状态以及对应的操作方法。
 */
export function useAgentStore() {
    /**
     * 拉取指定 applicationId 的 Agent 摘要列表，并复制出一个新的 agent，
     * 把"复制后的新 agent_id"绑定写入该 applicationId 的槽位。
     * @returns 拉取并复制后得到的新 agent_id（失败或为空时返回 ''）
     */
    const fetchAndSetAgentId = async (
        options: FetchAgentIdOptions
    ): Promise<string> => {
        const {
            applicationId,
            scope = AGENT_SCOPE.CROSS_APP,
            domain = AGENT_DOMAIN.PROD,
            pageSize = 1,
            pageNumber = 0,
            apiPath,
            copyAgentApiPath,
            agentConfigApiPath,
            agentSource = AGENT_SOURCE.USER,
            force = false,
        } = options;

        if (!applicationId) {
            console.warn('[useAgentStore] applicationId 为空，跳过 DescribeAgentSummaryList');
            return '';
        }

        // 命中前端内存缓存：同一 applicationId 已经绑定过新 agentId 且非强制刷新则直接复用
        if (!force && agentIdMap.value[applicationId]) {
            return agentIdMap.value[applicationId];
        }

        // 同一 applicationId 已有 inflight 请求，直接复用，避免并发重复调用
        const inflight = inflightMap.get(applicationId);
        if (!force && inflight) {
            return inflight;
        }

        const task = (async (): Promise<string> => {
            try {
                loadingMap.value = { ...loadingMap.value, [applicationId]: true };

                // 1) 优先查本地后端 DB（非强制刷新时），命中则直接返回，不再走外部 ADP 接口
                if (!force) {
                    try {
                        const localResp = await getAgentConfig(
                            applicationId,
                            agentConfigApiPath
                        );
                        const localAgentId = localResp?.AgentId || '';
                        if (localAgentId) {
                            agentIdMap.value = {
                                ...agentIdMap.value,
                                [applicationId]: localAgentId,
                            };
                            return localAgentId;
                        }
                    } catch (e) {
                        // 本地查询失败不阻断主流程，继续走外部接口兑底
                        console.warn(
                            '[useAgentStore] 本地 AgentConfig 查询失败，回退外部接口:',
                            e
                        );
                    }
                }

                // 2) 拉取 Agent 摘要列表
                const summaryPayload: DescribeAgentSummaryListPayload = {
                    Scope: scope,
                    AppId: applicationId,
                    Domain: domain,
                    PageSize: pageSize,
                    PageNumber: pageNumber,
                };
                const summaryResp = await describeAgentSummaryList(
                    summaryPayload,
                    applicationId,
                    apiPath
                );
                const list = summaryResp?.AgentList ?? [];
                const sourceAgentId = list[0]?.AgentId || '';

                agentListMap.value = { ...agentListMap.value, [applicationId]: list };
                sourceAgentIdMap.value = {
                    ...sourceAgentIdMap.value,
                    [applicationId]: sourceAgentId,
                };

                if (!sourceAgentId) {
                    console.warn(
                        '[useAgentStore] DescribeAgentSummaryList 返回空，跳过 CopyAgent'
                    );
                    agentIdMap.value = { ...agentIdMap.value, [applicationId]: '' };
                    return '';
                }

                // 3) 基于首个 agent 复制出一个新的 agent
                const copyPayload: CopyAgentPayload = {
                    AppId: applicationId,
                    AgentId: sourceAgentId,
                    Source: agentSource,
                };
                const copyResp = await copyAgent(
                    copyPayload,
                    applicationId,
                    copyAgentApiPath
                );
                const newAgentId = copyResp?.AgentId || '';

                // 4) 把"新生成的 agent_id"写入 store（最终对外暴露的 id）
                agentIdMap.value = {
                    ...agentIdMap.value,
                    [applicationId]: newAgentId,
                };

                // 5) 回写本地 DB，供下次/多端复用（失败不阻断主流程）
                if (newAgentId) {
                    try {
                        await saveAgentConfig(
                            applicationId,
                            newAgentId,
                            agentConfigApiPath
                        );
                    } catch (e) {
                        console.warn(
                            '[useAgentStore] 保存本地 AgentConfig 失败（不影响本次使用）:',
                            e
                        );
                    }
                }

                return newAgentId;
            } catch (error) {
                console.error('[useAgentStore] 获取/复制 Agent 失败:', error);
                return '';
            } finally {
                loadingMap.value = { ...loadingMap.value, [applicationId]: false };
                inflightMap.delete(applicationId);
            }
        })();

        inflightMap.set(applicationId, task);
        return task;
    };

    /**
     * 根据 applicationId 获取已绑定的 agent_id（同步快照值）。
     * 返回的是 CopyAgent 之后的新 agentId。
     */
    const getAgentIdByAppId = (applicationId: string): string => {
        if (!applicationId) return '';
        return agentIdMap.value[applicationId] || '';
    };

    /**
     * 根据 applicationId 获取响应式的 agent_id ComputedRef，
     * 适合在模板/setup 中持续追踪指定 application 的当前 agentId。
     */
    const useAgentIdRef = (applicationId: string | Ref<string>): ComputedRef<string> => {
        return computed(() => {
            const appId = typeof applicationId === 'string' ? applicationId : applicationId.value;
            if (!appId) return '';
            return agentIdMap.value[appId] || '';
        });
    };

    /**
     * 根据 applicationId 获取原始 source agent_id（DescribeAgentSummaryList 返回的）。
     */
    const getSourceAgentIdByAppId = (applicationId: string): string => {
        if (!applicationId) return '';
        return sourceAgentIdMap.value[applicationId] || '';
    };

    /**
     * 根据 applicationId 获取 Agent 列表（同步快照值）。
     */
    const getAgentListByAppId = (applicationId: string): AgentSummary[] => {
        if (!applicationId) return [];
        return agentListMap.value[applicationId] || [];
    };

    /**
     * 手动设置指定 applicationId 的 agent_id 绑定。
     */
    const setAgentIdByAppId = (applicationId: string, agentId: string) => {
        if (!applicationId) return;
        agentIdMap.value = { ...agentIdMap.value, [applicationId]: agentId };
    };

    /**
     * 清空指定 applicationId 的绑定（不传则清空全部）。
     */
    const resetAgentStore = (applicationId?: string) => {
        if (applicationId) {
            const nextIdMap = { ...agentIdMap.value };
            const nextSrcMap = { ...sourceAgentIdMap.value };
            const nextListMap = { ...agentListMap.value };
            const nextLoadingMap = { ...loadingMap.value };
            delete nextIdMap[applicationId];
            delete nextSrcMap[applicationId];
            delete nextListMap[applicationId];
            delete nextLoadingMap[applicationId];
            agentIdMap.value = nextIdMap;
            sourceAgentIdMap.value = nextSrcMap;
            agentListMap.value = nextListMap;
            loadingMap.value = nextLoadingMap;
            inflightMap.delete(applicationId);
        } else {
            agentIdMap.value = {};
            sourceAgentIdMap.value = {};
            agentListMap.value = {};
            loadingMap.value = {};
            inflightMap.clear();
        }
    };

    return {
        /** 全量 applicationId -> agentId（CopyAgent 后的新 id）映射（只读响应式引用） */
        agentIdMap: readonly(agentIdMap) as Readonly<Ref<Record<string, string>>>,
        /** 全量 applicationId -> source agentId（DescribeAgentSummaryList 原始 id）映射 */
        sourceAgentIdMap: readonly(sourceAgentIdMap) as Readonly<Ref<Record<string, string>>>,
        /** 全量 applicationId -> Agent 列表 映射（只读响应式引用） */
        agentListMap: readonly(agentListMap) as Readonly<Ref<Record<string, AgentSummary[]>>>,
        /** 全量 applicationId -> 加载状态 映射（只读响应式引用） */
        loadingMap: readonly(loadingMap) as Readonly<Ref<Record<string, boolean>>>,
        /** 异步拉取并按 applicationId 绑定 agentId（内部串联 DescribeAgentSummaryList -> CopyAgent） */
        fetchAndSetAgentId,
        /** 按 applicationId 同步获取 agentId（CopyAgent 后的新 id） */
        getAgentIdByAppId,
        /** 按 applicationId 同步获取 source agentId（原始 id） */
        getSourceAgentIdByAppId,
        /** 按 applicationId 获取响应式 agentId ComputedRef */
        useAgentIdRef,
        /** 按 applicationId 同步获取 agent 列表 */
        getAgentListByAppId,
        /** 按 applicationId 手动设置 agentId */
        setAgentIdByAppId,
        /** 清空指定/全部 applicationId 的绑定 */
        resetAgentStore,
    };
}

export default useAgentStore;
