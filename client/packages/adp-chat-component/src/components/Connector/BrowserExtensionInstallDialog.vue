<!-- ADP 浏览器助手扩展安装引导弹窗（Vue 3 + tdesign-vue-next）-->
<template>
    <t-dialog
        v-model:visible="visible"
        header=" "
        :confirm-btn="confirmBtn"
        cancel-btn="取消"
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
                <div class="browser-extension-install-dialog__header-title">阅读并同意该协议</div>
            </div>

            <div class="browser-extension-install-dialog__intro">
                <p>使用本功能需要两个组件协同工作：</p>
                <ul>
                    <li>
                        <strong>浏览器助手 Connector</strong>
                        <span>（安装在 ADP 平台侧）：负责接收您在智能工作台或 Claw 应用中发出的指令，并将指令传递给扩展程序；</span>
                    </li>
                    <li>
                        <strong>ADP 浏览器助手扩展程序</strong>
                        <span>（安装在您的 Chrome 浏览器中）：负责在浏览器中实际执行网页自动化操作。</span>
                    </li>
                </ul>
                <p>
                    您需要<a class="browser-extension-install-dialog__link" @click.stop="onGotoStore">前往 Chrome 浏览器</a>安装 ADP 浏览器助手扩展程序。
                </p>
                <p>
                    您充分知悉，扩展程序执行操作过程中可能涉及对您当前浏览网页内容的读取、页面元素的点击与填写、标签页的创建与管理等操作，部分操作一旦执行可能不可撤销。请在使用前确认您已充分了解相关服务内容和存在的风险情况。
                </p>
                <p>
                    同时，您在使用 ADP 浏览器助手扩展程序时，还需遵守 Google Chrome 应用商店的相关服务条款及扩展程序使用规范。
                </p>
            </div>

            <t-checkbox v-model="agreed" class="browser-extension-install-dialog__agree">
                <span class="browser-extension-install-dialog__agree-text">
                    我已阅读并同意<a
                        class="browser-extension-install-dialog__link"
                        @click.stop.prevent="onProtocol"
                    >《ADP 浏览器助手插件服务协议》</a>，我充分知悉并自愿承担使用该插件的全部责任和相关风险，同意遵守协议约定。
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
import { getChromeStoreUrl } from '../../utils/adp-browser-extension';

interface Props extends ThemeProps {
    /** 弹窗显隐（v-model:modelValue 双向绑定） */
    modelValue: boolean;
    /** 协议跳转地址 */
    protocolUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    modelValue: false,
    protocolUrl: 'https://cloud.tencent.com/document/product/1759/132714',
});

const emit = defineEmits<{
    (e: 'update:modelValue', val: boolean): void;
    (e: 'confirm'): void;
    (e: 'cancel'): void;
    (e: 'protocol-click'): void;
}>();

/** 是否已勾选同意协议 */
const agreed = ref(false);

/** 弹窗显隐双向绑定 */
const visible = computed<boolean>({
    get: () => props.modelValue,
    set: (val: boolean) => emit('update:modelValue', val),
});

/** 确认按钮配置：随勾选状态切换 disabled */
const confirmBtn = computed(() => ({
    content: '确认并前往 Chrome 应用商店',
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
    padding: 0 4px 4px;
    text-align: left;
}

.browser-extension-install-dialog__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;
}

.browser-extension-install-dialog__header-icon {
    color: var(--td-brand-color, #4a70ff);
    margin-bottom: 8px;
}

.browser-extension-install-dialog__header-title {
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
    color: var(--td-text-color-primary);
    text-align: center;
}

.browser-extension-install-dialog__intro {
    padding: 12px;
    background: var(--td-bg-color-component, #f7f8fa);
    border-radius: var(--td-radius-default, 4px);
    font-size: 12px;
    line-height: 18px;
    color: var(--td-text-color-secondary);
}

.browser-extension-install-dialog__intro p {
    margin: 0 0 8px;
}

.browser-extension-install-dialog__intro p:last-child {
    margin-bottom: 0;
}

.browser-extension-install-dialog__intro ul {
    margin: 0 0 8px;
    padding-left: 0;
    list-style: none;
}

.browser-extension-install-dialog__intro li {
    position: relative;
    padding-left: 12px;
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
    margin-top: 16px;
    font-size: 12px;
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
