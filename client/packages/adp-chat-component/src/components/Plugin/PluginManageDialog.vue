<template>
    <t-dialog
        v-model:visible="visible"
        :header="mergedI18n.manageTool"
        :footer="false"
        :close-on-overlay-click="false"
        width="min(900px, calc(100vw - 40px))"
    >
        <div class="manage-tool-dialog">
            <!-- 操作栏 -->
            <div class="manage-tool-dialog__action-bar">
                <t-button theme="primary"  @click="onOpenAdd">
                    <template #icon><CustomizedIcon  color="var(--td-font-white-1)"  remote name="basic_new_line" size="xs" :show-hover-bg="false" :theme="theme" /></template>
                    {{ mergedI18n.addSkillsBtn }}
                </t-button>
            </div>

            <!-- 列表区域 -->
            <div v-if="loading" class="manage-tool-dialog__loading">
                <t-loading size="small" :text="mergedI18n.loading" />
            </div>
            <div v-else-if="filteredList.length === 0" class="manage-tool-dialog__empty">
                <span>{{ mergedI18n.noAddedTools }}</span>
            </div>
            <div v-else class="manage-tool-dialog__list">
                <div v-for="item in filteredList" :key="item.toolId" class="manage-tool-item">
                    <div class="manage-tool-item__icon">
                        <img v-if="item.iconUrl" :src="item.iconUrl" @error="onIconError" />
                        <span v-else class="manage-tool-item__icon-fb"><CustomizedIcon remote name="basic_plugin_line" size="s" :show-hover-bg="false" :theme="theme" /></span>
                    </div>
                    <div class="manage-tool-item__info">
                        <div class="manage-tool-item__title">
                            <t-tooltip :content="item.displayName" placement="top"><span class="manage-tool-item__name">{{ item.displayName }}</span></t-tooltip>
                            <t-tag v-if="item.isInner"  variant="light-outline">{{ mergedI18n.tagBuiltin }}</t-tag>
                            <t-tag v-if="item.createTypeLabel"  variant="light">{{ item.createTypeLabel }}</t-tag>
                        </div>
                        <t-tooltip :content="item.desc || item.pluginName" placement="top"><div class="manage-tool-item__desc">{{ item.desc || item.pluginName }}</div></t-tooltip>
                    </div>
                    <div class="manage-tool-item__actions">
                        <t-button
                            v-if="!item.isInner"
                            
                            variant="text"
                            theme="danger"
                            :loading="deletingId === item.toolId"
                            :disabled="!!deletingId && deletingId !== item.toolId"
                            @click="onDelete(item)"
                        >
                            <template #icon><CustomizedIcon remote name="basic_delete_line" size="xs" :show-hover-bg="false" :theme="theme" /></template>
                        </t-button>
                        <t-tooltip v-else :content="mergedI18n.builtinNotDeletable" placement="top">
                            <t-button  variant="text" theme="default" disabled>
                                <template #icon><CustomizedIcon remote name="basic_delete_line" size="xs" :show-hover-bg="false" :theme="theme" /></template>
                            </t-button>
                        </t-tooltip>
                    </div>
                </div>
            </div>
        </div>

        <!-- 添加工具子弹窗 -->
        <PluginInstallDialog
            v-model="showInstall"
            :application-id="applicationId"
            :space-id="spaceId || 'default_space'"
            :theme="theme"
            :language="language"
            :i18n="i18n"
            :installed-tool-ids="installedToolIds"
            :installed-tools="installedTools"
            @installed="onInstalled"
        />
    </t-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
    Dialog as TDialog, Button as TButton, Tag as TTag,
    Loading as TLoading, Tooltip as TTooltip, MessagePlugin,
} from 'tdesign-vue-next';
import CustomizedIcon from '../CustomizedIcon.vue';
import { fetchGlobalAgent } from '../../service/skillsApi';
import { unbindAgentTool } from '../../service/connectorPluginApi';
import PluginInstallDialog from './PluginInstallDialog.vue';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
import type { SkillsI18n } from '../../model/skills';
import { defaultSkillsI18n, defaultSkillsI18nEn } from '../../model/skills';
import useAgentStore from '../../composables/useAgentStore';

interface Props extends ThemeProps {
    modelValue: boolean;
    applicationId?: string;
    spaceId?: string;
    /** 国际化文本（与 SkillsPopover / Sender 共享 SkillsI18n） */
    i18n?: Partial<SkillsI18n>;
    /** 语言，决定默认中/英文本，'en-*' 走英文 */
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

const { getAgentIdByAppId } = useAgentStore();
const emit = defineEmits<{
    (e: 'update:modelValue', v: boolean): void;
    /** 数据变更后通知父组件刷新 */
    (e: 'change'): void;
}>();

const visible = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) });
const loading = ref(false);
const searchKeyword = ref('');
const showInstall = ref(false);
const deletingId = ref('');

interface ManageToolItem {
    toolId: string;
    pluginId: string;
    pluginName: string;
    displayName: string;
    desc: string;
    iconUrl: string;
    isInner: boolean;
    createTypeLabel: string;
    pluginClass: number;
}

const toolList = ref<ManageToolItem[]>([]);

const installedToolIds = computed(() => toolList.value.map(t => t.toolId));
/**
 * 已安装工具的 (pluginId, toolId) 映射，传给 PluginInstallDialog 用于在未懒加载工具明细时
 * 也能正确显示「已全部添加」状态。
 */
const installedTools = computed(() =>
    toolList.value
        .filter(t => t.pluginId && t.toolId)
        .map(t => ({ pluginId: t.pluginId, toolId: t.toolId })),
);

const filteredList = computed(() => {
    const kw = searchKeyword.value.trim().toLowerCase();
    if (!kw) return toolList.value;
    return toolList.value.filter(t =>
        t.displayName.toLowerCase().includes(kw) || t.desc.toLowerCase().includes(kw)
    );
});

function onIconError(e: Event) { (e.target as HTMLImageElement).style.display = 'none'; }

/** 从 DescribeAgentDetail 获取已安装工具列表 */
async function fetchInstalledTools() {
    if (!props.applicationId) return;
    loading.value = true;
    try {
        const agentId = await getAgentIdByAppId(props.applicationId);
        if (!agentId) { loading.value = false; return; }
        const result = await fetchGlobalAgent({ applicationId: props.applicationId, agentId });
        const plugins = (result.plugins || []) as Record<string, unknown>[];
        const tools = (result.tools || []) as Record<string, unknown>[];

        const pluginMap = new Map<string, Record<string, unknown>>();
        plugins.forEach(p => {
            const pc = (p.Config || p.config || {}) as Record<string, unknown>;
            const id = (pc.PluginId || pc.plugin_id || p.PluginId || p.plugin_id || '') as string;
            if (id) pluginMap.set(id, p);
        });

        toolList.value = tools.map(t => {
            const cfg = (t.Config || t.config || {}) as Record<string, unknown>;
            const pluginId = (cfg.plugin_id || cfg.PluginId || '') as string;
            const toolId = (cfg.tool_id || cfg.ToolId || '') as string;
            const plugin = pluginMap.get(pluginId) || {};

            // 插件中文名（v3 proto AgentPlugin.Name）
            const pluginName = (plugin.Name || plugin.name || plugin.PluginName || plugin.plugin_name || '') as string;
            // 工具名（v3 proto AgentTool.Name，通常为英文技术名）
            const toolName = (t.Name || t.name || t.tool_name || t.ToolName || '') as string;
            // 拼接显示名：插件中文名 / 工具英文名（对齐 webim _buildToolManageList）
            const displayName = pluginName && toolName ? `${pluginName}/${toolName}` : (toolName || toolId);

            const createType = Number(plugin.CreateType || plugin.create_type || 0);
            let createTypeLabel = '';
            if (createType === 2) createTypeLabel = mergedI18n.value.createTypeLabelMcp;
            else if (createType === 0) createTypeLabel = mergedI18n.value.createTypeLabelApi;
            else if (createType === 1) createTypeLabel = mergedI18n.value.createTypeLabelCode;
            else if (createType === 3) createTypeLabel = mergedI18n.value.createTypeLabelApp;

            const pluginClass = Number(plugin.PluginClass || plugin.plugin_class || 0);

            return {
                toolId,
                pluginId,
                pluginName,
                displayName,
                desc: (cfg.description || cfg.Description || '') as string,
                iconUrl: (t.IconUrl || t.icon_url || plugin.IconUrl || plugin.icon_url || '') as string,
                isInner: !!(t.IsInner || t.is_inner),
                createTypeLabel,
                pluginClass,
            };
        });
    } catch (e) {
        console.error('[PluginManageDialog] fetchInstalledTools error:', e);
    } finally {
        loading.value = false;
    }
}

async function onDelete(item: ManageToolItem) {
    if (deletingId.value) return;
    deletingId.value = item.toolId;
    try {
        const agentId = await getAgentIdByAppId(props.applicationId);
        if (!props.applicationId || !agentId) {
            MessagePlugin.warning(mergedI18n.value.missingAppOrAgentId);
            return;
        }
        await unbindAgentTool({
            applicationId: props.applicationId,
            appId: props.applicationId,
            agentId,
            pluginId: item.pluginId,
            toolId: item.pluginClass === 1 ? '' : item.toolId,
        });
        toolList.value = toolList.value.filter(t => t.toolId !== item.toolId);
        emit('change');
        MessagePlugin.success(mergedI18n.value.removeSuccessToast);
    } catch (e) {
        console.error('[UnbindAgentTool] 解绑失败:', e);
        MessagePlugin.error(mergedI18n.value.toolRemoveFailedToast);
    } finally {
        deletingId.value = '';
    }
}

function onOpenAdd() {
    showInstall.value = true;
}

function onInstalled() {
    fetchInstalledTools();
    emit('change');
}

watch(() => props.modelValue, (val) => {
    if (val) {
        searchKeyword.value = '';
        fetchInstalledTools();
    }
});
</script>

<style scoped>
.manage-tool-dialog { display: flex; flex-direction: column; gap: var(--td-size-5); height: 480px; overflow: hidden; }
.manage-tool-dialog__action-bar { display: flex; align-items: center; gap: var(--td-size-4); flex-shrink: 0; }
.manage-tool-dialog__action-bar  .customeized-icon{
    margin-right: var(--td-size-2);
}
.manage-tool-dialog__search { width: 200px; margin-left: auto; }
.manage-tool-dialog__loading { display: flex; align-items: center; justify-content: center; flex: 1; }
.manage-tool-dialog__empty { display: flex; align-items: center; justify-content: center; flex: 1; color: var(--td-text-color-placeholder); font-size: 13px; }
.manage-tool-dialog__list { flex: 1; overflow-y: auto; min-height: 0; display: flex; flex-direction: column; padding-right: 10px; }
.manage-tool-dialog__list::-webkit-scrollbar { width: 4px; }
.manage-tool-dialog__list::-webkit-scrollbar-thumb { border-radius: 2px; background: rgba(17, 32, 70, 0.13); }

.manage-tool-item { display: flex; align-items: center; gap: var(--td-size-6); padding: 14px 0; border-bottom: 1px solid rgba(0, 44, 85, 0.08); transition: background 0.15s; }
.manage-tool-item:last-child { border-bottom: none; }
.manage-tool-item__icon { flex-shrink: 0; width: 40px; }
.manage-tool-item__icon img { width: 40px; height: 40px; border-radius: var(--td-radius-medium); object-fit: cover; border: 1px solid rgba(0, 44, 85, 0.08); box-sizing: border-box; }
.manage-tool-item__icon-fb { width: 40px; height: 40px; border-radius: var(--td-radius-medium); display: inline-flex; align-items: center; justify-content: center; background: var(--td-bg-color-secondarycontainer); color: var(--td-text-color-placeholder); border: 1px solid rgba(0, 44, 85, 0.08); box-sizing: border-box; }
.manage-tool-item__info { flex: 1; min-width: 0; overflow: hidden; }
.manage-tool-item__title { display: flex; align-items: center; gap: var(--td-size-3); flex-wrap: nowrap; overflow: hidden; }
.manage-tool-item__name { font-size: 15px; font-weight: 500; color: var(--td-text-color-primary); line-height: var(--td-line-height-body-large); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 400px; }
.manage-tool-item__desc { font-size: 13px; color: var(--td-text-color-placeholder); line-height: var(--td-line-height-body-small); margin-top: var(--td-size-2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.manage-tool-item__actions { flex-shrink: 0; display: flex; align-items: center; gap: var(--td-size-2); }
/* 禁用状态删除按钮 */
.manage-tool-item__actions :deep(.t-button.t-is-disabled) { opacity: 0.35; cursor: not-allowed; }
</style>
