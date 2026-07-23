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
import set from 'lodash.set';
import {
    copyAgentFromApp,
    getAgentConfig,
    saveAgentConfig,
    type CopyAgentFromAppPayload,
} from '../service/api';
import { fetchGlobalAgent, modifyAgent as modifyAgentApi, modifyAgentSkillList as modifyAgentSkillListApi, type AgentModelInfo } from '../service/skillsApi';
import type { ChatMode } from '../model/type';

/**
 * 将后端返回的原始 Pattern 值归一化为业务侧统一使用的 ChatMode。
 *  - 'ClawAgent' → 'claw'
 *  - 其它（包括 '' / null / 'agent' / 未来新增值）→ 'standard'
 * 保持与 Index.vue 内的 chatMode computed 完全一致的收敛规则。
 */
const patternToMode = (pattern: string | null | undefined): ChatMode => {
    return pattern === 'ClawAgent' ? 'claw' : 'standard';
};

// ------------------------------ 模块作用域单例 state ------------------------------
/** 按 applicationId 绑定的 agent_id 映射：{ [applicationId]: agentId }（存储 CopyAgentFromApp 返回的 ParentAgentId） */
const agentIdMap = ref<Record<string, string>>({});
/** 按 applicationId 维度的加载状态：{ [applicationId]: boolean } */
const loadingMap = ref<Record<string, boolean>>({});
/** 按 applicationId 维度的 inflight Promise，避免并发重复请求 */
const inflightMap = new Map<string, Promise<string>>();

/**
 * 按 applicationId 缓存的应用 Pattern（来自 ApplicationList 接口）。
 *
 * 仅 Pattern === 'ClawAgent' 的应用才需要走 CopyAgentFromApp / DescribeAgentDetail
 * 一系列 Agent 拓展流程；其它应用（agent / standard 等）都不应触发这些请求，
 * 以避免无谓的接口调用与后端错误。
 *
 * 存储的是归一化后的 ChatMode（'claw' / 'standard'），语义与 Index.vue 的 chatMode computed 一致；
 * 原始 Pattern 字符串在写入时通过 patternToMode() 归一化，避免下游再自己 if === 'ClawAgent'。
 *
 * 判定策略：
 *  - 已注册（曾经 setApplicationModes / setApplicationMode 写入过）且 !== 'claw' → 视为"非 Claw"，跳过
 *  - 未注册（尚未拉到列表 / 外部直接透传） → 保守放行，避免注册滞后导致漏调用
 */
const applicationModeMap = ref<Record<string, ChatMode>>({});

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
     * 批量登记应用列表的 Pattern。通常在 ApplicationList 接口返回后调用一次即可。
     * 允许多次调用（增量合并）。
     */
    const setApplicationModes = (
        list: Array<{ ApplicationId?: string; Pattern?: string | null }>,
    ) => {
        if (!Array.isArray(list) || list.length === 0) return;
        const next = { ...applicationModeMap.value };
        for (const item of list) {
            const appId = item?.ApplicationId;
            if (!appId) continue;
            // Pattern 允许为 null / '' / 未知值，统一归一化为 ChatMode 后登记
            // （非 'ClawAgent' → 'standard'，视为"已知且非 Claw"）
            next[appId] = patternToMode(item?.Pattern);
        }
        applicationModeMap.value = next;
    };

    /**
     * 单条设置 / 覆盖某个应用的模式。
     * 入参兼容原始 Pattern 字符串（'ClawAgent' / 'agent' / null / ...）与已归一化的 ChatMode（'claw' / 'standard'），
     * 内部统一走 patternToMode 收敛，因此传任意一种都是安全的。
     */
    const setApplicationMode = (
        applicationId: string,
        patternOrMode: string | ChatMode | null | undefined,
    ) => {
        if (!applicationId) return;
        // 'claw' 直接命中；'ClawAgent' 也命中；其它一律 'standard'
        const mode: ChatMode = patternOrMode === 'claw' ? 'claw' : patternToMode(patternOrMode);
        applicationModeMap.value = {
            ...applicationModeMap.value,
            [applicationId]: mode,
        };
    };

    /**
     * 查询指定 applicationId 的 ChatMode。
     *
     * 用于业务层想直接拿到某个应用的模式、又不方便从 Index.vue 透传 prop 的场景
     * （例如某些非 Layout 直连子组件、独立弹窗、hooks 内部判断等）。
     *
     * - 已登记：返回登记时归一化后的 ChatMode
     * - 未登记：返回 'standard'（区别于 isClawAgent 的"保守放行"语义 —— getter 层面
     *   面向业务查询，应给出确定值；网络请求门槛才需要保守放行）
     */
    const getModeByAppId = (applicationId: string): ChatMode => {
        if (!applicationId) return 'standard';
        return applicationModeMap.value[applicationId] ?? 'standard';
    };

    /**
     * 响应式版本：返回一个 ComputedRef<ChatMode>，applicationId 变化 / map 变化时自动更新。
     * 适合在 setup / 模板里持续追踪指定应用的模式。
     */
    const useModeRef = (applicationId: string | Ref<string>): ComputedRef<ChatMode> => {
        return computed(() => {
            const appId = typeof applicationId === 'string' ? applicationId : applicationId.value;
            return getModeByAppId(appId);
        });
    };

    /**
     * 判定指定应用是否需要走 Agent 扩展流程（CopyAgentFromApp / DescribeAgentDetail）。
     *
     * - 已登记：仅 mode === 'claw' 放行
     * - 未登记：保守放行（避免注册滞后导致业务漏请求）
     *
     * 注意此处的"未登记保守放行"与 getModeByAppId 的"未登记返回 standard"故意不一致：
     * 本方法是网络请求门槛，宁可多请求也不能漏；getter 面向业务查询，需要确定值。
     */
    const isClawAgent = (applicationId: string): boolean => {
        if (!applicationId) return false;
        if (!(applicationId in applicationModeMap.value)) return true;
        return applicationModeMap.value[applicationId] === 'claw';
    };

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

        // 非 ClawAgent 应用不走 CopyAgentFromApp 流程
        if (!isClawAgent(applicationId)) {
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
     * 根据 applicationId 获取已绑定的 agent_id。
     * 如果缓存中已有值则直接返回，否则等待 fetchAndSetAgentId 请求完成后返回。
     */
    const getAgentIdByAppId = async (applicationId: string): Promise<string> => {
        if (!applicationId) return '';
        // 缓存命中直接返回
        if (agentIdMap.value[applicationId]) {
            return agentIdMap.value[applicationId];
        }
        // 非 ClawAgent 不触发外部请求
        if (!isClawAgent(applicationId)) return '';
        // 缓存未命中，触发请求并等待结果
        return fetchAndSetAgentId({ applicationId });
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
            const nextLoadingMap = { ...loadingMap.value };
            const nextDetailMap = { ...agentDetailMap.value };
            delete nextLoadingMap[applicationId];
            delete nextDetailMap[applicationId];
            loadingMap.value = nextLoadingMap;
            agentDetailMap.value = nextDetailMap;
            detailInflightMap.delete(applicationId);
        } else {
            loadingMap.value = {};
            agentDetailMap.value = {};
            detailInflightMap.clear();
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

        // 非 ClawAgent 应用没有 Agent 详情，跳过
        if (!isClawAgent(applicationId)) {
            return null;
        }

        const force = options?.force ?? false;

        // 命中缓存
        if (!force && agentDetailMap.value[applicationId]) {
            return agentDetailMap.value[applicationId];
        }

        try {
            agentDetailLoadingMap.value = { ...agentDetailLoadingMap.value, [applicationId]: true };

            const agentId = await getAgentIdByAppId(applicationId);
            if (!agentId) {
                console.warn('[useAgentStore] agentId 为空，数据不存在，跳过缓存');
                return null;
            }
            const result = await fetchGlobalAgent({ applicationId, agentId });

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

        // 非 ClawAgent 应用不走详情请求
        if (!isClawAgent(applicationId)) return null;

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

    // ============================= ModifyAgent 请求参数拼装 =============================

    /**
     * updateMask snake_case 段 -> AgentSpec PascalCase 字段名映射。
     * v3 AgentSpec 顶层字段全集：profile / instructions / model / tool_list / plugin_list / skill_list / advanced_config
     * （path 中除顶层段外，其它段一般已是 PascalCase，无需转换；按需扩展即可）
     */
    const SPEC_FIELD_MAP: Record<string, string> = {
        profile: 'Profile',
        instructions: 'Instructions',
        model: 'Model',
        tool_list: 'ToolList',
        plugin_list: 'PluginList',
        skill_list: 'SkillList',
        advanced_config: 'AdvancedConfig',
    };

    /**
     * 将 updateMask 风格的 path（snake_case，可含 "."）转换为 AgentSpec 内部的 PascalCase 路径数组。
     * - 自动剥离 "agent." 前缀（AgentSpec 自身不含此前缀）
     * - 顶层段命中 SPEC_FIELD_MAP；其余段若是 snake_case 则按首字母大写规则转换
     * @example "agent.plugin_list" -> ["PluginList"]
     * @example "profile.name" -> ["Profile", "Name"]
     */
    const normalizePath = (path: string): string[] => {
        return path
            .replace(/^agent\./, '')
            .split('.')
            .filter(Boolean)
            .map((seg) => SPEC_FIELD_MAP[seg]
                ?? seg.replace(/(^|_)([a-z])/g, (_, _u, c: string) => c.toUpperCase()));
    };

    /**
     * 深度清洗 ModifyAgent 请求体中所有为 null 的字段。
     *
     * 背景：DescribeAgentDetail 返回的 InputList/HeaderParameterList 等中的 Input 字段
     *      可能下发为 null（表示参数未配置取值来源），但 ModifyAgent 接口校验严格，
     *      要求 message 类型字段不能显式为 null（必须省略或为合法对象），
     *      否则会返回 InvalidParameter: "...Input is not valid and cannot be null."
     *
     * 处理规则：
     * - 数组：递归清洗每个元素
     * - 对象：删除所有 value === null 的 key，递归清洗剩余值
     * - 原始值：原样返回
     * 注意：保留 undefined / 空字符串 / 0 / false 等其它 falsy 值，仅去除 null。
     */
    const stripNulls = <T>(value: T): T => {
        if (value === null) return undefined as unknown as T;
        if (Array.isArray(value)) {
            return value.map((item) => stripNulls(item)) as unknown as T;
        }
        if (value && typeof value === 'object') {
            const out: Record<string, unknown> = {};
            for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
                if (v === null) continue; // 显式去掉 null 键
                out[k] = stripNulls(v);
            }
            return out as unknown as T;
        }
        return value;
    };

    /**
     * 从 AgentDetail 拼装 AgentSpec 基础对象（PascalCase，对齐 v3 proto AgentSpec）。
     *
     * DescribeAgentDetail 返回字段全部已是 PascalCase；与 AgentSpec 的字段差异：
     * - ToolList[i]：detail 返回 AgentTool { Config: AgentToolBasicConfig, Name, ... }；
     *   AgentSpec 要求 AgentToolConfig { Config: AgentToolBasicConfig }-> 保留 { Config }，丢弃展示字段
     * - PluginList[i]：detail 返回 AgentPlugin { Config: AgentPluginConfig, Name, ... }；
     *   AgentSpec 要求裸 AgentPluginConfig（无 Config 包装）-> 直接展开 detail[i].Config
     * - SkillList[i]：detail 返回 AgentSkill { SkillId, Name, ... }；
     *   AgentSpec 要求 AgentSkillConfig { SkillId } -> 仅保留 SkillId
     * - Model：fetchGlobalAgent 已归一化为 PascalCase AgentModelConfig -> 直接复用
     *
     * 最终统一经过 stripNulls 深度清洗：去掉所有 null 字段（如 Input: null），
     * 避免 ModifyAgent 接口因 message 字段为 null 报 InvalidParameter。
     */
    const buildBaseAgentSpec = (detail: AgentDetail | null): Record<string, unknown> => {
        if (!detail) return {};
        const raw: Record<string, unknown> = {
            Model: detail.model,
            ToolList: detail.tools.map((t) => ({ Config: (t as Record<string, unknown>).Config })),
            PluginList: detail.plugins.map((p) => (p as Record<string, unknown>).Config as Record<string, unknown>),
            SkillList: detail.skills.map((s) => ({ SkillId: (s as Record<string, unknown>).SkillId })),
        };
        return stripNulls(raw);
    };

    /**
     * 拼装 ModifyAgent 请求参数：以缓存中的 AgentDetail 为基础生成 AgentSpec，
     * 再用 overrides（按 path 覆盖）的方式产出最终请求体。
     *
     * - overrides key 使用 updateMask 同款 snake_case 路径（如 "plugin_list"、"profile.name"），
     *   也接受 "agent.xxx" 前缀（自动剥离）。
     * - 返回的 agent 字段使用 PascalCase（对齐 v3 proto json_name）。
     * - updateMask 默认 = overrides 顶层 key 去重，可通过 options.updateMask 显式覆盖。
     *
     * @example
     *   const payload = await buildModifyAgentPayload(appId, { plugin_list: newPluginList });
     *   // payload.agent      = { Model, ToolList: [...], PluginList: newPluginList, SkillList: [...] }
     *   // payload.updateMask = ["plugin_list"]
     */
    const buildModifyAgentPayload = async (
        applicationId: string,
        overrides: Record<string, unknown> = {},
        options: { updateMask?: string[] } = {},
    ): Promise<{ agentId: string; agent: Record<string, unknown>; updateMask: string[] }> => {
        const detail = await getAgentDetailByAppId(applicationId);
        const agentId = detail?.agentId || (await getAgentIdByAppId(applicationId));
        const agent = buildBaseAgentSpec(detail);

        // 按 path 应用 overrides（lodash.set 自动创建中间对象）
        for (const [rawPath, value] of Object.entries(overrides)) {
            const segs = normalizePath(rawPath);
            if (segs.length) set(agent, segs, value);
        }

        // updateMask：显式优先；否则取 overrides 顶层 key（去 "agent." 前缀并去重）
        const updateMask = options.updateMask
            ?? Array.from(new Set(
                Object.keys(overrides).map((p) => p.replace(/^agent\./, '').split('.')[0] || ''),
            )).filter(Boolean);

        return { agentId, agent, updateMask };
    };

    /**
     * 一体化提交 ModifyAgent：基于 AgentDetail 缓存 + path 覆盖，自动构造请求体并提交。
     * 等价于 buildModifyAgentPayload + modifyAgent 的串联调用，成功后会刷新本地缓存。
     *
     * 失败处理：agentId 为空或 updateMask 为空时跳过提交（避免误发空请求）。
     *
     * @example
     *   // 仅更新 plugin_list
     *   await modifyAgentByPath(appId, { plugin_list: newPluginList });
     *
     * @example
     *   // 同时更新 profile.name 和 instructions
     *   await modifyAgentByPath(appId, {
     *     "profile.name": "NewName",
     *     "instructions": "...",
     *   });
     */
    const modifyAgentByPath = async (
        applicationId: string,
        overrides: Record<string, unknown>,
        options: { updateMask?: string[] } = {},
    ): Promise<void> => {
        const { agentId, agent, updateMask } = await buildModifyAgentPayload(applicationId, overrides, options);
        if (!agentId || !updateMask.length) {
            console.warn('[useAgentStore] modifyAgentByPath skipped: empty agentId or updateMask', { agentId, updateMask });
            return;
        }
        await modifyAgent(applicationId, agentId, agent, updateMask);
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
        const agentId = await getAgentIdByAppId(applicationId);
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
                if (!newVal) return;
                // 非 ClawAgent 应用不触发 CopyAgentFromApp
                if (!isClawAgent(newVal)) return;
                fetchAndSetAgentId({ applicationId: newVal });
            },
            { immediate: true },
        );
    };

    return {
        /** 全量 applicationId -> ChatMode 映射（只读响应式引用），值已归一化为 'claw' / 'standard' */
        applicationModeMap: readonly(applicationModeMap) as Readonly<Ref<Record<string, ChatMode>>>,
        /** 批量登记应用列表的模式（建议在 ApplicationList 返回后调用；入参保持后端 Pattern 原字段兼容） */
        setApplicationModes,
        /** 单条登记某个应用的模式（兼容传原始 Pattern 或已归一化的 ChatMode） */
        setApplicationMode,
        /** 同步查询某个 applicationId 的 ChatMode；未登记返回 'standard' */
        getModeByAppId,
        /** 响应式版本：返回 ComputedRef<ChatMode>，applicationId 或 map 变化时自动更新 */
        useModeRef,
        /** 是否为需要走 Agent 扩展流程的应用（mode === 'claw'；未登记时保守放行） */
        isClawAgent,
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
        /** 按 applicationId 异步获取 agentId（缓存有值直接返回，否则等待 fetchAndSetAgentId） */
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
        /** 从 AgentDetail 缓存拼装 ModifyAgent 请求参数，支持通过 path 覆盖字段值 */
        buildModifyAgentPayload,
        /** 一体化提交：基于 path 覆盖直接调用 ModifyAgent（buildModifyAgentPayload + modifyAgent 串联） */
        modifyAgentByPath,

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
