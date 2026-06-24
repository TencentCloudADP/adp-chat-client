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
    /** Skill 详情 */
    skillDetailApi?: string;
    /** @deprecated 已改用 ModifyAgent 直接管理 skill_list */
    createSkillApi?: string;
    /** @deprecated 已改用 ModifyAgent 直接管理 skill_list */
    deleteSkillApi?: string;
    /** 修改 Agent */
    modifyAgentApi?: string;
}

/** 默认 Skills API 路径（使用 /adp/ 转发） */
export const defaultSkillsApiConfig: SkillsApiConfig = {
    globalAgentApi: '/adp/DescribeAgentDetail',
    skillCategoriesApi: '/adp/DescribeSkillCategoryList',
    skillSummaryListApi: '/adp/DescribeSkillSummaryList',
    skillDetailApi: '/adp/DescribeSkillDetail',
    createSkillApi: '/adp/CreateSkill',
    deleteSkillApi: '/adp/DeleteSkill',
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
 * 请求 Payload：{ AppId, AdpDomain: 1, ProjectPath: '' }
 * 响应：res.Agent.SkillList / PluginList / ToolList（兼容 snake_case）
 */
/** Agent 模型信息（DescribeAgentDetail 中 Agent.Model 字段） */
export interface AgentModelInfo {
    /** 模型别名（展示名） */
    ModelAliasName: string;
    /** 模型名称（唯一标识） */
    ModelName: string;
    /** 上下文 token 限制描述 */
    ModelContextWordsLimit: string;
    /** 指令 token 限制 */
    InstructionsWordsLimit: number;
    /** 模型参数 */
    ModelParameters: {
        Temperature: number;
        DeepThinking: string;
        MaxTokens: number;
        ReasoningEffort: string;
        ReplyFormat: string;
        StopSequences: string[];
    };
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
            AdpDomain: 1,
            ProjectPath: params.projectPath || '',
        },
    );
    // DescribeAgentDetail 返回 { Agent: { SkillList, PluginList, ToolList, AgentId, Model } } 或 snake_case
    const agent = (data.Agent || data.agent || {}) as Record<string, unknown>;
    const rawSkills = (agent.SkillList || agent.skill_list || []) as Array<Record<string, unknown>>;
    // 归一化 skill 字段（兼容 name → skill_name）
    const skills = rawSkills.map((s) => ({
        ...s,
        skill_id: s.skill_id || s.SkillId || '',
        skill_name: s.skill_name || s.SkillName || s.name || (s.profile as Record<string, unknown>)?.name || '',
        skill_display_name: s.skill_display_name || s.SkillDisplayName || s.skill_name || s.name || '',
        skill_display_desc: s.skill_display_description || s.skill_display_desc || s.SkillDisplayDescription || s.SkillDisplayDesc || '',
        icon_url: s.icon_url || s.skill_icon || s.IconUrl || '',
    }));

    // 解析模型信息
    const rawModel = (agent.Model || agent.model || null) as Record<string, unknown> | null;
    const model: AgentModelInfo | null = rawModel
        ? {
            ModelAliasName: (rawModel.ModelAliasName || rawModel.model_alias_name || '') as string,
            ModelName: (rawModel.ModelName || rawModel.model_name || '') as string,
            ModelContextWordsLimit: (rawModel.ModelContextWordsLimit || rawModel.model_context_words_limit || '') as string,
            InstructionsWordsLimit: (rawModel.InstructionsWordsLimit || rawModel.instructions_words_limit || 0) as number,
            ModelParameters: (() => {
                const p = (rawModel.ModelParameters || rawModel.model_parameters || {}) as Record<string, unknown>;
                return {
                    Temperature: (p.Temperature ?? p.temperature ?? 1) as number,
                    DeepThinking: (p.DeepThinking || p.deep_thinking || '') as string,
                    MaxTokens: (p.MaxTokens || p.max_tokens || 0) as number,
                    ReasoningEffort: (p.ReasoningEffort || p.reasoning_effort || '') as string,
                    ReplyFormat: (p.ReplyFormat || p.reply_format || '') as string,
                    StopSequences: (p.StopSequences || p.stop_sequences || []) as string[],
                };
            })(),
        }
        : null;

    return {
        skills,
        plugins: (agent.PluginList || agent.plugin_list || []) as Record<string, unknown>[],
        tools: (agent.ToolList || agent.tool_list || []) as Record<string, unknown>[],
        agentId: (agent.AgentId || agent.agent_id || '') as string,
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
 * 查询 Skill 详情
 */
export async function fetchSkillDetail(params: {
    applicationId: string;
    skill_id: string;
    space_id: string;
}, apiPath?: string): Promise<{ skill_detail: Record<string, unknown> }> {
    const data = await forwardRequest(
        apiPath || defaultSkillsApiConfig.skillDetailApi!,
        params.applicationId,
        {
            SkillId: params.skill_id,
            SpaceId: params.space_id,
        },
    );
    return { skill_detail: (data.skill_detail || data.SkillDetail || {}) as Record<string, unknown> };
}

/**
 * 安装 Skill（从 SkillHub，source=2）
 * @deprecated 已改用 modifyAgentSkillList 通过 ModifyAgent 统一管理 skill_list
 */
export async function installSkill(params: {
    applicationId: string;
    space_id: string;
    source: number;
    skill_id?: string;
    version_id?: string;
    name?: string;
    file_url?: string;
}, apiPath?: string): Promise<{ skill_id: string; version_id: string }> {
    const { applicationId, ...rest } = params;
    const data = await forwardRequest(
        apiPath || defaultSkillsApiConfig.createSkillApi!,
        applicationId,
        {
            SpaceId: rest.space_id || '',
            Source: rest.source,
            SkillId: rest.skill_id || '',
            VersionId: rest.version_id || '',
            Name: rest.name || '',
            FileUrl: rest.file_url || '',
        },
    );
    return {
        skill_id: (data.SkillId || data.skill_id || '') as string,
        version_id: (data.VersionId || data.version_id || '') as string,
    };
}

/**
 * 通过 ModifyAgent 更新 Agent 的 skill_list
 * 对应 v3 AgentSpec.skill_list，update_mask.paths = ["skill_list"]
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

/**
 * 卸载 Skill
 * @deprecated 已改用 modifyAgentSkillList 通过 ModifyAgent 统一管理 skill_list
 */
export async function uninstallSkill(params: {
    applicationId: string;
    skill_id: string;
    space_id: string;
}, apiPath?: string): Promise<void> {
    const { applicationId, ...rest } = params;
    await forwardRequest(
        apiPath || defaultSkillsApiConfig.deleteSkillApi!,
        applicationId,
        { SkillId: rest.skill_id, SpaceId: rest.space_id },
    );
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
    UpdateMask: string[];
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
            UpdateMask: params.updateMask,
        },
    );
}
