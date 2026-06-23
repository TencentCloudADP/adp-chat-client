<template>
    <t-dialog
        v-model:visible="visible"
        header="管理工具"
        :footer="false"
        width="700px"
        :close-on-overlay-click="false"
    >
        <div class="manage-tool-dialog">
            <!-- 操作栏 -->
            <div class="manage-tool-dialog__action-bar">
                <t-button theme="primary"  @click="onOpenAdd">
                    <template #icon><t-icon name="add" /></template>
                    添加
                </t-button>
                <t-input v-model="searchKeyword" placeholder="搜索工具"  clearable class="manage-tool-dialog__search">
                    <template #prefix-icon><t-icon name="search" /></template>
                </t-input>
            </div>

            <!-- 列表区域 -->
            <div v-if="loading" class="manage-tool-dialog__loading">
                <t-loading size="large" text="加载中..." />
            </div>
            <div v-else-if="filteredList.length === 0" class="manage-tool-dialog__empty">
                <span>暂无已安装工具</span>
            </div>
            <div v-else class="manage-tool-dialog__list">
                <div v-for="item in filteredList" :key="item.toolId" class="manage-tool-item">
                    <div class="manage-tool-item__icon">
                        <img v-if="item.iconUrl" :src="item.iconUrl" @error="onIconError" />
                        <span v-else class="manage-tool-item__icon-fb"><t-icon name="tools" /></span>
                    </div>
                    <div class="manage-tool-item__info">
                        <div class="manage-tool-item__title">
                            <span class="manage-tool-item__name" :title="item.displayName">{{ item.displayName }}</span>
                            <t-tag v-if="item.isInner"  variant="light">预置</t-tag>
                            <t-tag v-if="item.createTypeLabel"  color="gray">{{ item.createTypeLabel }}</t-tag>
                        </div>
                        <div class="manage-tool-item__desc" :title="item.desc">{{ item.desc || item.pluginName }}</div>
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
                            <template #icon><t-icon name="delete" /></template>
                            删除
                        </t-button>
                        <t-tooltip v-else content="预置工具无法删除" placement="top">
                            <t-button  variant="text" theme="default" disabled>
                                <template #icon><t-icon name="delete" /></template>
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
            :agent-id="agentId"
            :installed-tool-ids="installedToolIds"
            @installed="onInstalled"
        />
    </t-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
    Dialog as TDialog, Button as TButton, Icon as TIcon, Tag as TTag,
    Input as TInput, Loading as TLoading, Tooltip as TTooltip, MessagePlugin,
} from 'tdesign-vue-next';
import { fetchGlobalAgent } from '../../service/skillsApi';
import { unbindAgentTool } from '../../service/connectorPluginApi';
import PluginInstallDialog from './PluginInstallDialog.vue';

interface Props {
    modelValue: boolean;
    applicationId?: string;
    agentId?: string;
}
const props = withDefaults(defineProps<Props>(), { modelValue: false, applicationId: '', agentId: '' });
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
        const result = await fetchGlobalAgent({ applicationId: props.applicationId });
        const plugins = (result.plugins || []) as Record<string, unknown>[];
        const tools = (result.tools || []) as Record<string, unknown>[];

        const pluginMap = new Map<string, Record<string, unknown>>();
        plugins.forEach(p => {
            const id = (p.PluginId || p.plugin_id || '') as string;
            if (id) pluginMap.set(id, p);
        });

        toolList.value = tools.map(t => {
            const cfg = (t.Config || t.config || {}) as Record<string, unknown>;
            const pluginId = (cfg.plugin_id || cfg.PluginId || '') as string;
            const toolId = (cfg.tool_id || cfg.ToolId || '') as string;
            const plugin = pluginMap.get(pluginId) || {};

            const rawName = (t.tool_name || t.ToolName || t.name || t.Name || cfg.description || '') as string;
            const slashIdx = rawName.lastIndexOf('/');
            const displayName = slashIdx > 0 ? rawName.substring(0, slashIdx) : rawName;

            const createType = Number(plugin.CreateType || plugin.create_type || 0);
            let createTypeLabel = '';
            if (createType === 2) createTypeLabel = 'MCP';
            else if (createType === 0) createTypeLabel = 'API';
            else if (createType === 1) createTypeLabel = '代码';
            else if (createType === 3) createTypeLabel = '应用';

            const pluginClass = Number(plugin.PluginClass || plugin.plugin_class || 0);

            return {
                toolId,
                pluginId,
                pluginName: (plugin.Name || plugin.PluginName || plugin.plugin_name || '') as string,
                displayName: displayName || toolId,
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
        if (!props.applicationId || !props.agentId) {
            MessagePlugin.warning('缺少应用 ID 或 Agent ID');
            return;
        }
        await unbindAgentTool({
            applicationId: props.applicationId,
            appId: props.applicationId,
            agentId: props.agentId,
            pluginId: item.pluginId,
            toolId: item.pluginClass === 1 ? '' : item.toolId,
        });
        toolList.value = toolList.value.filter(t => t.toolId !== item.toolId);
        emit('change');
        MessagePlugin.success('已删除');
    } catch (e) {
        console.error('[UnbindAgentTool] 解绑失败:', e);
        MessagePlugin.error('工具删除失败');
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
.manage-tool-dialog { display: flex; flex-direction: column; gap: 12px; height: 480px; overflow: hidden; }
.manage-tool-dialog__action-bar { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.manage-tool-dialog__search { width: 200px; margin-left: auto; }
.manage-tool-dialog__loading { display: flex; align-items: center; justify-content: center; flex: 1; }
.manage-tool-dialog__empty { display: flex; align-items: center; justify-content: center; flex: 1; color: var(--td-text-color-placeholder); font-size: 13px; }
.manage-tool-dialog__list { flex: 1; overflow-y: auto; min-height: 0; display: flex; flex-direction: column; padding-right: 10px; }
.manage-tool-dialog__list::-webkit-scrollbar { width: 4px; }
.manage-tool-dialog__list::-webkit-scrollbar-thumb { border-radius: 2px; background: rgba(17, 32, 70, 0.13); }

.manage-tool-item { display: flex; align-items: center; gap: 16px; padding: 14px 0; border-bottom: 1px solid rgba(0, 44, 85, 0.08); transition: background 0.15s; }
.manage-tool-item:last-child { border-bottom: none; }
.manage-tool-item:hover { background: var(--td-bg-color-container-hover); }
.manage-tool-item__icon { flex-shrink: 0; width: 40px; }
.manage-tool-item__icon img { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(0, 44, 85, 0.08); box-sizing: border-box; }
.manage-tool-item__icon-fb { width: 40px; height: 40px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; background: var(--td-bg-color-secondarycontainer); color: var(--td-text-color-placeholder); border: 1px solid rgba(0, 44, 85, 0.08); box-sizing: border-box; }
.manage-tool-item__info { flex: 1; min-width: 0; overflow: hidden; }
.manage-tool-item__title { display: flex; align-items: center; gap: 6px; flex-wrap: nowrap; overflow: hidden; }
.manage-tool-item__name { font-size: 15px; font-weight: 500; color: var(--td-text-color-primary); line-height: 24px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 400px; }
.manage-tool-item__desc { font-size: 13px; color: var(--td-text-color-placeholder); line-height: 20px; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.manage-tool-item__actions { flex-shrink: 0; display: flex; align-items: center; gap: 4px; }
</style>
