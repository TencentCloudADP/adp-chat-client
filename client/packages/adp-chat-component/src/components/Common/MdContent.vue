<!-- Markdown 内容渲染组件，支持代码高亮、数学公式、XSS 防护、Widget 渲染 -->
<template>
  <div :class="['markdown-body', theme, 'md-content-container', role]">
    <div class="md-content" ref="mdContentRef" v-html="renderedMarkdown"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, nextTick } from "vue";
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

interface Props extends ThemeProps {
  /** 引用信息数组 */
  quoteInfos?: QuoteInfo[];
  /** 内容文本 */
  content: string | undefined;
  /** 角色类型 */
  role?: 'user' | 'assistant' | 'system';
  /** 语言设置 */
  locale?: string;
  /** Widget SDK 的基础路径，默认为 '/widget' */
  widgetBasePath?: string;
}

const props = withDefaults(defineProps<Props>(), {
  role: 'assistant',
  locale: 'zh-CN',
  widgetBasePath: '/widget',
  ...themePropsDefaults,
});

const emit = defineEmits<{
  (e: 'widgetAction', action: { type: string; payload?: any }): void;
  (e: 'widgetRendered', detail: { success: boolean; error?: Error }): void;
  (e: 'widgetError', error: Error): void;
}>();

// DOM 引用
const mdContentRef = ref<HTMLDivElement | null>(null);

/** 在内容中插入引用角标 */
function insertReference(content: string, quotes?: QuoteInfo[]): string {
  if (!quotes || quotes.length === 0) {
    return content
  }
  // 1. 将QuoteInfo数组按Position降序排序，这样从后往前插入不会影响前面的位置
  const sortedQuotes = [...quotes].sort((a, b) => (b.Position == a.Position) ? (b.Index > a.Index ? 1 : -1) : (b.Position - a.Position))

  // 2. 将字符串转为数组便于操作
  let contentArray = [...content]

  // 3. 遍历每个QuoteInfo并插入角标
  for (const quote of sortedQuotes) {
    const { Index, Position } = quote
    // 在指定位置插入角标
    contentArray.splice(Position, 0, `<sup>[${Index}]</sup>`)
  }

  // 4. 将数组转回字符串
  return contentArray.join('')
}

/**
 * 将字符串转换为 HTML 实体编码，用于安全地放入 HTML 属性中
 */
function escapeHtmlAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * 检查 widget SDK 是否已加载
 * 通过检测 customElements 中是否注册了 adp-widget 来判断
 */
function isWidgetSdkLoaded(): boolean {
  return typeof customElements !== 'undefined' && customElements.get('adp-widget') !== undefined;
}

// Widget SDK 加载状态
let widgetSdkLoadPromise: Promise<void> | null = null;

/**
 * 懒加载 widget SDK
 * 只在需要时加载，避免不必要的网络请求
 */
function loadWidgetSdk(): Promise<void> {
  if (isWidgetSdkLoaded()) {
    return Promise.resolve();
  }

  if (widgetSdkLoadPromise) {
    return widgetSdkLoadPromise;
  }

  // 构建 widget SDK 路径
  const basePath = props.widgetBasePath.endsWith('/') 
    ? props.widgetBasePath.slice(0, -1) 
    : props.widgetBasePath;
  const widgetSdkUrl = `${basePath}/adp-widget.js`;

  widgetSdkLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = widgetSdkUrl;
    script.onload = () => {
      // 等待 custom element 注册完成
      const checkRegistration = () => {
        if (isWidgetSdkLoaded()) {
          resolve();
        } else {
          setTimeout(checkRegistration, 50);
        }
      };
      checkRegistration();
    };
    script.onerror = () => {
      widgetSdkLoadPromise = null;
      console.error('[MdContent] Failed to load widget SDK from:', widgetSdkUrl);
      reject(new Error(`Failed to load widget SDK from ${widgetSdkUrl}`));
    };
    document.head.appendChild(script);
  });

  return widgetSdkLoadPromise;
}

/**
 * 自定义 markdown-it 插件：处理 adp-widget 代码块
 * 将 ```adp-widget 代码块渲染为 <adp-widget> 组件
 * Widget SDK 会在需要时懒加载
 */
function markdownItWidgetPlugin(md: MarkdownIt): void {
  const defaultFence = md.renderer.rules.fence!;

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    if (!token) {
      return '';
    }
    const info = token.info.trim();

    // 检测 adp-widget 代码块
    if (info === 'adp-widget' || info.startsWith('adp-widget ')) {
      const widgetJson = token.content.trim();
      
      // 生成唯一 ID
      const widgetId = `widget-${Date.now()}-${idx}`;
      // 渲染为 adp-widget 自定义元素，直接设置 widget-json 属性
      // 使用 HTML 实体编码来安全地嵌入 JSON
      return `<div class="adp-widget-wrapper" data-widget-id="${widgetId}">
        <adp-widget 
          id="${widgetId}"
          locale="${props.locale}"
          widget-json="${escapeHtmlAttr(widgetJson)}"
        ></adp-widget>
      </div>`;
    }

    // 其他代码块使用默认渲染
    return defaultFence(tokens, idx, options, env, self);
  };
}

/** Markdown-it 解析器实例 */
const mdIt = MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
})
  .use(katex)
  .use(markdownItHighlightjs)
  .use(markdownItWidgetPlugin)

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
      // 多媒体相关标签
      'video', 'source', 'audio',
      // KaTeX 相关标签
      'math', 'semantics', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub',
      'mfrac', 'mroot', 'msqrt', 'mtable', 'mtr', 'mtd', 'mtext',
      'annotation', 'svg', 'path', 'line', 'rect', 'g',
      // Widget 相关标签
      'adp-widget'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel',
      // 多媒体相关属性
      'controls', 'autoplay', 'preload', 'type', 'muted', 'loop', 'poster',
      // KaTeX/SVG 相关属性
      'style', 'xmlns', 'width', 'height', 'viewBox', 'd', 'fill',
      'stroke', 'stroke-width', 'transform', 'x', 'y', 'x1', 'x2', 'y1', 'y2',
      // Widget 相关属性
      'locale', 'disable', 'widget-json', 'data-widget-json', 'data-widget-id'
    ],
    ALLOW_DATA_ATTR: true,
    ADD_TAGS: ['adp-widget'],
    ADD_ATTR: ['locale', 'disable', 'widget-json', 'data-widget-json', 'data-widget-id'],
  });
});

/**
 * 检查内容中是否包含 widget
 */
function hasWidgetContent(content: string | undefined): boolean {
  if (!content) return false;
  const has = content.includes('```adp-widget');
  if (has) {
    console.log('[MdContent Debug] hasWidgetContent: true, content length:', content.length);
  }
  return has;
}

/**
 * 初始化页面中的所有 widget 事件监听器
 * 会自动懒加载 Widget SDK（如果尚未加载）
 * 
 * 由于使用 v-html 渲染，每次内容更新时 DOM 会被完全替换，
 * 因此每次都需要重新添加事件监听器
 */
async function initWidgets(): Promise<void> {
  console.log('[MdContent Debug] initWidgets called, mdContentRef:', !!mdContentRef.value);
  if (!mdContentRef.value) return;

  const widgetWrappers = mdContentRef.value.querySelectorAll('.adp-widget-wrapper');
  console.log('[MdContent Debug] Found widget wrappers:', widgetWrappers.length);
  if (widgetWrappers.length === 0) return;

  // 懒加载 widget SDK
  const wasLoaded = isWidgetSdkLoaded();
  if (!wasLoaded) {
    console.log('[MdContent Debug] Loading widget SDK...');
    try {
      await loadWidgetSdk();
      console.log('[MdContent Debug] Widget SDK loaded successfully');
    } catch (error) {
      console.error('[MdContent Debug] Failed to load widget SDK:', error);
      emit('widgetError', error instanceof Error ? error : new Error('Failed to load widget SDK'));
      return;
    }
  }

  // 为每个 widget 添加事件监听器
  widgetWrappers.forEach((wrapper) => {
    const widgetEl = wrapper.querySelector('adp-widget');
    if (!widgetEl) return;
    
    // 如果 SDK 是刚刚加载的，需要手动升级已存在的 custom element
    // 通过替换元素来触发升级
    if (!wasLoaded) {
      const parent = widgetEl.parentNode;
      if (parent) {
        // 创建新元素并复制属性
        const newWidget = document.createElement('adp-widget');
        Array.from(widgetEl.attributes).forEach(attr => {
          newWidget.setAttribute(attr.name, attr.value);
        });
        parent.replaceChild(newWidget, widgetEl);
        // 更新引用
        const newWidgetEl = newWidget;
        setupWidgetListeners(newWidgetEl);
        return;
      }
    }
    
    setupWidgetListeners(widgetEl);
  });
}

/**
 * 为 widget 元素设置事件监听器
 */
function setupWidgetListeners(widgetEl: Element): void {
  // 检查是否已经添加过事件监听器（通过自定义属性标记）
  if (widgetEl.hasAttribute('data-events-attached')) return;
  widgetEl.setAttribute('data-events-attached', 'true');
  
  // 添加事件监听器
  widgetEl.addEventListener('widget-action', ((event: CustomEvent) => {
    const { action } = event.detail || {};
    if (action) {
      emit('widgetAction', action);
    }
  }) as EventListener);

  widgetEl.addEventListener('widget-rendered', ((event: CustomEvent) => {
    const { success, error } = event.detail || {};
    emit('widgetRendered', { success, error });
  }) as EventListener);
}

// 监听内容变化，如果包含 widget 则初始化
// 使用 flush: 'post' 确保在 DOM 更新完成后执行
watch(
  () => props.content,
  (newContent) => {
    console.log('[MdContent Debug] watch triggered, hasWidget:', hasWidgetContent(newContent));
    if (hasWidgetContent(newContent)) {
      initWidgets();
    }
  },
  { immediate: false, flush: 'post' }
);

// 组件挂载后检查是否需要初始化 widget
onMounted(() => {
  console.log('[MdContent Debug] onMounted, hasWidget:', hasWidgetContent(props.content));
  if (hasWidgetContent(props.content)) {
    nextTick(() => {
      initWidgets();
    });
  }
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
  width: 100%;
}
</style>
