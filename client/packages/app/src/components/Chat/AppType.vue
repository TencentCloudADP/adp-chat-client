<script setup lang="ts">
/**
 * 智能体选择组件
 * 功能：提供智能体选择下拉框，并展示当前智能体的欢迎语和推荐问题
 */
import { ref } from 'vue';
import { useAppsStore } from '@/stores/apps';
import { useUiStore } from '@/stores/ui'
import CustomizedIcon from '@/components/CustomizedIcon.vue';
import StarIcon from '@/assets/icons/star.svg';
const uiStore = useUiStore()

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
    <t-avatar 
    hideOnLoadFailed 
    v-if="appsStore.currentApplicationAvatar && !uiStore.isMobile" 
    class="greet-avatar" 
    size="64px" 
    shape="round" 
    :image="appsStore.currentApplicationAvatar"
    :imageProps="{
      lazy: true,
      loading: ''
    }"
    ></t-avatar>
    <span v-if="appsStore.currentApplicationName  && !uiStore.isMobile" class="greet-name">{{ appsStore.currentApplicationName}}</span>
    <div class="greet-desc" v-if="appsStore.currentApplicationGreeting">
        {{ appsStore.currentApplicationGreeting }}
    </div>
    <t-space :direction="uiStore.isMobile ? 'vertical' : 'horizontal'" gap="8" class="recommend-question-container" v-if="appsStore.currentApplicationOpeningQuestions && appsStore.currentApplicationOpeningQuestions.length > 0">
        <t-check-tag theme="default" class="greet-tag" v-for="question in appsStore.currentApplicationOpeningQuestions" variant="outline"
          @click="handleChooseQuestion(question)">
          <span class="greet-tag-text">
            <CustomizedIcon v-if="uiStore.isMobile" nativeIcon disablePadding class="star-icon" :svg="StarIcon" />
            {{ question }}
          </span>
          
        </t-check-tag>
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
.isMobile .greeting-panel{
  justify-content: flex-start;
  align-items: flex-start;
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
.isMobile .greet-desc{
  background-color: transparent;
  padding:0;
  margin-top: var(--td-comp-margin-m);
  color: var(--td-text-color-primary)
}
.greet-desc {
  color: var(--td-text-color-secondary);
  background-color: var(--td-bg-color-container-hover) ;
  font-size: var(--td-font-size-title-small);
  word-break: break-all;
  margin-top: var(--td-size-8);
  padding:var(--td-pop-padding-l) var(--td-pop-padding-xl);
  border-radius: var(--td-radius-medium);
}
.isMobile .greet-tag{
  color: var(--td-text-color-primary);
  padding:var(--td-pop-padding-xl) var(--td-pop-padding-xxl);
  font-size: var(--td-font-size-title-small);
  font-weight: 400;
}
.greet-tag {
  padding:var(--td-pop-padding-l) var(--td-pop-padding-xl);
  color:var(--td-brand-color);
  height: var(--td-comp-size-m);
  font-weight:500;
  font-size: var(--td-font-size-link-small);
  border-radius: var(--td-radius-medium);
  box-shadow: 0px 0px 1px rgba(18, 19, 25, 0.08), 0px 0px 6px rgba(18, 19, 25, 0.02), 0px 2px 12px rgba(18, 19, 25, 0.04);
}
.greet-tag-text{
  display: flex;
  align-items: center;
}
.greet-tag-text .star-icon{
  margin-right: var(--td-comp-margin-xs);
}
.recommend-question-container {
  margin-top: var(--td-size-6)
}

</style>


