/**
 * 自定义图标组件
 * 
 * 用于显示SVG图标，支持不同尺寸和主题模式
 * 
 * @example
 * <!-- 基础用法 -->
 * <CustomizedIcon name="search" />
 * 
 * <!-- 指定尺寸 -->
 * <CustomizedIcon name="grid" size="xs" />
 * 
 * <!-- 原生图标（不应用暗色模式滤镜） -->
 * <CustomizedIcon name="send_fill" nativeIcon />
 * 
 * <!-- 禁用 hover 背景 -->
 * <CustomizedIcon name="arrow_up_small" :showHoverBg="false" />
 * 
 * <!-- 暗色主题 -->
 * <CustomizedIcon name="copy" theme="dark" />
 */
<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import type { ThemeProps } from '../model/type';
import { themePropsDefaults } from '../model/type';

// 静态导入常用小图标（<3KB）
import arrow_down_medium from '../assets/icons/arrow_down_medium.svg?raw';
import arrow_right from '../assets/icons/arrow_right.svg?raw';
import arrow_up_small from '../assets/icons/arrow_up_small.svg?raw';
import copy_link from '../assets/icons/copy_link.svg?raw';
import deleteIcon from '../assets/icons/delete.svg?raw';
import file from '../assets/icons/file.svg?raw';
import fullscreen from '../assets/icons/fullscreen.svg?raw';
import fullscreen_exit from '../assets/icons/fullscreen_exit.svg?raw';
import grid from '../assets/icons/grid.svg?raw';
import logout_close from '../assets/icons/logout_close.svg?raw';
import more from '../assets/icons/more.svg?raw';
import new_conversation from '../assets/icons/new_conversation.svg?raw';
import pause_dark from '../assets/icons/pause_dark.svg?raw';
import pause from '../assets/icons/pause.svg?raw';
import picture from '../assets/icons/picture.svg?raw';
import quit from '../assets/icons/quit.svg?raw';
import read from '../assets/icons/read.svg?raw';
import record from '../assets/icons/record.svg?raw';
import refresh from '../assets/icons/refresh.svg?raw';
import search from '../assets/icons/search.svg?raw';
import send_dark from '../assets/icons/send_dark.svg?raw';
import send_fill from '../assets/icons/send_fill.svg?raw';
import send from '../assets/icons/send.svg?raw';
import sendStop from '../assets/icons/sendStop.svg?raw';
import share from '../assets/icons/share.svg?raw';
import star from '../assets/icons/star.svg?raw';
import tencent_docs from '../assets/icons/tencent_docs.svg?raw';
import thumbs_down from '../assets/icons/thumbs_down.svg?raw';
import thumbs_up from '../assets/icons/thumbs_up.svg?raw';
import url from '../assets/icons/url.svg?raw';
import voice_input from '../assets/icons/voice_input.svg?raw';

// 静态 SVG 映射表（常用小图标 <3KB）
const staticSvgMap: Record<string, string> = {
    arrow_down_medium,
    arrow_right,
    arrow_up_small,
    copy_link,
    delete: deleteIcon,
    file,
    fullscreen,
    fullscreen_exit,
    grid,
    logout_close,
    more,
    new_conversation,
    pause_dark,
    pause,
    picture,
    quit,
    read,
    record,
    refresh,
    search,
    send_dark,
    send_fill,
    send,
    sendStop,
    share,
    star,
    tencent_docs,
    thumbs_down,
    thumbs_up,
    url,
    voice_input,
};

// 大体积图标按需加载映射（>=3KB）
const lazyIconLoaders: Record<string, () => Promise<{ default: string }>> = {
    thinking: () => import('../assets/icons/thinking.svg?raw'),   // 1.04 MB
    setting: () => import('../assets/icons/setting.svg?raw'),     // 7.69 KB
    loading: () => import('../assets/icons/loading.svg?raw'),     // 4.47 KB
    sidebar: () => import('../assets/icons/sidebar.svg?raw'),     // 4.22 KB
    stars: () => import('../assets/icons/stars.svg?raw'),         // 3.42 KB
    copy: () => import('../assets/icons/copy.svg?raw'),           // 3.15 KB
};

/**
 * 组件属性接口
 */
interface Props extends ThemeProps {
    /** SVG图标的名称，对应 src/assets/icons 目录下的文件名（不含扩展名） */
    name: string;
    /** 图标尺寸，可选值：'xs' | 's' | 'm' | 'l' | 'xl' */
    size?: 'xs' | 's' | 'm' | 'l' | 'xl';
    /** 是否使用原生图标样式（不应用主题滤镜），适用于彩色图标 */
    nativeIcon?: boolean;
    /** hover是否显示背景色 */
    showHoverBg?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'm',
  nativeIcon: false,
  showHoverBg: true,
  ...themePropsDefaults,
})

// 用于存储动态加载的 SVG 内容
const lazySvgContent = ref<string>('');
const isLoading = ref(false);

/**
 * 计算 SVG 内容
 */
const svgContent = computed(() => {
    // 优先从静态映射获取
    const staticContent = staticSvgMap[props.name];
    if (staticContent) {
        return processSvg(staticContent);
    }
    
    // 返回动态加载的内容
    if (lazySvgContent.value) {
        return processSvg(lazySvgContent.value);
    }
    
    return '';
});

/**
 * 处理 SVG 内容
 */
function processSvg(content: string): string {
    return content
        .replace(/<svg([^>]*)\s+width="[^"]*"/, '<svg$1')
        .replace(/<svg([^>]*)\s+height="[^"]*"/, '<svg$1')
        .replace(/<svg/, '<svg class="svg-inner"');
}

/**
 * 加载懒加载图标
 */
async function loadLazyIcon(name: string) {
    const loader = lazyIconLoaders[name];
    if (loader && !staticSvgMap[name] && !lazySvgContent.value) {
        isLoading.value = true;
        try {
            const module = await loader();
            lazySvgContent.value = module.default;
        } catch (e) {
            console.warn(`[CustomizedIcon] Failed to load SVG: ${name}`, e);
        } finally {
            isLoading.value = false;
        }
    }
}

// 监听 name 变化，按需加载
watch(() => props.name, (newName) => {
    if (lazyIconLoaders[newName]) {
        lazySvgContent.value = '';
        loadLazyIcon(newName);
    }
}, { immediate: true });

onMounted(() => {
    if (lazyIconLoaders[props.name]) {
        loadLazyIcon(props.name);
    }
});
</script>

<template>
    <span 
        class="customeized-icon" 
        :class="{
            'showHoverBg': showHoverBg,
            'normal': !nativeIcon,
            'svg-dark-mode': theme === 'dark',
            [`size-${size}`]: size 
        }" 
        aria-hidden="true"
        v-html="svgContent"
    />
</template>

<style scoped>
/* 内部 SVG 样式 */
:deep(.svg-inner) {
    width: 100%;
    height: 100%;
}

/* 暗色模式滤镜 - 仅对非原生图标生效 */
.svg-dark-mode.normal :deep(svg) {
    filter: brightness(0) invert(1);
}

/* 尺寸样式 - xs: 超小 */
.customeized-icon.size-xs {   
    width: var(--td-comp-size-xxxs, 16px);
    height: var(--td-comp-size-xxxs, 16px);
}

/* 尺寸样式 - s: 小 */
.customeized-icon.size-s {   
    width: var(--td-comp-size-xs, 20px);
    height: var(--td-comp-size-xs, 20px);
    padding: var(--td-comp-paddingLR-xxs, 2px);
}

/* 尺寸样式 - m: 中（默认） */
.customeized-icon.size-m {
    width: var(--td-comp-size-m, 32px);
    height: var(--td-comp-size-m, 32px);
    padding: var(--td-pop-padding-m, 4px);
}

/* 尺寸样式 - l: 大 */
.customeized-icon.size-l {
    width: var(--td-comp-size-l, 40px);
    height: var(--td-comp-size-l, 40px);
    padding: var(--td-pop-padding-l, 8px);
}

/* 尺寸样式 - xl: 超大 */
.customeized-icon.size-xl {
    width: var(--td-comp-size-xl, 48px);
    height: var(--td-comp-size-xl, 48px);
    padding: var(--td-pop-padding-xl, 12px);
}

/* 基础样式 */
.customeized-icon {
    border-radius: var(--td-radius-default, 4px);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    transition: background-color 0.2s ease;
}

/* hover 背景效果 - 仅对非原生图标生效 */
.customeized-icon.normal.showHoverBg:hover {
    background-color: var(--td-bg-color-container-active, rgba(0, 0, 0, 0.05));
}

/* 暗色模式下的 hover 背景 */
.customeized-icon.svg-dark-mode.normal.showHoverBg:hover {
    background-color: var(--td-bg-color-container-active, rgba(255, 255, 255, 0.1));
}
</style>
