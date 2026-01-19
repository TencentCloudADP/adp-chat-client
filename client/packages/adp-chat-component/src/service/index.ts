/**
 * Service 模块导出
 */
export { httpService, configureAxios, setRequestInterceptor, setResponseInterceptor } from './httpService';
export {
    defaultApiDetailConfig,
    fetchApplicationList,
    fetchConversationList,
    fetchConversationDetail,
    sendMessage,
    rateMessage,
    createShare,
    fetchUserInfo,
    uploadFile,
} from './api';
export type { ApiConfig, ApiDetailConfig } from './api';
