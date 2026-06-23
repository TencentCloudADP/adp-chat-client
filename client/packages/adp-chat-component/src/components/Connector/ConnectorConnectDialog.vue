<template>
    <t-dialog
        v-model:visible="visible"
        :header="title"
        :on-confirm="handleConfirm"
        :on-cancel="handleClose"
        :confirm-loading="loading"
        :close-on-overlay-click="false"
        width="520px"
    >
        <div class="connector-connect">
            <!-- OAuth 类型：展示授权状态 + 跳转授权链接 -->
            <div v-if="isOAuth" class="connector-connect__auth">
                <div class="connector-connect__auth-label">连接器授权</div>
                <div class="connector-connect__auth-row">
                    <span
                        class="connector-connect__auth-dot"
                        :class="isAuthorized ? 'is-success' : 'is-warning'"
                    ></span>
                    <span class="connector-connect__auth-status">
                        {{ isAuthorized ? '已授权' : '待授权' }}
                    </span>
                    <span class="connector-connect__auth-link" @click="handleOAuth">
                        {{ isAuthorized ? '重新授权' : '去授权' }}
                    </span>
                </div>
                <div class="connector-connect__auth-tip">
                    完成授权后请点击右下角"确认"按钮保存。
                </div>
            </div>

            <!-- API_KEY / Headers / Query 表单 -->
            <div v-if="formItems.length" class="connector-connect__form">
                <div
                    v-for="item in formItems"
                    :key="item.key"
                    class="connector-connect__item"
                >
                    <div class="connector-connect__label">
                        <span class="connector-connect__loc-tag">{{ item.loc === 'query' ? 'Query' : 'Header' }}</span>
                        {{ item.paramName }}
                        <span v-if="item.required" class="connector-connect__required">*</span>
                    </div>
                    <t-input
                        v-model="formValues[item.key]"
                        :placeholder="`请输入 ${item.paramName}`"
                        size="small"
                        clearable
                    />
                </div>
            </div>

            <!-- 既无 OAuth 也无表单 -->
            <div v-if="!isOAuth && !formItems.length" class="connector-connect__empty">
                该连接器无需配置鉴权参数，可直接确认连接。
            </div>
        </div>
    </t-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
    Dialog as TDialog, Input as TInput, MessagePlugin,
} from 'tdesign-vue-next';
import {
    bindAgentTool, createOAuthUrl, buildPluginConfig,
} from '../../service/connectorPluginApi';

interface Props {
    modelValue: boolean;
    /** 当前连接器（ListPlugins 返回的原始对象，PascalCase 字段为主） */
    connector: Record<string, unknown> | null;
    applicationId: string;
    agentId: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    connector: null,
    applicationId: '',
    agentId: '',
});

const emit = defineEmits<{
    (e: 'update:modelValue', v: boolean): void;
    /** 连接成功后通知父组件刷新列表 */
    (e: 'connected', connector: Record<string, unknown>): void;
}>();

const visible = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v),
});

const loading = ref(false);
const isAuthorized = ref(false);

interface FormItem {
    key: string;
    loc: 'header' | 'query';
    paramName: string;
    required: boolean;
}

const formValues = ref<Record<string, string>>({});

/**
 * AuthType / auth_type：插件鉴权类型（0=无鉴权 / 2=CAM / 3=OAuth）
 * 列表接口下发为 PascalCase `AuthType`，已绑定接口下发为 snake_case `auth_type`。
 */
const authType = computed(() => {
    if (!props.connector) return 0;
    return Number(props.connector.AuthType || props.connector.auth_type || 0);
});

const isOAuth = computed(() => authType.value === 3);

const title = computed(() => {
    const name = (props.connector?.Name || props.connector?.PluginName || props.connector?.plugin_name || '') as string;
    return name ? `连接 ${name}` : '连接连接器';
});

/**
 * 从连接器原始数据提取 headers + query 表单项
 * 字段命名兼容三种来源：
 * - 列表 PascalCase：Headers / Query；项内 ParamName / GlobalHidden / IsRequired
 * - 已绑定旧 snake：headers / query / header_parameter_list / query_parameter_list；项内 param_name / global_hidden / is_required
 * - 已绑定新 snake：header_parameter_list / query_parameter_list；项内 parameter_name / is_global_hidden / is_required
 */
const formItems = computed<FormItem[]>(() => {
    if (!props.connector || isOAuth.value) return [];
    const headers = (
        props.connector.Headers
        || props.connector.headers
        || props.connector.HeaderParameterList
        || props.connector.header_parameter_list
        || []
    ) as Record<string, unknown>[];
    const query = (
        props.connector.Query
        || props.connector.query
        || props.connector.QueryParameterList
        || props.connector.query_parameter_list
        || []
    ) as Record<string, unknown>[];

    const buildItem = (p: Record<string, unknown>, loc: 'header' | 'query'): FormItem | null => {
        const paramName = (
            p.ParamName || p.param_name
            || p.ParameterName || p.parameter_name
            || p.Name || p.name
            || ''
        ) as string;
        if (!paramName) return null;
        // 全局隐藏项：后台已配置，前端不展示
        const hidden = !!(p.GlobalHidden || p.global_hidden || p.IsGlobalHidden || p.is_global_hidden);
        if (hidden) return null;
        // 必填默认 true，仅在显式 false 时为非必填
        const requiredRaw = p.IsRequired ?? p.is_required;
        const required = requiredRaw === undefined ? true : requiredRaw !== false;
        return {
            key: `${loc}:${paramName}`,
            loc,
            paramName,
            required,
        };
    };

    return [
        ...headers.map((p) => buildItem(p, 'header')).filter(Boolean) as FormItem[],
        ...query.map((p) => buildItem(p, 'query')).filter(Boolean) as FormItem[],
    ];
});

/** 是否所有必填项都已填 */
function validate(): boolean {
    for (const item of formItems.value) {
        if (item.required && !formValues.value[item.key]) {
            MessagePlugin.warning(`请填写 ${item.paramName}`);
            return false;
        }
    }
    return true;
}

/** 跳转 OAuth 授权页 */
async function handleOAuth() {
    if (!props.connector || !props.applicationId) return;
    const pluginId = (props.connector.PluginId || props.connector.plugin_id || '') as string;
    if (!pluginId) {
        MessagePlugin.error('连接器 ID 缺失');
        return;
    }
    try {
        const { oauthUrl } = await createOAuthUrl({
            applicationId: props.applicationId,
            pluginId,
            appBizId: props.applicationId,
        });
        if (oauthUrl) {
            window.open(oauthUrl, '_blank', 'noopener,noreferrer');
            // 用户完成授权后回到该页面手动点击"确认"，先乐观置为已授权
            isAuthorized.value = true;
        } else {
            MessagePlugin.error('获取授权链接失败');
        }
    } catch (e) {
        console.error('[ConnectorConnectDialog] createOAuthUrl error:', e);
        MessagePlugin.error('获取授权链接失败');
    }
}

/**
 * 提交连接：调用 BindAgentTool 接口
 * 连接器（plugin_class === 1）只传 plugin 维度，tool_list 省略
 */
async function handleConfirm() {
    if (!props.connector) return;
    if (!props.applicationId || !props.agentId) {
        MessagePlugin.warning('缺少应用 ID 或 Agent ID');
        return;
    }
    if (!validate()) return;

    // 构造 plugin 配置，写入用户填写的 header/query 值
    const baseConfig = buildPluginConfig(props.connector);
    formItems.value.forEach((item) => {
        const list = item.loc === 'header' ? baseConfig.header_parameter_list : baseConfig.query_parameter_list;
        const exist = list.find((p) => p.param_name === item.paramName);
        const value = formValues.value[item.key] || '';
        if (exist) {
            exist.param_value = value;
        } else {
            list.push({ param_name: item.paramName, param_value: value });
        }
    });

    const pluginId = (props.connector.PluginId || props.connector.plugin_id || '') as string;
    loading.value = true;
    try {
        await bindAgentTool({
            applicationId: props.applicationId,
            appId: props.applicationId,
            agentId: props.agentId,
            pluginId,
            toolSource: 0,
            // 连接器：tool_list 省略
            plugin: baseConfig,
        });
        MessagePlugin.success('已连接');
        emit('connected', props.connector);
        visible.value = false;
    } catch (e) {
        console.error('[ConnectorConnectDialog] bindAgentTool error:', e);
        MessagePlugin.error('连接失败');
    } finally {
        loading.value = false;
    }
}

function handleClose() {
    visible.value = false;
}

/** 弹窗打开时重置/初始化表单 */
watch(() => props.modelValue, (val) => {
    if (!val) return;
    formValues.value = {};
    isAuthorized.value = false;
    if (!props.connector) return;

    // 回填已存在的 param_value（已绑定连接器再次打开"重新连接"时回显）
    const headers = (
        props.connector.Headers
        || props.connector.headers
        || props.connector.HeaderParameterList
        || props.connector.header_parameter_list
        || []
    ) as Record<string, unknown>[];
    const query = (
        props.connector.Query
        || props.connector.query
        || props.connector.QueryParameterList
        || props.connector.query_parameter_list
        || []
    ) as Record<string, unknown>[];

    const fillFrom = (list: Record<string, unknown>[], loc: 'header' | 'query') => {
        list.forEach((p) => {
            const paramName = (
                p.ParamName || p.param_name
                || p.ParameterName || p.parameter_name
                || p.Name || p.name
                || ''
            ) as string;
            if (!paramName) return;
            const value = (p.ParamValue || p.param_value || '') as string;
            if (value) formValues.value[`${loc}:${paramName}`] = value;
        });
    };
    fillFrom(headers, 'header');
    fillFrom(query, 'query');

    // OAuth：若 header/query 中已有任一参数值，认为已授权（与 ConnectorDialog 中 connected 判断一致）
    if (Number(props.connector.AuthType || props.connector.auth_type || 0) === 3) {
        isAuthorized.value = [...headers, ...query].some((p) => !!(p.ParamValue || p.param_value));
    }
});
</script>

<style scoped>
.connector-connect { display: flex; flex-direction: column; gap: 16px; padding: 4px 0; }
.connector-connect__auth { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; border-radius: 6px; background: var(--td-bg-color-secondarycontainer); }
.connector-connect__auth-label { font-size: 13px; font-weight: 500; color: var(--td-text-color-primary); }
.connector-connect__auth-row { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.connector-connect__auth-dot { width: 6px; height: 6px; border-radius: 50%; }
.connector-connect__auth-dot.is-success { background: var(--td-success-color, #00a870); }
.connector-connect__auth-dot.is-warning { background: var(--td-warning-color, #ed7b2f); }
.connector-connect__auth-status { color: var(--td-text-color-secondary); }
.connector-connect__auth-link { color: var(--td-brand-color); cursor: pointer; }
.connector-connect__auth-link:hover { opacity: 0.8; }
.connector-connect__auth-tip { font-size: 12px; color: var(--td-text-color-placeholder); }

.connector-connect__form { display: flex; flex-direction: column; gap: 12px; }
.connector-connect__item { display: flex; flex-direction: column; gap: 6px; }
.connector-connect__label { font-size: 13px; color: var(--td-text-color-primary); display: flex; align-items: center; gap: 6px; }
.connector-connect__loc-tag { display: inline-block; padding: 0 6px; font-size: 11px; line-height: 18px; color: var(--td-text-color-secondary); background: var(--td-bg-color-secondarycontainer); border-radius: 3px; }
.connector-connect__required { color: var(--td-error-color, #d54941); }

.connector-connect__empty { padding: 12px; font-size: 13px; color: var(--td-text-color-placeholder); text-align: center; }
</style>
