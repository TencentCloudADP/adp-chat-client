<!-- Markdown 内容渲染组件，支持代码高亮、数学公式、XSS 防护、Widget 渲染 -->
<template>
  <div :class="['markdown-body', theme, 'md-content-container', role]">
    <div class="md-content" ref="mdContentRef" v-html="renderedMarkdown"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { QuoteInfo } from '../../model/chat-v2';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
import MarkdownIt from 'markdown-it';
import { katex } from "@mdit/plugin-katex";
import markdownItHighlightjs from 'markdown-it-highlightjs';
import DOMPurify from 'dompurify';
import 'katex/dist/katex.min.css';
import './github-markdown.css';
import 'highlight.js/styles/default.css';

// Widget 模块导入
import { createMarkdownItWidgetPlugin } from '../../widget';
import type { WidgetActionPayload } from '../../widget';
import { useWidgetInit } from '../../composables';

interface Props extends ThemeProps {
  /** 引用信息数组 */
  quoteInfos?: QuoteInfo[];
  /** 内容文本 */
  content: string | undefined;
  /** 角色类型 */
  role?: 'user' | 'assistant' | 'system';
  /** 语言设置（如 'zh-CN'、'en-US'），用于 widget 国际化 */
  locale?: string;
  /** 当前语言标识，优先级高于 locale */
  language?: string;
  /** Widget ID，用于与对话流交互 */
  widgetId?: string;
  /** Widget Run ID，用于与对话流交互 */
  widgetRunId?: string;
  /** 消息 Record ID，用于禁用同消息下的其他 widget */
  recordId?: string;
  /** 是否禁用所有 widget 交互 */
  disable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  role: 'assistant',
  locale: 'zh-CN',
  language: '',
  widgetId: '',
  widgetRunId: '',
  recordId: '',
  disable: false,
  ...themePropsDefaults,
});

// 计算实际使用的语言：优先使用 language，其次使用 locale
const effectiveLocale = computed(() => {
  if (props.language) {
    const langMap: Record<string, string> = {
      'zh': 'zh-CN',
      'en': 'en-US',
      'zh-CN': 'zh-CN',
      'zh-TW': 'zh-TW',
      'en-US': 'en-US',
      'en-GB': 'en-GB',
    };
    return langMap[props.language] || props.language;
  }
  return props.locale;
});

const emit = defineEmits<{
  (e: 'widgetAction', action: WidgetActionPayload): void;
  (e: 'widgetEvent', event: CustomEvent, widgetRunId: string, widgetId: string): void;
  (e: 'widgetRendered', detail: { success: boolean; error?: Error }, widgetRunId: string, widgetId: string): void;
  (e: 'widgetError', error: Error): void;
}>();

// DOM 引用
const mdContentRef = ref<HTMLDivElement | null>(null);

/** 在内容中插入引用角标 */
function insertReference(content: string, quotes?: QuoteInfo[]): string {
  if (!quotes || quotes.length === 0) {
    return content
  }
  const sortedQuotes = [...quotes].sort((a, b) => (b.Position == a.Position) ? (b.Index > a.Index ? 1 : -1) : (b.Position - a.Position))
  let contentArray = [...content]
  for (const quote of sortedQuotes) {
    const { Index, Position } = quote
    contentArray.splice(Position, 0, `<sup>[${Index}]</sup>`)
  }
  return contentArray.join('')
}

/** Markdown-it 解析器实例（使用提取的 widget 插件） */
const mdIt = MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
})
  .use(katex)
  .use(markdownItHighlightjs)
  .use(createMarkdownItWidgetPlugin({
    locale: effectiveLocale.value,
    widgetId: props.widgetId,
    widgetRunId: props.widgetRunId,
    recordId: props.recordId,
  }))

type LinkOpenRenderer = NonNullable<typeof mdIt.renderer.rules.link_open>

const defaultLinkOpenRenderer: LinkOpenRenderer =
  mdIt.renderer.rules.link_open ??
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

/** 在新标签页打开链接 */
mdIt.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]!
  token.attrSet('target', '_blank')
  token.attrSet('rel', 'noopener noreferrer')
  return defaultLinkOpenRenderer(tokens, idx, options, env, self)
}

/** 渲染后的 HTML 内容（已通过 DOMPurify 消毒防止 XSS） */
const renderedMarkdown = computed(() => {
  if (!props.content) return '';
  const html = mdIt.render(insertReference(props.content, props.quoteInfos));
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's', 'del',
      'code', 'pre', 'ul', 'ol', 'li',
      'a', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'sup', 'sub', 'span', 'div', 'hr',
      'video', 'source', 'audio',
      'math', 'semantics', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub',
      'mfrac', 'mroot', 'msqrt', 'mtable', 'mtr', 'mtd', 'mtext',
      'annotation', 'svg', 'path', 'line', 'rect', 'g',
      'adp-widget'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel',
      'controls', 'autoplay', 'preload', 'type', 'muted', 'loop', 'poster',
      'style', 'xmlns', 'width', 'height', 'viewBox', 'd', 'fill',
      'stroke', 'stroke-width', 'transform', 'x', 'y', 'x1', 'x2', 'y1', 'y2',
      'locale', 'disable', 'widget-json', 'data-widget-json', 'data-widget-id',
      'data-widget-run-id', 'data-record-id'
    ],
    ALLOW_DATA_ATTR: true,
    ADD_TAGS: ['adp-widget'],
    ADD_ATTR: ['locale', 'disable', 'widget-json', 'data-widget-json', 'data-widget-id', 'data-widget-run-id', 'data-record-id'],
  });
});

// 使用 composable 管理 widget 初始化生命周期
// 包含：防抖 initWidgets、版本追踪、Custom Element 升级、事件绑定、disable 同步
useWidgetInit({
  containerRef: mdContentRef,
  content: () => props.content,
  disable: () => props.disable,
  widgetId: () => props.widgetId,
  widgetRunId: () => props.widgetRunId,
  recordId: () => props.recordId,
  onWidgetAction: (action) => emit('widgetAction', action),
  onWidgetEvent: (event, widgetRunId, widgetId) => emit('widgetEvent', event, widgetRunId, widgetId),
  onWidgetRendered: (detail, widgetRunId, widgetId) => emit('widgetRendered', detail, widgetRunId, widgetId),
  onWidgetError: (error) => emit('widgetError', error),
});
</script>

<style scoped>
.md-content {
  position: relative;
}

.md-content-container {
  padding: var(--td-comp-paddingTB-s);
}

.md-content-container.system {
  background-color: transparent;
  padding-bottom: 0;
  border-left: 1px solid var(--td-component-stroke);
}

.md-content-container.user {
  border-radius: var(--td-radius-large);
  background-color: var(--td-brand-color-light);
}

.user .md-content {
  padding: 0 var(--td-comp-paddingLR-s);
}

.md-content-container.system {
  color: var(--td-text-color-secondary);
  font: var(--td-font-body-medium);
}

.md-content-container.assistant {
  padding: var(--td-comp-paddingTB-s) 0;
  margin-left: 0;
}

:deep(.md-content-container img) {
  width: 150px;
  display: inline-block;
}

/* Widget 容器样式 */
:deep(.adp-widget-wrapper) {
  margin: var(--td-comp-margin-m, 12px) 0;
  padding: 0;
  border-radius: var(--td-radius-medium, 8px);
  overflow: hidden;
}

:deep(.adp-widget-wrapper adp-widget) {
  display: block;
  width: fit-content;
}

/* Widget 加载失败回退样式 */
:deep(.adp-widget-fallback) {
  background-color: var(--td-bg-color-container, #f5f5f5);
  border: 1px solid var(--td-component-stroke, #e0e0e0);
  border-radius: var(--td-radius-medium, 8px);
  overflow: hidden;
}

:deep(.adp-widget-fallback .fallback-header) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: var(--td-warning-color-light, #fff7e6);
  border-bottom: 1px solid var(--td-component-stroke, #e0e0e0);
  font-size: 14px;
  color: var(--td-warning-color, #ed7b2f);
}

:deep(.adp-widget-fallback .fallback-icon) {
  font-size: 16px;
}

:deep(.adp-widget-fallback .fallback-title) {
  font-weight: 500;
}

:deep(.adp-widget-fallback .fallback-content) {
  padding: 12px 16px;
  max-height: 400px;
  overflow: auto;
}

:deep(.adp-widget-fallback .fallback-json) {
  margin: 0;
  padding: 12px;
  background-color: var(--td-bg-color-secondarycontainer, #fafafa);
  border-radius: var(--td-radius-small, 4px);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}

:deep(.adp-widget-fallback .fallback-json code) {
  background: none;
  padding: 0;
}

/* JSON 语法高亮 */
:deep(.adp-widget-fallback .json-key) {
  color: #9876aa;
}

:deep(.adp-widget-fallback .json-string) {
  color: #6a8759;
}

:deep(.adp-widget-fallback .json-number) {
  color: #6897bb;
}

:deep(.adp-widget-fallback .json-boolean) {
  color: #cc7832;
}

:deep(.adp-widget-fallback .json-null) {
  color: #808080;
}
</style>
