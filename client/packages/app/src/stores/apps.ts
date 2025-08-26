import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { handleLoadApplication } from '@/service/application';
import type { Application, ApplicationOptions } from '@/model/application'

/**
 * 定义应用商店，管理应用相关状态
 * 使用Pinia的defineStore创建响应式状态管理
 * @property {ApplicationOptions[]} applications - 存储所有应用选项列表
 * @property {ApplicationOptions} currentApplication - 当前选中的应用选项
 * @returns {Object} 包含应用状态和相关计算属性的对象
 */
export const useAppsStore = defineStore('apps', () => {
  const applications = ref([] as ApplicationOptions[]);
  const currentApplication = ref<ApplicationOptions>();
  const currentApplicationId = computed(() => currentApplication.value?.value)
  const currentApplicationAvatar = computed(() => currentApplication.value?.detail?.BaseConfig?.Avatar)
  const currentApplicationName = computed(() => currentApplication.value?.detail?.BaseConfig?.Name)
  const currentApplicationGreeting = computed(() => currentApplication.value?.detail?.AppConfig?.KnowledgeQa?.Greeting)
  const currentApplicationOpeningQuestions = computed(() => currentApplication.value?.detail?.AppConfig?.KnowledgeQa?.OpeningQuestions)

  /**
   * 设置当前应用
   * @param {ApplicationOptions} newApp - 新的应用选项
   */
  const setCurrentApplication = (newApp: ApplicationOptions) => {
    currentApplication.value = newApp;
  }

  /**
   * 设置应用列表
   * @param {ApplicationOptions[]} apps - 应用选项数组
   */
  const setApplications = (apps: ApplicationOptions[]) => {
    applications.value = apps;
  }

  return {
    applications,
    setApplications,
    currentApplication,
    setCurrentApplication,
    currentApplicationId,
    currentApplicationAvatar,
    currentApplicationName,
    currentApplicationGreeting,
    currentApplicationOpeningQuestions
  }
})

/**
 * 获取应用列表并更新到store中
 * 调用handleLoadApplication接口获取应用数据
 * 将数据格式化为应用选项列表并存储
 * @returns {Promise<void>} 无返回值
 */
export const getApplications = async () => {
  const { Applications } = await handleLoadApplication();
  console.log('Applications:', Applications);
  const _appsList = Applications.map((app: Application) => {
    return {
      label: app['BaseConfig']['Name'],
      value: app['AppBizId'],
      detail: app
    }
  });
  const appsStore = useAppsStore();
  appsStore.setApplications(_appsList);
}

// 加载应用列表并设置默认智能体
export const initApplication = async () => {
  await getApplications();
  const appsStore = useAppsStore()
  if (!appsStore.currentApplication && appsStore.applications.length > 0) {
    appsStore.setCurrentApplication(appsStore.applications[0]);
  }
}