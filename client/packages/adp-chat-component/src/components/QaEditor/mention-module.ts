/**
 * @module mention-module
 * @description wangEditor 自定义 mention 模块
 *
 * 将 @ mention 标签作为 inline void 元素插入编辑器：
 * - renderElem：使用 snabbdom h() 渲染 mention 节点（图标 + 文本 + 关闭按钮）
 * - elemToHtml：将 mention 节点序列化为 HTML（用于 getHtml）
 * - parseElemHtml：从 HTML 反序列化为 mention 节点（用于 setHtml / dangerouslyInsertHtml）
 * - editorPlugin：重写 isInline / isVoid 使 mention 成为行内不可编辑元素
 *
 * Slate 节点结构：
 * {
 *   type: 'mention',
 *   mentionType: 'skills' | 'connectors' | 'tools',
 *   mentionId: string,
 *   mentionName: string,         // 技术名（序列化用）
 *   mentionDisplayName: string,  // 中文展示名（chip 文本用）
 *   displayLabel: string,        // 类目前缀文案，如 "技能"
 *   children: [{ text: '' }]     // void 元素必须有空 text children
 * }
 */

import { Boot, SlateTransforms, SlateNode } from '@wangeditor/editor'
import type { IDomEditor } from '@wangeditor/editor'
import { h, type VNode } from 'snabbdom'

/** mention Slate 节点结构 */
export interface MentionElement {
    type: 'mention'
    mentionType: string
    mentionId: string
    mentionName: string
    mentionDisplayName: string
    displayLabel: string
    children: { text: string }[]
}

/** 全局注册标记，保证幂等 */
const REGISTER_FLAG = '__adpMentionModuleRegistered'

/**
 * 把 panel 的分类 key 映射为图标修饰符类名
 * skills → skills，tools → plugins，connectors → connectors
 */
function getIconModifier(mentionType: string): string {
    if (mentionType === 'tools') return 'plugins'
    if (mentionType === 'connectors') return 'connectors'
    return 'skills'
}

// ======================== 渲染（Slate → snabbdom VNode）========================

/**
 * 通过 Slate API 删除指定 mention 节点（编辑器内删除 chip 用）
 */
function removeMentionNode(editor: IDomEditor, elemNode: MentionElement): void {
    try {
        for (const [node, path] of SlateNode.elements(editor)) {
            const n = node as unknown as MentionElement
            if (n.type === 'mention' && n.mentionId === elemNode.mentionId) {
                SlateTransforms.removeNodes(editor, { at: path })
                return
            }
        }
    } catch (e) {
        console.warn('[mention-module] removeMentionNode error:', e)
    }
}

/**
 * 将 mention Slate 节点渲染为 snabbdom VNode
 */
function renderMention(elemNode: MentionElement, _children: VNode[] | null, editor: IDomEditor): VNode {
    const { mentionType, mentionId, mentionName, mentionDisplayName, displayLabel } = elemNode
    const iconModifier = getIconModifier(mentionType)
    const showName = mentionDisplayName || mentionName
    const textContent = displayLabel ? `${displayLabel} ${showName}` : showName

    const iconVNode = h('span', {
        props: { className: `at-mention-tag__icon at-mention-tag__icon--${iconModifier}` },
    })

    const textVNode = h(
        'span',
        { props: { className: 'at-mention-tag__text' } },
        textContent
    )

    const closeVNode = h('span', {
        props: { className: 'at-mention-tag__close' },
        dataset: { mentionClose: mentionId },
        on: {
            click(event: Event) {
                event.preventDefault()
                event.stopPropagation()
                removeMentionNode(editor, elemNode)
            },
        },
    })

    return h(
        'span',
        {
            props: {
                contentEditable: false,
                className: 'at-mention-tag',
            },
            dataset: {
                wEType: 'mention',
                mentionType,
                mentionId,
                mentionName,
            },
        },
        [iconVNode, textVNode, closeVNode]
    )
}

const renderMentionConf = {
    type: 'mention',
    renderElem: renderMention as unknown as (elemNode: SlateNode, children: VNode[] | null, editor: IDomEditor) => VNode,
}

// ======================== 序列化（Slate → HTML）========================

/**
 * 将 mention 节点转为 HTML 字符串（用于 getHtml）
 */
function mentionToHtml(elem: MentionElement): string {
    const { mentionType, mentionId, mentionName, mentionDisplayName, displayLabel } = elem
    const iconModifier = getIconModifier(mentionType)
    const showName = mentionDisplayName || mentionName
    const textContent = displayLabel ? `${displayLabel} ${showName}` : showName
    const displayNameAttr = mentionDisplayName
        ? ` data-mention-display-name="${encodeURIComponent(mentionDisplayName)}"`
        : ''
    return (
        `<span data-w-e-type="mention" data-mention-type="${mentionType}" data-mention-id="${encodeURIComponent(mentionId)}" data-mention-name="${encodeURIComponent(mentionName)}" data-display-label="${encodeURIComponent(displayLabel || '')}"${displayNameAttr} class="at-mention-tag" contenteditable="false">` +
        `<span class="at-mention-tag__icon at-mention-tag__icon--${iconModifier}"></span>` +
        `<span class="at-mention-tag__text">${escapeHtmlText(textContent)}</span>` +
        '</span>'
    )
}

const mentionToHtmlConf = {
    type: 'mention',
    elemToHtml: mentionToHtml as unknown as (elem: SlateNode, childrenHtml: string) => string,
}

// ======================== 反序列化（HTML → Slate）========================

/**
 * 从 HTML DOM 元素解析出 mention Slate 节点
 */
function parseMentionHtml($elem: Element): MentionElement {
    const mentionType = $elem.getAttribute('data-mention-type') || 'skills'
    const mentionId = decodeURIComponent($elem.getAttribute('data-mention-id') || '')
    const mentionName = decodeURIComponent($elem.getAttribute('data-mention-name') || '')
    const mentionDisplayName = decodeURIComponent($elem.getAttribute('data-mention-display-name') || '')
    const displayLabel = decodeURIComponent($elem.getAttribute('data-display-label') || '')

    return {
        type: 'mention',
        mentionType,
        mentionId,
        mentionName,
        mentionDisplayName,
        displayLabel,
        children: [{ text: '' }],
    }
}

const parseMentionHtmlConf = {
    selector: 'span[data-w-e-type="mention"]',
    parseElemHtml: parseMentionHtml as unknown as (
        $elem: Element,
        children: SlateNode[],
        editor: IDomEditor
    ) => SlateNode,
}

// ======================== 编辑器插件（inline + void）========================

function withMention<T extends IDomEditor>(editor: T): T {
    const { isInline, isVoid } = editor
    const e = editor

    e.isInline = (elem) => {
        if ((elem as unknown as MentionElement).type === 'mention') return true
        return isInline(elem)
    }

    e.isVoid = (elem) => {
        if ((elem as unknown as MentionElement).type === 'mention') return true
        return isVoid(elem)
    }

    return e
}

// ======================== HTML 转义 ========================

function escapeHtmlText(str: string): string {
    if (str === undefined || str === null) return ''
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

// ======================== 导出模块 ========================

const mentionModule = {
    renderElems: [renderMentionConf],
    elemsToHtml: [mentionToHtmlConf],
    parseElemsHtml: [parseMentionHtmlConf],
    editorPlugin: withMention,
}

/**
 * 全局注册 mention 模块（幂等，必须在 createEditor 之前调用）
 */
export function registerMentionModule(): void {
    if (typeof window === 'undefined') return
    const w = window as unknown as Record<string, unknown>
    if (w[REGISTER_FLAG]) return
    try {
        Boot.registerModule(mentionModule)
        w[REGISTER_FLAG] = true
    } catch (e) {
        console.warn('[mention-module] register error:', e)
    }
}

/**
 * 将编辑器 Slate 树序列化为带 mention 内联标记的纯文本
 * - mention(skills)     → @skill:name
 * - mention(tools/connectors) → @tool:name
 * - image               → ![](src)
 * - 其余文本原样输出，块级节点之间用 \n 连接
 */
export function serializeMentionToInlineText(editor: IDomEditor): string {
    const root = editor as unknown as { children?: SlateNode[] }
    if (!root.children) return ''

    const getPrefix = (mentionType: string): string => {
        if (mentionType === 'skills') return '@skill'
        return '@tool'
    }

    const serializeNode = (node: SlateNode): string => {
        const n = node as unknown as Record<string, unknown>
        if (n.text !== undefined) {
            return String(n.text)
        }
        if (n.type === 'mention') {
            const m = node as unknown as MentionElement
            const prefix = getPrefix(m.mentionType)
            const nameForSerialization = m.mentionName || m.mentionDisplayName || ''
            const safeName = String(nameForSerialization).replace(/\s+/g, (s) => encodeURIComponent(s))
            return `${prefix}:${safeName} `
        }
        if (n.type === 'image') {
            const src = (n.src || n.href || '') as string
            return src ? `![](${src})` : ''
        }
        const children = (n.children || []) as SlateNode[]
        return children.map(serializeNode).join('')
    }

    return root.children.map(serializeNode).join('\n').trim()
}

// ======================== 反向序列化（内联文本 → chip HTML）========================

/** 已注册的 mention 项（用于在反向解析时把英文 name 还原为中文 displayName） */
export interface RegisteredMentionItem {
    /** 英文/技术名，对应 @skill:xxx / @tool:xxx 中的 xxx */
    name: string
    /** 中文展示名 */
    displayName?: string
    /** 唯一 ID（可选） */
    id?: string
}

/**
 * 反向序列化所需的上下文配置
 * skills/tools 用于把内联文本中的 @skill:name / @tool:name 还原为中文 chip
 */
export interface InlineTextToMentionOptions {
    /** 已注册 skills 列表（来自面板数据） */
    skills?: RegisteredMentionItem[]
    /** 已注册 tools/connectors 列表（合并） */
    tools?: RegisteredMentionItem[]
    /** 类目前缀文案，如 { skills: '技能', tools: '工具' } */
    labels?: { skills?: string; tools?: string }
}

/** 构造 name → displayName 的映射 */
function buildMentionNameMap(items?: RegisteredMentionItem[]): Record<string, string> {
    const map: Record<string, string> = Object.create(null)
    if (!items) return map
    for (const item of items) {
        if (!item || !item.name) continue
        map[item.name] = item.displayName || item.name
    }
    return map
}

/**
 * 拼装 chip HTML 片段，与 mentionToHtml 输出结构保持一致，
 * 以便后续可被 parseMentionHtml 反序列化（如塞入编辑器）。
 */
function buildMentionChipHtml(opts: {
    mentionType: string
    mentionId: string
    mentionName: string
    mentionDisplayName: string
    displayLabel: string
}): string {
    const { mentionType, mentionId, mentionName, mentionDisplayName, displayLabel } = opts
    const iconModifier = getIconModifier(mentionType)
    const showName = mentionDisplayName || mentionName
    const textContent = displayLabel ? `${displayLabel} ${showName}` : showName
    const safeId = encodeURIComponent(mentionId || '')
    const safeName = encodeURIComponent(mentionName || '')
    const safeLabel = encodeURIComponent(displayLabel || '')
    const displayNameAttr = mentionDisplayName
        ? ` data-mention-display-name="${encodeURIComponent(mentionDisplayName)}"`
        : ''
    return (
        `<span data-w-e-type="mention" data-mention-type="${mentionType}" data-mention-id="${safeId}" data-mention-name="${safeName}" data-display-label="${safeLabel}"${displayNameAttr} class="at-mention-tag" contenteditable="false">` +
        `<span class="at-mention-tag__icon at-mention-tag__icon--${iconModifier}"></span>` +
        `<span class="at-mention-tag__text">${escapeHtmlText(textContent)}</span>` +
        '</span>'
    )
}

/**
 * 把 "已序列化的内联文本" 反向解析为含 chip HTML 的字符串：
 * - @skill:name → 蓝色 skill chip
 * - @tool:name  → 蓝色 tool chip
 *
 * 解析规则：
 * - 优先在 skills/tools 注册表中按最长前缀匹配名字，命中则用其中文 displayName 做展示，
 *   未匹配的部分回退到原始 name；
 * - 未注册的 name 仍会渲染为 chip，文本直接显示英文 name；
 * - 其它字符按原样保留并做 HTML 转义。
 *
 * 适用场景：用户消息气泡中把后端回显的文本内联标记转换为蓝色 chip 展示。
 */
export function inlineTextToMentionHtml(text: string, opts: InlineTextToMentionOptions = {}): string {
    if (!text || typeof text !== 'string') return ''

    const skillMap = buildMentionNameMap(opts.skills)
    const toolMap = buildMentionNameMap(opts.tools)
    const labelSkill = opts.labels?.skills || ''
    const labelTool = opts.labels?.tools || ''

    // 注册名按长度降序，便于做最长前缀匹配（避免 "foo" 把 "foobar" 截断成 "foo"）
    const skillNames = Object.keys(skillMap).sort((a, b) => b.length - a.length)
    const toolNames = Object.keys(toolMap).sort((a, b) => b.length - a.length)

    // @tool/@skill 的通用正则：name 可包含字母数字下划线、'-'、'/'、'.'，遇到空白/中文/@ 等终止
    const TAG_REGEX = /@(skill|tool):([^\s@<>]+)/g

    const out: string[] = []
    let lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = TAG_REGEX.exec(text)) !== null) {
        const matchStart = m.index
        const rawType = m[1] || ''
        let name = m[2] || ''
        let matchEnd = matchStart + m[0].length

        // 最长前缀匹配，把多余字符回退到外层文本
        const candidates = rawType === 'skill' ? skillNames : rawType === 'tool' ? toolNames : []
        if (candidates.length) {
            const hit = candidates.find((n) => name.startsWith(n))
            if (hit && hit.length < name.length) {
                const prefixLen = m[0].indexOf(':') + 1
                matchEnd = matchStart + prefixLen + hit.length
                name = hit
            }
        }

        // 先输出 chip 前的纯文本（转义）
        if (matchStart > lastIndex) {
            out.push(escapeHtmlText(text.slice(lastIndex, matchStart)))
        }

        const mentionType = rawType === 'skill' ? 'skills' : 'tools'
        const map = rawType === 'skill' ? skillMap : toolMap
        const mentionDisplayName = map[name] || ''
        const displayLabel = rawType === 'skill' ? labelSkill : labelTool

        out.push(
            buildMentionChipHtml({
                mentionType,
                mentionId: '',
                mentionName: name,
                mentionDisplayName,
                displayLabel,
            }),
        )
        lastIndex = matchEnd
    }
    if (lastIndex < text.length) {
        out.push(escapeHtmlText(text.slice(lastIndex)))
    }
    return out.join('')
}

export default mentionModule
