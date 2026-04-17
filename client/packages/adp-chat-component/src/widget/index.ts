/**
 * @module widget
 * @description Widget 模块统一导出
 *
 * 子模块划分：
 * - widgetSdk: SDK 加载管理
 * - widgetMarkdown: Markdown 渲染插件与工具
 * - widgetEventHandler: 事件路由与处理
 */

// SDK 管理
export { isWidgetSdkLoaded, loadWidgetSdk, hasWidgetContent } from './widgetSdk';

// Markdown 渲染
export {
  escapeHtmlAttr,
  unescapeHtmlAttr,
  formatJsonWithHighlight,
  createMarkdownItWidgetPlugin,
  showFallbackJson,
} from './widgetMarkdown';
export type { WidgetRenderOptions } from './widgetMarkdown';

// 事件处理
export {
  handleWidgetEvent,
  disableWidgetsByRecordId,
} from './widgetEventHandler';
export type {
  WidgetActionPayload,
  WidgetActionRequest,
  WidgetEventResult,
} from './widgetEventHandler';
