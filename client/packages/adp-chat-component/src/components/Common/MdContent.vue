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
import { computed, onMounted, watch } from "vue";
import type { QuoteInfo } from '../../model/chat'
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
import { ChatContent as TChatContent } from '@tdesign-vue-next/chat'

// 检测内容是否包含数学公式
const hasMathContent = (content: string): boolean => {
  // 检测 LaTeX 数学公式标记: $...$, $$...$$, \[...\], \(...\)
  return /\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)/.test(content);
};

// 懒加载 katex 样式和脚本
let katexLoaded = false;
const loadKatex = async () => {
  if (katexLoaded) return;
  try {
    await Promise.all([
      import('katex/dist/katex.min.css'),
      // @ts-ignore - katex.min.js 没有类型声明
      import('katex/dist/katex.min.js'),
    ]);
    katexLoaded = true;
  } catch (e) {
    console.warn('[MdContent] Failed to load katex:', e);
  }
};

interface Props extends ThemeProps {
  /** 引用信息数组 */
  quoteInfos?: QuoteInfo[];
  /** 内容文本 */
  content: string | undefined;
  /** 角色类型 */
  role?: 'user' | 'assistant' | 'system';
}

const props = withDefaults(defineProps<Props>(), {
  role: 'assistant',
  ...themePropsDefaults,
});

// 按需加载 katex
onMounted(() => {
  if (props.content && hasMathContent(props.content)) {
    loadKatex();
  }
});

// 监听 content 变化，按需加载
watch(() => props.content, (newContent) => {
  if (newContent && hasMathContent(newContent)) {
    loadKatex();
  }
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
