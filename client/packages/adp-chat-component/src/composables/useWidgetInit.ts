/**
 * @module useWidgetInit
 * @description Widget 初始化 Composable，管理 widget 的初始化生命周期
 *
 * 核心职责：
 * - 事件委托：在容器上监听 widget-action、cardsubmit 冒泡事件
 * - 直接绑定：在每个 widget 元素上监听 widget-rendered 事件
 * - 防抖 initWidgets，避免 SSE 流中频繁触发
 * - 版本追踪，防止旧的异步操作覆盖新的
 * - Custom Element 升级
 * - disable 属性同步
 * - Widget 缩放自适应
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
  /**
   * 是否启用 Widget 缩放自适应
   * - true: 自适应父容器宽度（推荐移动端使用）
   * - false/undefined: 不缩放（默认）
   * - number: 按指定比例缩放（如 0.5 表示缩放到 50%）
   */
  enableScale?: () => boolean | number;
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
    enableScale,
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
   * @description 利用事件冒泡机制，监听 widget-action、cardsubmit 事件，
   *              不受 v-html DOM 替换影响。
   * @param {HTMLElement} container - 事件委托的容器元素
   */
  function setupEventDelegation(container: HTMLElement): void {
    if (delegationAttached) return;
    delegationAttached = true;

    // widget-action 事件委托
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

    // cardsubmit 事件委托
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
   * 在 widget 元素上直接绑定 widget-rendered 事件监听器
   * @description widget-rendered 事件以 bubbles:false 派发，需直接在元素上监听。
   *              通过 data-rendered-bindable 标记防止重复绑定。
   * @param {Element} widgetEl - 目标 adp-widget DOM 元素
   */
  function bindRenderedListener(widgetEl: Element): void {
    // 防止重复绑定
    if (widgetEl.hasAttribute('data-rendered-bindable')) return;
    widgetEl.setAttribute('data-rendered-bindable', 'true');

    widgetEl.addEventListener('widget-rendered', ((event: CustomEvent) => {
      const { success, error } = event.detail || {};
      const { widgetId, widgetRunId } = resolveWidgetIds(widgetEl);
      onWidgetRendered?.({ success, error }, widgetRunId, widgetId);

      // 渲染完成后执行缩放适配
      if (enableScale?.()) {
        const wrapper = widgetEl.closest('.adp-widget-wrapper');
        if (wrapper) {
          requestAnimationFrame(() => {
            scaleWidgetIfNeeded(wrapper);
          });
        }
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
   * 对单个 widget wrapper 执行缩放处理
   * @description 根据 enableScale 配置计算缩放比例：
   *   - true: 自适应父容器宽度（widget 超出时缩小）
   *   - number: 按指定比例缩放
   *   - false/undefined: 重置缩放
   * 
   * 技术方案：使用 CSS transform: scale() + 容器高度补偿
   * @param {Element} wrapper - widget 的外层 wrapper 元素（.adp-widget-wrapper）
   */
  function scaleWidgetIfNeeded(wrapper: Element): void {
    const scaleValue = enableScale?.();
    const widgetEl = wrapper.querySelector('adp-widget') as HTMLElement | null;
    if (!widgetEl) return;

    const wrapperEl = wrapper as HTMLElement;

    // scale 未启用时，重置所有缩放样式
    if (!scaleValue) {
      wrapperEl.style.width = '';
      wrapperEl.style.height = '';
      wrapperEl.style.overflow = '';
      widgetEl.style.transform = '';
      widgetEl.style.transformOrigin = '';
      return;
    }

    let scale: number | undefined;

    if (typeof scaleValue === 'number') {
      // 固定比例缩放
      scale = scaleValue;
    } else if (scaleValue === true) {
      // 自适应父容器宽度
      const parentEl = containerRef.value;
      if (!parentEl) return;
      const containerWidth = parentEl.clientWidth;

      // 临时移除 transform 以获取 widget 的真实宽度
      const currentTransform = widgetEl.style.transform;
      widgetEl.style.transform = '';
      const widgetWidth = widgetEl.scrollWidth || widgetEl.offsetWidth;
      widgetEl.style.transform = currentTransform;

      // widget 未超出容器宽度时不需要缩放
      if (containerWidth <= 0 || widgetWidth <= containerWidth) {
        wrapperEl.style.width = '';
        wrapperEl.style.height = '';
        wrapperEl.style.overflow = '';
        widgetEl.style.transform = '';
        widgetEl.style.transformOrigin = '';
        return;
      }
      scale = containerWidth / widgetWidth;
    }

    // 应用缩放：使用 transform: scale() 并补偿容器宽高
    if (scale && scale > 0) {
      widgetEl.style.transform = '';
      const widgetWidth = widgetEl.scrollWidth || widgetEl.offsetWidth;
      const widgetHeight = widgetEl.scrollHeight || widgetEl.offsetHeight;
      wrapperEl.style.width = `${widgetWidth * scale}px`;
      wrapperEl.style.height = `${widgetHeight * scale}px`;
      wrapperEl.style.overflow = 'visible';
      widgetEl.style.transform = `scale(${scale})`;
      widgetEl.style.transformOrigin = 'top left';
    }
  }

  /**
   * 对容器中所有已渲染的 widget 执行缩放处理
   */
  function scaleAllWidgets(): void {
    if (!containerRef.value) return;
    const wrappers = containerRef.value.querySelectorAll('.adp-widget-wrapper');
    wrappers.forEach((wrapper) => scaleWidgetIfNeeded(wrapper));
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
        bindRenderedListener(widgetEl);
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

        bindRenderedListener(newWidget);

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
      bindRenderedListener(widgetEl);
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

  // 监听 enableScale 变化，重新执行缩放
  let resizeHandler: (() => void) | null = null;
  let resizeTimer: ReturnType<typeof setTimeout> | null = null;

  if (enableScale) {
    watch(
      enableScale,
      () => {
        if (!isMounted.value) return;
        // 延迟执行以等待布局稳定
        requestAnimationFrame(() => scaleAllWidgets());
      },
      { flush: 'post' }
    );
  }

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

    // 窗口 resize 时重新计算缩放（防抖 200ms）
    if (enableScale) {
      resizeHandler = () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          resizeTimer = null;
          if (enableScale() && isMounted.value) {
            scaleAllWidgets();
          }
        }, 200);
      };
      window.addEventListener('resize', resizeHandler);
    }
  });

  onBeforeUnmount(() => {
    if (initWidgetsTimer) {
      clearTimeout(initWidgetsTimer);
      initWidgetsTimer = null;
    }
    if (resizeTimer) {
      clearTimeout(resizeTimer);
      resizeTimer = null;
    }
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
      resizeHandler = null;
    }
    initWidgetsVersion++;
    delegationAttached = false;
  });

  return {
    initWidgets,
    debouncedInitWidgets,
    /** 手动触发所有 widget 的缩放计算 */
    scaleAllWidgets,
  };
}
