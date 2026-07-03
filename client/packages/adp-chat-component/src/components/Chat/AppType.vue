<script setup lang="ts">
/**
 * 智能体选择组件
 * 功能：展示当前智能体的欢迎语和推荐问题
 */
import { ref, toRefs, computed } from 'vue';
import { Space as TSpace, CheckTag as TCheckTag } from 'tdesign-vue-next';
import AnimatedIcon from '../AnimatedIcon/index.vue';

// TSpace, TCheckTag 已导入，AnimatedIcon 为动效图标组件
import type { MobileProps, ChatI18n } from '../../model/type';
import { mobilePropsDefaults, defaultChatI18n, defaultChatI18nEn } from '../../model/type';
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
  /** 国际化文本 */
  i18n?: ChatI18n;
  /** 当前语言标识 */
  language?: string;
}

const props = withDefaults(defineProps<Props>(), {
  currentApplicationAvatar: '',
  currentApplicationName: '',
  currentApplicationGreeting: '',
  currentApplicationOpeningQuestions: () => [],
  isOverlay: false,
  i18n: () => ({}),
  language: 'zh-CN',
  ...mobilePropsDefaults,
});

const mergedI18n = computed(() => {
  const defaults = props.language?.startsWith('en') ? defaultChatI18nEn : defaultChatI18n;
  return { ...defaults, ...props.i18n };
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
    <div class="welcome-header-content" v-if="!isOverlay">
      <div class="welcome-title-row">
        <AnimatedIcon class="welcome-robot-icon" :width="46" :height="36" />
        <div class="welcome-title">{{ mergedI18n.welcomeTitle }}</div>
      </div>
      <div class="welcome-description">
        {{ mergedI18n.welcomeDescription }}
      </div>
    </div>
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
/* ── 欢迎面板 ── */
.greeting-panel {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
}

.welcome-header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 36px;
}

.welcome-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.welcome-robot-icon {
  width: 46px;
  height: 36px;
  flex-shrink: 0;
}

.welcome-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--td-text-color-primary, rgba(0, 0, 0, 0.9));
  line-height: 32px;
  letter-spacing: -0.02em;
}

.welcome-description {
  font-size: 14px;
  line-height: 22px;
  color: var(--td-text-color-placeholder);
  text-align: center;
  max-width: 460px;
  text-wrap: balance;
}

/* ── 欢迎语 ── */
.greet-desc {
  color: var(--td-text-color-secondary);
  background-color: var(--td-bg-color-container-hover);
  font-size: 14px;
  word-break: break-word;
  margin-top: 20px;
  padding: 10px 16px;
  border-radius: 10px;
  line-height: 22px;
}

.isMobile .greet-desc {
  background: var(--td-bg-color-container-hover, #F3F3F3);
  color: var(--td-text-color-secondary, #00000099);
  padding: 10px 16px;
}

/* ── 推荐问题 ── */
.recommend-question-container {
  margin-top: 16px;
}

.greet-tag {
  padding: 8px 16px;
  height: auto;
  min-height: 36px;
  font-weight: 500;
  font-size: 13px;
  border-radius: var(--td-radius-round);
  border: 1px solid var(--td-component-stroke);
  box-shadow: none;
  background: var(--td-bg-color-container);
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;
}

.greet-tag:hover {
  border-color: var(--td-brand-color-3);
  background: var(--td-bg-color-container-hover);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
}

.greet-tag:active {
  transform: scale(0.98);
}

.greet-tag-text {
  display: flex;
  color: var(--td-brand-color);
  align-items: center;
  font-weight: 500;
  line-height: 20px;
}

.greet-tag-text .star-icon {
  margin-right: var(--td-comp-margin-xs);
}

.isMobile .greet-tag {
  font-size: var(--td-font-size-body-small);
  box-shadow: none;
}

:deep(.recommend-question-container.t-space-vertical .t-space-item) {
  display: flex;
  justify-content: center;
}

@media (prefers-reduced-motion: reduce) {
  .greet-tag {
    transition: none;
  }
}
</style>
