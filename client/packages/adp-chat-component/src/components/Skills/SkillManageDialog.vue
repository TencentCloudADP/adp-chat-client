<template>
    <t-dialog
        v-model:visible="visible"
        :header="i18n.manageSkills"
        :footer="false"
        width="800px"
        :close-on-overlay-click="true"
        @close="onClose"
    >
        <div class="skills-manage">
            <!-- 空状态 -->
            <div v-if="!loading && manageList.length === 0" class="skills-manage__empty">
                <span>{{ i18n.noSkills }}</span>
            </div>

            <!-- 加载中 -->
            <t-loading v-if="loading" size="small" class="skills-manage__loading" />

            <!-- Skill 列表 -->
            <template v-else>
                <div class="skills-manage__list">
                    <div
                        v-for="item in manageList"
                        :key="item.id"
                        class="skills-manage__item"
                        :class="{ 'is-preset': isPreset(item) }"
                    >
                        <div class="skills-manage__item-info">
                            <img
                                v-if="item.icon"
                                :src="item.icon"
                                class="skills-manage__item-icon"
                                @error="onIconError($event)"
                            />
                            <span v-else class="skills-manage__item-icon-fallback">
                                <CustomizedIcon remote name="basic_bulb_line" size="m" :show-hover-bg="false" />
                            </span>
                            <div class="skills-manage__item-text">
                                <span class="skills-manage__item-name">{{ item.name }}</span>
                                <span v-if="item.desc" class="skills-manage__item-desc">{{ item.desc }}</span>
                            </div>
                        </div>
                        <div class="skills-manage__item-actions">
                            <t-tag v-if="isPreset(item)" theme="default" variant="light" size="small">
                                内置
                            </t-tag>
                            <t-button
                                v-else
                                variant="text"
                                theme="danger"
                                size="small"
                                :disabled="deletingId === item.id"
                                :loading="deletingId === item.id"
                                @click="handleDelete(item)"
                            >
                                移除
                            </t-button>
                        </div>
                    </div>
                </div>
            </template>

            <!-- 底部操作 -->
            <div class="skills-manage__footer">
                <t-button variant="outline" theme="primary" size="small" @click="handleAdd">
                    {{ i18n.addSkills }}
                </t-button>
            </div>
        </div>
    </t-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    Dialog as TDialog,
    Button as TButton,
    Tag as TTag,
    Loading as TLoading,
} from 'tdesign-vue-next';
import CustomizedIcon from '../CustomizedIcon.vue';
import type { ManageSkillItem, SkillsI18n } from '../../model/skills';
import { AgentSkillType, defaultSkillsI18n, defaultSkillsI18nEn } from '../../model/skills';

interface Props {
    modelValue: boolean;
    /** 管理列表 */
    manageList?: ManageSkillItem[];
    /** 是否加载中 */
    loading?: boolean;
    /** 国际化文本 */
    i18n?: Partial<SkillsI18n>;
    /** 语言 */
    language?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    manageList: () => [],
    loading: false,
    i18n: () => ({}),
    language: 'zh-CN',
});

const emit = defineEmits<{
    (e: 'update:modelValue', val: boolean): void;
    (e: 'delete', item: ManageSkillItem): void;
    (e: 'add'): void;
    (e: 'close'): void;
}>();

const i18n = computed<Required<SkillsI18n>>(() => {
    const defaults = props.language?.startsWith('en') ? defaultSkillsI18nEn : defaultSkillsI18n;
    return { ...defaults, ...props.i18n };
});

const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});

const deletingId = ref('');

function isPreset(item: ManageSkillItem): boolean {
    return item.skillType === AgentSkillType.HUB_PRESET;
}

function handleDelete(item: ManageSkillItem) {
    deletingId.value = item.id;
    // emit 让父组件处理实际删除逻辑
    emit('delete', item);
    // 父组件处理完成后应重置 deletingId
    setTimeout(() => { deletingId.value = ''; }, 500);
}

function handleAdd() {
    emit('add');
}

function onClose() {
    emit('close');
}

function onIconError(e: Event) {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
        const fallback = parent.querySelector('.skills-manage__item-icon-fallback') as HTMLElement;
        if (fallback) fallback.style.display = 'inline-flex';
    }
}

/** 外部重置 deletingId */
function resetDeleting() {
    deletingId.value = '';
}

defineExpose({ resetDeleting });
</script>

<style scoped>
.skills-manage {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 120px;
}
.skills-manage__empty {
    text-align: center;
    padding: 48px 0;
    color: var(--td-text-color-placeholder);
    font-size: 14px;
}
.skills-manage__loading {
    display: flex;
    justify-content: center;
    padding: 48px 0;
}
.skills-manage__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 320px;
    overflow-y: auto;
}
.skills-manage__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border: 1px solid var(--td-component-border);
    border-radius: 8px;
    transition: background 0.15s;
}
.skills-manage__item:hover {
    background: var(--td-bg-color-container-hover);
}
.skills-manage__item.is-preset {
    background: var(--td-bg-color-secondarycontainer);
}
.skills-manage__item-info {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;
}
.skills-manage__item-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
}
.skills-manage__item-icon-fallback {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--td-text-color-secondary);
    background: var(--td-bg-color-secondarycontainer);
}
.skills-manage__item-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}
.skills-manage__item-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--td-text-color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.skills-manage__item-desc {
    font-size: 12px;
    color: var(--td-text-color-placeholder);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.skills-manage__item-actions {
    flex-shrink: 0;
    margin-left: 12px;
}
.skills-manage__footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 8px;
    border-top: 1px solid var(--td-component-border);
}
</style>
