/**
 * 消息常量定义
 * 统一管理所有提示消息的 code 和 message 映射
 */

/** 消息码常量对象 */
export const MessageCode = {
    // 成功类
    COPY_SUCCESS: 'COPY_SUCCESS',
    
    // 错误类
    COPY_FAILED: 'COPY_FAILED',
    SHARE_FAILED: 'SHARE_FAILED',
    FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
    FILE_FORMAT_NOT_SUPPORT: 'FILE_FORMAT_NOT_SUPPORT',
    GET_APP_LIST_FAILED: 'GET_APP_LIST_FAILED',
    GET_CONVERSATION_LIST_FAILED: 'GET_CONVERSATION_LIST_FAILED',
    GET_CONVERSATION_DETAIL_FAILED: 'GET_CONVERSATION_DETAIL_FAILED',
    SEND_MESSAGE_FAILED: 'SEND_MESSAGE_FAILED',
    NETWORK_ERROR: 'NETWORK_ERROR',
    LOAD_MORE_FAILED: 'LOAD_MORE_FAILED',
    RATE_FAILED: 'RATE_FAILED',
    ASR_SERVICE_FAILED: 'ASR_SERVICE_FAILED',
    RECORD_FAILED: 'RECORD_FAILED',
    
    // 警告类
    ANSWERING: 'ANSWERING',
    RECORD_TOO_LONG: 'RECORD_TOO_LONG',
} as const;

/** 消息码类型 */
export type MessageCode = typeof MessageCode[keyof typeof MessageCode];

/** 消息类型 */
export type MessageType = 'success' | 'warning' | 'error' | 'info';

/** 消息配置项 */
export interface MessageConfig {
    code: MessageCode;
    message: string;
    type: MessageType;
}

/** 消息映射表 */
export const MESSAGE_MAP: Record<MessageCode, MessageConfig> = {
    // 成功类
    [MessageCode.COPY_SUCCESS]: {
        code: MessageCode.COPY_SUCCESS,
        message: '复制成功',
        type: 'success',
    },
    
    // 错误类
    [MessageCode.COPY_FAILED]: {
        code: MessageCode.COPY_FAILED,
        message: '复制失败',
        type: 'error',
    },
    [MessageCode.SHARE_FAILED]: {
        code: MessageCode.SHARE_FAILED,
        message: '分享失败',
        type: 'error',
    },
    [MessageCode.FILE_UPLOAD_FAILED]: {
        code: MessageCode.FILE_UPLOAD_FAILED,
        message: '文件上传失败',
        type: 'error',
    },
    [MessageCode.FILE_FORMAT_NOT_SUPPORT]: {
        code: MessageCode.FILE_FORMAT_NOT_SUPPORT,
        message: '不支持的文件格式',
        type: 'error',
    },
    [MessageCode.GET_APP_LIST_FAILED]: {
        code: MessageCode.GET_APP_LIST_FAILED,
        message: '获取应用列表失败',
        type: 'error',
    },
    [MessageCode.GET_CONVERSATION_LIST_FAILED]: {
        code: MessageCode.GET_CONVERSATION_LIST_FAILED,
        message: '获取会话列表失败',
        type: 'error',
    },
    [MessageCode.GET_CONVERSATION_DETAIL_FAILED]: {
        code: MessageCode.GET_CONVERSATION_DETAIL_FAILED,
        message: '获取会话详情失败',
        type: 'error',
    },
    [MessageCode.SEND_MESSAGE_FAILED]: {
        code: MessageCode.SEND_MESSAGE_FAILED,
        message: '发送消息失败',
        type: 'error',
    },
    [MessageCode.NETWORK_ERROR]: {
        code: MessageCode.NETWORK_ERROR,
        message: '网络错误',
        type: 'error',
    },
    [MessageCode.LOAD_MORE_FAILED]: {
        code: MessageCode.LOAD_MORE_FAILED,
        message: '加载更多失败',
        type: 'error',
    },
    [MessageCode.RATE_FAILED]: {
        code: MessageCode.RATE_FAILED,
        message: '评分失败',
        type: 'error',
    },
    [MessageCode.ASR_SERVICE_FAILED]: {
        code: MessageCode.ASR_SERVICE_FAILED,
        message: '获取语音识别服务失败',
        type: 'error',
    },
    [MessageCode.RECORD_FAILED]: {
        code: MessageCode.RECORD_FAILED,
        message: '录音失败',
        type: 'error',
    },
    
    // 警告类
    [MessageCode.ANSWERING]: {
        code: MessageCode.ANSWERING,
        message: '正在回答中...',
        type: 'warning',
    },
    [MessageCode.RECORD_TOO_LONG]: {
        code: MessageCode.RECORD_TOO_LONG,
        message: '录音时间过长',
        type: 'warning',
    },
};

/**
 * 根据消息码获取消息配置
 * @param code 消息码
 * @returns 消息配置
 */
export function getMessage(code: MessageCode): MessageConfig {
    return MESSAGE_MAP[code];
}

/**
 * 根据消息码获取消息文本
 * @param code 消息码
 * @returns 消息文本
 */
export function getMessageText(code: MessageCode): string {
    return MESSAGE_MAP[code]?.message || '';
}
