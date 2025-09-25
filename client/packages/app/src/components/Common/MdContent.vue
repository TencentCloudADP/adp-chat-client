<template>
    <div :class="['md-content-container', role]">
      <div class="md-content" v-html="renderedMarkdown"></div>
    </div>
</template>



<script setup lang="ts">
import { ref, computed } from "vue";
import MarkdownIt from 'markdown-it';
import { katex } from "@mdit/plugin-katex"; 
import markdownItHighlightjs from 'markdown-it-highlightjs';
import 'highlight.js/styles/github-dark.css';
import 'katex/dist/katex.min.css'

const { content,role} = defineProps<{
    content: string | undefined ;
    role?: string
}>();
const mdIt = MarkdownIt({ 
    html: true, 
    breaks: true
}).use(katex).use(markdownItHighlightjs);

const renderedMarkdown = computed(() => {
//   window.MathJax.startup.defaultReady();
  return content && mdIt.render(content);
  
});

</script>



<style scoped>
.md-content-container.user{
    background-color: var(--td-bg-color-secondarycontainer);
    border-radius: var(--td-radius-extraLarge);
    padding: 20px;
}

</style>
<style>
.md-content-container img{
    width: 150px;
    display: inline-block;
}
</style>
