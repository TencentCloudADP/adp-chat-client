/** 应用模式：standard-标准模式, agent-agent模式, single_workflow-单工作流模式, ClawAgent-claw模式 */
export type AppPattern = 'standard' | 'agent' | 'single_workflow' | 'ClawAgent';

/** 输入框按钮类型：1-上传图片 2-上传文档 3-腾讯文档 4-联网搜索 */
export interface InputBoxButton {
    Type: number;
    Name?: string;
}

/** 输入框配置 */
export interface InputBoxConfig {
    InputBoxButtons?: InputBoxButton[];
}

export interface Application {
    ApplicationId: string;
    Name?: string;
    Avatar?: string;
    Greeting?: string;
    OpeningQuestions?: string[];
    /** 应用模式，来自 DescribeApp 接口 App.Metadata.AppMode */
    Pattern?: AppPattern | null;
    /** 应用状态，1：未上线 2：运行中 3：停用 */
    AppStatus?: number | null;
    /** 智能体类型：dialogue-对话式智能体 wechat-公众号智能体 */
    AgentType?: string | null;
    /** 输入框配置（文件上传、图片上传等能力） */
    InputBox?: InputBoxConfig | null;
    /** 是否启用联网搜索 */
    EnableWebSearch?: boolean | null;
    /** 是否开启内容审核 */
    EnableAudit?: boolean | null;
    [key: string]: unknown;
}
