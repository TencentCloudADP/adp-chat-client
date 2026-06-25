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

    </t-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
    Dialog as TDialog, Tag as TTag, Loading as TLoading,
    Input as TInput, Checkbox as TCheckbox, Switch as TSwitch, Pagination as TPagination, MessagePlugin,
} from 'tdesign-vue-next';
import CustomizedIcon from '../CustomizedIcon.vue';
import {
    fetchPluginList, PluginClassEnum,
    bindAgentTool,
    unbindAgentTool,
    modifyAgentToolList,
} from '../../service/connectorPluginApi';
import useAgentStore from '../../composables/useAgentStore';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';

interface Props extends ThemeProps {
    modelValue: boolean;
    applicationId?: string;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    modelValue: false,
    applicationId: '',
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

/**
 * 从 AgentPlugin 结构中提取 PluginId。
 * DescribeAgentDetail 返回的 PluginList 每项为 AgentPlugin { Config: AgentPluginConfig, Name, ... }，
 * PluginId 位于 Config 子对象中，需要兼容顶层和 Config 嵌套两种情况。
 */
function extractPluginId(p: Record<string, unknown>): string {
    const directId = (p.PluginId || p.plugin_id || '') as string;
    if (directId) return directId;
    const config = (p.Config || p.config) as Record<string, unknown> | undefined;
    return config ? ((config.PluginId || config.plugin_id || '') as string) : '';
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
            .filter((it) => !kw || it.name.toLowerCase().includes(kw) || it.desc.toLowerCase().includes(kw));
    }
    // cardList 中的 enabled 是构建时的静态快照，需要依赖最新的 installedIdSet 动态派生
    return cardList.value.map((item) => ({
        ...item,
        enabled: installedIdSet.value.has(item.pluginId),
    }));
});

function buildItemFromInstalled(p: Record<string, unknown>): ConnectorItem {
    const pluginId = extractPluginId(p);
    return {
        pluginId,
        name: (p.Name || p.PluginName || p.plugin_name || '') as string,
        desc: (p.Desc || p.PluginDesc || p.plugin_desc || p.Introduction || '') as string,
        iconUrl: (p.IconUrl || p.icon_url || '') as string,
        isInner: Number(p.PluginType || p.plugin_type || 0) === 1,
        enabled: true,
        raw: p,
    };
}

function buildItemFromList(p: Record<string, unknown>): ConnectorItem {
    const pluginId = extractPluginId(p);
    return {
        pluginId,
        name: (p.Name || p.PluginName || p.plugin_name || '') as string,
        desc: (p.Desc || p.PluginDesc || p.plugin_desc || p.Introduction || '') as string,
        iconUrl: (p.IconUrl || p.icon_url || '') as string,
        isInner: Number(p.PluginType || p.plugin_type || 0) === 1,
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
        });
        cardList.value = result.plugins.map(buildItemFromList);
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
    return ((p.tools || p.Tools || p.ToolList) as Record<string, unknown>[] | undefined) || [];
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
        ParameterName: param.ParameterName || param.Name || param.ParamName || param.name || '',
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
        const subParams = (p.SubParameterList || p.SubParams || p.sub_parameter_list) as Record<string, unknown>[] | undefined;
        const oneOfList = (p.OneOfList || p.OneOf || p.one_of_list) as Record<string, unknown>[] | undefined;
        const anyOfList = (p.AnyOfList || p.AnyOf || p.any_of_list) as Record<string, unknown>[] | undefined;
        const result: Record<string, unknown> = {
            Name: p.Name || p.name || '',
            Description: p.Description || p.Desc || p.desc || '',
            Type: p.Type ?? 0,
            IsRequired: !!(p.IsRequired),
            IsAgentHidden: !!(p.IsAgentHidden || p.IsHidden || p.GlobalHidden || p.global_hidden),
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
        const subParams = (p.SubParameterList || p.SubParams || p.sub_parameter_list) as Record<string, unknown>[] | undefined;
        const result: Record<string, unknown> = {
            Name: p.Name || p.name || '',
            Description: p.Description || p.Desc || p.desc || '',
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
    const headers = (pluginItem.Headers || pluginItem.headers || []) as Record<string, unknown>[];
    const query = (pluginItem.Query || pluginItem.query || []) as Record<string, unknown>[];

    return {
        PluginId: (pluginItem.PluginId || pluginItem.plugin_id || '') as string,
        HeaderParameterList: headers.map((p) => sanitizePluginParam({
            ParameterName: p.Name || p.ParameterName || p.ParamName || p.param_name || p.name || '',
            IsGlobalHidden: !!(p.IsGlobalHidden || p.GlobalHidden || p.global_hidden),
            IsRequired: !!(p.IsRequired || p.is_required),
            // ListPlugins 返回的 ParamValue 需包装成 Input；若原始已含 Input 优先使用
            Input: (p.Input as Record<string, unknown>) || (p.input as Record<string, unknown>) || buildInputFromParamValue(p.ParamValue || p.param_value),
        })),
        QueryParameterList: query.map((p) => sanitizePluginParam({
            ParameterName: p.Name || p.ParameterName || p.ParamName || p.param_name || p.name || '',
            IsGlobalHidden: !!(p.IsGlobalHidden || p.GlobalHidden || p.global_hidden),
            IsRequired: !!(p.IsRequired || p.is_required),
            Input: (p.Input as Record<string, unknown>) || (p.input as Record<string, unknown>) || buildInputFromParamValue(p.ParamValue || p.param_value),
        })),
        IsRoleAuth: !!(pluginItem.IsRoleAuth || pluginItem.is_role_auth || pluginItem.EnableRoleAuth || pluginItem.enable_role_auth || pluginItem.EnableCamRoleAuth),
        AuthMode: 1, // 强制设为使用者授权
        AuthType: Number(pluginItem.AuthType || pluginItem.auth_type || 0),
        PluginClass: Number(pluginItem.PluginClass || pluginItem.plugin_class || 0),
    };
}

/**
 * 从 ListPlugins 返回的 tool 对象构建 AgentToolSpec（用于 ModifyAgent 的 ToolList）。
 * 直接使用 sanitizeToolConfig 确保字段白名单一致。
 */
function buildNewToolSpec(pluginItem: Record<string, unknown>, toolItem: Record<string, unknown>): Record<string, unknown> {
    const pluginId = (pluginItem.PluginId || pluginItem.plugin_id || '') as string;
    const toolId = (toolItem.ToolId || toolItem.tool_id || toolItem.id || '') as string;
    const toolDesc = (toolItem.Desc || toolItem.tool_desc || toolItem.description || toolItem.Description || '') as string;
    const inputs = (toolItem.Inputs || toolItem.inputs || toolItem.InputList || []) as Record<string, unknown>[];
    const outputs = (toolItem.Outputs || toolItem.outputs || toolItem.OutputList || []) as Record<string, unknown>[];
    const headers = (pluginItem.Headers || pluginItem.headers || []) as Record<string, unknown>[];
    const query = (pluginItem.Query || pluginItem.query || []) as Record<string, unknown>[];
    const toolSource = Number(toolItem.ToolSource || toolItem.tool_source || 0);

    // 构建原始 Config 对象，然后通过 sanitizeToolConfig 做白名单过滤
    const rawConfig: Record<string, unknown> = {
        PluginId: pluginId,
        ToolId: toolId,
        Description: toolDesc,
        InputList: inputs,
        OutputList: outputs,
        HeaderParameterList: headers.map((p) => ({
            ParameterName: p.Name || p.ParameterName || p.ParamName || p.param_name || p.name || '',
            IsGlobalHidden: !!(p.IsGlobalHidden || p.GlobalHidden || p.global_hidden),
            IsRequired: !!(p.IsRequired || p.is_required),
            Input: (p.Input as Record<string, unknown>) || (p.input as Record<string, unknown>) || buildInputFromParamValue(p.ParamValue || p.param_value),
        })),
        QueryParameterList: query.map((p) => ({
            ParameterName: p.Name || p.ParameterName || p.ParamName || p.param_name || p.name || '',
            IsGlobalHidden: !!(p.IsGlobalHidden || p.GlobalHidden || p.global_hidden),
            IsRequired: !!(p.IsRequired || p.is_required),
            Input: (p.Input as Record<string, unknown>) || (p.input as Record<string, unknown>) || buildInputFromParamValue(p.ParamValue || p.param_value),
        })),
        ToolSource: toolSource,
    };

    return {
        Config: sanitizeToolConfig(rawConfig),
    };
}

/**
 * 切换连接器启用状态：
 * - 开启：先调 BindAgentTool 建立绑定关系（已绑定时忽略 AlreadyExists 错误），
 *         再调 ModifyAgentToolList 写入插件参数（如 Header 鉴权值）和工具列表。
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
            // 开启：先 BindAgentTool 建立绑定关系，再 ModifyAgentToolList 写入配置
            const newPluginConfig = buildNewPluginConfig(item.raw);
            const newTools = getItemTools(item.raw);
            const newToolSpecs = newTools.map(t => buildNewToolSpec(item.raw, t));

            // 提取当前插件绑定涉及的 tool_id 列表
            const toolIdList = newTools.map((t) =>
                ((t as Record<string, unknown>).ToolId || (t as Record<string, unknown>).tool_id || (t as Record<string, unknown>).id || '') as string,
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
                // AlreadyExists 表示已绑定，可继续走 Modify 流程；其它错误抛出
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
        } else {
            // 关闭：调用 UnbindAgentTool，后端会同时清理 PluginList 和 ToolList 中的关联数据
            await unbindAgentTool({
                applicationId: props.applicationId,
                appId: props.applicationId,
                agentId,
                pluginId: item.pluginId,
            });
        }

        MessagePlugin.success(val ? '已开启' : '已关闭');       
        await fetchInstalled(true);
    } catch (e) {
        console.error('[ConnectorDialog] toggle error:', e);
        MessagePlugin.error(val ? '开启失败' : '关闭失败');
    } finally {
        togglingId.value = '';
    }
}

watch(() => props.modelValue, (val) => {
    if (val) {
        searchKeyword.value = '';
        enabledOnly.value = false;
        pageNumber.value = 1;
        fetchInstalled();
        fetchList();
    }
});
</script>

<style scoped>
.connector-manage { display: flex; flex-direction: column; gap: 12px; height: 540px; overflow: hidden; }
.connector-manage__filter-bar { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.connector-manage__search { width: 240px; }
.connector-manage__loading { display: flex; align-items: center; justify-content: center; flex: 1; }
.connector-manage__empty { display: flex; align-items: center; justify-content: center; flex: 1; color: var(--td-text-color-placeholder); font-size: 13px; }
.connector-manage__list { flex: 1; overflow-y: auto; min-height: 0; display: flex; flex-direction: column; padding-right: 8px; }
.connector-manage__list::-webkit-scrollbar { width: 4px; }
.connector-manage__list::-webkit-scrollbar-thumb { border-radius: 2px; background: rgba(17, 32, 70, 0.13); }
.connector-manage__pagination { display: flex; justify-content: center; flex-shrink: 0; }

.connector-item { display: flex; align-items: center; gap: 16px; padding: 14px 0; border-bottom: 1px solid rgba(0, 44, 85, 0.08); transition: background 0.15s; }
.connector-item:last-child { border-bottom: none; }
.connector-item:hover { background: var(--td-bg-color-container-hover); }
.connector-item__icon { flex-shrink: 0; width: 40px; }
.connector-item__icon img { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(0, 44, 85, 0.08); box-sizing: border-box; }
.connector-item__icon-fb { width: 40px; height: 40px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; background: var(--td-bg-color-secondarycontainer); color: var(--td-text-color-placeholder); border: 1px solid rgba(0, 44, 85, 0.08); box-sizing: border-box; }
.connector-item__info { flex: 1; min-width: 0; overflow: hidden; }
.connector-item__title { display: flex; align-items: center; gap: 6px; flex-wrap: nowrap; overflow: hidden; }
.connector-item__name { font-size: 15px; font-weight: 500; color: var(--td-text-color-primary); line-height: 24px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 360px; }
.connector-item__desc { font-size: 13px; color: var(--td-text-color-placeholder); line-height: 20px; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.connector-item__actions { flex-shrink: 0; display: flex; align-items: center; gap: 12px; }
</style>
