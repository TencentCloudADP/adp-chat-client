<!-- 工具调用消息项：展示工具操作的图标、名称、标题、代码内容和状态，支持复制/查看和展开收起 -->
<script setup lang="ts">
import { ref, computed, inject, type Ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import type { Message } from '../../model/chat-v2';
import type { ThemeProps, ChatI18n } from '../../model/type';
import { themePropsDefaults, defaultChatI18n, defaultChatI18nEn } from '../../model/type';
import { copyToClipboard } from '../../utils/clipboard';
import CustomizedIcon from '../CustomizedIcon.vue';
import MdContent from '../Common/MdContent.vue';
import toolDefaultIcon from '../../assets/icons/tool-default-icon.png';
import toolSkillsIcon from '../../assets/icons/tool-skills-icon.png';

interface Props extends ThemeProps {
    /** 工具调用消息对象 */
    msg: Message;
    /** 当前语言标识 */
    language?: string;
    /** 国际化文本 */
    chatI18n?: ChatI18n;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    language: 'zh-CN',
    chatI18n: () => ({}),
});

const i18n = computed(() => {
    const defaults = props.language?.startsWith('en') ? defaultChatI18nEn : defaultChatI18n;
    return { ...defaults, ...props.chatI18n };
});

const emit = defineEmits<{
    (e: 'copy-success'): void;
    (e: 'copy-error'): void;
}>();

/** 注入上层提供的文件预览方法 */
const viewFile = inject<(filePath: string) => void>('viewFile');

/** 注入移动端标识 */
const isMobile = inject<Ref<boolean>>('isMobile', ref(false));

/** 工具名称 */
const toolName = computed(() => props.msg.ExtraInfo?.ToolName || '');

/** 操作名（如 "读取文件"、"搜索"） */
const operationLabel = computed(() => props.msg.Name || '');

/** 操作标题（如文件路径、搜索关键词、命令文本） */
const operationTitle = computed(() => props.msg.Title || '');

/** 工具分类 */
const toolCategory = computed(() => {
    const name = toolName.value;
    const fileTools = ['read', 'write', 'edit', 'glob', 'grep'];
    const searchTools = ['websearch', 'web_search'];
    const executeTools = ['bash'];
    const fetchTools = ['webfetch', 'web_fetch'];
    if (fileTools.includes(name)) return 'file';
    if (searchTools.includes(name)) return 'search';
    if (executeTools.includes(name)) return 'execute';
    if (fetchTools.includes(name)) return 'fetch';
    return 'default';
});

/** 是否为可查看的文件操作（有文件路径且完成状态） */
const isViewableFile = computed(() => {
    return toolCategory.value === 'file' && !!operationTitle.value && isDone.value && !!viewFile;
});

/** 工具图标：特定工具有对应 v-icon，通用/技能使用 PNG 图片 */
const iconMap: Record<string, { type: 'icon'; name: string } | { type: 'img'; src: string }> = {
    read: { type: 'icon', name: 'basic_password_on_line' },
    write: { type: 'icon', name: 'basic_file_line' },
    edit: { type: 'icon', name: 'basic_edit_line' },
    glob: { type: 'icon', name: 'basic_scan_line' },
    grep: { type: 'icon', name: 'basic_search_line' },
    websearch: { type: 'icon', name: 'basic_url_line' },
    web_search: { type: 'icon', name: 'basic_url_line' },
    webfetch: { type: 'icon', name: 'basic_url_line' },
    web_fetch: { type: 'icon', name: 'basic_url_line' },
    bash: { type: 'icon', name: 'base_server_fill' },
    skill: { type: 'img', src: toolSkillsIcon },
    skills: { type: 'img', src: toolSkillsIcon },
};

const toolIconConfig = computed(() => {
    return iconMap[toolName.value] || { type: 'img' as const, src: toolDefaultIcon };
});

const isImgIcon = computed(() => toolIconConfig.value.type === 'img');
const iconName = computed(() => (toolIconConfig.value as { name: string }).name || '');
const iconSrc = computed(() => (toolIconConfig.value as { src: string }).src || '');

/** 状态 */
const isProcessing = computed(() => props.msg.Status === 'processing');
const isError = computed(() => props.msg.Status === 'error' || props.msg.Status === 'failed');
const isDone = computed(() => props.msg.Status === 'done' || props.msg.Status === 'success');

/** 展开/收起状态 */
const isExpanded = ref(false);

/** 提取所有文本内容 */
const allText = computed(() => {
    if (!props.msg.Contents?.length) return '';
    const texts = props.msg.Contents
        .filter(c => c.Text && c.Text.length > 0)
        .map(c => c.Text);
    return texts.join('\n') || '';
});

/** 是否有可展示的内容 */
const hasContent = computed(() => allText.value.length > 0);

/**
 * 是否需要展示代码块
 * execute 和 default 类型工具有代码输出展示需求
 */
const showCodeBlock = computed(() => {
    const categories = ['execute', 'default'];
    return categories.includes(toolCategory.value) && hasContent.value;
});

/**
 * 是否可以展开（搜索/fetch 结果或通用工具内容）
 * execute/default 使用代码块展开，search/fetch 使用文本展开
 */
const canExpand = computed(() => {
    if (showCodeBlock.value) return true;
    if (['search', 'fetch'].includes(toolCategory.value) && hasContent.value && isDone.value) return true;
    return false;
});

function toggleExpand() {
    if (canExpand.value) {
        isExpanded.value = !isExpanded.value;
    }
}

/** 复制内容：优先复制内容文本，其次标题 */
const copyContent = computed(() => {
    return allText.value || operationTitle.value || operationLabel.value || toolName.value || '';
});

/** 复制按钮始终显示（只要有工具名或操作标签） */
const showCopy = computed(() => {
    return copyContent.value.length > 0;
});

/**
 * 本地降级复制方法
 * 当 copyToClipboard 工具函数在非安全上下文中失效时使用
 */
function fallbackCopy(text: string): boolean {
    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        const result = document.execCommand('copy');
        document.body.removeChild(textarea);
        return result;
    } catch {
        return false;
    }
}

async function handleCopy() {
    const content = copyContent.value;
    if (!content) return;
    let success = false;
    try {
        success = await copyToClipboard(content);
    } catch {
        success = false;
    }
    if (!success) {
        success = fallbackCopy(content);
    }
    if (success) {
        MessagePlugin.success(i18n.value.copySuccess);
        emit('copy-success');
    } else {
        MessagePlugin.error(i18n.value.copyFailed);
        emit('copy-error');
    }
}

/**
 * 打开文件预览
 */
function handleViewFile() {
    if (viewFile && operationTitle.value) {
        viewFile(operationTitle.value);
    }
}

/**
 * 代码块内容渲染：格式化为 markdown 代码块
 * 以便 MdContent 组件能正确高亮和显示
 */
const codeBlockContent = computed(() => {
    if (!allText.value) return '';
    const lang = detectLanguage();
    return '```' + lang + '\n' + allText.value + '\n```';
});

/** 搜索结果：将 URL 转为超链接的 HTML */
const searchResultHtml = computed(() => {
    if (!allText.value) return '';
    let html = allText.value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '<br>');

    const urlRegex = /(https?:\/\/[^\s<]+)/g;
    html = html.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="tool-call-item__link">$1</a>');
    return html;
});

/** 语言检测 */
function detectLanguage(): string {
    const cmd = operationTitle.value.toLowerCase();
    if (cmd.includes('python')) return 'python';
    if (cmd.includes('node') || cmd.includes('.js')) return 'javascript';
    if (cmd.includes('bash') || cmd.includes('sh ')) return 'shell';
    return 'plaintext';
}
</script>

<template>
    <div
        class="tool-call-item"
        :class="{
            'tool-call-item--error': isError,
            'tool-call-item--expandable': canExpand,
            'tool-call-item--expanded': isExpanded
        }"
    >
        <!-- 标题栏 -->
        <div class="tool-call-item__header" @click="toggleExpand">
            <div class="tool-call-item__header-left">
                <!-- 工具图标 -->
                <span class="tool-call-item__icon">
                    <img v-if="isImgIcon" :src="iconSrc" class="tool-call-item__icon-img" />
                    <CustomizedIcon v-else remote :name="iconName" :showHoverBg="false" size="xs" :theme="theme" />
                </span>
                <!-- 操作文本 -->
                <span class="tool-call-item__text">
                    <span v-if="operationLabel" class="tool-call-item__label">{{ operationLabel }}</span>
                    <span v-if="operationTitle" class="tool-call-item__title">{{ operationTitle }}</span>
                </span>
            </div>
            <div class="tool-call-item__header-right">
                <!-- 错误状态图标 -->
                <span v-if="isError" class="tool-call-item__error-badge">
                    <CustomizedIcon remote name="basic_close_line" :showHoverBg="false" size="xs" :theme="theme" />
                </span>
                <!-- 加载中动画 -->
                <span v-if="isProcessing" class="tool-call-item__spinner"></span>
                <!-- 查看按钮（文件工具完成时显示，移动端隐藏） -->
                <span
                    v-if="isViewableFile && !isProcessing && !isMobile"
                    class="tool-call-item__view-btn"
                    @click.stop="handleViewFile"
                >{{ i18n.view }}</span>
                <!-- 复制按钮（非文件工具时显示） -->
                <button
                    v-if="showCopy && !isProcessing && !isViewableFile"
                    type="button"
                    class="tool-call-item__copy-btn"
                    :title="i18n.copy"
                    @click.stop.prevent="handleCopy"
                >
                    <CustomizedIcon remote name="basic_copy_line" :showHoverBg="false" size="xs" :theme="theme" />
                </button>
                <!-- 展开/收起箭头 -->
                <span
                    v-if="canExpand"
                    class="tool-call-item__action-btn tool-call-item__toggle-btn"
                    @click.stop="toggleExpand"
                >
                    <CustomizedIcon remote
                        name="arrow_right_line"
                        :showHoverBg="false"
                        size="xs"
                        :theme="theme"
                        :class="{ 'tool-call-item__arrow--expanded': isExpanded }"
                        class="tool-call-item__arrow-icon"
                    />
                </span>
            </div>
        </div>

        <!-- 展开内容区域 -->
        <transition name="tool-expand">
            <div v-if="isExpanded && hasContent" class="tool-call-item__content">
                <!-- execute / default 类型：代码块展示（带语法高亮） -->
                <template v-if="showCodeBlock">
                    <div class="tool-call-item__code-wrapper">
                        <div class="tool-call-item__code-area">
                            <MdContent
                                :content="codeBlockContent"
                                role="assistant"
                                :theme="theme"
                                :language="language"
                            />
                        </div>
                    </div>
                </template>
                <!-- search / fetch 类型：文本结果（URL 自动转超链接） -->
                <template v-else>
                    <div class="tool-call-item__text-area">
                        <p v-html="searchResultHtml"></p>
                    </div>
                </template>
            </div>
        </transition>
    </div>
</template>

<style scoped>
/* ── 工具调用项 ── */
.tool-call-item {
    width: 100%;
    border-radius: var(--td-radius-medium);
    overflow: hidden;
}

.tool-call-item--expanded {
    border: 1px solid var(--td-component-border, #e7e7e7);
    background: var(--td-bg-color-container);
}

/* ── 头部 ── */
.tool-call-item__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--td-size-3) 10px;
    border-radius: var(--td-radius-default);
    user-select: none;
    transition: background 0.15s ease;
}

.tool-call-item--expandable .tool-call-item__header {
    cursor: pointer;
    background: var(--td-gray-color-0);
}

.tool-call-item--expandable .tool-call-item__header:hover {
    background: var(--td-bg-color-container-hover, #f3f3f3);
}

.tool-call-item__header-left {
    display: flex;
    align-items: center;
    gap: var(--td-size-3);
    min-width: 0;
    overflow: hidden;
    flex: 1;
}

.tool-call-item__header-right {
    display: flex;
    align-items: center;
    gap: var(--td-size-2);
    flex-shrink: 0;
    margin-left: var(--td-size-4);
}

/* ── 工具图标 ── */
.tool-call-item__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--td-text-color-placeholder);
}

.tool-call-item__icon-img {
    width: 16px;
    height: 16px;
    display: block;
}

/* ── 工具文本 ── */
.tool-call-item__text {
    display: flex;
    align-items: center;
    gap: var(--td-size-3);
    font-size: var(--td-font-size-link-small);
    line-height: 18px;
    min-width: 0;
    color: var(--td-text-color-placeholder);
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
}

.tool-call-item__label {
    flex-shrink: 0;
}

.tool-call-item__title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* ── 状态指示 ── */
.tool-call-item__error-badge {
    display: flex;
    align-items: center;
    color: var(--td-error-color, #e34d59);
}

.tool-call-item__spinner {
    width: 12px;
    height: 12px;
    border: 1.5px solid var(--td-brand-color-light, #bbd3fb);
    border-top-color: var(--td-brand-color, #0052d9);
    border-radius: var(--td-radius-circle);
    animation: tool-spin 0.8s linear infinite;
}

@keyframes tool-spin {
    to { transform: rotate(360deg); }
}

/* ── 操作按钮 ── */
.tool-call-item__action-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: var(--td-radius-small);
    cursor: pointer;
    color: var(--td-text-color-placeholder);
    transition: color 0.15s ease, background 0.15s ease;
    flex-shrink: 0;
}

.tool-call-item__action-btn:hover {
    color: var(--td-text-color-primary);
    background: var(--td-bg-color-container-hover, rgba(0, 0, 0, 0.04));
}

/* ── 查看按钮 ── */
.tool-call-item__view-btn {
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    font-size: var(--td-font-size-link-small);
    line-height: 16px;
    color: var(--td-text-color-placeholder);
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: color 0.15s ease;
}

.tool-call-item__view-btn:hover {
    color: var(--td-brand-color, #0052d9);
}

/* ── 复制按钮 ── */
.tool-call-item__copy-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 0;
    border: none;
    border-radius: var(--td-radius-small);
    cursor: pointer;
    color: var(--td-text-color-placeholder);
    background: transparent;
    transition: color 0.15s ease, background 0.15s ease;
    flex-shrink: 0;
    outline: none;
}

.tool-call-item__copy-btn:hover {
    color: var(--td-text-color-primary);
    background: var(--td-bg-color-container-hover, rgba(0, 0, 0, 0.04));
}

.tool-call-item__copy-btn :deep(.customeized-icon) {
    pointer-events: none;
}

/* ── 展开/收起箭头 ── */
.tool-call-item__arrow-icon {
    transition: transform 0.2s ease;
}

.tool-call-item__arrow--expanded {
    transform: rotate(90deg);
}

/* ── 展开内容 ── */
.tool-call-item__content {
    border-top: 1px solid var(--td-component-border, #e7e7e7);
    overflow: hidden;
}

/* ── 代码展示区域 ── */
.tool-call-item__code-wrapper {
    position: relative;
}

.tool-call-item__code-area {
    max-height: 200px;
    overflow-y: auto;
    font-size: var(--td-font-size-link-small);
    scrollbar-color: var(--td-scrollbar-color, rgba(0,0,0,.12)) transparent;
    scrollbar-width: thin;
}

.tool-call-item__code-area :deep(.md-content-container) {
    background: transparent;
    padding: 0;
}

.tool-call-item__code-area :deep(pre) {
    background: transparent;
    margin: 0;
    border-radius: 0;
    border: none;
}

.tool-call-item__code-area :deep(code) {
    background: transparent;
    font-size: var(--td-font-size-link-small);
    line-height: 18px;
}

.tool-call-item__code-area::-webkit-scrollbar {
    width: 4px;
    background: transparent;
}

.tool-call-item__code-area::-webkit-scrollbar-thumb {
    background-color: var(--td-scrollbar-color, rgba(0,0,0,.12));
    border-radius: var(--td-radius-small);
}

.tool-call-item__code-area::-webkit-scrollbar-thumb:hover {
    background-color: var(--td-scrollbar-hover-color, rgba(0,0,0,.2));
}

/* ── 文本结果区域 ── */
.tool-call-item__text-area {
    padding: var(--td-size-4) var(--td-size-5);
    font-size: var(--td-font-size-link-small);
    line-height: 1.6;
    color: var(--td-text-color-secondary);
    word-break: break-word;
    max-height: 200px;
    overflow-y: auto;
    scrollbar-color: var(--td-scrollbar-color, rgba(0,0,0,.12)) transparent;
    scrollbar-width: thin;
}

.tool-call-item__text-area::-webkit-scrollbar {
    width: 4px;
    background: transparent;
}

.tool-call-item__text-area::-webkit-scrollbar-thumb {
    background-color: var(--td-scrollbar-color, rgba(0,0,0,.12));
    border-radius: var(--td-radius-small);
}

.tool-call-item__text-area::-webkit-scrollbar-thumb:hover {
    background-color: var(--td-scrollbar-hover-color, rgba(0,0,0,.2));
}

.tool-call-item__text-area p {
    margin: 0;
}

.tool-call-item__text-area :deep(.tool-call-item__link) {
    color: var(--td-brand-color, #0052d9);
    text-decoration: underline;
}

.tool-call-item__text-area :deep(.tool-call-item__link:hover) {
    opacity: 0.8;
}

/* ── 展开/收起动画 ── */
.tool-expand-enter-active,
.tool-expand-leave-active {
    transition: all 0.2s ease;
    max-height: 220px;
    opacity: 1;
}

.tool-expand-enter-from,
.tool-expand-leave-to {
    max-height: 0;
    opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
    .tool-call-item__spinner {
        animation: none;
    }
    .tool-expand-enter-active,
    .tool-expand-leave-active {
        transition: none;
    }
}
</style>
