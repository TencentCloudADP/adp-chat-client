/**
 * Skills 状态管理 Composable
 * 管理已安装 Skills 列表的拉取、刷新、增删
 */
import { ref, computed, watch, type MaybeRefOrGetter, toValue } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import {
    fetchSkillCategories,
    fetchSkillSummaryList,
    fetchSkillDetail,
} from '../service/skillsApi';
import { useAgentStore } from './useAgentStore';
import type {
    AgentSkillInfo,
    SkillSummary,
    SkillCategory,
    NormalizedSkill,
    ManageSkillItem,
} from '../model/skills';
import { AgentSkillType } from '../model/skills';

/** useSkills 的参数 */
export interface UseSkillsOptions {
    /** 应用 ID（/adp/ 转发必须，支持响应式 getter） */
    applicationId?: MaybeRefOrGetter<string>;
    /** 空间 ID（支持响应式 getter） */
    spaceId?: MaybeRefOrGetter<string>;
    /** 项目路径 */
    projectPath?: string;
    /** API 路径覆盖 */
    apiPaths?: {
        globalAgentApi?: string;
        skillCategoriesApi?: string;
        skillSummaryListApi?: string;
        skillDetailApi?: string;
    };
}

/** 兼容两种字段命名，取 skill_id */
function getSkillId(s: AgentSkillInfo): string {
    return (s.skill_id || s.SkillId || '') as string;
}

/** 中文展示名：优先 display_name，缺失时回退技术名 / id */
function getSkillDisplayName(s: AgentSkillInfo): string {
    return (s.skill_display_name || s.SkillDisplayName || s.skill_name || s.SkillName || getSkillId(s) || '') as string;
}

/** 技术名（英文 name）：用于发送给大模型的 @skill:name 序列化 */
function getSkillTechnicalName(s: AgentSkillInfo): string {
    return (s.skill_name || s.SkillName || s.skill_display_name || s.SkillDisplayName || getSkillId(s) || '') as string;
}

function getSkillIconUrl(s: AgentSkillInfo): string {
    return (s.icon_url || s.IconUrl || '') as string;
}

function getSkillType(s: AgentSkillInfo): number {
    return (s.skill_type ?? s.SkillType ?? 0) as number;
}

export function normalizeSkill(item: AgentSkillInfo): NormalizedSkill {
    return {
        id: getSkillId(item),
        // name 为技术名（英文），用于序列化；displayName 为中文展示名，用于 UI
        name: getSkillTechnicalName(item),
        displayName: getSkillDisplayName(item),
        iconUrl: getSkillIconUrl(item),
        skillType: getSkillType(item),
        isPreset: getSkillType(item) === AgentSkillType.HUB_PRESET,
        notDeleteProtected: !!(item.is_delete_protected || item.IsDeleteProtected),
    };
}

export function normalizeManageItem(item: AgentSkillInfo): ManageSkillItem {
    return {
        id: getSkillId(item),
        name: getSkillDisplayName(item),
        desc: (item.skill_display_desc || item.SkillDisplayDescription || item.SkillDisplayDesc || item.skill_display_description || '') as string,
        icon: getSkillIconUrl(item),
        version: (item.current_version || item.CurrentVersion || '') as string,
        category: (item.category_name || item.CategoryName || '') as string,
        billingType: (item.billing_type || item.BillingType) as number,
        notDeleteProtected: !!(item.is_delete_protected || item.IsDeleteProtected),
        skillType: getSkillType(item),
    };
}

export function useSkills(options: UseSkillsOptions = {}) {
    // 使用 toValue 支持传入 getter 函数，实现响应式
    const applicationId = computed(() => toValue(options.applicationId) || '');
    const spaceId = computed(() => toValue(options.spaceId) || '');
    const projectPath = ref(options.projectPath || '');
    const apiPaths = options.apiPaths || {};

    // 从 useAgentStore 获取共享数据源和操作方法
    const {
        agentIdMap,
        agentDetailMap,
        refreshAgentCache,
        modifySkillList,
    } = useAgentStore();

    /** 已安装 Skills（从 store 缓存派生，全局共享） */
    const installedSkills = computed<AgentSkillInfo[]>(() =>
        (agentDetailMap.value[applicationId.value]?.skills || []) as AgentSkillInfo[]
    );
    const refreshing = ref(false);
    const error = ref<string | null>(null);
    /** 当前 agentId（从 store 缓存派生） */
    const agentId = computed<string>(() =>
        agentDetailMap.value[applicationId.value]?.agentId || agentIdMap.value[applicationId.value] || ''
    );

    const normalizedSkills = computed<NormalizedSkill[]>(() => {
        return installedSkills.value
            .filter((s) => !!getSkillDisplayName(s))
            .sort((a, b) => {
                const aPreset = getSkillType(a) === AgentSkillType.HUB_PRESET ? 1 : 0;
                const bPreset = getSkillType(b) === AgentSkillType.HUB_PRESET ? 1 : 0;
                return aPreset - bPreset;
            })
            .map(normalizeSkill);
    });

    const manageItems = computed<ManageSkillItem[]>(() => {
        return installedSkills.value
            .filter((s) => !!getSkillDisplayName(s))
            .sort((a, b) => {
                const aPreset = getSkillType(a) === AgentSkillType.HUB_PRESET ? 1 : 0;
                const bPreset = getSkillType(b) === AgentSkillType.HUB_PRESET ? 1 : 0;
                return aPreset - bPreset;
            })
            .map(normalizeManageItem);
    });

    const nonPresetCount = computed(() => {
        return installedSkills.value.filter(
            (s) => getSkillType(s) !== AgentSkillType.HUB_PRESET
        ).length;
    });

    const installedSkillIds = computed(() => {
        return new Set(installedSkills.value.map(getSkillId).filter(Boolean));
    });

    const presetIds = computed(() => {
        return installedSkills.value
            .filter((s) => getSkillType(s) === AgentSkillType.HUB_PRESET)
            .map(getSkillId)
            .filter(Boolean);
    });

    async function refreshSkills() {
        console.log('[useSkills] refreshSkills called, applicationId:', applicationId.value);
        if (!applicationId.value) {
            console.warn('[useSkills] refreshSkills skipped: applicationId is empty');
            return;
        }
        refreshing.value = true;
        error.value = null;
        try {
            await refreshAgentCache(applicationId.value);
        } catch (e: unknown) {
            console.error('[useSkills] refreshSkills error:', e);
            error.value = e instanceof Error ? e.message : '获取 Skills 数据失败';
        } finally {
            refreshing.value = false;
        }
    }

    // 当 applicationId 有值时自动刷新
    watch(
        applicationId,
        (appId) => {
            console.log('[useSkills] applicationId changed:', appId);
            if (appId && installedSkills.value.length === 0) {
                refreshSkills();
            }
        },
        { immediate: true }
    );

    async function getCategories(): Promise<SkillCategory[]> {
        if (!applicationId.value) return [];
        try {
            const result = await fetchSkillCategories(
                { applicationId: applicationId.value },
                apiPaths.skillCategoriesApi
            );
            return result.categories;
        } catch (e) {
            console.error('[useSkills] getCategories error:', e);
            return [];
        }
    }

    async function getSummaryList(params: {
        query?: string;
        filter_list?: Array<{ key: string; values: string[] }>;
        favorite_only?: boolean;
        page_size?: number;
        page_number?: number;
    }): Promise<{ skill_list: SkillSummary[]; total_count: number }> {
        if (!applicationId.value) return { skill_list: [], total_count: 0 };
        try {
            const result = await fetchSkillSummaryList(
                {
                    applicationId: applicationId.value,
                    space_id: spaceId.value,
                    ...params,
                },
                apiPaths.skillSummaryListApi
            );
            return {
                skill_list: result.skill_list as unknown as SkillSummary[],
                total_count: result.total_count,
            };
        } catch (e) {
            console.error('[useSkills] getSummaryList error:', e);
            return { skill_list: [], total_count: 0 };
        }
    }

    async function getDetail(skillId: string) {
        if (!applicationId.value) throw new Error('applicationId is required');
        return fetchSkillDetail(
            { applicationId: applicationId.value, skill_id: skillId, space_id: spaceId.value },
            apiPaths.skillDetailApi
        );
    }

    async function addSkill(skillConfig: {
        source: number;
        skill_id?: string;
        version_id?: string;
        name?: string;
        file_url?: string;
    }) {
        if (!applicationId.value) throw new Error('applicationId is required');
        if (!agentId.value) throw new Error('agentId is required');
        try {
            const existingSkills = installedSkills.value
                .filter((s) => !!getSkillId(s))
                .map((s) => ({ skillId: getSkillId(s) }));
            const mergedSkills = [
                ...existingSkills,
                { skillId: skillConfig.skill_id || '' },
            ];
            await modifySkillList(applicationId.value, mergedSkills.filter((s) => s.skillId));
            MessagePlugin.success('添加成功');
        } catch (e) {
            console.error('[useSkills] addSkill error:', e);
            MessagePlugin.error('添加失败');
            throw e;
        }
    }

    async function removeSkill(skillId: string) {
        if (!applicationId.value) throw new Error('applicationId is required');
        if (!agentId.value) throw new Error('agentId is required');
        try {
            const remainingSkills = installedSkills.value
                .filter((s) => getSkillId(s) !== skillId)
                .filter((s) => !!getSkillId(s))
                .map((s) => ({ skillId: getSkillId(s) }));
            await modifySkillList(applicationId.value, remainingSkills);
            MessagePlugin.success('已移除');
        } catch (e) {
            console.error('[useSkills] removeSkill error:', e);
            MessagePlugin.error('移除失败');
            await refreshSkills();
            throw e;
        }
    }

    return {
        applicationId,
        spaceId,
        projectPath,
        installedSkills,
        refreshing,
        error,
        agentId,
        normalizedSkills,
        manageItems,
        nonPresetCount,
        installedSkillIds,
        presetIds,
        refreshSkills,
        getCategories,
        getSummaryList,
        getDetail,
        addSkill,
        removeSkill,
    };
}
