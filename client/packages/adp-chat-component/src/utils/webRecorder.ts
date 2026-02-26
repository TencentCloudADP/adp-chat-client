// https://github.com/TencentCloud/tencentcloud-speech-sdk-js/blob/main/asr/app/webrecorder.js

/**
 * Web录音器参数接口
 * @property {boolean | string} [echoCancellation] - 是否启用回声消除
 */
interface WebRecorderParams {
    echoCancellation?: boolean | string;
}

/**
 * Web录音器选项接口
 * @property {string} requestId - 请求ID
 * @property {WebRecorderParams} [params] - 录音器参数
 * @property {boolean} [isLog] - 是否启用日志
 */
interface WebRecorderOptions {
    requestId: string;
    params?: WebRecorderParams;
    isLog?: boolean;
}

/**
 * 音频工作线程消息接口
 * @property {Int8Array} audioData - 音频数据
 * @property {number} sampleCount - 采样数量
 * @property {number} bitCount - 比特数量
 */
interface AudioWorkletMessage {
    audioData: Int8Array;
    sampleCount: number;
    bitCount: number;
}

/**
 * 将Float32Array转换为16位PCM格式
 * @param {Float32Array} input - 输入的浮点音频数据
 * @returns {DataView} 转换后的16位PCM数据视图
 * @description 将32位浮点音频数据转换为16位有符号整数PCM格式
 * @example
 * const floatData = new Float32Array([0.5, -0.3, 0.8]);
 * const pcmData = to16BitPCM(floatData);
 */
export function to16BitPCM(input: Float32Array): DataView {
    const dataLength = input.length * (16 / 8);
    const dataBuffer = new ArrayBuffer(dataLength);
    const dataView = new DataView(dataBuffer);
    let offset = 0;
    for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]!));
        dataView.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return dataView;
}

export function to16kHz(audioData: Float32Array | number[], sampleRate: number = 44100): Float32Array {
    const data = new Float32Array(audioData);
    const fitCount = Math.round(data.length * (16000 / sampleRate));
    const newData = new Float32Array(fitCount);
    const springFactor = (data.length - 1) / (fitCount - 1);
    newData[0] = data[0]!;
    for (let i = 1; i < fitCount - 1; i++) {
        const tmp = i * springFactor;
        const before = Math.floor(tmp);
        const after = Math.ceil(tmp);
        const atPoint = tmp - before;
        newData[i] = data[before]! + (data[after]! - data[before]!) * atPoint;
    }
    newData[fitCount - 1] = data[data.length - 1]!;
    return newData;
}

const audioWorkletCode = `
class MyProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super(options);
        this.audioData = [];
        this.sampleCount = 0;
        this.bitCount = 0;
        this.preTime = 0;
    }

    process(inputs) {
        if (inputs[0][0]) {
            const output = ${to16kHz.toString()}(inputs[0][0], sampleRate);
            this.sampleCount += 1;
            const audioData = ${to16BitPCM.toString()}(output);
            this.bitCount += 1;
            const data = [...new Int8Array(audioData.buffer)];
            this.audioData = this.audioData.concat(data);
            if (new Date().getTime() - this.preTime > 100) {
                this.port.postMessage({
                    audioData: new Int8Array(this.audioData),
                    sampleCount: this.sampleCount,
                    bitCount: this.bitCount
                });
                this.preTime = new Date().getTime();
                this.audioData = [];
            }
            return true;
        }
    }
}

registerProcessor('my-processor', MyProcessor);
`;

const TAG = 'WebRecorder';

declare global {
    interface Navigator {
        getUserMedia?: (
            constraints: MediaStreamConstraints,
            successCallback: (stream: MediaStream) => void,
            errorCallback: (error: Error) => void
        ) => void;
        webkitGetUserMedia?: Navigator['getUserMedia'];
        mozGetUserMedia?: Navigator['getUserMedia'];
        msGetUserMedia?: Navigator['getUserMedia'];
    }
}

export default class WebRecorder {
    private audioData: number[] = [];
    private allAudioData: number[] = [];
    private stream: MediaStream | null = null;
    private audioContext: AudioContext | null = null;
    private requestId: string;
    private frameTime: string[] = [];
    private frameCount: number = 0;
    private sampleCount: number = 0;
    private bitCount: number = 0;
    private mediaStreamSource: MediaStreamAudioSourceNode | null = null;
    private isLog: boolean;
    private params?: WebRecorderParams;
    private preTime: number = 0;
    private getDataCount: number = 0;
    private audioTrack?: MediaStreamTrack;

    public OnReceivedData: (data: Int8Array) => void = () => {};
    public OnError: (error: any) => void = () => {};
    public OnStop: (data: number[]) => void = () => {};

    constructor({ requestId, params, isLog = false }: WebRecorderOptions) {
        this.requestId = requestId;
        this.params = params;
        this.isLog = isLog;
    }

    static isSupportMediaDevicesMedia(): boolean {
        return !!(navigator.getUserMedia || (navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
    }

    static isSupportUserMediaMedia(): boolean {
        return !!navigator.getUserMedia;
    }

    static isSupportAudioContext(): boolean {
        return typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined';
    }

    static isSupportMediaStreamSource(audioContext: AudioContext): boolean {
        return typeof audioContext.createMediaStreamSource === 'function';
    }

    static isSupportAudioWorklet(audioContext: AudioContext): boolean {
        return !!audioContext.audioWorklet && 
               typeof audioContext.audioWorklet.addModule === 'function' &&
               typeof AudioWorkletNode !== 'undefined';
    }

    static isSupportCreateScriptProcessor(audioContext: AudioContext): boolean {
        return typeof audioContext.createScriptProcessor === 'function';
    }

    start(): void {
        this.frameTime = [];
        this.frameCount = 0;
        this.allAudioData = [];
        this.audioData = [];
        this.sampleCount = 0;
        this.bitCount = 0;
        this.getDataCount = 0;
        this.audioContext = null;
        this.mediaStreamSource = null;
        this.stream = null;
        this.preTime = 0;

        try {
            if (WebRecorder.isSupportAudioContext()) {
                this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            } else {
                this.isLog && console.log(this.requestId, '浏览器不支持AudioContext', TAG);
                this.OnError({ code: 'AUDIO_CONTEXT_NOT_SUPPORT' });
            }
        } catch (e) {
            this.isLog && console.log(this.requestId, '浏览器不支持webAudioApi相关接口', e, TAG);
            this.OnError({ code: 'WEB_AUDIO_API_NOT_SUPPORT' });
        }

        this.getUserMedia(this.requestId, this.getAudioSuccess.bind(this), this.getAudioFail.bind(this));
    }

    stop(): void {
        try {
            this.audioContext && this.audioContext.suspend();
        } catch (e) {
        }
        this.destroyStream();
        this.isLog && console.log(this.requestId, `webRecorder stop ${this.sampleCount}/${this.bitCount}/${this.getDataCount}`, JSON.stringify(this.frameTime), TAG);
        this.OnStop(this.allAudioData);
    }

    destroyStream(): void {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }

    private async getUserMedia(requestId: string, getStreamAudioSuccess: (requestId: string, stream: MediaStream) => void, getStreamAudioFail: (requestId: string, error: Error) => void): Promise<void> {
        let audioOption: MediaTrackConstraints = {
            echoCancellation: true,
        };

        if (this.params && String(this.params.echoCancellation) === 'false') {
            audioOption = {
                echoCancellation: false,
            };
        }

        const mediaOption: MediaStreamConstraints = {
            audio: audioOption,
            video: false,
        };

        if (WebRecorder.isSupportMediaDevicesMedia()) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia(mediaOption);
                this.stream = stream;
                getStreamAudioSuccess(requestId, stream);
            } catch (e) {
                getStreamAudioFail(requestId, e as Error);
            }
        } else if (WebRecorder.isSupportUserMediaMedia()) {
            navigator.getUserMedia?.(
                mediaOption,
                stream => {
                    this.stream = stream;
                    getStreamAudioSuccess(requestId, stream);
                },
                error => {
                    getStreamAudioFail(requestId, error);
                }
            );
        } else {
            if (navigator.userAgent.toLowerCase().match(/chrome/) && location.origin.indexOf('https://') < 0) {
                this.isLog && console.log(this.requestId, 'chrome下获取浏览器录音功能，因为安全性问题，需要在localhost或127.0.0.1或https下才能获取权限', TAG);
                this.OnError({ code: 'CHROME_SECURITY_ERROR' });
            } else {
                this.isLog && console.log(this.requestId, '无法获取浏览器录音功能，请升级浏览器或使用chrome', TAG);
                this.OnError({ code: 'BROWSER_NOT_SUPPORT' });
            }
            this.audioContext && this.audioContext.close();
        }
    }

    private async getAudioSuccess(requestId: string, stream: MediaStream): Promise<void> {
        if (!this.audioContext) {
            return;
        }

        if (this.mediaStreamSource) {
            this.mediaStreamSource.disconnect();
            this.mediaStreamSource = null;
        }

        this.audioTrack = stream.getAudioTracks()[0];
        const mediaStream = new MediaStream();
        if (this.audioTrack) {
            mediaStream.addTrack(this.audioTrack);
        }
        this.mediaStreamSource = this.audioContext.createMediaStreamSource(mediaStream);

        if (WebRecorder.isSupportMediaStreamSource(this.audioContext)) {
            if (WebRecorder.isSupportAudioWorklet(this.audioContext)) {
                await this.audioWorkletNodeDealAudioData(this.mediaStreamSource, requestId);
            } else {
                this.scriptNodeDealAudioData(this.mediaStreamSource, requestId);
            }
        } else {
            this.isLog && console.log(this.requestId, '不支持MediaStreamSource', TAG);
            this.OnError({ code: 'MEDIA_STREAM_SOURCE_NOT_SUPPORT' });
        }
    }

    private getAudioFail(requestId: string, err: Error): void {
        if (err && (err as any).name === 'NotAllowedError') {
            this.isLog && console.log(requestId, '授权失败', JSON.stringify(err), TAG);
        }
        this.isLog && console.log(this.requestId, 'getAudioFail', JSON.stringify(err), TAG);
        this.OnError(err);
        this.stop();
    }

    private scriptNodeDealAudioData(mediaStreamSource: MediaStreamAudioSourceNode, requestId: string): void {
        if (!this.audioContext || !WebRecorder.isSupportCreateScriptProcessor(this.audioContext)) {
            this.isLog && console.log(this.requestId, '不支持createScriptProcessor', TAG);
            return;
        }

        const scriptProcessor = this.audioContext.createScriptProcessor(1024, 1, 1);
        mediaStreamSource.connect(scriptProcessor);
        scriptProcessor.connect(this.audioContext.destination);

        scriptProcessor.onaudioprocess = (e) => {
            this.getDataCount += 1;
            const inputData = e.inputBuffer.getChannelData(0);
            const output = to16kHz(inputData, this.audioContext?.sampleRate || 44100);
            const audioData = to16BitPCM(output);
            this.audioData.push(...new Int8Array(audioData.buffer));
            this.allAudioData.push(...new Int8Array(audioData.buffer));

            if (new Date().getTime() - this.preTime > 100) {
                this.frameTime.push(`${Date.now()}-${this.frameCount}`);
                this.frameCount += 1;
                this.preTime = new Date().getTime();
                const audioDataArray = new Int8Array(this.audioData);
                this.OnReceivedData(audioDataArray);
                this.audioData = [];
                this.sampleCount += 1;
                this.bitCount += 1;
            }
        };
    }

    private async audioWorkletNodeDealAudioData(mediaStreamSource: MediaStreamAudioSourceNode, requestId: string): Promise<void> {
        if (!this.audioContext) return;

        try {
            const audioWorkletBlobURL = URL.createObjectURL(new Blob([audioWorkletCode], { type: 'text/javascript' }));
            await this.audioContext.audioWorklet.addModule(audioWorkletBlobURL);
            URL.revokeObjectURL(audioWorkletBlobURL);

            const myNode = new AudioWorkletNode(this.audioContext, 'my-processor', { 
                numberOfInputs: 1, 
                numberOfOutputs: 1, 
                channelCount: 1 
            });

            myNode.onprocessorerror = () => {
                this.scriptNodeDealAudioData(mediaStreamSource, requestId);
                return false;
            };

            myNode.port.onmessage = (event: MessageEvent<AudioWorkletMessage>) => {
                this.frameTime.push(`${Date.now()}-${this.frameCount}`);
                this.OnReceivedData(event.data.audioData);
                this.frameCount += 1;
                this.allAudioData.push(...event.data.audioData);
                this.sampleCount = event.data.sampleCount;
                this.bitCount = event.data.bitCount;
            };

            myNode.port.onmessageerror = () => {
                this.scriptNodeDealAudioData(mediaStreamSource, requestId);
                return false;
            };

            mediaStreamSource.connect(myNode).connect(this.audioContext.destination);
        } catch (e) {
            this.isLog && console.log(this.requestId, 'audioWorkletNodeDealAudioData catch error', JSON.stringify(e), TAG);
            this.OnError(e);
        }
    }
}

if (typeof window !== 'undefined') {
    (window as any).WebRecorder = WebRecorder;
}
