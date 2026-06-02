<!-- assistant 系统对话中的文件附件卡片，支持点击下载 -->
<script setup lang="ts">
import { MessagePlugin, Icon as TIcon } from 'tdesign-vue-next';
import CustomizedIcon from '../CustomizedIcon.vue';
import { getFileIconName } from '../../model/file';
import type { ThemeProps } from '../../model/type';
import { themePropsDefaults } from '../../model/type';
import type { FileInfo } from '../../model/chat-v2';

interface Props extends ThemeProps {
    /** 文件信息列表 */
    files: FileInfo[];
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    files: () => [],
});

/**
 * 根据文件名获取图标名称
 */
function getIconName(file: FileInfo): string {
    const name = file.FileName || '';
    const type = file.FileType?.toLowerCase() || '';
    if (type.startsWith('image/') || /\.(jpg|jpeg|png|bmp|webp|gif)$/i.test(name)) {
        return 'picture';
    }
    return getFileIconName(name);
}

/**
 * 获取文件显示名称
 */
function getDisplayName(file: FileInfo): string {
    return file.FileName || '未命名文件';
}

/**
 * 获取文件基名（不含扩展名），用于 CSS 省略
 */
function getBaseName(file: FileInfo): string {
    const name = file.FileName || '未命名文件';
    const dotIdx = name.lastIndexOf('.');
    if (dotIdx <= 0) return name;
    return name.slice(0, dotIdx);
}

/**
 * 获取文件扩展名（含 .）
 */
function getExtName(file: FileInfo): string {
    const name = file.FileName || '';
    const dotIdx = name.lastIndexOf('.');
    if (dotIdx <= 0) return '';
    return name.slice(dotIdx);
}

/**
 * 是否显示文件大小
 * 过滤 undefined, null, '0', '' 等空值以及 "0B", "0KB", "0MB" 等
 */
function showFileSize(file: FileInfo): boolean {
    const size = file.FileSize;
    if (!size || size === '0') {
        return false;
    }
    if (/^0(\.0+)?\s*(B|KB|MB|GB)?$/i.test(size.trim())) {
        return false;
    }
    return true;
}

/**
 * 获取文件下载 URL
 */
function getFileUrl(file: FileInfo): string {
    return file.FileUrl || file.Url || '';
}

/**
 * 下载文件
 */
function handleDownload(file: FileInfo) {
    const url = getFileUrl(file);
    if (!url) {
        MessagePlugin.error('下载链接不可用');
        return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.download = file.FileName || '';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
</script>

<template>
    <div v-if="files.length > 0" class="assistant-file-cards">
        <div
            v-for="(file, idx) in files"
            :key="'afc-' + idx"
            class="assistant-file-card"
            :class="{ 'assistant-file-card--no-size': !showFileSize(file) }"
            :title="getDisplayName(file)"
            @click="handleDownload(file)"
        >
            <div class="assistant-file-card__icon">
                <CustomizedIcon :name="getIconName(file)" :theme="theme" nativeIcon :showHoverBg="false" size="s" />
            </div>
            <div class="assistant-file-card__info">
                <span class="assistant-file-card__name">
                    <span class="assistant-file-card__name-base">{{ getBaseName(file) }}</span><span class="assistant-file-card__name-ext">{{ getExtName(file) }}</span>
                </span>
                <span v-if="showFileSize(file)" class="assistant-file-card__size">{{ file.FileSize }}</span>
            </div>
            <span class="assistant-file-card__download" @click.stop="handleDownload(file)">
                <t-icon name="download" />
            </span>
        </div>
    </div>
</template>

<style scoped>
.assistant-file-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
}

.assistant-file-card {
    display: inline-flex;
    align-items: center;
    width: 220px;
    height: 50px;
    padding: 8px 10px;
    background: var(--td-bg-color-container, #fff);
    border: 1px solid var(--td-component-border, rgba(16, 32, 69, 0.1));
    border-radius: 6px;
    cursor: pointer;
    box-sizing: border-box;
    transition: background 0.2s, border-color 0.2s;
}

.assistant-file-card:hover {
    background: var(--td-bg-color-container-hover, #fafafa);
    border-color: rgba(16, 32, 69, 0.15);
}

.assistant-file-card__icon {
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.assistant-file-card__info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    flex: 1;
    min-width: 0;
    margin-left: 8px;
}

.assistant-file-card__name {
    display: flex;
    overflow: hidden;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: var(--td-text-color-primary, rgba(0, 1, 10, 0.93));
}

.assistant-file-card__name-base {
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
    min-width: 0;
}

.assistant-file-card__name-ext {
    flex-shrink: 0;
}

.assistant-file-card__size {
    font-size: 12px;
    line-height: 16px;
    color: var(--td-text-color-placeholder, rgba(1, 11, 50, 0.41));
    margin-top: 4px;
}

.assistant-file-card__download {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    cursor: pointer;
    color: var(--td-text-color-secondary, #666);
    font-size: 14px;
    transition: background-color 0.2s, color 0.2s;
}

.assistant-file-card__download:hover {
    background-color: var(--td-bg-color-container-hover, #f3f3f3);
    color: var(--td-brand-color, #0052d9);
}

/* 无文件大小时，文件名垂直居中 */
.assistant-file-card--no-size .assistant-file-card__name {
    line-height: 34px;
}
</style>
