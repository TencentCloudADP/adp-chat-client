/**
 * Connector & Plugin API 服务
 * 通过 /adp/<Action> 通用转发端点调用
 */
import { httpService } from './httpService';

/** Connector/Plugin API 路径配置 */
export interface ConnectorPluginApiConfig {
    listPluginsApi?: string;
    describePluginApi?: string;
    createPluginOAuthUrlApi?: string;
    pluginCategoryListApi?: string;
    bindAgentToolApi?: string;
    unbindAgentToolApi?: string;
    modifyAgentToolListApi?: string;
}

export const defaultConnectorPluginApiConfig: ConnectorPluginApiConfig = {
    // 升级至 2026 plugin_config v2：DescribePluginSummaryList 取代 ListPlugins
    listPluginsApi: '/adp/DescribePluginSummaryList',
    // DescribePlugin：按需拉取插件详情（含 ToolList），用于 PluginSummary 不返回工具明细时的懒加载，
    // 以及 MCP 插件「更新」操作（与 webim 实现一致：复用 DescribePlugin 让后端在内部回源 MCP server）
    describePluginApi: '/adp/DescribePlugin',
    createPluginOAuthUrlApi: '/adp/CreatePluginOAuthUrl',
    pluginCategoryListApi: '/adp/DescribePluginCategoryList',
    bindAgentToolApi: '/adp/BindAgentTool',
    unbindAgentToolApi: '/adp/UnbindAgentTool',
    modifyAgentToolListApi: '/adp/ModifyAgentToolList',
};

/** Plugin 类型常量 */
export const PluginClassEnum = {
    NORMAL: 0,
    CONNECTOR: 1,
} as const;
export type PluginClassEnum = (typeof PluginClassEnum)[keyof typeof PluginClassEnum];

async function forwardRequest(
    url: string,
    applicationId: string,
    payload: Record<string, unknown> = {},
): Promise<Record<string, unknown>> {
    const response = await httpService.post(url, { ApplicationId: applicationId, Payload: payload });
    const data = (response?.Response || response || {}) as Record<string, unknown>;
    // 检查接口返回的业务错误
    if (data.Error && typeof data.Error === 'object') {
        const err = data.Error as Record<string, unknown>;
        const code = (err.Code || '') as string;
        const message = (err.Message || '请求失败') as string;
        throw new Error(`[${code}] ${message}`);
    }
    return data;
}

/**
 * 查询插件列表（连接器或工具）
 *
 * 已升级到 plugin_config v2 的 DescribePluginSummaryList：
 *   - Req：Module + FilterList + IsFavoriteOnly + SortType + PageNumber/PageSize + SpaceId
 *   - Rsp：{ PluginList: PluginSummary[], TotalCount }，PluginSummary 中字段以嵌套对象组织
 *
 * 为最小化对调用方组件的侵入，本函数对入参做老→新映射，对返回结果做
 * 「PluginSummary 嵌套对象 → 平铺字段」的兼容封装（保留兼容旧字段名）。
 *
 * 注意：v2 协议下旧的 `pluginTypes` 字段（官方/三方/官方云）对应 `PluginSource` 过滤；
 *      `createTypes`（API/代码/MCP/应用）对应 `PluginKind` 过滤；
 *      `financeTypeList` 对应 `BillingType` 过滤；
 *      `categoryKeys` 对应 `CategoryKey` 过滤；
 *      `pluginClass` 对应 `PluginClass` 过滤。
 * 函数对外保持原入参签名，内部翻译为 FilterList。
 */
export async function fetchPluginList(params: {
    applicationId: string;
    pluginClass: PluginClassEnum;
    query?: string;
    pageNumber?: number;
    pageSize?: number;
    enabledOnly?: boolean;
    sortType?: number;
    categoryKeys?: string[];
    favoriteOnly?: boolean;
    pluginTypes?: number[];
    financeTypeList?: number[];
    createTypes?: number[];
    spaceId?: string;
    /** v2 Module 枚举：0-ALL, 1-AGENT, 2-WORKFLOW, 3-ASSISTANT */
    module?: number;
}, apiPath?: string): Promise<{
    plugins: Record<string, unknown>[];
    total: number;
}> {
    // ---- 1. 组装 v2 FilterList ----
    const filterList: Array<{ Name: string; ValueList: string[]; Operator: number }> = [];
    const pushFilter = (name: string, values: Array<number | string> | undefined) => {
        if (!values || values.length === 0) return;
        filterList.push({ Name: name, ValueList: values.map(String), Operator: 0 /* IN */ });
    };
    pushFilter('PluginClass', [params.pluginClass]);
    pushFilter('PluginSource', params.pluginTypes);
    pushFilter('PluginKind', params.createTypes);
    pushFilter('BillingType', params.financeTypeList);
    pushFilter('CategoryKey', params.categoryKeys);

    const data = await forwardRequest(
        apiPath || defaultConnectorPluginApiConfig.listPluginsApi!,
        params.applicationId,
        {
            Query: params.query || '',
            Module: params.module ?? 0,
            FilterList: filterList,
            IsFavoriteOnly: !!params.favoriteOnly,
            SortType: params.sortType ?? 0,
            PageNumber: (params.pageNumber ?? 1) - 1,
            PageSize: params.pageSize ?? 20,
            SpaceId: params.spaceId || undefined,
        },
    );

    // ---- 2. 兼容旧响应 + 扁平化 PluginSummary ----
    const rawList = (data.PluginList || data.Plugins || data.plugins || []) as Record<string, unknown>[];
    const total = (data.TotalCount || data.Total || data.total || 0) as number;
    return {
        plugins: rawList.map(flattenPluginSummary),
        total,
    };
}

/**
 * 将 v2 PluginSummary 嵌套对象扁平化为旧 Plugin 结构，
 * 同时**保留**原始嵌套字段，避免任何调用方写法被破坏。
 *
 * v2 PluginSummary 形如：
 *   {
 *     PluginId,
 *     Profile:   { Name, Description, IconUrl, PluginSource, PluginKind, PluginClass, Author },
 *     Operation: { CategoryKey, BillingType, AllowExternalAccess, Introduction, IsRecommended },
 *     Status,
 *     UserState: { IsFavorite, WhiteListType, IsInWhiteList },
 *     Statistics:{ ToolCount, CallCount },
 *     Config:    { ApiPluginConfig | MCPPluginConfig | AppPluginConfig },
 *   }
 */
function flattenPluginSummary(p: Record<string, unknown>): Record<string, unknown> {
    const profile = (p.Profile || {}) as Record<string, unknown>;
    const operation = (p.Operation || {}) as Record<string, unknown>;
    const userState = (p.UserState || {}) as Record<string, unknown>;
    const statistics = (p.Statistics || {}) as Record<string, unknown>;
    const config = (p.Config || {}) as Record<string, unknown>;
    const mcpConfig = (config.MCPPluginConfig || {}) as Record<string, unknown>;
    const apiConfig = (config.ApiPluginConfig || {}) as Record<string, unknown>;

    // 工具列表：v2 PluginSummary 不返回工具明细（仅在 DescribePlugin 时才有 ToolList）。
    // 这里如果原始对象带了 Tools/ToolList（如 fetchPluginDetail 注入或旧协议返回）就一并扁平化。
    const rawTools = (p.Tools || p.ToolList || []) as Record<string, unknown>[];
    const tools = rawTools.map(flattenTool);

    // 插件级 Header/Query（MCP 插件有；API 插件在 ApiPluginConfig.AuthConfig 中，无统一字段，按 MCP 优先取）
    const headers = (p.Headers || mcpConfig.PluginHeader || apiConfig.Header || []) as Record<string, unknown>[];
    const query = (p.Query || mcpConfig.PluginQuery || apiConfig.Query || []) as Record<string, unknown>[];

    // 鉴权类型：v2 PluginSummary 将 AuthType 下沉到 Config.{Api|MCP}PluginConfig.AuthConfig.AuthType
    // 旧协议直接在顶层 p.AuthType；这里做一次兼容查找
    const apiAuthConfig = (apiConfig.AuthConfig || {}) as Record<string, unknown>;
    const mcpAuthConfig = (mcpConfig.AuthConfig || {}) as Record<string, unknown>;
    const authType = (
        p.AuthType
        ?? apiAuthConfig.AuthType
        ?? mcpAuthConfig.AuthType
        ?? 0
    ) as number;

    // v2 PluginProfile.Author 对应旧 ListPlugins 中的 UserInfo.Name / Creator / creator
    const author = (profile.Author || '') as string;
    const userInfo = (p.UserInfo as Record<string, unknown> | undefined)
        || (author ? { Name: author } : undefined);

    return {
        // 原始字段全量保留，便于深层访问
        ...p,
        // ---- 与旧 ListPlugins 平铺字段对齐 ----
        PluginId: p.PluginId || p.plugin_id || '',
        Name: profile.Name || p.Name || p.PluginName || '',
        PluginName: profile.Name || p.PluginName || '',
        Desc: profile.Description || p.Desc || p.PluginDesc || '',
        PluginDesc: profile.Description || p.PluginDesc || '',
        Introduction: operation.Introduction || p.Introduction || '',
        IconUrl: profile.IconUrl || p.IconUrl || '',
        // PluginSource(0-CUSTOM, 1-OFFICIAL, 2-THIRD_PARTY) ≈ 旧 PluginType
        PluginType: profile.PluginSource ?? p.PluginType ?? 0,
        // PluginKind(0-API, 1-CODE, 2-MCP, 3-APP) ≈ 旧 CreateType
        CreateType: profile.PluginKind ?? p.CreateType ?? 0,
        PluginClass: profile.PluginClass ?? p.PluginClass ?? 0,
        // BillingType(0-FREE, 1-LIMITED_FREE, 2-OFFICIAL_PAID, 3-OFFICIAL_PAID_OLD_FREE) ≈ 旧 FinanceType
        FinanceType: operation.BillingType ?? p.FinanceType ?? 0,
        CategoryKey: operation.CategoryKey || p.CategoryKey || '',
        Status: p.Status ?? 0,
        IsFavorite: !!(userState.IsFavorite ?? p.IsFavorite),
        ToolCount: statistics.ToolCount ?? p.ToolCount ?? 0,
        // 创作者/作者信息（v2 PluginProfile.Author，老代码读 UserInfo.Name / Creator / creator）
        Author: author,
        Creator: author || (p.Creator as string) || (p.creator as string) || '',
        UserInfo: userInfo,
        // 透出 BindAgentTool 等场景所需的插件鉴权/配置字段
        Headers: headers,
        Query: query,
        Tools: tools,
        ToolList: tools,
        // v2 协议不再返回 AuthMode/EnableRoleAuth，buildPluginConfig 默认值兜底（无鉴权）
        AuthMode: p.AuthMode ?? 0,
        EnableRoleAuth: !!p.EnableRoleAuth,
        // OAuth 等鉴权判定字段（v2 PluginSummary 在 Config.*PluginConfig.AuthConfig.AuthType）
        AuthType: authType,
    };
}

/**
 * 将 v2 Tool 嵌套对象扁平化为旧 ListPlugins 工具结构。
 *
 * v2 Tool 形如：
 *   {
 *     ToolId, PluginId, Name, Description,
 *     ToolConfig: { ApiToolConfig | MCPToolConfig | AppToolConfig | CodeToolConfig },
 *     Billing:    { BillingType, ... },
 *     ToolAccessMode, CallCount,
 *   }
 *
 * 平铺后：Desc / FinanceType / Inputs / Outputs / Body 直接挂顶层，让上游
 * `getToolDesc / getToolFinanceType / getToolTags / buildToolConfig` 无需感知差异。
 */
function flattenTool(t: Record<string, unknown>): Record<string, unknown> {
    const toolConfig = (t.ToolConfig || {}) as Record<string, unknown>;
    const apiToolConfig = (toolConfig.ApiToolConfig || {}) as Record<string, unknown>;
    const mcpToolConfig = (toolConfig.MCPToolConfig || {}) as Record<string, unknown>;
    const appToolConfig = (toolConfig.AppToolConfig || {}) as Record<string, unknown>;
    const codeToolConfig = (toolConfig.CodeToolConfig || {}) as Record<string, unknown>;
    const billing = (t.Billing || {}) as Record<string, unknown>;

    // 输入参数：旧 ListPlugins 用 t.Inputs；v2 不同 ToolConfig 字段位置不同：
    //   API:  query + body 拼接（header 通过插件级 Headers 处理）
    //   MCP/App/Code: Inputs
    const inputs = (
        t.Inputs || t.inputs
        || mcpToolConfig.Inputs
        || appToolConfig.Inputs
        || codeToolConfig.Inputs
        || (Array.isArray(apiToolConfig.Query) || Array.isArray(apiToolConfig.Body)
            ? [
                ...((apiToolConfig.Query as Record<string, unknown>[]) || []),
                ...((apiToolConfig.Body as Record<string, unknown>[]) || []),
            ]
            : [])
    ) as Record<string, unknown>[];

    const outputs = (
        t.Outputs || t.outputs
        || apiToolConfig.Outputs
        || mcpToolConfig.Outputs
        || appToolConfig.Outputs
        || codeToolConfig.Outputs
        || []
    ) as Record<string, unknown>[];

    // 工具计费：v2 在 Billing.BillingType，旧 ListPlugins 在 FinanceType
    const financeType = (billing.BillingType ?? t.FinanceType ?? 0) as number;

    return {
        ...t,
        ToolId: t.ToolId || t.tool_id || t.id || '',
        Name: t.Name || t.ToolName || t.tool_name || '',
        // v2 用 Description，旧用 Desc
        Desc: t.Description || t.Desc || t.ToolDesc || t.tool_desc || '',
        Description: t.Description || t.Desc || t.ToolDesc || t.tool_desc || '',
        Inputs: inputs,
        Outputs: outputs,
        Body: apiToolConfig.Body || t.Body || [],
        FinanceType: financeType,
    };
}

/**
 * 拉取插件详情（v2 DescribePlugin）。
 *
 * 用途：DescribePluginSummaryList 返回的 PluginSummary 不包含工具明细，
 *      UI 在展开插件卡片时需要按需调用本接口获取 ToolList。
 *
 * FieldMask：穷举 UI 渲染 + 绑定流程实际用到的字段，剔除 PluginVersion/CreateTime/UpdateTime/NeedOnline
 * 等当前 UI 不消费的字段以减小响应体积。注意：
 *   - 必须包含 `ToolList` 完整结构（含 ToolConfig.{Api|MCP|App|Code}ToolConfig.{Inputs|Outputs|Header|Query|Body}），
 *     因为 buildToolConfig 在绑定工具时需要从中读 InputList / OutputList 构造 AgentToolConfig；
 *     不能像 gpt-demo plugin-center 那样仅取 ToolList.{ToolId,Name,Description,Billing} 后通过 DescribeTool
 *     懒加载补 ToolConfig（本组件点击即绑定，没有 DescribeTool 调用）。
 *   - `Config` 必须包含，OAuth 判定 + 插件鉴权 Header/Query 都依赖它。
 *
 * 返回 plugin 已经过 flattenPluginSummary 处理（工具列表内部也已 flattenTool），
 * 调用方可以直接通过 `plugin.Tools` 拿到与旧 ListPlugins 等价的扁平结构。
 */
export async function fetchPluginDetail(params: {
    applicationId: string;
    pluginId: string;
    spaceId?: string;
}, apiPath?: string): Promise<{ plugin: Record<string, unknown> | null }> {
    if (!params.pluginId) {
        return { plugin: null };
    }
    const data = await forwardRequest(
        apiPath || defaultConnectorPluginApiConfig.describePluginApi!,
        params.applicationId,
        {
            PluginId: params.pluginId,
            SpaceId: params.spaceId || undefined,
            FieldMask: {
                Paths: [
                    'PluginId',
                    'Profile',
                    'Config',
                    'Operation',
                    'Status',
                    'UserState',
                    'Statistics',
                    // ToolList 整体必须包含 ToolConfig 子树（绑定流程需要）
                    'ToolList',
                ],
            },
        },
    );
    // v2 DescribePluginRsp = { Plugin: Plugin }；旧协议可能直接平铺
    const rawPlugin = (data.Plugin || data.plugin || data) as Record<string, unknown>;
    if (!rawPlugin || typeof rawPlugin !== 'object') {
        return { plugin: null };
    }
    return { plugin: flattenPluginSummary(rawPlugin) };
}

/**
 * 查询插件分类列表
 */
export async function fetchPluginCategories(params: {
    applicationId: string;
    /** PluginClasses 过滤：0=工具分类，1=连接器分类 */
    pluginClass?: number;
}, apiPath?: string): Promise<{ categories: Array<{ category_key: string; category_name: string }> }> {
    const data = await forwardRequest(
        apiPath || defaultConnectorPluginApiConfig.pluginCategoryListApi!,
        params.applicationId,
        { PluginClasses: [params.pluginClass ?? 0] },
    );
    const rawList = (data.Categories || data.categories || []) as Array<Record<string, unknown>>;
    return {
        categories: rawList.map((c) => ({
            category_key: (c.category_key || c.CategoryKey || '') as string,
            category_name: (c.category_name || c.CategoryName || '') as string,
        })),
    };
}

/**
 * 创建连接器 OAuth 授权 URL
 */
export async function createOAuthUrl(params: {
    applicationId: string;
    pluginId: string;
    appBizId?: string;
}, apiPath?: string): Promise<{ oauthUrl: string }> {
    const data = await forwardRequest(
        apiPath || defaultConnectorPluginApiConfig.createPluginOAuthUrlApi!,
        params.applicationId,
        {
            PluginId: params.pluginId,
            AppBizId: params.appBizId || params.applicationId,
            AuthMode: 1, 
        },
    );
    return { oauthUrl: (data.UserAuthorizationUrl || data.OAuthUrl || data.oauth_url || '') as string };
}

/* ===== BindAgentTool ===== */

/** AgentToolConfig 中单个工具配置 */
export interface AgentToolConfig {
    PluginId: string;
    ToolId: string;
    Description: string;
    InputList: AgentToolParameter[];
    OutputList: AgentToolParameter[];
    HeaderParameterList: AgentPluginParameter[];
    QueryParameterList: AgentPluginParameter[];
    ToolSource: number;
}

/** 工具参数（inputs/outputs） */
export interface AgentToolParameter {
    Name: string;
    Description: string;
    Type?: number;
    SubParameterList?: AgentToolParameter[];
    AnalysisMethod?: number;
}

/** 插件参数（headers/query） */
export interface AgentPluginParameter {
    ParameterName: string;
    IsGlobalHidden: boolean;
    IsRequired: boolean;
    Input?: Record<string, unknown>;
}

/** BindAgentTool 的 plugin 配置 */
export interface AgentPluginConfig {
    PluginId: string;
    HeaderParameterList: AgentPluginParameter[];
    QueryParameterList: AgentPluginParameter[];
    IsRoleAuth: boolean;
    AuthMode: number;
    PluginClass: number;
}

/**
 * 将 ListPlugins / DescribePluginSummaryList 返回的原始工具对象转为 BindAgentTool 需要的 AgentToolConfig 格式
 *
 * 兼容两种 schema：
 *  - 旧 ListPlugins：tool.Inputs / tool.Outputs / plugin.Headers / plugin.Query
 *  - 新 DescribePluginSummaryList (v2)：tool.ToolConfig.{Api|MCP|App|Code}ToolConfig.{Inputs|Outputs|Header|Query|Body}
 *    且插件级参数位于 plugin.Config.MCPPluginConfig.{PluginHeader|PluginQuery}
 */
export function buildToolConfig(
    pluginItem: Record<string, unknown>,
    toolItem: Record<string, unknown>,
): { Config: AgentToolConfig } {
    const pluginId = (pluginItem.PluginId || pluginItem.plugin_id || '') as string;
    const toolId = (toolItem.ToolId || toolItem.tool_id || toolItem.id || '') as string;
    const toolDesc = (toolItem.Description || toolItem.Desc || toolItem.tool_desc || toolItem.description || '') as string;

    // v2 工具的输入/输出在 ToolConfig 下：API 工具用 Header/Query/Body，其他工具用 Inputs；输出统一 Outputs
    const toolConfig = (toolItem.ToolConfig || {}) as Record<string, unknown>;
    const apiToolConfig = (toolConfig.ApiToolConfig || {}) as Record<string, unknown>;
    const mcpToolConfig = (toolConfig.MCPToolConfig || {}) as Record<string, unknown>;
    const appToolConfig = (toolConfig.AppToolConfig || {}) as Record<string, unknown>;
    const codeToolConfig = (toolConfig.CodeToolConfig || {}) as Record<string, unknown>;

    const inputs = (
        toolItem.Inputs || toolItem.inputs
        || mcpToolConfig.Inputs
        || appToolConfig.Inputs
        || codeToolConfig.Inputs
        // API 工具：query 作为主要 inputs，body 作为补充
        || (Array.isArray(apiToolConfig.Query) || Array.isArray(apiToolConfig.Body)
            ? [
                ...((apiToolConfig.Query as Record<string, unknown>[]) || []),
                ...((apiToolConfig.Body as Record<string, unknown>[]) || []),
            ]
            : [])
    ) as Record<string, unknown>[];

    const outputs = (
        toolItem.Outputs || toolItem.outputs
        || apiToolConfig.Outputs
        || mcpToolConfig.Outputs
        || appToolConfig.Outputs
        || codeToolConfig.Outputs
        || []
    ) as Record<string, unknown>[];

    // 插件级 Headers/Query：旧字段优先，否则取 v2 MCPPluginConfig 下字段
    const pluginConfig = (pluginItem.Config || {}) as Record<string, unknown>;
    const mcpPluginConfig = (pluginConfig.MCPPluginConfig || {}) as Record<string, unknown>;
    const headers = (
        pluginItem.Headers || pluginItem.headers
        || mcpPluginConfig.PluginHeader || []
    ) as Record<string, unknown>[];
    const query = (
        pluginItem.Query || pluginItem.query
        || mcpPluginConfig.PluginQuery || []
    ) as Record<string, unknown>[];

    const toolSource = Number(toolItem.ToolSource || toolItem.tool_source || 0);

    const mapParam = (p: Record<string, unknown>): AgentToolParameter => ({
        Name: (p.Name || p.name || p.param_name || '') as string,
        Description: (p.Description || p.Desc || p.desc || p.description || '') as string,
        Type: Number(p.Type || p.type || 0),
        SubParameterList: ((p.SubParams || p.sub_params || p.sub_parameter_list || []) as Record<string, unknown>[]).map(mapParam),
    });

    const mapPluginParam = (p: Record<string, unknown>): AgentPluginParameter => ({
        ParameterName: (p.ParameterName || p.ParamName || p.param_name || p.Name || p.name || '') as string,
        IsGlobalHidden: !!(p.IsGlobalHidden || p.GlobalHidden || p.global_hidden),
        IsRequired: !!(p.IsRequired || p.is_required),
        Input: (p.Input || p.input || undefined) as Record<string, unknown> | undefined,
    });

    return {
        Config: {
            PluginId: pluginId,
            ToolId: toolId,
            Description: toolDesc,
            InputList: inputs.map(mapParam),
            OutputList: outputs.map(mapParam),
            HeaderParameterList: headers.map(mapPluginParam),
            QueryParameterList: query.map(mapPluginParam),
            ToolSource: toolSource,
        },
    };
}

/**
 * 构建 BindAgentTool 的 plugin 配置
 *
 * 兼容两种 schema：
 *  - 旧 ListPlugins：plugin.Headers / plugin.Query / plugin.EnableRoleAuth / plugin.AuthMode
 *  - 新 DescribePluginSummaryList (v2)：plugin.Config.MCPPluginConfig.{PluginHeader|PluginQuery}
 *    v2 协议中 EnableRoleAuth/AuthMode 字段不再返回（鉴权信息已下沉到 AuthConfig），默认值兜底
 */
export function buildPluginConfig(pluginItem: Record<string, unknown>): AgentPluginConfig {
    const pluginConfig = (pluginItem.Config || {}) as Record<string, unknown>;
    const mcpPluginConfig = (pluginConfig.MCPPluginConfig || {}) as Record<string, unknown>;
    const headers = (
        pluginItem.Headers || pluginItem.headers
        || mcpPluginConfig.PluginHeader || []
    ) as Record<string, unknown>[];
    const query = (
        pluginItem.Query || pluginItem.query
        || mcpPluginConfig.PluginQuery || []
    ) as Record<string, unknown>[];

    const mapPluginParam = (p: Record<string, unknown>): AgentPluginParameter => ({
        ParameterName: (p.ParameterName || p.ParamName || p.param_name || p.Name || p.name || '') as string,
        IsGlobalHidden: !!(p.IsGlobalHidden || p.GlobalHidden || p.global_hidden),
        IsRequired: !!(p.IsRequired || p.is_required),
        Input: (p.Input || p.input || undefined) as Record<string, unknown> | undefined,
    });

    // v2 PluginProfile.PluginClass 优先；旧 PluginClass 顶层兜底
    const profile = (pluginItem.Profile || {}) as Record<string, unknown>;
    const pluginClass = Number(
        profile.PluginClass ?? pluginItem.PluginClass ?? pluginItem.plugin_class ?? 0,
    );

    return {
        PluginId: (pluginItem.PluginId || pluginItem.plugin_id || '') as string,
        HeaderParameterList: headers.map(mapPluginParam),
        QueryParameterList: query.map(mapPluginParam),
        IsRoleAuth: !!(pluginItem.EnableRoleAuth || pluginItem.enable_role_auth),
        AuthMode: Number(pluginItem.AuthMode || pluginItem.auth_mode || 0),
        PluginClass: pluginClass,
    };
}

/**
 * 绑定工具到 Agent（BindAgentTool）
 * 对应 gpt-demo 中 API.BindAgentTool 的调用
 */
export async function bindAgentTool(params: {
    applicationId: string;
    appId: string;
    agentId: string;
    pluginId: string;
    toolSource?: number;
    toolList?: Array<{ Config: AgentToolConfig }>;
    plugin?: AgentPluginConfig;
}, apiPath?: string): Promise<void> {
    await forwardRequest(
        apiPath || defaultConnectorPluginApiConfig.bindAgentToolApi!,
        params.applicationId,
        {
            AppId: params.appId,
            AgentId: params.agentId,
            PluginId: params.pluginId,
            ToolSource: params.toolSource ?? 0,
            ToolList: params.toolList,
            Plugin: params.plugin,
        },
    );
}

/**
 * 解绑工具（UnbindAgentTool）
 * 对应 gpt-demo 中 API.UnbindAgentTool 的调用
 *   - PluginId 必传
 *   - ToolId：单工具删除时传；整插件/连接器删除时省略
 */
export async function unbindAgentTool(params: {
    applicationId: string;
    appId: string;
    agentId: string;
    pluginId: string;
    toolId?: string;
}, apiPath?: string): Promise<void> {
    await forwardRequest(
        apiPath || defaultConnectorPluginApiConfig.unbindAgentToolApi!,
        params.applicationId,
        {
            AppId: params.appId,
            AgentId: params.agentId,
            PluginId: params.pluginId,
            ToolId: params.toolId || '',
        },
    );
}

/**
 * 修改 Agent 工具列表（ModifyAgentToolList）
 * 只需传入当前修改的 plugin/tool，不需要传全量已有数据。
 *
 * @param params.pluginIdList 当前修改涉及的插件 ID 列表
 * @param params.toolIdList 当前修改涉及的工具 ID 列表
 * @param params.pluginList 当前修改的插件配置列表（AgentPluginConfig）
 * @param params.toolList 当前修改的工具配置列表（AgentToolSpec）
 */
export async function modifyAgentToolList(params: {
    applicationId: string;
    appId: string;
    agentId: string;
    pluginIdList: string[];
    toolIdList: string[];
    pluginList: Record<string, unknown>[];
    toolList: Record<string, unknown>[];
}, apiPath?: string): Promise<void> {
    await forwardRequest(
        apiPath || defaultConnectorPluginApiConfig.modifyAgentToolListApi!,
        params.applicationId,
        {
            AppId: params.appId,
            AgentId: params.agentId,
            PluginIdList: params.pluginIdList,
            ToolIdList: params.toolIdList,
            PluginList: params.pluginList,
            ToolList: params.toolList,
        },
    );
}
