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
 *      2) 调用 CopyAgentFromApp 创建新的 agent，返回 ParentAgentId
 *      3) 调用 POST /agent/config 将 ParentAgentId 回写本地 DB
 *      4) 把"新生成的 ParentAgentId"绑定写入该 applicationId 的槽位
 *  - 业务侧通过 getAgentIdByAppId(applicationId) 或响应式 agentIdMap[applicationId] 获取
 */
import { ref, readonly, computed, watch, type Ref, type ComputedRef, type WatchSource } from 'vue';
import {
    copyAgentFromApp,
    getAgentConfig,
    saveAgentConfig,
    type CopyAgentFromAppPayload,
} from '../service/api';
import { fetchGlobalAgent, modifyAgent as modifyAgentApi, modifyAgentSkillList as modifyAgentSkillListApi, type AgentModelInfo } from '../service/skillsApi';

// ------------------------------ 模块作用域单例 state ------------------------------
/** 按 applicationId 绑定的 agent_id 映射：{ [applicationId]: agentId }（存储 CopyAgentFromApp 返回的 ParentAgentId） */
const agentIdMap = ref<Record<string, string>>({});
/** 按 applicationId 维度的加载状态：{ [applicationId]: boolean } */
const loadingMap = ref<Record<string, boolean>>({});
/** 按 applicationId 维度的 inflight Promise，避免并发重复请求 */
const inflightMap = new Map<string, Promise<string>>();

/** Agent 配置详情（DescribeAgentDetail 返回） */
export interface AgentDetail {
    skills: Record<string, unknown>[];
    plugins: Record<string, unknown>[];
    tools: Record<string, unknown>[];
    agentId: string;
    /** 当前 Agent 绑定的模型信息 */
    model: AgentModelInfo | null;
}

/** 按 applicationId 缓存的 Agent 配置详情 */
const agentDetailMap = ref<Record<string, AgentDetail>>({});
/** 按 applicationId 维度的 Agent 详情加载状态 */
const agentDetailLoadingMap = ref<Record<string, boolean>>({});
/** 按 applicationId 维度的 inflight Promise，避免并发重复请求 Agent 详情 */
const detailInflightMap = new Map<string, Promise<AgentDetail | null>>();

/** fetchAndSetAgentId 选项 */
export interface FetchAgentIdOptions {
    /** 应用 ID（作为存储 key，也透传给 /adp 代理） */
    applicationId: string;

    /** 是否强制刷新（默认 false，已绑定过 agentId 时不再重复请求；强制时也会跳过本地 DB 查询） */
    force?: boolean;
}

/**
 * useAgentStore：返回全局共享的 Agent 上下文状态以及对应的操作方法。
 */
export function useAgentStore() {
    /**
     * 调用 CopyAgentFromApp 创建用户 Agent，把返回的 ParentAgentId 绑定写入该 applicationId 的槽位。
     * @returns 创建后得到的 ParentAgentId（失败或为空时返回 ''）
     */
    const fetchAndSetAgentId = async (
        options: FetchAgentIdOptions
    ): Promise<string> => {
        const {
            applicationId,
            force = false,
        } = options;

        if (!applicationId) {
            console.warn('[useAgentStore] applicationId 为空，跳过 CopyAgentFromApp');
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

                // 2) 调用 CopyAgentFromApp 创建用户 Agent
                const payload: CopyAgentFromAppPayload = {
                    AppId: applicationId,
                };
                const resp = await copyAgentFromApp(
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
                console.error('[useAgentStore] CopyAgentFromApp 失败:', error);
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
     * 返回的是 CopyAgentFromApp 之后的新 agentId。
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

    /**
     * 获取指定 applicationId 对应 Agent 的配置详情（Skills / Plugins / Tools 等）。
     * 调用 DescribeAgentDetail 接口（globalAgentApi），结果按 applicationId 缓存。
     *
     * @param applicationId 应用 ID
     * @param options.force 是否强制刷新（默认 false，命中缓存则直接返回）
     * @returns AgentDetail
     */
    const fetchAgentDetail = async (
        applicationId: string,
        options?: { force?: boolean },
    ): Promise<AgentDetail | null> => {
        if (!applicationId) {
            console.warn('[useAgentStore] applicationId 为空，跳过 fetchAgentDetail');
            return null;
        }

        const force = options?.force ?? false;

        // 命中缓存
        if (!force && agentDetailMap.value[applicationId]) {
            return agentDetailMap.value[applicationId];
        }

        try {
            agentDetailLoadingMap.value = { ...agentDetailLoadingMap.value, [applicationId]: true };

            const result = await fetchGlobalAgent({ applicationId });

            const detail: AgentDetail = {
                skills: result.skills,
                plugins: result.plugins,
                tools: result.tools,
                agentId: result.agentId,
                model: result.model,
            };

            agentDetailMap.value = {
                ...agentDetailMap.value,
                [applicationId]: detail,
            };

            return detail;
        } catch (error) {
            console.error('[useAgentStore] fetchAgentDetail 失败:', error);
            return null;
        } finally {
            agentDetailLoadingMap.value = { ...agentDetailLoadingMap.value, [applicationId]: false };
        }
    };

    /**
     * 根据 applicationId 获取 Agent 配置详情。
     * 优先返回缓存；若缓存未命中且 applicationId 非空，则自动调用 fetchAgentDetail 请求。
     * 使用 detailInflightMap 去重并发请求：多个调用同时命中同一 applicationId 时，
     * 只发起一次 fetchAgentDetail，其余调用共享同一 Promise。
     */
    const getAgentDetailByAppId = async (applicationId: string): Promise<AgentDetail | null> => {
        if (!applicationId) return null;
        const cached = agentDetailMap.value[applicationId];
        if (cached) return cached;

        // 如果该 applicationId 已有正在进行中的请求，直接复用其 Promise
        const inflight = detailInflightMap.get(applicationId);
        if (inflight) return inflight;

        // 发起请求并存入 inflightMap
        const promise = fetchAgentDetail(applicationId).finally(() => {
            detailInflightMap.delete(applicationId);
        });
        detailInflightMap.set(applicationId, promise);

        return promise;
    };

    /**
     * 修改 Agent 配置（局部更新）。
     * 调用 ModifyAgent 接口，按 updateMask 指定的字段路径进行更新。
     * 修改成功后自动刷新该 applicationId 对应的 AgentDetail 缓存。
     *
     * @param applicationId 应用 ID
     * @param agentId Agent ID
     * @param agent 更新后的 Agent 可编辑配置对象
     * @param updateMask 需要更新的字段路径列表，如 ["profile.name", "instructions", "model"]
     */
    const modifyAgent = async (
        applicationId: string,
        agentId: string,
        agent: Record<string, unknown>,
        updateMask: string[],
    ): Promise<void> => {
        if (!applicationId || !agentId) {
            console.warn('[useAgentStore] applicationId 或 agentId 为空，跳过 modifyAgent');
            return;
        }

        await modifyAgentApi({
            applicationId,
            agentId,
            agent,
            updateMask,
        });

        // 修改成功后刷新本地缓存
        await fetchAgentDetail(applicationId, { force: true });
    };

    // ============================= Skills / Tools / Plugins 缓存读写 =============================

    /**
     * 从缓存中同步获取指定 applicationId 对应的 Skills 列表。
     * 缓存由 fetchAgentDetail / refreshAgentCache 填充。
     */
    const getSkillsByAppId = (applicationId: string): Record<string, unknown>[] => {
        if (!applicationId) return [];
        return agentDetailMap.value[applicationId]?.skills || [];
    };

    /**
     * 从缓存中同步获取指定 applicationId 对应的 Plugins 列表。
     */
    const getPluginsByAppId = (applicationId: string): Record<string, unknown>[] => {
        if (!applicationId) return [];
        return agentDetailMap.value[applicationId]?.plugins || [];
    };

    /**
     * 从缓存中同步获取指定 applicationId 对应的 Tools 列表。
     */
    const getToolsByAppId = (applicationId: string): Record<string, unknown>[] => {
        if (!applicationId) return [];
        return agentDetailMap.value[applicationId]?.tools || [];
    };

    /**
     * 从缓存中同步取 Agent 详情中的 agentId（与 agentIdMap 独立存储，互补）。
     */
    const getAgentIdFromCacheByAppId = (applicationId: string): string => {
        if (!applicationId) return '';
        return agentDetailMap.value[applicationId]?.agentId || '';
    };

    /**
     * 从缓存中同步获取指定 applicationId 对应的 Agent 绑定模型信息。
     */
    const getModelByAppId = (applicationId: string): AgentModelInfo | null => {
        if (!applicationId) return null;
        return agentDetailMap.value[applicationId]?.model || null;
    };

    /**
     * 修改 Skill 列表（安装 / 卸载均通过此方法）。
     * 调用 ModifyAgent 更新 skill_list，成功后自动刷新缓存。
     *
     * @param applicationId 应用 ID
     * @param skills 更新后的完整 Skill 列表 [{ skillId, skillType? }]
     */
    const modifySkillList = async (
        applicationId: string,
        skills: Array<{ skillId: string }>,
    ): Promise<void> => {
        const agentId = getAgentIdByAppId(applicationId);
        if (!applicationId || !agentId) {
            console.warn('[useAgentStore] applicationId 或 agentId 为空，跳过 modifySkillList');
            return;
        }
        await modifyAgentSkillListApi({
            applicationId,
            agentId,
            skills,
        });
        // 修改成功后刷新缓存
        await fetchAgentDetail(applicationId, { force: true });
    };

    /**
     * 强制刷新 Agent 缓存（Skills / Plugins / Tools / AgentId / Model），
     * 同时从 DescribeAgentDetail 返回值中同步更新 agentIdMap。
     */
    const refreshAgentCache = async (applicationId: string): Promise<AgentDetail | null> => {
        const detail = await fetchAgentDetail(applicationId, { force: true });
        if (detail?.agentId) {
            // 同步更新 agentIdMap，确保 getAgentIdByAppId 返回最新值
            agentIdMap.value = { ...agentIdMap.value, [applicationId]: detail.agentId };
        }
        return detail;
    };

    /**
     * 监听一个响应式的 applicationId 源，当其变化时自动调用 fetchAndSetAgentId。
     * 支持传入 Ref<string>、getter 函数 () => string 等。
     * 内部使用 immediate: true，初始值非空时也会立即触发。
     *
     * @param source 响应式 applicationId 来源（Ref<string> 或 getter）
     * @returns 停止监听的函数（stop handle）
     */
    const watchApplicationId = (source: WatchSource<string | undefined>) => {
        return watch(
            source,
            (newVal) => {
                if (newVal) {
                    fetchAndSetAgentId({ applicationId: newVal });
                }
            },
            { immediate: true },
        );
    };

    return {
        /** 全量 applicationId -> agentId（CopyAgentFromApp 返回的 ParentAgentId）映射（只读响应式引用） */
        agentIdMap: readonly(agentIdMap) as Readonly<Ref<Record<string, string>>>,
        /** 全量 applicationId -> 加载状态 映射（只读响应式引用） */
        loadingMap: readonly(loadingMap) as Readonly<Ref<Record<string, boolean>>>,
        /** 全量 applicationId -> AgentDetail 配置详情映射（只读响应式引用） */
        agentDetailMap: readonly(agentDetailMap) as Readonly<Ref<Record<string, AgentDetail>>>,
        /** 全量 applicationId -> Agent 详情加载状态映射（只读响应式引用） */
        agentDetailLoadingMap: readonly(agentDetailLoadingMap) as Readonly<Ref<Record<string, boolean>>>,
        /** 异步调用 CopyAgentFromApp 并按 applicationId 绑定 agentId */
        fetchAndSetAgentId,
        /** 按 applicationId 同步获取 agentId（CopyAgentFromApp 返回的 ParentAgentId） */
        getAgentIdByAppId,
        /** 按 applicationId 获取响应式 agentId ComputedRef */
        useAgentIdRef,
        /** 按 applicationId 手动设置 agentId */
        setAgentIdByAppId,
        /** 清空指定/全部 applicationId 的绑定 */
        resetAgentStore,
        /** 监听响应式 applicationId 变化，自动触发 fetchAndSetAgentId */
        watchApplicationId,
        /** 异步获取 Agent 配置详情（DescribeAgentDetail），按 applicationId 缓存 */
        fetchAgentDetail,
        /** 按 applicationId 获取 Agent 配置详情（异步，缓存未命中时自动请求） */
        getAgentDetailByAppId,
        /** 修改 Agent 配置（局部更新），成功后自动刷新缓存 */
        modifyAgent,

        // ===== Skills / Tools / Plugins 缓存读写 =====
        /** 从缓存同步获取 Skills 列表（缓存由 refreshAgentCache 填充） */
        getSkillsByAppId,
        /** 从缓存同步获取 Plugins 列表 */
        getPluginsByAppId,
        /** 从缓存同步获取 Tools 列表 */
        getToolsByAppId,
        /** 从缓存同步获取 Agent 详情中的 agentId */
        getAgentIdFromCacheByAppId,
        /** 从缓存同步获取 Agent 绑定的模型信息 */
        getModelByAppId,
        /** 修改 Skill 列表（安装/卸载），成功后自动刷新缓存 */
        modifySkillList,
        /** 强制刷新 Agent 缓存（Skills/Plugins/Tools/AgentId/Model），同步更新 agentIdMap */
        refreshAgentCache,
    };
}

export default useAgentStore;
