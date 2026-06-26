<template>
    <t-dialog
        v-model:visible="visible"
        header="管理连接器"
        :footer="false"
        :close-on-overlay-click="false"
        width="min(900px, calc(100vw - 40px))"
    >
        <div class="connector-manage">
            <!-- 顶部筛选栏 -->
            <div class="connector-manage__filter-bar">
                <t-input
                    v-model="searchKeyword"
                    placeholder="搜索连接器"
                    clearable
                    class="connector-manage__search"
                    @change="onSearchChange"
                >
                    <template #prefix-icon><CustomizedIcon remote name="basic_search_line" size="xs" :show-hover-bg="false" :theme="theme" /></template>
                </t-input>
                <t-checkbox v-model="enabledOnly" @change="onEnabledOnlyChange">已启用</t-checkbox>
            </div>

            <!-- 列表区 -->
            <div v-if="loading" class="connector-manage__loading">
                <t-loading size="small"  text="加载中..." />
            </div>
            <div v-else-if="displayList.length === 0" class="connector-manage__empty">
                <span>{{ enabledOnly ? '暂无已启用的连接器' : '暂无连接器' }}</span>
            </div>
            <div v-else class="connector-manage__list">
                <div v-for="item in displayList" :key="item.pluginId" class="connector-item">
                    <div class="connector-item__icon">
                        <img v-if="item.iconUrl" :src="item.iconUrl" @error="onIconError" />
                        <span v-else class="connector-item__icon-fb"><CustomizedIcon remote name="basic_link_line" size="s" :show-hover-bg="false" :theme="theme" /></span>
                    </div>
                    <div class="connector-item__info">
                        <div class="connector-item__title">
                            <span class="connector-item__name" :title="item.name">{{ item.name }}</span>
                            <t-tag v-if="item.isInner" variant="light">预置</t-tag>
                        </div>
                        <div class="connector-item__desc" :title="item.desc">
                            {{ item.desc || '暂无描述' }}
                        </div>
                    </div>
                    <div class="connector-item__actions">
                        <!-- 启用开关 -->
                        <t-switch
                            :model-value="item.enabled"
                            :loading="togglingId === item.pluginId"
                            :disabled="!!togglingId && togglingId !== item.pluginId"
                            @change="(v) => onToggleEnabled(item, v as boolean)"
                        />
                    </div>
                </div>
            </div>

            <!-- 分页 -->
            <t-pagination
                v-if="!enabledOnly && total > pageSize"
                v-model="pageNumber"
                :total="total"
                :page-size="pageSize"
                :page-size-options="[]"
                size="small"
                class="connector-manage__pagination"
                @change="fetchList"
            />
        </div>

        <!-- ADP 浏览器助手扩展安装引导弹窗（仅在用户启用浏览器助手连接器但扩展未就绪时弹出） -->
        <BrowserExtensionInstallDialog
            v-model="showExtensionInstallDialog"
            :theme="theme"
            @confirm="handleExtensionDialogClose"
            @cancel="handleExtensionDialogClose"
        />
    </t-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import {
    Dialog as TDialog, Tag as TTag, Loading as TLoading,
    Input as TInput, Checkbox as TCheckbox, Switch as TSwitch, Pagination as TPagination, MessagePlugin,
} from 'tdesign-vue-next';
import CustomizedIcon from '../CustomizedIcon.vue';
import BrowserExtensionInstallDialog from './BrowserExtensionInstallDialog.vue';
import {
    fetchPluginList, PluginClassEnum,
    bindAgentTool,
    unbindAgentTool,
    modifyAgentToolList,
} from '../../service/connectorPluginApi';
import useAgentStore from '../../composables/useAgentStore';
import {
    detectExtension,
    isBrowserAssistantConnector,
    isChromeBrowser,
    findTokenHeaderIndex,
} from '../../utils/adp-browser-extension';
import type { DetectExtensionResult, DetectExtensionFailReason } from '../../utils/adp-browser-extension';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';

interface Props extends ThemeProps {
    modelValue: boolean;
    applicationId?: string;
    spaceId?: string;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    modelValue: false,
    applicationId: '',
    spaceId: '',
});

const { getAgentIdByAppId, getAgentDetailByAppId, resetAgentStore, fetchAgentDetail } = useAgentStore();

const emit = defineEmits<{
    (e: 'update:modelValue', v: boolean): void;
    /** 连接器启用/关闭/连接状态变更后通知父组件刷新 */
    (e: 'change'): void;
}>();

const visible = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v),
});

interface ConnectorItem {
    pluginId: string;
    name: string;
    desc: string;
    iconUrl: string;
    isInner: boolean;
    /** 是否已启用（已绑定到当前 Agent） */
    enabled: boolean;
    /** 原始数据 */
    raw: Record<string, unknown>;
}

const loading = ref(false);
const searchKeyword = ref('');
const enabledOnly = ref(false);
const pageNumber = ref(1);
const pageSize = 15;
const total = ref(0);
const cardList = ref<ConnectorItem[]>([]);
const togglingId = ref('');

/** 已启用的连接器集合（来自 fetchGlobalAgent 的 plugins 中 PluginClass===1 的项） */
const installedConnectors = ref<Record<string, unknown>[]>([]);

// ====== ADP 浏览器助手扩展检测相关 ======
/** 扩展安装引导弹窗显隐 */
const showExtensionInstallDialog = ref(false);
/** 待自动启用的浏览器助手 item（用户点开关但扩展未就绪时入队，扩展就绪后自动出队启用） */
const extensionPendingItem = ref<ConnectorItem | null>(null);
/** 扩展状态轮询定时器：仅在 extensionPendingItem 存在时启动 */
let extensionPollTimer: ReturnType<typeof setInterval> | null = null;

/**
 * 从 AgentPlugin 结构中提取 PluginId。
 * DescribeAgentDetail 返回的 PluginList 每项为 AgentPlugin { Config: AgentPluginConfig, Name, ... }，
 * PluginId 位于 Config 子对象中，需要兼容顶层和 Config 嵌套两种情况。
 */
function extractPluginId(p: Record<string, unknown>): string {
    const directId = (p.PluginId || '') as string;
    if (directId) return directId;
    const config = p.Config as Record<string, unknown> | undefined;
    return config ? ((config.PluginId || '') as string) : '';
}

const installedIdSet = computed(() => {
    const s = new Set<string>();
    installedConnectors.value.forEach((p) => {
        const id = extractPluginId(p);
        if (id) s.add(id);
    });
    return s;
});

/** 显示列表：已启用模式下从 installedConnectors 派生 + 关键字过滤；否则使用 ListPlugins 拉取的列表 */
const displayList = computed<ConnectorItem[]>(() => {
    if (enabledOnly.value) {
        const kw = searchKeyword.value.trim().toLowerCase();
        return installedConnectors.value
            .map((p) => buildItemFromInstalled(p))
            // TODO: 浏览器助手连接器暂时屏蔽（扩展尚未上架 Chrome 商店），后续移除该过滤
            .filter((it) => !isBrowserAssistantConnector(it.raw))
            .filter((it) => !kw || it.name.toLowerCase().includes(kw) || it.desc.toLowerCase().includes(kw));
    }
    // cardList 中的 enabled 是构建时的静态快照，需要依赖最新的 installedIdSet 动态派生
    return cardList.value
        // TODO: 浏览器助手连接器暂时屏蔽（扩展尚未上架 Chrome 商店），后续移除该过滤
        .filter((item) => !isBrowserAssistantConnector(item.raw))
        .map((item) => ({
            ...item,
            enabled: installedIdSet.value.has(item.pluginId),
        }));
});

function buildItemFromInstalled(p: Record<string, unknown>): ConnectorItem {
    const pluginId = extractPluginId(p);
    return {
        pluginId,
        name: (p.Name || p.PluginName || '') as string,
        desc: (p.Desc || p.PluginDesc || p.Introduction || '') as string,
        iconUrl: (p.IconUrl || '') as string,
        isInner: Number(p.PluginType || 0) === 1,
        enabled: true,
        raw: p,
    };
}

function buildItemFromList(p: Record<string, unknown>): ConnectorItem {
    const pluginId = extractPluginId(p);
    return {
        pluginId,
        name: (p.Name || p.PluginName || '') as string,
        desc: (p.Desc || p.PluginDesc || p.Introduction || '') as string,
        iconUrl: (p.IconUrl || '') as string,
        isInner: Number(p.PluginType || 0) === 1,
        enabled: installedIdSet.value.has(pluginId),
        raw: p,
    };
}

function onIconError(e: Event) { (e.target as HTMLImageElement).style.display = 'none'; }

let searchTimer: ReturnType<typeof setTimeout> | null = null;

function onSearchChange() {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        if (enabledOnly.value) return;
        pageNumber.value = 1;
        fetchList();
    }, 300);
}

function onEnabledOnlyChange() {
    pageNumber.value = 1;
    if (!enabledOnly.value) {
        fetchList();
    }
}

/** 拉取已启用的连接器列表，可选是否先清除缓存 */
async function fetchInstalled(clearCache = false) {
    if (!props.applicationId) return;
    try {
        if (clearCache) {
            resetAgentStore(props.applicationId);
        }
        const detail = await getAgentDetailByAppId(props.applicationId);
        // DescribeAgentDetail 返回的 plugins 中 PluginClass 字段可能未正确赋值（为0），
        // 因此不再依赖该字段过滤，直接使用全部 plugins 作为已绑定集合
        installedConnectors.value = (detail?.plugins || []) as Record<string, unknown>[];
    } catch (e) {
        console.error('[ConnectorDialog] fetchInstalled error:', e);
    }
}

/** 拉取连接器市场列表 */
async function fetchList() {
    if (!props.applicationId) return;
    loading.value = true;
    try {
        const result = await fetchPluginList({
            applicationId: props.applicationId,
            pluginClass: PluginClassEnum.CONNECTOR,
            query: searchKeyword.value || undefined,
            pageNumber: pageNumber.value,
            pageSize,
            // 不区分 tag / 类型，全量拉
            pluginTypes: [0, 1, 2],
            spaceId: props.spaceId || 'default_space',
        });
        let plugins = result.plugins;
        // 非 Chrome 环境下隐藏 ADP 浏览器助手连接器（扩展仅支持 Chrome）
        if (!isChromeBrowser()) {
            plugins = plugins.filter((p) => !isBrowserAssistantConnector(p as Record<string, unknown>));
        }
        cardList.value = plugins.map(buildItemFromList);
        total.value = result.total;
    } catch (e) {
        console.error('[ConnectorDialog] fetchList error:', e);
    } finally {
        loading.value = false;
    }
}

/**
 * 从 ListPlugins 返回的 PluginInfo 中提取子工具列表。
 * ListPlugins 可能在 tools / Tools / ToolList 字段中返回工具数组。
 */
function getItemTools(p: Record<string, unknown>): Record<string, unknown>[] {
    return ((p.Tools || p.ToolList) as Record<string, unknown>[] | undefined) || [];
}

/**
 * ============================================================
 * ModifyAgent 协议白名单 Sanitizer
 * ============================================================
 * 后端 ModifyAgent 严格校验 proto 字段，任何未定义字段都会报 UnknownParameter。
 * DescribeAgentDetail 返回的数据带有额外展示字段（RenderMode, IsRequired in OutputList 等）。
 * 以下函数全部基于「白名单」模式，只保留后端实际接受的字段。
 *
 * 字段对照（来自 proto + mock 实测）：
 *
 * AgentToolSpec:
 *   - Config (AgentToolConfig)
 *   - ToolAdvancedConfig
 *
 * AgentToolConfig:
 *   - PluginId, ToolId, Description, InputList, OutputList,
 *     HeaderParameterList, QueryParameterList, ToolSource, IsDisabled
 *
 * AgentToolInputParameter:
 *   - Name, Description, Type, IsRequired, SubParameterList,
 *     IsHidden (proto json_name=IsAgentHidden, 但后端 mock 实际用 IsHidden),
 *     OneOfList, AnyOfList, Input (不能为 null)
 *
 * AgentToolOutputParameter:
 *   - Name, Description, Type, SubParameterList
 *   （不含 IsRequired/IsHidden/Input/OneOfList/AnyOfList/AnalysisMethod/RenderMode）
 *
 * AgentPluginConfig (v2):
 *   - PluginId, HeaderParameterList, QueryParameterList,
 *     IsRoleAuth, AuthMode, AuthType
 *   （ModifyAgentToolList 使用 v2 proto，字段名以 v2 json_name 为准）
 *
 * AgentPluginParameter (v2):
 *   - ParameterName (v2 proto json_name), IsGlobalHidden, IsRequired, Input (不能为 null)
 *   （ModifyAgentToolList 接口使用 v2 proto，字段名为 ParameterName）
 * ============================================================
 */

/**
 * 从 ListPlugins 返回的 ParamValue 构造 v2 proto Input 对象。
 * ParamValue 是用户填入的鉴权值（如 API Key），应包装成 USER_INPUT 类型的 Input。
 * InputSourceEnum.USER_INPUT = 1
 * 空字符串/undefined 返回 undefined，避免传空 Input 给后端。
 */
function buildInputFromParamValue(paramValue: unknown): Record<string, unknown> | undefined {
    const value = typeof paramValue === 'string' ? paramValue : '';
    if (!value) return undefined;
    return {
        InputType: 1, // USER_INPUT
        UserInputValue: {
            ValueList: [value],
        },
    };
}

/**
 * 清理 AgentPluginParameter（用于 HeaderParameterList / QueryParameterList）。
 * 白名单：ParameterName, IsGlobalHidden, IsRequired, Input (非 null 时)。
 * 注意：ModifyAgentToolList 接口使用 v2 proto，AgentPluginParameter 的 json_name 是 "ParameterName"。
 */
function sanitizePluginParam(param: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {
        ParameterName: param.ParameterName || param.Name || param.ParamName || '',
        IsGlobalHidden: !!(param.IsGlobalHidden),
        IsRequired: !!(param.IsRequired),
    };
    if (param.Input !== null && param.Input !== undefined) {
        result.Input = param.Input;
    }
    return result;
}

/**
 * 递归清理 AgentToolInputParameter（v2 proto）。
 * 白名单：Name, Description, Type, IsRequired, IsAgentHidden, SubParameterList, OneOfList, AnyOfList, Input (非 null)。
 * 注意：ListPlugins 返回的字段名（Desc, GlobalHidden, SubParams, OneOf, AnyOf）与 proto 不同，需做映射。
 */
function sanitizeInputParamList(params: Record<string, unknown>[]): Record<string, unknown>[] {
    return params.map((p) => {
        const subParams = (p.SubParameterList || p.SubParams) as Record<string, unknown>[] | undefined;
        const oneOfList = (p.OneOfList || p.OneOf) as Record<string, unknown>[] | undefined;
        const anyOfList = (p.AnyOfList || p.AnyOf) as Record<string, unknown>[] | undefined;
        const result: Record<string, unknown> = {
            Name: p.Name || '',
            Description: p.Description || p.Desc || '',
            Type: p.Type ?? 0,
            IsRequired: !!(p.IsRequired),
            IsAgentHidden: !!(p.IsAgentHidden || p.IsHidden || p.GlobalHidden),
            SubParameterList: Array.isArray(subParams) ? sanitizeInputParamList(subParams) : [],
            OneOfList: Array.isArray(oneOfList) ? sanitizeInputParamList(oneOfList) : [],
            AnyOfList: Array.isArray(anyOfList) ? sanitizeInputParamList(anyOfList) : [],
        };
        if (p.Input !== null && p.Input !== undefined) {
            result.Input = p.Input;
        }
        return result;
    });
}

/**
 * 递归清理 AgentToolOutputParameter。
 * 白名单：Name, Description, Type, SubParameterList。
 * 注意：没有 IsRequired/IsHidden/Input/OneOfList/AnyOfList/AnalysisMethod/RenderMode。
 * ListPlugins 返回的字段名（Desc, SubParams）与 proto 不同，需做映射。
 */
function sanitizeOutputParamList(params: Record<string, unknown>[]): Record<string, unknown>[] {
    return params.map((p) => {
        const subParams = (p.SubParameterList || p.SubParams) as Record<string, unknown>[] | undefined;
        const result: Record<string, unknown> = {
            Name: p.Name || '',
            Description: p.Description || p.Desc || '',
            Type: p.Type ?? 0,
            SubParameterList: Array.isArray(subParams) ? sanitizeOutputParamList(subParams) : [],
        };
        return result;
    });
}

/**
 * 清理 AgentToolConfig。
 * 白名单：PluginId, ToolId, Description, InputList, OutputList,
 *          HeaderParameterList, QueryParameterList, ToolSource, IsDisabled。
 */
function sanitizeToolConfig(config: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {
        PluginId: config.PluginId || '',
        ToolId: config.ToolId || '',
        Description: config.Description || '',
        InputList: Array.isArray(config.InputList) ? sanitizeInputParamList(config.InputList as Record<string, unknown>[]) : [],
        OutputList: Array.isArray(config.OutputList) ? sanitizeOutputParamList(config.OutputList as Record<string, unknown>[]) : [],
        HeaderParameterList: Array.isArray(config.HeaderParameterList)
            ? (config.HeaderParameterList as Record<string, unknown>[]).map(sanitizePluginParam)
            : [],
        QueryParameterList: Array.isArray(config.QueryParameterList)
            ? (config.QueryParameterList as Record<string, unknown>[]).map(sanitizePluginParam)
            : [],
    };
    if (config.ToolSource !== undefined) result.ToolSource = config.ToolSource;
    if (config.IsDisabled !== undefined) result.IsDisabled = config.IsDisabled;
    return result;
}

/**
 * 从 ListPlugins 返回的 PluginInfo 构建 AgentPluginConfig（用于新增绑定）。
 * 使用 v2 proto 字段名：PluginId, HeaderParameterList, QueryParameterList,
 *                       IsRoleAuth, AuthMode, AuthType, PluginClass。
 * 设置 AuthMode: 1（使用者授权），确保连接器绑定后鉴权模式正确。
 */
function buildNewPluginConfig(pluginItem: Record<string, unknown>): Record<string, unknown> {
    const headers = (pluginItem.Headers || []) as Record<string, unknown>[];
    const query = (pluginItem.Query || []) as Record<string, unknown>[];

    return {
        PluginId: (pluginItem.PluginId || '') as string,
        HeaderParameterList: headers.map((p) => sanitizePluginParam({
            ParameterName: p.Name || p.ParameterName || p.ParamName || '',
            IsGlobalHidden: !!(p.IsGlobalHidden || p.GlobalHidden),
            IsRequired: !!(p.IsRequired),
            // ListPlugins 返回的 ParamValue 需包装成 Input；若原始已含 Input 优先使用
            Input: (p.Input as Record<string, unknown>) || buildInputFromParamValue(p.ParamValue),
        })),
        QueryParameterList: query.map((p) => sanitizePluginParam({
            ParameterName: p.Name || p.ParameterName || p.ParamName || '',
            IsGlobalHidden: !!(p.IsGlobalHidden || p.GlobalHidden),
            IsRequired: !!(p.IsRequired),
            Input: (p.Input as Record<string, unknown>) || buildInputFromParamValue(p.ParamValue),
        })),
        IsRoleAuth: !!(pluginItem.IsRoleAuth || pluginItem.EnableRoleAuth || pluginItem.EnableCamRoleAuth),
        AuthMode: 1, // 强制设为使用者授权
        AuthType: Number(pluginItem.AuthType || 0),
        PluginClass: Number(pluginItem.PluginClass || 0),
    };
}

/**
 * 从 ListPlugins 返回的 tool 对象构建 AgentToolSpec（用于 ModifyAgent 的 ToolList）。
 * 直接使用 sanitizeToolConfig 确保字段白名单一致。
 */
function buildNewToolSpec(pluginItem: Record<string, unknown>, toolItem: Record<string, unknown>): Record<string, unknown> {
    const pluginId = (pluginItem.PluginId || '') as string;
    const toolId = (toolItem.ToolId || '') as string;
    const toolDesc = (toolItem.Desc || toolItem.Description || '') as string;
    const inputs = (toolItem.Inputs || toolItem.InputList || []) as Record<string, unknown>[];
    const outputs = (toolItem.Outputs || toolItem.OutputList || []) as Record<string, unknown>[];
    const headers = (pluginItem.Headers || []) as Record<string, unknown>[];
    const query = (pluginItem.Query || []) as Record<string, unknown>[];
    const toolSource = Number(toolItem.ToolSource || 0);

    // 构建原始 Config 对象，然后通过 sanitizeToolConfig 做白名单过滤
    const rawConfig: Record<string, unknown> = {
        PluginId: pluginId,
        ToolId: toolId,
        Description: toolDesc,
        InputList: inputs,
        OutputList: outputs,
        HeaderParameterList: headers.map((p) => ({
            ParameterName: p.Name || p.ParameterName || p.ParamName || '',
            IsGlobalHidden: !!(p.IsGlobalHidden || p.GlobalHidden),
            IsRequired: !!(p.IsRequired),
            Input: (p.Input as Record<string, unknown>) || buildInputFromParamValue(p.ParamValue),
        })),
        QueryParameterList: query.map((p) => ({
            ParameterName: p.Name || p.ParameterName || p.ParamName || '',
            IsGlobalHidden: !!(p.IsGlobalHidden || p.GlobalHidden),
            IsRequired: !!(p.IsRequired),
            Input: (p.Input as Record<string, unknown>) || buildInputFromParamValue(p.ParamValue),
        })),
        ToolSource: toolSource,
    };

    return {
        Config: sanitizeToolConfig(rawConfig),
    };
}

/**
 * 把扩展返回的 token 写入 item.raw.Headers 中的 Authorization 项。
 * 仅对 ADP 浏览器助手连接器生效；找不到 Authorization header 时静默忽略。
 */
function applyExtensionTokenToItem(item: ConnectorItem, token: string): void {
    if (!token) return;
    const headers = (item.raw as Record<string, unknown>).Headers as Array<Record<string, unknown>> | undefined;
    const idx = findTokenHeaderIndex(headers);
    if (idx < 0 || !headers) return;
    const entry = headers[idx];
    if (!entry) return;
    entry.ParamValue = token;
    entry.Input = {
        InputType: 1, // USER_INPUT
        UserInputValue: { ValueList: [token] },
    };
}

/** 启用连接器的核心逻辑：BindAgentTool + ModifyAgentToolList。 */
async function doEnableConnector(item: ConnectorItem, agentId: string): Promise<void> {
    const newPluginConfig = buildNewPluginConfig(item.raw);
    const newTools = getItemTools(item.raw);
    const newToolSpecs = newTools.map(t => buildNewToolSpec(item.raw, t));

    // 提取当前插件绑定涉及的 ToolId 列表
    const toolIdList = newTools.map((t) =>
        ((t as Record<string, unknown>).ToolId || '') as string,
    ).filter(Boolean);

    // 步骤 1：BindAgentTool — Connector 类插件无显式工具列表，仅需传 PluginId
    // proto 注释：「已绑定返回 AlreadyExists」，做幂等处理
    try {
        await bindAgentTool({
            applicationId: props.applicationId,
            appId: props.applicationId,
            agentId,
            pluginId: item.pluginId,
            toolSource: 0, // TOOL_SOURCE_PLUGIN
        });
    } catch (bindErr) {
        const msg = (bindErr as { message?: string })?.message || String(bindErr);
        if (!/AlreadyExists/i.test(msg)) {
            throw bindErr;
        }
        console.warn('[ConnectorDialog] BindAgentTool already exists, continue to modify:', item.pluginId);
    }

    // 步骤 2：ModifyAgentToolList — 写入插件参数（鉴权值等）和工具配置
    await modifyAgentToolList({
        applicationId: props.applicationId,
        appId: props.applicationId,
        agentId,
        pluginIdList: [item.pluginId],
        toolIdList,
        pluginList: [newPluginConfig],
        toolList: newToolSpecs,
    });
}

/** 启动 3 秒一次的扩展状态轮询；扩展就绪后自动出队 + 完成启用。 */
function startExtensionPollingForEnable(): void {
    if (extensionPollTimer) return;
    extensionPollTimer = setInterval(async () => {
        const pendingItem = extensionPendingItem.value;
        if (!pendingItem) {
            stopExtensionPollingForEnable();
            return;
        }
        let result;
        try {
            result = await detectExtension();
        } catch (e) {
            // 探测异常不停止，继续轮询
            console.warn('[ConnectorDialog] detectExtension polling error:', e);
            return;
        }
        if (!result || !result.installed) return;

        // 扩展就绪：出队 + 自动启用
        extensionPendingItem.value = null;
        stopExtensionPollingForEnable();
        showExtensionInstallDialog.value = false;

        applyExtensionTokenToItem(pendingItem, result.token || '');

        const agentId = await getAgentIdByAppId(props.applicationId);
        if (!props.applicationId || !agentId) return;
        if (togglingId.value) return; // 用户正在操作其他连接器，避免冲突

        togglingId.value = pendingItem.pluginId;
        try {
            await doEnableConnector(pendingItem, agentId);
            MessagePlugin.success('已开启');
            await fetchInstalled(true);
        } catch (e) {
            console.error('[ConnectorDialog] auto enable after extension ready failed:', e);
            MessagePlugin.error('开启失败');
        } finally {
            togglingId.value = '';
        }
    }, 3000);
}

/** 停止扩展状态轮询。 */
function stopExtensionPollingForEnable(): void {
    if (extensionPollTimer) {
        clearInterval(extensionPollTimer);
        extensionPollTimer = null;
    }
}

/** 用户关闭扩展引导弹窗：仅关弹窗，不清队列，让轮询继续在后台感知扩展就绪。 */
function handleExtensionDialogClose(): void {
    showExtensionInstallDialog.value = false;
}

/**
 * 判断 detectExtension 的失败原因是否表明"扩展确实未安装"。
 * - no-chrome：非 Chromium 内核（理论上前置已过滤，仍兜底）
 * - no-runtime：Chrome 内核但页面未注入 chrome.runtime.sendMessage
 *               （扩展未安装，或扩展未在 externally_connectable.matches 中包含当前站点）
 * - no-extension-id：未配置扩展 ID
 * - no-response：扩展 ID 无对应扩展（未安装/被禁用）
 * - invalid-response：扩展未按协议响应（视为未安装）
 * 其它如 timeout / error / unknown：扩展可能已安装但通信异常，不弹安装引导，避免误导。
 */
function isExtensionMissingReason(reason: DetectExtensionFailReason | undefined): boolean {
    return reason === 'no-chrome'
        || reason === 'no-runtime'
        || reason === 'no-extension-id'
        || reason === 'no-response'
        || reason === 'invalid-response';
}

/**
 * 启用前的扩展检测：
 * - 已安装且 token 就绪：写入 Headers 走正常启用流程
 * - 已安装但通信异常（timeout/error）：直接报错并退出，不弹安装引导
 * - 未安装：弹出安装引导 + 入队 + 启动轮询
 */
async function checkExtensionBeforeEnable(item: ConnectorItem, agentId: string): Promise<void> {
    let result: DetectExtensionResult;
    try {
        result = await detectExtension();
    } catch (e) {
        console.error('[ConnectorDialog] detectExtension error:', e);
        result = { installed: false, token: '', reason: 'error' };
    }

    if (result.installed) {
        // 已安装：把 token 写入 Headers 后走正常启用流程
        applyExtensionTokenToItem(item, result.token || '');
        await doEnableConnector(item, agentId);
        return;
    }

    if (!isExtensionMissingReason(result.reason)) {
        // 扩展可能已安装但通信异常（超时/异常等），不弹安装引导，提示用户后退出
        console.warn('[ConnectorDialog] extension detect non-missing failure:', result.reason);
        throw new Error('浏览器扩展通信异常，请刷新页面或检查扩展状态后重试');
    }

    // 未安装：入队 + 弹出引导 + 启动轮询；轮询命中安装后会自动完成启用
    extensionPendingItem.value = item;
    showExtensionInstallDialog.value = true;
    startExtensionPollingForEnable();
}

/**
 * 切换连接器启用状态：
 * - 开启：先调 BindAgentTool 建立绑定关系（已绑定时忽略 AlreadyExists 错误），
 *         再调 ModifyAgentToolList 写入插件参数（如 Header 鉴权值）和工具列表。
 *         若为 ADP 浏览器助手连接器，启用前先检测 Chrome 扩展是否安装；未安装时引导用户安装。
 * - 关闭：调用 UnbindAgentTool 接口。
 */
async function onToggleEnabled(item: ConnectorItem, val: boolean) {
    if (togglingId.value) return;
    const agentId = await getAgentIdByAppId(props.applicationId);
    if (!props.applicationId || !agentId) {
        MessagePlugin.warning('缺少应用 ID 或 Agent ID');
        return;
    }
    togglingId.value = item.pluginId;
    try {
        if (val) {
            // ADP 浏览器助手连接器：启用前需先检测扩展程序状态
            if (isBrowserAssistantConnector(item.raw) && isChromeBrowser()) {
                await checkExtensionBeforeEnable(item, agentId);
            } else {
                await doEnableConnector(item, agentId);
            }
        } else {
            // 关闭：调用 UnbindAgentTool，后端会同时清理 PluginList 和 ToolList 中的关联数据
            await unbindAgentTool({
                applicationId: props.applicationId,
                appId: props.applicationId,
                agentId,
                pluginId: item.pluginId,
            });
        }

        // 仅当不在"等待扩展安装"状态时才提示成功（扩展未安装的场景下成功提示由轮询完成后统一发出）
        if (extensionPendingItem.value !== item) {
            MessagePlugin.success(val ? '已开启' : '已关闭');
            await fetchInstalled(true);
        }
    } catch (e) {
        console.error('[ConnectorDialog] toggle error:', e);
        MessagePlugin.error(val ? '开启失败' : '关闭失败');
    } finally {
        togglingId.value = '';
    }
}

// 组件销毁前兜底清理轮询定时器与待处理队列，避免内存泄漏
onBeforeUnmount(() => {
    extensionPendingItem.value = null;
    stopExtensionPollingForEnable();
});

watch(() => props.modelValue, (val) => {
    if (val) {
        searchKeyword.value = '';
        enabledOnly.value = false;
        pageNumber.value = 1;
        fetchInstalled();
        fetchList();
    } else {
        // 主弹窗关闭时清理浏览器扩展引导相关状态，避免后台残留轮询
        extensionPendingItem.value = null;
        stopExtensionPollingForEnable();
        showExtensionInstallDialog.value = false;
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
.connector-manage__pagination { display: flex; justify-content: center; flex-shrink: 0; }

/* 连接器列表项 */
.connector-item {
    display: flex;
    align-items: center;
    gap: var(--td-size-6);
    padding: var(--td-size-5) 0;
    border-bottom: 1px solid rgba(18, 42, 79, 0.08);
    transition: background 0.15s;
}
.connector-item:last-child { border-bottom: none; }
.connector-item:hover { background: var(--td-bg-color-container-hover); }
.connector-item__icon { flex-shrink: 0; width: var(--td-comp-size-xl); }
.connector-item__icon img {
    width: var(--td-comp-size-xl);
    height: var(--td-comp-size-xl);
    border-radius: var(--td-radius-large);
    object-fit: cover;
    border: 1px solid var(--td-component-border);
    box-sizing: border-box;
}
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
