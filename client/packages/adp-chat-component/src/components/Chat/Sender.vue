<!-- 消息发送组件，支持文本、图片上传、语音输入 -->
<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { ChatSender as TChatSender } from '@tdesign-vue-next/chat'
import { MessagePlugin, Upload as TUpload, Tooltip as TTooltip } from 'tdesign-vue-next'
import type { UploadFile, RequestMethodResponse } from 'tdesign-vue-next'
import type { FileProps } from '../../model/file';
import { MessageCode, getMessage } from '../../model/messages';
import type { ChatRelatedProps, SenderI18n } from '../../model/type';
import { chatRelatedPropsDefaults, defaultSenderI18n } from '../../model/type';
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
    /** 国际化文本 */
    i18n?: SenderI18n;
}

const props = withDefaults(defineProps<Props>(), {
    ...chatRelatedPropsDefaults,
    isStreamLoad: false,
    useInternalRecord: false,
    asrUrlApi: '',
    enableVoiceInput: true,
    i18n: () => ({})
});

// 合并默认值和传入值
const i18n = computed(() => ({
    ...defaultSenderI18n,
    ...props.i18n
}));

const emit = defineEmits<{
    (e: 'stop'): void;
    (e: 'send', value: string, fileList: FileProps[]): void;
    (e: 'uploadFile', files: File[]): void;
    (e: 'startRecord'): void;
    (e: 'stopRecord'): void;
    (e: 'message', code: MessageCode, message: string): void;
}>();

/**
 * 输入框内容
 */
const inputValue = ref('')

/**
 * 开始语音时输入框内容
 */
const inputValueBefore = ref('')

/**
 * 是否正在录音
 */
const recording = ref(false)

/**
 * 文件列表
 */
const fileList = ref([] as FileProps[])



/**
 * WebRecorder 实例引用
 */
const recorder = ref<WebRecorder | null>(null)

/**
 * ASR WebSocket 连接引用
 */
const asrWebSocket = ref<WebSocket | null>(null)

/**
 * 录音超时时间，单位 s
 */
const recordMaxTime = 60;
const recordRef = ref<ReturnType<typeof setTimeout> | null>(null);

/**
 * ChatSender 组件 ref
 */
const chatSenderRef = ref<InstanceType<typeof TChatSender> | null>(null);

/**
 * 设置 textarea 的 enterkeyhint 属性
 */
onMounted(() => {
    nextTick(() => {
        const textarea = chatSenderRef.value?.$el?.querySelector('textarea');
        if (textarea) {
            textarea.setAttribute('enterkeyhint', 'send');
        }
    });
});

/**
 * 处理输入内容变化
 */
const handleInput = (value: string) => {
    inputValue.value = value
}

/**
 * 处理文件选择事件
 */
const handleFileSelect = async function (files: UploadFile | UploadFile[]): Promise<RequestMethodResponse> {
    const fileArray = Array.isArray(files) ? files : [files];
    if (fileArray.length <= 0) return { status: 'success', response: {} };
    const allowed = ['image/png', 'image/jpg', 'image/jpeg', 'image/bmp']
    const validFiles: File[] = [];
    
    fileArray.forEach((item: UploadFile) => {
        const file = item.raw || item;
        if (file instanceof File && !allowed.includes(file.type)) {
            const text = i18n.value.notSupport || getMessage(MessageCode.FILE_FORMAT_NOT_SUPPORT).message;
            MessagePlugin.error(text);
            emit('message', MessageCode.FILE_FORMAT_NOT_SUPPORT, text);
            return;
        }
        if (file instanceof File) {
            validFiles.push(file);
        }
    });
    
    if (validFiles.length > 0) {
        emit('uploadFile', validFiles);
    }
    return { status: 'success', response: {} };
}

/**
 * 删除文件
 */
const handleDeleteFile = (index: number) => {
    fileList.value.splice(index, 1);
    fileList.value = [...fileList.value];
}

/**
 * 处理发送消息
 */
const handleSend = async function (value: string) {
    if (props.isStreamLoad) {
        const text = i18n.value.answering || getMessage(MessageCode.ANSWERING).message;
        MessagePlugin.warning(text);
        emit('message', MessageCode.ANSWERING, text);
        return
    }
    // 用户点击发送动作时结束录音
    handleStopRecord();
    
    // 将图片处理成 markdown 格式拼接到消息内容前面
    let _query = '';
    for (const file of fileList.value) {
        if (file.status === 'done' && file.url) {
            _query += `![](${file.url})`;
        }
    }
    _query += value;
    
    emit('send', _query, fileList.value);
    // 发送后清空输入框和文件列表
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
        const errMsg = typeof err === 'string' ? err : (i18n.value.recordFailed || getMessage(MessageCode.RECORD_FAILED).message);
        MessagePlugin.error(errMsg);
        emit('message', MessageCode.RECORD_FAILED, errMsg);
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
    try {
        const items = event.clipboardData?.items;
        if (!items || items.length === 0) {
            return;
        }

        // 查找所有图片项
        const imageItems = Array.from(items).filter((item: DataTransferItem) =>
            item.type.includes('image')
        ).map((i: DataTransferItem) => i.getAsFile()).filter((file): file is File => file !== null);
        
        if (imageItems.length > 0) {
            handleFileSelect(imageItems);
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
    setRecording,
    updateInputValue
})
</script>

<template>
    <TChatSender ref="chatSenderRef" class="sender-container" :value="inputValue" :textarea-props="{
        placeholder: isMobile ? i18n.placeholderMobile : i18n.placeholder,
        autosize: { minRows: 1, maxRows: 6 },
    }"
        @stop="emit('stop')"
        @send="handleSend"
        @change="handleInput"
        @paste="handlePaste">
        <template #inner-header>
            <FileList :fileList="fileList" :theme="theme" @delete="handleDeleteFile"/>
        </template>
        <template #suffix>
            <!-- 等待中的发送按钮 -->
            <CustomizedIcon class="send-icon waiting" v-if="!isStreamLoad && !inputValue" nativeIcon :showHoverBg="false" :name="theme === 'dark' ? 'send_dark' : 'send'" @click="handleSend(inputValue)" />
            <!-- 可用的发送按钮 -->
            <CustomizedIcon class="send-icon success" v-if="!isStreamLoad && inputValue" nativeIcon :showHoverBg="false" name="send_fill" @click="handleSend(inputValue)" />
            <!-- 停止发送按钮 -->
            <CustomizedIcon class="send-icon stop" v-if="isStreamLoad" nativeIcon :showHoverBg="false" :name="theme === 'dark' ? 'pause_dark' : 'pause'" @click="emit('stop')" />
        </template>
        <template #prefix>
            <div class="sender-control-container">
                <TUpload class="sender-upload"  ref="uploadRef1" :max="10" :multiple="true" :request-method="handleFileSelect"
                    accept="image/*" theme="custom">
                    <TTooltip :content="i18n.uploadImg">
                        <span class="recording-icon" :class="{ isMobile: isMobile }">
                            <CustomizedIcon name="picture" :theme="theme" :showHoverBg="!isMobile"/>
                        </span>
                    </TTooltip>
                </TUpload>
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
.select-area {
    display: flex;
    align-items: center;
    gap: var(--td-comp-paddingLR-s);
}
.recording-icon:hover {
    cursor: pointer;
    color: var(--td-brand-color);
}

.sender-icon {
    padding: var(--td-pop-padding-m);
}

.sender-icon.stop-icon {
    padding: 0;
}

.sender-control-container {
    display: flex;
    align-items: center;
}

.sender-container {
    width: 100%;
    max-width: 800px;
}

.customeized-icon {
    cursor: pointer;
}
.send-icon {
    padding: 0 !important;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
:deep(.t-chat-sender__textarea) {
    background-color: var(--td-sender-bg);
    border-radius: var(--td-radius-medium);
}

:deep(.t-chat-sender__footer) {
    padding: 0px var(--td-comp-paddingLR-s);
}
:deep(.sender-upload){
    height: var(--td-comp-size-m);
}
.recording-icon{
    height: var(--td-comp-size-m);
    display: inline-block;
    margin-right: var(--td-comp-paddingLR-xs);
}
.recording-icon.isMobile{
    margin-right: var(--td-comp-paddingLR-m);
}
</style>
