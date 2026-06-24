/**
 * Connector & Plugin API 服务
 * 通过 /adp/<Action> 通用转发端点调用
 */
import { httpService } from './httpService';

/** Connector/Plugin API 路径配置 */
export interface ConnectorPluginApiConfig {
    listPluginsApi?: string;
    createPluginOAuthUrlApi?: string;
    pluginCategoryListApi?: string;
    bindAgentToolApi?: string;
    unbindAgentToolApi?: string;
}

export const defaultConnectorPluginApiConfig: ConnectorPluginApiConfig = {
    listPluginsApi: '/adp/ListPlugins',
    createPluginOAuthUrlApi: '/adp/CreatePluginOAuthUrl',
    pluginCategoryListApi: '/adp/DescribePluginCategoryList',
    bindAgentToolApi: '/adp/BindAgentTool',
    unbindAgentToolApi: '/adp/UnbindAgentTool',
};

/** Plugin 类型枚举 */
export enum PluginClassEnum {
    NORMAL = 0,
    CONNECTOR = 1,
}

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
}, apiPath?: string): Promise<{
    plugins: Record<string, unknown>[];
    total: number;
}> {
    const data = await forwardRequest(
        apiPath || defaultConnectorPluginApiConfig.listPluginsApi!,
        params.applicationId,
        {
            Query: params.query || '',
            PluginTypes: params.pluginTypes || [0, 1, 2],
            PluginClasses: [params.pluginClass],
            PageNumber: params.pageNumber ?? 1,
            PageSize: params.pageSize ?? 20,
            SortType: params.sortType ?? 0,
            CategoryKeys: params.categoryKeys || [],
            FavoriteOnly: !!params.favoriteOnly,
            FinanceTypeList: params.financeTypeList || undefined,
            CreateTypes: params.createTypes || undefined,
            IsEnabled: params.enabledOnly ? true : undefined,
        },
    );
    return {
        plugins: (data.Plugins || data.plugins || []) as Record<string, unknown>[],
        total: (data.Total || data.total || 0) as number,
    };
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
            AuthMode: 2, 
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
 * 将 ListPlugins 返回的原始工具对象转为 BindAgentTool 需要的 AgentToolConfig 格式
 */
export function buildToolConfig(
    pluginItem: Record<string, unknown>,
    toolItem: Record<string, unknown>,
): { Config: AgentToolConfig } {
    const pluginId = (pluginItem.PluginId || pluginItem.plugin_id || '') as string;
    const toolId = (toolItem.ToolId || toolItem.tool_id || toolItem.id || '') as string;
    const toolDesc = (toolItem.Desc || toolItem.tool_desc || toolItem.description || '') as string;
    const inputs = (toolItem.Inputs || toolItem.inputs || []) as Record<string, unknown>[];
    const outputs = (toolItem.Outputs || toolItem.outputs || []) as Record<string, unknown>[];
    const headers = (pluginItem.Headers || pluginItem.headers || []) as Record<string, unknown>[];
    const query = (pluginItem.Query || pluginItem.query || []) as Record<string, unknown>[];
    const toolSource = Number(toolItem.ToolSource || toolItem.tool_source || 0);

    const mapParam = (p: Record<string, unknown>): AgentToolParameter => ({
        Name: (p.Name || p.name || p.param_name || '') as string,
        Description: (p.Desc || p.desc || p.description || '') as string,
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
        config: {
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
 */
export function buildPluginConfig(pluginItem: Record<string, unknown>): AgentPluginConfig {
    const headers = (pluginItem.Headers || pluginItem.headers || []) as Record<string, unknown>[];
    const query = (pluginItem.Query || pluginItem.query || []) as Record<string, unknown>[];

    const mapPluginParam = (p: Record<string, unknown>): AgentPluginParameter => ({
        ParameterName: (p.ParameterName || p.ParamName || p.param_name || p.Name || p.name || '') as string,
        IsGlobalHidden: !!(p.IsGlobalHidden || p.GlobalHidden || p.global_hidden),
        IsRequired: !!(p.IsRequired || p.is_required),
        Input: (p.Input || p.input || undefined) as Record<string, unknown> | undefined,
    });

    return {
        PluginId: (pluginItem.PluginId || pluginItem.plugin_id || '') as string,
        HeaderParameterList: headers.map(mapPluginParam),
        QueryParameterList: query.map(mapPluginParam),
        IsRoleAuth: !!(pluginItem.EnableRoleAuth || pluginItem.enable_role_auth),
        AuthMode: Number(pluginItem.AuthMode || pluginItem.auth_mode || 0),
        PluginClass: Number(pluginItem.PluginClass || pluginItem.plugin_class || 0),
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
