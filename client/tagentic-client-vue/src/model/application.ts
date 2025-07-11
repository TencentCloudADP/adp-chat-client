export interface AppConfig {
    KnowledgeQa: {
        AiCall: {
            DigitalHuman: {
                AssetKey: string;
                Avatar: string;
                Name: string;
                PreviewUrl: string;
            };
            EnableDigitalHuman: boolean;
            EnableVoiceCall: boolean;
            EnableVoiceInteract: boolean;
            Voice: {
                TimbreKey: string;
                VoiceName: string;
                VoiceType: number;
            };
        };
        Output: {
            Method: number;
            QuestionClarifyKeywords: string[];
            ShowQuestionClarify: boolean;
            UseGeneralKnowledge: boolean;
            UseQuestionClarify: boolean;
            UseRecommended: boolean;
            BareAnswer: string;
        };
        Workflow: {
            IsEnabled: boolean;
            UsePdl: boolean;
        };
        BackgroundImage: {
            Brightness: number;
            LandscapeImageUrl: string;
            OriginalImageUrl: string;
            PortraitImageUrl: string;
            ThemeColor: string;
        };
        IntentAchievements: any[];
        Plugins: any[];
        Search: {
            Type: string;
            UseSearchEngine: boolean;
            Confidence: number;
            IsEnabled: boolean;
            ResourceStatus: number;
            ShowSearchEngine: boolean;
            DocTopN: number;
            QaTopN: number;
            ReplyFlexibility: number;
        }[];
        SearchStrategy: {
            StrategyType: number;
            TableEnhancement: boolean;
        };
        EnableAudit: boolean;
        EnableWebSearch: boolean;
        ImageTextRetrieval: boolean;
        RoleDescription: string;
        ShareKnowledgeBases: any[];
        Greeting: string;
        Model: {
            HistoryLimit: number;
            IsUseContext: boolean;
            Name: string;
            TokenBalance: number;
            AliasName: string;
            ContextLimit: number;
            Desc: string;
            ResourceStatus: number;
            Temperature: string;
            TopP: string;
        };
        OpeningQuestions: string[];
        Pattern: string;
        SearchRange: {
            ApiVarAttrInfos: any[];
            Condition: string;
        };
        SingleWorkflow: {
            WorkflowId: string;
            WorkflowName: string;
            AsyncWorkflow: boolean;
            IsEnable: boolean;
            Status: string;
            WorkflowDesc: string;
        };
        ThoughtModel: {
            HistoryLimit: number;
            Temperature: string;
            TokenBalance: number;
            IsUseContext: boolean;
            Name: string;
            ResourceStatus: number;
            TopP: string;
            AliasName: string;
            ContextLimit: number;
            Desc: string;
        };
    };
    Summary: null;
    Classify: null;
}

export interface BaseConfig {
    Desc: string;
    Name: string;
    Avatar: string;
}

export interface Application {
    AppStatus: number;
    AppStatusDesc: string;
    BaseConfig: BaseConfig;
    GreetingInAppeal: boolean;
    NameInAppeal: boolean;
    AppConfig: AppConfig;
    IsCopying: boolean;
    RoleInAppeal: boolean;
    RequestId: string;
    AvatarInAppeal: boolean;
    BareAnswerInAppeal: boolean;
    AppType: string;
    AppTypeDesc: string;
    AppBizId: string;
}