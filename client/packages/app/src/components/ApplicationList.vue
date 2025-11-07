<script setup lang="tsx">
import { ref, computed } from 'vue';
import { useAppsStore } from '@/stores/apps';
import { useChatStore } from '@/stores/chat';
import { useRouter } from 'vue-router';
import type { Application } from '@/model/application'
import { useI18n } from 'vue-i18n';
import CustomizedIcon from '@/components/CustomizedIcon.vue';

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
        <div v-if="showMore" class="application-item control" @click="handleMoreClick">
            <CustomizedIcon :showHoverBg="false" class="application-avatar control"  name="grid"/>
            <span class="application-name">{{ t('common.more') }}</span>
        </div>

        <!-- 显示收起选项 -->
        <div v-if="showCollapse" class="application-item control collapse" @click="handleCollapseClick">
            <CustomizedIcon :showHoverBg="false" size="xs"  class="application-avatar" name="arrow_up_small" />
            <span class="application-name">{{ t('common.collapse') }}</span>
        </div>
    </div>
</template>

<style scoped>
.application-list {
    width: 100%;
}

.application-item {
    height: var(--td-comp-size-xl);
    line-height: var(--td-comp-size-xl);
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
.application-item:hover {
    background: var(--td-bg-color-container-active);
}
.application-item.control{
    padding-left: var(--td-comp-paddingLR-xxs)
}
.application-item.collapse{
    padding-left: var(--td-pop-padding-m)
}
.application-item.control:hover{
    background: none;
}

.application-avatar {
    margin-right: var(--td-comp-margin-xs);
}
.application-avatar.collapse{
    margin: var(--td-comp-margin-xs);
}
.application-avatar.control{
    margin-right: calc(-1 * var(--td-comp-paddingLR-xxs));
}
.application-item.collapse svg{
    margin: 0 var(--td-size-2);
}
.application-name {
    max-width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
