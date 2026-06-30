/**
 * Skills 数据模型和类型定义
 */

/** Skill 类型常量 */
export const AgentSkillType = {
    /** 技能广场官方/第三方 */
    HUB_OFFICIAL: 1,
    /** 技能广场自定义 */
    HUB_CUSTOM: 2,
    /** 从技能广场内置（只读，不可手动安装/卸载） */
    HUB_PRESET: 3,
    /** 自定义安装在沙箱（无 SkillId，不上报） */
    SANDBOX_CUSTOM: 4,
} as const;
export type AgentSkillType = (typeof AgentSkillType)[keyof typeof AgentSkillType];

/** Service 端返回的 Agent Skill 信息（对应 proto AgentSkill，字段为 PascalCase json_name） */
export interface AgentSkillInfo {
    /** SkillID */
    SkillId?: string;
    /** Skill 英文标识 */
    Name?: string;
    /** Skill 描述 */
    Description?: string;
    /** Skill 展示名称 */
    DisplayName?: string;
    /** Skill 展示描述 */
    DisplayDescription?: string;
    /** SKILL.md 在沙箱内绝对路径 */
    Location?: string;
    /** Skill 图标 url */
    IconUrl?: string;
    /** Skill 来源类型：1=官方 2=自定义 3=内置 4=沙箱 */
    SourceType?: number;
    /** 当前版本 */
    CurrentVersion?: string;
    /** 计费类型 */
    BillingType?: number;
    /** 是否受删除保护 */
    IsDeleteProtected?: boolean;
    /** 分类名称 */
    CategoryName?: string;
}

/** Skill 摘要信息（技能广场列表项） */
export interface SkillSummary {
    skill_id: string;
    name: string;
    description: string;
    profile?: SkillProfile;
    /** 版本列表 */
    versions?: SkillVersion[];
    /** 当前版本 */
    current_version?: string;
    /** 分类 */
    category_name?: string;
    /** 是否已安装 */
    installed?: boolean;
    /** 来源：1=文件上传 2=SkillHub 3=AIGC */
    source?: number;
    /** 原始分类信息 */
    classification_info?: SkillClassification;
    /** 当前版本详情 */
    current_version_info?: SkillVersionInfo;
    analysis_info?: Record<string, unknown>;
}

/** Skill 配置信息 */
export interface SkillProfile {
    /** 类型 */
    type?: string;
    /** 计费类型 */
    billing_type?: number;
    /** 来源链接 */
    source_link?: string;
    /** 分类 key */
    category_key?: string;
    /** Skill ID */
    skill_id?: string;
}

/** Skill 版本 */
export interface SkillVersion {
    version_id: string;
    version: string;
    analysis_info?: Record<string, unknown>;
}

/** Skill 分类 */
export interface SkillClassification {
    provider_type?: string;
    billing_type?: number;
    source_link?: string;
    category_key?: string;
}

/** Skill 版本信息 */
export interface SkillVersionInfo {
    version?: string;
    analysis_info?: Record<string, unknown>;
}

/** Skill 详情 */
/** Skill 分类 */
export interface SkillCategory {
    category_key: string;
    category_name: string;
}

/** Skills 浮层中使用的标准化 Skill 数据 */
export interface NormalizedSkill {
    id: string;
    name: string;
    displayName: string;
    iconUrl: string;
    /** 原始 skill_type，HUB_PRESET 排末尾 */
    skillType?: number;
    /** 是否为内置 Skill */
    isPreset?: boolean;
    /** 是否受删除保护 */
    notDeleteProtected?: boolean;
}

/** Skills 管理列表中使用的 Skill 数据 */
export interface ManageSkillItem {
    id: string;
    name: string;
    desc?: string;
    icon: string;
    version?: string;
    category?: string;
    billingType?: number;
    notDeleteProtected?: boolean;
    skillType?: number;
}

/** Skills 选中事件参数 */
export interface SkillSelectEvent {
    type: 'skills';
    id: string;
    name: string;
    displayName: string;
    categoryLabel: string;
}

/** Skills 安装弹窗 Props */
export interface SkillsInstallDialogProps {
    /** 已安装的 Skill ID 集合 */
    installedSkillIds: string[];
    /** 最大可安装数量 */
    maxInstall?: number;
    /** 已安装数量 */
    installedCount?: number;
    /** 当前空间 ID */
    spaceId?: string;
}

/** Skills 国际化文本 */
export interface SkillsI18n {
    /** Skills 按钮文本 */
    skills?: string;
    /** 搜索 placeholder */
    search?: string;
    /** 暂无匹配的 Skills */
    noMatch?: string;
    /** 暂无 Skills */
    noSkills?: string;
    /** 管理 Skills */
    manageSkills?: string;
    /** 添加 Skills（弹窗标题） */
    addSkills?: string;
    /** 添加 Skills（弹窗标题） */
    addSkillsBtn?: string;
    /** 内置 Skills（Tab 名） */
    builtinSkills?: string;
    /** 企业共享 Skills（Tab 名） */
    sharedSkills?: string;
    /** 自定义 Skills（Tab 名） */
    customSkills?: string;
    /** 安装 */
    install?: string;
    /** 卸载 */
    uninstall?: string;
    /** 已安装 */
    installed?: string;
    /** 选择模型 */
    selectModel?: string;
    /** 连接器 */
    connector?: string;
    /** 工具 */
    tools?: string;
    /** 知识库 */
    knowledgeBase?: string;

    /* ───────── 工具/插件弹窗扩展（PluginInstallDialog / PluginManageDialog） ───────── */
    /** 添加工具（弹窗标题） */
    addTool?: string;
    /** 管理工具（弹窗标题） */
    manageTool?: string;
    /** 收藏 */
    favorite?: string;
    /** 已收藏 */
    favorited?: string;
    /** 搜索工具 placeholder */
    searchTool?: string;
    /** 通用 loading 文案 */
    loading?: string;
    /** 暂无数据 */
    noData?: string;
    /** 公测标签 */
    tagBeta?: string;
    /** 官方收费标签 */
    tagOfficialPaid?: string;
    /** 不可用 */
    unavailable?: string;
    /** 含 N 个工具（带 {count} 占位符） */
    containsNTools?: string;
    /** 更新 */
    update?: string;
    /** 已更新工具列表（toast） */
    updatedToolList?: string;
    /** 更新失败（toast） */
    updateFailed?: string;
    /** 已全部添加 */
    installedAll?: string;
    /** 全部添加 */
    installAll?: string;
    /** 精选 */
    featured?: string;
    /** 子工具加载中 */
    loadingTools?: string;
    /** 子工具加载失败 */
    loadToolsFailed?: string;
    /** 点击重试 */
    clickRetry?: string;
    /** 工具已添加按钮 */
    toolInstalled?: string;
    /** 单个工具添加按钮 */
    addBtn?: string;
    /** 暂无工具信息 */
    noToolInfo?: string;
    /** Server 失效错误提示 */
    serverInvalidError?: string;
    /** Tab：工具（普通） */
    tabInner?: string;
    /** Tab：自定义工具 */
    tabCustom?: string;
    /** 分类：全部 */
    categoryAll?: string;
    /** 排序：默认 */
    sortDefault?: string;
    /** 排序：按热门 */
    sortHot?: string;
    /** 排序：按更新时间 */
    sortUpdateTime?: string;
    /** 筛选组：付费方式 */
    filterFinance?: string;
    /** 筛选项：其他（付费类型中的） */
    filterOther?: string;
    /** 筛选组：来源 */
    filterSource?: string;
    /** 筛选项：官方工具 */
    sourceOfficial?: string;
    /** 筛选项：三方工具 */
    sourceThirdParty?: string;
    /** 筛选组：类型 */
    filterType?: string;
    /** 工具类型：MCP */
    typeMcp?: string;
    /** 工具类型：API */
    typeApi?: string;
    /** 工具类型：代码 */
    typeCode?: string;
    /** 工具类型：应用 */
    typeApp?: string;
    /** 「已选 N 项」筛选概要文案，支持 {count} 占位符 */
    selectedCount?: string;
    /** 工具类型 label：MCP（标签内显示，与 tag 同源） */
    createTypeLabelMcp?: string;
    /** 工具类型 label：API */
    createTypeLabelApi?: string;
    /** 工具类型 label：代码 */
    createTypeLabelCode?: string;
    /** 工具类型 label：应用 */
    createTypeLabelApp?: string;
    /** 已添加 toast */
    addedToast?: string;
    /** 所有工具已添加 toast */
    allToolsAddedToast?: string;
    /** 缺少应用 ID error */
    errorMissingAppId?: string;
    /** 缺少 Agent ID error */
    errorMissingAgentId?: string;
    /** PluginInstallDialog：绑定工具失败 toast */
    bindToolFailedToast?: string;
    /** PluginManageDialog 标题：已添加的工具 */
    addedTools?: string;
    /** PluginManageDialog：暂无已添加的工具 */
    noAddedTools?: string;
    /** PluginManageDialog：删除 */
    remove?: string;
    /** PluginManageDialog：删除成功 toast */
    removeSuccessToast?: string;
    /** PluginManageDialog：删除失败 toast */
    removeFailedToast?: string;
    /** PluginManageDialog：预置标签 */
    tagBuiltin?: string;
    /** PluginManageDialog：预置工具无法删除 tooltip */
    builtinNotDeletable?: string;
    /** PluginManageDialog：缺少应用 ID 或 Agent ID warning */
    missingAppOrAgentId?: string;
    /** PluginManageDialog：工具删除失败 toast */
    toolRemoveFailedToast?: string;

    /* ───────── 连接器相关（ConnectorDialog / ConnectorConnectDialog） ───────── */
    /** ConnectorDialog 弹窗标题 */
    manageConnector?: string;
    /** 搜索连接器 placeholder */
    searchConnector?: string;
    /** 「已启用」checkbox 文案 */
    enabledOnly?: string;
    /** 暂无连接器 */
    noConnector?: string;
    /** 暂无已启用的连接器 */
    noEnabledConnector?: string;
    /** 暂无描述 */
    noDescription?: string;
    /** 连接器：开启成功 toast */
    enabledToast?: string;
    /** 连接器：关闭成功 toast */
    disabledToast?: string;
    /** 连接器：开启失败 toast */
    enableFailedToast?: string;
    /** 连接器：关闭失败 toast */
    disableFailedToast?: string;
    /** 浏览器扩展通信异常错误（throw Error 文案） */
    extensionCommErrorMsg?: string;
    /** ConnectorConnectDialog：连接器授权标题 */
    connectorAuth?: string;
    /** ConnectorConnectDialog：已授权 */
    authorized?: string;
    /** ConnectorConnectDialog：待授权 */
    pendingAuth?: string;
    /** ConnectorConnectDialog：重新授权 */
    reauthorize?: string;
    /** ConnectorConnectDialog：去授权 */
    goAuthorize?: string;
    /** ConnectorConnectDialog：授权完成后的提示 */
    authCompleteTip?: string;
    /** ConnectorConnectDialog：无需鉴权的提示 */
    noAuthNeededTip?: string;
    /** ConnectorConnectDialog：请填写 {name} */
    pleaseFill?: string;
    /** ConnectorConnectDialog：请输入 {name}（placeholder） */
    pleaseInput?: string;
    /** ConnectorConnectDialog：连接器 ID 缺失 */
    connectorIdMissing?: string;
    /** ConnectorConnectDialog：获取授权链接失败 */
    getOAuthUrlFailed?: string;
    /** ConnectorConnectDialog：已连接 toast */
    connectedToast?: string;
    /** ConnectorConnectDialog：连接失败 toast */
    connectFailedToast?: string;
    /** ConnectorConnectDialog 标题前缀：连接 {name} */
    connectName?: string;
    /** ConnectorConnectDialog 标题：连接连接器（无名称兜底） */
    connectConnector?: string;

    /* ───────── BrowserExtensionInstallDialog ───────── */
    extensionAgreeTitle?: string;
    extensionIntroLead?: string;
    extensionConnectorName?: string;
    extensionConnectorDesc?: string;
    extensionPluginName?: string;
    extensionPluginDesc?: string;
    extensionInstallPromptHtml?: string;
    extensionGotoStoreLink?: string;
    extensionRiskTip?: string;
    extensionPolicyTip?: string;
    extensionAgreeText?: string;
    extensionPolicyName?: string;
    extensionCancelBtn?: string;
    extensionConfirmBtn?: string;

    /* ───────── McpFieldDialog ───────── */
    mcpFieldTitle?: string;
    fieldRequired?: string;
    confirmAndAdd?: string;
    cancel?: string;

    /* ───────── AtMentionPanel ───────── */
    /** @ Mention 面板右侧空状态 */
    mentionEmpty?: string;

    /* ───────── SkillManageDialog ───────── */
    /** 导入按钮 */
    importBtn?: string;
    /** 搜索 Skills placeholder */
    searchSkills?: string;
    /** 预置 Skill 无法删除 tooltip */
    presetSkillNotDeletable?: string;

    /* ───────── SkillsInstallDialog ───────── */
    /** 筛选 checkbox：官方 */
    filterOfficialLabel?: string;
    /** 筛选 checkbox：收藏 */
    filterFavoriteLabel?: string;
    /** 筛选 checkbox：企业共享 */
    filterEnterpriseSharedLabel?: string;
    /** Tag：疑似风险 */
    tagSuspectedRisk?: string;
    /** Tag：安全 */
    tagSafe?: string;
    /** Tag：企业共享 */
    tagEnterpriseShared?: string;
    /** Tag：包含官方付费工具（tooltip） */
    paidToolTooltip?: string;
    /** 已达到最大安装数量 */
    maxInstallReached?: string;
    /** 添加成功 toast */
    addSuccessToast?: string;
    /** 添加失败 toast */
    addFailedToast?: string;
    /** 科恩实验室检测结果为"疑似风险" tooltip */
    safetySuspectedTip?: string;
    /** 科恩实验室检测结果为"安全" tooltip */
    safetySafeTip?: string;
    /** 已加入"企业共享Skill" tooltip */
    sharedTip?: string;
    /** 已加入"企业共享Skill" 所用版本 v{version} tooltip（支持 {version} 占位符） */
    sharedTipWithVersion?: string;
}

/** Skills 国际化默认值 */
export const defaultSkillsI18n: Required<SkillsI18n> = {
    skills: 'Skills',
    search: '搜索',
    noMatch: '暂无匹配的 Skills',
    noSkills: '暂无 Skills',
    manageSkills: '管理 Skills',
    addSkills: '添加 Skills',
    addSkillsBtn: '添加',
    builtinSkills: '内置 Skills',
    sharedSkills: '企业共享 Skills',
    customSkills: '自定义 Skills',
    install: '添加',
    uninstall: '卸载',
    installed: '已添加',
    selectModel: '选择模型',
    connector: '连接器',
    tools: '工具',
    knowledgeBase: '知识库',

    /* 工具/插件弹窗扩展 */
    addTool: '添加工具',
    manageTool: '管理工具',
    favorite: '收藏',
    favorited: '已收藏',
    searchTool: '搜索工具',
    loading: '加载中...',
    noData: '暂无数据',
    tagBeta: '公测',
    tagOfficialPaid: '官方收费',
    unavailable: '不可用',
    containsNTools: '含{count}个工具',
    update: '更新',
    updatedToolList: '已更新工具列表',
    updateFailed: '更新失败',
    installedAll: '已全部添加',
    installAll: '全部添加',
    featured: '精选',
    loadingTools: '加载工具中...',
    loadToolsFailed: '加载工具失败，',
    clickRetry: '点击重试',
    toolInstalled: '已添加',
    addBtn: '添加',
    noToolInfo: '暂无工具信息',
    serverInvalidError: '该 server 已失效，无法拉取到相应内容',
    tabInner: '工具',
    tabCustom: '自定义工具',
    categoryAll: '全部',
    sortDefault: '默认排序',
    sortHot: '按热门排序',
    sortUpdateTime: '按更新时间排序',
    filterFinance: '付费方式',
    filterOther: '其他',
    filterSource: '来源',
    sourceOfficial: '官方工具',
    sourceThirdParty: '三方工具',
    filterType: '类型',
    typeMcp: 'MCP类',
    typeApi: 'API类',
    typeCode: '代码类',
    typeApp: '应用类',
    selectedCount: '已选 {count} 项',
    createTypeLabelMcp: 'MCP',
    createTypeLabelApi: 'API',
    createTypeLabelCode: '代码',
    createTypeLabelApp: '应用',
    addedToast: '已添加',
    allToolsAddedToast: '所有工具已添加',
    errorMissingAppId: '缺少应用 ID，无法绑定工具',
    errorMissingAgentId: '缺少 Agent ID，无法绑定工具',
    bindToolFailedToast: '绑定工具失败',
    addedTools: '已添加的工具',
    noAddedTools: '暂无已添加的工具',
    remove: '删除',
    removeSuccessToast: '已删除',
    removeFailedToast: '删除失败',
    tagBuiltin: '预置',
    builtinNotDeletable: '预置工具无法删除',
    missingAppOrAgentId: '缺少应用 ID 或 Agent ID',
    toolRemoveFailedToast: '工具删除失败',

    /* 连接器相关 */
    manageConnector: '管理连接器',
    searchConnector: '搜索连接器',
    enabledOnly: '已启用',
    noConnector: '暂无连接器',
    noEnabledConnector: '暂无已启用的连接器',
    noDescription: '暂无描述',
    enabledToast: '已开启',
    disabledToast: '已关闭',
    enableFailedToast: '开启失败',
    disableFailedToast: '关闭失败',
    extensionCommErrorMsg: '浏览器扩展通信异常，请刷新页面或检查扩展状态后重试',

    connectorAuth: '连接器授权',
    authorized: '已授权',
    pendingAuth: '待授权',
    reauthorize: '重新授权',
    goAuthorize: '去授权',
    authCompleteTip: '完成授权后请点击右下角“确认”按钮保存。',
    noAuthNeededTip: '该连接器无需配置鉴权参数，可直接确认连接。',
    pleaseFill: '请填写 {name}',
    pleaseInput: '请输入 {name}',
    connectorIdMissing: '连接器 ID 缺失',
    getOAuthUrlFailed: '获取授权链接失败',
    connectedToast: '已连接',
    connectFailedToast: '连接失败',
    connectName: '连接 {name}',
    connectConnector: '连接连接器',

    /* BrowserExtensionInstallDialog */
    extensionAgreeTitle: '阅读并同意该协议',
    extensionIntroLead: '使用本功能需要两个组件协同工作：',
    extensionConnectorName: '浏览器助手 Connector',
    extensionConnectorDesc: '（安装在 ADP 平台侧）：负责接收您在智能工作台或 Claw 应用中发出的指令，并将指令传递给扩展程序；',
    extensionPluginName: 'ADP 浏览器助手扩展程序',
    extensionPluginDesc: '（安装在您的 Chrome 浏览器中）：负责在浏览器中实际执行网页自动化操作。',
    extensionInstallPromptHtml: '您需要{link}安装 ADP 浏览器助手扩展程序。',
    extensionGotoStoreLink: '前往 Chrome 浏览器',
    extensionRiskTip: '您充分知悉，扩展程序执行操作过程中可能涉及对您当前浏览网页内容的读取、页面元素的点击与填写、标签页的创建与管理等操作，部分操作一旦执行可能不可撤销。请在使用前确认您已充分了解相关服务内容和存在的风险情况。',
    extensionPolicyTip: '同时，您在使用 ADP 浏览器助手扩展程序时，还需遵守 Google Chrome 应用商店的相关服务条款及扩展程序使用规范。',
    extensionAgreeText: '我已阅读并同意{policy}，我充分知悉并自愿承担使用该插件的全部责任和相关风险，同意遵守协议约定。',
    extensionPolicyName: '《ADP 浏览器助手插件服务协议》',
    extensionCancelBtn: '取消',
    extensionConfirmBtn: '确认并前往 Chrome 应用商店',

    /* McpFieldDialog */
    mcpFieldTitle: '请填充相关信息并继续',
    fieldRequired: '必填',
    confirmAndAdd: '确定并添加工具',
    cancel: '取消',

    /* AtMentionPanel */
    mentionEmpty: '暂无可选项目',

    /* SkillManageDialog */
    importBtn: '导入',
    searchSkills: '搜索 Skills',
    presetSkillNotDeletable: '预置 Skill 无法删除',

    /* SkillsInstallDialog */
    filterOfficialLabel: '官方',
    filterFavoriteLabel: '收藏',
    filterEnterpriseSharedLabel: '企业共享',
    tagSuspectedRisk: '疑似风险',
    tagSafe: '安全',
    tagEnterpriseShared: '企业共享',
    paidToolTooltip: '包含官方付费工具',
    maxInstallReached: '已达到最大安装数量',
    addSuccessToast: '添加成功',
    addFailedToast: '添加失败',
    safetySuspectedTip: '科恩实验室检测结果为"疑似风险"',
    safetySafeTip: '科恩实验室检测结果为"安全"',
    sharedTip: '已加入"企业共享Skill"',
    sharedTipWithVersion: '已加入"企业共享Skill" 所用版本 v{version}',
};

/** Skills 国际化英文默认值 */
export const defaultSkillsI18nEn: Required<SkillsI18n> = {
    skills: 'Skills',
    search: 'Search',
    noMatch: 'No matching Skills',
    noSkills: 'No Skills',
    manageSkills: 'Manage Skills',
    addSkills: 'Add Skills',
    addSkillsBtn: 'Add',
    builtinSkills: 'Built-in Skills',
    sharedSkills: 'Shared Skills',
    customSkills: 'Custom Skills',
    install: 'Install',
    uninstall: 'Uninstall',
    installed: 'Installed',
    selectModel: 'Select Model',
    connector: 'Connector',
    tools: 'Tools',
    knowledgeBase: 'Knowledge Base',

    /* 工具/插件弹窗扩展 */
    addTool: 'Add Tool',
    manageTool: 'Manage Tools',
    favorite: 'Favorite',
    favorited: 'Favorited',
    searchTool: 'Search tools',
    loading: 'Loading...',
    noData: 'No data',
    tagBeta: 'Beta',
    tagOfficialPaid: 'Official paid',
    unavailable: 'Unavailable',
    containsNTools: 'Contains {count} tool(s)',
    update: 'Update',
    updatedToolList: 'Tool list updated',
    updateFailed: 'Update failed',
    installedAll: 'All added',
    installAll: 'Add all',
    featured: 'Featured',
    loadingTools: 'Loading tools...',
    loadToolsFailed: 'Failed to load tools, ',
    clickRetry: 'click to retry',
    toolInstalled: 'Added',
    addBtn: 'Add',
    noToolInfo: 'No tool info',
    serverInvalidError: 'This server is no longer valid; tools cannot be retrieved.',
    tabInner: 'Tools',
    tabCustom: 'Custom Tools',
    categoryAll: 'All',
    sortDefault: 'Default order',
    sortHot: 'Most popular',
    sortUpdateTime: 'Recently updated',
    filterFinance: 'Pricing',
    filterOther: 'Other',
    filterSource: 'Source',
    sourceOfficial: 'Official',
    sourceThirdParty: 'Third-party',
    filterType: 'Type',
    typeMcp: 'MCP',
    typeApi: 'API',
    typeCode: 'Code',
    typeApp: 'App',
    selectedCount: '{count} selected',
    createTypeLabelMcp: 'MCP',
    createTypeLabelApi: 'API',
    createTypeLabelCode: 'Code',
    createTypeLabelApp: 'App',
    addedToast: 'Added',
    allToolsAddedToast: 'All tools have been added',
    errorMissingAppId: 'Missing application ID, cannot bind tool',
    errorMissingAgentId: 'Missing agent ID, cannot bind tool',
    bindToolFailedToast: 'Failed to bind tool',
    addedTools: 'Added tools',
    noAddedTools: 'No tools added yet',
    remove: 'Remove',
    removeSuccessToast: 'Removed',
    removeFailedToast: 'Removal failed',
    tagBuiltin: 'Built-in',
    builtinNotDeletable: 'Built-in tools cannot be removed',
    missingAppOrAgentId: 'Missing application ID or agent ID',
    toolRemoveFailedToast: 'Failed to remove tool',

    /* Connector */
    manageConnector: 'Manage Connectors',
    searchConnector: 'Search connectors',
    enabledOnly: 'Enabled',
    noConnector: 'No connectors',
    noEnabledConnector: 'No enabled connectors',
    noDescription: 'No description',
    enabledToast: 'Enabled',
    disabledToast: 'Disabled',
    enableFailedToast: 'Failed to enable',
    disableFailedToast: 'Failed to disable',
    extensionCommErrorMsg: 'Browser extension communication failed. Please refresh the page or check the extension status, then try again.',

    connectorAuth: 'Connector authorization',
    authorized: 'Authorized',
    pendingAuth: 'Pending authorization',
    reauthorize: 'Re-authorize',
    goAuthorize: 'Authorize',
    authCompleteTip: 'After authorization, click “Confirm” in the bottom-right to save.',
    noAuthNeededTip: 'This connector requires no authentication. You can confirm to connect directly.',
    pleaseFill: 'Please fill in {name}',
    pleaseInput: 'Please input {name}',
    connectorIdMissing: 'Connector ID is missing',
    getOAuthUrlFailed: 'Failed to obtain authorization URL',
    connectedToast: 'Connected',
    connectFailedToast: 'Failed to connect',
    connectName: 'Connect {name}',
    connectConnector: 'Connect connector',

    /* BrowserExtensionInstallDialog */
    extensionAgreeTitle: 'Read and agree to the policy',
    extensionIntroLead: 'This feature requires two components working together:',
    extensionConnectorName: 'Browser Assistant Connector',
    extensionConnectorDesc: ' (installed on the ADP platform): receives commands you send from the workbench or Claw apps, and forwards them to the browser extension;',
    extensionPluginName: 'ADP Browser Assistant Extension',
    extensionPluginDesc: ' (installed in your Chrome browser): actually performs the web automation actions in your browser.',
    extensionInstallPromptHtml: 'You need to {link} to install the ADP Browser Assistant Extension.',
    extensionGotoStoreLink: 'open Chrome browser',
    extensionRiskTip: 'You fully understand that the extension may read the content of the page you are viewing, click and fill in page elements, create and manage tabs, etc. Some actions cannot be undone. Please make sure you understand the service and the risks before use.',
    extensionPolicyTip: 'In addition, when using the ADP Browser Assistant Extension, you must comply with the terms of service and extension usage policies of the Google Chrome Web Store.',
    extensionAgreeText: 'I have read and agreed to {policy}, and I fully understand and voluntarily accept all responsibilities and risks of using this extension, and agree to abide by the agreement.',
    extensionPolicyName: 'the “ADP Browser Assistant Extension Service Agreement”',
    extensionCancelBtn: 'Cancel',
    extensionConfirmBtn: 'Confirm and go to the Chrome Web Store',

    /* McpFieldDialog */
    mcpFieldTitle: 'Please fill in the required fields to continue',
    fieldRequired: 'Required',
    confirmAndAdd: 'Confirm and add tool',
    cancel: 'Cancel',

    /* AtMentionPanel */
    mentionEmpty: 'No available items',

    /* SkillManageDialog */
    importBtn: 'Import',
    searchSkills: 'Search Skills',
    presetSkillNotDeletable: 'Built-in Skill cannot be removed',

    /* SkillsInstallDialog */
    filterOfficialLabel: 'Official',
    filterFavoriteLabel: 'Favorite',
    filterEnterpriseSharedLabel: 'Enterprise shared',
    tagSuspectedRisk: 'Suspected risk',
    tagSafe: 'Safe',
    tagEnterpriseShared: 'Enterprise shared',
    paidToolTooltip: 'Contains official paid tool',
    maxInstallReached: 'Maximum install count reached',
    addSuccessToast: 'Added successfully',
    addFailedToast: 'Failed to add',
    safetySuspectedTip: 'Keen Lab result: "Suspected risk"',
    safetySafeTip: 'Keen Lab result: "Safe"',
    sharedTip: 'Joined "Enterprise shared Skill"',
    sharedTipWithVersion: 'Joined "Enterprise shared Skill", using version v{version}',
};
