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
import { SlateTransforms, SlateEditor, SlateNode } from '@wangeditor/editor';
import type { IDomEditor } from '@wangeditor/editor';
import SkillsPopover from '../Skills/SkillsPopover.vue';
import SkillsInstallDialog from '../Skills/SkillsInstallDialog.vue';
import SkillManageDialog from '../Skills/SkillManageDialog.vue';
import ConnectorDialog from '../Connector/ConnectorDialog.vue';
import PluginInstallDialog from '../Plugin/PluginInstallDialog.vue';
import PluginManageDialog from '../Plugin/PluginManageDialog.vue';
import AtMentionPanel from './AtMentionPanel.vue';

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
const { fetchAndSetAgentId, getAgentIdByAppId } = useAgentStore();

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
    /**
     * mention 列表更新：包含已注册 skills/tools/connectors 的标准化数据，
     * 父组件可将其透传给 ChatItem/MdContent，用于把消息中的 @skill:/@tool: 还原为蓝色 chip
     */
    (e: 'mention-list-update', payload: { skills: NormalizedSkill[]; tools: NormalizedSkill[]; connectors: NormalizedSkill[] }): void;
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
/** 已安装 Plugin 原始数据 */
const installedPlugins = ref<Record<string, unknown>[]>([]);
/** 已安装 Tool 原始数据 */
const installedToolsRaw = ref<Record<string, unknown>[]>([]);
/** 当前 Agent ID（从 DescribeAgentDetail 获取） */
const currentAgentId = ref('');
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

/** 从 ToolList（有 IconUrl）+ PluginList（有 PluginClass）交叉提取 mention 数据 */
function getPluginClassMap(): Map<string, number> {
    const m = new Map<string, number>();
    installedPlugins.value.forEach((p) => {
        const id = (p.PluginId || p.plugin_id || '') as string;
        if (id) m.set(id, (p.PluginClass ?? p.plugin_class ?? 0) as number);
    });
    return m;
}

function getPluginId(t: Record<string, unknown>): string {
    const cfg = (t.Config || t.config || {}) as Record<string, unknown>;
    return (cfg.plugin_id || cfg.pluginid || cfg.PluginId || '') as string;
}

/**
 * 解析工具原始名称
 * 后端 tool_name 形如 "中文别名/英文工具名"，按最后一个 "/" 拆分：
 * - displayName 取 "/" 前的中文别名
 * - name 取 "/" 后的英文技术名
 * 无 "/" 时两者相同
 */
function parseToolRaw(t: Record<string, unknown>): { displayName: string; name: string } {
    const cfg = (t.Config || t.config || {}) as Record<string, unknown>;
    const raw = String(
        t.tool_name || t.ToolName || t.name || t.Name || cfg.description || cfg.Description || '',
    );
    const idx = raw.lastIndexOf('/');
    if (idx > -1) {
        return { displayName: raw.slice(0, idx), name: raw.slice(idx + 1) };
    }
    return { displayName: raw, name: raw };
}

/** 所属插件名称，用于无中文别名时拼接展示 */
function toolPluginName(t: Record<string, unknown>): string {
    return String(t.plugin_name || t.PluginName || t.PluginDisplayName || t.plugin_display_name || '');
}

/** 工具技术名（英文），用于序列化为 @tool:name */
function toolName(t: Record<string, unknown>): string {
    const { name } = parseToolRaw(t);
    return name || ((t.tool_id || t.ToolId || '') as string);
}

/**
 * 工具展示名（中文优先）：
 * - tool_name 含 "中文/英文" 时取中文别名
 * - 无中文别名（displayName === name）时，回退「插件名/英文名」，再回退英文名
 */
function toolDisplayName(t: Record<string, unknown>): string {
    const { displayName, name } = parseToolRaw(t);
    if (displayName && name && displayName !== name) {
        return displayName;
    }
    const pluginName = toolPluginName(t);
    if (pluginName && pluginName !== name) {
        return `${pluginName}/${name}`;
    }
    return displayName || name || ((t.tool_id || t.ToolId || '') as string);
}

const mentionConnectors = computed<NormalizedSkill[]>(() => {
    const m = getPluginClassMap();
    return installedToolsRaw.value
        .filter((t) => m.get(getPluginId(t)) === 1)
        .map((t) => ({
            id: getPluginId(t) || ((t.tool_id || t.ToolId || '') as string),
            name: toolName(t),
            displayName: toolDisplayName(t),
            iconUrl: (t.IconUrl || t.icon_url || '') as string,
        }));
});

const mentionTools = computed<NormalizedSkill[]>(() => {
    const m = getPluginClassMap();
    return installedToolsRaw.value
        .filter((t) => m.get(getPluginId(t)) === 0)
        .map((t) => ({
            id: getPluginId(t) || ((t.tool_id || t.ToolId || '') as string),
            name: toolName(t),
            displayName: toolDisplayName(t),
            iconUrl: (t.IconUrl || t.icon_url || '') as string,
        }));
});

/** 已安装 Skill ID 集合 */
const skillsInstalledIds = computed(() => {
    return [...new Set(skillList.value.map((s) => (s.skill_id || s.SkillId || '')).filter(Boolean))];
});

/** 已安装工具 ID 集合（传递给 PluginInstallDialog 用于判断已添加状态） */
const currentInstalledToolIds = computed<string[]>(() => {
    return installedToolsRaw.value.map((t) => {
        const cfg = (t.Config || t.config || {}) as Record<string, unknown>;
        return (cfg.tool_id || cfg.ToolId || t.tool_id || t.ToolId || '') as string;
    }).filter(Boolean);
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
        installedPlugins.value = result.plugins;
        installedToolsRaw.value = result.tools;
        currentAgentId.value = result.agentId || getAgentIdByAppId(appId);
    } catch (e) {
        console.error('[Sender] refreshSkills error:', e);
    } finally {
        skillsRefreshing.value = false;
    }
}

/** 已注册 mention 数据变化时向父组件 emit，父组件再透传给 ChatItem/MdContent 渲染 chip */
watch(
    [skillList, installedToolsRaw],
    () => {
        // eslint-disable-next-line no-console
        console.log('[Sender] emit mention-list-update (raw data changed)',
            'skills:', normalizedSkills.value.length,
            'tools:', mentionTools.value.length,
            'connectors:', mentionConnectors.value.length);
        emit('mention-list-update', {
            skills: normalizedSkills.value,
            tools: mentionTools.value,
            connectors: mentionConnectors.value,
        });
    },
    { immediate: true },
);

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
const showPluginManage = ref(false);

// ─── @ Mention ───────────────────────────────────────────────
const atMentionVisible = ref(false);
const atMentionStyle = ref({ top: '0px', left: '0px' });
const mentionPanelRef = ref<InstanceType<typeof AtMentionPanel> | null>(null);
const mentionSearchStr = ref('');
let _editableEl: HTMLElement | null = null;

function _ensureEditableEl(): HTMLElement | null {
    if (_editableEl) return _editableEl;
    const editor = qaEditorRef.value;
    if (!editor) return null;
    _editableEl = (editor.$el || editor).querySelector('[contenteditable="true"]') as HTMLElement;
    return _editableEl;
}

function _getCaretPosition(): { top: number; left: number } | null {
    const el = _ensureEditableEl();
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const sel = window.getSelection();
    if (!sel?.rangeCount) return { top: rect.top, left: rect.left };
    const range = sel.getRangeAt(0).cloneRange();
    range.collapse(true);
    const caretRect = range.getClientRects()[0];
    return {
        top: caretRect ? caretRect.top : rect.top,
        left: caretRect ? caretRect.left : rect.left,
    };
}

function _bindEditorKeydown() {
    const el = _ensureEditableEl();
    if (!el) return;
    el.addEventListener('keydown', _onEditorKeydown);
}

function _onEditorKeydown(e: KeyboardEvent) {
    if (atMentionVisible.value) {
        // 键盘导航交给 mention 面板
        if (mentionPanelRef.value?.handleKeydown(e)) {
            e.preventDefault();
            return;
        }
        if (e.key === 'Escape') { _hideMention(); return; }
        if (e.key === 'Backspace') {
            if (mentionSearchStr.value.length > 0) {
                mentionSearchStr.value = mentionSearchStr.value.slice(0, -1);
            } else {
                _hideMention();
            }
            return;
        }
        // 搜索字符进入编辑器（不过滤），仅用于过滤列表
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            mentionSearchStr.value += e.key;
            return;
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Home' || e.key === 'End') {
            return;
        }
        _hideMention();
        return;
    }
    // @ 触发：@ 正常进入编辑器，随后弹出面板
    if (e.key === '@' && skillsEnabled.value) {
        requestAnimationFrame(() => {
            const pos = _getCaretPosition();
            if (pos) {
                atMentionStyle.value = { top: `${pos.top - 290}px`, left: `${pos.left}px` };
                mentionSearchStr.value = '';
                atMentionVisible.value = true;
                mentionPanelRef.value?.resetNavigation();
            }
        });
    }
}

function _hideMention() {
    atMentionVisible.value = false;
    mentionSearchStr.value = '';
}

/** 获取底层 wangEditor 实例 */
function _getEditorInstance(): IDomEditor | null {
    return (qaEditorRef.value?.editor as IDomEditor | undefined) || null;
}

/** 在 Slate 文本节点中查找光标前最后一个 @ 的位置 */
function _findLastAtPoint(editor: IDomEditor): { path: number[]; offset: number } | null {
    try {
        const textEntries = Array.from(SlateNode.texts(editor));
        for (let i = textEntries.length - 1; i >= 0; i--) {
            const entry = textEntries[i];
            if (!entry) continue;
            const [node, path] = entry;
            const text = (node as unknown as { text?: string }).text || '';
            const atIndex = text.lastIndexOf('@');
            if (atIndex !== -1) {
                return { path: path as number[], offset: atIndex };
            }
        }
    } catch (_) { /* ignore */ }
    return null;
}

/**
 * 选中 mention 项后：删除已输入的 @ + 搜索字符，插入 mention inline-void 节点
 */
function onAtMentionSelect(item: { type: string; id: string; name: string; displayName: string; categoryLabel: string }) {
    // 捕获搜索字符长度（_hideMention 会清空 mentionSearchStr）
    const searchLen = mentionSearchStr.value.length;
    _hideMention();
    const editor = _getEditorInstance();
    if (!editor) return;
    const editableEl = _ensureEditableEl();
    if (editableEl) editableEl.focus();

    const mentionNode = {
        type: 'mention',
        mentionType: item.type,
        mentionId: item.id,
        mentionName: item.name || item.displayName || '',
        mentionDisplayName: item.displayName || item.name || '',
        displayLabel: item.categoryLabel || '',
        children: [{ text: '' }],
    };

    nextTick(() => {
        try {
            // 定位并删除已输入的 @ 及其后的搜索字符
            const atPoint = _findLastAtPoint(editor);
            if (atPoint) {
                // 删除范围：@ 起始到 @ + 1（@ 本身）+ 搜索字符数，并按文本节点长度裁剪
                let endOffset = atPoint.offset + 1 + searchLen;
                try {
                    const textNode = SlateNode.get(editor, atPoint.path) as unknown as { text?: string };
                    const textLen = (textNode.text || '').length;
                    if (endOffset > textLen) endOffset = textLen;
                } catch (_) { /* ignore */ }
                const atRange = {
                    anchor: atPoint,
                    focus: { path: atPoint.path, offset: endOffset },
                };
                SlateTransforms.select(editor, atRange);
                editor.deleteFragment();
            } else {
                try { editor.restoreSelection(); } catch (_) { /* ignore */ }
                if (!editor.selection) {
                    const endPoint = SlateEditor.end(editor, []);
                    editor.select(endPoint);
                }
            }

            // 插入 mention 节点，并在其后补一个空格使光标脱离 void 节点
            SlateTransforms.insertNodes(editor, mentionNode as unknown as SlateNode);
            editor.move(1);
            editor.insertText(' ');
        } catch (e) {
            console.warn('[Sender] insert mention failed', e);
        }
    });
}

// 挂载时绑定编辑器事件
onMounted(() => {
    _bindEditorKeydown();
    document.addEventListener('click', _onClickOutsideMention);
});
onUnmounted(() => {
    document.removeEventListener('click', _onClickOutsideMention);
});

function _onClickOutsideMention(e: MouseEvent) {
    if (!atMentionVisible.value) return;
    // 简单判断：点击不在面板内容上就关闭
    // Teleport 渲染后由组件自身的 overlay 控制
}

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

    // 优先使用 Slate 序列化：mention 节点转为 @skill:/@tool: 内联标记，
    // 内联图片转为 Markdown；编辑器不可用时回退到 HTML 解析
    let editorText = qaEditorRef.value?.getMentionText?.() || '';
    if (!editorText) {
        const processedContent = htmlImgToMarkdown(editorHtml.value);
        editorText = getPlainText(processedContent) || processedContent;
    }
    _query += editorText;

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
                    :application-id="currentApplicationId"
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
                    v-if="skillsEnabled && mode === 'claw'"
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
                <div v-if="mode === 'claw'"  class="toolbar-pill-btn" @click="showConnector = true">
                    <CustomizedIcon remote name="basic_api_line" size="s" :show-hover-bg="false" :color="'var(--td-text-color-secondary)'" />
                    <span class="toolbar-pill-btn__text">{{ skillsI18n.connector }}</span>
                </div>

                <!-- 工具按钮 -->
                <div v-if="mode === 'claw'" class="toolbar-pill-btn" @click="showPluginManage = true">
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

        <!-- 管理工具弹窗（首次打开的入口） -->
        <PluginManageDialog
            v-if="skillsEnabled"
            v-model="showPluginManage"
            :application-id="skillsApplicationId"
            :agent-id="currentAgentId"
            @change="refreshSkills"
        />

        <!-- 工具安装弹窗（独立打开时使用） -->
        <PluginInstallDialog
            v-if="skillsEnabled"
            v-model="showPlugin"
            :application-id="skillsApplicationId"
            :agent-id="currentAgentId"
            :installed-tool-ids="currentInstalledToolIds"
            @installed="refreshSkills"
        />

        <!-- @ Mention 面板 -->
        <Teleport to="body">
            <div v-if="atMentionVisible" class="at-mention-overlay" @click.self="_hideMention">
                <div :style="atMentionStyle" style="position:absolute">
                    <AtMentionPanel
                        ref="mentionPanelRef"
                        :installed-skills="normalizedSkills"
                        :installed-connectors="mentionConnectors"
                        :installed-tools="mentionTools"
                        :search-keyword="mentionSearchStr"
                        @select="onAtMentionSelect"
                        @close="_hideMention"
                    />
                </div>
            </div>
        </Teleport>
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

/* @Mention overlay */
.at-mention-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 5600;
}
</style>

<!-- mention tag 非 scoped 样式（chip 渲染在 QaEditor 的 contenteditable 内，需全局生效）对齐 webim .at-mention-tag -->
<style>
.at-mention-tag {
    display: inline-flex;
    align-items: center;
    height: 20px;
    padding: 0 4px;
    margin: 0 2px;
    background: #F1F6FF;
    border: 1px solid #DBE8FF;
    border-radius: 3px;
    font-size: 12px;
    line-height: 16px;
    color: #4A70FF;
    cursor: default;
    user-select: none;
    vertical-align: middle;
    white-space: nowrap;
}

.at-mention-tag__icon {
    display: inline-block;
    flex-shrink: 0;
    width: 12px;
    height: 12px;
    background-size: 12px 12px;
    background-repeat: no-repeat;
    background-position: center;
}

.at-mention-tag__icon--skills {
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.94938 7.45818L7.80801 7.56435L7.72895 7.72248L7.25076 8.67885H4.74924L4.27105 7.72248L4.19199 7.56435L4.05062 7.45818C3.25943 6.86399 2.75 5.9203 2.75 4.85742C2.75 3.0625 4.20507 1.60742 6 1.60742C7.79493 1.60742 9.25 3.0625 9.25 4.85742C9.25 5.9203 8.74057 6.86399 7.94938 7.45818ZM4.28571 9.42885H7.71429L8.39977 8.05789C9.37146 7.32813 10 6.16618 10 4.85742C10 2.64828 8.20914 0.857422 6 0.857422C3.79086 0.857422 2 2.64828 2 4.85742C2 6.16618 2.62854 7.32813 3.60023 8.05789L4.28571 9.42885ZM6.57143 11.1431C7.20261 11.1431 7.71429 10.6315 7.71429 10.0003H4.28571C4.28571 10.6315 4.79739 11.1431 5.42857 11.1431H6.57143Z' fill='%234A70FF'/%3E%3C/svg%3E");
}

.at-mention-tag__icon--plugins,
.at-mention-tag__icon--connectors {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 13 13' fill='none'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M12.2383 8.21079L6.32226 11.5402C6.2693 11.5702 6.20456 11.5703 6.15169 11.5402L0.209638 8.21144C0.117809 8.16004 0.00446184 8.22593 0.00390912 8.33123L2.87514e-06 9.11183C-0.000390956 9.18679 0.0397001 9.25643 0.10482 9.29347L5.63932 12.4413C6.00986 12.652 6.46399 12.6519 6.83463 12.4413L12.3659 9.29542C12.4328 9.25735 12.4733 9.18489 12.4707 9.10792L12.4447 8.32667C12.4412 8.22304 12.3286 8.15994 12.2383 8.21079ZM12.2383 5.52719L6.32226 8.85662C6.2693 8.88665 6.20456 8.88671 6.15169 8.85662L0.209638 5.52784C0.117809 5.47638 0.00446184 5.54241 0.00390912 5.64763L2.87514e-06 6.42823C-0.000390956 6.50313 0.0397001 6.57284 0.10482 6.60987L5.63932 9.75766C6.00986 9.96842 6.46399 9.96832 6.83463 9.75766L12.3659 6.61183C12.4328 6.57376 12.4733 6.50137 12.4707 6.42433L12.4447 5.64308C12.4412 5.53951 12.3286 5.47634 12.2383 5.52719ZM5.89583 0.0903423L0.324872 3.25831C0.0920792 3.39079 0.0920772 3.72675 0.324872 3.85922L5.89583 7.02719C6.1076 7.14761 6.36694 7.14762 6.57877 7.02719L12.1491 3.85922C12.382 3.72676 12.382 3.39077 12.1491 3.25831L6.57877 0.0903423C6.36694 -0.0301232 6.1076 -0.030105 5.89583 0.0903423ZM1.89323 3.55844L6.23698 6.02914L10.5814 3.55844L6.23698 1.08839L1.89323 3.55844Z' fill='%234A70FF'/%3E%3C/svg%3E");
    background-size: 13px 13px;
}

.at-mention-tag__text {
    margin-left: 2px;
    font-family: 'PingFang SC', sans-serif;
    font-weight: 400;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.at-mention-tag__close {
    display: inline-block;
    flex-shrink: 0;
    width: 12px;
    height: 12px;
    margin-left: 2px;
    cursor: pointer;
    border-radius: 50%;
    transition: background 0.15s;
    background-size: 12px 12px;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2.82542 9.67801C2.87136 9.65898 2.91255 9.6178 2.99492 9.53543L6.00011 6.53023L9.0053 9.53541C9.08766 9.61778 9.12885 9.65897 9.17479 9.678C9.23605 9.70337 9.30488 9.70337 9.36613 9.678C9.41208 9.65897 9.45326 9.61778 9.53563 9.53541C9.61799 9.45305 9.65918 9.41186 9.67821 9.36592C9.70358 9.30466 9.70358 9.23584 9.67821 9.17458C9.65918 9.12864 9.61799 9.08745 9.53563 9.00508L6.53044 5.9999L9.53565 2.99469C9.61802 2.91232 9.65921 2.87114 9.67824 2.8252C9.70361 2.76394 9.70361 2.69511 9.67824 2.63386C9.65921 2.58791 9.61802 2.54673 9.53565 2.46436C9.45329 2.38199 9.4121 2.34081 9.36616 2.32178C9.3049 2.29641 9.23608 2.29641 9.17482 2.32178C9.12888 2.34081 9.08769 2.38199 9.00532 2.46436L6.00011 5.46957L2.99489 2.46435C2.91252 2.38198 2.87134 2.34079 2.8254 2.32176C2.76414 2.29639 2.69531 2.29639 2.63405 2.32176C2.58811 2.34079 2.54693 2.38198 2.46456 2.46434C2.38219 2.54671 2.34101 2.5879 2.32198 2.63384C2.2966 2.6951 2.2966 2.76392 2.32198 2.82518C2.34101 2.87112 2.38219 2.91231 2.46456 2.99468L5.46978 5.9999L2.46459 9.0051C2.38222 9.08747 2.34103 9.12865 2.322 9.17459C2.29663 9.23585 2.29663 9.30468 2.322 9.36593C2.34103 9.41188 2.38222 9.45306 2.46459 9.53543C2.54695 9.6178 2.58814 9.65898 2.63408 9.67801C2.69534 9.70338 2.76416 9.70338 2.82542 9.67801Z' fill='%234A70FF'/%3E%3C/svg%3E");
}

.at-mention-tag__close:hover {
    background-color: rgba(74, 112, 255, 0.15);
}
</style>
