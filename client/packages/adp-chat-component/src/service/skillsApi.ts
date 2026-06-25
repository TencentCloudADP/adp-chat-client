/**
 * Skills API 服务
 * 直接通过 /adp/<Action> 通用转发端点调用腾讯云 ADP Skills 接口
 */
import { httpService } from './httpService';

/** Skills API 路径配置 */
export interface SkillsApiConfig {
    /** 全局 Agent 配置（DescribeAgentDetail） */
    globalAgentApi?: string;
    /** Skill 分类列表 */
    skillCategoriesApi?: string;
    /** Skill 摘要列表（技能广场） */
    skillSummaryListApi?: string;
    /** 修改 Agent */
    modifyAgentApi?: string;
}

/** 默认 Skills API 路径（使用 /adp/ 转发） */
export const defaultSkillsApiConfig: SkillsApiConfig = {
    globalAgentApi: '/adp/DescribeAgentDetail',
    skillCategoriesApi: '/adp/DescribeSkillCategoryList',
    skillSummaryListApi: '/adp/DescribeSkillSummaryList',
    modifyAgentApi: '/adp/ModifyAgent',
};

/**
 * 封装 /adp/<Action> 通用请求
 * @param url API 路径
 * @param applicationId 应用 ID
 * @param payload 业务参数
 * @param service 服务名（可选）
 * @param version API 版本（可选）
 */
async function forwardRequest(
    url: string,
    applicationId: string,
    payload: Record<string, unknown> = {},
    service?: string,
    version?: string,
): Promise<Record<string, unknown>> {
    const body: Record<string, unknown> = {
        ApplicationId: applicationId,
        Payload: payload,
    };
    if (service) body.Service = service;
    if (version) body.Version = version;

    const response = await httpService.post(url, body);
    const data = (response?.Response || response || {}) as Record<string, unknown>;
    const err = data.Error as Record<string, unknown> | undefined;
    if (err && (err.Code || err.code)) {
        throw new Error((err.Message || err.message || String(err.Code || err.code)) as string);
    }
    return data;
}

/**
 * 获取 Agent 详情（含已安装 Skills/Plugins/Tools 列表）
 * 通过 DescribeAgentDetail 接口，service/version 由服务端 action_version.json 处理
 * 请求 Payload：{ AppId, Domain, AgentId }
 * 响应结构（PascalCase，与 proto json_name 一致）：
 *   Agent.SkillList[] — AgentSkill { SkillId, Name, DisplayName, DisplayDescription, IconUrl, ... }
 *   Agent.PluginList[] — AgentPlugin
 *   Agent.ToolList[]   — AgentTool
 *   Agent.Model        — AgentModelConfig { ModelId, Alias, ContextWordsLimit, InstructionsWordsLimit, ModelParameters }
 */

/** Agent 模型信息（对应 proto AgentModelConfig） */
export interface AgentModelInfo {
    /** 模型唯一 id（proto: ModelId） */
    ModelId: string;
    /** 模型别名（proto: Alias） */
    Alias: string;
    /** 上下文长度字符限制（proto: ContextWordsLimit） */
    ContextWordsLimit: number;
    /** 指令长度字符限制（proto: InstructionsWordsLimit） */
    InstructionsWordsLimit: number;
    /** 模型超参（proto: ModelParameters -> ModelParams） */
    ModelParameters: {
        Temperature: number;
        DeepThinking: string;
        MaxTokens: number;
        ReasoningEffort: string;
        ReplyFormat: string;
        StopSequenceList: string[];
    } | null;
}

export async function fetchGlobalAgent(params: {
    applicationId: string;
    spaceId?: string;
    agentId: string;
    projectPath?: string;
}, apiPath?: string): Promise<{
    skills: Record<string, unknown>[];
    plugins: Record<string, unknown>[];
    tools: Record<string, unknown>[];
    agentId: string;
    model: AgentModelInfo | null;
}> {
    const data = await forwardRequest(
        apiPath || defaultSkillsApiConfig.globalAgentApi!,
        params.applicationId,
        {
            AppId: params.applicationId,
            AgentId: params.agentId,
            Domain: 2,
        },
    );
    // DescribeAgentDetail 返回 { Agent: AgentDetail }，字段均为 PascalCase
    const agent = (data.Agent ?? {}) as Record<string, unknown>;
    const rawSkills = (agent.SkillList ?? []) as Array<Record<string, unknown>>;

    // 归一化 skill 字段，对齐 proto AgentSkill json_name
    const skills = rawSkills.map((s) => ({
        ...s,
        SkillId: s.SkillId ?? '',
        Name: s.Name ?? '',
        DisplayName: s.DisplayName ?? '',
        DisplayDescription: s.DisplayDescription ?? '',
        IconUrl: s.IconUrl ?? '',
    }));

    // 解析模型信息，对齐 proto AgentModelConfig
    const rawModel = (agent.Model ?? null) as Record<string, unknown> | null;
    const model: AgentModelInfo | null = rawModel
        ? {
            ModelId: (rawModel.ModelId ?? '') as string,
            Alias: (rawModel.Alias ?? '') as string,
            ContextWordsLimit: (rawModel.ContextWordsLimit ?? 0) as number,
            InstructionsWordsLimit: (rawModel.InstructionsWordsLimit ?? 0) as number,
            ModelParameters: rawModel.ModelParameters
                ? (() => {
                    const p = rawModel.ModelParameters as Record<string, unknown>;
                    return {
                        Temperature: (p.Temperature ?? 1) as number,
                        DeepThinking: (p.DeepThinking ?? '') as string,
                        MaxTokens: (p.MaxTokens ?? 0) as number,
                        ReasoningEffort: (p.ReasoningEffort ?? '') as string,
                        ReplyFormat: (p.ReplyFormat ?? '') as string,
                        StopSequenceList: (p.StopSequenceList ?? []) as string[],
                    };
                })()
                : null,
        }
        : null;

    return {
        skills,
        plugins: (agent.PluginList ?? []) as Record<string, unknown>[],
        tools: (agent.ToolList ?? []) as Record<string, unknown>[],
        agentId: (agent.AgentId ?? '') as string,
        model,
    };
}

/**
 * 查询 Skill 分类列表
 */
export async function fetchSkillCategories(params: {
    applicationId: string;
}, apiPath?: string): Promise<{
    categories: Array<{ category_key: string; category_name: string }>;
}> {
    const data = await forwardRequest(
        apiPath || defaultSkillsApiConfig.skillCategoriesApi!,
        params.applicationId,
        {},
    );
    const rawList = (data.Categories || data.categories || data.CategoryList || []) as Array<Record<string, unknown>>;
    return {
        categories: rawList.map((c) => ({
            category_key: (c.category_key || c.CategoryKey || '') as string,
            category_name: (c.category_name || c.CategoryName || '') as string,
        })),
    };
}

/**
 * 查询 Skill 摘要列表（技能广场）
 */
export async function fetchSkillSummaryList(params: {
    applicationId: string;
    space_id: string;
    query?: string;
    filter_list?: Array<{ key: string; values: string[] }>;
    favorite_only?: boolean;
    page_size?: number;
    page_number?: number;
}, apiPath?: string): Promise<{
    skill_list: Record<string, unknown>[];
    total_count: number;
}> {
    const { applicationId, ...rest } = params;
    // filter_list → proto Filter { Name, ValueList }（v2 格式）
    const filters = (rest.filter_list || []).map((f: Record<string, unknown>) => ({
        Name: f.key || f.Key || f.name || f.Name || '',
        Values: f.values || f.Values || f.valueList || f.ValueList || [],
    }));
    const data = await forwardRequest(
        apiPath || defaultSkillsApiConfig.skillSummaryListApi!,
        applicationId,
        {
            SpaceId: rest.space_id || '',
            Query: rest.query || '',
            Filters: filters,
            FavoriteOnly: !!rest.favorite_only,
            PageSize: rest.page_size || 12,
            PageNumber: rest.page_number || 0,
        },
    );
    const rawList = (data.SkillList || data.skill_list || data.SkillSummaryList || []) as Record<string, unknown>[];
    return {
        skill_list: rawList,
        total_count: (data.TotalCount || data.total_count || data.Total || 0) as number,
    };
}

/**
 * 通过 ModifyAgent 更新 Agent 的 skill_list
 * Skill 安装/卸载统一入口，update_mask.paths = ["skill_list"]
 */
export async function modifyAgentSkillList(params: {
    applicationId: string;
    agentId: string;
    /** 更新后的完整 skill 列表 */
    skills: Array<{ skillId: string }>;
}, apiPath?: string): Promise<void> {
    const data = await forwardRequest(
        apiPath || '/adp/ModifyAgent',
        params.applicationId,
        {
            AppId: params.applicationId,
            AgentId: params.agentId,
            Agent: {
                SkillList: params.skills
                    .filter((s) => s.skillId)
                    .map((s) => ({ SkillId: s.skillId })),
            },
            UpdateMask: { Paths: ['skill_list'] },
        },
    );
    const error = data.Error as Record<string, unknown> | undefined;
    if (error && error.Code) {
        throw new Error((error.Message as string) || String(error.Code));
    }
}

/** ModifyAgent 请求参数 */
export interface ModifyAgentPayload {
    /** 应用 ID */
    AppId: string;
    /** Agent ID */
    AgentId: string;
    /** 更新后的 Agent 可编辑配置 */
    Agent: Record<string, unknown>;
    /** 需要更新的字段路径，如 ["profile.name", "instructions", "model", "tool_list"] */
    UpdateMask: { Paths: string[] };
}

/**
 * 修改 Agent 配置
 * 调用 ModifyAgent 接口，按 UpdateMask 指定的字段路径进行局部更新。
 *
 * @param params 请求参数
 * @param apiPath API 路径
 */
export async function modifyAgent(
    params: {
        applicationId: string;
        agentId: string;
        agent: Record<string, unknown>;
        updateMask: string[];
    },
    apiPath?: string,
): Promise<void> {
    await forwardRequest(
        apiPath || defaultSkillsApiConfig.modifyAgentApi!,
        params.applicationId,
        {
            AppId: params.applicationId,
            AgentId: params.agentId,
            Agent: params.agent,
            UpdateMask: { Paths: params.updateMask },
        },
    );
}
