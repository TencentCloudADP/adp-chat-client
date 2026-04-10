/**
 * Widget 初始化 Composable
 *
 * 从 MdContent.vue 中提取 widget 的初始化生命周期管理：
 * - 防抖 initWidgets（避免 SSE 流中频繁触发）
 * - 版本追踪（防止旧的异步操作覆盖新的）
 * - Custom Element 升级与事件绑定
 * - disable 属性同步
 */

import { ref, watch, onMounted, onBeforeUnmount, type Ref } from 'vue';
import { isWidgetSdkLoaded, loadWidgetSdk, hasWidgetContent, showFallbackJson } from '../widget';

/** Widget 事件载荷类型 */
export interface WidgetActionPayload {
  type: string;
  handler?: string;
  payload?: any;
  snapshot?: string;
  widgetSnapshot?: string;
}

/** useWidgetInit 参数 */
export interface UseWidgetInitOptions {
  /** Markdown 容器 DOM 引用 */
  containerRef: Ref<HTMLDivElement | null>;
  /** 内容文本 */
  content: () => string | undefined;
  /** 是否禁用 widget 交互 */
  disable: () => boolean;
  /** Widget ID（后备值） */
  widgetId: () => string;
  /** Widget Run ID（后备值） */
  widgetRunId: () => string;
  /** 消息 Record ID */
  recordId: () => string;
  /** 触发事件回调 */
  onWidgetAction?: (action: WidgetActionPayload) => void;
  onWidgetEvent?: (event: CustomEvent, widgetRunId: string, widgetId: string) => void;
  onWidgetRendered?: (detail: { success: boolean; error?: Error }, widgetRunId: string, widgetId: string) => void;
  onWidgetError?: (error: Error) => void;
}

export function useWidgetInit(options: UseWidgetInitOptions) {
  const {
    containerRef,
    content,
    disable,
    widgetId: getWidgetId,
    widgetRunId: getWidgetRunId,
    onWidgetAction,
    onWidgetEvent,
    onWidgetRendered,
    onWidgetError,
  } = options;

  const isMounted = ref(false);
  let initWidgetsVersion = 0;
  let initWidgetsTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * 为 widget 元素设置事件监听器
   */
  function setupWidgetListeners(widgetEl: Element): void {
    if (widgetEl.hasAttribute('data-events-attached')) {
      return;
    }
    widgetEl.setAttribute('data-events-attached', 'true');

    const wrapper = widgetEl.closest('.adp-widget-wrapper');
    const widgetId = wrapper?.getAttribute('data-widget-id') || getWidgetId() || '';
    const widgetRunId = wrapper?.getAttribute('data-widget-run-id') || getWidgetRunId() || '';

    // widget-action 事件监听器（简单交互）
    widgetEl.addEventListener('widget-action', ((event: CustomEvent) => {
      const { action } = event.detail || {};
      if (action) {
        onWidgetAction?.(action as WidgetActionPayload);

        // 同时触发 widgetEvent，以便上层组件可以统一处理
        const syntheticEvent = new CustomEvent('widget-event', {
          detail: { action },
          bubbles: true,
          composed: true
        });
        onWidgetEvent?.(syntheticEvent, widgetRunId, widgetId);
      }
    }) as EventListener);

    // widget-rendered 事件监听器
    widgetEl.addEventListener('widget-rendered', ((event: CustomEvent) => {
      const { success, error } = event.detail || {};
      onWidgetRendered?.({ success, error }, widgetRunId, widgetId);
    }) as EventListener);

    // cardsubmit 事件监听器（表单提交）
    widgetEl.addEventListener('cardsubmit', ((event: CustomEvent) => {
      const { action } = event.detail || {};
      if (action) {
        const syntheticEvent = new CustomEvent('widget-event', {
          detail: { action },
          bubbles: true,
          composed: true
        });
        onWidgetEvent?.(syntheticEvent, widgetRunId, widgetId);
      }
    }) as EventListener);

    // formsubmit 事件监听器
    widgetEl.addEventListener('formsubmit', (() => {
      // formsubmit 通常不需要向外传递，只在内部处理
    }) as EventListener);
  }

  /**
   * 更新 widget 元素的 disable 属性
   */
  function updateWidgetDisable(widgetEl: Element, isDisabled: boolean): void {
    if (isDisabled) {
      widgetEl.setAttribute('disable', 'true');
    } else {
      widgetEl.removeAttribute('disable');
    }
  }

  /**
   * 初始化页面中的所有 widget
   */
  async function initWidgets(): Promise<void> {
    const currentVersion = ++initWidgetsVersion;

    if (!containerRef.value) return;

    const widgetWrappers = containerRef.value.querySelectorAll('.adp-widget-wrapper');
    if (widgetWrappers.length === 0) return;

    // 懒加载 widget SDK
    const wasLoaded = isWidgetSdkLoaded();
    if (!wasLoaded) {
      try {
        await loadWidgetSdk();
      } catch (error) {
        onWidgetError?.(error instanceof Error ? error : new Error('Failed to load widget SDK'));
        showFallbackJson(widgetWrappers);
        return;
      }
      if (currentVersion !== initWidgetsVersion) return;
    }

    // SDK 已加载时等待 Custom Elements 升级
    if (wasLoaded) {
      try {
        await customElements.whenDefined('adp-widget');
        await new Promise(resolve => setTimeout(resolve, 0));
      } catch {
        // 忽略 whenDefined 的错误
      }
      if (currentVersion !== initWidgetsVersion) return;
    }

    // 重新获取当前 DOM 中的 widget wrappers（v-html 可能已替换 DOM）
    if (!containerRef.value) return;
    const currentWrappers = containerRef.value.querySelectorAll('.adp-widget-wrapper');
    const isDisabled = disable();

    currentWrappers.forEach((wrapper) => {
      const widgetEl = wrapper.querySelector('adp-widget');
      if (!widgetEl) return;

      // 如果已经有事件监听器，只需更新 disable 属性
      if (widgetEl.hasAttribute('data-events-attached')) {
        updateWidgetDisable(widgetEl, isDisabled);
        return;
      }

      // 对所有未绑定事件的 widget 执行替换操作
      // 通过替换元素触发 Custom Element 的 connectedCallback
      const parent = widgetEl.parentNode;
      if (parent) {
        const newWidget = document.createElement('adp-widget');
        Array.from(widgetEl.attributes).forEach(attr => {
          if (attr.name === 'data-events-attached') return;
          newWidget.setAttribute(attr.name, attr.value);
        });

        updateWidgetDisable(newWidget, isDisabled);
        parent.replaceChild(newWidget, widgetEl);

        const savedVersion = currentVersion;

        customElements.whenDefined('adp-widget').then(() => {
          requestAnimationFrame(() => {
            setTimeout(() => {
              if (savedVersion !== initWidgetsVersion && !newWidget.isConnected) {
                return;
              }
              if (newWidget.isConnected) {
                setupWidgetListeners(newWidget);
              }
            }, 0);
          });
        });
        return;
      }

      // fallback: 直接尝试添加事件
      updateWidgetDisable(widgetEl, isDisabled);
      setupWidgetListeners(widgetEl);
    });
  }

  /**
   * 防抖版的 initWidgets
   */
  function debouncedInitWidgets(): void {
    if (initWidgetsTimer) {
      clearTimeout(initWidgetsTimer);
    }
    initWidgetsTimer = setTimeout(() => {
      initWidgetsTimer = null;
      initWidgets();
    }, 50);
  }

  // 监听内容变化
  watch(
    content,
    (newContent) => {
      if (isMounted.value && hasWidgetContent(newContent)) {
        debouncedInitWidgets();
      }
    },
    { flush: 'post' }
  );

  // 监听 disable 属性变化
  watch(
    disable,
    (newDisable) => {
      if (!isMounted.value || !containerRef.value) return;

      const widgets = containerRef.value.querySelectorAll('adp-widget');
      widgets.forEach((widget) => {
        updateWidgetDisable(widget, newDisable);
      });
    },
    { flush: 'post' }
  );

  // 生命周期
  onMounted(() => {
    isMounted.value = true;
    if (hasWidgetContent(content())) {
      initWidgets();
    }
  });

  onBeforeUnmount(() => {
    if (initWidgetsTimer) {
      clearTimeout(initWidgetsTimer);
      initWidgetsTimer = null;
    }
    initWidgetsVersion++;
  });

  return {
    initWidgets,
    debouncedInitWidgets,
  };
}
