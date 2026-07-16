/**
 * Service 模块导出
 */
export { httpService, configureAxios, setRequestInterceptor, setResponseInterceptor } from './httpService';
export {
    defaultApiDetailConfig,
    fetchApplicationList,
    fetchConversationList,
    fetchConversationDetail,
    fetchReferenceDetails,
    sendMessage,
    rateMessage,
    createShare,
    fetchUserInfo,
    uploadFile,
    parseFile,
    getFileDownloadUrl,
    describeConversation,
    listDir,
    fetchFile,
    fetchModelList,
    describeAgentSummaryList,
    copyAgentFromApp,
    getAgentConfig,
    saveAgentConfig,
    createConversation,
    fetchSuggestionList,
} from './api';
export type {
    ApiConfig,
    ApiDetailConfig,
    ListModelParams,
    ListModelRawItem,
    ListModelResponse,
    SuggestionItem,
    SuggestionGroup,
    SuggestionListResponse,
} from './api';

// ============================================================
// Channel API
// ============================================================
export {
    defaultChannelApiConfig,
    describeChannelList,
    describeChannel,
    createChannel,
    modifyChannel,
    deleteChannel,
    ChannelScene,
    ClawChannelStatus,
    ChannelType,
} from './channelApi';
export type {
    ChannelApiConfig,
    ChannelRawItem,
    ChannelSpecRaw,
    ChannelItem,
    DescribeChannelListParams,
    DescribeChannelListResponse,
    CreateChannelParams,
    DescribeChannelParams,
    DeleteChannelParams,
    ModifyChannelParams,
} from './channelApi';
