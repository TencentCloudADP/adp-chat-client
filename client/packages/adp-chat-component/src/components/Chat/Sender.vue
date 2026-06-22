<!-- 消息发送组件，支持富文本编辑、图片上传、文件上传、语音输入 -->
<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
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
import type { NormalizedSkill, SkillSelectEvent, SkillsI18n, AgentSkillInfo, ManageSkillItem } from '../../model/skills';
import { defaultSkillsI18n, defaultSkillsI18nEn, AgentSkillType } from '../../model/skills';
import { normalizeSkill, normalizeManageItem } from '../../composables/useSkills';
import { fetchGlobalAgent, uninstallSkill as uninstallSkillApi } from '../../service/skillsApi';
import RecordIcon from '../Common/RecordIcon.vue';
import FileList from '../Common/FileList.vue';
import CustomizedIcon from '../CustomizedIcon.vue';
import WebRecorder from '../../utils/webRecorder';
import { getAsrUrl } from '../../service/api';
import QaEditor from '../QaEditor/index.vue';
import ModelSelector from '../Common/ModelSelector.vue';
import type { ModelOption, SelectedModel } from '../Common/ModelSelector.vue';
import { useAgentStore } from '../../composables/useAgentStore';
import SkillsPopover from '../Skills/SkillsPopover.vue';
import SkillsInstallDialog from '../Skills/SkillsInstallDialog.vue';
import SkillManageDialog from '../Skills/SkillManageDialog.vue';
import ConnectorDialog from '../Connector/ConnectorDialog.vue';
import PluginInstallDialog from '../Plugin/PluginInstallDialog.vue';

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
    /** 当前应用 ID（用于初始化时创建用户 Agent） */
    currentApplicationId?: string;
    /** 本地 Agent 配置接口路径覆盖（GET/POST /agent/config） */
    agentConfigApi?: string;
    /** 是否显示模型选择器 */
    showModelSelector?: boolean;
    /** 模型选择器：当前选中模型 */
    selectedModel?: SelectedModel;
    /** 模型选择器：候选模型列表（不传则由组件内部拉取） */
    modelOptions?: ModelOption[];
    /** 模型列表接口路径覆盖 */
    listModelApi?: string;
    /** 国际化文本 */
    i18n?: SenderI18n;
    /** 是否启用 Skills 功能 */
    enableSkills?: boolean;
    /** 已安装 Skills 列表（标准化后） */
    installedSkills?: NormalizedSkill[];
    /** Skills 数据加载中 */
    skillsLoading?: boolean;
    /** 已安装 Skill ID 集合 */
    installedSkillIds?: string[];
    /** 空间 ID（Skills API 需要） */
    spaceId?: string;
    /** 应用 ID（Skills /adp/ 转发需要） */
    skillsApplicationId?: string;
    /** Skills 国际化文本 */
    skillsI18n?: Partial<SkillsI18n>;
}

const props = withDefaults(defineProps<Props>(), {
    ...chatRelatedPropsDefaults,
    isStreamLoad: false,
    useInternalRecord: false,
    asrUrlApi: '',
    enableVoiceInput: true,
    isUploading: false,
    currentApplicationId: '',
    agentConfigApi: '',
    showModelSelector: true,
    selectedModel: () => ({} as SelectedModel),
    modelOptions: () => [],
    listModelApi: '',
    i18n: () => ({}),
    enableSkills: true,
    installedSkills: () => [],
    skillsLoading: false,
    installedSkillIds: () => [],
    spaceId: '',
    skillsApplicationId: '',
    skillsI18n: () => ({}),
});

/** Agent 全局 store */
const { fetchAndSetAgentId } = useAgentStore();

const i18n = computed(() => {
    const defaults = props.language?.startsWith('en') ? defaultSenderI18nEn : defaultSenderI18n;
    return { ...defaults, ...props.i18n };
});

/** Skills 功能是否启用：显式传 true，或 spaceId 存在时自动启用 */
const skillsEnabled = computed(() => props.enableSkills || !!props.spaceId);

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
    (e: 'update:selectedModel', model: ModelOption): void;
    (e: 'modelChange', model: ModelOption): void;
    /** Skills 选中事件 */
    (e: 'skill-select', item: SkillSelectEvent): void;
    /** Skills 浮层显隐变化 */
    (e: 'skills-visible-change', visible: boolean): void;
    /** 打开 Skills 管理 */
    (e: 'skills-manage'): void;
    /** Skill 安装 */
    (e: 'skill-installed', skill: Record<string, unknown>): void;
    /** Skill 卸载 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: 'skill-uninstalled', skill: any): void;
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

// ─── Skills 状态 ──────────────────────────────────────────────────
const skillsI18n = computed<Required<SkillsI18n>>(() => {
    const defaults = props.language?.startsWith('en') ? defaultSkillsI18nEn : defaultSkillsI18n;
    return { ...defaults, ...props.skillsI18n };
});

/** 已安装 Skills 原始数据 */
const skillList = ref<AgentSkillInfo[]>([]);
/** 正在刷新 */
const skillsRefreshing = ref(false);

/** 浮层用的标准化列表 */
const normalizedSkills = computed<NormalizedSkill[]>(() => {
    return skillList.value
        .filter((s) => !!(s.skill_display_name || s.SkillDisplayName))
        .sort((a, b) => {
            const aType = a.skill_type ?? a.SkillType ?? 0;
            const bType = b.skill_type ?? b.SkillType ?? 0;
            return (aType === AgentSkillType.HUB_PRESET ? 1 : 0) - (bType === AgentSkillType.HUB_PRESET ? 1 : 0);
        })
        .map(normalizeSkill);
});

/** 管理弹窗用的列表 */
const manageItems = computed<ManageSkillItem[]>(() => {
    return skillList.value
        .filter((s) => !!(s.skill_display_name || s.SkillDisplayName))
        .sort((a, b) => {
            const aType = a.skill_type ?? a.SkillType ?? 0;
            const bType = b.skill_type ?? b.SkillType ?? 0;
            return (aType === AgentSkillType.HUB_PRESET ? 1 : 0) - (bType === AgentSkillType.HUB_PRESET ? 1 : 0);
        })
        .map(normalizeManageItem);
});

/** 已安装 Skill ID 集合 */
const skillsInstalledIds = computed(() => {
    return [...new Set(skillList.value.map((s) => (s.skill_id || s.SkillId || '')).filter(Boolean))];
});

/** 刷新 Skills 列表 */
async function refreshSkills() {
    const appId = props.skillsApplicationId;
    // TODO: spaceId 后续从实际空间上下文获取，当前使用默认值
    const spId = props.spaceId || 'default_space';
    console.log('[Sender] refreshSkills, appId:', appId, 'spaceId:', spId);
    if (!appId) {
        console.warn('[Sender] refreshSkills skipped: no applicationId');
        return;
    }
    skillsRefreshing.value = true;
    try {
        console.log('[Sender] calling fetchGlobalAgent');
        const result = await fetchGlobalAgent({
            applicationId: appId,
            spaceId: spId,
        });
        console.log('[Sender] fetchGlobalAgent result:', result);
        skillList.value = result.skills as AgentSkillInfo[];
    } catch (e) {
        console.error('[Sender] refreshSkills error:', e);
    } finally {
        skillsRefreshing.value = false;
    }
}

/** 卸载 Skill */
async function removeSkillById(skillId: string) {
    const appId = props.skillsApplicationId;
    if (!appId) return;
    try {
        await uninstallSkillApi({
            applicationId: appId,
            skill_id: skillId,
            space_id: props.spaceId || '',
        });
        skillList.value = skillList.value.filter(
            (s) => (s.skill_id || s.SkillId) !== skillId
        );
    } catch (e) {
        console.error('[Sender] removeSkill error:', e);
    }
}

// 监听 skillsApplicationId 变化，有值时自动刷新
watch(
    () => props.skillsApplicationId,
    (appId) => {
        console.log('[Sender] skillsApplicationId changed:', appId);
        if (appId && skillList.value.length === 0) {
            refreshSkills();
        }
    },
    { immediate: true }
);

const skillsPopoverRef = ref<InstanceType<typeof SkillsPopover> | null>(null);
const showSkillsInstall = ref(false);
const showSkillsManage = ref(false);
// Connector + Plugin
const showConnector = ref(false);
const showPlugin = ref(false);

// ─── Skills 事件处理 ──────────────────────────────────────────────
const onSkillsPopoverSelect = (item: SkillSelectEvent) => {
    emit('skill-select', item);
};

const onSkillsVisibleChange = (visible: boolean) => {
    emit('skills-visible-change', visible);
    console.log('[Sender] onSkillsVisibleChange, visible:', visible);
    if (visible) {
        refreshSkills();
    }
};

const onSkillsManage = () => {
    emit('skills-manage');
    refreshSkills();
    showSkillsManage.value = true;
};

const onSkillInstalled = (skill: Record<string, unknown>) => {
    emit('skill-installed', skill);
    refreshSkills();
    showSkillsInstall.value = false;
};

const onSkillUninstalled = (skill: Record<string, unknown>) => {
    emit('skill-uninstalled', skill);
    refreshSkills();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSkillDeleted = (item: any) => {
    removeSkillById(item.id);
    emit('skill-uninstalled', item);
};

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

const fetchAgentByApplicationId = (applicationId: string) => {
    fetchAndSetAgentId({
        applicationId,
        agentConfigApiPath: props.agentConfigApi || undefined,
    });
};

// 监听外部 currentApplicationId 变化，重新拉取 Agent
watch(() => props.currentApplicationId, (newVal) => {
    if (newVal) {
        fetchAgentByApplicationId(newVal);
    }
});

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    // 初始化：拉取 Agent 摘要列表，取 agent_list[0].agent_id 作为当前上下文 agent_id
    if (props.currentApplicationId) {
        fetchAgentByApplicationId(props.currentApplicationId);
    }
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

                <!-- 模型选择器（按钮模式） -->
                <ModelSelector
                    v-if="showModelSelector"
                    class="sender-model-selector"
                    :selected="selectedModel"
                    :options="modelOptions"
                    :list-model-api="listModelApi || undefined"
                    is-button-mode
                    @update:selected="(model: ModelOption) => { emit('update:selectedModel', model); emit('modelChange', model); }"
                />

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

                <!-- Skills 按钮 -->
                <SkillsPopover
                    v-if="skillsEnabled"
                    ref="skillsPopoverRef"
                    :installed-skills="normalizedSkills"
                    :loading="skillsRefreshing"
                    :i18n="skillsI18n"
                    :language="language"
                    @select="onSkillsPopoverSelect"
                    @manage="onSkillsManage"
                    @visible-change="onSkillsVisibleChange"
                />

                <!-- 连接器按钮 -->
                <div class="toolbar-pill-btn" @click="showConnector = true">
                    <CustomizedIcon remote name="basic_api_line" size="s" :show-hover-bg="false" :color="'var(--td-text-color-secondary)'" />
                    <span class="toolbar-pill-btn__text">{{ skillsI18n.connector }}</span>
                </div>

                <!-- 工具按钮 -->
                <div class="toolbar-pill-btn" @click="showPlugin = true">
                    <CustomizedIcon remote name="basic_plugin_line" size="s" :show-hover-bg="false" :color="'var(--td-text-color-secondary)'" />
                    <span class="toolbar-pill-btn__text">{{ skillsI18n.tools }}</span>
                </div>
            </div>

            <div class="sender-toolbar__right">
                <CustomizedIcon class="send-icon waiting" :class="{ disabled: sendDisabled }" v-if="!isStreamLoad && !hasContent" nativeIcon :showHoverBg="false" :name="theme === 'dark' ? 'send_dark' : 'send'" @click="handleSend" />
                <CustomizedIcon class="send-icon success" :class="{ disabled: sendDisabled }" v-if="!isStreamLoad && hasContent" nativeIcon :showHoverBg="false" name="send_fill" @click="handleSend" />
                <CustomizedIcon class="send-icon stop" v-if="isStreamLoad" nativeIcon :showHoverBg="false" :name="theme === 'dark' ? 'pause_dark' : 'pause'" @click="emit('stop')" />
            </div>
        </div>

        <!-- Skills 安装弹窗 -->
        <SkillsInstallDialog
            v-if="skillsEnabled"
            v-model="showSkillsInstall"
            :installed-skill-ids="Array.from(skillsInstalledIds)"
            :application-id="skillsApplicationId"
            :space-id="spaceId"
            :i18n="skillsI18n"
            :language="language"
            @skill-installed="onSkillInstalled"
        />

        <!-- Skills 管理弹窗 -->
        <SkillManageDialog
            v-if="skillsEnabled"
            v-model="showSkillsManage"
            :manage-list="manageItems"
            :loading="skillsRefreshing"
            :i18n="skillsI18n"
            :language="language"
            @add="showSkillsInstall = true"
            @delete="onSkillDeleted"
        />

        <!-- 连接器弹窗 -->
        <ConnectorDialog v-if="skillsEnabled" v-model="showConnector" :application-id="skillsApplicationId" />

        <!-- 工具安装弹窗 -->
        <PluginInstallDialog v-if="skillsEnabled" v-model="showPlugin" :application-id="skillsApplicationId" />
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
    padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-m) 0;
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
    padding: var(--td-comp-paddingTB-xxs) var(--td-comp-paddingLR-s) var(--td-comp-paddingTB-s);
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
    width: var(--td-comp-size-m);
    height: var(--td-comp-size-m);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: var(--td-radius-default);
    transition: background 0.2s, transform 0.2s;
}

.plus-btn:hover {
    background-color: var(--td-bg-color-container-active);
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
    padding: var(--td-pop-padding-m);
    border-radius: var(--td-radius-large);
    background: var(--td-bg-color-container);
    box-shadow: var(--td-shadow-2);
    z-index: 2000;
}

.plus-menu-item {
    display: flex;
    align-items: center;
    gap: var(--td-comp-margin-s);
    padding: var(--td-comp-paddingTB-s);
    border-radius: var(--td-radius-medium);
    font-size: var(--td-font-size-body-small);
    line-height: var(--td-line-height-body-small);
    color: var(--td-text-color-primary);
    cursor: pointer;
    transition: background 0.15s;
}

.plus-menu-item:hover {
   background-color: var(--td-bg-color-container-active);
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

/* 模型选择器 */
.sender-model-selector {
    display: inline-flex;
    align-items: center;
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

/* Skills 添加按钮 */
.skills-add-btn {
    height: var(--td-comp-size-m);
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    margin-left: 2px;
}

/* 工具栏 pill 按钮（连接器、工具） */
.toolbar-pill-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 16px;
    font-size: 12px;
    line-height: 16px;
    color: var(--td-text-color-primary);
    cursor: pointer;
    white-space: nowrap;
    transition: background-color 0.2s;
}
.toolbar-pill-btn:hover {
    background: var(--td-bg-color-container-active);
}
.toolbar-pill-btn__text {
    white-space: nowrap;
}
</style>
