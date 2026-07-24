<!--
  渠道会话列表抽屉
  @description
    对齐 webim 的 channel-drawer.vue：右侧抽屉展示渠道下的会话列表
    通过应用 conversationListApi 拉取，按最近时间排序
-->
<script setup lang="ts">
import { ref, watch } from 'vue';
import {
    Drawer as TDrawer,
    Loading as TLoading,
} from 'tdesign-vue-next';
import { httpService } from '../../service/httpService';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';

interface ConversationItem {
    id: string;
    title: string;
    lastActiveAt: number;
}

interface Props extends ThemeProps {
    modelValue: boolean;
    /** 应用 ID */
    applicationId: string;
    /** 渠道名称（用于标题） */
    channelLabel?: string;
    /** 会话列表 API 路径 */
    conversationListApi?: string;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    modelValue: false,
    applicationId: '',
    channelLabel: '',
    conversationListApi: '/chat/conversations',
});

const emit = defineEmits<{
    (e: 'update:modelValue', val: boolean): void;
    (e: 'select', conversationId: string): void;
}>();

const loading = ref(false);
const conversations = ref<ConversationItem[]>([]);

const drawerVisible = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
    drawerVisible.value = val;
    if (val) fetchConversations();
});

const handleVisibleChange = (val: boolean) => {
    emit('update:modelValue', val);
};

const fetchConversations = async () => {
    if (!props.applicationId) return;
    loading.value = true;
    try {
        const raw = await httpService.get(props.conversationListApi, {
            applicationId: props.applicationId,
        });
        const list = (raw?.Conversations || raw?.conversations || []) as any[];
        conversations.value = list
            .map((c: any) => ({
                id: c.Id || c.id || '',
                title: c.Title || c.title || '未命名',
                lastActiveAt: c.LastActiveAt || c.last_active_at || 0,
            }))
            .sort((a: ConversationItem, b: ConversationItem) => b.lastActiveAt - a.lastActiveAt);
    } finally {
        loading.value = false;
    }
};

const handleSelect = (conv: ConversationItem) => {
    emit('select', conv.id);
    drawerVisible.value = false;
};

const formatTime = (ts: number): string => {
    if (!ts) return '';
    const d = new Date(ts * 1000);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return '刚刚';
    if (diffMin < 60) return `${diffMin}分钟前`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}小时前`;
    return `${d.getMonth() + 1}/${d.getDate()}`;
};
</script>

<template>
    <Teleport to="body">
        <t-drawer
            :visible="drawerVisible"
            :header="channelLabel ? `${channelLabel}会话` : '渠道会话'"
            size="320px"
            :close-on-overlay-click="true"
            :footer="false"
            placement="right"
            @update:visible="handleVisibleChange"
        >
            <div v-if="loading" class="ccd-loading">
                <t-loading size="small" text="加载中..." />
            </div>
            <div v-else-if="conversations.length === 0" class="ccd-empty">
                暂无会话
            </div>
            <div v-else class="ccd-list">
                <div
                    v-for="conv in conversations"
                    :key="conv.id"
                    class="ccd-item"
                    @click="handleSelect(conv)"
                >
                    <span class="ccd-item__title">{{ conv.title }}</span>
                    <span class="ccd-item__time">{{ formatTime(conv.lastActiveAt) }}</span>
                </div>
            </div>
        </t-drawer>
    </Teleport>
</template>

<style scoped>
.ccd-loading,
.ccd-empty {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--td-size-12) 0;
    color: var(--td-text-color-placeholder);
    font-size: var(--td-font-size-body-medium);
}

.ccd-list {
    display: flex;
    flex-direction: column;
}

.ccd-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--td-size-5) var(--td-size-6);
    cursor: pointer;
    border-radius: var(--td-radius-medium);
    transition: background 0.15s;
}

.ccd-item:hover {
    background: var(--td-bg-color-container-hover);
}

.ccd-item__title {
    font-size: var(--td-font-size-body-medium);
    color: var(--td-text-color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
}

.ccd-item__time {
    font-size: var(--td-font-size-body-small);
    color: var(--td-text-color-placeholder);
    flex-shrink: 0;
    margin-left: var(--td-size-5);
}
</style>
