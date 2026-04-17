/**
 * @module useWidgetInit
 * @description Widget 初始化 Composable，管理 widget 的初始化生命周期
 *
 * 核心职责：
 * - 事件委托模式：在容器上监听冒泡事件，不受 v-html DOM 替换影响
 * - 防抖 initWidgets（避免 SSE 流中频繁触发）
 * - 版本追踪（防止旧的异步操作覆盖新的）
 * - Custom Element 升级
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
  let delegationAttached = false;

  /**
   * 从事件源 widget 元素向上查找 wrapper，提取 widgetId 和 widgetRunId
   * @param {Element} widgetEl - 触发事件的 widget DOM 元素
   * @returns {{ widgetId: string; widgetRunId: string }} widget 标识信息
   */
  function resolveWidgetIds(widgetEl: Element): { widgetId: string; widgetRunId: string } {
    const wrapper = widgetEl.closest('.adp-widget-wrapper');
    const widgetId = wrapper?.getAttribute('data-widget-id') || getWidgetId() || '';
    const widgetRunId = wrapper?.getAttribute('data-widget-run-id') || getWidgetRunId() || '';
    return { widgetId, widgetRunId };
  }

  /**
   * 在容器上设置事件委托监听器（仅绑定一次）
   * @description 利用事件冒泡机制，无论 v-html 如何替换 DOM，事件都能被正确捕获。
   *              监听 widget-action、widget-rendered、cardsubmit 三类事件。
   * @param {HTMLElement} container - 事件委托的容器元素
   */
  function setupEventDelegation(container: HTMLElement): void {
    if (delegationAttached) return;
    delegationAttached = true;

    // widget-action 事件委托（简单交互）
    container.addEventListener('widget-action', ((event: CustomEvent) => {
      const widgetEl = (event.target as Element)?.closest?.('adp-widget') || event.target as Element;
      if (!widgetEl) return;
      const { action } = event.detail || {};
      if (action) {
        const { widgetId, widgetRunId } = resolveWidgetIds(widgetEl);
        onWidgetAction?.(action as WidgetActionPayload);

        const syntheticEvent = new CustomEvent('widget-event', {
          detail: { action },
          bubbles: true,
          composed: true
        });
        onWidgetEvent?.(syntheticEvent, widgetRunId, widgetId);
      }
    }) as EventListener);

    // widget-rendered 事件委托
    container.addEventListener('widget-rendered', ((event: CustomEvent) => {
      const widgetEl = (event.target as Element)?.closest?.('adp-widget') || event.target as Element;
      if (!widgetEl) return;
      const { success, error } = event.detail || {};
      const { widgetId, widgetRunId } = resolveWidgetIds(widgetEl);
      onWidgetRendered?.({ success, error }, widgetRunId, widgetId);
    }) as EventListener);

    // cardsubmit 事件委托（表单提交）
    container.addEventListener('cardsubmit', ((event: CustomEvent) => {
      const widgetEl = (event.target as Element)?.closest?.('adp-widget') || event.target as Element;
      if (!widgetEl) return;
      const { action } = event.detail || {};
      if (action) {
        const { widgetId, widgetRunId } = resolveWidgetIds(widgetEl);
        const syntheticEvent = new CustomEvent('widget-event', {
          detail: { action },
          bubbles: true,
          composed: true
        });
        onWidgetEvent?.(syntheticEvent, widgetRunId, widgetId);
      }
    }) as EventListener);
  }

  /**
   * 更新 widget 元素的 disable 属性
   * @param {Element} widgetEl - 目标 widget DOM 元素
   * @param {boolean} isDisabled - 是否禁用交互
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
   * @description 负责 SDK 懒加载、Custom Element 升级（通过 replaceChild 触发
   *              connectedCallback）以及 disable 属性同步。
   *              事件绑定由 {@link setupEventDelegation} 通过事件委托统一处理。
   * @returns {Promise<void>}
   */
  async function initWidgets(): Promise<void> {
    const currentVersion = ++initWidgetsVersion;

    if (!containerRef.value) return;

    const widgetWrappers = containerRef.value.querySelectorAll('.adp-widget-wrapper');
    if (widgetWrappers.length === 0) return;

    // 确保事件委托已设置
    setupEventDelegation(containerRef.value);

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

      // 如果已经完成 Custom Element 升级（有 data-upgraded 标记），只需更新 disable 属性
      if (widgetEl.hasAttribute('data-upgraded')) {
        updateWidgetDisable(widgetEl, isDisabled);
        return;
      }

      // 对未升级的 widget 执行替换操作，触发 Custom Element 的 connectedCallback
      const parent = widgetEl.parentNode;
      if (parent) {
        const newWidget = document.createElement('adp-widget');
        Array.from(widgetEl.attributes).forEach(attr => {
          if (attr.name === 'data-upgraded') return;
          newWidget.setAttribute(attr.name, attr.value);
        });

        updateWidgetDisable(newWidget, isDisabled);
        parent.replaceChild(newWidget, widgetEl);

        const savedVersion = currentVersion;

        customElements.whenDefined('adp-widget').then(() => {
          requestAnimationFrame(() => {
            setTimeout(() => {
              // 版本不匹配或元素已断连时跳过升级标记
              if (savedVersion !== initWidgetsVersion || !newWidget.isConnected) {
                return;
              }
              newWidget.setAttribute('data-upgraded', 'true');
            }, 0);
          });
        });
        return;
      }

      // fallback: 直接标记并更新 disable
      updateWidgetDisable(widgetEl, isDisabled);
      widgetEl.setAttribute('data-upgraded', 'true');
    });
  }

  /**
   * 防抖版的 initWidgets，延迟 50ms 执行
   * @description 避免 SSE 流式传输中内容频繁变化导致重复初始化
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
    // 挂载时立即设置事件委托
    if (containerRef.value) {
      setupEventDelegation(containerRef.value);
    }
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
    delegationAttached = false;
  });

  return {
    initWidgets,
    debouncedInitWidgets,
  };
}
