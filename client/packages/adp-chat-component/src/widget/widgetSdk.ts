/**
 * @module widgetSdk
 * @description Widget SDK 加载管理模块，负责懒加载 adp-widget SDK 并跟踪加载状态
 */

/** Widget SDK 加载 Promise 缓存 */
let widgetSdkLoadPromise: Promise<void> | null = null;

/**
 * 检查 widget SDK 是否已加载
 * @description 通过检测 customElements 中是否注册了 adp-widget 来判断
 * @returns {boolean} SDK 是否已加载
 */
export function isWidgetSdkLoaded(): boolean {
  return typeof customElements !== 'undefined' && customElements.get('adp-widget') !== undefined;
}

/**
 * 懒加载 widget SDK
 * @description 仅在需要时加载，多次调用复用同一个 Promise，确保只加载一次
 * @returns {Promise<void>} SDK 加载完成的 Promise
 */
export function loadWidgetSdk(): Promise<void> {
  if (isWidgetSdkLoaded()) {
    return Promise.resolve();
  }

  if (widgetSdkLoadPromise) {
    return widgetSdkLoadPromise;
  }

  widgetSdkLoadPromise = import('adp-widget').then(() => {
    // 等待 custom element 注册完成
    return new Promise<void>((resolve) => {
      const checkRegistration = () => {
        if (isWidgetSdkLoaded()) {
          resolve();
        } else {
          setTimeout(checkRegistration, 50);
        }
      };
      checkRegistration();
    });
  }).catch((err) => {
    widgetSdkLoadPromise = null;
    console.error('[widgetSdk] Failed to load widget SDK:', err);
    throw new Error('Failed to load widget SDK');
  });

  return widgetSdkLoadPromise;
}

/**
 * 检查内容中是否包含完整的 widget 代码块
 * @description 仅当代码块以结束标记 ``` 闭合时返回 true，
 *              避免在流式传输中处理不完整的 widget JSON
 * @param {string | undefined} content - 待检查的 Markdown 内容
 * @returns {boolean} 是否包含完整的 widget 代码块
 */
export function hasWidgetContent(content: string | undefined): boolean {
  if (!content) return false;
  const startIndex = content.indexOf('```adp-widget');
  if (startIndex === -1) return false;

  const afterStart = content.substring(startIndex + '```adp-widget'.length);
  const endIndex = afterStart.indexOf('```');
  return endIndex !== -1;
}
