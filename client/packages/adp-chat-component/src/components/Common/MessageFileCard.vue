<!-- 聊天消息中的文件附件卡片，仅图片支持点击预览（新窗口打开） -->
<script setup lang="ts">
import { computed } from 'vue';
import CustomizedIcon from '../CustomizedIcon.vue';
import { getFileIconName } from '../../model/file';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
import type { FileInfo } from '../../model/chat-v2';

interface Props extends ThemeProps {
    file: FileInfo;
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
});

const isImage = computed(() => {
    const type = props.file.FileType?.toLowerCase() || '';
    const name = props.file.FileName?.toLowerCase() || '';
    return type.startsWith('image/') || /\.(jpg|jpeg|png|bmp|webp|gif)$/.test(name);
});

const iconName = computed(() => {
    if (isImage.value) return 'basic_picture_line';
    return getFileIconName(props.file.FileName || '');
});

const displayName = computed(() => {
    const name = props.file.FileName || '未命名文件';
    if (name.length <= 20) return name;
    const ext = name.lastIndexOf('.') > 0 ? name.slice(name.lastIndexOf('.')) : '';
    const base = name.slice(0, name.length - ext.length);
    if (base.length <= 16) return name;
    return base.slice(0, 14) + '...' + ext;
});

const fileUrl = computed(() => props.file.FileUrl || props.file.Url || '');

/**
 * 图片点击预览，新窗口打开
 */
const handleClick = () => {
    if (isImage.value && fileUrl.value) {
        window.open(fileUrl.value, '_blank');
    }
};
</script>

<template>
    <div
        class="msg-file-card"
        :class="{ 'is-image': isImage, 'clickable': isImage && fileUrl }"
        @click="handleClick"
    >
        <div class="msg-file-icon">
            <img v-if="isImage && fileUrl" class="msg-img-thumbnail" :src="fileUrl" alt="" />
            <CustomizedIcon remote v-else :name="iconName" :theme="theme" nativeIcon :showHoverBg="false" size="xl" />
        </div>
        <div class="msg-file-info">
            <span class="msg-file-name" :title="file.FileName">{{ displayName }}</span>
            <span v-if="file.FileSize" class="msg-file-size">{{ file.FileSize }}</span>
        </div>
    </div>
</template>

<style scoped>
.msg-file-card {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1px solid rgba(16, 32, 69, 0.08);
    border-radius: 8px;
    background: rgba(16, 32, 69, 0.02);
    max-width: 280px;
    cursor: default;
    transition: background 0.2s, border-color 0.2s;
}

.msg-file-card.clickable {
    cursor: pointer;
}

.msg-file-card.clickable:hover {
    background: rgba(16, 32, 69, 0.05);
    border-color: rgba(16, 32, 69, 0.15);
}

.msg-file-icon {
    display: flex;
    width: 32px;
    height: 32px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    border-radius: 4px;
    overflow: hidden;
}

.msg-img-thumbnail {
    width: 32px;
    height: 32px;
    object-fit: cover;
    border-radius: 4px;
}

.msg-file-info {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
}

.msg-file-name {
    color: rgba(0, 1, 10, 0.9);
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.msg-file-size {
    color: rgba(0, 1, 10, 0.4);
    font-size: 12px;
    line-height: 16px;
}
</style>
