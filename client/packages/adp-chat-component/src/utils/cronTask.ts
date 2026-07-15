/**
 * CronTask 相关工具函数
 * - 后端返回字段兼容 snake_case / PascalCase 两种命名
 * - 相对时间格式化，无 dayjs 依赖
 */

/** 从对象上以两种大小写取值，snake_case 优先 */
export function pickField<T = unknown>(obj: any, snake: string, pascal: string): T | undefined {
    if (!obj || typeof obj !== 'object') return undefined;
    if (obj[snake] !== undefined) return obj[snake] as T;
    if (obj[pascal] !== undefined) return obj[pascal] as T;
    return undefined;
}

/** 获取 task 中的 profile（兼容 profile / Profile） */
export function getProfile(task: any): any {
    return pickField<any>(task, 'profile', 'Profile') || {};
}

/** 获取 task 中的 status 对象（TimerStatus） */
export function getStatusObj(task: any): any {
    return pickField<any>(task, 'status', 'Status') || {};
}

/** 获取 task 中的 config */
export function getConfig(task: any): any {
    return pickField<any>(task, 'config', 'Config') || {};
}

/** 获取 timer_id */
export function getTimerId(task: any): string {
    return (pickField<string>(task, 'timer_id', 'TimerId') || '') as string;
}

/** 获取 task_name */
export function getTaskName(task: any): string {
    // 顶层可能存在 task_name，也可能仅在 profile 内
    const top = pickField<string>(task, 'task_name', 'TaskName');
    if (top) return top;
    const p = getProfile(task);
    return (pickField<string>(p, 'task_name', 'TaskName') || '') as string;
}

/** 获取 prompt_content */
export function getPromptContent(task: any): string {
    const p = getProfile(task);
    return (pickField<string>(p, 'prompt_content', 'PromptContent') || '') as string;
}

/** 获取 description */
export function getDescription(task: any): string {
    const p = getProfile(task);
    return (pickField<string>(p, 'description', 'Description') || '') as string;
}

/** 获取 policy_summary */
export function getPolicySummary(task: any): string {
    const top = pickField<string>(task, 'policy_summary', 'PolicySummary');
    if (top) return top;
    const s = getStatusObj(task);
    return (pickField<string>(s, 'policy_summary', 'PolicySummary') || '') as string;
}

/** 获取任务 status 枚举（1-active / 2-paused / 3-completed） */
export function getTaskStatus(task: any): number {
    const s = getStatusObj(task);
    return Number(pickField<number>(s, 'status', 'Status') || 0);
}

/** 获取成功次数 */
export function getSuccessCount(task: any): number {
    const s = getStatusObj(task);
    return Number(pickField<number>(s, 'success_count', 'SuccessCount') || 0);
}

/** 获取失败次数 */
export function getFailureCount(task: any): number {
    const s = getStatusObj(task);
    return Number(
        pickField<number>(s, 'failed_count', 'FailedCount') ??
        pickField<number>(s, 'failure_count', 'FailureCount') ?? 0
    );
}

/** 获取未读数 */
export function getUnreadCount(task: any): number {
    const s = getStatusObj(task);
    return Number(pickField<number>(s, 'unread_count', 'UnreadCount') || 0);
}

/** 获取下次运行时间戳 */
export function getNextRunAt(task: any): number | string | undefined {
    const s = getStatusObj(task);
    return pickField<number | string>(s, 'next_run_at', 'NextRunAt');
}

/** 获取上次运行时间戳 */
export function getLastRunAt(task: any): number | string | undefined {
    const s = getStatusObj(task);
    return pickField<number | string>(s, 'last_run_at', 'LastRunAt');
}

// ============================================================
// 时间格式化
// ============================================================

/**
 * 兼容秒级/毫秒级时间戳与 ISO 字符串
 * 返回 Date 对象或 null（无效时）
 */
export function toDate(input: number | string | undefined | null): Date | null {
    if (input === null || input === undefined || input === '') return null;
    let val: number | string = input;
    if (typeof val === 'string' && /^-?\d+$/.test(val)) {
        val = Number(val);
    }
    let d: Date;
    if (typeof val === 'number') {
        if (val <= 0) return null;
        d = new Date(val < 1e12 ? val * 1000 : val);
    } else {
        d = new Date(val);
    }
    return isNaN(d.getTime()) ? null : d;
}

function pad2(n: number): string {
    return n < 10 ? `0${n}` : String(n);
}

/** 格式化为 HH:mm */
export function formatHM(d: Date): string {
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** 格式化为 YYYY-MM-DD HH:mm */
export function formatDateTime(input: number | string | undefined | null): string {
    const d = toDate(input);
    if (!d) return '';
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** 是否为同一天 */
function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

/**
 * 相对时间格式化
 * - 今天：HH:mm
 * - 1~6 天内：{n}{daysAgo}
 * - 7 天以上：M/D
 */
export function formatRelativeTime(
    input: number | string | undefined | null,
    i18n?: { today?: string; daysAgo?: string },
): string {
    const target = toDate(input);
    if (!target) return '';
    const now = new Date();

    if (isSameDay(target, now)) {
        return formatHM(target);
    }
    // 天数差
    const nowMid = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const tgtMid = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
    const diffDays = Math.floor((nowMid - tgtMid) / (24 * 60 * 60 * 1000));
    if (diffDays >= 1 && diffDays <= 6) {
        const suffix = i18n?.daysAgo || '天前';
        return `${diffDays}${suffix}`;
    }
    return `${target.getMonth() + 1}/${target.getDate()}`;
}
