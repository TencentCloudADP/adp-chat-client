<template>
    <t-dialog
        v-model:visible="visible"
        :header="i18n.manageSkills"
        :footer="false"
        width="700px"
        :close-on-overlay-click="true"
        @close="onClose"
    >
        <div class="skills-manage">
            <!-- 操作栏：添加 + 导入 + 搜索 -->
            <div class="skills-manage__action-bar">
                <t-button theme="primary"  @click="handleAdd">
                    <template #icon><t-icon name="add" /></template>
                    {{ i18n.addSkillsBtn }}
                </t-button>
                <label v-if="enableImport" class="skills-manage__import-btn">
                    <t-button  :loading="importing" @click.stop>
                        <template #icon><t-icon name="upload" /></template>
                        导入
                    </t-button>
                    <input
                        ref="importFileInput"
                        type="file"
                        accept=".zip"
                        style="display: none;"
                        @change="onImportFileChange"
                    />
                </label>
                <t-input
                    v-model="searchKeyword"
                    placeholder="搜索 Skills"
                    
                    clearable
                    class="skills-manage__search"
                >
                    <template #prefix-icon><t-icon name="search" /></template>
                </t-input>
            </div>

            <!-- 加载中 -->
            <div v-if="loading" class="skills-manage__loading">
                <t-loading  />
            </div>

            <!-- 空状态 -->
            <div v-else-if="filteredList.length === 0" class="skills-manage__empty">
                <span v-if="searchKeyword">暂无匹配的 Skills</span>
                <span v-else>{{ i18n.noSkills }}</span>
            </div>

            <!-- Skill 列表 -->
            <div v-else class="skills-manage__list">
                <div
                    v-for="item in filteredList"
                    :key="item.id"
                    class="skills-manage__item"
                >
                    <div class="skills-manage__item-icon">
                        <img
                            v-if="item.icon"
                            :src="item.icon"
                            @error="onIconError($event)"
                        />
                        <span v-else class="skills-manage__item-icon-fb">
                            <t-icon name="lightbulb" />
                        </span>
                    </div>
                    <div class="skills-manage__item-info">
                        <div class="skills-manage__item-title">
                            <span class="skills-manage__item-name" :title="item.name">{{ item.name }}</span>
                            <t-tag v-if="isPreset(item)"  variant="light">预置</t-tag>
                            <t-tag v-if="item.version"  variant="outline">{{ item.version }}</t-tag>
                        </div>
                        <div v-if="item.desc" class="skills-manage__item-desc" :title="item.desc">{{ item.desc }}</div>
                    </div>
                    <div class="skills-manage__item-actions">
                        <t-tooltip v-if="isPreset(item)" content="预置 Skill 无法删除" placement="top">
                            <t-button  variant="text" theme="default" disabled>
                                <template #icon><t-icon name="delete" /></template>
                            </t-button>
                        </t-tooltip>
                        <t-button
                            v-else
                            variant="text"
                            theme="danger"
                            
                            :disabled="deletingId === item.id"
                            :loading="deletingId === item.id"
                            @click="handleDelete(item)"
                        >
                            <template #icon><t-icon name="delete" /></template>
                            移除
                        </t-button>
                    </div>
                </div>
            </div>
        </div>
    </t-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    Dialog as TDialog, Button as TButton, Tag as TTag, Loading as TLoading,
    Input as TInput, Icon as TIcon, Tooltip as TTooltip,
} from 'tdesign-vue-next';
import type { ManageSkillItem, SkillsI18n } from '../../model/skills';
import { AgentSkillType, defaultSkillsI18n, defaultSkillsI18nEn } from '../../model/skills';

interface Props {
    modelValue: boolean;
    manageList?: ManageSkillItem[];
    loading?: boolean;
    i18n?: Partial<SkillsI18n>;
    language?: string;
    enableImport?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    manageList: () => [],
    loading: false,
    i18n: () => ({}),
    language: 'zh-CN',
    enableImport: false,
});

const emit = defineEmits<{
    (e: 'update:modelValue', val: boolean): void;
    (e: 'delete', item: ManageSkillItem): void;
    (e: 'add'): void;
    (e: 'close'): void;
    (e: 'import-skill', file: File, finishCb: () => void): void;
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
const searchKeyword = ref('');
const importing = ref(false);
const importFileInput = ref<HTMLInputElement | null>(null);

const filteredList = computed(() => {
    const kw = searchKeyword.value.trim().toLowerCase();
    if (!kw) return props.manageList;
    return props.manageList.filter(item =>
        (item.name || '').toLowerCase().includes(kw) ||
        (item.desc || '').toLowerCase().includes(kw)
    );
});

function isPreset(item: ManageSkillItem): boolean {
    return item.skillType === AgentSkillType.HUB_PRESET;
}

function handleDelete(item: ManageSkillItem) {
    deletingId.value = item.id;
    emit('delete', item);
    setTimeout(() => { deletingId.value = ''; }, 500);
}

function handleAdd() {
    emit('add');
}

function onClose() {
    searchKeyword.value = '';
    emit('close');
}

function onIconError(e: Event) {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
}

function onImportFileChange(e: Event) {
    const file = (e.target as HTMLInputElement)?.files?.[0];
    if (!file) return;
    if (!/\.zip$/i.test(file.name)) return;
    importing.value = true;
    emit('import-skill', file, () => {
        importing.value = false;
        if (importFileInput.value) importFileInput.value.value = '';
    });
}

function resetDeleting() {
    deletingId.value = '';
}

defineExpose({ resetDeleting });
</script>

<style scoped>
.skills-manage { display: flex; flex-direction: column; gap: 12px; height: 480px; overflow: hidden; }
.skills-manage__action-bar { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.skills-manage__import-btn { display: inline-flex; cursor: pointer; }
.skills-manage__search { width: 200px; margin-left: auto; }
.skills-manage__loading { display: flex; align-items: center; justify-content: center; flex: 1; }
.skills-manage__empty { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; color: var(--td-text-color-placeholder); font-size: 13px; gap: 8px; }
.skills-manage__list { flex: 1; overflow-y: auto; min-height: 0; display: flex; flex-direction: column; padding-right: 10px; }
.skills-manage__list::-webkit-scrollbar { width: 4px; }
.skills-manage__list::-webkit-scrollbar-thumb { border-radius: 2px; background: rgba(17, 32, 70, 0.13); }

.skills-manage__item { display: flex; align-items: center; gap: 16px; padding: 14px 0; border-bottom: 1px solid rgba(0, 44, 85, 0.08); transition: background 0.15s; }
.skills-manage__item:last-child { border-bottom: none; }
.skills-manage__item:hover { background: var(--td-bg-color-container-hover); }
.skills-manage__item-icon { flex-shrink: 0; width: 40px; }
.skills-manage__item-icon img { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(0, 44, 85, 0.08); box-sizing: border-box; }
.skills-manage__item-icon-fb { width: 40px; height: 40px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; background: var(--td-bg-color-secondarycontainer); color: var(--td-text-color-placeholder); border: 1px solid rgba(0, 44, 85, 0.08); box-sizing: border-box; }
.skills-manage__item-info { flex: 1; min-width: 0; overflow: hidden; }
.skills-manage__item-title { display: flex; align-items: center; gap: 6px; flex-wrap: nowrap; overflow: hidden; }
.skills-manage__item-name { font-size: 15px; font-weight: 500; color: var(--td-text-color-primary); line-height: 24px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 400px; }
.skills-manage__item-desc { font-size: 13px; color: var(--td-text-color-placeholder); line-height: 20px; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.skills-manage__item-actions { flex-shrink: 0; display: flex; align-items: center; gap: 4px; }
</style>
