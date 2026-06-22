/**
 * Skills 状态管理 Composable
 * 管理已安装 Skills 列表的拉取、刷新、增删
 */
import { ref, computed, watch, type MaybeRefOrGetter, toValue } from 'vue';
import {
    fetchGlobalAgent,
    fetchSkillCategories,
    fetchSkillSummaryList,
    fetchSkillDetail,
    installSkill as installSkillApi,
    uninstallSkill as uninstallSkillApi,
} from '../service/skillsApi';
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
        createSkillApi?: string;
        deleteSkillApi?: string;
    };
}

/** 兼容两种字段命名，取 skill_id */
function getSkillId(s: AgentSkillInfo): string {
    return (s.skill_id || s.SkillId || '') as string;
}

function getSkillDisplayName(s: AgentSkillInfo): string {
    return (s.skill_display_name || s.SkillDisplayName || s.skill_name || s.SkillName || '') as string;
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
        name: getSkillDisplayName(item),
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
        desc: (item.skill_display_desc || item.SkillDisplayDesc || '') as string,
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

    const installedSkills = ref<AgentSkillInfo[]>([]);
    const refreshing = ref(false);
    const error = ref<string | null>(null);
    const agentId = ref<string>('');

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
        console.log('[useSkills] refreshSkills called, applicationId:', applicationId.value, 'spaceId:', spaceId.value);
        if (!applicationId.value) {
            console.warn('[useSkills] refreshSkills skipped: applicationId is empty');
            return;
        }
        refreshing.value = true;
        error.value = null;
        try {
            console.log('[useSkills] calling fetchGlobalAgent...');
            const result = await fetchGlobalAgent(
                {
                    applicationId: applicationId.value,
                    spaceId: spaceId.value || '',
                    projectPath: projectPath.value,
                },
                apiPaths.globalAgentApi
            );
            console.log('[useSkills] fetchGlobalAgent result:', result);
            installedSkills.value = result.skills as AgentSkillInfo[];
            if (result.agentId) agentId.value = result.agentId;
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
        try {
            const result = await installSkillApi(
                {
                    applicationId: applicationId.value,
                    space_id: spaceId.value,
                    source: skillConfig.source,
                    skill_id: skillConfig.skill_id,
                    version_id: skillConfig.version_id,
                    name: skillConfig.name,
                    file_url: skillConfig.file_url,
                },
                apiPaths.createSkillApi
            );
            await refreshSkills();
            return result;
        } catch (e) {
            console.error('[useSkills] addSkill error:', e);
            throw e;
        }
    }

    async function removeSkill(skillId: string) {
        if (!applicationId.value) throw new Error('applicationId is required');
        try {
            await uninstallSkillApi(
                { applicationId: applicationId.value, skill_id: skillId, space_id: spaceId.value },
                apiPaths.deleteSkillApi
            );
            installedSkills.value = installedSkills.value.filter(
                (s) => getSkillId(s) !== skillId
            );
        } catch (e) {
            console.error('[useSkills] removeSkill error:', e);
            await refreshSkills();
            throw e;
        }
    }

    function setInstalledSkills(skills: AgentSkillInfo[]) {
        installedSkills.value = skills || [];
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
        setInstalledSkills,
    };
}
