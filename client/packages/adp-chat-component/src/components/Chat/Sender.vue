<!-- 消息发送组件，支持文本、图片上传、文件上传、语音输入 -->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ChatSender as TChatSender } from '@tdesign-vue-next/chat'
import { MessagePlugin, Tooltip as TTooltip } from 'tdesign-vue-next'
import type { FileProps } from '../../model/file';
import {
    ALLOWED_IMAGE_TYPES,
    ALLOWED_DOC_TYPES,
    ALLOWED_FILE_TYPES,
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

const emit = defineEmits<{
    (e: 'stop'): void;
    (e: 'send', value: string, fileList: FileProps[]): void;
    (e: 'uploadFile', files: File[]): void;
    (e: 'startRecord'): void;
    (e: 'stopRecord'): void;
    (e: 'message', code: MessageCode, message: string): void;
}>();

const inputValue = ref('');
const inputValueBefore = ref('');
const recording = ref(false);
const fileList = ref<FileProps[]>([]);
const recorder = ref<WebRecorder | null>(null);
const asrWebSocket = ref<WebSocket | null>(null);
const recordMaxTime = 60;
const recordRef = ref<ReturnType<typeof setTimeout> | null>(null);
const chatSenderRef = ref<InstanceType<typeof TChatSender> | null>(null);

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

onMounted(() => {
    nextTick(() => {
        const textarea = chatSenderRef.value?.$el?.querySelector('textarea');
        if (textarea) {
            textarea.setAttribute('enterkeyhint', 'send');
        }
    });
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

const handleInput = (value: string) => {
    inputValue.value = value;
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
        MessagePlugin.warning(`最多上传 ${FILE_COUNT_LIMIT} 个文件`);
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
            MessagePlugin.error(`文件大小不能超过 ${formatFileSize(sizeLimit)}`);
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

const handleSend = async function (value: string) {
    if (props.isUploading) {
        MessagePlugin.warning('文件上传/解析中，请稍候');
        return;
    }
    if (props.isStreamLoad) {
        const text = i18n.value.answering || getMessage(MessageCode.ANSWERING).message;
        MessagePlugin.warning(text);
        emit('message', MessageCode.ANSWERING, text);
        return;
    }
    handleStopRecord();

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
    _query += value;

    emit('send', _query, fileList.value);
    inputValue.value = '';
    fileList.value = [];
}

/**
 * 处理开始录音事件
 */
const handleStartRecord = async () => {
    recording.value = true;
    
    // 如果使用内部录音处理（API 模式）
    if (props.useInternalRecord) {
        try {
            const res = await getAsrUrl(props.asrUrlApi || undefined);
            inputValueBefore.value = inputValue.value;
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
                    inputValue.value = inputValueBefore.value + msg['result']['voice_text_str'];
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
    recorder.value.OnReceivedData = (data) => {
        if (asrWebSocket.value?.readyState === WebSocket.OPEN) {
            asrWebSocket.value?.send(data);
        }
    };
    recorder.value.OnError = (err) => {
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
    
    // 如果使用内部录音处理
    if (props.useInternalRecord) {
        console.log('[asr] stop');
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

const handlePaste = async (event: ClipboardEvent) => {
    if (props.isUploading) return;
    try {
        const items = event.clipboardData?.items;
        if (!items || items.length === 0) return;

        const imageItems = Array.from(items)
            .filter((item: DataTransferItem) => item.type.includes('image'))
            .map((i: DataTransferItem) => i.getAsFile())
            .filter((file): file is File => file !== null);

        if (imageItems.length > 0) {
            const currentCount = fileList.value.length;
            if (currentCount + imageItems.length > FILE_COUNT_LIMIT) {
                MessagePlugin.warning(`最多上传 ${FILE_COUNT_LIMIT} 个文件`);
                return;
            }
            emit('uploadFile', imageItems);
        }
    } catch (error) {
        console.error('粘贴图片出错:', error);
    }
};

/**
 * 修改输入框内容（供外部调用）
 */
const changeSenderVal = (value: string, files: FileProps[]) => {
    inputValue.value = value;
    fileList.value = files;
}

/**
 * 添加文件到列表（供外部调用）
 */
const addFile = (file: FileProps) => {
    fileList.value.push(file);
}

/**
 * 根据 uid 更新文件属性（供外部调用，用于上传完成后更新 status/url）
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
 * 更新输入值（供外部调用，用于语音识别）
 */
const updateInputValue = (value: string) => {
    inputValue.value = value;
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
    <TChatSender ref="chatSenderRef" class="sender-container" :class="{ 'is-uploading': isUploading }" :value="inputValue" :textarea-props="{
        placeholder: isMobile ? i18n.placeholderMobile : i18n.placeholder,
        autosize: { minRows: 1, maxRows: 6 },
        disabled: isUploading,
    }"
        @stop="emit('stop')"
        @send="handleSend"
        @change="handleInput"
        @paste="handlePaste">
        <template #inner-header>
            <FileList :fileList="fileList" :theme="theme" :mode="mode" @delete="handleDeleteFile"/>
        </template>
        <template #suffix>
            <CustomizedIcon class="send-icon waiting" :class="{ disabled: sendDisabled }" v-if="!isStreamLoad && !inputValue" nativeIcon :showHoverBg="false" :name="theme === 'dark' ? 'send_dark' : 'send'" @click="handleSend(inputValue)" />
            <CustomizedIcon class="send-icon success" :class="{ disabled: sendDisabled }" v-if="!isStreamLoad && inputValue" nativeIcon :showHoverBg="false" name="send_fill" @click="handleSend(inputValue)" />
            <CustomizedIcon class="send-icon stop" v-if="isStreamLoad" nativeIcon :showHoverBg="false" :name="theme === 'dark' ? 'pause_dark' : 'pause'" @click="emit('stop')" />
        </template>
        <template #prefix>
            <div class="sender-control-container">
                <!-- 加号菜单按钮 -->
                <div  ref="plusMenuRef" class="plus-menu-wrapper">
                    <span class="plus-btn" :class="{ active: showPlusMenu, disabled: isUploading }" @click="togglePlusMenu">
                        <CustomizedIcon name="plus" :theme="theme" :showHoverBg="false" />
                    </span>
                    <Transition name="fade-up">
                        <div v-if="showPlusMenu" class="plus-menu-popover">
                            <div class="plus-menu-item" @click="handleSelectImage">
                                <CustomizedIcon name="picture" :theme="theme" size="s" :showHoverBg="false" />
                                <span>图片</span>
                            </div>
                            <div class="plus-menu-item" @click="handleSelectFile">
                                <CustomizedIcon name="file" :theme="theme" size="s" :showHoverBg="false" />
                                <span>文件</span>
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
        </template>
    </TChatSender>
</template>

<style scoped>
.sender-control-container {
    display: flex;
    align-items: center;
}

.sender-container {
    width: 100%;
    max-width: 800px;
}

/* 上传/解析中整体置灰 */
.sender-container.is-uploading {
    opacity: 0.7;
    pointer-events: auto;
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
    z-index: 100;
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
    display: inline-block;
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

:deep(.t-chat-sender__textarea) {
    background-color: var(--td-sender-bg);
    border-radius: var(--td-radius-medium);
}

:deep(.t-chat-sender__footer) {
    padding: 0px var(--td-comp-paddingLR-s);
}
</style>
