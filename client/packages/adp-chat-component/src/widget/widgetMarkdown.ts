/**
 * Widget Markdown 处理模块
 * 包含 markdown-it 的 adp-widget 插件和 HTML 编解码工具函数
 */

import type MarkdownIt from 'markdown-it';

/** Widget 渲染选项 */
export interface WidgetRenderOptions {
  /** 语言环境 */
  locale: string;
  /** Widget ID（后备值） */
  widgetId?: string;
  /** Widget Run ID（后备值） */
  widgetRunId?: string;
  /** 消息 Record ID */
  recordId?: string;
}

/**
 * 将字符串转换为 HTML 实体编码，用于安全地放入 HTML 属性中
 */
export function escapeHtmlAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * 将 HTML 属性编码还原为原始字符串
 */
export function unescapeHtmlAttr(str: string): string {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/**
 * 格式化 JSON 字符串，带语法高亮（用于 fallback 展示）
 */
export function formatJsonWithHighlight(jsonStr: string): string {
  try {
    const obj = JSON.parse(jsonStr);
    const formatted = JSON.stringify(obj, null, 2);
    return formatted
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
      .replace(/: "([^"]*)"/g, ': <span class="json-string">"$1"</span>')
      .replace(/: (\d+)/g, ': <span class="json-number">$1</span>')
      .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
      .replace(/: (null)/g, ': <span class="json-null">$1</span>');
  } catch {
    return jsonStr;
  }
}

/**
 * 自定义 markdown-it 插件：处理 adp-widget 代码块
 * 将 ```adp-widget 代码块渲染为 <adp-widget> 组件
 */
export function createMarkdownItWidgetPlugin(options: WidgetRenderOptions) {
  return function markdownItWidgetPlugin(md: MarkdownIt): void {
    const defaultFence = md.renderer.rules.fence!;

    md.renderer.rules.fence = (tokens, idx, opts, env, self) => {
      const token = tokens[idx];
      if (!token) {
        return '';
      }
      const info = token.info.trim();

      // 检测 adp-widget 代码块
      if (info === 'adp-widget' || info.startsWith('adp-widget ')) {
        const widgetJson = token.content.trim();

        // 尝试从 widget JSON 中解析 _adp_widget_meta 获取真正的 widgetId 和 widgetRunId
        let parsedWidgetId = '';
        let parsedWidgetRunId = '';
        try {
          const widgetObj = JSON.parse(widgetJson);
          if (widgetObj._adp_widget_meta) {
            parsedWidgetId = widgetObj._adp_widget_meta.widgetId || '';
            parsedWidgetRunId = widgetObj._adp_widget_meta.widgetRunId || '';
          }
        } catch {
          // 解析失败，使用空值
        }

        const actualWidgetId = parsedWidgetId || options.widgetId || '';
        const actualWidgetRunId = parsedWidgetRunId || options.widgetRunId || '';

        // 生成唯一的 DOM ID（用于 DOM 元素标识，不是业务 widgetId）
        const elementId = `widget-${Date.now()}-${idx}`;

        return `<div class="adp-widget-wrapper" data-widget-id="${actualWidgetId}" data-widget-run-id="${actualWidgetRunId}" data-record-id="${options.recordId || ''}" data-element-id="${elementId}">
        <adp-widget 
          id="${elementId}"
          locale="${options.locale}"
          widget-json="${escapeHtmlAttr(widgetJson)}"
        ></adp-widget>
      </div>`;
      }

      // 其他代码块使用默认渲染
      return defaultFence(tokens, idx, opts, env, self);
    };
  };
}

/**
 * 显示 widget 加载失败时的回退 JSON 展示
 */
export function showFallbackJson(wrappers: NodeListOf<Element>): void {
  wrappers.forEach((wrapper) => {
    const widgetEl = wrapper.querySelector('adp-widget');
    if (!widgetEl) return;

    const encodedJson = widgetEl.getAttribute('widget-json') || '';
    const originalJson = unescapeHtmlAttr(encodedJson);

    const fallbackEl = document.createElement('div');
    fallbackEl.className = 'adp-widget-fallback';
    fallbackEl.innerHTML = `
      <div class="fallback-header">
        <span class="fallback-icon">⚠️</span>
        <span class="fallback-title">Widget 加载失败</span>
      </div>
      <div class="fallback-content">
        <pre class="fallback-json"><code>${formatJsonWithHighlight(originalJson)}</code></pre>
      </div>
    `;

    wrapper.innerHTML = '';
    wrapper.appendChild(fallbackEl);
  });
}
