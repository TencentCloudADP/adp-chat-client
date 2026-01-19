<template>
    <div ref="fileViewRef" v-if="fileList.length > 0" class="file-upload-container">
        <div ref="scrollViewRef" class="img-scrollview-container">
            <div v-for="(img, index) in fileList" :key="img.uid || img.url || index" class="img-item-container">
                <t-image fit="contain" :src="img.url" :style="{ width: '70px', height: '70px' }" />
                <span class="delete-container" @click="handleDelete(index)">
                    <CustomizedIcon name="delete" :theme="theme" />
                </span>
            </div>
        </div>
        <div v-if="showFrontIcon" class="btn front" @click="handleScroll('front')">
            <CustomizedIcon name="arrow_up_small" :theme="theme" />
        </div>
        <div v-if="showBackIcon" class="btn back" @click="handleScroll('back')">
            <CustomizedIcon name="arrow_up_small" :theme="theme" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Image as TImage } from 'tdesign-vue-next'
import CustomizedIcon from '../CustomizedIcon.vue'
import type { FileProps } from '../../model/file'
import type { ThemeProps } from '../../model/type'
import { themePropsDefaults } from '../../model/type'

interface Props extends ThemeProps {
    fileList: FileProps[];
}

const props = withDefaults(defineProps<Props>(), {
    ...themePropsDefaults,
    fileList: () => []
})

const emit = defineEmits<{
    (e: 'delete', index: number): void;
}>()

const fileViewRef = ref<HTMLDivElement | null>(null)
const scrollViewRef = ref<HTMLDivElement | null>(null)
const offset = ref(0)
const showBackIcon = ref(false)
const showFrontIcon = ref(false)

const handleDelete = (index: number) => {
    emit('delete', index)
}

const handleScroll = (type: string) => {
    const _offset = fileViewRef.value?.clientWidth || 0
    const _scrollLeft = scrollViewRef.value?.scrollLeft || 0
    switch (type) {
        case 'back':
            scrollViewRef.value?.scrollTo({
                left: _scrollLeft + _offset,
                behavior: 'smooth'
            })
            offset.value = _scrollLeft + _offset
            break
        case 'front':
            scrollViewRef.value?.scrollTo({
                left: _scrollLeft - _offset,
                behavior: 'smooth'
            })
            offset.value = _scrollLeft - _offset
            break
    }
}

watch(offset, (newValue) => {
    showFrontIcon.value = newValue > 0
})

watch(() => props.fileList, () => {
    const fileWidth = fileViewRef.value?.clientWidth || 0
    const scrollViewWidth = scrollViewRef.value?.scrollWidth || 0
    showBackIcon.value = scrollViewWidth > fileWidth
}, { deep: true })
</script>

<style scoped>
.file-upload-container {
    padding-top: 8px;
    padding-left: 10px;
    position: relative;
}

.img-item-container {
    border: 1px solid var(--td-component-border);
    width: var(--td-size-16);
    height: var(--td-size-16);
    margin-right: var(--td-comp-margin-s);
    box-sizing: content-box;
    position: relative;
    display: inline-block;
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
