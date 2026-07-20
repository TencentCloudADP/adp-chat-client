<!-- ADP 浏览器助手扩展安装引导弹窗（Vue 3 + tdesign-vue-next）-->
<template>
    <t-dialog
        v-model:visible="visible"
        header=" "
        :confirm-btn="confirmBtn"
        :cancel-btn="mergedI18n.extensionCancelBtn"
        :close-on-overlay-click="false"
        :close-on-esc-to-close="true"
        width="500"
        class="browser-extension-install-dialog"
        @confirm="onConfirm"
        @cancel="onClose"
        @close="onClose"
    >
        <div class="browser-extension-install-dialog__body">
            <div class="browser-extension-install-dialog__header">                
                <div class="browser-extension-install-dialog__header-title">{{ mergedI18n.extensionAgreeTitle }}</div>
            </div>

            <div class="browser-extension-install-dialog__intro">
                <p>{{ mergedI18n.extensionIntroLead }}</p>
                <ul>
                    <li>
                        <strong>{{ mergedI18n.extensionConnectorName }}</strong>
                        <span>{{ mergedI18n.extensionConnectorDesc }}</span>
                    </li>
                    <li>
                        <strong>{{ mergedI18n.extensionPluginName }}</strong>
                        <span>{{ mergedI18n.extensionPluginDesc }}</span>
                    </li>
                </ul>
                <!-- {link} 占位符替换为可点击链接 -->
                <p>
                    <template v-for="(seg, idx) in installPromptSegments" :key="idx">
                        <a v-if="seg.isLink" class="browser-extension-install-dialog__link" @click.stop="onGotoStore">{{ seg.text }}</a>
                        <template v-else>{{ seg.text }}</template>
                    </template>
                </p>
                <p>{{ mergedI18n.extensionRiskTip }}</p>
                <p>{{ mergedI18n.extensionPolicyTip }}</p>
            </div>

            <t-checkbox v-model="agreed" class="browser-extension-install-dialog__agree">
                <span class="browser-extension-install-dialog__agree-text">
                    <!-- {policy} 占位符替换为可点击协议链接 -->
                    <template v-for="(seg, idx) in agreeSegments" :key="idx">
                        <a v-if="seg.isLink" class="browser-extension-install-dialog__link" @click.stop.prevent="onProtocol">{{ seg.text }}</a>
                        <template v-else>{{ seg.text }}</template>
                    </template>
                </span>
            </t-checkbox>
        </div>
    </t-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
    Dialog as TDialog,
    Checkbox as TCheckbox,
} from 'tdesign-vue-next';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
import type { SkillsI18n } from '../../model/skills';
import { defaultSkillsI18n, defaultSkillsI18nEn } from '../../model/skills';
import { getChromeStoreUrl } from '../../utils/adp-browser-extension';

interface Props extends ThemeProps {
    /** 弹窗显隐（v-model:modelValue 双向绑定） */
    modelValue: boolean;
    /** 协议跳转地址 */
    protocolUrl?: string;
    /** 国际化文本 */
    i18n?: Partial<SkillsI18n>;
    /** 语言：'en-*' 走英文 */
    language?: string;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    modelValue: false,
    protocolUrl: 'https://cloud.tencent.com/document/product/1759/132714',
    i18n: () => ({}),
    language: '',
});

const emit = defineEmits<{
    (e: 'update:modelValue', val: boolean): void;
    (e: 'confirm'): void;
    (e: 'cancel'): void;
    (e: 'protocol-click'): void;
}>();

const mergedI18n = computed<Required<SkillsI18n>>(() => {
    const defaults = props.language?.startsWith('en') ? defaultSkillsI18nEn : defaultSkillsI18n;
    return { ...defaults, ...props.i18n };
});

/**
 * 将带 `{token}` 占位符的整句切成 [文本, 链接, 文本] 三段，便于模板渲染。
 * 找不到占位符时退回到整段非链接文本。
 */
function splitWithLink(template: string, token: string, linkText: string) {
    const idx = template.indexOf(token);
    if (idx < 0) return [{ text: template, isLink: false }];
    return [
        { text: template.slice(0, idx), isLink: false },
        { text: linkText, isLink: true },
        { text: template.slice(idx + token.length), isLink: false },
    ];
}

const installPromptSegments = computed(() => splitWithLink(
    mergedI18n.value.extensionInstallPromptHtml,
    '{link}',
    mergedI18n.value.extensionGotoStoreLink,
));

const agreeSegments = computed(() => splitWithLink(
    mergedI18n.value.extensionAgreeText,
    '{policy}',
    mergedI18n.value.extensionPolicyName,
));

/** 是否已勾选同意协议 */
const agreed = ref(false);

/** 弹窗显隐双向绑定 */
const visible = computed<boolean>({
    get: () => props.modelValue,
    set: (val: boolean) => emit('update:modelValue', val),
});

/** 确认按钮配置：随勾选状态切换 disabled */
const confirmBtn = computed(() => ({
    content: mergedI18n.value.extensionConfirmBtn,
    theme: 'primary' as const,
    disabled: !agreed.value,
}));

/** 弹窗每次重新打开时重置勾选状态 */
watch(
    () => props.modelValue,
    (val) => {
        if (val) agreed.value = false;
    },
);

/** 打开 Chrome 应用商店 */
function openStore() {
    const url = getChromeStoreUrl();
    if (url) {
        window.open(url, '_blank', 'noopener');
    }
}

/** 顶部内联"前往 Chrome 浏览器"链接 */
function onGotoStore() {
    openStore();
}

/** 协议链接 */
function onProtocol() {
    if (props.protocolUrl) {
        window.open(props.protocolUrl, '_blank', 'noopener');
    }
    emit('protocol-click');
}

/** 用户点击"确认并前往 Chrome 应用商店" */
function onConfirm() {
    if (!agreed.value) return;
    openStore();
    emit('confirm');
    visible.value = false;
}

/** 用户点击"取消"或关闭弹窗 */
function onClose() {
    visible.value = false;
    emit('cancel');
}
</script>

<style scoped>
.browser-extension-install-dialog__body {
    padding: 0 var(--td-size-2) var(--td-size-2);
    text-align: left;
}

.browser-extension-install-dialog__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: var(--td-size-6);
}

.browser-extension-install-dialog__header-icon {
    color: var(--td-brand-color, #4a70ff);
    margin-bottom: var(--td-size-4);
}

.browser-extension-install-dialog__header-title {
    font-size: var(--td-font-size-body-large);
    line-height: var(--td-line-height-body-large);
    font-weight: 500;
    color: var(--td-text-color-primary);
    text-align: center;
}

.browser-extension-install-dialog__intro {
    padding: var(--td-size-5);
    background: var(--td-bg-color-component, #f7f8fa);
    border-radius: var(--td-radius-default, 4px);
    font-size: var(--td-font-size-body-small);
    line-height: 18px;
    color: var(--td-text-color-secondary);
}

.browser-extension-install-dialog__intro p {
    margin: 0 0 var(--td-size-4);
}

.browser-extension-install-dialog__intro p:last-child {
    margin-bottom: 0;
}

.browser-extension-install-dialog__intro ul {
    margin: 0 0 var(--td-size-4);
    padding-left: 0;
    list-style: none;
}

.browser-extension-install-dialog__intro li {
    position: relative;
    padding-left: var(--td-size-5);
    margin-bottom: 4px;
}

.browser-extension-install-dialog__intro li::before {
    content: '•';
    position: absolute;
    left: 0;
    top: 0;
    color: var(--td-text-color-secondary);
}

.browser-extension-install-dialog__intro li strong {
    color: var(--td-text-color-primary);
    font-weight: 600;
}

.browser-extension-install-dialog__agree {
    display: flex;
    align-items: flex-start;
    margin-top: var(--td-size-6);
    font-size: var(--td-font-size-body-small);
    line-height: 18px;
    color: var(--td-text-color-primary);
}

.browser-extension-install-dialog__agree-text {
    flex: 1;
    white-space: normal;
    word-break: break-word;
}

.browser-extension-install-dialog__link {
    color: var(--td-brand-color, #0052d9);
    cursor: pointer;
    text-decoration: none;
}

.browser-extension-install-dialog__link:hover {
    opacity: 0.85;
}
</style>
