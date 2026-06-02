/**
 * @module model/file-preview
 * @description FilePreview 组件相关类型定义
 */

export interface CommandBarItem {
    cmbId: string;
    attributes: Record<string, any> | Array<{ name: string; value: any }>;
}

export interface SDKInstance {
    ready: () => Promise<any>;
    on: (event: string, handler: (...args: any[]) => void) => void;
    off: (event: string, handler: (...args: any[]) => void) => void;
    destroy: () => void;
    setCommandBars: (bars: CommandBarItem[]) => void;
    setToken: (data: { token: string; timeout?: number; hasRefreshTokenConfig?: boolean }) => void;
    save: () => Promise<void>;
    tabs: {
        getTabs: () => Promise<any>;
        switchTab: (key: string) => Promise<void>;
    };
    ApiEvent: {
        AddApiEventListener: (event: string, handler: (...args: any[]) => void) => Promise<void>;
        RemoveApiEventListener: (event: string, handler: (...args: any[]) => void) => Promise<void>;
    };
    Application?: any;
    WordApplication?: () => any;
    ExcelApplication?: () => any;
    PPTApplication?: () => any;
    PDFApplication?: () => any;
}

export interface SDKConfigOptions {
    /** 挂载的 DOM 元素 */
    mount: HTMLElement | undefined;
    /** 预览 URL（WebOffice 文档预览地址） */
    url: string;
    /** 预览模式 */
    mode?: 'normal' | 'simple';
    /** 通用选项 */
    commonOptions?: {
        /** 是否显示顶部区域 */
        isShowTopArea?: boolean;
        /** 是否显示头部 */
        isShowHeader?: boolean;
        /** 是否浏览器全屏 */
        isBrowserViewFullscreen?: boolean;
        /** 是否 iframe 全屏 */
        isIframeViewFullscreen?: boolean;
        /** 是否使用父容器全屏（传 CSS 选择器或 true） */
        isParentFullscreen?: boolean | string;
    };
    /** Word 文档选项 */
    wordOptions?: {
        /** 是否显示目录 */
        isShowDocMap?: boolean;
        /** 是否最佳缩放 */
        isBestScale?: boolean;
        /** 是否显示底部状态栏 */
        isShowBottomStatusBar?: boolean;
    };
    /** PDF 选项 */
    pdfOptions?: {
        /** 是否显示注释 */
        isShowComment?: boolean;
        /** 是否安全模式 */
        isInSafeMode?: boolean;
        /** 是否显示底部状态栏 */
        isShowBottomStatusBar?: boolean;
    };
    /** PPT 选项 */
    pptOptions?: {
        /** 是否显示底部状态栏 */
        isShowBottomStatusBar?: boolean;
    };
    /** 命令栏配置 */
    commandBars?: CommandBarItem[];
    /** 超链接打开回调 */
    onHyperLinkOpen?: (data: any) => void;
    /** Token 刷新回调 */
    refreshToken?: () => Promise<{ token: string; timeout?: number }>;
}

export interface GetPreviewUrlOptions {
    /** COS 对象完整 URL */
    objectUrl: string;
    /** COS 鉴权凭证 */
    credentials?: {
        secretId?: string;
        secretKey?: string;
        authorization?: string;
    };
    /** 是否允许复制：1 允许，0 不允许 */
    copyable?: number | boolean;
    /** 目标转换类型，如 'html' */
    dstType?: string;
    /** 水印文字 */
    htmlwaterword?: string;
    /** 水印填充样式 */
    htmlfillstyle?: string;
    /** 水印字体 */
    htmlfront?: string;
    /** 水印旋转角度 */
    htmlrotate?: string;
    /** 水印水平间距 */
    htmlhorizontal?: string;
    /** 水印垂直间距 */
    htmlvertical?: string;
}

export interface FilePreviewProps {
    /**
     * 文件路径（如 /workdir/main.py），文档预览时组件内部调用 fetchFile 获取 COS URL；
     * 图片/HTML 预览时请同时传入 fileUrl 作为直接访问地址。
     */
    filePath?: string;
    /**
     * 文件的直接访问 URL，供图片预览和 HTML 预览使用。
     * 文档预览（doc 类型）不需要此字段，内部会自动调用 fetchFile。
     */
    fileUrl?: string;
    /** 文件名（含扩展名），供图片/HTML 预览组件使用 */
    fileName?: string;
    /** 应用 ID */
    applicationId?: string;
    /** 工作空间 ID */
    workspaceId?: string;
    /** SDK JS 文件的 URL 路径（文档预览使用） */
    sdkUrl?: string;
    /** 加载中文本 */
    loadingText?: string;
    /** 加载文档预览中文本 */
    loadingPreviewText?: string;
    /** 预览加载失败文本 */
    previewFailedText?: string;
    /** 重试按钮文本 */
    retryText?: string;
    /** 不支持预览时的提示文本 */
    unsupportedText?: string;
}
