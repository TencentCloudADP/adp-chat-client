<script setup lang="ts">
/**
 * 智能体选择组件
 * 功能：提供智能体选择下拉框，并展示当前智能体的欢迎语和推荐问题
 */
import { onMounted, computed, ref } from 'vue';
import { useAppsStore } from '@/stores/apps';

// 组件Props定义
const { showDetail, getDefaultQuestion } = defineProps({
  /**
   * 是否显示智能体详情（欢迎语和推荐问题）
   * @type {boolean}
   * @default true
   */
  showDetail: {
    type: Boolean,
    default: true
  },
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

// 计算属性：应用列表
const applications = computed(() => appsStore.applications);
// 计算属性：当前选中的智能体
const currentApplication = computed(() => appsStore.currentApplication);
// 计算属性：当前选中的智能体ID
const currentApplicationId = computed(() => appsStore.currentApplicationId);

// 用户选择的推荐问题
const checkQuestion = ref('');


onMounted(async () => {
});

/**
 * 切换智能体
 * @param {string} value - 智能体的value值
 */
const handleChangeApps = (value: string) => {
  let curApp = applications.value.find((application) => application['value'] == value)
  console.log('handleChangeApps', value, curApp)
  if (curApp) {
    appsStore.setCurrentApplication(curApp);
  }
}

/**
 * 选择推荐问题
 * @param {string} value - 推荐问题的内容
 */
const handleChooseQuestion = (value:string) => {
  if(value == checkQuestion.value){
    checkQuestion.value = "";
    getDefaultQuestion && getDefaultQuestion("")
  }else{
    checkQuestion.value = value;
    getDefaultQuestion && getDefaultQuestion(value)
  }
}
</script>

<template>
  <flex class="greeting-panel">
    <t-select class="app-select" style="width: 300px" size="large" v-model="currentApplicationId" placeholder="请选择智能体"
      @change="handleChangeApps">
      <template #valueDisplay="{value,onClose}">
        <div class="apps-options_item">
          <t-avatar :image="appsStore.currentApplicationAvatar" />
          <label>{{ appsStore.currentApplicationName }}</label>
        </div>
      </template>
      <t-option v-for="app in applications" :key="app.value" :value="app.value" :label="app.label">
        <div class="apps-options_item">
          <t-avatar :image="app.detail.BaseConfig?.Avatar" />
          <label>{{ app.label }}</label>
        </div>
      </t-option>
    </t-select>
    <div v-if="currentApplicationId && showDetail" class="app-detail-container">
      <div class="greet-desc">
        “{{ appsStore.currentApplicationGreeting }}”
      </div>
      <t-space class="recommend-question-container"
        v-if="appsStore.currentApplicationOpeningQuestions && appsStore.currentApplicationOpeningQuestions.length > 0">
        <t-check-tag :checked="question === checkQuestion" v-for="question in appsStore.currentApplicationOpeningQuestions" variant="outline" 
          @click="handleChooseQuestion(question)">{{ question }}</t-check-tag>
      </t-space>
    </div>
  </flex>
</template>

<style scoped>
.collapse-btn {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 10;
}

.app-detail-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.greeting-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.greet-desc {
  color: var(--td-text-color-secondary);
  font-size: var(--td-font-size-title-medium);
  word-break: break-all;
  margin-top: var(--td-size-5)
}

.apps-options_item{
  padding: 4px 0;
  display: flex;
  align-items: center;
}
.apps-options_item label{
  margin-left: 8px;
}
.recommend-question-container{
  margin-top: var(--td-size-6)
}

</style>
<style>
.greeting-panel .t-input{
  border-radius: 50px;
  width: 300px;
}
</style>

