<script setup lang="ts">
import { ref } from 'vue'
import { ChatSender as TChatSender } from '@tdesign-vue-next/chat'
import { uploadFile } from '@/service/upload';
import WebRecorder from "@/utils/webRecorder"
import type { FileProps } from '@/model/file';
import { handleGetAsrUrl } from '@/service/chat';
import { MessagePlugin } from 'tdesign-vue-next';
import CustomizedIcon from '@/components/CustomizedIcon.vue';
import RecordingIcon from '@/assets/icons/recording.svg';

/**
 * Sender组件属性定义
 * @typedef {Object} SenderProps
 * @property {any[]} modelOptions - 模型选项列表
 * @property {any} selectModel - 当前选中的模型
 * @property {boolean} isDeepThinking - 是否启用深度思考模式
 * @property {boolean} isStreamLoad - 是否正在流式加载
 * @property {() => void} onStop - 停止加载的回调函数
 * @property {(queryVal: string | undefined, fileList?: FileProps[] | undefined) => void} inputEnter - 输入确认的回调函数
 * @property {(option: any) => void} handleModelChange - 模型变更的回调函数
 * @property {() => void} toggleDeepThinking - 切换深度思考模式的回调函数
 */
const props = defineProps<{
    modelOptions: any[];
    selectModel: any;
    isDeepThinking: boolean;
    isStreamLoad: boolean;
    onStop: () => void;
    inputEnter: (queryVal: string | undefined, fileList?: FileProps[] | undefined) => void;
    handleModelChange: (option: any) => void;
    toggleDeepThinking: () => void;
}>();

/**
 * WebRecorder实例引用
 * @type {import('vue').Ref<WebRecorder | null>}
 */
const recorder = ref(null as WebRecorder | null)

/**
 * ASR WebSocket连接引用
 * @type {import('vue').Ref<WebSocket | null>}
 */
const asrWebSocket = ref(null as WebSocket | null)

/**
 * 输入框内容
 * @type {import('vue').Ref<string>}
 */
const inputValue = ref('')
/**
 * 开始语音时输入框内容
 * @type {import('vue').Ref<string>}
 */
const inputValueBefore = ref('')

/**
 * 处理输入内容变化
 * @param {string} value - 输入的新内容
 * @returns {void}
 */
const handleInput = (value: string) => {
    inputValue.value = value
}

/**
 * 是否正在录音
 * @type {import('vue').Ref<boolean>}
 */
const recording = ref(false)

/**
 * 文件列表
 * @type {import('vue').Ref<FileProps[]>}
 */
const fileList = ref([] as FileProps[])


/**
 * 处理文件选择事件
 * @param {any} res - 文件选择结果
 * @returns {Promise<void>}
 */
const handleFileSelect = async function (files: File[]) {
    console.log('handleFileSelect',files)
    if(files && files.length <= 0) return;
    const allowed = ['image/png', 'image/jpg', 'image/jpeg', 'image/bmp']
    files.map(async (item: File) => {
        if (!allowed.includes(item.type)) {
            MessagePlugin.error(`暂不支持该类型文件（支持类型：jpg/png）`)
            return
        }
        const res = await uploadFile({
            file: item
        })
        console.log('handleFileSelect res',res)
        if (res.Url) {
            fileList.value.push({
                uid: res.Url,
                name: '',
                status: 'done',
                response: '',
                url: res.Url,
            })
        }
    })

}

/**
 * 删除文件
 * @param {number} index - 文件在列表中的索引
 * @returns {void}
 */
const handleDeleteFile = async function (index: number) {
    fileList.value.splice(index, 1);
    fileList.value = [...fileList.value];
}

/**
 * 处理发送消息
 * @param {string} value - 要发送的消息内容
 * @returns {Promise<void>}
 */
const handleSend = async function (value: string) {
    // 用户点击发送动作时结束录音
    handleStopRecord();
    props.inputEnter && props.inputEnter(value, fileList.value)
}

/**
 * 开始录音
 * @returns {void}
 */
const startRecording = () => {
    const requestId = '0'
    recorder.value = new WebRecorder({ requestId: requestId })
    recorder.value.OnReceivedData = (data) => {
        if (asrWebSocket.value?.readyState === WebSocket.OPEN) {
            asrWebSocket.value?.send(data)
        }
    }
    // 录音失败时
    recorder.value.OnError = (err) => {
        MessagePlugin.error(err);
        recording.value = false
    }
    recorder.value.start()
    console.log('[asr] start')
}

/**
 * 处理开始录音事件
 * @returns {Promise<void>}
 */
const handleStartRecord = async () => {
    const res = await handleGetAsrUrl();
    recording.value = true;
    inputValueBefore.value = inputValue.value
    const url = res.url
    asrWebSocket.value = new WebSocket(url)
    asrWebSocket.value.onopen = () => {
        startRecording()
    }
    asrWebSocket.value.onmessage = (event) => {
        if (!recording.value) {
            return
        }
        const msg = JSON.parse(event.data)
        if ('result' in msg) {
            inputValue.value = inputValueBefore.value + msg['result']['voice_text_str']
        }
        if ('message' in msg && 'code' in msg && msg['code'] != 0) {
            MessagePlugin.error(msg['message']);
        }
    }
    asrWebSocket.value.onclose = () => {
        recording.value = false
    }
}

/**
 * 处理停止录音事件
 * @returns {void}
 */
const handleStopRecord = () => {
    console.log('[asr] stop')
    recorder.value?.stop()
    recorder.value = null
    asrWebSocket.value?.close()
    asrWebSocket.value = null
    recording.value = false
}

/**
 * 修改输入框内容（供外部调用）
 * @param {string} value - 新的输入内容
 * @returns {void}
 */
const changeSenderVal = (value: string, files: FileProps[]) => {
    inputValue.value = value;
    fileList.value = files;
}

const handlePaste = async (event: ClipboardEvent) => {
    try {
        const items = event.clipboardData?.items;
        if (!items || items.length === 0) {
          console.log('剪贴板中没有检测到内容', 'error');
          return;
        }
        
        // 查找所有图片项
        const imageItems = Array.from(items).filter((item: DataTransferItem) => 
          item.type.includes('image')
        ).map((i: DataTransferItem) => i.getAsFile()).filter((file): file is File => file !== null);
        handleFileSelect(imageItems)

    } catch (error) {
        console.error('粘贴图片出错:', error);
    }
};
/**
 * 暴露给父组件的方法
 */
defineExpose({
    changeSenderVal
})
</script>

<template>
    <TChatSender class="sender-container" :value="inputValue" :loading="isStreamLoad" :textarea-props="{
        placeholder: $t('conversation.input.placeholder'),
        autosize: { minRows: 1, maxRows: 2 },
    }" 
    @stop="onStop" @send="handleSend" @change="handleInput" @fileSelect="handleFileSelect" @paste="handlePaste">
        <template #inner-header>
            <div v-if="fileList.length > 0" class="file-upload-container">
                <div v-for="(img, index) in fileList" class="img-item-container">
                    <t-image fit="contain" :src="img.url" :style="{ width: '70px', height: '70px' }" />
                    <span class="delete-container">
                        <t-icon name="delete" @click="handleDeleteFile"></t-icon>
                    </span>
                </div>
            </div>

        </template>
        <template #suffix="{ renderPresets }">
            <component :is="renderPresets([])" />
        </template>
        <template #prefix>
            <div class="sender-control-container">
 <t-upload
                ref="uploadRef1"
                :max="10"
                :multiple="true"
                :request-method="handleFileSelect"
                accept="image/*"
                :showThumbnail="false"
                :showImageFileName="false"
                :showUploadProgress="false"
                tips=""
            >
                <t-tooltip  :content="$t('sender.uploadImg')">
                    <span class="sender-icon  recording-icon" >
                        <t-icon size="large" name="image"></t-icon>
                    </span>
                </t-tooltip>
            </t-upload>
            <t-tooltip v-if="!recording" :content="$t('sender.startRecord')">
                <span class="sender-icon  recording-icon" @click="handleStartRecord">
                    <t-icon size="large" name="microphone-1"></t-icon>
                </span>
            </t-tooltip>
                
            
            <t-tooltip v-if="recording" :content="$t('sender.stopRecord')">
                <span class="sender-icon recording-icon" @click="handleStopRecord">
                    <CustomizedIcon :svg="RecordingIcon" size="l" />
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

.img-item-container {
    border: 1px solid var(--td-component-border);
    width: 70px;
    height: 70px;
    margin-right: 8px;
    box-sizing: content-box;
    position: relative;
    display: inline-block;
}

.img-item-container:hover .delete-container {
    display: flex;
}

.delete-container {
    display: none;
    position: absolute;
    align-items: center;
    justify-content: center;
    z-index: 2;
    right: 2px;
    top: 2px;
    padding: 4px;
    background-color: var(--td-bg-color-secondarycontainer);
    border-radius: var(--td-radius-medium);
    border: 1px solid var(--td-border-level-2-color);
    cursor: pointer;
}

.delete-container:hover,
.recording-icon:hover {
    cursor: pointer;
    color: var(--td-brand-color);
}

.file-upload-container {
    padding-top: 8px;
    padding-left: 10px;
}
.sender-icon {
    margin-right: var(--td-comp-margin-m);
    height: var(--td-size-7);
}
.sender-control-container{
    display: flex;
    align-items: center;
}
/* TODO: 当前版本不支持，后续再开放 */
:deep(.t-button:has(.t-icon-file-attachment)){
     display: none;
}
.sender-container{
    width: 100%;
    max-width: 800px;
}
:deep(.t-chat-sender__textarea){
    background-color: var(--td-bg-color-container);
    border-radius: 8px;
}
:deep(.t-chat-sender__footer){
    padding:0px var(--td-comp-paddingLR-s);
}
</style>
