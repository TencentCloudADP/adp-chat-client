<template>
  <div :class="['markdown-body', theme, 'md-content-container', role]">
    <div ref="markdownContainer" class="md-content" v-html="renderedMarkdown"></div>
  </div>
</template>



<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import type { QuoteInfo } from '@/model/chat'
import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui'
import MarkdownIt from 'markdown-it';
import { katex } from "@mdit/plugin-katex";
import markdownItHighlightjs from 'markdown-it-highlightjs';
import 'katex/dist/katex.min.css';
import './github-markdown.css';
import 'highlight.js/styles/default.css';

const uiStore = useUiStore()
const { theme } = storeToRefs(uiStore)
const markdownContainer = ref(null)

// message rendering
function insertReference(content: string, quotes?: QuoteInfo[]): string {
  if (!quotes) {
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

const { content, role, quoteInfos } = defineProps<{
  quoteInfos?: QuoteInfo[];
  content: string | undefined;
  role?: string   //  user/assistant/error/model-change/system
}>();
const mdIt = MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
})
  .use(katex)
  .use(markdownItHighlightjs)

// 自定义链接渲染规则：把所有超链接变成卡片
// 处理 link_open：返回完整的卡片 HTML，避免 link_open 和 link_close 分离导致的样式问题
mdIt.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const href = token.attrGet('href') || ''
  const title = token.attrGet('title') || ''
  
  // 查找链接内的文本内容
  let text = ''
  let i = idx + 1
  while (i < tokens.length && tokens[i].type !== 'link_close') {
    if (tokens[i].type === 'text' || tokens[i].type === 'code_inline') {
      text += tokens[i].content
    } else if (tokens[i].type === 'text_special') {
      text += tokens[i].content
    }
    i++
  }

  // 如果是外部链接且有文本，渲染为完整卡片
  if (href && text) {
    try {
      const hostname = new URL(href).hostname
      // 标记这个链接为卡片样式，用于 link_close 处理
      token.meta = { isCard: true }
      return `<div class="link-card-wrapper"><a href="${href}" target="_blank" rel="noopener noreferrer" class="link-card"><span class="link-card-text-hidden">`
    } catch (e) {
      // URL 解析失败，使用默认渲染
    }
  }

  // 其他情况保持默认渲染
  return self.renderToken(tokens, idx, options)
}

// 处理 link_close：如果是卡片链接，返回卡片内容和关闭标签
mdIt.renderer.rules.link_close = (tokens, idx, options, env, self) => {
  // 查找对应的 link_open token
  let openIdx = idx - 1
  while (openIdx >= 0 && tokens[openIdx].type !== 'link_open') {
    openIdx--
  }
  
  if (openIdx >= 0 && tokens[openIdx].meta?.isCard) {
    const openToken = tokens[openIdx]
    const href = openToken.attrGet('href') || ''
    const title = openToken.attrGet('title') || ''
    
    // 重新获取文本内容
    let text = ''
    let i = openIdx + 1
    while (i < idx) {
      if (tokens[i].type === 'text' || tokens[i].type === 'code_inline') {
        text += tokens[i].content
      } else if (tokens[i].type === 'text_special') {
        text += tokens[i].content
      }
      i++
    }
    
    try {
      const hostname = new URL(href).hostname
      return `</span><div class="link-card-content">
        <div class="link-card-icon">🔗</div>
        <div class="link-card-info">
          <div class="link-card-title">${text}</div>
          <div class="link-card-url">${hostname}</div>
          ${title ? `<div class="link-card-desc">${title}</div>` : ''}
        </div>
      </div></a></div>`
    } catch (e) {
      // URL 解析失败，使用默认渲染
    }
  }

  // 其他情况保持默认渲染
  return self.renderToken(tokens, idx, options)
}

const renderedMarkdown = computed(() => {
  return content && mdIt.render(insertReference(content || '', quoteInfos));
});

onMounted(() => {
  // 事件委托：监听容器内所有带有 class="my-btn" 的按钮
  if (markdownContainer.value) {
    (markdownContainer.value as HTMLElement).addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains('my-btn')) {
        const modalType = target.dataset.modal;
        if (modalType === 'login') {
          alert('打开登录弹窗！')
        } else if (modalType === 'info') {
          alert('打开信息弹窗！')
        }
      }
    })
  }
})

</script>



<style scoped>
.md-content{
  position: relative;
  font-size: 14px; /* 可以调整这个值来改变字体大小 */
  line-height: 1.6;
}
.md-content-container {
  padding: var(--td-comp-paddingTB-s);
}

.md-content-container.system {
  background-color: transparent;
  padding-bottom:0;
  border-left:1px solid var(--td-component-stroke);
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

.md-content-container.assistant{
  padding: var(--td-comp-paddingTB-s) 0;
  margin-left: 0;
}
:deep(.md-content-container img) {
  width: 150px;
  display: inline-block;
}

:deep(.tool-btn) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 999px;
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

:deep(.tool-btn:hover) {
  background: #e9ecef;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

:deep(.tool-icon) {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

:deep(.tool-btn .tool-status) {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

:deep(.tool-btn .tool-status.online) {
  background: #28a745; /* 绿色 - 在线 */
}

:deep(.tool-btn .tool-status.offline) {
  background: #dc3545; /* 红色 - 离线 */
}

:deep(.tool-btn .tool-status.processing) {
  width: 16px;
  height: 16px;
  background: url('../../assets/icons/loading.svg') no-repeat center;
  background-size: contain;
  border-radius: 0;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

:deep(.link-card-wrapper) {
  display: block;
  max-width: 400px;
  margin: 12px 0;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.2s;
  overflow: hidden;
}

:deep(.link-card-wrapper:hover) {
  border-color: #6366f1;
  box-shadow: 0 6px 16px rgba(99,102,241,0.15);
  transform: translateY(-2px);
}

:deep(.link-card) {
  display: block;
  padding: 16px;
  text-decoration: none !important;
  color: inherit;
}

:deep(.link-card:hover) {
  text-decoration: none !important;
}

:deep(.link-card *) {
  text-decoration: none !important;
}

:deep(.link-card-text-hidden) {
  display: none;
}

:deep(.link-card-content) {
  display: flex;
  align-items: center;
  gap: 16px;
}

:deep(.link-card-icon) {
  width: 48px;
  height: 48px;
  background: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

:deep(.link-card-info) {
  flex: 1;
  overflow: hidden;
}

:deep(.link-card-title) {
  font-weight: 600;
  font-size: 16px;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.link-card-url) {
  font-size: 13px;
  color: #666;
  margin-top: 4px;
}

:deep(.link-card-desc) {
  font-size: 13px;
  color: #888;
  margin-top: 6px;
}

</style>
