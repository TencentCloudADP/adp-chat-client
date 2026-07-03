<!-- 可折叠消息组：将连续的 tool_call/thought 消息折叠为一行摘要 -->
<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import type { Message } from '../../model/chat-v2';
import type { ThemeProps, ChatI18n } from '../../model/type';
import { themePropsDefaults, defaultChatI18n, defaultChatI18nEn } from '../../model/type';
import CustomizedIcon from '../CustomizedIcon.vue';
import MdContent from '../Common/MdContent.vue';
import ToolCallItem from './ToolCallItem.vue';

export type CollapseKind = 'mixed' | 'search' | 'thought' | 'tools' | 'read' | 'write';

interface Props extends ThemeProps {
    /** 折叠分类 */
    kind: CollapseKind;
    /** 被折叠的消息列表 */
    messages: Message[];
    /** 是否处于流式输出中 */
    isStreaming?: boolean;
    /** 是否任务终止（无后续 reply） */
    isTerminated?: boolean;
    /** 当前语言标识 */
    language?: string;
    /** 国际化文本 */
    i18n?: ChatI18n;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    messages: () => [],
    isStreaming: false,
    isTerminated: false,
    language: 'zh-CN',
    i18n: () => ({}),
});

const mergedI18n = computed(() => {
    const defaults = props.language?.startsWith('en') ? defaultChatI18nEn : defaultChatI18n;
    return { ...defaults, ...props.i18n };
});

const expanded = ref(false);

const isExpanded = computed(() => expanded.value);

// 每条 thought 消息的展开状态
const thoughtExpandedMap = reactive<Record<string, boolean>>({});

function getThoughtExpanded(msgId: string): boolean {
    return thoughtExpandedMap[msgId] ?? false;
}
function toggleThought(msgId: string) {
    thoughtExpandedMap[msgId] = !(thoughtExpandedMap[msgId] ?? false);
}

const count = computed(() => (props.messages || []).length);

/**
 * 根据 ToolName 返回工具分类
 */
function getToolCategory(toolName: string): string {
    const fileTools = ['read', 'write', 'edit', 'glob', 'grep'];
    const searchTools = ['websearch', 'web_search'];
    if (fileTools.includes(toolName)) return 'file';
    if (searchTools.includes(toolName)) return 'search';
    return 'tool';
}

/**
 * 判定单条消息的折叠子分类
 */
function getMsgSubKind(msg: Message): string {
    const toolName = msg.ExtraInfo?.ToolName || '';
    if (toolName === 'write' || toolName === 'edit') return 'write';
    if (toolName === 'read' || toolName === 'grep' || toolName === 'glob') return 'read';
    if (getToolCategory(toolName) === 'search') return 'search';
    return 'tools';
}

/** 替换 {count} 占位符 */
function fmt(template: string, count: number | string): string {
    return template.replace('{count}', String(count));
}

/**
 * 生成 mixed 类型折叠组的标题
 */
function getMixedTitle(streaming: boolean): string {
    const msgs = props.messages || [];
    const t = mergedI18n.value;

    if (streaming) {
        let lastNonThought: Message | null = null;
        for (let i = msgs.length - 1; i >= 0; i--) {
            if (msgs[i]!.Type !== 'thought') {
                lastNonThought = msgs[i] ?? null;
                break;
            }
        }
        if (!lastNonThought) return t.collapseThinking!;
        const toolName = lastNonThought.ExtraInfo?.ToolName || '';
        if (toolName === 'write' || toolName === 'edit') return t.collapseWritingFiles!;
        if (toolName === 'read' || toolName === 'grep' || toolName === 'glob') return t.collapseReadingFiles!;
        if (getToolCategory(toolName) === 'search') return t.collapseSearching!;
        return t.collapseCallingTools!;
    }

    let writeCount = 0;
    let readCount = 0;
    let searchCount = 0;
    let toolsCount = 0;

    msgs.forEach(msg => {
        if (msg.Type === 'thought') return;
        if (msg.Type !== 'tool_call' && msg.Type !== 'task_execution') return;
        const subKind = getMsgSubKind(msg);
        if (subKind === 'write') writeCount++;
        else if (subKind === 'read') readCount++;
        else if (subKind === 'search') searchCount++;
        else toolsCount++;
    });

    const parts: string[] = [];
    if (writeCount > 0) parts.push(fmt(t.collapseWroteFiles!, writeCount));
    if (readCount > 0) parts.push(fmt(t.collapseReadFiles!, readCount));
    if (searchCount > 0) parts.push(t.collapseSearched!);
    if (toolsCount > 0) parts.push(fmt(t.collapseCalledTools!, toolsCount));

    if (parts.length === 0) return t.collapseThinking!;
    const sep = props.language?.startsWith('en') ? ', ' : '，';
    return parts.join(sep);
}

/** 折叠标题文本 */
const titleText = computed(() => {
    const t = mergedI18n.value;
    if (props.isTerminated) return t.taskTerminated!;
    const streaming = props.isStreaming;

    if (props.kind === 'mixed') return getMixedTitle(streaming);

    switch (props.kind) {
    case 'search':
        return streaming ? t.collapseSearching! : t.collapseSearched!;
    case 'thought':
        return t.collapseThinking!;
    case 'tools':
        return streaming ? t.collapseCallingTools! : fmt(t.collapseCalledTools!, count.value);
    case 'read':
        return streaming ? t.collapseReadingFiles! : fmt(t.collapseReadFiles!, count.value);
    case 'write':
        return streaming ? t.collapseWritingFiles! : fmt(t.collapseWroteFiles!, count.value);
    default:
        return '';
    }
});

function toggle() {
    expanded.value = !expanded.value;
}

/**
 * 提取消息的文本内容
 */
function extractText(msg: Message): string {
    if (!msg.Contents?.length) return '';
    return msg.Contents
        .map(c => c.Text || '')
        .filter(t => t.length > 0)
        .join('\n');
}
</script>

<template>
    <div
        class="collapsible-group"
        :class="{
            'collapsible-group--collapsed': !isExpanded,
            'collapsible-group--streaming': isStreaming
        }"
    >
        <!-- 标题栏 -->
        <div class="collapsible-group__header" @click="toggle">
            <span class="collapsible-group__arrow" :class="{ 'collapsible-group__arrow--expanded': isExpanded }">
                <CustomizedIcon remote name="arrow_up_small_line" :showHoverBg="false" size="xs" :theme="theme" />
            </span>
            <span class="collapsible-group__title">{{ titleText }}</span>
            <span v-if="isStreaming" class="collapsible-group__loading-dot"></span>
        </div>

        <!-- 展开后的内容区域 -->
        <div v-show="isExpanded" class="collapsible-group__content">
            <template v-for="(msg, idx) in messages" :key="msg.MessageId || ('cg-' + idx)">
                <!-- tool_call / task_execution 类型：使用独立的工具渲染组件 -->
                <ToolCallItem
                    v-if="msg.Type === 'tool_call' || msg.Type === 'task_execution'"
                    :msg="msg"
                    :theme="theme"
                    :language="language"
                    class="collapsible-group__tool-item"
                />
                <!-- thought 类型：可折叠的思考内容，样式与外层深度思考一致 -->
                <div v-else-if="msg.Type === 'thought'" class="collapsible-group__thought">
                    <div
                        class="collapsible-group__thought-header"
                        @click="toggleThought(msg.MessageId || '')"
                    >
                        <CustomizedIcon
                            remote
                            name="arrow_up_small_line"
                            :showHoverBg="false"
                            size="xs"
                            :theme="theme"
                            class="collapsible-group__thought-arrow"
                            :class="{ 'collapsible-group__thought-arrow--expanded': getThoughtExpanded(msg.MessageId || '') }"
                        />
                        <span class="collapsible-group__thought-label">{{ mergedI18n.collapseDeepThinking }}</span>
                    </div>
                    <div
                        v-if="extractText(msg) && getThoughtExpanded(msg.MessageId || '')"
                        class="collapsible-group__thought-content"
                    >
                        <MdContent
                            :content="extractText(msg)"
                            role="assistant"
                            :theme="theme"
                            :language="language"
                        />
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
/* ── 折叠组容器 ── */
.collapsible-group {
    width: 100%;
    border-radius: 8px;
}

/* ── 标题栏 ── */
.collapsible-group__header {
    display: flex;
    align-items: center;
    gap: var(--td-comp-margin-xs);
    user-select: none;
    padding: var(--td-comp-paddingTB-xxs) 4px;
    border-radius: var(--td-radius-default);
    cursor: pointer;
    transition: background-color 0.15s ease;
}

.collapsible-group__header:hover {
    background: var(--td-bg-color-container-hover);
}

.collapsible-group__title {
    font-size: var(--td-font-size-link-small);
    font-weight: 400;
    line-height: var(--td-line-height-link-small);
    color: var(--td-text-color-placeholder);
}

.collapsible-group__arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--td-size-6);
    height: var(--td-size-6);
    transition: transform 0.2s ease;
    transform: rotate(90deg);
    flex-shrink: 0;
}

.collapsible-group__arrow--expanded {
    transform: rotate(180deg);
}

/* ── 展开内容 ── */
.collapsible-group__content {
    margin-top: var(--td-comp-margin-xs);
    padding-left: var(--td-comp-paddingLR-l);
    display: flex;
    flex-direction: column;
    gap: var(--td-comp-margin-xxs);
}

/* ── 思考折叠项 ── */
.collapsible-group__thought-header {
    color: var(--td-text-color-placeholder);
    display: flex;
    align-items: center;
    gap: var(--td-comp-margin-xs);
    padding: var(--td-comp-paddingTB-xxs) var(--td-comp-paddingLR-s);
    border-radius: var(--td-radius-default);
    cursor: pointer;
    font-size: var(--td-font-size-link-small);
    line-height: 18px;
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    transition: background 0.15s ease;
}

.collapsible-group__thought-header:hover {
    background: var(--td-bg-color-container-hover);
}

.collapsible-group__thought-arrow {
    transform: rotate(90deg);
    transition: transform 0.2s ease;
    flex-shrink: 0;
}

.collapsible-group__thought-arrow--expanded {
    transform: rotate(180deg);
}

.collapsible-group__thought-content {
    font-size: var(--td-font-size-body-small);
    color: var(--td-text-color-secondary);
    padding: 0 var(--td-comp-paddingLR-s);
}

.collapsible-group__thought-content :deep(.markdown-body) {
    font-size: var(--td-font-size-link-small);
}

/* ── Loading dot ── */
.collapsible-group__loading-dot {
    display: inline-block;
    width: var(--td-size-3);
    height: var(--td-size-3);
    border-radius: 50%;
    background: var(--td-brand-color);
    margin-left: var(--td-comp-margin-xs);
    animation: pulse-dot 1.4s ease-in-out infinite;
}

@keyframes pulse-dot {
    0%, 100% { opacity: 0.25; transform: scale(0.85); }
    50% { opacity: 1; transform: scale(1.15); }
}

@media (prefers-reduced-motion: reduce) {
    .collapsible-group__loading-dot {
        animation: none;
        opacity: 0.6;
    }
    .collapsible-group__arrow,
    .collapsible-group__thought-arrow {
        transition: none;
    }
}
</style>
