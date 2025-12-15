<template>
    <div ref="fileViewRef" v-if="fileList.length > 0" class="file-upload-container">
        <div ref="scrollViewRef" class="img-scrollview-container">
            <div v-for="(img, index) in fileList" class="img-item-container" :class="{ 'file-item': !isImageFile(img), 'uploading': img.status === 'uploading' }">
                <t-image 
                    v-if="isImageFile(img) && img.url" 
                    fit="contain" 
                    :src="img.url" 
                    :style="{ width: '70px', height: '70px' }" 
                />
                <div v-else class="file-icon-container">
                    <CustomizedIcon :name="getFileIconName(img)" class="file-icon" />
                    <div class="file-info">
                        <span class="file-name" :title="getFileName(img)">{{ getFileName(img) }}</span>
                        <span class="file-size" :title="formatFileSize(img.size)">{{ formatFileSize(img.size) }}</span>
                    </div>
                </div>
                <!-- 上传中遮罩层 -->
                <div v-if="img.status === 'uploading'" class="upload-overlay">
                    <div class="upload-progress-container">
                        <span class="upload-progress-text">{{ img.progress || 0 }}%</span>
                    </div>
                </div>
                <span v-if="img.status !== 'uploading'" class="delete-container"  @click="onDelete(index)">
                    <CustomizedIcon size="xs" name="delete"/>
                </span>
            </div>
        </div>
        <div v-if="showFrontIcon"  class="btn front" @click="handleScroll('front')">
            <CustomizedIcon name="arrow_up_small"/>
        </div>
        <div v-if="showBackIcon" class="btn back"  @click="handleScroll('back')">
            <CustomizedIcon name="arrow_up_small"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import CustomizedIcon from '@/components/CustomizedIcon.vue';


import type { FileProps } from '@/model/file';

const props = defineProps<{
    fileList: FileProps[];
    onDelete: (index: number) => void;
}>();
const fileViewRef = ref<HTMLDivElement | null>(null)
const scrollViewRef = ref<HTMLDivElement | null>(null)
const offset = ref(0);
const showBackIcon = ref(false);

const showFrontIcon = ref(false);

// 判断文件是否为图片
const isImageFile = (file: FileProps): boolean => {
    if (!file.url) return false;
    const url = file.url.toLowerCase();
    const imageExts = ['.png', '.jpg', '.jpeg', '.bmp', '.gif', '.webp'];
    return imageExts.some(ext => url.includes(ext));
};

// 根据文件类型获取图标名称
const getFileIconName = (file: FileProps): string => {
    // 如果能够识别为图片，使用 picture 图标
    if (isImageFile(file)) {
        return 'picture';
    }
    
    // 根据文件扩展名判断图标类型
    const ext = getFileExtension(file).toLowerCase();
    
    // 根据扩展名映射到对应的图标名称
    const iconMap: Record<string, string> = {
        'pdf': 'file_pdf',
        'doc': 'file_doc',
        'docx': 'file_doc',
        'xls': 'file_xlsx',
        'xlsx': 'file_xlsx',
        'ppt': 'file_ppt',
        'pptx': 'file_ppt',
        'txt': 'file_txt',
        'md': 'file_markdown',
        'markdown': 'file_markdown',
        'html': 'file_html',
        'htm': 'file_html',
        'epub': 'file_epub',
        'csv': 'file_txt', // CSV 使用 txt 图标
    };
    
    // 如果找到了对应的图标，返回；否则返回默认的 file 图标
    return iconMap[ext] || 'file';
};

// 获取文件扩展名
const getFileExtension = (file: FileProps): string => {
    // 优先从文件名获取扩展名
    if (file.name) {
        const nameParts = file.name.split('.');
        if (nameParts.length > 1) {
            return nameParts.pop()?.toLowerCase() || '';
        }
    }
    // 如果文件名没有扩展名，尝试从 URL 获取
    if (file.url) {
        const url = file.url.toLowerCase();
        const match = url.match(/\.([a-z0-9]+)(?:[?#]|$)/);
        return match ? match[1] : '';
    }
    return '';
};

// 获取文件显示名称
const getFileName = (file: FileProps): string => {
    console.log('file', file)
    return file.name || '';
};

// 格式化文件大小
const formatFileSize = (bytes?: number): string => {
    if (!bytes || bytes === 0) return '';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + sizes[i];
};


const handleScroll = (type: string) => {
    let _offset = fileViewRef.value?.clientWidth || 0;
    let _scrollLeft = scrollViewRef.value?.scrollLeft || 0;
    switch (type) {
        case 'back':
            scrollViewRef.value?.scrollTo({
                left: _scrollLeft + _offset,
                behavior: 'smooth'
            })
            offset.value = _scrollLeft + _offset;
            break;
        case 'front':
            scrollViewRef.value?.scrollTo({
                left: _scrollLeft - _offset,
                behavior: 'smooth'
            })
            offset.value = _scrollLeft - _offset;
            break
    }
}

watch(offset, (newValue, oldValue) => {
    if (newValue > 0) {
        showFrontIcon.value = true
    } else {
        showFrontIcon.value = false
    }
});
watch(props.fileList, (newValue, oldValue) => {
    let fileWidth = fileViewRef.value?.clientWidth || 0;
    let scrollViewWidth = scrollViewRef.value?.scrollWidth || 0;
    showBackIcon.value = scrollViewWidth > fileWidth
});

</script>



<style scoped>
.file-upload-container {
    padding-top: 8px;
    padding-left: 10px;
}

.img-item-container {
    border: 1px solid var(--td-component-border);
    width: var(--td-size-16);
    height: var(--td-size-16);
    margin-right: var(--td-comp-margin-s);
    margin-bottom: var(--td-comp-margin-s);
    box-sizing: content-box;
    position: relative;
    display: inline-block;
    background: var(--td-bg-color-container);
    border-radius: var(--td-radius-medium);
    overflow: hidden;
    box-shadow: var(--td-shadow-1);
}

.img-item-container.file-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* padding: var(--td-comp-paddingTB-xs); */
}

.upload-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
    border-radius: inherit;
}

.upload-progress-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.upload-progress-text {
    color: var(--td-text-color-anti);
    font-size: 12px;
    font-weight: 600;
}

.img-item-container.uploading {
    opacity: 0.9;
}

.file-icon-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    gap: 4px;
    padding: 6px 4px;
    box-sizing: border-box;
}

.file-icon {
    width: 24px;
    height: 24px;
    color: var(--td-text-color-secondary);
    flex-shrink: 0;
}

.file-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 2px;
    width: 100%;
    flex: 1;
    min-height: 0;
}

.file-name {
    font-size: 10px;
    line-height: 1.2;
    color: var(--td-text-color-placeholder);
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    display: block;
}

.file-size {
    font-size: 10px;
    line-height: 1.2;
    color: var(--td-text-color-placeholder);
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    display: block;
}

.img-item-container:hover .delete-container {
    display: flex;
}

.delete-container {
    display: none;
    position: absolute;
    align-items: center;
    justify-content: center;
    z-index: 2;
    right: var(--td-comp-paddingLR-xxs);
    top: var(--td-comp-paddingLR-xxs);
    background-color: var(--td-bg-color-secondarycontainer);
    border-radius: var(--td-radius-medium);
    border: 1px solid var(--td-border-level-2-color);
    cursor: pointer;
}

.delete-container:hover {
    cursor: pointer;
    color: var(--td-brand-color);
}

.img-scrollview-container {
    width: 100%;
    display: flex;
    overflow-x: auto;
    overflow-x: overlay;
    overflow-y: hidden;
}

.file-upload-container {
    position: relative;
}

.file-upload-container .btn {
    cursor: pointer;
    position: absolute;
    z-index: 2;
    background: var(--td-bg-color-container);
    box-shadow: var(--td-shadow-1);
    border-radius: 100%;
    width: var(--td-size-10);
    height: var(--td-size-10);
    display: flex;
    justify-content: center;
    align-items: center;
    top: calc(50% - var(--td-size-10) / 2);
}

.file-upload-container .btn.back {
    right: 0;
    transform: rotate(90deg);
}

.file-upload-container .btn.front {
    left: 0;
    transform: rotate(270deg);
}
</style>
