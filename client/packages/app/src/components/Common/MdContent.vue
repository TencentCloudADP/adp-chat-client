<template>
    <div :class="['markdown-body',theme,'md-content-container', role]" >
      <div class="md-content" v-html="renderedMarkdown"></div>
    </div>
</template>



<script setup lang="ts">
import { ref, computed } from "vue";
import type {  QuoteInfo } from '@/model/chat'

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

const { content,role,quoteInfos} = defineProps<{
    quoteInfos?:QuoteInfo[];
    content: string | undefined ;
    role?: string   //  user/assistant/error/model-change/system
}>();
const mdIt = MarkdownIt({ 
    html: true, 
    breaks: true,
    linkify: true,
    typographer: true,
    quotes: '""'  // 保持直引号
}).use(katex)
.use(markdownItHighlightjs);

const renderedMarkdown = computed(() => {
  return content && mdIt.render(insertReference(content || '', quoteInfos));
  
});

</script>



<style scoped>
.md-content-container{
    padding: var(--td-comp-paddingTB-s);
}
.md-content-container.user{
    background-color: var(--td-bg-color-secondarycontainer);
    border-radius: var(--td-radius-extraLarge);
}
.user .md-content{
    padding: var(--td-comp-paddingTB-s);
}
.md-content-container.system{
    background-color: var(--td-bg-color-secondarycontainer);
    color: var(--td-text-color-secondary);
    font: var(--td-font-body-medium);
}
.md-content-container.assistant{
    padding:var(--td-comp-paddingTB-s) var(--td-comp-paddingTB-m);
    margin-left:var(--td-comp-margin-l);;
}
:deep(.md-content-container img){
    width: 150px;
    display: inline-block;
}
</style>
