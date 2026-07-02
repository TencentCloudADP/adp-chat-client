<template>
    <t-dialog
        v-model:visible="visible"
        :header="mergedI18n.manageKnowledge"
        :footer="false"
        :close-on-overlay-click="false"
        width="min(900px, calc(100vw - 40px))"
    >
        <div class="connector-manage">
            <!-- 顶部筛选栏 -->
            <div class="connector-manage__filter-bar">
                <t-input
                    v-model="searchKeyword"
                    :placeholder="mergedI18n.searchKnowledge"
                    clearable
                    class="connector-manage__search"
                >
                    <template #prefix-icon>
                        <CustomizedIcon remote name="basic_search_line" size="xs" :show-hover-bg="false" :theme="theme" />
                    </template>
                </t-input>
                <t-checkbox v-model="enabledOnly">{{ mergedI18n.enabledOnly }}</t-checkbox>
            </div>

            <!-- 列表区 -->
            <div v-if="loading" class="connector-manage__loading">
                <t-loading size="small" :text="mergedI18n.loading" />
            </div>
            <div v-else-if="displayList.length === 0" class="connector-manage__empty">
                <span>{{ enabledOnly ? mergedI18n.noEnabledKnowledge : mergedI18n.noKnowledge }}</span>
            </div>
            <div v-else class="connector-manage__list">
                <div v-for="item in displayList" :key="item.knowledgeBizId" class="connector-item">
                    <div class="connector-item__info">
                        <div class="connector-item__title">
                            <span class="connector-item__name" :title="item.knowledgeName">{{ item.knowledgeName }}</span>
                            <t-tag v-if="item.isDefault" variant="light">{{ mergedI18n.defaultKnowledgeTag }}</t-tag>
                        </div>
                        <div v-if="item.knowledgeDescription" class="connector-item__desc" :title="item.knowledgeDescription">
                            {{ item.knowledgeDescription }}
                        </div>
                    </div>
                    <div class="connector-item__actions">
                        <t-switch
                            :model-value="item.enabled"
                            :loading="togglingId === item.knowledgeBizId"
                            :disabled="!!togglingId && togglingId !== item.knowledgeBizId"
                            @change="(v) => onToggleEnabled(item, v as boolean)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </t-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
    Dialog as TDialog, Tag as TTag, Loading as TLoading,
    Input as TInput, Checkbox as TCheckbox, Switch as TSwitch, MessagePlugin,
} from 'tdesign-vue-next';
import CustomizedIcon from '../CustomizedIcon.vue';
import {
    listReferShareKnowledge, getKBDefaultConfig,
    type ShareKnowledgeItem,
} from '../../service/knowledgeApi';
import { modifyAgentToolList } from '../../service/connectorPluginApi';
import useAgentStore from '../../composables/useAgentStore';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
import type { SkillsI18n } from '../../model/skills';
import { defaultSkillsI18n, defaultSkillsI18nEn } from '../../model/skills';

/** KnowledgeRetrievalAnswer 内置工具的固定名称（gpt-demo/webim 一致） */
const KNOWLEDGE_TOOL_NAME = 'KnowledgeRetrievalAnswer';

interface Props extends ThemeProps {
    modelValue: boolean;
    /** 应用 ID（作为 AppBizId + 用于 useAgentStore 定位当前 Agent） */
    applicationId?: string;
    /** 空间 ID（预留，暂未使用） */
    spaceId?: string;
    /** 国际化文本（与 SkillsPopover / Sender 共享 SkillsI18n） */
    i18n?: Partial<SkillsI18n>;
    /** 语言：'en-*' 走英文默认值 */
    language?: string;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    modelValue: false,
    applicationId: '',
    spaceId: '',
    i18n: () => ({}),
    language: '',
});

/** 合并默认 + 业务方传入的 i18n */
const mergedI18n = computed<Required<SkillsI18n>>(() => {
    const defaults = props.language?.startsWith('en') ? defaultSkillsI18nEn : defaultSkillsI18n;
    return { ...defaults, ...props.i18n };
});

const {
    getAgentIdByAppId,
    getAgentDetailByAppId,
    resetAgentStore,
    refreshAgentCache,
} = useAgentStore();

const emit = defineEmits<{
    (e: 'update:modelValue', v: boolean): void;
    (e: 'change'): void;
}>();

const visible = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v),
});

/** 弹窗内单个知识库项 */
interface KnowledgeCardItem {
    knowledgeBizId: string;
    knowledgeName: string;
    knowledgeDescription: string;
    isDefault: boolean;
    /** 是否已开启（受 allKnowledge / enabledIdSet 双重决定） */
    enabled: boolean;
}

const loading = ref(false);
const searchKeyword = ref('');
const enabledOnly = ref(false);
const togglingId = ref('');

/** 全量共享知识库（含默认知识库置顶） */
const shareList = ref<ShareKnowledgeItem[]>([]);
/** 当前是否为"全部知识库"模式（filter_type = '0'） */
const allKnowledge = ref(false);
/** 当前 KnowledgeRetrievalAnswer 工具中已勾选的知识库 id 集合（filter_type = '3' 时生效） */
const enabledIdSet = ref<Set<string>>(new Set());
/** 已从 GetKBDefaultConfig 拉到的默认检索配置（保留用于扩展） */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultRetrievalConfig = ref<Record<string, unknown>>({});

/**
 * 从 tools 列表中定位 KnowledgeRetrievalAnswer 工具，并返回其原始对象。
 * 兼容多种字段命名：Name / ToolName / Config.description / Config.Name。
 */
function findKnowledgeTool(tools: Record<string, unknown>[]): Record<string, unknown> | null {
    for (const t of tools) {
        const cfg = (t.Config || {}) as Record<string, unknown>;
        const rawName = (t.Name || t.ToolName || cfg.Description || cfg.description || '') as string;
        // Name 后端可能是 "中文别名/KnowledgeRetrievalAnswer" 或纯 "KnowledgeRetrievalAnswer"
        const name = rawName.includes('/') ? rawName.split('/').pop() || '' : rawName;
        if (name === KNOWLEDGE_TOOL_NAME) return t;
    }
    return null;
}

/**
 * 从 KnowledgeRetrievalAnswer 工具的 InputList 中解析出：
 *   - allKnowledge：是否"全部知识库"模式（单选：全部 vs 按知识库）
 *   - ids：按知识库模式下已开启的知识库 id 列表
 *
 * 数据结构完全对齐 gpt-demo 的 `parseInputKnowLedge`（constantNew.js L1108+）：
 *   Config.InputList[?].Name === 'KnowledgeScope'
 *     .SubParameterList:
 *       - Name === 'AllKnowledge'
 *           .Input.UserInputValue.ValueList = ['true' | 'false']
 *       - Name === 'KnowledgeList'
 *           .SubParameterList = [ { Name: 'item 0', SubParameterList: [ ... ] }, ... ]
 *              item.SubParameterList[?]:
 *                - Name === 'KnowledgeBizId'
 *                    .Input.UserInputValue.ValueList = [id]
 *
 * 后端可能返回 PascalCase（v2 proto json_name）或下划线（v1 gpt-demo 原格式），双兼容。
 * gpt-demo 判定规则：AllKnowledge === 'true' → 全部；否则 filter_type='3'（按知识库），
 * 同时读 KnowledgeList 得到已开启 id 集合。
 */
function parseKnowledgeScope(tool: Record<string, unknown>): {
    allKnowledge: boolean;
    ids: string[];
} {
    /** 拿字段：先 PascalCase，再下划线 */
    const pick = (obj: Record<string, unknown> | null | undefined, ...keys: string[]): unknown => {
        if (!obj) return undefined;
        for (const k of keys) {
            if (obj[k] !== undefined) return obj[k];
        }
        return undefined;
    };

    const cfg = (pick(tool, 'Config', 'config') || {}) as Record<string, unknown>;
    const inputList = (pick(cfg, 'InputList', 'input_list', 'inputs') || []) as Array<Record<string, unknown>>;

    const scope = inputList.find((n) => {
        const nm = pick(n, 'Name', 'name');
        return nm === 'KnowledgeScope';
    });
    if (!scope) {
        // eslint-disable-next-line no-console
        console.warn('[KnowledgeDialog] parseKnowledgeScope: no KnowledgeScope node in InputList, keys =',
            inputList.map((n) => pick(n, 'Name', 'name')));
        return { allKnowledge: true, ids: [] };
    }

    const scopeSubs = (pick(scope, 'SubParameterList', 'sub_parameter_list', 'sub_params') || []) as Array<Record<string, unknown>>;

    /** 读某个节点 Input.UserInputValue.ValueList[0]（双兼容 PascalCase / 下划线 / values 短名） */
    const readValue = (node: Record<string, unknown> | undefined | null): string => {
        if (!node) return '';
        const input = (pick(node, 'Input', 'input') || {}) as Record<string, unknown>;
        const uiv = (pick(input, 'UserInputValue', 'user_input_value') || {}) as Record<string, unknown>;
        const values = (pick(uiv, 'ValueList', 'value_list', 'values') || []) as string[];
        return values[0] || '';
    };

    // AllKnowledge 节点值（可能不存在，此时按 KnowledgeList 空/非空 fallback）
    let allKnowledgeExplicit: boolean | null = null;
    let ids: string[] = [];

    for (const sub of scopeSubs) {
        const subName = pick(sub, 'Name', 'name');
        if (subName === 'AllKnowledge') {
            const v = readValue(sub);
            if (v !== '') allKnowledgeExplicit = v === 'true';
        } else if (subName === 'KnowledgeList') {
            const items = (pick(sub, 'SubParameterList', 'sub_parameter_list', 'sub_params') || []) as Array<Record<string, unknown>>;
            ids = items
                .map((it) => {
                    const itemSubs = (pick(it, 'SubParameterList', 'sub_parameter_list', 'sub_params') || []) as Array<Record<string, unknown>>;
                    const bizIdNode = itemSubs.find((n) => pick(n, 'Name', 'name') === 'KnowledgeBizId');
                    return readValue(bizIdNode);
                })
                .filter(Boolean);
        }
    }

    // 判定规则（对齐 gpt-demo）：
    //   1) 显式 AllKnowledge='true' → 全部知识库
    //   2) 显式 AllKnowledge='false' → 按知识库
    //   3) 未写 AllKnowledge：KnowledgeList 有条目 → 按知识库；无条目 → 全部知识库（默认）
    const allKnowledge = allKnowledgeExplicit !== null
        ? allKnowledgeExplicit
        : ids.length === 0;

    return { allKnowledge, ids };
}

/**
 * 构建 KnowledgeScope 节点（用于 ModifyAgentToolList 提交）。
 * 结构对齐 gpt-demo 的 asycKnowledgeToInput：
 *   {
 *     Name: 'KnowledgeScope',
 *     Type: 4, IsAgentHidden: true,
 *     SubParameterList: [
 *       { Name: 'AllKnowledge', Input: { InputType: 1, UserInputValue: { ValueList: ['true'/'false'] } } },
 *       { Name: 'KnowledgeList', SubParameterList: [ item0, item1, ... ] },
 *     ]
 *   }
 * 每个 item 结构：
 *   { Name: 'item 0', Type: 4, SubParameterList: [
 *       { Name: 'KnowledgeBizId', Input: { InputType: 1, UserInputValue: { ValueList: [id] } } },
 *   ] }
 */
function buildKnowledgeScopeNode(all: boolean, ids: string[]): Record<string, unknown> {
    const buildStringInput = (val: string) => ({
        InputType: 1,
        UserInputValue: { ValueList: [val] },
    });

    const knowledgeItems = ids.map((id, index) => ({
        Name: `item ${index}`,
        Type: 4, // OBJECT
        SubParameterList: [
            {
                Name: 'KnowledgeBizId',
                Type: 1, // STRING
                Input: buildStringInput(id),
                SubParameterList: [],
            },
        ],
    }));

    return {
        Name: 'KnowledgeScope',
        Type: 4,
        SubParameterList: [
            {
                Name: 'AllKnowledge',
                Type: 1,
                Input: buildStringInput(all ? 'true' : 'false'),
                SubParameterList: [],
            },
            {
                Name: 'KnowledgeList',
                Type: 5, // ARRAY_OBJECT
                SubParameterList: knowledgeItems,
            },
        ],
    };
}

/**
 * ModifyAgentToolList 不接受的禁止字段集合。
 * Including null, IsHidden (NOT IsAgentHidden), RenderMode and other Describe-only derived fields.
 * NOTE: IsAgentHidden / IsRequired / Description are VALID proto fields and must NOT be stripped.
 */
const API_REJECTED_KEYS = new Set([
    'IsHidden',
    'RenderMode',
]);

/**
 * 递归深度清洗对象中的 API 不接受字段（null + IsHidden 等），
 * 避免 ModifyAgentToolList 报 UnknownParameter / InvalidParameter。
 */
function stripApiRejected<T>(value: T): T {
    if (value === null) return undefined as unknown as T;
    if (Array.isArray(value)) return value.map((it) => stripApiRejected(it)) as unknown as T;
    if (value && typeof value === 'object') {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
            if (v === null) continue;
            if (API_REJECTED_KEYS.has(k)) continue;
            out[k] = stripApiRejected(v);
        }
        return out as unknown as T;
    }
    return value;
}

/**
 * 深拷贝 KnowledgeRetrievalAnswer 工具的 Config，替换其中的 KnowledgeScope 节点，
 * 返回可用于 ModifyAgentToolList 的 { Config } 对象。
 */
function buildToolSpecWithNewScope(
    tool: Record<string, unknown>,
    all: boolean,
    ids: string[],
): Record<string, unknown> {
    const rawConfig = JSON.parse(JSON.stringify(tool.Config || {})) as Record<string, unknown>;
    const inputList = (rawConfig.InputList || []) as Array<Record<string, unknown>>;
    const idx = inputList.findIndex((n) => n.Name === 'KnowledgeScope');
    const newScope = buildKnowledgeScopeNode(all, ids);
    if (idx >= 0) {
        inputList[idx] = newScope;
    } else {
        inputList.push(newScope);
    }
    rawConfig.InputList = inputList;
    return { Config: stripApiRejected(rawConfig) };
}

/** 从 tool 上提取 pluginId / toolId */
function extractPluginToolId(tool: Record<string, unknown>): { pluginId: string; toolId: string } {
    const cfg = (tool.Config || {}) as Record<string, unknown>;
    return {
        pluginId: (cfg.PluginId || tool.PluginId || '') as string,
        toolId: (cfg.ToolId || tool.ToolId || '') as string,
    };
}

/**
 * 展示列表：应用「已开启」筛选 + 关键字过滤，并派生 enabled 字段。
 * enabled 规则：
 *   - allKnowledge = true：全部视为已开启
 *   - allKnowledge = false：仅 enabledIdSet 中的 id 视为已开启
 */
const displayList = computed<KnowledgeCardItem[]>(() => {
    const kw = searchKeyword.value.trim().toLowerCase();
    const items: KnowledgeCardItem[] = shareList.value.map((it) => ({
        knowledgeBizId: it.knowledgeBizId,
        knowledgeName: it.knowledgeName,
        knowledgeDescription: it.knowledgeDescription,
        isDefault: !!it.isDefault,
        enabled: allKnowledge.value || enabledIdSet.value.has(it.knowledgeBizId),
    }));
    return items
        .filter((it) => {
            if (enabledOnly.value && !it.enabled) return false;
            if (!kw) return true;
            return it.knowledgeName.toLowerCase().includes(kw)
                || it.knowledgeDescription.toLowerCase().includes(kw);
        });
});

/**
 * 拉取共享知识库列表 + 从缓存 AgentDetail 中解析已开启状态。
 * GetKBDefaultConfig 用于提取默认检索配置，作为 UI 可选扩展兜底数据。
 */
async function fetchAll(clearCache = false): Promise<void> {
    if (!props.applicationId) return;
    loading.value = true;
    try {
        if (clearCache) {
            resetAgentStore(props.applicationId);
        }
        // 并行拉取：知识库列表 / Agent 详情 / 默认检索配置
        const [listResp, detail, kbConfig] = await Promise.all([
            listReferShareKnowledge({
                applicationId: props.applicationId,
                includeDefault: true,
                defaultName: mergedI18n.value.defaultKnowledgeName,
            }).catch((err) => {
                console.error('[KnowledgeDialog] listReferShareKnowledge error:', err);
                return { list: [] as ShareKnowledgeItem[] };
            }),
            getAgentDetailByAppId(props.applicationId),
            getKBDefaultConfig({ applicationId: props.applicationId }).catch((err) => {
                console.warn('[KnowledgeDialog] getKBDefaultConfig failed (non-blocking):', err);
                return { retrievalConfig: {}, raw: {} };
            }),
        ]);

        shareList.value = listResp.list;
        defaultRetrievalConfig.value = kbConfig.retrievalConfig;

        // 从 Agent 详情中解析当前 KnowledgeRetrievalAnswer 状态
        const tools = (detail?.tools || []) as Record<string, unknown>[];
        const kbTool = findKnowledgeTool(tools);
        // eslint-disable-next-line no-console
        console.log('[KnowledgeDialog] tools =', tools);
        // eslint-disable-next-line no-console
        console.log('[KnowledgeDialog] KnowledgeRetrievalAnswer tool =', kbTool);
        if (kbTool) {
            // 深拷贝 + 打印，避免控制台懒渲染显示为空对象
            try {
                // eslint-disable-next-line no-console
                console.log(
                    '[KnowledgeDialog] KnowledgeRetrievalAnswer JSON =',
                    JSON.parse(JSON.stringify(kbTool)),
                );
            } catch (e) { /* ignore */ }
            const { allKnowledge: all, ids } = parseKnowledgeScope(kbTool);
            // eslint-disable-next-line no-console
            console.log('[KnowledgeDialog] parseKnowledgeScope =>', { allKnowledge: all, ids });
            allKnowledge.value = all;
            enabledIdSet.value = new Set(ids);
        } else {
            allKnowledge.value = false;
            enabledIdSet.value = new Set();
        }
        // eslint-disable-next-line no-console
        console.log('[KnowledgeDialog] shareList =', shareList.value.map((it) => ({
            id: it.knowledgeBizId, name: it.knowledgeName, isDefault: it.isDefault,
        })));
    } finally {
        loading.value = false;
    }
}

/**
 * 提交 KnowledgeScope 变更：修改 KnowledgeRetrievalAnswer 工具的 InputList，
 * 通过 ModifyAgentToolList 保存。
 */
async function persistKnowledgeScope(nextAll: boolean, nextIds: string[]): Promise<void> {
    const detail = await getAgentDetailByAppId(props.applicationId);
    const tools = (detail?.tools || []) as Record<string, unknown>[];
    const kbTool = findKnowledgeTool(tools);
    if (!kbTool) {
        throw new Error(mergedI18n.value.knowledgeToolMissingTip);
    }
    const agentId = await getAgentIdByAppId(props.applicationId);
    if (!agentId) {
        throw new Error(mergedI18n.value.missingAppOrAgentId);
    }

    const { pluginId, toolId } = extractPluginToolId(kbTool);
    const toolSpec = buildToolSpecWithNewScope(kbTool, nextAll, nextIds);

    await modifyAgentToolList({
        applicationId: props.applicationId,
        appId: props.applicationId,
        agentId,
        pluginIdList: pluginId ? [pluginId] : [],
        toolIdList: toolId ? [toolId] : [],
        pluginList: [],
        toolList: [toolSpec],
    });
}

/**
 * 切换单个知识库的开启状态。
 * 若当前处于 allKnowledge 模式：先"落地"到按知识库模式（把当前全量列表作为选中集合）再进行增删。
 */
async function onToggleEnabled(item: KnowledgeCardItem, val: boolean): Promise<void> {
    if (togglingId.value) return;
    togglingId.value = item.knowledgeBizId;

    // 计算目标状态
    let nextAll = allKnowledge.value;
    let nextIds = new Set<string>(enabledIdSet.value);

    if (allKnowledge.value) {
        // 从"全部知识库"切换到"按知识库"模式：以 shareList 为初始选中集
        nextAll = false;
        nextIds = new Set<string>(shareList.value.map((it) => it.knowledgeBizId));
    }

    if (val) {
        nextIds.add(item.knowledgeBizId);
    } else {
        nextIds.delete(item.knowledgeBizId);
    }

    try {
        await persistKnowledgeScope(nextAll, Array.from(nextIds));
        allKnowledge.value = nextAll;
        enabledIdSet.value = nextIds;
        // 强制刷新 Agent 缓存以保持后续解析的一致性
        await refreshAgentCache(props.applicationId);
        MessagePlugin.success(val ? mergedI18n.value.knowledgeEnabledToast : mergedI18n.value.knowledgeDisabledToast);
        emit('change');
    } catch (e) {
        console.error('[KnowledgeDialog] toggle error:', e);
        const msg = (e as Error)?.message || '';
        if (msg) {
            MessagePlugin.error(msg);
        } else {
            MessagePlugin.error(val ? mergedI18n.value.knowledgeEnableFailedToast : mergedI18n.value.knowledgeDisableFailedToast);
        }
    } finally {
        togglingId.value = '';
    }
}

watch(() => props.modelValue, (val) => {
    if (val) {
        searchKeyword.value = '';
        enabledOnly.value = false;
        // 使用 refreshAgentCache 强制刷新 Agent 数据，避免 resetAgentStore 清空 Sender/工具栏共享缓存
        fetchAll(false);
        refreshAgentCache(props.applicationId);
    }
});
</script>

<style scoped>
@import url('../../styles/dialog-common.css');

.connector-manage {
    display: flex;
    flex-direction: column;
    gap: var(--td-comp-paddingTB-m);
    height: 540px;
    overflow: hidden;
}
.connector-manage__filter-bar {
    display: flex;
    align-items: center;
    gap: var(--td-comp-paddingTB-m);
    flex-shrink: 0;
}
.connector-manage__search { width: 240px; }

/* 知识库列表项样式与 ConnectorDialog 保持一致 */
.connector-item {
    display: flex;
    align-items: center;
    gap: var(--td-size-6);
    padding: var(--td-size-5) 0;
    border-bottom: 1px solid rgba(18, 42, 79, 0.08);
    transition: background 0.15s;
}
.connector-item:last-child { border-bottom: none; }
.connector-item__icon { flex-shrink: 0; width: var(--td-comp-size-xl); }
.connector-item__icon-fb {
    width: var(--td-comp-size-xl);
    height: var(--td-comp-size-xl);
    border-radius: var(--td-radius-large);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--td-bg-color-secondarycontainer);
    color: var(--td-text-color-placeholder);
    border: 1px solid var(--td-component-border);
    box-sizing: border-box;
}
.connector-item__info { flex: 1; min-width: 0; overflow: hidden; }
.connector-item__title {
    display: flex;
    align-items: center;
    gap: var(--td-size-3);
    flex-wrap: nowrap;
    overflow: hidden;
}
.connector-item__name {
    font-size: var(--td-font-size-body-large);
    font-weight: 500;
    color: var(--td-text-color-primary);
    line-height: var(--td-size-8);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 360px;
}
.connector-item__desc {
    font-size: var(--td-font-size-body-small);
    color: var(--td-text-color-placeholder);
    line-height: var(--td-size-7);
    margin-top: var(--td-size-2);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.connector-item__actions {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: var(--td-comp-paddingTB-m);
}
</style>
