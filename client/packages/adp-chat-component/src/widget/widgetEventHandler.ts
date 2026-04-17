/**
 * Widget 事件统一处理模块
 * 集中管理 widget action 的路由分发：
 * - sys.go_to_url：跳转链接
 * - sys.download：下载文件
 * - sys.chat / sys.clarify：需要 SSE 请求（由外部处理）
 *
 * 参考 webim 项目的 widgetEventHandler.js 架构
 */

/** Widget Action 类型定义 */
export interface WidgetActionPayload {
  type: string;
  handler?: string;
  payload?: any;
  snapshot?: string;
  widgetSnapshot?: string;
}

/** Widget Action 请求参数（用于 SSE 请求） */
export interface WidgetActionRequest {
  WidgetId: string;
  WidgetRunId: string;
  ActionType: string;
  Payload: string;
  WidgetSnapshot: string;
}

/** Widget 事件处理结果 */
export interface WidgetEventResult {
  /** 是否已在本地处理完毕（不需要 SSE 请求） */
  handled: boolean;
  /** action 类型 */
  actionType: string;
  /** 如果需要 SSE 请求，附带请求参数 */
  widgetActionRequest?: WidgetActionRequest;
}

/**
 * 解析 payload，支持字符串和对象格式
 */
function parsePayload(payload: any): any {
  if (typeof payload === 'string') {
    try {
      return JSON.parse(payload);
    } catch {
      return {};
    }
  }
  return payload || {};
}

/**
 * 处理 sys.go_to_url 事件 - 跳转链接
 */
function handleGoToUrl(payload: any): boolean {
  const parsedPayload = parsePayload(payload);
  const url = parsedPayload?.url;
  if (url) {
    window.open(url, '_blank');
    return true;
  }
  console.warn('[widgetEventHandler] sys.go_to_url 缺少 url 参数');
  return false;
}

/**
 * 处理 sys.download 事件 - 下载文件
 */
function handleDownload(payload: any): boolean {
  const parsedPayload = parsePayload(payload);
  const url = parsedPayload?.url;
  if (!url) {
    console.warn('[widgetEventHandler] sys.download 缺少 url 参数');
    return false;
  }

  const link = document.createElement('a');
  link.href = url;
  link.download = parsedPayload?.filename || '';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
}

/**
 * 构建 widget action SSE 请求参数
 */
function buildWidgetActionRequest(
  actionData: WidgetActionPayload,
  widgetId: string,
  widgetRunId: string,
): WidgetActionRequest {
  return {
    WidgetId: widgetId || '',
    WidgetRunId: widgetRunId || '',
    ActionType: actionData.type || '',
    Payload: typeof actionData.payload === 'string'
      ? actionData.payload
      : JSON.stringify(actionData.payload || {}),
    WidgetSnapshot: actionData.widgetSnapshot || actionData.snapshot || '',
  };
}

/**
 * 核心事件处理入口：根据 action type 进行路由分发
 *
 * @param event - widget 自定义事件
 * @param widgetRunId - widget run id
 * @param widgetId - widget id
 * @returns 处理结果，包含是否已处理及可能的 SSE 请求参数
 */
export function handleWidgetEvent(
  event: CustomEvent,
  widgetRunId: string,
  widgetId: string,
): WidgetEventResult {
  const actionData: WidgetActionPayload = event?.detail?.action || {};
  const actionType = actionData.type || '';

  // sys.go_to_url - 本地处理
  if (actionType === 'sys.go_to_url') {
    handleGoToUrl(actionData.payload);
    return { handled: true, actionType };
  }

  // sys.download - 本地处理
  if (actionType === 'sys.download') {
    handleDownload(actionData.payload);
    return { handled: true, actionType };
  }

  // sys.chat / sys.clarify - 需要 SSE 请求
  if (actionType === 'sys.chat' || actionType === 'sys.clarify') {
    const widgetActionRequest = buildWidgetActionRequest(actionData, widgetId, widgetRunId);
    return { handled: false, actionType, widgetActionRequest };
  }

  // 其他未知类型
  return { handled: false, actionType };
}

/**
 * 禁用指定 recordId 消息下的所有 widget 交互
 * @description 通过 DOM 操作查找匹配 recordId 的 wrapper，设置其中 adp-widget 的 disable 属性
 * @param {string} recordId - 消息记录 ID
 */
export function disableWidgetsByRecordId(recordId: string): void {
  if (!recordId) {
    console.warn('[widgetEventHandler] disableWidgetsByRecordId: recordId 为空');
    return;
  }

  const wrappers = document.querySelectorAll(`.adp-widget-wrapper[data-record-id="${recordId}"]`);
  wrappers.forEach((wrapper) => {
    const widgetEl = wrapper.querySelector('adp-widget');
    if (widgetEl) {
      widgetEl.setAttribute('disable', 'true');
    }
  });
}
