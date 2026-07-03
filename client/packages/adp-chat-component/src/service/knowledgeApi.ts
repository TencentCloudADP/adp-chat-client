/**
 * Knowledge API 服务
 * 通过 /adp/<Action> 通用转发端点调用腾讯云 ADP / LKE 知识库相关接口
 *
 * 涉及接口：
 *  - ListReferShareKnowledge：获取当前应用可引用的共享知识库列表（一次性返回，无分页）
 *  - GetKBDefaultConfig：查询知识库默认检索配置（strategy、rerank 等）
 *
 * 备注：
 *  - "已开启的知识库"实际保存在 KnowledgeRetrievalAnswer 工具的 KnowledgeScope 输入节点中
 *    （参考 gpt-demo/set-plugin-dialog）；本模块只提供只读接口，写入通过 ModifyAgentToolList 完成。
 */
import { httpService } from './httpService';

/** Knowledge API 路径配置 */
export interface KnowledgeApiConfig {
    /** ListReferShareKnowledge 路径 */
    listReferShareKnowledgeApi?: string;
    /** GetKBDefaultConfig 路径 */
    getKBDefaultConfigApi?: string;
}

export const defaultKnowledgeApiConfig: KnowledgeApiConfig = {
    listReferShareKnowledgeApi: '/adp/ListReferShareKnowledge',
    getKBDefaultConfigApi: '/adp/GetKBDefaultConfig',
};

/**
 * 通用转发请求（兼容 snake_case 和 PascalCase 响应）
 */
async function forwardRequest(
    url: string,
    applicationId: string,
    payload: Record<string, unknown> = {},
): Promise<Record<string, unknown>> {
    const response = await httpService.post(url, {
        ApplicationId: applicationId,
        Payload: payload,
    });
    const data = (response?.Response || response || {}) as Record<string, unknown>;
    const err = data.Error as Record<string, unknown> | undefined;
    if (err && (err.Code || err.code)) {
        const code = (err.Code || err.code) as string;
        const message = (err.Message || err.message || code) as string;
        throw new Error(`[${code}] ${message}`);
    }
    return data;
}

/** 共享知识库简介（对齐 gpt-demo/smart-webim 的 list 项） */
export interface ShareKnowledgeItem {
    /** 知识库业务 ID（用作 KnowledgeBizId） */
    knowledgeBizId: string;
    /** 知识库名称 */
    knowledgeName: string;
    /** 知识库描述 */
    knowledgeDescription: string;
    /** 是否为"默认知识库"（即 app_biz_id 对应的当前应用知识库） */
    isDefault?: boolean;
    /** 原始返回项（保留全部字段方便扩展使用） */
    raw?: Record<string, unknown>;
}

/**
 * 获取当前应用可引用的共享知识库列表。
 *
 * 备注：ListReferShareKnowledge 一次性返回全部记录，无分页参数。
 * 前端可选择将"默认知识库"（bizId = applicationId）置顶显示。
 *
 * @param params.applicationId 应用 ID（同时作为 AppBizId 传入）
 * @param params.includeDefault 是否在返回列表最前面塞一条"默认知识库"（默认 true）
 * @param params.defaultName 默认知识库的展示名（i18n 文案）
 * @param apiPath API 路径覆盖
 */
export async function listReferShareKnowledge(
    params: {
        applicationId: string;
        includeDefault?: boolean;
        defaultName?: string;
    },
    apiPath?: string,
): Promise<{ list: ShareKnowledgeItem[] }> {
    if (!params.applicationId) return { list: [] };

    const data = await forwardRequest(
        apiPath || defaultKnowledgeApiConfig.listReferShareKnowledgeApi!,
        params.applicationId,
        {
            AppBizId: params.applicationId,
        },
    );

    // 后端返回 snake_case list（gpt-demo 风格）或 PascalCase List（新协议），做兼容
    const rawList = (data.list || data.List || data.KnowledgeList || []) as Array<Record<string, unknown>>;
    const shareList: ShareKnowledgeItem[] = rawList.map((item) => ({
        knowledgeBizId: (item.knowledge_biz_id || item.KnowledgeBizId || '') as string,
        knowledgeName: (item.knowledge_name || item.KnowledgeName || '') as string,
        knowledgeDescription: (item.knowledge_description || item.KnowledgeDescription || item.description || item.Description || '') as string,
        isDefault: false,
        raw: item,
    })).filter((it) => !!it.knowledgeBizId);

    if (params.includeDefault !== false) {
        // 参考 gpt-demo：默认知识库 id 取当前 applicationId（等价于 app_biz_id）
        const defaultItem: ShareKnowledgeItem = {
            knowledgeBizId: params.applicationId,
            knowledgeName: params.defaultName || '默认知识库',
            knowledgeDescription: '',
            isDefault: true,
        };
        // 若 shareList 中已包含同 id 项，避免重复
        const filtered = shareList.filter((it) => it.knowledgeBizId !== defaultItem.knowledgeBizId);
        return { list: [defaultItem, ...filtered] };
    }
    return { list: shareList };
}

/** GetKBDefaultConfig 返回的检索配置结构（保留原始 PascalCase 字段） */
export interface KBDefaultConfig {
    /** 原始 retrieval_config / RetrievalConfig */
    retrievalConfig: Record<string, unknown>;
    /** 全部原始响应 */
    raw: Record<string, unknown>;
}

/**
 * 查询知识库默认检索配置（策略、召回参数、模型等）。
 *
 * 备注：
 *  - 该接口仅读取"默认检索配置"，不返回 filter_type / knowledge_list（"是否全部知识库"及"选中的知识库"
 *    信息实际存储在 KnowledgeRetrievalAnswer 工具的 KnowledgeScope 输入节点中）。
 *  - 弹窗 UI 打开时可并行调该接口用于展示默认参数或提供高级设置的兜底值。
 *
 * @param params.applicationId 应用 ID
 * @param params.configTypes 需要拉取的配置类型（默认 [1]，与 gpt-demo 对齐）
 * @param apiPath API 路径覆盖
 */
export async function getKBDefaultConfig(
    params: {
        applicationId: string;
        configTypes?: number[];
    },
    apiPath?: string,
): Promise<KBDefaultConfig> {
    const data = await forwardRequest(
        apiPath || defaultKnowledgeApiConfig.getKBDefaultConfigApi!,
        params.applicationId,
        {
            ConfigTypes: params.configTypes || [1],
        },
    );
    const retrievalConfig = (data.RetrievalConfig || data.retrieval_config || {}) as Record<string, unknown>;
    return {
        retrievalConfig,
        raw: data,
    };
}
