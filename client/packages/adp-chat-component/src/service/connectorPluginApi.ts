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
}

export const defaultConnectorPluginApiConfig: ConnectorPluginApiConfig = {
    listPluginsApi: '/adp/ListPlugins',
    createPluginOAuthUrlApi: '/adp/CreatePluginOAuthUrl',
    pluginCategoryListApi: '/adp/DescribePluginCategoryList',
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
