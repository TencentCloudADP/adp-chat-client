<!-- 文件/图片卡片组件，对齐 webim 风格 -->
<script setup lang="ts">
import { computed, ref } from 'vue';
import CustomizedIcon from '../CustomizedIcon.vue';
import type { FileProps } from '../../model/file';
import { getFileIconName, formatFileSize } from '../../model/file';
import type { ThemeProps, ChatMode } from '../../model/type';
import { themePropsDefaults } from '../../model/type';

interface Props extends ThemeProps {
    file: FileProps;
    mode?: ChatMode;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    mode: 'claw',
});

const emit = defineEmits<{
    (e: 'delete'): void;
}>();

const showPreview = ref(false);

const isUploading = computed(() => props.file.status === 'uploading');

const iconName = computed(() => {
    if (props.mode === 'claw') {
        if (props.file.category === 'image') return 'basic_picture_line';
        return getFileIconName(props.file.name || '');
    }
    if (props.file.category === 'image') return 'basic_picture_line';
    return getFileIconName(props.file.name || '');
});

const isImage = computed(() => props.file.category === 'image');

const isClaw = computed(() => props.mode === 'claw');

/**
 * 获取文件类型分类（用于 CSS 类名，控制背景色）
 */
const fileTypeClass = computed(() => {
    if (props.file.category === 'image') return 'type-image';
    const ext = (props.file.name || '').split('.').pop()?.toLowerCase() || '';
    if (['pdf'].includes(ext)) return 'type-pdf';
    if (['doc', 'docx'].includes(ext)) return 'type-word';
    if (['ppt', 'pptx'].includes(ext)) return 'type-ppt';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'type-excel';
    if (['txt', 'md', 'json', 'xml', 'yaml', 'yml'].includes(ext)) return 'type-text';
    return 'type-file';
});

/**
 * 点击图片打开预览
 */
const handleImageClick = () => {
    if (isImage.value && props.file.url && !isUploading.value) {
        window.open(props.file.url, '_blank');
    }
};

/**
 * 截断文件名显示
 */
const displayName = computed(() => {
    const name = props.file.name || '未命名文件';
    if (name.length <= 18) return name;
    const ext = name.lastIndexOf('.') > 0 ? name.slice(name.lastIndexOf('.')) : '';
    const base = name.slice(0, name.length - ext.length);
    if (base.length <= 14) return name;
    return base.slice(0, 12) + '...' + ext;
});

/**
 * 文件大小展示文本
 */
const fileSizeDisplay = computed(() => {
    if (props.file.size && props.file.size > 0) {
        return formatFileSize(props.file.size);
    }
    return '';
});
</script>

<template>
    <!-- claw 模式：图片和文件统一展示为 icon + 文件名 + 删除按钮 -->
    <div v-if="isClaw" class="doc-file-card claw-mode" :class="[fileTypeClass, { 'is-error': file.status === 'error', 'is-image-card': isImage }]"
         @mouseenter="isImage && !isUploading ? showPreview = true : null"
         @mouseleave="showPreview = false"
         @click="isImage ? handleImageClick() : undefined">
        <div v-if="isUploading" class="doc-icon-cont">
            <div class="loading-spinner">
                <CustomizedIcon name="loading" :theme="theme" nativeIcon :showHoverBg="false" size="s" />
            </div>
        </div>
        <span v-else class="claw-tag-icon" :class="isImage ? 'claw-tag-icon--image' : 'claw-tag-icon--file'" />
        <div class="doc-filename" :title="file.name">{{ displayName }}</div>
        <span class="delete-btn claw-delete" @click.stop="emit('delete')">
            <CustomizedIcon remote name="basic_close_line" :theme="theme" size="xs" :showHoverBg="false" />
        </span>
        <!-- 图片 hover 预览弹窗 -->
        <Transition name="fade">
            <div v-if="isImage && showPreview && file.url && !isUploading" class="preview-popup">
                <img :src="file.url" class="preview-img" alt="" />
            </div>
        </Transition>
    </div>

    <!-- standard 模式：图片类型 - 方块缩略图展示 -->
    <div v-else-if="isImage" class="image-card"
         @mouseenter="!isUploading ? showPreview = true : null"
         @mouseleave="showPreview = false"
         @click="handleImageClick">
        <!-- 上传中 loading -->
        <div v-if="isUploading" class="image-loading">
            <CustomizedIcon name="loading" :theme="theme" nativeIcon :showHoverBg="false" size="s" />
        </div>
        <!-- 图片缩略图 -->
        <img v-else-if="file.url" class="image-thumb" :src="file.url" alt="" />
        <!-- 兜底 icon -->
        <CustomizedIcon remote v-else name="basic_picture_line" :theme="theme" nativeIcon :showHoverBg="false" size="s" />
        <!-- 删除按钮 -->
        <span class="delete-btn" @click.stop="emit('delete')">
            <CustomizedIcon remote name="basic_close_line" :theme="theme" size="xs" :showHoverBg="false" />
        </span>
        <!-- hover 预览弹窗 -->
        <Transition name="fade">
            <div v-if="showPreview && file.url && !isUploading" class="preview-popup">
                <img :src="file.url" class="preview-img" alt="" />
            </div>
        </Transition>
    </div>

    <!-- standard 模式：文件类型 - 高 card（与 MessageFileCard 一致） -->
    <div v-else class="doc-file-card standard-file-card" :class="{ 'is-error': file.status === 'error' }">
        <div class="doc-icon-cont">
            <div v-if="isUploading" class="loading-spinner">
                <CustomizedIcon name="loading" :theme="theme" nativeIcon :showHoverBg="false" size="s" />
            </div>
            <CustomizedIcon remote v-else :name="iconName" :theme="theme" nativeIcon :showHoverBg="false" size="xl" />
        </div>
        <div class="doc-file-info">
            <span class="doc-filename" :title="file.name">{{ displayName }}</span>
            <span v-if="fileSizeDisplay" class="doc-file-size">{{ fileSizeDisplay }}</span>
        </div>
        <!-- 删除按钮 -->
        <span class="delete-btn" @click.stop="emit('delete')">
            <CustomizedIcon remote name="basic_close_line" :theme="theme" size="xs" :showHoverBg="false" />
        </span>
    </div>
</template>

<style scoped>
/* ===== 图片卡片（standard 模式） ===== */
.image-card {
    position: relative;
    display: flex;
    width: 54px;
    height: 54px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    border-radius: var(--td-radius-large);
    border: 1px solid rgba(16, 32, 69, 0.10);
    background: #FFFFFF;
    cursor: pointer;
    box-sizing: border-box;
}

.image-card:hover {
    border-color: rgba(16, 32, 69, 0.20);
}

.image-card:hover .delete-btn {
    opacity: 1;
    visibility: visible;
}

.image-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    animation: spin 1s linear infinite;
}

.image-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 7px;
}

/* ===== 文件卡片 ===== */
.doc-file-card {
    display: inline-flex;
    align-items: center;
    gap: var(--td-size-3);
    padding: 0 4px;
    border: 1px solid rgba(16, 32, 69, 0.10);
    border-radius: 3px;
    background: #FFFFFF;
    position: relative;
    box-sizing: border-box;
    transition: border-color 0.2s;
    max-width: 220px;
    cursor: default;
    vertical-align: middle;
}

/* standard 模式高 card（与 MessageFileCard 一致） */
.doc-file-card.standard-file-card {
    gap: var(--td-size-4);
    padding: 8px 12px;
    border-radius: var(--td-radius-large);
    border-color: rgba(16, 32, 69, 0.08);
    background: rgba(16, 32, 69, 0.02);
    max-width: 280px;
}

.doc-file-card.standard-file-card .doc-icon-cont {
    width: 32px;
    height: 32px;
    border-radius: var(--td-radius-small);
}

.doc-file-card.standard-file-card .doc-file-info {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
}

.doc-file-card.standard-file-card .doc-filename {
    max-width: 200px;
}

.doc-file-card.standard-file-card .delete-btn {
    top: -6px;
    right: -6px;
}

.doc-file-size {
    color: rgba(0, 1, 10, 0.4);
    font-size: var(--td-font-size-link-small);
    line-height: 16px;
    white-space: nowrap;
}

.doc-file-card:hover {
    border-color: rgba(16, 32, 69, 0.20);
}

/* standard 模式下文件卡片：hover 显示删除按钮 */
.doc-file-card:not(.claw-mode):hover .delete-btn {
    opacity: 1;
    visibility: visible;
}

.doc-file-card.is-error {
    border-color: var(--td-error-color, #e34d59);
}

.doc-icon-cont {
    display: flex;
    width: 20px;
    height: 20px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
}

.loading-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.doc-filename {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: rgba(0, 1, 10, 0.93);
    font-size: var(--td-font-size-body-small);
    font-weight: 400;
    line-height: var(--td-line-height-body-small);
    max-width: 160px;
}

.claw-mode .doc-filename {
    color: #6a45e5;
}

/* ===== 删除按钮（standard 模式：绝对定位 + hover 显示） ===== */
.delete-btn {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: var(--td-radius-circle);
    color: rgba(1, 11, 50, 0.41);
    background: rgba(255, 255, 255, 0.9);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.15s, color 0.15s;
    z-index: 2;
}

.delete-btn:hover {
    color: var(--td-error-color, #e34d59);
}

/* ===== claw 模式下删除按钮：直接显示、内联、垂直居中 ===== */
.claw-delete {
    position: static;
    opacity: 1;
    visibility: visible;
    background: transparent;
    flex-shrink: 0;
    margin-left: var(--td-size-1);
}

/* claw 模式下图片卡片可点击 */
.claw-mode.is-image-card {
    cursor: pointer;
}

/* ===== claw 模式 12x12 紫色图标（与 QuestionItemV3 __tag-icon 一致） ===== */
.claw-tag-icon {
    display: inline-block;
    flex-shrink: 0;
    width: 12px;
    height: 12px;
    background-size: 12px 12px;
    background-repeat: no-repeat;
    background-position: center;
}

.claw-tag-icon--file {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M5.60847 1.64729C5.51897 1.59246 5.42144 1.55205 5.3194 1.52756C5.23309 1.50683 5.14272 1.50165 4.99974 1.50036L2.37667 1.50024L2.16756 1.50283C1.87873 1.50965 1.6962 1.53248 1.54618 1.60892C1.35802 1.70479 1.20504 1.85777 1.10917 2.04594C1.03273 2.19595 1.0099 2.37848 1.00308 2.66731L1.00049 2.87642V8.62343L1.00308 8.83254C1.0099 9.12138 1.03273 9.30392 1.10917 9.45393C1.20504 9.64208 1.35802 9.79508 1.54618 9.89093C1.65314 9.94543 1.77662 9.97268 1.94337 9.9863L2.09752 9.99496L2.37667 9.99961H9.62367L9.90282 9.99496L10.057 9.9863C10.2237 9.97268 10.3472 9.94543 10.4542 9.89093C10.6423 9.79508 10.7953 9.64208 10.8912 9.45393C10.9457 9.34698 10.9729 9.22349 10.9865 9.05673L10.9952 8.90258L10.9999 8.62343V4.37642L10.9952 4.09728L10.9865 3.94313C10.9729 3.77638 10.9457 3.65289 10.8912 3.54594C10.7953 3.35777 10.6423 3.20479 10.4542 3.10892C10.3042 3.03248 10.1216 3.00965 9.83279 3.00283L9.62367 3.00024L7.00017 2.99993L5.90782 1.90763L5.8054 1.8072L5.72123 1.73051C5.68212 1.69713 5.64631 1.67048 5.60847 1.64729ZM2.30229 2.25081L4.99971 2.25036L5.10433 2.2529L5.14433 2.25684C5.16983 2.26296 5.19423 2.27307 5.21668 2.28682L5.28105 2.34342L6.46985 3.53027L6.52486 3.58008C6.65829 3.68941 6.82606 3.74991 7.00008 3.74993L9.70069 3.75082L9.88531 3.75464L10.0084 3.76091L10.0809 3.76873L10.1065 3.77434L10.1137 3.77717C10.1607 3.80114 10.1989 3.83938 10.2229 3.88636L10.2288 3.9038L10.2365 3.95559L10.2427 4.04932L10.2497 4.41289L10.2502 8.39993L10.2482 8.73859L10.2427 8.95053L10.2365 9.04424L10.2288 9.096L10.2229 9.1134C10.199 9.16047 10.1607 9.19871 10.1137 9.22265L10.0963 9.22856L10.0445 9.23629L9.95078 9.24248L9.5872 9.24943L2.60017 9.24993L2.26151 9.24799L2.04958 9.24248L1.95586 9.2363L1.9041 9.22858L1.88669 9.22268C1.83962 9.1987 1.80139 9.16047 1.77742 9.11343C1.77648 9.11158 1.77553 9.10921 1.77459 9.10623L1.76897 9.08059L1.76116 9.00783L1.75488 8.88396L1.75105 8.69781V2.79934L1.75488 2.61476L1.76116 2.49169L1.76897 2.41923L1.77459 2.39363L1.77742 2.38644C1.80139 2.33938 1.83963 2.30115 1.88666 2.27718C1.88851 2.27624 1.89088 2.2753 1.89386 2.27435L1.91951 2.26873L1.99228 2.26091L2.11614 2.25464L2.30229 2.25081ZM2.76921 3.65427C2.75018 3.70021 2.75018 3.75845 2.75018 3.87494C2.75018 3.99142 2.75018 4.04967 2.76921 4.09561C2.79459 4.15687 2.84326 4.20554 2.90451 4.23091C2.95046 4.24994 3.0087 4.24994 3.12518 4.24994H5.50018L4.75018 3.49994H3.12518C3.0087 3.49994 2.95046 3.49994 2.90451 3.51897C2.84326 3.54434 2.79459 3.59301 2.76921 3.65427Z' fill='%236A45E5'/%3E%3C/svg%3E");
}

.claw-tag-icon--image {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.6 2.75C2.3076 2.75 2.1334 2.75058 2.00428 2.76113C1.92547 2.76757 1.89234 2.77607 1.88346 2.77882C1.83882 2.80234 1.80234 2.83882 1.77882 2.88346C1.77607 2.89234 1.76757 2.92547 1.76113 3.00428C1.75058 3.1334 1.75 3.3076 1.75 3.6V7.20933L3.21724 5.53176L3.49942 5.20912L3.7817 5.53167L4.85277 6.75556L7.08793 4.43271L7.361 4.14893L7.63108 4.43556L10.25 7.21504V3.6C10.25 3.3076 10.2494 3.1334 10.2389 3.00428C10.2324 2.92547 10.2239 2.89234 10.2212 2.88346C10.1977 2.83882 10.1612 2.80234 10.1165 2.77882C10.1077 2.77607 10.0745 2.76757 9.99572 2.76113C9.8666 2.75058 9.6924 2.75 9.4 2.75H2.6ZM1.75 8.34028V8.4C1.75 8.6924 1.75058 8.8666 1.76113 8.99572C1.76757 9.07453 1.77607 9.10766 1.77882 9.11654C1.80234 9.16118 1.83882 9.19766 1.88346 9.22118C1.89234 9.22393 1.92547 9.23243 2.00428 9.23887C2.1334 9.24942 2.3076 9.25 2.6 9.25H9.4C9.6924 9.25 9.8666 9.24942 9.99572 9.23887C10.0745 9.23243 10.1077 9.22393 10.1165 9.22118C10.1612 9.19766 10.1977 9.16118 10.2212 9.11654C10.2239 9.10766 10.2324 9.07453 10.2389 8.99572C10.2494 8.8666 10.25 8.6924 10.25 8.4V8.2895L9.78135 7.81121L9.77878 7.80859L9.77627 7.80592L7.35529 5.23652L5.10989 7.57002L4.82657 7.86445L4.55748 7.55697L3.49959 6.34815L2.24677 7.78057L2.24497 7.78264L2.24496 7.78263L1.75 8.34028ZM1 3.6C1 3.03995 1 2.75992 1.10899 2.54601C1.20487 2.35785 1.35785 2.20487 1.54601 2.10899C1.75992 2 2.03995 2 2.6 2H9.4C9.96005 2 10.2401 2 10.454 2.10899C10.6422 2.20487 10.7951 2.35785 10.891 2.54601C11 2.75992 11 3.03995 11 3.6V8.4C11 8.96005 11 9.24008 10.891 9.45399C10.7951 9.64215 10.6422 9.79513 10.454 9.89101C10.2401 10 9.96005 10 9.4 10H2.6C2.03995 10 1.75992 10 1.54601 9.89101C1.35785 9.79513 1.20487 9.64215 1.10899 9.45399C1 9.24008 1 8.96005 1 8.4V3.6Z' fill='%236A45E5'/%3E%3C/svg%3E");
}

/* ===== claw 模式各类型背景色 ===== */
.doc-file-card.claw-mode{
    background: #f4eefc;
    border-color: #e2d5f8;
    color: #6a45e5;
    cursor: pointer;
}
/* ===== 图片预览弹窗（standard 模式） ===== */
.preview-popup {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    padding: var(--td-size-2);
    background: #fff;
    border-radius: var(--td-radius-large);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    pointer-events: none;
}

.preview-img {
    display: block;
    max-width: 200px;
    max-height: 200px;
    border-radius: var(--td-radius-medium);
    object-fit: contain;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
