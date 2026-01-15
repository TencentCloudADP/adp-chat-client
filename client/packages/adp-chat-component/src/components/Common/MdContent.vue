<template>
  <div :class="['markdown-body', theme, 'md-content-container', role]">
    <TChatContent :options="options" :class="['markdown-container', theme, role]" 
    :markdown-props="{
      engine: 'cherry-markdown',
      options: {
        themeSettings: {
          codeBlockTheme: theme,
        },
        engine: {
          syntax: {
            mathBlock: {
              engine: 'katex',
            },
            inlineMath: {
              engine: 'katex',
            },
          }
        }
      }
    }" :role="role === 'system' ? 'system'  : 'assistant'" :content="processedContent" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { QuoteInfo } from '../../model/chat'
import { ChatContent as TChatContent } from '@tdesign-vue-next/chat'
import 'katex/dist/katex.min.css'
import 'katex/dist/katex.min.js'

interface Props {
  /** 引用信息数组 */
  quoteInfos?: QuoteInfo[];
  /** 内容文本 */
  content: string | undefined;
  /** 角色类型 */
  role?: 'user' | 'assistant' | 'system';
  /** 主题模式 */
  theme?: 'light' | 'dark';
}

const props = withDefaults(defineProps<Props>(), {
  role: 'assistant',
  theme: 'light'
});

const options = computed(() => ({
  engine: {
    syntax: {
      mathBlock: {
        engine: 'katex' as const,
      },
      inlineMath: {
        engine: 'katex' as const,
      },
    }
  },
}));

// 插入角标引用，使用 markdown 上标语法
function insertReference(content: string, quotes?: QuoteInfo[]): string {
  if (!quotes || quotes.length === 0) {
    return content
  }
  // 1. 将QuoteInfo数组按Position降序排序，这样从后往前插入不会影响前面的位置
  const sortedQuotes = [...quotes].sort((a, b) => (b.Position == a.Position) ? (b.Index > a.Index ? 1 : -1) : (b.Position - a.Position))

  // 2. 将字符串转为数组便于操作
  let contentArray = [...content]

  // 3. 遍历每个QuoteInfo并插入角标（使用 markdown 上标语法 ^[n]^）
  for (const quote of sortedQuotes) {
    const { Index, Position } = quote
    // cherry-markdown 支持 ^上标^ 语法
    contentArray.splice(Position, 0, `^[${Index}]^`)
  }

  // 4. 将数组转回字符串
  return contentArray.join('')
}

// 处理后的内容，包含角标
const processedContent = computed(() => {
  return insertReference(props.content || '', props.quoteInfos)
})
</script>

<style scoped>
.md-content {
  position: relative;
}

.md-content-container.user {
  padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingTB-l);
}

.md-content-container.system {
  background-color: transparent;
  padding-bottom: 0;
  border-left: 1px solid var(--td-component-stroke);
}

.markdown-container.t-chat__text {
  padding: 0;
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
</style>
