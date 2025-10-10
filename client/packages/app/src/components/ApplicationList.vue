<script setup lang="tsx">
import { ref, computed } from 'vue';
import { useAppsStore } from '@/stores/apps';
import type { Application } from '@/model/application'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const appsStore = useAppsStore();

const handleClick = (app: Application) => {
    appsStore.setCurrentApplication(app);
};

// 处理更多按钮点击
const handleMoreClick = () => {
    // 这里可以添加显示所有应用的逻辑，比如弹出对话框或展开列表
    console.log('点击了更多按钮，当前应用总数:', appsStore.applications.length);
};

// 计算显示的应用列表（最多显示4个）
const displayedApps = computed(() => {
    return appsStore.applications.slice(0, 1);
});

// 判断是否需要显示"更多"
const showMore = computed(() => {
    return appsStore.applications.length > 1;
});
</script>

<template>
    <div class="application-list">
        <div v-for="app in displayedApps" :key="app.ApplicationId" class="application-item"
            :class="{ active: appsStore.currentApplicationId === app.ApplicationId }" @click="handleClick(app)">
            <t-avatar :image="app.Avatar" size="20px" class="application-avatar" />
            <span class="application-name">{{ app.Name }}</span>
        </div>

        <!-- 显示更多选项 -->
        <div v-if="showMore" class="application-item" @click="handleMoreClick">
            <t-icon name="grid-view" size="20px" class="application-avatar" />
            <span class="application-name">{{ t('common.more') }}</span>
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
