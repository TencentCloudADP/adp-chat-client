/**
 * API 配置 Composable
 * 统一管理 Axios 配置和 API 路径
 */
import { computed, watch, toValue, type Ref, type ComputedRef } from 'vue';
import type { ApiConfig, ApiDetailConfig } from '../service/api';
import { defaultApiDetailConfig } from '../service/api';
import { configureAxios } from '../service/httpService';

/** 响应式 API 配置类型（支持 Ref 和 ComputedRef） */
type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

/**
 * useApiConfig 参数
 */
export interface UseApiConfigOptions {
  /** API 配置（响应式引用或计算属性） */
  apiConfig: MaybeRef<ApiConfig | undefined>;
  /** 是否在初始化时配置 axios，默认 true */
  setupOnInit?: boolean;
  /** 是否监听配置变化自动更新，默认 true */
  watchChanges?: boolean;
}

/**
 * useApiConfig 返回值
 */
export interface UseApiConfigReturn {
  /** 合并后的 API 详细配置 */
  mergedApiDetailConfig: ComputedRef<ApiDetailConfig>;
  /** 手动配置 axios */
  setupAxios: () => void;
}

/** API 配置 Composable */
export function useApiConfig(options: UseApiConfigOptions): UseApiConfigReturn {
  const { 
    apiConfig, 
    setupOnInit = true, 
    watchChanges = true 
  } = options;

  /**
   * 合并后的 API 详细配置（用户配置 + 默认配置）
   */
  const mergedApiDetailConfig = computed<ApiDetailConfig>(() => ({
    ...defaultApiDetailConfig,
    ...toValue(apiConfig)?.apiDetailConfig,
  }));

  /**
   * 配置 axios 实例
   */
  const setupAxios = () => {
    const config = toValue(apiConfig);
    if (config && Object.keys(config).length > 0) {
      const { apiDetailConfig, ...axiosConfig } = config;
      if (Object.keys(axiosConfig).length > 0) {
        configureAxios(axiosConfig);
      }
    }
  };

  // 监听 apiConfig 变化，自动重新配置 axios
  if (watchChanges) {
    watch(
      () => toValue(apiConfig),
      () => {
        setupAxios();
      },
      { deep: true }
    );
  }

  // 初始化时配置 axios
  if (setupOnInit) {
    setupAxios();
  }

  return {
    mergedApiDetailConfig,
    setupAxios,
  };
}

export default useApiConfig;
