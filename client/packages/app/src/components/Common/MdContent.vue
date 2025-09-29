<template>
    <div :class="['markdown-body',theme,'md-content-container', role]" >
      <div class="md-content" v-html="renderedMarkdown"></div>
    </div>
</template>



<script setup lang="ts">
import { ref, computed } from "vue";
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


const { content,role} = defineProps<{
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
  return content && mdIt.render(content);
  
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
