/**
 * 自定义图标组件
 *
 * 用于显示SVG图标，支持不同尺寸和主题模式
 *
 * @example
 * <!-- 基础用法（本地图标） -->
 * <CustomizedIcon name="loading" />
 *
 * <!-- 指定尺寸 -->
 * <CustomizedIcon name="voice_input" size="xs" />
 *
 * <!-- 原生图标（不应用暗色模式滤镜） -->
 * <CustomizedIcon name="send_fill" nativeIcon />
 *
 * <!-- 禁用 hover 背景 -->
 * <CustomizedIcon name="overlay" :showHoverBg="false" />
 *
 * <!-- 暗色主题 -->
 * <CustomizedIcon name="thinking" theme="dark" />
 *
 * <!-- 远程图标（复用 v-icon 图标库，无需安装 @tencent/vhtml-ui） -->
 * <CustomizedIcon name="basic_newchat_line" remote size="16" />
 * <CustomizedIcon name="arrow_down_small_line" remote :rotate="-90" />
 */
<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ThemeProps } from '../model/type';
import { themePropsDefaults } from '../model/type';

// 记录已注入的 SVG sprite 文件路径，每个文件只注入一次
const injectedSprites = new Set<string>();
// 记录正在注入的 sprite 路径，避免并发重复注入
const pendingSprites = new Map<string, Promise<void>>();

/**
 * 加载本地 SVG sprite 并注入到 DOM（隐藏 svg），供 <use> 引用
 */
function injectSvgSprite(url: string): Promise<void> {
    if (injectedSprites.has(url)) return Promise.resolve();
    if (pendingSprites.has(url)) return pendingSprites.get(url)!;
    
    const promise = fetch(url)
        .then(res => res.text())
        .then(svgText => {
            const container = document.createElement('div');
            container.style.display = 'none';
            container.innerHTML = svgText;
            document.body.appendChild(container);
            injectedSprites.add(url);
            pendingSprites.delete(url);
        })
        .catch(err => {
            pendingSprites.delete(url);
            throw err;
        });
    
    pendingSprites.set(url, promise);
    return promise;
}

// 静态导入所有图标（仅保留项目中实际使用的图标）
import arrow_down_medium from '../assets/icons/arrow_down_medium.svg?raw';
import overlay from '../assets/icons/overlay.svg?raw';
import loading from '../assets/icons/loading.svg?raw';
import logout_close from '../assets/icons/logout_close.svg?raw';
import pause_dark from '../assets/icons/pause_dark.svg?raw';
import pause from '../assets/icons/pause.svg?raw';
import send_dark from '../assets/icons/send_dark.svg?raw';
import send_fill from '../assets/icons/send_fill.svg?raw';
import send from '../assets/icons/send.svg?raw';
import thinking from '../assets/icons/thinking.svg?raw';
import voice_input from '../assets/icons/voice_input.svg?raw';
import open_file_list from '../assets/icons/open_file_list.svg?raw';
import setting from '../assets/icons/setting.svg?raw';
import stars from '../assets/icons/stars.svg?raw';
import url from '../assets/icons/url.svg?raw';
import quit from '../assets/icons/quit.svg?raw';
import basic_star_line from '../assets/icons/basic_star_line.svg?raw';
import basic_star_fill from '../assets/icons/basic_star_fill.svg?raw';

// SVG 映射表（仅保留项目中实际使用的图标）
const svgMap: Record<string, string> = {
    arrow_down_medium,
    overlay,
    loading,
    logout_close,
    pause_dark,
    pause,
    send_dark,
    send_fill,
    send,
    thinking,
    voice_input,
    open_file_list,
    setting,
    stars,
    url,
    quit,
    basic_star_line,
    basic_star_fill,
};

// 用于生成唯一 id 的计数器
let idCounter = 0;

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
    /** 自定义颜色 */
    color?: string;
    /** 是否使用远程图标库（加载本地 SVG sprite，渲染为 <use href="#prefix-name"/>） */
    remote?: boolean;
    /** 远程图标前缀，默认 'v-'，与 v-icon 一致 */
    remotePrefix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'm',
  nativeIcon: false,
  showHoverBg: true,
  color: '',
  remote: false,
  remotePrefix: 'v-',
  ...themePropsDefaults,
})

// 本地 SVG sprite 文件路径
const ICONFONT_SVG_URL = new URL('../assets/icons/remote/iconfont.svg', import.meta.url).href;

// 计算内联样式（仅非 nativeIcon 时应用 color）
const iconStyle = computed(() => {
    if (props.color && !props.nativeIcon) {
        return { color: props.color };
    }
    return {};
});

// 为每个组件实例生成唯一 id
const uniqueId = `icon-${idCounter++}-${Math.random().toString(36).slice(2, 8)}`;

// 远程图标模式：注入本地 SVG sprite 到 DOM，并生成 href
// 使用 Promise 异步加载，加载中或失败时返回空字符串
const remoteInjected = ref(false);
if (props.remote) {
    injectSvgSprite(ICONFONT_SVG_URL).then(() => {
        remoteInjected.value = true;
    }).catch(err => {
        console.error('[CustomizedIcon] 加载图标 sprite 失败:', err);
    });
}

const remoteHref = computed(() => {
    if (!props.remote || !remoteInjected.value) return '';
    return `#${props.remotePrefix}${props.name}`;
});

/**
 * 计算 SVG 内容
 */
const svgContent = computed(() => {
    const content = svgMap[props.name];
    if (content) {
        return processSvg(content, props.nativeIcon);
    }
    return '';
});

/**
 * 处理 SVG 内容，替换 id 避免冲突，并将颜色改为 currentColor 以支持 CSS color 控制
 * @param content SVG 内容
 * @param isNative 是否为原生图标（原生图标不替换颜色）
 */
function processSvg(content: string, isNative: boolean): string {
    let processed = content
        .replace(/<svg([^>]*)\s+width="[^"]*"/, '<svg$1')
        .replace(/<svg([^>]*)\s+height="[^"]*"/, '<svg$1')
        .replace(/<svg/, '<svg class="svg-inner"');
    
    // 仅非原生图标时，将 fill 颜色替换为 currentColor
    if (!isNative) {
        // 匹配 fill="xxx" 但排除 fill="none" 和 fill="url(...)"
        processed = processed.replace(/fill="(?!none|url)[^"]*"/g, 'fill="currentColor"');
        // 移除 fill-opacity 属性（因为使用 currentColor 后不需要）
        processed = processed.replace(/\s*fill-opacity="[^"]*"/g, '');
        // 移除内联 style 中的 fill 相关样式
        processed = processed.replace(/style="[^"]*fill:[^;]*;?[^"]*fill-opacity:[^;]*;?[^"]*"/g, '');
    }
    
    // 收集所有需要替换的 id
    const idMatches = processed.match(/id="([^"]+)"/g);
    if (idMatches) {
        const ids = idMatches.map(m => m.match(/id="([^"]+)"/)?.[1]).filter(Boolean) as string[];
        // 为每个 id 创建唯一替换
        ids.forEach(id => {
            const newId = `${id}-${uniqueId}`;
            const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // 替换 id 定义
            processed = processed.replace(new RegExp(`id="${escapedId}"`, 'g'), `id="${newId}"`);
            // 替换 url(#id) 引用
            processed = processed.replace(new RegExp(`url\\(#${escapedId}\\)`, 'g'), `url(#${newId})`);
            // 替换 href="#id" 引用
            processed = processed.replace(new RegExp(`href="#${escapedId}"`, 'g'), `href="#${newId}"`);
            // 替换 xlink:href="#id" 引用
            processed = processed.replace(new RegExp(`xlink:href="#${escapedId}"`, 'g'), `xlink:href="#${newId}"`);
        });
    }
    
    return processed;
}
</script>

<template>
    <!-- 本地图标：使用 v-html 渲染 SVG 字符串 -->
    <span 
        v-if="!remote"
        class="customeized-icon" 
        :class="{
            'showHoverBg': showHoverBg,
            'normal': !nativeIcon,
            'svg-dark-mode': theme === 'dark',
            [`size-${size}`]: size 
        }"
        :style="iconStyle"
        aria-hidden="true"
        v-html="svgContent"
    />
    <!-- 远程图标：使用 <use> 引用 iconfont.js 注入的 symbol -->
    <span
        v-else
        class="customeized-icon" 
        :class="{
            'showHoverBg': showHoverBg,
            'normal': !nativeIcon,
            'svg-dark-mode': theme === 'dark',
            [`size-${size}`]: size 
        }"
        :style="iconStyle"
        aria-hidden="true"
    >
        <svg class="svg-inner" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <use :href="remoteHref" />
        </svg>
    </span>
</template>

<style scoped>
/* 内部 SVG 样式 */
:deep(.svg-inner) {
    width: 100%;
    height: 100%;
}

/* 暗色模式颜色 - 仅对非原生图标生效 */
.svg-dark-mode.normal {
    color: rgba(255, 255, 255, 0.9);
}

/* 亮色模式默认颜色 */
.customeized-icon.normal:not(.svg-dark-mode) {
    color: rgba(0, 0, 0, 0.6);
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
}

/* 基础样式 */
.customeized-icon {
    border-radius: var(--td-radius-default, 4px);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    transition: background-color 0.2s ease, color 0.2s ease;
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
