<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useAppsStore } from '@/stores/apps';
import { useChatStore } from '@/stores/chat';
import type { Application } from '@/model/application'
import { useI18n } from 'vue-i18n';
import CustomizedIcon from '@/components/CustomizedIcon.vue';
import { useUiStore } from '@/stores/ui';
import {
    handleLoadApplication,
    handleShareApplication,
    handleUnshareApplication,
    handlePublishApplication,
    handleUnpublishApplication,
    handleCreateApplication
} from '@/service/application';
import { getApplications } from '@/stores/apps';
import { uploadFile, type UploadFile } from '@/service/upload';
import type { FileProps } from '@/model/file';
import FileList from '@/components/Common/FileList.vue';

const { t } = useI18n();
const appsStore = useAppsStore();
const chatStore = useChatStore();
const uiStore = useUiStore();
const maxAppLen = 4;

// 对话框 Tab
type AppTab = 'published' | 'mine';

const handleClick = (app: Application) => {
    appsStore.setCurrentApplication(app);
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

// 添加只有单个应用时不展示列表的逻辑
const shouldShowApplications = computed(() => appsStore.applications.length >= 1);

// 修改更多按钮点击处理
const handleMoreClick = () => {
    isExpanded.value = true;
};

// 添加收起按钮点击处理
const handleCollapseClick = () => {
    isExpanded.value = false;
}

// 创建智能体弹框状态
const createAppDialogVisible = ref(false);

// 当前 Tab
const activeTab = ref<AppTab>('published');

// 已发布智能体 & 我的智能体 列表
const publishedApps = ref<any[]>([]);
const myApps = ref<any[]>([]);

// 创建智能体表单弹框
const createFormDialogVisible = ref(false);
const createAppForm = ref({
    name: '',
    prompt: '',
    avatar: '',
    knowledgeFiles: [] as string[],
});

// 创建智能体表单：上传状态与文件列表
const avatarUploading = ref(false);
const knowledgeFiles = ref<FileProps[]>([]);

// 处理头像上传
const handleAvatarUpload = async (file: UploadFile) => {
    if (!file) return;
    avatarUploading.value = true;
    try {
        const res: { Url: string } = await uploadFile({ file });
        console.log('handleAvatarUpload', res.Url);
        if (res.Url) {
            createAppForm.value.avatar = res.Url;
        }
    } catch (e) {
        console.error(e);
    } finally {
        avatarUploading.value = false;
    }
};

// 处理知识库文件上传（可多选）
const handleKnowledgeUpload = async (files: UploadFile[]) => {
    if (!files || files.length === 0) return;
    for (const fileItem of files) {
        const file = fileItem.raw || fileItem;
        try {
            const res: { Url: string } = await uploadFile({ file });
            if (res.Url) {
                knowledgeFiles.value.push({
                    uid: res.Url,
                    url: res.Url,
                    name: file.name,
                    status: 'success',
                    response: '',
                });
            }
        } catch (e) {
            console.error(e);
        }
    }
};

// 删除已上传的知识库文件
const handleDeleteKnowledgeFile = (index: number) => {
    knowledgeFiles.value.splice(index, 1);
};

// 加载应用（1：已发布智能体，2：我的智能体）
const loadPublishedApps = async () => {
    const { Applications } = await handleLoadApplication('1');
    publishedApps.value = Applications || [];
};

const loadMyApps = async () => {
    const { Applications } = await handleLoadApplication('2');
    myApps.value = Applications || [];
};

// 刷新主应用列表（左侧 ApplicationList 使用）
const refreshMainApplications = async () => {
    await getApplications();
};

// Tab 切换
const handleTabChange = async (value: AppTab) => {
    activeTab.value = value;
    if (value === 'published') {
        await loadPublishedApps();
    } else {
        await loadMyApps();
    }
};

// 创建智能体按钮点击处理（打开对话框并默认加载已发布智能体）
const handleCreateApp = async () => {
    createAppDialogVisible.value = true;
    activeTab.value = 'published';
    await loadPublishedApps();
};

// 关闭弹框
const handleCloseDialog = () => {
    createAppDialogVisible.value = false;
};

// 已发布智能体：启用/禁用
const handleToggleShared = async (app: any, enabled: boolean) => {
    const params = { ApplicationId: app.ApplicationId };
    if (enabled) {
        await handleShareApplication(params);
    } else {
        await handleUnshareApplication(params);
    }
    await loadPublishedApps();
    await refreshMainApplications();
};

// 我的智能体：发布/取消发布
const handleTogglePublished = async (app: any, published: boolean) => {
    const params = { ApplicationId: app.ApplicationId };
    if (published) {
        await handlePublishApplication(params);
    } else {
        await handleUnpublishApplication(params);
    }
    await loadMyApps();
    await refreshMainApplications();
};

// 打开创建智能体表单
const handleOpenCreateForm = () => {
    createAppForm.value = {
        name: '',
        prompt: '',
        avatar: '',
        knowledgeFiles: [],
    };
    createFormDialogVisible.value = true;
};

// 关闭创建表单
const handleCloseCreateForm = () => {
    createFormDialogVisible.value = false;
};

// 提交创建智能体表单
const handleSubmitCreateApp = async () => {
    const payload = {
        Name: createAppForm.value.name,
        Greeting: createAppForm.value.prompt,
        Avatar: createAppForm.value.avatar,
        KnowledgeFiles: knowledgeFiles.value.map((f) => f.url),
    };
    await handleCreateApplication(payload);
    createFormDialogVisible.value = false;
    // 创建后刷新「我的智能体」及主应用列表
    await loadMyApps();
    await refreshMainApplications();
};

// 存储每个卡片的截断状态
const titleTruncatedMap = ref<Record<string, boolean>>({});
const descTruncatedMap = ref<Record<string, boolean>>({});

// 检测元素是否被截断的函数
const checkTruncation = (element: HTMLElement | null, appId: string, type: 'title' | 'desc') => {
    if (!element) return;
    const isTruncated = element.scrollWidth > element.clientWidth;
    if (type === 'title') {
        titleTruncatedMap.value[appId] = isTruncated;
    } else {
        descTruncatedMap.value[appId] = isTruncated;
    }
};

onMounted(async () => {
    // 预加载已发布列表，提高首次打开体验
    await loadPublishedApps();
});

</script>

<template>
    <!-- 创建智能体按钮 -->
    <div v-if="!uiStore.isMobile" class="create-app-button" @click="handleCreateApp">
        <CustomizedIcon :showHoverBg="false" class="application-avatar" name="grid"/>
        <span class="application-name">{{ t('group.createApp') }}</span>
    </div>
    <div v-if="shouldShowApplications" class="application-list">
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

    <!-- 创建智能体弹框 -->
    <t-dialog
        v-model:visible="createAppDialogVisible"
        :width="800"
        :close-on-overlay-click="true"
        attach="body"
        class="create-app-dialog"
        :footer="false"
        @close="handleCloseDialog"
    >
        <!-- 使用 header 插槽放置 Tabs，代替原有标题 -->
        <template #header>
            <t-tabs v-model="activeTab" @change="handleTabChange" class="create-app-tabs">
                <t-tab-panel :value="'published'" :label="t('group.publishedApps')" />
                <!-- <t-tab-panel :value="'mine'" :label="t('group.myApps')" /> -->
            </t-tabs>
        </template>

        <div class="create-app-dialog-content">
            <div style="margin-bottom: 16px; color: var(--td-text-color-placeholder); font-size: 14px;">
                你可在如下的智能体广场中选择你需要的智能体，你将可以在侧栏中使用该智能体
            </div>
            <!-- 已发布智能体内容区域 -->
            <div v-if="activeTab === 'published'" class="app-card-list">
                <div v-for="app in publishedApps" :key="app.ApplicationId" class="app-card">
                    <div class="app-card-main">
                        <t-avatar
                            :image="app.Avatar"
                            :imageProps="{ lazy: true, loading: '' }"
                            size="32px"
                            class="app-card-avatar"
                        />
                        <div class="app-card-info">
                            <t-tooltip 
                                :content="app.Name" 
                                placement="top"
                                :disabled="!titleTruncatedMap[app.ApplicationId]"
                            >
                                <div 
                                    class="app-card-title"
                                    :ref="(el: any) => {
                                        if (el) {
                                            nextTick(() => {
                                                checkTruncation(el, app.ApplicationId, 'title');
                                            });
                                        }
                                    }"
                                >
                                    {{ app.Name }}
                                </div>
                            </t-tooltip>
                            <t-tooltip 
                                :content="app.Greeting" 
                                placement="top"
                                :disabled="!descTruncatedMap[app.ApplicationId]"
                            >
                                <div 
                                    class="app-card-desc"
                                    :ref="(el: any) => {
                                        if (el) {
                                            nextTick(() => {
                                                checkTruncation(el, app.ApplicationId, 'desc');
                                            });
                                        }
                                    }"
                                >
                                    {{ app.Greeting }}
                                </div>
                            </t-tooltip>
                        </div>
                    </div>
                    <div class="app-card-action">
                        <t-switch
                            :value="app.IsShared === 1 || app.IsShared === true"
                            :label="app.IsShared === 1 || app.IsShared === true ? t('group.enabled') : t('group.disabled')"
                            @change="(val: boolean) => handleToggleShared(app, val)"
                        />
                    </div>
                </div>
            </div>

            <!-- 我的智能体内容区域 -->
            <div v-else class="app-card-list">
                <!-- 添加智能体卡片 -->
                <div class="app-card add-app-card" @click="handleOpenCreateForm">
                    <div class="add-app-inner">
                        <div class="add-app-icon">+</div>
                        <div class="add-app-text">
                            <div class="app-card-title">{{ t('group.createCustomApp') }}</div>
                            <div class="app-card-desc">{{ t('group.createCustomAppDesc') }}</div>
                        </div>
                    </div>
                </div>

                <div v-for="app in myApps" :key="app.ApplicationId" class="app-card">
                    <div class="app-card-main">
                        <t-avatar
                            :image="app.Avatar"
                            :imageProps="{ lazy: true, loading: '' }"
                            size="32px"
                            class="app-card-avatar"
                        />
                        <div class="app-card-info">
                            <t-tooltip 
                                :content="app.Name" 
                                placement="top"
                                :disabled="!titleTruncatedMap[app.ApplicationId]"
                            >
                                <div 
                                    class="app-card-title"
                                    :ref="(el: any) => {
                                        if (el) {
                                            nextTick(() => {
                                                checkTruncation(el, app.ApplicationId, 'title');
                                            });
                                        }
                                    }"
                                >
                                    {{ app.Name }}
                                </div>
                            </t-tooltip>
                            <t-tooltip 
                                :content="app.Greeting" 
                                placement="top"
                                :disabled="!descTruncatedMap[app.ApplicationId]"
                            >
                                <div 
                                    class="app-card-desc"
                                    :ref="(el: any) => {
                                        if (el) {
                                            nextTick(() => {
                                                checkTruncation(el, app.ApplicationId, 'desc');
                                            });
                                        }
                                    }"
                                >
                                    {{ app.Greeting }}
                                </div>
                            </t-tooltip>
                        </div>
                    </div>
                    <div class="app-card-action">
                        <t-switch
                            :value="app.Published === 1 || app.Published === true"
                            :label="app.Published === 1 || app.Published === true ? t('group.published') : t('group.unpublished')"
                            @change="(val: boolean) => handleTogglePublished(app, val)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </t-dialog>

    <!-- 创建专属智能体表单弹框 -->
    <t-dialog
        v-model:visible="createFormDialogVisible"
        :header="t('group.createCustomApp')"
        :width="520"
        :close-on-overlay-click="true"
        top="8vh"
        attach="body"
        @close="handleCloseCreateForm"
    >
        <div class="create-form">
            <t-form :data="createAppForm" layout="vertical">
                <t-form-item :label="t('group.appAvatar')">
                    <div class="avatar-upload-row">
                        <t-avatar
                            v-if="createAppForm.avatar"
                            :image="createAppForm.avatar"
                            size="40px"
                            class="avatar-preview"
                        />
                        <t-upload
                            :request-method="handleAvatarUpload"
                            :max="1"
                            accept="image/*"
                            :show-thumbnail="false"
                            :show-image-file-name="false"
                            :show-upload-progress="false"
                        >
                            <t-button size="small" :loading="avatarUploading">
                                {{ t('group.uploadAvatar') }}
                            </t-button>
                        </t-upload>
                    </div>
                </t-form-item>
                <t-form-item :label="t('group.appName')">
                    <t-input v-model="createAppForm.name" :placeholder="t('group.appNamePlaceholder')" />
                </t-form-item>
                <t-form-item :label="t('group.appPrompt')">
                    <t-textarea
                        v-model="createAppForm.prompt"
                        :placeholder="t('group.appPromptPlaceholder')"
                        :autosize="{ minRows: 10, maxRows: 20 }"
                    />
                </t-form-item>
                <t-form-item :label="t('group.appKnowledge')">
                    <div class="knowledge-upload">
                        <t-upload
                            :request-method="handleKnowledgeUpload"
                            :multiple="true"
                            :show-thumbnail="false"
                            :show-image-file-name="false"
                            :show-upload-progress="false"
                        >
                            <t-button size="small">
                                {{ t('group.uploadKnowledge') }}
                            </t-button>
                        </t-upload>
                        <FileList
                            :fileList="knowledgeFiles"
                            :onDelete="handleDeleteKnowledgeFile"
                        />
                    </div>
                </t-form-item>
            </t-form>
        </div>
        <template #footer>
            <t-button theme="primary" @click="handleSubmitCreateApp">
                {{ t('group.confirmCreate') }}
            </t-button>
        </template>
    </t-dialog>
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

.create-app-button {
    height: var(--td-comp-size-xl);
    line-height: var(--td-comp-size-xl);
    cursor: pointer;
    padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-s);
    border-radius: var(--td-radius-medium);
    transition: background 0.2s;
    color: var(--td-text-color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--td-font-size-body-medium);
    margin-bottom: var(--td-comp-margin-m);
    background: var(--td-bg-color-container);
    border: 1px solid var(--td-border-level-1-color);
}

.create-app-button:hover {
    background: var(--td-bg-color-container-active);
    border-color: var(--td-brand-color);
}

.create-app-button .application-avatar {
    margin-right: -6px;
}

.create-app-dialog-content {
    padding: var(--td-comp-paddingTB-m) 0;
}

.create-app-tabs {
    border-bottom: 1px solid var(--td-border-level-1-color);
}

.create-app-option {
    display: flex;
    align-items: flex-start;
    padding: var(--td-comp-paddingTB-m) var(--td-comp-paddingLR-m);
    border-radius: var(--td-radius-medium);
    cursor: pointer;
    transition: background 0.2s;
    margin-bottom: var(--td-comp-margin-s);
}

.create-app-option:last-child {
    margin-bottom: 0;
}

.create-app-option:hover {
    background: var(--td-bg-color-container-hover);
}

.option-icon {
    margin-right: var(--td-comp-margin-m);
    flex-shrink: 0;
}

.option-content {
    flex: 1;
}

.option-title {
    font-size: var(--td-font-size-body-large);
    font-weight: 500;
    color: var(--td-text-color-primary);
    margin-bottom: var(--td-comp-margin-xs);
}

.option-desc {
    font-size: var(--td-font-size-body-small);
    color: var(--td-text-color-secondary);
    line-height: 1.5;
}

.app-card-list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--td-comp-margin-m);
}

.app-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--td-comp-paddingTB-l) var(--td-comp-paddingLR-m);
    border-radius: var(--td-radius-medium);
    background: var(--td-bg-color-container);
    border: 1px solid var(--td-border-level-1-color);
    min-height: 110px;
}

.app-card-main {
    display: flex;
    align-items: center;
    gap: var(--td-comp-margin-s);
    flex: 1;
    min-width: 0;
}

.app-card-avatar {
    flex-shrink: 0;
}

.app-card-info {
    flex: 1;
    min-width: 0;
}

.app-card-title {
    font-size: var(--td-font-size-body-large);
    font-weight: 500;
    color: var(--td-text-color-primary);
    margin-bottom: var(--td-comp-margin-xs);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.app-card-desc {
    font-size: var(--td-font-size-body-small);
    color: var(--td-text-color-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.app-card-action {
    margin-left: var(--td-comp-margin-m);
    flex-shrink: 0;
}

.add-app-card {
    border-style: dashed;
    background: transparent;
}

.add-app-inner {
    display: flex;
    align-items: center;
    gap: var(--td-comp-margin-s);
}

.add-app-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid var(--td-brand-color);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--td-brand-color);
    font-size: 18px;
    font-weight: 600;
}

@media (max-width: 768px) {
    .app-card-list {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }
}

.create-form {
    padding-top: var(--td-comp-paddingTB-s);
}

.knowledge-placeholder {
    font-size: var(--td-font-size-body-small);
    color: var(--td-text-color-placeholder);
}

.avatar-upload-row {
    display: flex;
    align-items: center;
    gap: var(--td-comp-margin-s);
    width: 100%;
}

.avatar-preview {
    border-radius: var(--td-radius-medium);
    flex-shrink: 0;
}

.knowledge-upload {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: var(--td-comp-margin-s);
}

</style>
