<!--
 @module QaEditor
 @description 基于 wangEditor 的富文本编辑器组件，支持图片粘贴、字数限制、只读模式
-->
<template>
    <div :class="['qa-editor', { 'qa-editor--no-toolbar': hideToolBar, 'qa-editor--disabled': disabled || readOnly, 'qa-editor--dark': theme === 'dark' }]">
        <div v-if="!readOnly && !hideToolBar" class="qa-editor__toolbar" ref="toolbarRef"></div>
        <div class="qa-editor__editor" ref="editorRef"></div>
    </div>
</template>

<script setup lang="ts">
import {
    ref,
    shallowRef,
    onMounted,
    onBeforeUnmount,
    watch,
    nextTick,
    computed
} from 'vue'
import { createEditor, createToolbar } from '@wangeditor/editor'
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { registerMentionModule, serializeMentionToInlineText } from './mention-module'

// 注册 mention 自定义模块（必须在 createEditor 之前，且全局只注册一次）
registerMentionModule()

export interface QaEditorProps {
    /** 输入内容（HTML） */
    value?: string
    /** 字数上限 */
    parseLimit?: number
    /** 占位文本 */
    placeholder?: string
    /** 是否只读 */
    readOnly?: boolean
    /** 是否禁用 */
    disabled?: boolean
    /** 是否隐藏工具栏 */
    hideToolBar?: boolean
    /** 允许的图片类型（扩展名，如 .jpg,.png） */
    acceptImgType?: string
    /** 是否允许粘贴图片 */
    allowPasteImage?: boolean
    /** 主题，'dark' 时深色模式 */
    theme?: string
}

const props = withDefaults(defineProps<QaEditorProps>(), {
    value: '',
    parseLimit: 12000,
    placeholder: '请输入内容',
    readOnly: false,
    disabled: false,
    hideToolBar: true,
    acceptImgType: '.jpg,.png,.jpeg,.bmp,.webp',
    allowPasteImage: true,
    theme: ''
})

const emit = defineEmits<{
    (e: 'update:value', val: string): void
    (e: 'input', val: string): void
    (e: 'focus'): void
    (e: 'blur'): void
}>()

const editorRef = ref<HTMLDivElement | null>(null)
const toolbarRef = ref<HTMLDivElement | null>(null)
const editor = shallowRef<IDomEditor | null>(null)
const curValue = ref('')

/* 粘贴限制 */
const PASTE_MAX_LENGTH = 102400

const editorConfig: Partial<IEditorConfig> = {
    placeholder: props.placeholder,
    readOnly: props.readOnly || props.disabled,
    hoverbarKeys: {
        link: { menuKeys: ['editLink', 'unLink'] },
        image: { menuKeys: [] }
    },
    MENU_CONF: {
        uploadImage: {
            customUpload: handleImageUpload
        }
    }
}

const toolbarConfig: Partial<IToolbarConfig> = {
    toolbarKeys: ['emotion', 'uploadImage', 'insertLink']
}

onMounted(() => {
    initEditor()
})

onBeforeUnmount(() => {
    destroyEditor()
})

watch(() => props.value, (newVal) => {
    if (newVal === curValue.value) return
    nextTick(() => {
        if (editor.value) {
            editor.value.setHtml(newVal)
        }
    })
})

watch(() => props.readOnly, (val) => {
    if (!editor.value) return
    if (val || props.disabled) {
        editor.value.disable()
    } else {
        editor.value.enable()
    }
})

watch(() => props.disabled, (val) => {
    if (!editor.value) return
    if (val || props.readOnly) {
        editor.value.disable()
    } else {
        editor.value.enable()
    }
})

function initEditor() {
    if (!editorRef.value) return

    const editorInstance = createEditor({
        selector: editorRef.value,
        html: props.value || '',
        config: {
            ...editorConfig,
            placeholder: props.placeholder,
            readOnly: props.readOnly || props.disabled,
            onCreated(ed: IDomEditor) {
                editor.value = ed
                nextTick(() => {
                    bindSafariPasteFallback()
                })
            },
            onChange(ed: IDomEditor) {
                let html = ed.getHtml()
                if (html === '<p><br></p>') html = ''
                // 处理编辑器残留空白字符的情况
                if (html) {
                    const text = ed.getText().replace(/[\u200b\s]/g, '')
                    const hasVoidElements = html.includes('data-w-e-type="image"') || html.includes('<img') || html.includes('data-w-e-type="mention"')
                    if (!text && !hasVoidElements) {
                        ed.clear()
                        return
                    }
                }
                curValue.value = html
                emit('update:value', html)
                emit('input', html)
            },
            onFocus() {
                emit('focus')
            },
            onBlur() {
                emit('blur')
            },
            customPaste(ed: IDomEditor, event: ClipboardEvent) {
                return handleCustomPaste(ed, event)
            }
        },
        mode: 'simple'
    })

    if (!props.hideToolBar && toolbarRef.value) {
        createToolbar({
            editor: editorInstance,
            selector: toolbarRef.value,
            config: toolbarConfig,
            mode: 'simple'
        })
    }
}

/**
 * 自定义粘贴处理：支持图片粘贴和纯文本长度限制
 */
function handleCustomPaste(ed: IDomEditor, event: ClipboardEvent): boolean {
    const text = event.clipboardData?.getData('text/plain') || ''

    if (!text) {
        if (props.allowPasteImage) {
            const cd = event.clipboardData
            const imageFiles: File[] = []
            if (cd?.items) {
                for (let i = 0; i < cd.items.length; i++) {
                    const item = cd.items[i]
                    if (item?.kind === 'file' && /^image\//i.test(item.type || '')) {
                        const f = item.getAsFile()
                        if (f) imageFiles.push(f)
                    }
                }
            }
            if (imageFiles.length) {
                event.preventDefault()
                imageFiles.forEach((rawFile) => {
                    const file = normalizePastedImageFile(rawFile)
                    handleImageUpload(file, (url: string) => {
                        if (!url) return
                        ed.restoreSelection()
                        const imageNode = {
                            type: 'image',
                            src: url,
                            alt: file.name || '',
                            href: url,
                            style: {},
                            children: [{ text: '' }]
                        }
                        ed.insertNode(imageNode)
                    })
                })
                return false
            }
        }
        event.preventDefault()
        return false
    }

    if (text.length > PASTE_MAX_LENGTH) {
        ed.insertText(text.substring(0, PASTE_MAX_LENGTH))
        event.preventDefault()
        return false
    } else {
        ed.insertText(text)
        event.preventDefault()
        return false
    }
}

/**
 * Safari 粘贴兜底处理
 */
function bindSafariPasteFallback() {
    if (!props.allowPasteImage || props.readOnly || props.disabled) return
    const root = editorRef.value?.querySelector('.w-e-text-container') as HTMLElement | null
    if (!root) return
    if ((root as any).__qa_safari_paste_bound__) return
    ;(root as any).__qa_safari_paste_bound__ = true

    const handler = (event: Event) => {
        const clipEvent = event as ClipboardEvent
        if (!props.allowPasteImage || props.readOnly || props.disabled) return
        const cd = clipEvent.clipboardData
        if (!cd) return
        const plainText = cd.getData('text/plain')
        if (plainText?.trim().length) return

        const imageFiles: File[] = []
        if (cd.items) {
            for (let i = 0; i < cd.items.length; i++) {
                const item = cd.items[i]
                if (item?.kind === 'file' && /^image\//i.test(item.type || '')) {
                    const f = item.getAsFile()
                    if (f) imageFiles.push(f)
                }
            }
        }
        if (!imageFiles.length && cd.files?.length) {
            for (let i = 0; i < cd.files.length; i++) {
                const f = cd.files[i]
                if (f && /^image\//i.test(f.type || '')) {
                    imageFiles.push(f)
                }
            }
        }
        if (!imageFiles.length) return

        event.preventDefault()
        event.stopPropagation()
        const ed = editor.value
        if (!ed) return
        imageFiles.forEach((rawFile) => {
            const file = normalizePastedImageFile(rawFile)
            handleImageUpload(file, (url: string) => {
                if (!url) return
                const imageNode = {
                    type: 'image',
                    src: url,
                    alt: file.name || '',
                    href: url,
                    style: {},
                    children: [{ text: '' }]
                }
                ed.insertNode(imageNode)
            })
        })
    }
    root.addEventListener('paste', handler, true)
}

/**
 * 图片上传回调（默认转 Base64，可由外部覆盖）
 */
function handleImageUpload(file: File, insertFn: (url: string, alt?: string, href?: string) => void) {
    if (!checkFileType(file)) return
    const reader = new FileReader()
    reader.onload = () => {
        const base64 = reader.result as string
        insertFn(base64, file.name, base64)
    }
    reader.readAsDataURL(file)
}

/**
 * 校验文件类型
 */
function checkFileType(file: File): boolean {
    if (!props.acceptImgType) return true
    const allowedExtensions = props.acceptImgType.split(',').map(ext => ext.trim().toLowerCase())
    const fileExtension = '.' + (file.name.split('.').pop()?.toLowerCase() || '')
    if (!allowedExtensions.includes(fileExtension)) {
        return false
    }
    return true
}

/**
 * 规范化粘贴板中的图片 File
 */
function normalizePastedImageFile(file: File): File {
    const mime = (file.type || '').toLowerCase()
    if (!/^image\//.test(mime)) return file
    const mimeExtMap: Record<string, string> = {
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/bmp': 'bmp',
        'image/webp': 'webp',
        'image/gif': 'gif'
    }
    const ext = mimeExtMap[mime] || mime.split('/')[1] || 'png'
    const originName = file.name || ''
    const lastDot = originName.lastIndexOf('.')
    const currentExt = lastDot >= 0 ? originName.substring(lastDot + 1).toLowerCase() : ''
    if (currentExt && Object.values(mimeExtMap).includes(currentExt)) {
        return file
    }
    const baseName = originName && lastDot > 0 ? originName.substring(0, lastDot) : 'image'
    const newName = `${baseName}.${ext}`
    try {
        return new File([file], newName, { type: file.type, lastModified: file.lastModified || Date.now() })
    } catch {
        return file
    }
}

function destroyEditor() {
    if (editor.value) {
        editor.value.destroy()
        editor.value = null
    }
}

/**
 * 暴露给父组件的方法和属性
 */
defineExpose({
    /** wangEditor 实例 */
    editor,
    /** 清空编辑器内容 */
    clear() {
        editor.value?.clear()
    },
    /** 插入文本 */
    insertText(text: string) {
        editor.value?.insertText(text)
    },
    /** 插入 HTML */
    insertHtml(html: string) {
        editor.value?.dangerouslyInsertHtml(html)
    },
    /** 聚焦 */
    focus() {
        editor.value?.focus()
    },
    /** 获取纯文本 */
    getText() {
        return editor.value?.getText() || ''
    },
    /** 获取 HTML */
    getHtml() {
        return editor.value?.getHtml() || ''
    },
    /** 判断是否为空 */
    isEmpty() {
        return editor.value?.isEmpty() ?? true
    },
    /**
     * 获取序列化为内联标记的纯文本（mention 节点转为 @skill:/@tool: 形式）
     * 用于发送给大模型
     */
    getMentionText() {
        if (!editor.value) return ''
        return serializeMentionToInlineText(editor.value)
    }
})
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>

<style scoped>
.qa-editor {
    width: 100%;
    text-align: left;
    position: relative;
}

.qa-editor__toolbar {
    border-bottom: 1px solid rgba(17, 32, 70, 0.13);
}

.qa-editor__editor {
    width: 100%;
    font-size: var(--td-font-size-body-medium);
}

.qa-editor--no-toolbar .qa-editor__editor {
    height: 100%;
}

.qa-editor--disabled {
    opacity: 0.6;
    pointer-events: none;
}

.qa-editor--dark :deep(.w-e-text-container [data-slate-editor]) {
    color: var(--td-text-color-primary);
}

.qa-editor--dark :deep(.w-e-text-placeholder) {
    color: var(--td-text-color-placeholder);
}

:deep(.w-e-text-placeholder) {
    color: var(--td-text-color-placeholder, rgba(0, 0, 0, 0.35));
    white-space: pre-wrap;
    word-wrap: break-word;
    font-style: normal;
    font-size: var(--td-font-size-body-medium);
    top: 8px;
}

:deep(.w-e-text-container) {
    background-color: transparent;
}

:deep(.w-e-text-container) img {
    max-width: 300px;
    min-height: 24px;
    min-width: 24px;
    max-height: 90px;
}

:deep(.w-e-text-container [data-slate-editor]) {
    min-height: 20px;
    padding: var(--td-size-4) var(--td-size-5);
}

:deep(.w-e-text-container [data-slate-editor] p) {
    margin: 0;
}

:deep(.w-e-bar) {
    background-color: transparent;
}
</style>
