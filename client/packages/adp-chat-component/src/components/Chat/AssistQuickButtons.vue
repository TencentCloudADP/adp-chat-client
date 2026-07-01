<script setup lang="ts">
/**
 * AssistQuickButtons - 快捷按钮组件
 * 完全参照 webim assist-quick-buttons 的交互和样式实现：
 *   一级菜单：水平滚动展示提示分组列表（图标 + 名称）
 *   二级菜单：水平滚动卡片展示选中分组下的建议项，点击后自动填充到输入框
 */
import { ref, onMounted } from 'vue';
import { httpService } from '../../service/httpService';

/** 建议项 */
export interface SuggestionItem {
  SuggestionId: string;
  Title: string;
  PromptContent: string;
}

/** 建议分组 */
export interface SuggestionGroup {
  GroupId: string;
  IconUrl: string;
  Name: string;
  SuggestionList: SuggestionItem[];
}

export interface SuggestionResponse {
  Response: {
    GroupList: SuggestionGroup[];
  };
}

export interface AssistQuickButtonsProps {
  suggestionApi?: string;
}

const props = withDefaults(defineProps<AssistQuickButtonsProps>(), {
  suggestionApi: '/suggestions',
});

const emit = defineEmits<{
  (e: 'selectSuggestion', promptContent: string): void;
}>();

const groupList = ref<SuggestionGroup[]>([]);
const activeGroup = ref<SuggestionGroup | null>(null);
const loading = ref(false);
const iconErrors = ref(new Set<string>());

const fetchSuggestions = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const response: SuggestionResponse = await httpService.get(props.suggestionApi);
    groupList.value = response?.Response?.GroupList || [];
  } catch (error) {
    console.error('获取快捷按钮列表失败:', error);
    groupList.value = [];
  } finally {
    loading.value = false;
  }
};

const enterGroup = (group: SuggestionGroup) => {
  activeGroup.value = group;
};

const backToGroups = () => {
  activeGroup.value = null;
};

const selectSuggestion = (item: SuggestionItem) => {
  emit('selectSuggestion', item.PromptContent);
  activeGroup.value = null;
};

const onIconError = (groupId: string) => {
  iconErrors.value.add(groupId);
};

onMounted(() => {
  fetchSuggestions();
});
</script>

<template>
  <div v-if="!loading && groupList.length > 0" class="assist-quick-buttons">
    <!-- ====== 二级菜单：建议卡片（水平滚动） ====== -->
    <template v-if="activeGroup">
      <div class="assist-quick-buttons__secondary">
        <div class="assist-quick-buttons__header" @click="backToGroups">
          <svg class="assist-quick-buttons__back-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 3L5 7L9 11" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>{{ activeGroup.Name }}</span>
        </div>
        <div class="assist-quick-buttons__suggestions">
          <div
            v-for="suggestion in activeGroup.SuggestionList"
            :key="suggestion.SuggestionId"
            class="assist-quick-buttons__suggestion-item"
            @click="selectSuggestion(suggestion)"
          >
            <svg class="assist-quick-buttons__suggestion-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 2L8 6L4 10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="assist-quick-buttons__suggestion-title">{{ suggestion.Title }}</div>
            <div class="assist-quick-buttons__suggestion-desc">{{ suggestion.PromptContent }}</div>
          </div>
        </div>
      </div>
    </template>

    <!-- ====== 一级菜单：分组列表（水平滚动） ====== -->
    <template v-else>
      <div
        v-for="group in groupList"
        :key="group.GroupId"
        class="assist-quick-buttons__item"
        @click="enterGroup(group)"
      >
        <img
          v-if="group.IconUrl && !iconErrors.has(group.GroupId)"
          :src="group.IconUrl"
          :alt="group.Name"
          width="16"
          height="16"
          @error="onIconError(group.GroupId)"
        />
        <span>{{ group.Name }}</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* ── 完全对齐 webim assist-quick-buttons 样式 ── */

.assist-quick-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: none;
  /* 与 sender-container 保持相同宽度，确保左边缘对齐 */
  width: 100%;
  max-width: 800px;
  box-sizing: border-box;
}

.assist-quick-buttons::-webkit-scrollbar {
  display: none;
}

/* ── 一级：分组按钮 ── */
.assist-quick-buttons__item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #F4F5F7;
  border-radius: 6px;
  font-size: 13px;
  color: var(--td-text-color-primary, rgba(0, 0, 0, 0.9));
  cursor: pointer;
  transition: background .2s, box-shadow .2s;
  white-space: nowrap;
  user-select: none;
}

.assist-quick-buttons__item:hover {
  background: #ECEEF1;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .06);
}

/* ── 二级：容器 ── */
.assist-quick-buttons__secondary {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

/* ── 二级：返回头部 ── */
.assist-quick-buttons__header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  height: 20px;
  cursor: pointer;
  color: var(--td-text-color-primary, rgba(0, 0, 0, 0.9));
  user-select: none;
}

.assist-quick-buttons__back-icon {
  flex-shrink: 0;
}

/* ── 二级：建议卡片行（水平滚动，与 webim 一致） ── */
.assist-quick-buttons__suggestions {
  display: flex;
  gap: 12px;
  flex: 1;
  min-width: 0;
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: none;
}

.assist-quick-buttons__suggestions::-webkit-scrollbar {
  display: none;
}

/* ── 二级：建议卡片 ── */
.assist-quick-buttons__suggestion-item {
  position: relative;
  flex: 1;
  min-width: 200px;
  box-sizing: border-box;
  padding: 16px 12px;
  gap: 4px;
  height: 88px;
  border-radius: 6px;
  background: #F4F5F7;
  cursor: pointer;
  transition: background .2s;
  overflow: hidden;
  user-select: none;
}

.assist-quick-buttons__suggestion-item:hover {
  background: #ECEEF1;
}

/* ── 二级：建议卡片右上角箭头 (↗) ── */
.assist-quick-buttons__suggestion-arrow {
  position: absolute;
  right: 12px;
  top: 10px;
  color: rgba(1, 10, 40, .65);
  rotate: 45deg;
}

/* ── 二级：建议卡片标题 ── */
.assist-quick-buttons__suggestion-title {
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
  color: rgba(0, 1, 11, .93);
  margin-bottom: 4px;
}

/* ── 二级：建议卡片描述（最多两行省略） ── */
.assist-quick-buttons__suggestion-desc {
  font-size: 12px;
  line-height: 17px;
  color: rgba(1, 10, 40, .65);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
