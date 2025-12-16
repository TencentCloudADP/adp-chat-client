import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { handleLoadApplication } from '@/service/application';
import type { Application } from '@/model/application'

/**
 * 定义应用商店，管理应用相关状态
 * 使用Pinia的defineStore创建响应式状态管理
 * @property {Application[]} applications - 存储所有应用选项列表
 * @property {Application} currentApplication - 当前选中的应用选项
 * @returns {Object} 包含应用状态和相关计算属性的对象
 */
export const useAppsStore = defineStore('apps', () => {
  const applications = ref([] as Application[]);
  const currentApplication = ref<Application>();
  const currentApplicationId = computed(() => currentApplication.value?.ApplicationId)
  const currentApplicationAvatar = computed(() => currentApplication.value?.Avatar)
  const currentApplicationName = computed(() => currentApplication.value?.Name)
  const currentApplicationGreeting = computed(() => currentApplication.value?.Greeting)
  const currentApplicationOpeningQuestions = computed(() => currentApplication.value?.OpeningQuestions)

  /**
   * 设置当前应用
   * @param {Application} newApp - 新的应用选项
   */
  const setCurrentApplication = (newApp: Application) => {
    currentApplication.value = newApp;
  }

  /**
   * 设置当前应用Id
   * @param {string} applicationId - 应用Id
   */
  const setCurrentApplicationId = (applicationId: string) => {
    const appsStore = useAppsStore();
    let app = appsStore.applications.find(a => a.ApplicationId === applicationId);
    if (!app) {
        app = appsStore.applications[0];
    }
    appsStore.setCurrentApplication(app);
  }

  /**
   * 设置应用列表
   * @param {Application[]} apps - 应用选项数组
   */
  const setApplications = (apps: Application[]) => {
    applications.value = apps;
  }

  return {
    applications,
    setApplications,
    currentApplication,
    setCurrentApplication,
    setCurrentApplicationId,
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
  const { Applications } = await handleLoadApplication('3');
  console.log('Applications:', Applications);
  const appsStore = useAppsStore();
  appsStore.setApplications(Applications);
}

// 加载应用列表并设置默认智能体
export const fetchApplicationInfo = async () => {
  await getApplications();
}