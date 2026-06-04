<!-- 可折叠消息组：将连续的 tool_call/thought 消息折叠为一行摘要 -->
<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import type { Message } from '../../model/chat-v2';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
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
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    messages: () => [],
    isStreaming: false,
    isTerminated: false,
    language: 'zh-CN',
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

/** 国际化文本 */
const t = (key: string, params?: Record<string, string | number>) => {
    const isEn = props.language?.startsWith('en');
    const map: Record<string, string> = isEn ? {
        '任务终止': 'Task terminated',
        '网络搜索中': 'Searching...',
        '搜索了网页': 'Searched the web',
        '思考中': 'Thinking...',
        '思考': 'Thinking',
        '调用工具中': 'Calling tools...',
        '调用了{0}次工具': `Called tools ${params?.['0'] || ''} time(s)`,
        '读写文件中': 'Reading files...',
        '读取了{0}个文件': `Read ${params?.['0'] || ''} file(s)`,
        '修改文件中': 'Writing files...',
        '修改了{0}个文件': `Modified ${params?.['0'] || ''} file(s)`,
    } : {
        '任务终止': '任务终止',
        '网络搜索中': '网络搜索中',
        '搜索了网页': '搜索了网页',
        '思考中': '思考中',
        '思考': '思考',
        '调用工具中': '调用工具中',
        '调用了{0}次工具': `调用了${params?.['0'] || ''}次工具`,
        '读写文件中': '读写文件中',
        '读取了{0}个文件': `读取了${params?.['0'] || ''}个文件`,
        '修改文件中': '修改文件中',
        '修改了{0}个文件': `修改了${params?.['0'] || ''}个文件`,
    };
    return map[key] || key;
};

/**
 * 生成 mixed 类型折叠组的标题
 */
function getMixedTitle(streaming: boolean): string {
    const msgs = props.messages || [];

    if (streaming) {
        let lastNonThought: Message | null = null;
        for (let i = msgs.length - 1; i >= 0; i--) {
            if (msgs[i]!.Type !== 'thought') {
                lastNonThought = msgs[i] ?? null;
                break;
            }
        }
        if (!lastNonThought) return t('思考中');
        const toolName = lastNonThought.ExtraInfo?.ToolName || '';
        if (toolName === 'write' || toolName === 'edit') return t('修改文件中');
        if (toolName === 'read' || toolName === 'grep' || toolName === 'glob') return t('读写文件中');
        if (getToolCategory(toolName) === 'search') return t('网络搜索中');
        return t('调用工具中');
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
    if (writeCount > 0) parts.push(t('修改了{0}个文件', { '0': writeCount }));
    if (readCount > 0) parts.push(t('读取了{0}个文件', { '0': readCount }));
    if (searchCount > 0) parts.push(t('搜索了网页'));
    if (toolsCount > 0) parts.push(t('调用了{0}次工具', { '0': toolsCount }));

    if (parts.length === 0) return t('思考中');
    return parts.join('，');
}

/** 折叠标题文本 */
const titleText = computed(() => {
    if (props.isTerminated) return t('任务终止');
    const streaming = props.isStreaming;

    if (props.kind === 'mixed') return getMixedTitle(streaming);

    switch (props.kind) {
    case 'search':
        return streaming ? t('网络搜索中') : t('搜索了网页');
    case 'thought':
        return t('思考中');
    case 'tools':
        return streaming ? t('调用工具中') : t('调用了{0}次工具', { '0': count.value });
    case 'read':
        return streaming ? t('读写文件中') : t('读取了{0}个文件', { '0': count.value });
    case 'write':
        return streaming ? t('修改文件中') : t('修改了{0}个文件', { '0': count.value });
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
                        <span class="collapsible-group__thought-label">{{ t('深度思考') }}</span>
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
.collapsible-group {
    width: 100%;
    border-radius: 6px;
}

.collapsible-group__header {
    display: flex;
    align-items: center;
    gap: 4px;
    user-select: none;
    padding: 4px;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.collapsible-group__header:hover {
    background: var(--td-bg-color-container-hover, #f3f3f3);
}

.collapsible-group__title {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    color: var(--td-text-color-placeholder);
}

.collapsible-group__arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    transition: transform 0.2s ease;
     transform: rotate(90deg);
}

.collapsible-group__arrow--expanded {
    transform: rotate(180deg);
}

.collapsible-group__content {
    margin-top: 4px;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.collapsible-group__tool-item {
}

/* thought 折叠项：与外层深度思考样式一致 */
.collapsible-group__thought {
}

.collapsible-group__thought-header {
    color: var(--td-text-color-placeholder);
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    line-height: 18px;
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    transition: background 0.2s ease;
}

.collapsible-group__thought-header:hover {
    background: var(--td-bg-color-container-hover, #f3f3f3);
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
    font-size: 13px;
    color: var(--td-text-color-secondary);
    padding: 0 8px;
}

.collapsible-group__thought-content :deep(.markdown-body) {
    font-size: 12px;
}

.collapsible-group__loading-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--td-brand-color, #0052d9);
    margin-left: 4px;
    animation: pulse-dot 1.2s ease-in-out infinite;
}

@keyframes pulse-dot {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
}
</style>
