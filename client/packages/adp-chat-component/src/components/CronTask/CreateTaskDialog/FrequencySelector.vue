<template>
    <div class="cron-frequency-selector">
        <div class="cron-frequency-selector__label">
            {{ i18n.frequencyLabel }}
            <span class="cron-frequency-selector__required">*</span>
        </div>

        <!-- Tab 切换 -->
        <div class="cron-frequency-selector__tabs-row">
            <t-radio-group v-model="activeTab" variant="default-filled" class="cron-frequency-selector__tabs">
                <t-radio-button v-for="tab in frequencyTabs" :key="tab.value" :value="tab.value">
                    {{ tab.label }}
                </t-radio-button>
            </t-radio-group>
        </div>

        <!-- 每天 -->
        <div v-if="activeTab === 'daily'" class="cron-frequency-selector__content">
            <t-time-picker
                :key="`daily-time-${timePickerKey}`"
                v-model="dailyTime"
                :allow-input="false"
                :placeholder="i18n.timeLabel"
                format="HH:mm"
            />
        </div>

        <!-- 每周 -->
        <div v-if="activeTab === 'weekly'" class="cron-frequency-selector__content">
            <div class="cron-frequency-selector__row">
                <t-select
                    v-model="selectedWeekDays"
                    :options="weekDayOptions"
                    multiple
                    :placeholder="i18n.weekdaysLabel"
                    class="cron-frequency-selector__weekdays"
                />
                <t-time-picker
                    :key="`weekly-time-${timePickerKey}`"
                    v-model="weeklyTime"
                    :allow-input="false"
                    :placeholder="i18n.timeLabel"
                    format="HH:mm"
                />
            </div>
        </div>

        <!-- 间隔 -->
        <div v-if="activeTab === 'interval'" class="cron-frequency-selector__content">
            <div class="cron-frequency-selector__row cron-frequency-selector__row--wrap">
                <span class="cron-frequency-selector__inline-label">{{ extraI18n.freqIntervalFromLabel }}</span>
                <t-date-picker
                    :key="`interval-date-${datePickerKey}`"
                    v-model="startDate"
                    mode="date"
                    format="YYYY-MM-DD"
                    value-type="YYYY-MM-DD"
                    :placeholder="i18n.timeLabel"
                />
                <t-time-picker
                    :key="`interval-time-${timePickerKey}`"
                    v-model="startTime"
                    :allow-input="false"
                    format="HH:mm"
                    :placeholder="i18n.timeLabel"
                />
                <span class="cron-frequency-selector__inline-label">{{ extraI18n.freqIntervalStartEvery }}</span>
                <t-input-number
                    v-model="intervalValue"
                    :min="1"
                    :max="9999"
                    theme="column"
                    class="cron-frequency-selector__number"
                />
                <span class="cron-frequency-selector__inline-label">{{ extraI18n.hourLabel }}</span>
            </div>
        </div>

        <!-- 单次 -->
        <div v-if="activeTab === 'once'" class="cron-frequency-selector__content">
            <div class="cron-frequency-selector__row">
                <t-date-picker
                    style="width: 150px;"
                    :key="`once-date-${datePickerKey}`"
                    v-model="onceDate"
                    mode="date"
                    format="YYYY-MM-DD"
                    value-type="YYYY-MM-DD"
                    :placeholder="i18n.timeLabel"
                />
                <t-time-picker
                    style="width: 100px;"
                    :key="`once-time-${timePickerKey}`"
                    v-model="onceTime"
                    :allow-input="false"
                    format="HH:mm"
                    :placeholder="i18n.timeLabel"
                />
            </div>
        </div>

        <!-- Cron -->
        <div v-if="activeTab === 'cron'" class="cron-frequency-selector__content">
            <t-input
                v-model="cronExpression"
                :placeholder="i18n.cronPlaceholder"
                @blur="onCronBlur"
            />
            <div
                v-if="cronError"
                class="cron-frequency-selector__cron-hint cron-frequency-selector__cron-hint--error"
            >
                {{ cronError }}
            </div>
            <div
                v-else
                class="cron-frequency-selector__cron-hint"
                :class="{ 'cron-frequency-selector__cron-hint--desc': !!cronDescription }"
            >
                {{ cronDescription || i18n.cronPlaceholder }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
    RadioGroup as TRadioGroup,
    RadioButton as TRadioButton,
    Select as TSelect,
    TimePicker as TTimePicker,
    DatePicker as TDatePicker,
    InputNumber as TInputNumber,
    Input as TInput,
} from 'tdesign-vue-next';
import type { CronTaskI18n } from '../../../model/cronTask';
import { getCronTaskI18nByLanguage } from '../../../model/cronTask';

type FrequencyTab = 'daily' | 'weekly' | 'interval' | 'once' | 'cron';

interface Props {
    language?: string;
    i18n?: Partial<CronTaskI18n> & Record<string, string | string[]>;
}

const props = withDefaults(defineProps<Props>(), {
    language: 'zh-CN',
    i18n: () => ({}),
});

// 扩展 i18n（本组件需要一些额外文案）
const extraI18n = computed(() => {
    const isEn = (props.language || '').startsWith('en');
    return isEn
        ? {
              freqIntervalFromLabel: 'From',
              freqIntervalStartEvery: 'starts, every',
              hourLabel: 'hour(s)',
              cronDescExecute: (date: string, time: string) => `${date}${time} execute`,
              cronDescEveryday: 'Every day',
              cronDescMonthDay: (m: string, d: string) => `${m}/${d}`,
              cronDescMonth: (m: string) => `Month ${m}`,
              cronDescEveryMonthDay: (d: string) => `Day ${d} of each month`,
              cronDescWeekdays: 'Weekday',
              cronDescEveryWeek: (days: string) => `Every ${days}`,
              cronDescEveryMinute: 'every minute',
              cronDescEveryHourAt: (min: number) => ` at :${String(min).padStart(2, '0')} of each hour`,
              cronDescHourEveryMinute: (h: string) => ` at ${h}:xx every minute`,
              cronDescEveryNMinute: (n: string) => `every ${n} minutes`,
              cronDescEveryNHour: (n: string) => `every ${n} hours`,
              weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
              validateCronRequired: 'Please enter cron expression',
              validateCronInvalid: 'Invalid cron expression, e.g. 0 18 * * *',
              validateDaily: 'Please select execution time',
              validateOnceDate: 'Please select execution date',
              validateOnceTime: 'Please select execution time',
              validateOnceFuture: 'Execution time must be in the future',
              validateWeeklyDays: 'Please select weekdays',
              validateIntervalStartDate: 'Please select start date',
              validateIntervalStartTime: 'Please select start time',
              validateIntervalValue: 'Please enter interval hours',
          }
        : {
              freqIntervalFromLabel: '从',
              freqIntervalStartEvery: '开始，每',
              hourLabel: '小时',
              cronDescExecute: (date: string, time: string) => `${date}${time}执行`,
              cronDescEveryday: '每天',
              cronDescMonthDay: (m: string, d: string) => `${m} 月 ${d} 日`,
              cronDescMonth: (m: string) => `${m} 月`,
              cronDescEveryMonthDay: (d: string) => `每月 ${d} 日`,
              cronDescWeekdays: '周',
              cronDescEveryWeek: (days: string) => `每周 ${days}`,
              cronDescEveryMinute: '每分钟',
              cronDescEveryHourAt: (min: number) => ` 每小时的第 ${min} 分 `,
              cronDescHourEveryMinute: (h: string) => ` ${h} 时 每分钟 `,
              cronDescEveryNMinute: (n: string) => `每 ${n} 分钟`,
              cronDescEveryNHour: (n: string) => `每 ${n} 小时`,
              weekdays: ['日', '一', '二', '三', '四', '五', '六'],
              validateCronRequired: '请输入 Cron 表达式',
              validateCronInvalid: 'Cron 表达式格式错误，请按 "分 时 日 月 周" 格式填写，如 0 18 * * *',
              validateDaily: '请选择执行时间',
              validateOnceDate: '请选择执行日期',
              validateOnceTime: '请选择执行时间',
              validateOnceFuture: '执行时间需晚于当前时间',
              validateWeeklyDays: '请选择执行的星期',
              validateIntervalStartDate: '请选择开始日期',
              validateIntervalStartTime: '请选择开始时间',
              validateIntervalValue: '请输入间隔小时数',
          };
});

const i18n = computed<Required<CronTaskI18n>>(() => ({
    ...getCronTaskI18nByLanguage(props.language),
    ...(props.i18n as Partial<CronTaskI18n>),
}));

// ============================================================
// 状态
// ============================================================
const activeTab = ref<FrequencyTab>('daily');
// 提交给后端时使用的固定时区（UI 已隐藏时区选择）
const DEFAULT_TIMEZONE = 'Asia/Shanghai';
// 每天
const dailyTime = ref<string>('');
// 每周
const selectedWeekDays = ref<number[]>([1]);
const weeklyTime = ref<string>('');
// 间隔
const startDate = ref<string>('');
const startTime = ref<string>('');
const intervalValue = ref<number>(1);
// 单次
const onceDate = ref<string>(_getDefaultDate());
const onceTime = ref<string>('');
// Cron
const cronExpression = ref<string>('');
const cronDescription = ref<string>('');
const cronError = ref<string>('');

let skipClearOnTabChange = false;
const timePickerKey = ref(0);
const datePickerKey = ref(0);

// ============================================================
// 选项
// ============================================================
const frequencyTabs = computed(() => [
    { label: i18n.value.freqDaily, value: 'daily' },
    { label: i18n.value.freqWeekly, value: 'weekly' },
    { label: i18n.value.freqInterval, value: 'interval' },
    { label: i18n.value.freqOnce, value: 'once' },
    { label: 'Cron', value: 'cron' },
]);

const weekDayOptions = computed(() => {
    const wd = extraI18n.value.weekdays as string[];
    return [
        { label: wd[1], value: 1 },
        { label: wd[2], value: 2 },
        { label: wd[3], value: 3 },
        { label: wd[4], value: 4 },
        { label: wd[5], value: 5 },
        { label: wd[6], value: 6 },
        { label: wd[0], value: 0 },
    ];
});

// ============================================================
// 工具
// ============================================================
function _getDefaultDate(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function _formatTime(v: unknown): string {
    if (v === null || v === undefined || v === '') return '';
    if (Array.isArray(v)) return v.length ? _formatTime(v[0]) : '';
    if (v instanceof Date) {
        if (isNaN(v.getTime())) return '';
        return `${String(v.getHours()).padStart(2, '0')}:${String(v.getMinutes()).padStart(2, '0')}`;
    }
    const str = String(v);
    const m = str.match(/(\d{1,2}):(\d{2})/);
    if (m) return `${m[1]!.padStart(2, '0')}:${m[2]}`;
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
    return '';
}

function _formatDate(v: unknown): string {
    if (v === null || v === undefined || v === '') return '';
    if (Array.isArray(v)) return v.length ? _formatDate(v[0]) : '';
    if (v instanceof Date) {
        if (isNaN(v.getTime())) return '';
        return `${v.getFullYear()}-${String(v.getMonth() + 1).padStart(2, '0')}-${String(v.getDate()).padStart(2, '0')}`;
    }
    const str = String(v);
    const m = str.match(/^(\d{4}-\d{2}-\d{2})/);
    if (m) return m[1]!;
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
    return '';
}

function _parseTime(timeStr: string): { hour: number; minute: number } {
    const normalized = _formatTime(timeStr) || '18:00';
    const [hour = 0, minute = 0] = normalized.split(':').map(Number);
    return { hour, minute };
}

// ============================================================
// Cron 校验
// ============================================================
function _isValidCronField(field: string, min: number, max: number): boolean {
    if (field === '*') return true;
    const parts = field.split(',');
    for (const item of parts) {
        if (!item) return false;
        let rangePart = item;
        if (item.indexOf('/') >= 0) {
            const segs = item.split('/');
            if (segs.length !== 2) return false;
            rangePart = segs[0]!;
            if (!/^\d+$/.test(segs[1]!) || Number(segs[1]) <= 0) return false;
        }
        if (rangePart === '*') continue;
        if (rangePart.indexOf('-') >= 0) {
            const [a = '', b = ''] = rangePart.split('-');
            if (!/^\d+$/.test(a) || !/^\d+$/.test(b)) return false;
            const na = Number(a);
            const nb = Number(b);
            if (na < min || nb > max || na > nb) return false;
        } else {
            if (!/^\d+$/.test(rangePart)) return false;
            const n = Number(rangePart);
            if (n < min || n > max) return false;
        }
    }
    return true;
}

function _isValidCronExpression(expr: string): boolean {
    if (!expr) return false;
    const fields = expr.trim().split(/\s+/);
    if (fields.length !== 5) return false;
    const ranges: Array<[number, number]> = [
        [0, 59],
        [0, 23],
        [1, 31],
        [1, 12],
        [0, 7],
    ];
    return fields.every((f, i) => _isValidCronField(f, ranges[i]![0], ranges[i]![1]));
}

function _describeCronTime(minute: string, hour: string): string {
    if (/^\d+$/.test(minute) && /^\d+$/.test(hour)) {
        const h = String(Number(hour)).padStart(2, '0');
        const m = String(Number(minute)).padStart(2, '0');
        return ` ${h}:${m} `;
    }
    if (minute === '*' && hour === '*') return extraI18n.value.cronDescEveryMinute as string;
    if (/^\d+$/.test(minute) && hour === '*')
        return (extraI18n.value.cronDescEveryHourAt as (n: number) => string)(Number(minute));
    if (minute === '*' && /^\d+$/.test(hour))
        return (extraI18n.value.cronDescHourEveryMinute as (h: string) => string)(String(Number(hour)).padStart(2, '0'));
    if (/^\*\/\d+$/.test(minute) && hour === '*')
        return (extraI18n.value.cronDescEveryNMinute as (n: string) => string)(minute.split('/')[1]!);
    if (minute === '0' && /^\*\/\d+$/.test(hour))
        return (extraI18n.value.cronDescEveryNHour as (n: string) => string)(hour.split('/')[1]!);
    return ` ${hour}:${minute} `;
}

function _describeCronDate(dom: string, month: string, dow: string): string {
    if (dom === '*' && month === '*' && dow === '*') return extraI18n.value.cronDescEveryday as string;
    const parts: string[] = [];
    if (month !== '*' && dom !== '*') {
        parts.push((extraI18n.value.cronDescMonthDay as (m: string, d: string) => string)(month, dom));
    } else if (month !== '*' && dom === '*') {
        parts.push((extraI18n.value.cronDescMonth as (m: string) => string)(month));
    } else if (month === '*' && dom !== '*') {
        parts.push((extraI18n.value.cronDescEveryMonthDay as (d: string) => string)(dom));
    }
    if (dow !== '*') {
        const wd = extraI18n.value.weekdays as string[];
        const days = dow
            .split(',')
            .map((d) => (wd[Number(d) % 7] ?? d))
            .join('、');
        if (parts.length > 0) {
            parts.push(days);
        } else {
            parts.push((extraI18n.value.cronDescEveryWeek as (d: string) => string)(days));
        }
    }
    return parts.length ? parts.join('，') : `d${dom} m${month} w${dow}`;
}

function _describeCron(expr: string): string {
    const [minute = '', hour = '', dom = '', month = '', dow = ''] = expr.trim().split(/\s+/);
    const time = _describeCronTime(minute, hour);
    const date = _describeCronDate(dom, month, dow);
    return (extraI18n.value.cronDescExecute as (d: string, t: string) => string)(date, time);
}

function onCronBlur() {
    const expr = (cronExpression.value || '').trim();
    if (!expr) {
        cronDescription.value = '';
        cronError.value = '';
        return;
    }
    if (_isValidCronExpression(expr)) {
        cronDescription.value = _describeCron(expr);
        cronError.value = '';
    } else {
        cronDescription.value = '';
        cronError.value = extraI18n.value.validateCronInvalid as string;
    }
}

// 输入变化时清空描述/错误
watch(cronExpression, () => {
    if (cronDescription.value) cronDescription.value = '';
    if (cronError.value) cronError.value = '';
});

// 切换 tab 时清空当前 tab 时间值
watch(activeTab, (val) => {
    if (skipClearOnTabChange) {
        skipClearOnTabChange = false;
        return;
    }
    timePickerKey.value += 1;
    switch (val) {
        case 'daily':
            dailyTime.value = '';
            break;
        case 'weekly':
            weeklyTime.value = '';
            break;
        case 'interval':
            startDate.value = '';
            startTime.value = '';
            break;
        case 'once':
            onceTime.value = '';
            break;
    }
});

// ============================================================
// 对外方法
// ============================================================

function _timeOfDayFromHM(hm: string): { Hour: number; Minute: number } {
    const { hour, minute } = _parseTime(hm);
    return { Hour: hour, Minute: minute };
}

/** 组装 TimerScheduleConfig，供父组件调用 */
function getFormData(): {
    type: FrequencyTab;
    timezone: string;
    cron?: string;
    weekDays?: number[];
    startDate?: string;
    startTime?: string;
    intervalValue?: number;
    date?: string;
    time?: string;
    display?: string;
} {
    const base = { timezone: DEFAULT_TIMEZONE };
    switch (activeTab.value) {
        case 'daily': {
            const t = _formatTime(dailyTime.value) || '09:00';
            const { hour, minute } = _parseTime(t);
            return { ...base, type: 'daily', cron: `${minute} ${hour} * * *`, display: t };
        }
        case 'weekly': {
            const t = _formatTime(weeklyTime.value) || '09:00';
            const { hour, minute } = _parseTime(t);
            return {
                ...base,
                type: 'weekly',
                cron: `${minute} ${hour} * * ${[...selectedWeekDays.value].sort().join(',')}`,
                weekDays: [...selectedWeekDays.value],
                display: t,
            };
        }
        case 'interval': {
            return {
                ...base,
                type: 'interval',
                startDate: _formatDate(startDate.value),
                startTime: _formatTime(startTime.value),
                intervalValue: intervalValue.value,
                display: `${_formatDate(startDate.value)} ${_formatTime(startTime.value)}`,
            };
        }
        case 'once': {
            return {
                ...base,
                type: 'once',
                date: _formatDate(onceDate.value),
                time: _formatTime(onceTime.value),
                display: `${_formatDate(onceDate.value)} ${_formatTime(onceTime.value)}`,
            };
        }
        case 'cron': {
            return { ...base, type: 'cron', cron: cronExpression.value, display: cronExpression.value };
        }
        default:
            return { ...base, type: 'daily', cron: '0 18 * * *' };
    }
}

/** 编辑回填 */
function setFormData(schedule: any) {
    if (!schedule || typeof schedule !== 'object') return;
    skipClearOnTabChange = true;
    // 时区选择已移除，不再回填

    const type = schedule.schedule_type ?? schedule.ScheduleType;
    const daily = schedule.daily ?? schedule.Daily;
    const weekly = schedule.weekly ?? schedule.Weekly;
    const interval = schedule.interval ?? schedule.Interval;
    const once = schedule.once ?? schedule.Once;
    const cron = schedule.cron ?? schedule.Cron;

    switch (type) {
        case 2: // DAILY
            activeTab.value = 'daily';
            dailyTime.value = (daily && (daily.time_of_day ?? daily.TimeOfDay)) || '09:00';
            break;
        case 3: {
            // WEEKLY
            activeTab.value = 'weekly';
            const times = (weekly && (weekly.times ?? weekly.Times)) || [];
            if (times.length) {
                selectedWeekDays.value = times.map((t: any) => {
                    const w = t.weekday ?? t.Weekday;
                    return w === 7 ? 0 : w;
                });
                weeklyTime.value = (times[0].time_of_day ?? times[0].TimeOfDay) || '09:00';
            }
            break;
        }
        case 4: {
            // INTERVAL
            activeTab.value = 'interval';
            const itv = interval || {};
            intervalValue.value = (itv.value ?? itv.Value) || 1;
            const startAt = itv.start_at ?? itv.StartAt;
            if (startAt) {
                datePickerKey.value += 1;
                timePickerKey.value += 1;
                startDate.value = _formatDate(startAt) || _getDefaultDate();
                startTime.value = _formatTime(startAt) || '09:00';
            }
            break;
        }
        case 5: {
            // ONCE
            activeTab.value = 'once';
            const fire = once && (once.fire_time ?? once.FireTime);
            if (fire) {
                datePickerKey.value += 1;
                timePickerKey.value += 1;
                onceDate.value = _formatDate(fire) || _getDefaultDate();
                onceTime.value = _formatTime(fire) || '09:00';
            }
            break;
        }
        case 6:
            activeTab.value = 'cron';
            cronExpression.value = (cron && (cron.expression ?? cron.Expression)) || '';
            cronDescription.value = _isValidCronExpression(cronExpression.value)
                ? _describeCron(cronExpression.value)
                : '';
            cronError.value = '';
            break;
        default:
            break;
    }
}

/** 校验 */
function validate(): { valid: boolean; message?: string } {
    if (activeTab.value === 'cron') {
        const expr = (cronExpression.value || '').trim();
        if (!expr) return { valid: false, message: extraI18n.value.validateCronRequired as string };
        if (!_isValidCronExpression(expr))
            return { valid: false, message: extraI18n.value.validateCronInvalid as string };
    }
    if (activeTab.value === 'daily' && !_formatTime(dailyTime.value)) {
        return { valid: false, message: extraI18n.value.validateDaily as string };
    }
    if (activeTab.value === 'once') {
        const d = _formatDate(onceDate.value);
        const t = _formatTime(onceTime.value);
        if (!d) return { valid: false, message: extraI18n.value.validateOnceDate as string };
        if (!t) return { valid: false, message: extraI18n.value.validateOnceTime as string };
        const target = new Date(`${d}T${t}:00`);
        if (isNaN(target.getTime()) || target.getTime() <= Date.now()) {
            return { valid: false, message: extraI18n.value.validateOnceFuture as string };
        }
    }
    if (activeTab.value === 'weekly') {
        if (!selectedWeekDays.value.length)
            return { valid: false, message: extraI18n.value.validateWeeklyDays as string };
        if (!_formatTime(weeklyTime.value))
            return { valid: false, message: extraI18n.value.validateDaily as string };
    }
    if (activeTab.value === 'interval') {
        const d = _formatDate(startDate.value);
        const t = _formatTime(startTime.value);
        if (!d) return { valid: false, message: extraI18n.value.validateIntervalStartDate as string };
        if (!t) return { valid: false, message: extraI18n.value.validateIntervalStartTime as string };
        if (!intervalValue.value || intervalValue.value < 1)
            return { valid: false, message: extraI18n.value.validateIntervalValue as string };
    }
    return { valid: true };
}

/** 重置 */
function resetForm() {
    skipClearOnTabChange = true;
    activeTab.value = 'daily';
    dailyTime.value = '';
    selectedWeekDays.value = [1];
    weeklyTime.value = '';
    startDate.value = '';
    startTime.value = '';
    intervalValue.value = 1;
    onceDate.value = _getDefaultDate();
    onceTime.value = '';
    cronExpression.value = '';
    cronDescription.value = '';
    cronError.value = '';
    timePickerKey.value += 1;
    datePickerKey.value += 1;
}

defineExpose({ validate, getFormData, setFormData, resetForm });
</script>

<style scoped>
.cron-frequency-selector {
    display: flex;
    flex-direction: column;
    gap: var(--td-size-4);
}

.cron-frequency-selector__label {
    font-size: var(--td-font-size-body-medium);
    font-weight: 500;
    color: var(--td-text-color-primary);
    line-height: var(--td-line-height-body-medium);
}

.cron-frequency-selector__required {
    color: var(--td-error-color, #e54545);
    margin-left: var(--td-size-1);
}

.cron-frequency-selector__tabs-row {
    display: flex;
    align-items: center;
    gap: var(--td-size-5);
    flex-wrap: wrap;
}

.cron-frequency-selector__tabs {
    width: fit-content;
}

.cron-frequency-selector__content {
    margin-top: var(--td-size-2);
    display: flex;
    flex-direction: column;
    gap: var(--td-size-4);
}

.cron-frequency-selector__row {
    display: flex;
    align-items: center;
    gap: var(--td-size-4);
}

.cron-frequency-selector__row--wrap {
    flex-wrap: wrap;
}

.cron-frequency-selector__weekdays {
    flex: 1;
    min-width: 200px;
}

.cron-frequency-selector__inline-label {
    font-size: var(--td-font-size-body-medium);
    color: var(--td-text-color-primary);
    white-space: nowrap;
}

.cron-frequency-selector__number {
    width: 100px;
}

.cron-frequency-selector__cron-hint {
    font-size: var(--td-font-size-body-small);
    color: var(--td-text-color-placeholder);
    line-height: var(--td-line-height-body-small);
}

.cron-frequency-selector__cron-hint--desc {
    color: var(--td-brand-color, #0052d9);
}

.cron-frequency-selector__cron-hint--error {
    color: var(--td-error-color, #e54545);
    font-size: var(--td-font-size-body-small);
    line-height: var(--td-line-height-body-small);
}
</style>
