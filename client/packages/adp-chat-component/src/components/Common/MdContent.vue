<!-- Markdown 内容渲染组件，支持代码高亮、数学公式、XSS 防护、Widget 渲染 -->
<template>
  <div :class="['markdown-body', theme, 'md-content-container', role]">
    <div class="md-content" ref="mdContentRef" v-html="renderedMarkdown"></div>
    <!-- 图片 hover 预览浮层 -->
    <div
      v-if="previewVisible"
      class="md-img-preview-tooltip"
      :style="previewStyle"
    >
      <img :src="previewSrc" class="md-img-preview-image" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted, onBeforeUnmount } from "vue";
import type { QuoteInfo } from '../../model/chat-v2';
import type { ThemeProps, ChatMode } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
import MarkdownIt from 'markdown-it';
import { katex } from "@mdit/plugin-katex";
import markdownItHighlightjs from 'markdown-it-highlightjs';
import DOMPurify from 'dompurify';
import 'katex/dist/katex.min.css';
import '../../styles/markdown.css';
import 'highlight.js/styles/default.css';
import type { NormalizedSkill } from '../../model/skills';
import { inlineTextToMentionHtml } from '../QaEditor/mention-module';

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
  /** 聊天模式：claw-简化模式, standard-标准模式 */
  mode?: ChatMode;
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
  /**
   * 是否启用 Widget 缩放自适应
   * - true: 自适应父容器宽度（推荐移动端使用）
   * - false/undefined: 不缩放（默认）
   * - number: 按指定比例缩放（如 0.5 表示缩放到 50%）
   */
  enableScale?: boolean | number;
  /** 已注册 skills（用于把 user 消息中的 @skill:name 还原为蓝色 chip） */
  mentionSkills?: NormalizedSkill[];
  /** 已注册 knowledgeBase */
  mentionKnowledge?: NormalizedSkill[];
  /** 已注册 tools */
  mentionTools?: NormalizedSkill[];
  /** 已注册 connectors */
  mentionConnectors?: NormalizedSkill[];
}

const props = withDefaults(defineProps<Props>(), {
  role: 'assistant',
  mode: 'standard',
  locale: 'zh-CN',
  language: '',
  widgetId: '',
  widgetRunId: '',
  recordId: '',
  disable: false,
  enableScale: false,
  mentionSkills: () => [],
  mentionKnowledge: () => [],
  mentionTools: () => [],
  mentionConnectors: () => [],
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
type LinkCloseRenderer = NonNullable<typeof mdIt.renderer.rules.link_close>

const defaultLinkOpenRenderer: LinkOpenRenderer =
  mdIt.renderer.rules.link_open ??
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

const defaultLinkCloseRenderer: LinkCloseRenderer =
  mdIt.renderer.rules.link_close ??
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

/** 判断是否为文件/图片链接（含常见文件及图片扩展名的 URL） */
const FILE_EXT_RE = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|zip|rar|7z|tar|gz|md|json|xml|yaml|yml|png|jpg|jpeg|gif|webp|bmp|svg|ico|tiff|tif)(\?|$)/i

/** 图片类型扩展名集合 */
const IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'ico', 'tiff', 'tif'])

/**
 * 根据文件扩展名获取文件类型分类（用于 CSS 类名）
 */
function getFileTypeClass(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  if (['pdf'].includes(ext)) return 'type-pdf'
  if (['doc', 'docx'].includes(ext)) return 'type-word'
  if (['ppt', 'pptx'].includes(ext)) return 'type-ppt'
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'type-excel'
  if (['txt', 'md', 'json', 'xml', 'yaml', 'yml'].includes(ext)) return 'type-text'
  if (IMAGE_EXTS.has(ext)) return 'type-image'
  return 'type-file'
}


/**
 * 自定义链接渲染规则
 * - claw 模式：文件/图片链接渲染为 doccard 卡片
 * - assistant 角色（非 claw 模式）：图片链接直接渲染为 img 标签
 * - 其他模式：文件/图片链接不渲染（通过 fileAttachments 展示，避免重复）
 */
mdIt.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]!
  const href = token.attrGet('href') || ''

  if (FILE_EXT_RE.test(href)) {
    const textToken = tokens[idx + 1]
    const linkText = textToken?.content || decodeURIComponent(href.split('/').pop()?.split('?')[0] || '') || '文件'
    const escapedHref = href.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    const escapedName = linkText.replace(/&/g, '&amp;').replace(/</g, '&lt;')

    // assistant 角色：所有文件链接保持默认超链接展示
    if (props.role === 'assistant') {
      token.attrSet('target', '_blank')
      token.attrSet('rel', 'noopener noreferrer')
      return defaultLinkOpenRenderer(tokens, idx, options, env, self)
    }

    // claw 模式（非 assistant 角色）：渲染为文件卡片
    if (props.mode === 'claw') {
      token.meta = token.meta || {}
      token.meta._fileCard = true
      const urlFileName = decodeURIComponent(href.split('/').pop()?.split('?')[0] || '')
      const typeClass = getFileTypeClass(urlFileName || linkText)
      return `<span class="md-file-card claw-mode ${typeClass}" data-href="${escapedHref}" title="${escapedName}">` +
        `<span class="md-file-icon"></span>` +
        `<span class="md-file-name">${escapedName}</span>` +
        `</span>`
    }

    // 其他模式：不渲染文件链接，通过 fileAttachments 展示
    token.meta = token.meta || {}
    token.meta._fileCard = true
    return ''
  }

  // 非文件链接保持默认行为
  token.attrSet('target', '_blank')
  token.attrSet('rel', 'noopener noreferrer')
  return defaultLinkOpenRenderer(tokens, idx, options, env, self)
}

/** 文件卡片链接关闭时跳过输出 */
mdIt.renderer.rules.link_close = (tokens, idx, options, env, self) => {
  let level = 0
  for (let i = idx - 1; i >= 0; i--) {
    if (tokens[i]!.type === 'link_close') level++
    if (tokens[i]!.type === 'link_open') {
      if (level === 0) {
        if (tokens[i]!.meta?._fileCard) return ''
        break
      }
      level--
    }
  }
  return defaultLinkCloseRenderer(tokens, idx, options, env, self)
}

/** 自定义 text token 渲染：如果前面的 link_open 是文件卡片，跳过文本输出 */
const defaultTextRenderer = mdIt.renderer.rules.text ?? ((tokens, idx) => tokens[idx]!.content)
mdIt.renderer.rules.text = (tokens, idx, options, env, self) => {
  if (idx > 0 && tokens[idx - 1]?.type === 'link_open' && tokens[idx - 1]?.meta?._fileCard) {
    return ''
  }
  return defaultTextRenderer(tokens, idx, options, env, self)
}

/**
 * 自定义图片渲染规则
 * - claw 模式：使用 doccard 样式渲染（icon + 文件名）
 * - assistant 角色（非 claw 模式）：直接渲染为 img 标签
 * - 其他模式：不渲染（通过 fileAttachments 展示，避免重复）
 */
mdIt.renderer.rules.image = (tokens, idx) => {
  const token = tokens[idx]!
  const src = token.attrGet('src') || ''
  const alt = token.content || token.attrGet('alt') || ''
  const fileName = alt || decodeURIComponent(src.split('/').pop()?.split('?')[0] || '') || '图片'

  if (props.mode === 'claw') {
    const escapedSrc = src.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    const escapedAlt = alt.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
    const escapedName = fileName.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    const typeClass = getFileTypeClass(fileName)

    return `<span class="md-file-card claw-mode ${typeClass}" data-href="${escapedSrc}" title="${escapedAlt || escapedName}">` +
      `<span class="md-file-icon"></span>` +
      `<span class="md-file-name">${escapedName}</span>` +
      `</span>`
  }

  // assistant 角色：直接渲染为图片
  if (props.role === 'assistant') {
    const escapedSrc = src.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    const escapedAlt = alt.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    return `<img class="md-inline-image" src="${escapedSrc}" alt="${escapedAlt}" />`
  }

  // 其他模式：不渲染，通过 fileAttachments 展示
  return ''
}

/** 渲染后的 HTML 内容（已通过 DOMPurify 消毒防止 XSS） */
const renderedMarkdown = computed(() => {
  if (!props.content) return '';
  // 访问 mode 以确保 computed 能追踪其变化
  const _mode = props.mode;
  void _mode;

  /*
   * user 消息中的 @skill:name / @tool:name 需要还原为蓝色 chip，
   * 但直接拼 chip span 会被 markdown-it 处理或被 DOMPurify 严格过滤。
   * 采用占位符替换策略：
   * 1) 渲染前把内联标记替换为 [\u0001MENTION_<idx>\u0001]，避开 markdown 与 DOMPurify
   * 2) 渲染并消毒后再把占位符还原为安全的 chip HTML（chip 自身仅含 span/class/data-*，已在 DOMPurify 白名单内）
   */
  const mentionChips: string[] = [];
  let preprocessed = props.content;
  if (props.role === 'user') {
    // 与 sender 中 chip 显示风格保持一致：标签前缀对应 AtMentionPanel 的分类 label
    const LABEL_SKILLS = 'Skills';
    const LABEL_KNOWLEDGE = '知识库';
    const LABEL_TOOLS = '工具';
    const LABEL_CONNECTORS = '连接器';

    // eslint-disable-next-line no-console
    console.log('[MdContent] user message render, mention lists:',
        'skills:', (props.mentionSkills || []).length,
        'knowledge:', (props.mentionKnowledge || []).length,
        'tools:', (props.mentionTools || []).length,
        'connectors:', (props.mentionConnectors || []).length);

    const chipHtml = inlineTextToMentionHtml(props.content, {
      skills: props.mentionSkills,
      knowledgeBase: props.mentionKnowledge,
      tools: [...(props.mentionTools || []), ...(props.mentionConnectors || [])],
      labels: { skills: LABEL_SKILLS, knowledgeBase: LABEL_KNOWLEDGE, tools: LABEL_TOOLS },
    });
    if (chipHtml && chipHtml.includes('class="at-mention-tag"')) {
      // 把每个 chip 抽出并用占位符替换原文中的 @skill:/@knowledgeBase:/@tool:
      const TAG_REGEX = /@(skill|knowledgeBase|tool):([^\s@<>]+)/g;
      // 注册名按长度降序，与 inlineTextToMentionHtml 保持一致的最长前缀匹配规则
      const skillNames = (props.mentionSkills || [])
        .map((s) => s?.name || '')
        .filter(Boolean)
        .sort((a, b) => b.length - a.length);
      const knowledgeNames = (props.mentionKnowledge || [])
        .map((k) => k?.name || '')
        .filter(Boolean)
        .sort((a, b) => b.length - a.length);
      const toolNames = [...(props.mentionTools || []), ...(props.mentionConnectors || [])]
        .map((t) => t?.name || '')
        .filter(Boolean)
        .sort((a, b) => b.length - a.length);
      const skillMap: Record<string, string> = Object.create(null);
      (props.mentionSkills || []).forEach((s) => {
        if (s?.name) skillMap[s.name] = s.displayName || s.name;
      });
      const knowledgeMap: Record<string, string> = Object.create(null);
      (props.mentionKnowledge || []).forEach((k) => {
        if (k?.name) knowledgeMap[k.name] = k.displayName || k.name;
      });
      const toolMap: Record<string, string> = Object.create(null);
      const connectorNameSet = new Set<string>();
      (props.mentionConnectors || []).forEach((c) => {
        if (c?.name) {
          toolMap[c.name] = c.displayName || c.name;
          connectorNameSet.add(c.name);
        }
      });
      (props.mentionTools || []).forEach((t) => {
        if (t?.name) toolMap[t.name] = t.displayName || t.name;
      });

      const buildChip = (rawType: 'skill' | 'knowledgeBase' | 'tool', name: string): string => {
        // tools 与 connectors 在序列化时都用 @tool:，此处通过 connectorNameSet 区分
        let mentionType: string;
        let displayLabel: string;
        let map: Record<string, string>;
        if (rawType === 'skill') {
            mentionType = 'skills';
            displayLabel = LABEL_SKILLS;
            map = skillMap;
        } else if (rawType === 'knowledgeBase') {
            mentionType = 'knowledgeBase';
            displayLabel = LABEL_KNOWLEDGE;
            map = knowledgeMap;
        } else if (connectorNameSet.has(name)) {
            mentionType = 'connectors';
            displayLabel = LABEL_CONNECTORS;
            map = toolMap;
        } else {
            mentionType = 'tools';
            displayLabel = LABEL_TOOLS;
            map = toolMap;
        }
        const mentionDisplayName = map[name] || '';
        const showName = mentionDisplayName || name;
        // 与 mention-module.renderMention / mentionToHtml 保持一致：chip 文本为 "displayLabel showName"
        const textContent = displayLabel ? `${displayLabel} ${showName}` : showName;
        // 图标修饰符：knowledgeBase → knowledge，tools → plugins，其余沿用 mentionType
        const iconModifier = mentionType === 'tools' ? 'plugins'
            : mentionType === 'knowledgeBase' ? 'knowledge'
            : mentionType;
        const safeName = encodeURIComponent(name || '');
        const escapeHtml = (str: string) =>
            String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        const displayNameAttr = mentionDisplayName
            ? ` data-mention-display-name="${encodeURIComponent(mentionDisplayName)}"`
            : '';
        const safeLabel = encodeURIComponent(displayLabel);
        return (
            `<span data-w-e-type="mention" data-mention-type="${mentionType}" data-mention-id="" data-mention-name="${safeName}" data-display-label="${safeLabel}"${displayNameAttr} class="at-mention-tag" contenteditable="false">` +
            `<span class="at-mention-tag__icon at-mention-tag__icon--${iconModifier}"></span>` +
            `<span class="at-mention-tag__text">${escapeHtml(textContent)}</span>` +
            '</span>'
        );
      };

      preprocessed = props.content.replace(TAG_REGEX, (full, rawType: string, rawName: string) => {
        // knowledgeBase 格式：@knowledgeBase:id:name → 取 name 部分
        let name = rawName;
        if (rawType === 'knowledgeBase') {
            const colonIdx = name.indexOf(':');
            if (colonIdx !== -1) name = name.slice(colonIdx + 1);
        }
        const candidates = rawType === 'skill' ? skillNames
            : rawType === 'knowledgeBase' ? knowledgeNames
            : toolNames;
        if (candidates.length) {
          const hit = candidates.find((n) => name.startsWith(n));
          if (hit && hit.length < name.length) {
            const remainder = name.slice(hit.length);
            name = hit;
            const idx = mentionChips.length;
            mentionChips.push(buildChip(rawType as 'skill' | 'knowledgeBase' | 'tool', name));
            return `\u0001MENTION_${idx}\u0001${remainder}`;
          }
        }
        const idx = mentionChips.length;
        mentionChips.push(buildChip(rawType as 'skill' | 'knowledgeBase' | 'tool', name));
        // full 仅作为兜底使用以避免 lint 未使用警告
        void full;
        return `\u0001MENTION_${idx}\u0001`;
      });
    }
  }

  const html = mdIt.render(insertReference(preprocessed, props.quoteInfos));
  const sanitized = DOMPurify.sanitize(html, {
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
    ADD_ATTR: ['locale', 'disable', 'widget-json', 'data-widget-json', 'data-widget-id', 'data-widget-run-id', 'data-record-id', 'data-src'],
  });

  // 回填占位符为 chip HTML（chip 元素已在 ALLOWED_TAGS/ALLOW_DATA_ATTR 范围内）
  if (mentionChips.length === 0) return sanitized;
  return sanitized.replace(/\u0001MENTION_(\d+)\u0001/g, (_, idx: string) => {
    const i = Number(idx);
    return mentionChips[i] || '';
  });
});

// 使用 composable 管理 widget 初始化生命周期
// 包含：防抖 initWidgets、版本追踪、Custom Element 升级、事件绑定、disable 同步、缩放自适应
useWidgetInit({
  containerRef: mdContentRef,
  content: () => props.content,
  disable: () => props.disable,
  enableScale: () => props.enableScale,
  widgetId: () => props.widgetId,
  widgetRunId: () => props.widgetRunId,
  recordId: () => props.recordId,
  onWidgetAction: (action) => emit('widgetAction', action),
  onWidgetEvent: (event, widgetRunId, widgetId) => emit('widgetEvent', event, widgetRunId, widgetId),
  onWidgetRendered: (detail, widgetRunId, widgetId) => emit('widgetRendered', detail, widgetRunId, widgetId),
  onWidgetError: (error) => emit('widgetError', error),
});

/** 点击图片卡片、文件卡片或内联图片时新窗口打开 */
const handleContainerClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;

  // 点击内联图片，打开大图
  if (target.classList.contains('md-inline-image')) {
    const src = (target as HTMLImageElement).src;
    if (src) {
      window.open(src, '_blank');
    }
    return;
  }

  const imgCard = target.closest('.md-img-card') as HTMLElement | null;
  if (imgCard) {
    const src = imgCard.dataset.src;
    if (src) {
      window.open(src, '_blank');
    }
    return;
  }

  const fileCard = target.closest('.md-file-card') as HTMLElement | null;
  if (fileCard) {
    const href = fileCard.dataset.href;
    if (href) {
      window.open(href, '_blank');
    }
  }
};

/** 图片 hover 预览状态 */
const previewVisible = ref(false);
const previewSrc = ref('');
const previewStyle = reactive<{ top: string; left: string }>({ top: '0px', left: '0px' });
let previewTimer: ReturnType<typeof setTimeout> | null = null;

/** 计算预览浮层位置：基于卡片相对于容器的位置 */
const updatePreviewPosition = (card: HTMLElement) => {
  const container = mdContentRef.value;
  if (!container) return;
  const containerRect = container.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();
  const top = cardRect.top - containerRect.top - 160;
  const left = cardRect.left - containerRect.left;
  previewStyle.top = `${Math.max(top, 0)}px`;
  previewStyle.left = `${left}px`;
};

const handleMouseEnter = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const card = target.closest('.md-img-card') as HTMLElement | null;
  const imageFileCard = target.closest('.md-file-card.claw-mode.type-image') as HTMLElement | null;
  const hoverTarget = card || imageFileCard;
  if (!hoverTarget) return;
  const src = card ? card.dataset.src : imageFileCard?.dataset.href;
  if (!src) return;

  if (previewTimer) clearTimeout(previewTimer);
  previewTimer = setTimeout(() => {
    previewSrc.value = src;
    updatePreviewPosition(hoverTarget);
    previewVisible.value = true;
  }, 300);
};

const handleMouseLeave = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const card = target.closest('.md-img-card') as HTMLElement | null;
  const imageFileCard = target.closest('.md-file-card.claw-mode.type-image') as HTMLElement | null;
  const hoverTarget = card || imageFileCard;
  const relatedTarget = e.relatedTarget as HTMLElement | null;

  if (hoverTarget && relatedTarget && hoverTarget.contains(relatedTarget)) return;

  if (previewTimer) {
    clearTimeout(previewTimer);
    previewTimer = null;
  }
  previewVisible.value = false;
};

onMounted(() => {
  mdContentRef.value?.addEventListener('click', handleContainerClick);
  mdContentRef.value?.addEventListener('mouseenter', handleMouseEnter, true);
  mdContentRef.value?.addEventListener('mouseleave', handleMouseLeave, true);
});

onBeforeUnmount(() => {
  mdContentRef.value?.removeEventListener('click', handleContainerClick);
  mdContentRef.value?.removeEventListener('mouseenter', handleMouseEnter, true);
  mdContentRef.value?.removeEventListener('mouseleave', handleMouseLeave, true);
  if (previewTimer) {
    clearTimeout(previewTimer);
    previewTimer = null;
  }
});
</script>

<style scoped>
.md-content {
  position: relative;
}

.md-content-container {
  position: relative;
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

/* ===== assistant 角色内联图片样式 ===== */
:deep(.md-inline-image) {
  display: block;
  max-width: 100%;
  max-height: 400px;
  border-radius: var(--td-radius-large);
  margin: var(--td-size-4) 0;
  object-fit: contain;
  cursor: pointer;
}

/* ===== 图片卡片通用样式 ===== */
:deep(.md-img-card) {
  display: inline-flex;
  align-items: center;
  border-radius: var(--td-radius-large);
  border: 1px solid rgba(16, 32, 69, 0.10);
  background: #FFFFFF;
  cursor: pointer;
  box-sizing: border-box;
  transition: border-color 0.2s;
  vertical-align: middle;
}

:deep(.md-img-card:hover) {
  border-color: rgba(16, 32, 69, 0.20);
}

/* ===== 图片 hover 预览浮层 ===== */
.md-img-preview-tooltip {
  position: absolute;
  z-index: 1000;
  padding: var(--td-size-2);
  background: #FFFFFF;
  border-radius: var(--td-radius-large);
  border: 1px solid rgba(16, 32, 69, 0.10);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  pointer-events: none;
  max-width: 200px;
  max-height: 200px;
}

.md-img-preview-image {
  display: block;
  max-width: 100%;
  max-height: 192px;
  border-radius: var(--td-radius-medium);
  object-fit: contain;
}

/* ===== standard 模式：缩略图方块展示 ===== */
:deep(.md-img-card.standard-mode) {
  width: 80px;
  height: 80px;
  padding: 0;
  overflow: hidden;
  flex-shrink: 0;
}

:deep(.md-img-card.standard-mode .md-img-thumb) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 7px;
  display: block;
}

/* ===== 文件卡片通用样式 ===== */
:deep(.md-file-card) {
  display: inline-flex;
  align-items: center;
  gap: var(--td-size-3);
  padding: 4px 10px;
  border-radius: var(--td-radius-large);
  border: 1px solid rgba(16, 32, 69, 0.10);
  background: #FFFFFF;
  cursor: pointer;
  box-sizing: border-box;
  transition: border-color 0.2s;
  vertical-align: middle;
  max-width: 220px;
}

:deep(.md-file-card:hover) {
  border-color: rgba(16, 32, 69, 0.20);
}

:deep(.md-file-card .md-file-icon) {
  display: inline-block;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url("data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='36' height='36' rx='6' fill='%23F0F0F0'/%3E%3Cpath d='M10 8h10l6 6v14a2 2 0 01-2 2H10a2 2 0 01-2-2V10a2 2 0 012-2z' fill='%238C8C8C'/%3E%3Cpath d='M20 8v6h6' fill='%23D9D9D9'/%3E%3C/svg%3E");
}

/* claw 模式：12x12 紫色图标，与 QuestionItemV3 __tag-icon 一致 */
:deep(.md-file-card.claw-mode .md-file-icon) {
  width: 12px;
  height: 12px;
  background-size: 12px 12px;
  background-position: center;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M5.60847 1.64729C5.51897 1.59246 5.42144 1.55205 5.3194 1.52756C5.23309 1.50683 5.14272 1.50165 4.99974 1.50036L2.37667 1.50024L2.16756 1.50283C1.87873 1.50965 1.6962 1.53248 1.54618 1.60892C1.35802 1.70479 1.20504 1.85777 1.10917 2.04594C1.03273 2.19595 1.0099 2.37848 1.00308 2.66731L1.00049 2.87642V8.62343L1.00308 8.83254C1.0099 9.12138 1.03273 9.30392 1.10917 9.45393C1.20504 9.64208 1.35802 9.79508 1.54618 9.89093C1.65314 9.94543 1.77662 9.97268 1.94337 9.9863L2.09752 9.99496L2.37667 9.99961H9.62367L9.90282 9.99496L10.057 9.9863C10.2237 9.97268 10.3472 9.94543 10.4542 9.89093C10.6423 9.79508 10.7953 9.64208 10.8912 9.45393C10.9457 9.34698 10.9729 9.22349 10.9865 9.05673L10.9952 8.90258L10.9999 8.62343V4.37642L10.9952 4.09728L10.9865 3.94313C10.9729 3.77638 10.9457 3.65289 10.8912 3.54594C10.7953 3.35777 10.6423 3.20479 10.4542 3.10892C10.3042 3.03248 10.1216 3.00965 9.83279 3.00283L9.62367 3.00024L7.00017 2.99993L5.90782 1.90763L5.8054 1.8072L5.72123 1.73051C5.68212 1.69713 5.64631 1.67048 5.60847 1.64729ZM2.30229 2.25081L4.99971 2.25036L5.10433 2.2529L5.14433 2.25684C5.16983 2.26296 5.19423 2.27307 5.21668 2.28682L5.28105 2.34342L6.46985 3.53027L6.52486 3.58008C6.65829 3.68941 6.82606 3.74991 7.00008 3.74993L9.70069 3.75082L9.88531 3.75464L10.0084 3.76091L10.0809 3.76873L10.1065 3.77434L10.1137 3.77717C10.1607 3.80114 10.1989 3.83938 10.2229 3.88636L10.2288 3.9038L10.2365 3.95559L10.2427 4.04932L10.2497 4.41289L10.2502 8.39993L10.2482 8.73859L10.2427 8.95053L10.2365 9.04424L10.2288 9.096L10.2229 9.1134C10.199 9.16047 10.1607 9.19871 10.1137 9.22265L10.0963 9.22856L10.0445 9.23629L9.95078 9.24248L9.5872 9.24943L2.60017 9.24993L2.26151 9.24799L2.04958 9.24248L1.95586 9.2363L1.9041 9.22858L1.88669 9.22268C1.83962 9.1987 1.80139 9.16047 1.77742 9.11343C1.77648 9.11158 1.77553 9.10921 1.77459 9.10623L1.76897 9.08059L1.76116 9.00783L1.75488 8.88396L1.75105 8.69781V2.79934L1.75488 2.61476L1.76116 2.49169L1.76897 2.41923L1.77459 2.39363L1.77742 2.38644C1.80139 2.33938 1.83963 2.30115 1.88666 2.27718C1.88851 2.27624 1.89088 2.2753 1.89386 2.27435L1.91951 2.26873L1.99228 2.26091L2.11614 2.25464L2.30229 2.25081ZM2.76921 3.65427C2.75018 3.70021 2.75018 3.75845 2.75018 3.87494C2.75018 3.99142 2.75018 4.04967 2.76921 4.09561C2.79459 4.15687 2.84326 4.20554 2.90451 4.23091C2.95046 4.24994 3.0087 4.24994 3.12518 4.24994H5.50018L4.75018 3.49994H3.12518C3.0087 3.49994 2.95046 3.49994 2.90451 3.51897C2.84326 3.54434 2.79459 3.59301 2.76921 3.65427Z' fill='%236A45E5'/%3E%3C/svg%3E");
}

/* claw 模式图片类型：紫色图片图标 */
:deep(.md-file-card.claw-mode.type-image .md-file-icon) {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.6 2.75C2.3076 2.75 2.1334 2.75058 2.00428 2.76113C1.92547 2.76757 1.89234 2.77607 1.88346 2.77882C1.83882 2.80234 1.80234 2.83882 1.77882 2.88346C1.77607 2.89234 1.76757 2.92547 1.76113 3.00428C1.75058 3.1334 1.75 3.3076 1.75 3.6V7.20933L3.21724 5.53176L3.49942 5.20912L3.7817 5.53167L4.85277 6.75556L7.08793 4.43271L7.361 4.14893L7.63108 4.43556L10.25 7.21504V3.6C10.25 3.3076 10.2494 3.1334 10.2389 3.00428C10.2324 2.92547 10.2239 2.89234 10.2212 2.88346C10.1977 2.83882 10.1612 2.80234 10.1165 2.77882C10.1077 2.77607 10.0745 2.76757 9.99572 2.76113C9.8666 2.75058 9.6924 2.75 9.4 2.75H2.6ZM1.75 8.34028V8.4C1.75 8.6924 1.75058 8.8666 1.76113 8.99572C1.76757 9.07453 1.77607 9.10766 1.77882 9.11654C1.80234 9.16118 1.83882 9.19766 1.88346 9.22118C1.89234 9.22393 1.92547 9.23243 2.00428 9.23887C2.1334 9.24942 2.3076 9.25 2.6 9.25H9.4C9.6924 9.25 9.8666 9.24942 9.99572 9.23887C10.0745 9.23243 10.1077 9.22393 10.1165 9.22118C10.1612 9.19766 10.1977 9.16118 10.2212 9.11654C10.2239 9.10766 10.2324 9.07453 10.2389 8.99572C10.2494 8.8666 10.25 8.6924 10.25 8.4V8.2895L9.78135 7.81121L9.77878 7.80859L9.77627 7.80592L7.35529 5.23652L5.10989 7.57002L4.82657 7.86445L4.55748 7.55697L3.49959 6.34815L2.24677 7.78057L2.24497 7.78264L2.24496 7.78263L1.75 8.34028ZM1 3.6C1 3.03995 1 2.75992 1.10899 2.54601C1.20487 2.35785 1.35785 2.20487 1.54601 2.10899C1.75992 2 2.03995 2 2.6 2H9.4C9.96005 2 10.2401 2 10.454 2.10899C10.6422 2.20487 10.7951 2.35785 10.891 2.54601C11 2.75992 11 3.03995 11 3.6V8.4C11 8.96005 11 9.24008 10.891 9.45399C10.7951 9.64215 10.6422 9.79513 10.454 9.89101C10.2401 10 9.96005 10 9.4 10H2.6C2.03995 10 1.75992 10 1.54601 9.89101C1.35785 9.79513 1.20487 9.64215 1.10899 9.45399C1 9.24008 1 8.96005 1 8.4V3.6Z' fill='%236A45E5'/%3E%3C/svg%3E");
}

:deep(.md-file-card .md-file-name) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(0, 1, 10, 0.93);
  font-size: var(--td-font-size-body-small);
  font-weight: 400;
  line-height: var(--td-line-height-body-small);
  max-width: 170px;
}

/* ===== 文件卡片 claw 模式 ===== */
:deep(.md-file-card.claw-mode) {
  padding: 0 var(--td-size-2);
  border-radius: 3px;
  gap: var(--td-size-3);
  max-width: 220px;
  background: #f4eefc;
    border-color: #e2d5f8;
    color: #6a45e5;
    cursor: pointer;
}

:deep(.md-file-card.claw-mode .md-file-name) {
  max-width: 160px;
  color: #6a45e5;
}


/* Widget 容器样式 */
:deep(.adp-widget-wrapper) {
  margin: var(--td-comp-margin-m, 12px) 0;
  padding: 0;
  border-radius: var(--td-radius-medium, 8px);
  overflow: hidden;
  /* 缩放时 overflow 会被 JS 动态设置为 visible */
}

:deep(.adp-widget-wrapper adp-widget) {
  display: block;
  width: fit-content;
  /* transform / transformOrigin 由 JS 动态设置 */
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
  gap: var(--td-size-4);
  padding: 12px 16px;
  background-color: var(--td-warning-color-light, #fff7e6);
  border-bottom: 1px solid var(--td-component-stroke, #e0e0e0);
  font-size: var(--td-font-size-body-medium);
  color: var(--td-warning-color, #ed7b2f);
}

:deep(.adp-widget-fallback .fallback-icon) {
  font-size: var(--td-font-size-body-large);
}

:deep(.adp-widget-fallback .fallback-title) {
  font-weight: 500;
}

:deep(.adp-widget-fallback .fallback-content) {
  padding: var(--td-size-5) var(--td-size-6);
  max-height: 400px;
  overflow: auto;
}

:deep(.adp-widget-fallback .fallback-json) {
  margin: 0;
  padding: 12px;
  background-color: var(--td-bg-color-secondarycontainer, #fafafa);
  border-radius: var(--td-radius-small, 4px);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: var(--td-font-size-body-small);
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
