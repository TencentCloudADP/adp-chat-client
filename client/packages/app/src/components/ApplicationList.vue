<script setup lang="tsx">
import { ref, computed } from 'vue';
import { useAppsStore } from '@/stores/apps';
import { useChatStore } from '@/stores/chat';
import { useRouter } from 'vue-router';
import type { Application } from '@/model/application'
import { useI18n } from 'vue-i18n';
const router = useRouter();
const { t } = useI18n();
const appsStore = useAppsStore();
const chatStore = useChatStore();
const maxAppLen = 4;

const handleClick = (app: Application) => {
    appsStore.setCurrentApplication(app);
    router.push({ name: 'Home' })
    chatStore.setCurrentConversation({
        Id: "",
        AccountId: "",
        Title: "",
        LastActiveAt: 0,
        CreatedAt: 0,
        ApplicationId: app.ApplicationId
    });
};

// 添加展开状态控制
const isExpanded = ref(false);

// 修改计算显示的应用列表逻辑
const displayedApps = computed(() => {
    if (isExpanded.value) {
        return appsStore.applications;
    }
    return appsStore.applications.slice(0, maxAppLen);
});

// 修改判断是否需要显示"更多"的逻辑
const showMore = computed(() => {
    return appsStore.applications.length > maxAppLen && !isExpanded.value;
});

// 添加判断是否需要显示"收起"的逻辑
const showCollapse = computed(() => {
    return isExpanded.value;
});

// 修改更多按钮点击处理
const handleMoreClick = () => {
    isExpanded.value = true;
};

// 添加收起按钮点击处理
const handleCollapseClick = () => {
    isExpanded.value = false;
};
</script>

<template>
    <div class="application-list">
        <div v-for="app in displayedApps" :key="app.ApplicationId" class="application-item"
            :class="{ active: appsStore.currentApplicationId === app.ApplicationId }" @click="handleClick(app)">
            <t-avatar :imageProps="{
                lazy: true,
                loading: ''
            }" :image="app.Avatar" size="20px" class="application-avatar" />
            <span class="application-name">{{ app.Name }}</span>
        </div>

        <!-- 显示更多选项 -->
        <div v-if="showMore" class="application-item" @click="handleMoreClick">
            <t-icon name="grid-view" size="20px" class="application-avatar" />
            <span class="application-name">{{ t('common.more') }}</span>
        </div>

        <!-- 显示收起选项 -->
        <div v-if="showCollapse" class="application-item" @click="handleCollapseClick">
            <t-icon name="chevron-up" size="20px" class="application-avatar" />
            <span class="application-name">{{ t('common.collapse') }}</span>
        </div>
    </div>
</template>

<style scoped>
.application-list {
    width: 100%;
}

.application-item {
    cursor: pointer;
    padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-s);
    border-radius: var(--td-radius-medium);
    transition: background 0.2s;
    color: var(--td-text-color-primary);
    display: flex;
    align-items: center;
    font-size: var(--td-font-size-body-medium);
}

.application-item.active {
    background: var(--td-bg-color-container-active);
}

.application-avatar {
    margin-right: var(--td-comp-margin-xs);
}

.application-name {
    max-width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
