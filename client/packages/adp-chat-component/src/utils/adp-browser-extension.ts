/**
 * ADP 浏览器助手扩展（Pagebuddy）通信工具
 *
 * 该模块封装了 webim 与 ADP 浏览器助手 Chrome 扩展之间的通信能力：
 * 1. 探测扩展是否已安装（通过 chrome.runtime.sendMessage + externally_connectable）
 * 2. 拉取扩展生成的会话凭证 token，用于 connector 鉴权头同步
 * 3. 提供识别"ADP 浏览器助手"连接器的辅助方法
 *
 * 扩展侧的接口契约见：
 *   pagebuddy/packages/extension/src/lib/tde-bridge.ts
 *   pagebuddy/packages/extension/src/agent/TdeBridge.background.ts
 */

// ====== 类型扩展：window.chrome / 全局覆盖变量 ======
interface ChromeRuntimeLastError {
    message?: string;
}

interface ChromeRuntime {
    sendMessage?: (
        extensionId: string,
        message: Record<string, unknown>,
        callback: (response: unknown) => void,
    ) => void;
    lastError?: ChromeRuntimeLastError;
}

interface ChromeAPI {
    runtime?: ChromeRuntime;
}

declare global {
    interface Window {
        chrome?: ChromeAPI;
        __ADP_EXTENSION_ID__?: string;
        __ADP_EXTENSION_STORE_URL__?: string;
    }
}

// ====== 常量 ======

/**
 * ADP 浏览器助手扩展 ID。
 * 上线后替换为正式 ID，开发期间通过 window.__ADP_EXTENSION_ID__ 临时覆盖。
 * TODO: 待扩展上架 Chrome 商店后替换为正式 ID。
 */
const DEFAULT_EXTENSION_ID = 'phfagghlmbjhmhckjnpnlcmiaecgkbfj';

/**
 * Chrome 应用商店地址。
 * TODO: 待扩展上架 Chrome 商店后替换为正式地址。
 */
const DEFAULT_CHROME_STORE_URL = 'https://chromewebstore.google.com/detail/adp-browser-assistant/phfagghlmbjhmhckjnpnlcmiaecgkbfj';

/** "ADP 浏览器助手" 连接器在后台的 plugin_id 列表（plugin_id 上架后稳定不变）。 */
export const BROWSER_ASSISTANT_PLUGIN_IDS = ['2726aa4b-b80f-4a97-bc43-1445856b3cf3'];

/** "ADP 浏览器助手" 连接器名称（兜底匹配）。 */
export const BROWSER_ASSISTANT_NAMES = ['ADP浏览器助手', 'ADP 浏览器助手'];

/** 同步 token 时目标 header 的参数名。 */
export const TOKEN_HEADER_NAME = 'Authorization';

// ====== 类型 ======

/** detectExtension 失败原因 */
export type DetectExtensionFailReason =
    | 'no-chrome'           // 非 Chromium 内核（Edge/Firefox/Safari 等）
    | 'no-runtime'          // Chrome 内核但页面未注入 chrome.runtime.sendMessage（通常意味着扩展未安装或未声明 externally_connectable）
    | 'no-extension-id'     // 扩展 ID 未配置
    | 'timeout'             // 通信超时
    | 'no-response'         // 扩展不存在/被禁用，runtime.lastError
    | 'invalid-response'    // 扩展未按协议响应
    | 'error'               // 其它异常
    | 'unknown';

/** 探测扩展返回结果 */
export interface DetectExtensionResult {
    installed: boolean;
    token: string;
    hubState?: string;
    host?: string;
    port?: number;
    version?: string;
    reason?: DetectExtensionFailReason;
}

interface SendToExtensionInternalResult {
    ok?: boolean;
    reason?: DetectExtensionFailReason;
    message?: string;
    [key: string]: unknown;
}

// ====== 配置访问 ======

/** 获取扩展 ID（优先取 window.__ADP_EXTENSION_ID__）。 */
export function getExtensionId(): string {
    if (typeof window !== 'undefined' && window.__ADP_EXTENSION_ID__) {
        return String(window.__ADP_EXTENSION_ID__);
    }
    return DEFAULT_EXTENSION_ID;
}

/** 获取 Chrome 应用商店地址（优先取 window.__ADP_EXTENSION_STORE_URL__）。 */
export function getChromeStoreUrl(): string {
    if (typeof window !== 'undefined' && window.__ADP_EXTENSION_STORE_URL__) {
        return String(window.__ADP_EXTENSION_STORE_URL__);
    }
    return DEFAULT_CHROME_STORE_URL;
}

// ====== 浏览器能力 / 通信 ======

/**
 * 探测当前环境的扩展通信能力。
 *
 * 注意：`chrome.runtime.sendMessage` 在普通页面默认 **不存在**。
 * 仅当扩展在 manifest 中通过 `externally_connectable.matches` 显式允许当前域名、
 * 且扩展已安装并启用时，浏览器才会向页面注入 `chrome.runtime.sendMessage`。
 *
 * 因此本函数返回更细的 reason，而不是把所有失败合并到 'no-chrome'：
 *   - ok=true：可以调用扩展
 *   - 'no-chrome'：非 Chromium 内核（Edge/Firefox/Safari 等）
 *   - 'no-runtime'：Chrome 内核但页面未注入 sendMessage（通常意味着扩展未安装或未在
 *                   externally_connectable 中包含本站点）
 */
function probeExtensionRuntime(): { ok: true } | { ok: false; reason: DetectExtensionFailReason } {
    if (typeof window === 'undefined') {
        return { ok: false, reason: 'no-chrome' };
    }
    if (!isChromeBrowser()) {
        return { ok: false, reason: 'no-chrome' };
    }
    const chromeApi = window.chrome;
    if (!chromeApi || !chromeApi.runtime || typeof chromeApi.runtime.sendMessage !== 'function') {
        return { ok: false, reason: 'no-runtime' };
    }
    return { ok: true };
}

/**
 * 调用扩展的某个消息接口；当扩展未安装/ID 错误/超时时统一以 { ok: false, reason } resolve。
 */
function sendToExtension(
    type: string,
    payload: Record<string, unknown> = {},
    timeoutMs = 800,
): Promise<SendToExtensionInternalResult> {
    return new Promise((resolve) => {
        const probe = probeExtensionRuntime();
        if (!probe.ok) {
            resolve({ ok: false, reason: probe.reason });
            return;
        }
        const extensionId = getExtensionId();
        if (!extensionId) {
            resolve({ ok: false, reason: 'no-extension-id' });
            return;
        }
        let settled = false;
        const finish = (result: SendToExtensionInternalResult) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            resolve(result);
        };
        const timer = setTimeout(() => {
            finish({ ok: false, reason: 'timeout' });
        }, timeoutMs);
        try {
            window.chrome!.runtime!.sendMessage!(
                extensionId,
                { type, ...payload },
                (resp: unknown) => {
                    const lastError = window.chrome?.runtime?.lastError;
                    if (lastError) {
                        finish({ ok: false, reason: 'no-response', message: lastError.message });
                        return;
                    }
                    if (!resp || typeof resp !== 'object') {
                        finish({ ok: false, reason: 'invalid-response' });
                        return;
                    }
                    finish(resp as SendToExtensionInternalResult);
                },
            );
        } catch (e) {
            finish({ ok: false, reason: 'error', message: (e as Error)?.message });
        }
    });
}

/**
 * 探测扩展并拉取会话凭证。调用扩展的 GET_SESSION_TOKEN 接口（见 tde-bridge.ts）。
 */
export async function detectExtension(timeoutMs = 800): Promise<DetectExtensionResult> {
    const resp = await sendToExtension('GET_SESSION_TOKEN', {}, timeoutMs);
    if (!resp || resp.ok !== true) {
        return {
            installed: false,
            token: '',
            reason: (resp && resp.reason) || 'unknown',
        };
    }
    return {
        installed: true,
        token: (resp.token as string) || '',
        hubState: resp.hubState as string | undefined,
        host: resp.host as string | undefined,
        port: resp.port as number | undefined,
        version: resp.version as string | undefined,
    };
}

/** 仅获取 token（封装 detectExtension）；失败返回空字符串。 */
export async function getSessionToken(timeoutMs = 800): Promise<string> {
    const result = await detectExtension(timeoutMs);
    return result.installed ? (result.token || '') : '';
}

// ====== 浏览器/连接器识别 ======

/**
 * 判断当前是否为 Chrome / Chromium 内核浏览器（排除 Edge / Opera / Firefox / Safari）。
 * 该扩展仅支持 Chrome 应用商店安装，因此非 Chrome 浏览器不应展示该连接器。
 */
export function isChromeBrowser(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
    if (!window.chrome) return false;
    const ua = navigator.userAgent || '';
    if (/Edg\//i.test(ua) || /Edge\//i.test(ua) || /OPR\//i.test(ua) || /Opera/i.test(ua)) {
        return false;
    }
    return /Chrome\//i.test(ua);
}

/**
 * 判断一个 connector / tool 项是否为"ADP 浏览器助手"。
 * 优先按 plugin_id 匹配，名称作为兜底；兼容多种字段命名。
 */
export function isBrowserAssistantConnector(item: Record<string, unknown> | null | undefined): boolean {
    if (!item) return false;
    const pluginId = (item.pluginId || item.plugin_id || item.PluginId || item.id) as string | undefined;
    if (pluginId && BROWSER_ASSISTANT_PLUGIN_IDS.includes(pluginId)) {
        return true;
    }
    const name = (item.name || item.Name || item.plugin_name || item.PluginName || '') as string;
    return BROWSER_ASSISTANT_NAMES.includes(name);
}

/**
 * 在 headers 列表中找到 Authorization 项，返回索引；找不到返回 -1。
 * 兼容 PascalCase 与 snake_case。
 */
export function findTokenHeaderIndex(headers: unknown): number {
    if (!Array.isArray(headers)) return -1;
    return (headers as Array<Record<string, unknown>>).findIndex((h) => {
        const name = (h && (h.param_name || h.ParamName)) || '';
        return name === TOKEN_HEADER_NAME;
    });
}
