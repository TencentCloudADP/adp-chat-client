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
    return (response?.Response || response || {}) as Record<string, unknown>;
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
            AuthMode: 1, // WORKSPACE
        },
    );
    return { oauthUrl: (data.OAuthUrl || data.oauth_url || '') as string };
}

/* ===== BindAgentTool ===== */

/** AgentToolConfig 中单个工具配置 */
export interface AgentToolConfig {
    plugin_id: string;
    tool_id: string;
    description: string;
    input_list: AgentToolParameter[];
    output_list: AgentToolParameter[];
    header_parameter_list: AgentPluginParameter[];
    query_parameter_list: AgentPluginParameter[];
    tool_source: number;
}

/** 工具参数（inputs/outputs） */
export interface AgentToolParameter {
    name: string;
    description: string;
    type?: number;
    sub_parameter_list?: AgentToolParameter[];
    analysis_method?: number;
}

/** 插件参数（headers/query） */
export interface AgentPluginParameter {
    param_name: string;
    param_value: string;
    input?: Record<string, unknown>;
    global_hidden?: boolean;
}

/** BindAgentTool 的 plugin 配置 */
export interface AgentPluginConfig {
    plugin_id: string;
    header_parameter_list: AgentPluginParameter[];
    query_parameter_list: AgentPluginParameter[];
    is_role_auth: boolean;
    auth_mode: number;
    plugin_class: number;
}

/**
 * 将 ListPlugins 返回的原始工具对象转为 BindAgentTool 需要的 AgentToolConfig 格式
 */
export function buildToolConfig(
    pluginItem: Record<string, unknown>,
    toolItem: Record<string, unknown>,
): { config: AgentToolConfig } {
    const pluginId = (pluginItem.PluginId || pluginItem.plugin_id || '') as string;
    const toolId = (toolItem.ToolId || toolItem.tool_id || toolItem.id || '') as string;
    const toolDesc = (toolItem.Desc || toolItem.tool_desc || toolItem.description || '') as string;
    const inputs = (toolItem.Inputs || toolItem.inputs || []) as Record<string, unknown>[];
    const outputs = (toolItem.Outputs || toolItem.outputs || []) as Record<string, unknown>[];
    const headers = (pluginItem.Headers || pluginItem.headers || []) as Record<string, unknown>[];
    const query = (pluginItem.Query || pluginItem.query || []) as Record<string, unknown>[];
    const toolSource = Number(toolItem.ToolSource || toolItem.tool_source || 0);

    const mapParam = (p: Record<string, unknown>): AgentToolParameter => ({
        name: (p.Name || p.name || p.param_name || '') as string,
        description: (p.Desc || p.desc || p.description || '') as string,
        type: Number(p.Type || p.type || 0),
        sub_parameter_list: ((p.SubParams || p.sub_params || p.sub_parameter_list || []) as Record<string, unknown>[]).map(mapParam),
    });

    const mapPluginParam = (p: Record<string, unknown>): AgentPluginParameter => ({
        param_name: (p.ParamName || p.param_name || p.Name || p.name || '') as string,
        param_value: (p.ParamValue || p.param_value || p.DefaultValue || p.default_value || '') as string,
        input: (p.Input || p.input || undefined) as Record<string, unknown> | undefined,
        global_hidden: !!(p.GlobalHidden || p.global_hidden),
    });

    return {
        config: {
            plugin_id: pluginId,
            tool_id: toolId,
            description: toolDesc,
            input_list: inputs.map(mapParam),
            output_list: outputs.map(mapParam),
            header_parameter_list: headers.map(mapPluginParam),
            query_parameter_list: query.map(mapPluginParam),
            tool_source: toolSource,
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
        param_name: (p.ParamName || p.param_name || p.Name || p.name || '') as string,
        param_value: (p.ParamValue || p.param_value || p.DefaultValue || p.default_value || '') as string,
        input: (p.Input || p.input || undefined) as Record<string, unknown> | undefined,
        global_hidden: !!(p.GlobalHidden || p.global_hidden),
    });

    return {
        plugin_id: (pluginItem.PluginId || pluginItem.plugin_id || '') as string,
        header_parameter_list: headers.map(mapPluginParam),
        query_parameter_list: query.map(mapPluginParam),
        is_role_auth: !!(pluginItem.EnableRoleAuth || pluginItem.enable_role_auth),
        auth_mode: Number(pluginItem.AuthMode || pluginItem.auth_mode || 0),
        plugin_class: Number(pluginItem.PluginClass || pluginItem.plugin_class || 0),
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
    toolList?: Array<{ config: AgentToolConfig }>;
    plugin?: AgentPluginConfig;
}, apiPath?: string): Promise<void> {
    await forwardRequest(
        apiPath || defaultConnectorPluginApiConfig.bindAgentToolApi!,
        params.applicationId,
        {
            app_id: params.appId,
            agent_id: params.agentId,
            plugin_id: params.pluginId,
            tool_source: params.toolSource ?? 0,
            tool_list: params.toolList,
            plugin: params.plugin,
        },
    );
}

/**
 * 解绑工具（UnbindAgentTool）
 * 对应 gpt-demo 中 API.UnbindAgentTool 的调用
 *   - plugin_id 必传
 *   - tool_id：单工具删除时传；整插件/连接器删除时省略
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
            app_id: params.appId,
            agent_id: params.agentId,
            plugin_id: params.pluginId,
            tool_id: params.toolId || '',
        },
    );
}
