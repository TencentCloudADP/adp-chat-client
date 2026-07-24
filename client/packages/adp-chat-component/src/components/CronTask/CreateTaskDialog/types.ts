/**
 * CreateTaskDialog 组件的对外类型定义
 *
 * 抽成独立 .ts 文件的原因：
 *   vite-plugin-dts (vue-tsc) 在生成 SFC 的 .d.ts 时，即使源码里已经
 *   `export interface`，某些场景下（如同一文件多个 export interface、
 *   双 script 块合并）依然会把这些类型误判为「private name」，
 *   触发 TS4082 「Default export of the module has or is using private name」。
 *   放在独立 .ts 模块中则完全绕开 SFC transform，是最稳定的方式。
 */
import type { CronTaskI18n, TimerTask, TimerTaskSummary } from '../../../model/cronTask';

export interface Option {
    label: string;
    value: string;
}

export interface Props {
    visible: boolean;
    editingTask?: TimerTaskSummary | TimerTask | null;
    applicationId: string;
    spaceId?: string;
    language?: string;
    i18n?: Partial<CronTaskI18n>;
    modelOptions?: Option[];
    folderOptions?: Option[];
}
