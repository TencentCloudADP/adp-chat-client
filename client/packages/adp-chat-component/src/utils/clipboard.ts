/**
 * 复制文字内容到剪切板
 * @description 支持现代Clipboard API和降级方案，自动处理移动端和桌面端的文本格式
 * @param {string} text - Markdown格式文本（用于桌面端）
 * @param {object} options - 配置选项
 * @param {string} options.rawText - 原始文本内容（用于移动端，如果不传则使用 text）
 * @param {boolean} options.isMobile - 是否为移动端
 * @param {function} options.onSuccess - 复制成功回调
 * @param {function} options.onError - 复制失败回调
 * @returns {Promise<boolean>}
 * @example
 * // 复制文本到剪贴板，移动端使用 rawText，桌面端使用 text
 * copyToClipboard('**Hello World**', { 
 *   rawText: 'Hello World',
 *   isMobile: true 
 * })
 */
export const copyToClipboard = async (
    text: string | undefined,
    options?: {
        rawText?: string;
        isMobile?: boolean;
        onSuccess?: () => void;
        onError?: (error: Error) => void;
    }
): Promise<boolean> => {
    if (!text) return false;

    // 根据移动端/桌面端选择复制内容
    let copyText: string;
    if (options?.isMobile) {
        // 移动端：优先使用 rawText，处理多余换行
        if (options.rawText) {
            copyText = options.rawText.replace(/\n{3,}/g, '\n\n');
        } else {
            copyText = text;
        }
    } else {
        // 桌面端：使用 Markdown 格式文本
        copyText = text;
    }

    /**
     * 降级复制方案：使用textarea元素实现复制功能
     */
    const fallbackCopyToClipboard = (content: string): boolean => {
        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);
        // 隐藏此输入框
        textarea.style.position = 'fixed';
        textarea.style.clip = 'rect(0 0 0 0)';
        textarea.style.top = '10px';
        // 赋值
        textarea.value = content;
        // 选中
        textarea.select();

        try {
            // 执行复制命令
            const successful = document.execCommand('copy');
            if (successful) {
                options?.onSuccess?.();
                return true;
            } else {
                options?.onError?.(new Error('降级方案复制失败'));
                return false;
            }
        } catch (err) {
            options?.onError?.(err as Error);
            return false;
        } finally {
            // 清理：移除临时元素
            document.body.removeChild(textarea);
        }
    };

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(copyText);
            options?.onSuccess?.();
            return true;
        } else {
            return fallbackCopyToClipboard(copyText);
        }
    } catch (err) {
        console.error('现代API复制失败，使用降级方案:', err);
        return fallbackCopyToClipboard(copyText);
    }
};
