/**
 * Agent 全局 Store Composable
 *
 * 采用模块作用域单例 ref 实现的全局共享状态：所有调用 useAgentStore() 的组件
 * 拿到的都是同一份响应式数据。
 *
 * 设计要点：
 *  - agentId 按 applicationId 维度绑定存储（一个 application 对应一个当前 agentId）
 *  - 在 Sender 初始化时调用 fetchAndSetAgentId(applicationId, ...)：
 *      1) 先调用本地后端 GET /agent/config 查询 DB 中是否已绑定 agentId：
 *           - 命中：直接写入 store 并返回，跳过走外部 ADP 接口
 *           - 未命中：进入下一步
 *      2) 调用 CreateUserAgentList 创建新的 agent，返回 ParentAgentId
 *      3) 调用 POST /agent/config 将 ParentAgentId 回写本地 DB
 *      4) 把"新生成的 ParentAgentId"绑定写入该 applicationId 的槽位
 *  - 业务侧通过 getAgentIdByAppId(applicationId) 或响应式 agentIdMap[applicationId] 获取
 */
import { ref, readonly, computed, type Ref, type ComputedRef } from 'vue';
import {
    createUserAgentList,
    getAgentConfig,
    saveAgentConfig,
    type CreateUserAgentListPayload,
} from '../service/api';

// ------------------------------ 模块作用域单例 state ------------------------------
/** 按 applicationId 绑定的 agent_id 映射：{ [applicationId]: agentId }（存储 CreateUserAgentList 返回的 ParentAgentId） */
const agentIdMap = ref<Record<string, string>>({});
/** 按 applicationId 维度的加载状态：{ [applicationId]: boolean } */
const loadingMap = ref<Record<string, boolean>>({});
/** 按 applicationId 维度的 inflight Promise，避免并发重复请求 */
const inflightMap = new Map<string, Promise<string>>();

/** fetchAndSetAgentId 选项 */
export interface FetchAgentIdOptions {
    /** 应用 ID（作为存储 key，也透传给 /adp 代理） */
    applicationId: string;
    /** CreateUserAgentList 接口路径覆盖（可选） */
    createUserAgentListApiPath?: string;
    /** 本地 /agent/config 接口路径覆盖（可选） */
    agentConfigApiPath?: string;
    /** 是否强制刷新（默认 false，已绑定过 agentId 时不再重复请求；强制时也会跳过本地 DB 查询） */
    force?: boolean;
}

/**
 * useAgentStore：返回全局共享的 Agent 上下文状态以及对应的操作方法。
 */
export function useAgentStore() {
    /**
     * 调用 CreateUserAgentList 创建用户 Agent，把返回的 ParentAgentId 绑定写入该 applicationId 的槽位。
     * @returns 创建后得到的 ParentAgentId（失败或为空时返回 ''）
     */
    const fetchAndSetAgentId = async (
        options: FetchAgentIdOptions
    ): Promise<string> => {
        const {
            applicationId,
            agentConfigApiPath,
            force = false,
        } = options;

        if (!applicationId) {
            console.warn('[useAgentStore] applicationId 为空，跳过 CreateUserAgentList');
            return '';
        }

        // 命中前端内存缓存：同一 applicationId 已经绑定过 agentId 且非强制刷新则直接复用
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
                        // 本地查询失败不阻断主流程，继续走外部接口兜底
                        console.warn(
                            '[useAgentStore] 本地 AgentConfig 查询失败，回退外部接口:',
                            e
                        );
                    }
                }

                // 2) 调用 CreateUserAgentList 创建用户 Agent
                const payload: CreateUserAgentListPayload = {
                    AppId: applicationId,
                };
                const resp = await createUserAgentList(
                    payload,
                    applicationId,
                );
                const newAgentId = resp?.ParentAgentId || '';

                // 3) 把"新生成的 ParentAgentId"写入 store（最终对外暴露的 id）
                agentIdMap.value = {
                    ...agentIdMap.value,
                    [applicationId]: newAgentId,
                };

                // 4) 回写本地 DB，供下次/多端复用（失败不阻断主流程）
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
                console.error('[useAgentStore] CreateUserAgentList 失败:', error);
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
     * 返回的是 CreateUserAgentList 之后的新 agentId。
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
            const nextLoadingMap = { ...loadingMap.value };
            delete nextIdMap[applicationId];
            delete nextLoadingMap[applicationId];
            agentIdMap.value = nextIdMap;
            loadingMap.value = nextLoadingMap;
            inflightMap.delete(applicationId);
        } else {
            agentIdMap.value = {};
            loadingMap.value = {};
            inflightMap.clear();
        }
    };

    return {
        /** 全量 applicationId -> agentId（CreateUserAgentList 返回的 ParentAgentId）映射（只读响应式引用） */
        agentIdMap: readonly(agentIdMap) as Readonly<Ref<Record<string, string>>>,
        /** 全量 applicationId -> 加载状态 映射（只读响应式引用） */
        loadingMap: readonly(loadingMap) as Readonly<Ref<Record<string, boolean>>>,
        /** 异步调用 CreateUserAgentList 并按 applicationId 绑定 agentId */
        fetchAndSetAgentId,
        /** 按 applicationId 同步获取 agentId（CreateUserAgentList 返回的 ParentAgentId） */
        getAgentIdByAppId,
        /** 按 applicationId 获取响应式 agentId ComputedRef */
        useAgentIdRef,
        /** 按 applicationId 手动设置 agentId */
        setAgentIdByAppId,
        /** 清空指定/全部 applicationId 的绑定 */
        resetAgentStore,
    };
}

export default useAgentStore;
