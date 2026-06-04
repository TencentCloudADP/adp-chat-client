<!-- 消息发送组件，支持富文本编辑、图片上传、文件上传、语音输入 -->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { MessagePlugin, Tooltip as TTooltip } from 'tdesign-vue-next'
import type { FileProps } from '../../model/file';
import {
    ALLOWED_IMAGE_TYPES,
    ALLOWED_DOC_TYPES,
    FILE_SIZE_LIMITS,
    FILE_COUNT_LIMIT,
    getFileCategory,
    formatFileSize,
} from '../../model/file';
import { MessageCode, getMessage } from '../../model/messages';
import type { ChatRelatedProps, SenderI18n } from '../../model/type';
import { chatRelatedPropsDefaults, defaultSenderI18n, defaultSenderI18nEn } from '../../model/type';
import RecordIcon from '../Common/RecordIcon.vue';
import FileList from '../Common/FileList.vue';
import CustomizedIcon from '../CustomizedIcon.vue';
import WebRecorder from '../../utils/webRecorder';
import { getAsrUrl } from '../../service/api';
import QaEditor from '../QaEditor/index.vue';

export interface Props extends ChatRelatedProps {
    /** 是否正在流式加载 */
    isStreamLoad?: boolean;
    /** 是否使用内部录音处理（API 模式） */
    useInternalRecord?: boolean;
    /** ASR URL API 路径 */
    asrUrlApi?: string;
    /** 是否启用语音输入 */
    enableVoiceInput?: boolean;
    /** 是否正在上传/解析文件（禁止发送和继续上传） */
    isUploading?: boolean;
    /** 国际化文本 */
    i18n?: SenderI18n;
}

const props = withDefaults(defineProps<Props>(), {
    ...chatRelatedPropsDefaults,
    isStreamLoad: false,
    useInternalRecord: false,
    asrUrlApi: '',
    enableVoiceInput: true,
    isUploading: false,
    i18n: () => ({})
});

const i18n = computed(() => {
    const defaults = props.language?.startsWith('en') ? defaultSenderI18nEn : defaultSenderI18n;
    return { ...defaults, ...props.i18n };
});

/**
 * 是否禁止发送和上传（上传/解析中或流式加载中）
 */
const sendDisabled = computed(() => props.isUploading || props.isStreamLoad);

/**
 * 是否有可发送内容
 */
const hasContent = computed(() => {
    const textContent = editorHtml.value.replace(/<[^>]*>/g, '').replace(/[\u200b\s]/g, '').trim();
    const hasImages = editorHtml.value.includes('<img');
    return !!(textContent || hasImages || fileList.value.length > 0);
});

const emit = defineEmits<{
    (e: 'stop'): void;
    (e: 'send', value: string, fileList: FileProps[]): void;
    (e: 'uploadFile', files: File[]): void;
    (e: 'startRecord'): void;
    (e: 'stopRecord'): void;
    (e: 'message', code: MessageCode, message: string): void;
}>();

const editorHtml = ref('');
const inputFocus = ref(false);
const recording = ref(false);
const fileList = ref<FileProps[]>([]);
const recorder = ref<WebRecorder | null>(null);
const asrWebSocket = ref<WebSocket | null>(null);
const recordMaxTime = 60;
const recordRef = ref<ReturnType<typeof setTimeout> | null>(null);
const qaEditorRef = ref<InstanceType<typeof QaEditor> | null>(null);
const inputValueBefore = ref('');

/**
 * 加号菜单状态
 */
const showPlusMenu = ref(false);
const plusMenuRef = ref<HTMLDivElement | null>(null);
const imageInputRef = ref<HTMLInputElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

/**
 * 图片 accept 属性
 */
const imageAccept = ALLOWED_IMAGE_TYPES.map(t => {
    const ext = t.split('/')[1];
    return `.${ext === 'jpeg' ? 'jpg,.jpeg' : ext}`;
}).join(',');

/**
 * 文件 accept 属性
 */
const fileAccept = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.md,.csv,.json';

const placeholder = computed(() => {
    return props.isMobile ? (i18n.value.placeholderMobile || '') : (i18n.value.placeholder || '');
});

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

/**
 * 点击外部关闭菜单
 */
const handleClickOutside = (e: MouseEvent) => {
    if (plusMenuRef.value && !plusMenuRef.value.contains(e.target as Node)) {
        showPlusMenu.value = false;
    }
};

/**
 * 切换加号菜单
 */
const togglePlusMenu = () => {
    if (props.isUploading) return;
    showPlusMenu.value = !showPlusMenu.value;
};

/**
 * 选择图片
 */
const handleSelectImage = () => {
    if (props.isUploading) return;
    showPlusMenu.value = false;
    imageInputRef.value?.click();
};

/**
 * 选择文件
 */
const handleSelectFile = () => {
    if (props.isUploading) return;
    showPlusMenu.value = false;
    fileInputRef.value?.click();
};

/**
 * 编辑器内容变更
 */
const handleEditorInput = (html: string) => {
    editorHtml.value = html;
};

/**
 * 编辑器聚焦
 */
const handleEditorFocus = () => {
    inputFocus.value = true;
};

/**
 * 编辑器失焦
 */
const handleEditorBlur = () => {
    inputFocus.value = false;
};

/**
 * 键盘事件：Enter 发送，Ctrl/Meta+Enter 换行
 * 通过 isComposing 判断是否处于 IME 组合输入状态，避免输入法确认时误触发送
 */
const handleKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter') return;
    if (event.isComposing || event.keyCode === 229) return;
    if (event.metaKey || event.ctrlKey) {
        qaEditorRef.value?.insertHtml('<br/>')
    } else if (!event.shiftKey) {
        event.preventDefault();
        handleSend();
    }
};

/**
 * 统一文件选择校验逻辑
 */
const handleFilesSelected = (event: Event, allowedTypes: string[]) => {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    const currentCount = fileList.value.length;
    if (currentCount + files.length > FILE_COUNT_LIMIT) {
        MessagePlugin.warning(i18n.value.fileLimitExceeded.replace('{count}', String(FILE_COUNT_LIMIT)));
        return;
    }

    const validFiles: File[] = [];
    Array.from(files).forEach((file) => {
        if (!allowedTypes.includes(file.type) && !isExtensionAllowed(file.name, allowedTypes)) {
            const text = i18n.value.notSupport || getMessage(MessageCode.FILE_FORMAT_NOT_SUPPORT).message;
            MessagePlugin.error(text);
            emit('message', MessageCode.FILE_FORMAT_NOT_SUPPORT, text);
            return;
        }

        const category = getFileCategory(file.type);
        const sizeLimit = FILE_SIZE_LIMITS[category];
        if (file.size > sizeLimit) {
            MessagePlugin.error(i18n.value.fileSizeExceeded.replace('{size}', formatFileSize(sizeLimit)));
            return;
        }

        validFiles.push(file);
    });

    if (validFiles.length > 0) {
        emit('uploadFile', validFiles);
    }

    input.value = '';
};

/**
 * 通过扩展名检查文件类型（兜底）
 */
const isExtensionAllowed = (fileName: string, allowedTypes: string[]): boolean => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (!ext) return false;
    const extToMime: Record<string, string> = {
        jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', bmp: 'image/bmp', webp: 'image/webp',
        pdf: 'application/pdf', doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ppt: 'application/vnd.ms-powerpoint',
        pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        xls: 'application/vnd.ms-excel',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        txt: 'text/plain', md: 'text/markdown', csv: 'text/csv', json: 'application/json',
    };
    const mime = extToMime[ext];
    return mime ? allowedTypes.includes(mime) : false;
};

const handleImageInputChange = (event: Event) => {
    handleFilesSelected(event, ALLOWED_IMAGE_TYPES);
};

const handleFileInputChange = (event: Event) => {
    handleFilesSelected(event, ALLOWED_DOC_TYPES);
};

const handleDeleteFile = (index: number) => {
    fileList.value.splice(index, 1);
    fileList.value = [...fileList.value];
};

/**
 * 将编辑器中的内联图片转为 Markdown 格式
 */
function htmlImgToMarkdown(html: string): string {
    return html.replace(/<img[^>]+src="([^"]*)"[^>]*>/g, (_, src) => {
        return `![](${src})`;
    });
}

/**
 * 提取编辑器中纯文本内容（去除HTML标签）
 */
function getPlainText(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
}

const handleSend = async function () {
    if (props.isUploading) {
        MessagePlugin.warning(i18n.value.uploadingWait);
        return;
    }
    if (props.isStreamLoad) {
        const text = i18n.value.answering || getMessage(MessageCode.ANSWERING).message;
        MessagePlugin.warning(text);
        emit('message', MessageCode.ANSWERING, text);
        return;
    }
    handleStopRecord();

    if (!hasContent.value) return;

    let _query = '';
    for (const file of fileList.value) {
        if (file.status === 'done' && file.url) {
            if (props.mode === 'claw') {
                _query += `[${file.name || ''}](${file.url})`;
            } else if (file.category === 'image') {
                _query += `![](${file.url})`;
            }
        }
    }

    // 将编辑器中的内联图片转成 Markdown 格式后附加到消息中
    const editorContent = editorHtml.value;
    const processedContent = htmlImgToMarkdown(editorContent);
    const plainContent = getPlainText(processedContent);
    _query += plainContent || processedContent;

    emit('send', _query, fileList.value);
    editorHtml.value = '';
    qaEditorRef.value?.clear();
    fileList.value = [];
}

/**
 * 处理开始录音事件
 */
const handleStartRecord = async () => {
    recording.value = true;
    
    if (props.useInternalRecord) {
        try {
            const res = await getAsrUrl(props.asrUrlApi || undefined);
            inputValueBefore.value = getPlainText(editorHtml.value);
            const url = res.url;
            asrWebSocket.value = new WebSocket(url);
            
            asrWebSocket.value.onopen = () => {
                startRecording();
                recordRef.value = setTimeout(() => {
                    if (recording.value) {
                        const text = i18n.value.recordTooLong || getMessage(MessageCode.RECORD_TOO_LONG).message;
                        MessagePlugin.warning(text);
                        emit('message', MessageCode.RECORD_TOO_LONG, text);
                        handleStopRecord();
                    }
                }, recordMaxTime * 1000);
            };
            
            asrWebSocket.value.onmessage = (event) => {
                if (!recording.value) return;
                const msg = JSON.parse(event.data);
                if ('result' in msg) {
                    const newText = inputValueBefore.value + msg['result']['voice_text_str'];
                    qaEditorRef.value?.clear();
                    nextTick(() => {
                        qaEditorRef.value?.insertText(newText);
                    });
                }
                if ('message' in msg && 'code' in msg && msg['code'] != 0) {
                    MessagePlugin.error(msg['message']);
                    emit('message', MessageCode.ASR_SERVICE_FAILED, msg['message']);
                }
            };
            
            asrWebSocket.value.onclose = () => {
                recording.value = false;
                if (recordRef.value) {
                    clearTimeout(recordRef.value);
                    recordRef.value = null;
                }
            };
        } catch (error) {
            recording.value = false;
            const text = i18n.value.asrServiceFailed || getMessage(MessageCode.ASR_SERVICE_FAILED).message;
            MessagePlugin.error(text);
            emit('message', MessageCode.ASR_SERVICE_FAILED, text);
        }
    }
    
    emit('startRecord');
}

/**
 * 开始录音（内部方法）
 */
const startRecording = () => {
    const requestId = '0';
    recorder.value = new WebRecorder({ requestId });
    recorder.value.OnReceivedData = (data: any) => {
        if (asrWebSocket.value?.readyState === WebSocket.OPEN) {
            asrWebSocket.value?.send(data);
        }
    };
    recorder.value.OnError = (err: any) => {
        let errMsg: string;
        let errCode: MessageCode = MessageCode.RECORD_FAILED;
        if (err && typeof err === 'object' && 'code' in err) {
            const errorCodeMap: Record<string, { i18nKey: keyof SenderI18n; messageCode: MessageCode }> = {
                CHROME_SECURITY_ERROR: { i18nKey: 'chromeSecurityError', messageCode: MessageCode.CHROME_SECURITY_ERROR },
                BROWSER_NOT_SUPPORT: { i18nKey: 'browserNotSupport', messageCode: MessageCode.BROWSER_NOT_SUPPORT },
                AUDIO_CONTEXT_NOT_SUPPORT: { i18nKey: 'audioContextNotSupport', messageCode: MessageCode.AUDIO_CONTEXT_NOT_SUPPORT },
                WEB_AUDIO_API_NOT_SUPPORT: { i18nKey: 'webAudioApiNotSupport', messageCode: MessageCode.WEB_AUDIO_API_NOT_SUPPORT },
                MEDIA_STREAM_SOURCE_NOT_SUPPORT: { i18nKey: 'mediaStreamSourceNotSupport', messageCode: MessageCode.MEDIA_STREAM_SOURCE_NOT_SUPPORT },
            };
            const mapping = errorCodeMap[err.code as string];
            if (mapping) {
                errMsg = i18n.value[mapping.i18nKey] || getMessage(mapping.messageCode).message;
                errCode = mapping.messageCode;
            } else {
                errMsg = i18n.value.recordFailed || getMessage(MessageCode.RECORD_FAILED).message;
            }
        } else {
            errMsg = typeof err === 'string' ? err : (i18n.value.recordFailed || getMessage(MessageCode.RECORD_FAILED).message);
        }
        MessagePlugin.error(errMsg);
        emit('message', errCode, errMsg);
        recording.value = false;
    };
    recorder.value.start();
}

/**
 * 处理停止录音事件
 */
const handleStopRecord = () => {
    if (!recording.value) return;
    recording.value = false;
    
    if (props.useInternalRecord) {
        recorder.value?.stop();
        recorder.value = null;
        asrWebSocket.value?.close();
        asrWebSocket.value = null;
        if (recordRef.value) {
            clearTimeout(recordRef.value);
            recordRef.value = null;
        }
    }
    
    emit('stopRecord');
}

/**
 * 修改输入框内容（供外部调用）
 */
const changeSenderVal = (value: string, files: FileProps[]) => {
    editorHtml.value = value;
    if (qaEditorRef.value) {
        qaEditorRef.value.clear();
        if (value) {
            nextTick(() => {
                qaEditorRef.value?.insertHtml(value);
            });
        }
    }
    fileList.value = files;
}

/**
 * 添加文件到列表（供外部调用）
 */
const addFile = (file: FileProps) => {
    fileList.value.push(file);
}

/**
 * 根据 uid 更新文件属性（供外部调用）
 */
const updateFile = (uid: string, updates: Partial<FileProps>) => {
    const index = fileList.value.findIndex(f => f.uid === uid);
    if (index !== -1) {
        fileList.value[index] = { ...fileList.value[index], ...updates } as FileProps;
        fileList.value = [...fileList.value];
    }
}

/**
 * 根据 uid 删除文件（供外部调用）
 */
const removeFile = (uid: string) => {
    const index = fileList.value.findIndex(f => f.uid === uid);
    if (index !== -1) {
        fileList.value.splice(index, 1);
        fileList.value = [...fileList.value];
    }
}

/**
 * 设置录音状态（供外部调用）
 */
const setRecording = (value: boolean) => {
    recording.value = value;
}

/**
 * 更新输入值（供外部调用）
 */
const updateInputValue = (value: string) => {
    editorHtml.value = value;
    if (qaEditorRef.value) {
        qaEditorRef.value.clear();
        if (value) {
            nextTick(() => {
                qaEditorRef.value?.insertText(value);
            });
        }
    }
}

/**
 * 暴露给父组件的方法
 */
defineExpose({
    changeSenderVal,
    addFile,
    updateFile,
    removeFile,
    setRecording,
    updateInputValue
})
</script>

<template>
    <div class="sender-container" :class="{ 'is-uploading': isUploading, 'is-focused': inputFocus }">
        <!-- 文件预览区域 -->
        <div v-if="fileList.length > 0" class="sender-files">
            <FileList :fileList="fileList" :theme="theme" :mode="mode" @delete="handleDeleteFile"/>
        </div>

        <!-- 编辑器区域 -->
        <div class="sender-editor-area" @keydown="handleKeydown">
            <QaEditor
                ref="qaEditorRef"
                :value="editorHtml"
                :placeholder="placeholder"
                :readOnly="isUploading"
                :disabled="false"
                :hideToolBar="true"
                :allowPasteImage="true"
                :theme="theme"
                @input="handleEditorInput"
                @focus="handleEditorFocus"
                @blur="handleEditorBlur"
            />
        </div>

        <!-- 底部工具栏 -->
        <div class="sender-toolbar">
            <div class="sender-toolbar__left">
                <!-- 加号菜单按钮 -->
                <div ref="plusMenuRef" class="plus-menu-wrapper">
                    <span class="plus-btn" :class="{ active: showPlusMenu, disabled: isUploading }" @click="togglePlusMenu">
                        <CustomizedIcon remote name="basic_new_line" :theme="theme" :showHoverBg="false" />
                    </span>
                    <Transition name="fade-up">
                        <div v-if="showPlusMenu" class="plus-menu-popover">
                            <div class="plus-menu-item" @click="handleSelectImage">
                                <CustomizedIcon remote name="basic_picture_line" :theme="theme" size="s" :showHoverBg="false" />
                                <span>{{ i18n.uploadImage }}</span>
                            </div>
                            <div class="plus-menu-item" @click="handleSelectFile">
                                <CustomizedIcon remote name="basic_file_line" :theme="theme" size="s" :showHoverBg="false" />
                                <span>{{ i18n.uploadFile }}</span>
                            </div>
                        </div>
                    </Transition>
                    <!-- 隐藏的文件选择 input -->
                    <input ref="imageInputRef" type="file" :accept="imageAccept" multiple hidden @change="handleImageInputChange" />
                    <input ref="fileInputRef" type="file" :accept="fileAccept" multiple hidden @change="handleFileInputChange" />
                </div>

                <TTooltip v-if="enableVoiceInput && !recording" :content="i18n.startRecord">
                    <span class="recording-icon" :class="{ isMobile: isMobile }" @click="handleStartRecord">
                        <CustomizedIcon name="voice_input" :theme="theme" :showHoverBg="!isMobile"/>
                    </span>
                </TTooltip>

                <TTooltip v-if="enableVoiceInput && recording" :content="i18n.stopRecord">
                    <span class="recording-icon stop-icon" :class="{ isMobile: isMobile }" @click="handleStopRecord">
                        <RecordIcon />
                    </span>
                </TTooltip>
            </div>

            <div class="sender-toolbar__right">
                <CustomizedIcon class="send-icon waiting" :class="{ disabled: sendDisabled }" v-if="!isStreamLoad && !hasContent" nativeIcon :showHoverBg="false" :name="theme === 'dark' ? 'send_dark' : 'send'" @click="handleSend" />
                <CustomizedIcon class="send-icon success" :class="{ disabled: sendDisabled }" v-if="!isStreamLoad && hasContent" nativeIcon :showHoverBg="false" name="send_fill" @click="handleSend" />
                <CustomizedIcon class="send-icon stop" v-if="isStreamLoad" nativeIcon :showHoverBg="false" :name="theme === 'dark' ? 'pause_dark' : 'pause'" @click="emit('stop')" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.sender-container {
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--td-component-border);
    border-radius: var(--td-radius-xl, 16px);
    background: var(--td-bg-color-container, #fff);
    transition: border-color 0.2s, box-shadow 0.2s;
    overflow: visible;
}

.sender-container:hover {
    box-shadow: 0 0 0 2px rgba(0, 82, 217, 0.08);
}

.sender-container.is-uploading {
    opacity: 0.7;
    pointer-events: auto;
}

/* 文件区域 */
.sender-files {
    padding: 8px 12px 0;
}

/* 编辑器区域 */
.sender-editor-area {
    max-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
}

/* 底部工具栏 */
.sender-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 8px 8px;
    cursor: default;
}

.sender-toolbar__left {
    display: flex;
    align-items: center;
}

.sender-toolbar__right {
    display: flex;
    align-items: center;
}

/* 加号菜单 */
.plus-menu-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
}

.plus-btn {
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: var(--td-radius-default, 4px);
    transition: background 0.2s, transform 0.2s;
}

.plus-btn:hover {
    background-color: var(--td-bg-color-container-active, rgba(0, 0, 0, 0.05));
}

.plus-btn.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
}

.plus-menu-popover {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 0;
    width: 140px;
    padding: 6px;
    border-radius: 8px;
    background: var(--td-bg-color-container, #fff);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    z-index: 2000;
}

.plus-menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 6px;
    font-size: 13px;
    line-height: 20px;
    color: rgba(0, 0, 0, 0.8);
    cursor: pointer;
    transition: background 0.15s;
}

.plus-menu-item:hover {
   background-color: var(--td-bg-color-container-active, rgba(0, 0, 0, 0.05));
}

/* 菜单出入动画 */
.fade-up-enter-active,
.fade-up-leave-active {
    transition: opacity 0.15s, transform 0.15s;
}

.fade-up-enter-from,
.fade-up-leave-to {
    opacity: 0;
    transform: translateY(4px);
}

/* 录音按钮 */
.recording-icon:hover {
    cursor: pointer;
    color: var(--td-brand-color);
}

.recording-icon {
    height: var(--td-comp-size-m);
    display: inline-flex;
    align-items: center;
    margin-right: var(--td-comp-paddingLR-xs);
}

.recording-icon.isMobile {
    margin-right: var(--td-comp-paddingLR-m);
}

/* 发送按钮 */
.send-icon {
    padding: 0 !important;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.send-icon.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
}
</style>
