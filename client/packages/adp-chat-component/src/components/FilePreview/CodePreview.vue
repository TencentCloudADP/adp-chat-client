<template>
    <div class="code-preview">
        <!-- 加载状态（fetch 内容 或 Monaco 初始化） -->
        <div v-if="loading || monacoLoading" class="preview-loading">
            <div class="loading-spinner"></div>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="errorMsg" class="preview-error">
            <div class="preview-error__icon">⚠️</div>
            <p class="preview-error__text">{{ errorMsg }}</p>
            <p v-if="fileName" class="error-filename">{{ fileName }}</p>
        </div>

        <!-- Monaco Editor 容器，用 v-show 保留 DOM 供 Monaco 挂载 -->
        <div
            v-show="!loading && !monacoLoading && !errorMsg"
            ref="editorContainer"
            class="editor-container"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { loadMonaco } from './monaco-loader';
import type * as Monaco from 'monaco-editor';

/** 超过此大小降级为 plaintext，关闭高级功能 */
const LARGE_FILE_THRESHOLD = 500 * 1024;
/** 超过此大小完全关闭语法高亮 */
const HUGE_FILE_THRESHOLD = 2 * 1024 * 1024;

/** 扩展名 → Monaco 语言标识 */
const CODE_LANGUAGES: Record<string, string> = {
    js: 'javascript', ts: 'typescript',
    jsx: 'javascript', tsx: 'typescript',
    json: 'json',
    yaml: 'yaml', yml: 'yaml',
    py: 'python',
    sh: 'shell', bash: 'shell',
    css: 'css', less: 'less', scss: 'scss',
    xml: 'xml', html: 'html', vue: 'html',
    sql: 'sql',
    java: 'java', go: 'go',
    rs: 'rust', c: 'c', cpp: 'cpp', h: 'c', hpp: 'cpp',
    php: 'php', rb: 'ruby',
    swift: 'swift', kt: 'kotlin', dart: 'dart',
    r: 'r', toml: 'ini', ini: 'ini', env: 'ini',
    dockerfile: 'dockerfile',
    txt: 'plaintext', log: 'plaintext',
    makefile: 'plaintext', gitignore: 'plaintext',
};

/** 根据文件名推断 Monaco 语言 */
function resolveLanguage(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return CODE_LANGUAGES[ext] || 'plaintext';
}

interface Props {
    /** 代码文件的访问 URL，组件内部 fetch 获取内容 */
    url: string;
    /** 文件名（含扩展名），用于推断语言和错误提示 */
    fileName?: string;
    /** 加载失败提示文本 */
    errorText?: string;
}

const props = withDefaults(defineProps<Props>(), {
    fileName: '',
    errorText: '代码加载失败',
});

const emit = defineEmits<{
    (e: 'error', error: Error): void;
}>();

const editorContainer = ref<HTMLDivElement | null>(null);
const loading = ref(false);
const monacoLoading = ref(true);
const errorMsg = ref('');

let monaco: typeof Monaco | null = null;
let editor: Monaco.editor.IStandaloneCodeEditor | null = null;
let initTimer: ReturnType<typeof setTimeout> | null = null;

/** 根据内容大小返回性能降级配置 */
function getLargeFileConfig(contentLength: number): Partial<Monaco.editor.IStandaloneEditorConstructionOptions> {
    if (contentLength > HUGE_FILE_THRESHOLD) {
        return {
            language: 'plaintext',
            folding: false,
            matchBrackets: 'never',
            occurrencesHighlight: 'off',
            selectionHighlight: false,
            renderWhitespace: 'none',
        };
    }
    if (contentLength > LARGE_FILE_THRESHOLD) {
        return { minimap: { enabled: false }, wordWrap: 'off' };
    }
    return {};
}

/** 初始化 Monaco Editor */
function initEditor(content: string) {
    if (!editorContainer.value || !monaco) return;
    disposeEditor();

    const largeConfig = getLargeFileConfig(content.length);
    const lang = (largeConfig as any).language || resolveLanguage(props.fileName);

    editor = monaco.editor.create(editorContainer.value, {
        value: content,
        language: lang,
        readOnly: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        fontSize: 13,
        lineNumbers: 'on',
        renderWhitespace: 'selection',
        wordWrap: 'on',
        scrollbar: {
            verticalScrollbarSize: 4,
            horizontalScrollbarSize: 4,
        },
        ...largeConfig,
    });
}

/** 销毁 Monaco 实例，释放内存 */
function disposeEditor() {
    if (editor) {
        editor.getModel()?.dispose();
        editor.dispose();
        editor = null;
    }
}

/** fetch 代码内容并初始化编辑器 */
async function loadCode(url: string) {
    loading.value = true;
    errorMsg.value = '';
    disposeEditor();

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();

        // 等待 Monaco 加载完成后再初始化编辑器
        if (monacoLoading.value) {
            // Monaco 还在加载，内容先缓存，等 onMounted 里初始化
            loading.value = false;
            // 通过 watch monacoLoading 触发初始化
            pendingContent = text;
            return;
        }

        loading.value = false;
        await nextTick();
        initTimer = setTimeout(() => initEditor(text), 100);
    } catch (e) {
        const err = e as Error;
        loading.value = false;
        errorMsg.value = props.errorText;
        emit('error', err);
    }
}

/** 暂存 Monaco 未就绪时 fetch 到的内容 */
let pendingContent: string | null = null;

onMounted(async () => {
    monaco = await loadMonaco();
    monacoLoading.value = false;

    // 如果内容已经 fetch 完毕，立即初始化
    if (pendingContent !== null) {
        const content = pendingContent;
        pendingContent = null;
        await nextTick();
        initTimer = setTimeout(() => initEditor(content), 100);
    }
});

watch(
    () => props.url,
    (newUrl) => {
        errorMsg.value = '';
        pendingContent = null;
        if (newUrl) {
            loadCode(newUrl);
        } else {
            disposeEditor();
        }
    },
    { immediate: true }
);

onUnmounted(() => {
    if (initTimer) clearTimeout(initTimer);
    disposeEditor();
});
</script>

<style scoped>
@import './preview-common.css';

.code-preview {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background: var(--td-bg-color-container);
}

.editor-container {
    width: 100%;
    height: 100%;
}

/* CodePreview 的 loading 使用绝对定位覆盖编辑器 */
.preview-loading {
    position: absolute;
    inset: 0;
    background: var(--td-bg-color-container);
    z-index: 1;
}

.error-filename {
    font-size: var(--td-font-size-link-small);
    color: rgba(1, 11, 50, 0.41);
    word-break: break-all;
    text-align: center;
    padding: 0 24px;
    margin: 0;
}
</style>
