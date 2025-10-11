<script setup lang="ts">
/**
 * 智能体选择组件
 * 功能：提供智能体选择下拉框，并展示当前智能体的欢迎语和推荐问题
 */
import { computed, ref } from 'vue';
import { useAppsStore } from '@/stores/apps';

// 组件Props定义
const {  getDefaultQuestion } = defineProps({
  /**
   * 获取默认问题的回调函数
   * @type {Function}
   */
  getDefaultQuestion: {
    type: Function,
    required: false,
  }
})

const appsStore = useAppsStore();

// 用户选择的推荐问题
const checkQuestion = ref('');


/**
 * 选择推荐问题
 * @param {string} value - 推荐问题的内容
 */
const handleChooseQuestion = (value: string) => {
  if (value == checkQuestion.value) {
    checkQuestion.value = "";
    getDefaultQuestion && getDefaultQuestion("")
  } else {
    checkQuestion.value = value;
    getDefaultQuestion && getDefaultQuestion(value)
  }
}
</script>

<template>
  <flex class="greeting-panel">
    <t-avatar class="greet-avatar" size="64px" shape="round" :image="appsStore.currentApplicationAvatar"></t-avatar>
    <span v-if="appsStore.currentApplicationName" class="greet-name">{{ appsStore.currentApplicationName}}</span>
    <div class="greet-desc" v-if="appsStore.currentApplicationGreeting">
        {{ appsStore.currentApplicationGreeting }}
    </div>
    <t-space gap="8" class="recommend-question-container" v-if="appsStore.currentApplicationOpeningQuestions && appsStore.currentApplicationOpeningQuestions.length > 0">
        <t-check-tag  class="greet-tag" v-for="question in appsStore.currentApplicationOpeningQuestions" variant="outline"
          @click="handleChooseQuestion(question)">{{ question }}</t-check-tag>
      </t-space>
  </flex>
</template>

<style scoped>
/* app展示内容详情 */
.app-detail-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.greet-name{
  color: var(--td-text-color-primary);
  font-size: var(--td-font-size-title-large);
  font-weight: 500;
  margin-top:16px;
}

.greeting-panel {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.greet-avatar{
  border-radius: var(--td-radius-large);
}

.greet-desc {
  color: var(--td-text-color-secondary);
  background-color: var(--td-bg-color-page);
  font-size: var(--td-font-size-title-small);
  word-break: break-all;
  margin-top: var(--td-size-8);
  padding:10px 12px;
  border-radius: 6px;
}
.greet-tag {
  box-shadow: var(--td-shadow-2);
  padding:8px 12px;
  color:var(--td-brand-color);
  font-weight:500;
}
.recommend-question-container {
  margin-top: var(--td-size-6)
}

</style>
