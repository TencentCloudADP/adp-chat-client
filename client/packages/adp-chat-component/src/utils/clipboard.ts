/**
 * 复制文字内容到剪切板
 * @description 支持现代Clipboard API和降级方案
 * @param {string} text - 要复制的文本内容
 * @param {object} options - 配置选项
 * @param {function} options.onSuccess - 复制成功回调
 * @param {function} options.onError - 复制失败回调
 * @returns {Promise<boolean>}
 */
export const copyToClipboard = async (
    text: string | undefined,
    options?: {
        onSuccess?: () => void;
        onError?: (error: Error) => void;
    }
): Promise<boolean> => {
    if (!text) return false;

    /**
     * 降级复制方案：使用textarea元素实现复制功能
     */
    const fallbackCopyToClipboard = (text: string): boolean => {
        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);
        // 隐藏此输入框
        textarea.style.position = 'fixed';
        textarea.style.clip = 'rect(0 0 0 0)';
        textarea.style.top = '10px';
        // 赋值
        textarea.value = text;
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
            await navigator.clipboard.writeText(text);
            options?.onSuccess?.();
            return true;
        } else {
            return fallbackCopyToClipboard(text);
        }
    } catch (err) {
        console.error('现代API复制失败，使用降级方案:', err);
        return fallbackCopyToClipboard(text);
    }
};
