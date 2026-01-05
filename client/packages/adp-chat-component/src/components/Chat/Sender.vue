<script setup lang="ts">
import { ref } from 'vue'
import { ChatSender as TChatSender } from '@tdesign-vue-next/chat'
import type { FileProps } from '../../model/file';
import FileList from '../Common/FileList.vue';
import RecordIcon from '../Common/RecordIcon.vue';
import CustomizedIcon from '../CustomizedIcon.vue';

interface Props {
    /** 模型选项列表 */
    modelOptions?: any[];
    /** 当前选中的模型 */
    selectModel?: any;
    /** 是否启用深度思考模式 */
    isDeepThinking?: boolean;
    /** 是否正在流式加载 */
    isStreamLoad?: boolean;
    /** 是否为移动端 */
    isMobile?: boolean;
    /** 主题模式 */
    theme?: 'light' | 'dark';
    /** 国际化文本 */
    i18n?: {
        placeholder?: string;
        placeholderMobile?: string;
        uploadImg?: string;
        startRecord?: string;
        stopRecord?: string;
        answering?: string;
        notSupport?: string;
        uploadError?: string;
        recordTooLong?: string;
    };
}

const props = withDefaults(defineProps<Props>(), {
    modelOptions: () => [],
    selectModel: null,
    isDeepThinking: true,
    isStreamLoad: false,
    isMobile: false,
    theme: 'light',
    i18n: () => ({
        placeholder: '请输入您的问题',
        placeholderMobile: '请输入',
        uploadImg: '上传图片',
        startRecord: '开始录音',
        stopRecord: '停止录音',
        answering: '正在回答中...',
        notSupport: '不支持的文件格式',
        uploadError: '上传失败',
        recordTooLong: '录音时间过长'
    })
});

const emit = defineEmits<{
    (e: 'stop'): void;
    (e: 'send', value: string, fileList: FileProps[]): void;
    (e: 'modelChange', option: any): void;
    (e: 'toggleDeepThinking'): void;
    (e: 'uploadFile', files: File[]): void;
    (e: 'startRecord'): void;
    (e: 'stopRecord'): void;
    (e: 'message', type: 'warning' | 'error' | 'info', message: string): void;
}>();

/**
 * 输入框内容
 */
const inputValue = ref('')

/**
 * 是否正在录音
 */
const recording = ref(false)

/**
 * 文件列表
 */
const fileList = ref([] as FileProps[])

/**
 * 处理输入内容变化
 */
const handleInput = (value: string) => {
    inputValue.value = value
}

/**
 * 处理文件选择事件
 */
const handleFileSelect = async function (files: any[]) {
    if (files && files.length <= 0) return;
    const allowed = ['image/png', 'image/jpg', 'image/jpeg', 'image/bmp']
    const validFiles: File[] = [];
    
    files.forEach((item: any) => {
        const file = item.raw || item;
        if (!allowed.includes(file.type)) {
            emit('message', 'error', props.i18n.notSupport || '不支持的文件格式');
            return;
        }
        validFiles.push(file);
    });
    
    if (validFiles.length > 0) {
        emit('uploadFile', validFiles);
    }
}

/**
 * 删除文件
 */
const handleDeleteFile = async function (index: number) {
    fileList.value.splice(index, 1);
    fileList.value = [...fileList.value];
}

/**
 * 处理发送消息
 */
const handleSend = async function (value: string) {
    if (props.isStreamLoad) {
        emit('message', 'warning', props.i18n.answering || '正在回答中...');
        return
    }
    // 用户点击发送动作时结束录音
    handleStopRecord();
    emit('send', value, fileList.value);
}

/**
 * 处理开始录音事件
 */
const handleStartRecord = async () => {
    recording.value = true;
    emit('startRecord');
}

/**
 * 处理停止录音事件
 */
const handleStopRecord = () => {
    if (!recording.value) return;
    recording.value = false;
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
    <TChatSender class="sender-container" :value="inputValue" :textarea-props="{
        placeholder: isMobile ? i18n.placeholderMobile : i18n.placeholder,
        autosize: { minRows: 1, maxRows: 6 },
    }" @stop="emit('stop')" @send="handleSend" @change="handleInput" @paste="handlePaste">
        <template #inner-header>
            <FileList :fileList="fileList" :onDelete="handleDeleteFile"/>
        </template>
        <template #suffix>
            <!-- 等待中的发送按钮 -->
            <CustomizedIcon class="send-icon waiting" v-if="!isStreamLoad && !inputValue" nativeIcon :name="theme === 'dark' ? 'send_dark' : 'send'" @click="handleSend(inputValue)" />
            <!-- 可用的发送按钮 -->
            <CustomizedIcon class="send-icon success" v-if="!isStreamLoad && inputValue" nativeIcon name="send_fill" @click="handleSend(inputValue)" />
            <!-- 停止发送按钮 -->
            <CustomizedIcon class="send-icon stop" v-if="isStreamLoad" :name="theme === 'dark' ? 'pause_dark' : 'pause'" nativeIcon @click="emit('stop')" />
        </template>
        <template #prefix>
            <div class="sender-control-container">
                <t-upload class="sender-upload" ref="uploadRef1" :max="10" :multiple="true" :request-method="handleFileSelect"
                    accept="image/*" :showThumbnail="false" :showImageFileName="false" :showUploadProgress="false"
                    tips="">
                    <t-tooltip :content="i18n.uploadImg">
                        <span class="recording-icon">
                            <CustomizedIcon name="picture" :theme="theme" />
                        </span>
                    </t-tooltip>
                </t-upload>
                <t-tooltip v-if="!recording" :content="i18n.startRecord">
                    <span class="recording-icon" @click="handleStartRecord">
                        <CustomizedIcon name="voice_input" :theme="theme" />
                    </span>
                </t-tooltip>

                <t-tooltip v-if="recording" :content="i18n.stopRecord">
                    <span class="recording-icon stop-icon" @click="handleStopRecord">
                        <RecordIcon />
                    </span>
                </t-tooltip>
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
.send-icon.waiting{
    padding: 0;
}
.send-icon.success{
    padding: 0;
}
.send-icon.stop{
    padding: 0;
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
}
</style>
