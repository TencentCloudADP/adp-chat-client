<template>
    <div ref="fileViewRef" v-if="fileList.length > 0" class="file-upload-container">
        <div ref="scrollViewRef" class="img-scrollview-container">
            <div v-for="(img, index) in fileList" class="img-item-container" :class="{ 'file-item': !isImageFile(img) }">
                <!-- 图片文件显示图片 -->
                <t-image 
                    v-if="isImageFile(img)" 
                    fit="contain" 
                    :src="img.url" 
                    :style="{ width: '70px', height: '70px' }" 
                />
                <!-- 非图片文件显示文档图标 -->
                <div v-else class="file-icon-container">
                    <CustomizedIcon name="file" class="file-icon" />
                    <span class="file-extension">{{ getFileExtension(img) || 'file' }}</span>
                </div>
                <span class="delete-container"  @click="onDelete(index)">
                    <CustomizedIcon name="delete"/>
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

// 获取文件扩展名
const getFileExtension = (file: FileProps): string => {
    if (!file.url) return '';
    const url = file.url.toLowerCase();
    const match = url.match(/\.([a-z0-9]+)(?:[?#]|$)/);
    return match ? match[1] : '';
};

// 获取文件显示名称
const getFileName = (file: FileProps): string => {
    if (file.name) return file.name;
    if (file.url) {
        const urlParts = file.url.split('/');
        const fileName = urlParts[urlParts.length - 1].split('?')[0];
        return fileName || '文件';
    }
    return '文件';
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
    box-sizing: content-box;
    position: relative;
    display: inline-block;
    background: var(--td-bg-color-container);
}

.img-item-container.file-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--td-comp-paddingTB-xs);
}

.file-icon-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    gap: var(--td-comp-margin-xs);
}

.file-icon {
    width: 32px;
    height: 32px;
    color: var(--td-text-color-secondary);
}

.file-extension {
    font-size: 10px;
    color: var(--td-text-color-placeholder);
    text-transform: uppercase;
    font-weight: 500;
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
