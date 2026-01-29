<script setup lang="ts">
/**
 * 智能体选择组件
 * 功能：展示当前智能体的欢迎语和推荐问题
 */
import { ref, toRefs } from 'vue';
import { Space as TSpace, CheckTag as TCheckTag, Avatar as TAvatar } from 'tdesign-vue-next';

// TSpace, TCheckTag, TAvatar 已导入，模板中使用对应组件
import type { MobileProps } from '../../model/type';
import { mobilePropsDefaults } from '../../model/type';
interface Props extends MobileProps {
  /** 当前应用头像 */
  currentApplicationAvatar?: string;
  /** 当前应用名称 */
  currentApplicationName?: string;
  /** 当前应用欢迎语 */
  currentApplicationGreeting?: string;
  /** 当前应用推荐问题列表 */
  currentApplicationOpeningQuestions?: string[];
  /** 是否显示遮罩层 */
  isOverlay?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  currentApplicationAvatar: '',
  currentApplicationName: '',
  currentApplicationGreeting: '',
  currentApplicationOpeningQuestions: () => [],
  isOverlay: false,
  ...mobilePropsDefaults,
});

// 解构 props 以便在模板中使用
const {
  currentApplicationAvatar,
  currentApplicationName,
  currentApplicationGreeting,
  currentApplicationOpeningQuestions,
  isOverlay,
  isMobile
} = toRefs(props);

const emit = defineEmits<{
  (e: 'selectQuestion', question: string): void;
}>();

// 用户选择的推荐问题
const checkQuestion = ref('');

/**
 * 选择推荐问题
 */
const handleChooseQuestion = (value: string) => {
  if (value == checkQuestion.value) {
    checkQuestion.value = "";
    emit('selectQuestion', "");
  } else {
    checkQuestion.value = value;
    emit('selectQuestion', value);
  }
}
</script>

<template>
  <div class="greeting-panel" :class="{ isMobile: isMobile }">
    <TAvatar 
      hideOnLoadFailed 
      v-if="currentApplicationAvatar && !isOverlay" 
      class="greet-avatar" 
      size="64px" 
      shape="round" 
      :image="currentApplicationAvatar"
      :imageProps="{
        lazy: true,
        loading: ''
      }"
    ></TAvatar>
    <span v-if="currentApplicationName && !isOverlay" class="greet-name">{{ currentApplicationName }}</span>
    <div class="greet-desc" v-if="currentApplicationGreeting">
        {{ currentApplicationGreeting }}
    </div>
    <TSpace :direction="isMobile ? 'vertical' : 'horizontal'" gap="8" class="recommend-question-container" v-if="currentApplicationOpeningQuestions && currentApplicationOpeningQuestions.length > 0">
        <TCheckTag theme="default" class="greet-tag" v-for="question in currentApplicationOpeningQuestions" :key="question" variant="outline"
          @click="handleChooseQuestion(question)">
          <span class="greet-tag-text">
            {{ question }}
          </span>
        </TCheckTag>
      </TSpace>
    </div>
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

.isMobile .greet-desc{
  background: var(-----td-bg-color-container-hover, #F3F3F3);
  color: var(-----td-text-color-secondary, #00000099);
  padding: calc(var(--td-size-4) + var(--td-size-1)) var(--td-pop-padding-xl);
}
.isMobile .greet-tag{
  font-size: var(--td-font-size-body-small);
  box-shadow: none;
}
.greet-tag {
  padding:var(--td-pop-padding-l) var(--td-pop-padding-xl);
  height: var(--td-comp-size-m);
  font-weight:500;
  font-size: var(--td-font-size-link-small);
  border-radius: var(--td-radius-medium);
  box-shadow: 0px 0px 1px rgba(18, 19, 25, 0.08), 0px 0px 6px rgba(18, 19, 25, 0.02), 0px 2px 12px rgba(18, 19, 25, 0.04);
}
.greet-tag-text{
  display: flex;
  color: var(--td-brand-color);
  align-items: center;
  font-weight: 500;
}
.greet-tag-text .star-icon{
  margin-right: var(--td-comp-margin-xs);
}
.recommend-question-container {
  margin-top: var(--td-size-6)
}
:deep(.recommend-question-container.t-space-vertical .t-space-item) {
  display: flex;
  justify-content: center;
}
</style>
