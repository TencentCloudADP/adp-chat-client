/**
 * Skills 数据模型和类型定义
 */

/** Skill 类型枚举 */
export enum AgentSkillType {
    /** 技能广场官方/第三方 */
    HUB_OFFICIAL = 1,
    /** 技能广场自定义 */
    HUB_CUSTOM = 2,
    /** 从技能广场内置（只读，不可手动安装/卸载） */
    HUB_PRESET = 3,
    /** 自定义安装在沙箱（无 SkillId，不上报） */
    SANDBOX_CUSTOM = 4,
}

/** Service 端返回的 Agent Skill 信息 */
export interface AgentSkillInfo {
    skill_id?: string;
    SkillId?: string;
    skill_name?: string;
    SkillName?: string;
    skill_display_name?: string;
    SkillDisplayName?: string;
    skill_display_desc?: string;
    SkillDisplayDesc?: string;
    skill_display_description?: string;
    SkillDisplayDescription?: string;
    skill_desc?: string;
    SkillDesc?: string;
    skill_location?: string;
    SkillLocation?: string;
    icon_url?: string;
    IconUrl?: string;
    /** 1=官方 2=自定义 3=内置 4=沙箱 */
    skill_type?: number;
    SkillType?: number;
    /** 计费类型 */
    billing_type?: number;
    BillingType?: number;
    /** 技能来源 */
    skill_source?: string;
    SkillSource?: string;
    /** 当前版本 */
    current_version?: string;
    CurrentVersion?: string;
    /** 是否受删除保护 */
    is_delete_protected?: boolean;
    IsDeleteProtected?: boolean;
    /** 分类名称 */
    category_name?: string;
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
export interface SkillDetail {
    skill_id: string;
    skill_detail?: Record<string, unknown>;
    versions?: SkillVersion[];
}

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
};
