<template>
    <div
        ref="iconWrapper"
        class="animated-icon"
        :class="[
            'animated-icon--' + animation,
            { 'animated-icon--custom': hasCustomIcon },
            currentAction ? 'animated-icon--action-' + currentAction : ''
        ]"
        :style="wrapperStyle"
    >
        <!-- 自定义图标插槽：优先级最高 -->
        <slot v-if="$slots.default"></slot>

        <!-- 自定义图标 URL -->
        <img
            v-else-if="icon"
            class="animated-icon__img"
            :src="icon"
            :alt="alt"
        />

        <!-- 内置数字人 SVG 默认图标 -->
        <svg
            v-else
            class="animated-icon__svg"
            width="49"
            height="40"
            viewBox="0 0 49 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <!-- 外层黑色六边形群 -->
            <g ref="hexOuter" class="animated-icon__hex-outer idle">
                <path d="M22.0045 2.04865C23.0877 1.42331 24.4221 1.42331 25.5052 2.04865L37.1629 8.77923C38.246 9.40457 38.9133 10.5602 38.9133 11.8109V25.2721C38.9133 26.5228 38.246 27.6784 37.1629 28.3038L25.5052 35.0344C24.4221 35.6597 23.0877 35.6597 22.0045 35.0344L10.3468 28.3038C9.2637 27.6784 8.59648 26.5228 8.59648 25.2721V11.8109C8.59648 10.5602 9.2637 9.40457 10.3468 8.77923L22.0045 2.04865Z" fill="black"/>
                <path d="M20.7543 2.21173C21.8374 1.5864 23.1719 1.5864 24.255 2.21173L35.9127 8.94232C36.9958 9.56765 37.663 10.7233 37.663 11.974V25.4352C37.663 26.6858 36.9958 27.8415 35.9127 28.4669L24.255 35.1974C23.1719 35.8228 21.8374 35.8228 20.7543 35.1974L9.09657 28.4669C8.01346 27.8415 7.34623 26.6858 7.34623 25.4352V11.974C7.34623 10.7233 8.01346 9.56765 9.09657 8.94232L20.7543 2.21173Z" fill="black"/>
                <path d="M19.5043 3.46271C20.5874 2.83737 21.9219 2.83737 23.005 3.46271L34.6627 10.1933C35.7458 10.8186 36.413 11.9743 36.413 13.225V26.6861C36.413 27.9368 35.7458 29.0925 34.6627 29.7178L23.005 36.4484C21.9219 37.0737 20.5874 37.0737 19.5043 36.4484L7.84657 29.7178C6.76346 29.0925 6.09623 27.9368 6.09623 26.6861V13.225C6.09623 11.9743 6.76346 10.8186 7.84657 10.1933L19.5043 3.46271Z" fill="black"/>
                <path d="M18.2538 3.62677C19.3369 3.00143 20.6714 3.00143 21.7545 3.62677L33.4122 10.3574C34.4953 10.9827 35.1625 12.1384 35.1625 13.389V26.8502C35.1625 28.1009 34.4953 29.2566 33.4122 29.8819L21.7545 36.6125C20.6714 37.2378 19.3369 37.2378 18.2538 36.6125L6.59609 29.8819C5.51297 29.2566 4.84575 28.1009 4.84575 26.8502V13.389C4.84575 12.1384 5.51297 10.9827 6.59609 10.3574L18.2538 3.62677Z" fill="black"/>
                <path d="M17.0033 4.87677C18.0864 4.25143 19.4209 4.25143 20.504 4.87677L32.1617 11.6074C33.2448 12.2327 33.9121 13.3884 33.9121 14.639V28.1002C33.9121 29.3509 33.2448 30.5066 32.1617 31.1319L20.504 37.8625C19.4209 38.4878 18.0864 38.4878 17.0033 37.8625L5.3456 31.1319C4.26248 30.5066 3.59526 29.3509 3.59526 28.1002V14.639C3.59526 13.3884 4.26248 12.2327 5.3456 11.6074L17.0033 4.87677Z" fill="black"/>
                <path d="M15.7531 5.04181C16.8362 4.41647 18.1706 4.41647 19.2538 5.04181L30.9115 11.7724C31.9946 12.3977 32.6618 13.5534 32.6618 14.8041V28.2652C32.6618 29.5159 31.9946 30.6716 30.9115 31.2969L19.2538 38.0275C18.1706 38.6529 16.8362 38.6529 15.7531 38.0275L4.09535 31.2969C3.01224 30.6716 2.34501 29.5159 2.34501 28.2652V14.8041C2.34501 13.5534 3.01224 12.3977 4.09535 11.7724L15.7531 5.04181Z" fill="black"/>
            </g>
            <!-- 白色内六边形 -->
            <g ref="hexInner" class="animated-icon__hex-inner idle">
                <path d="M22.7547 4.11555C23.3736 3.75821 24.1361 3.75821 24.7551 4.11555L35.7476 10.4621C36.3665 10.8194 36.7478 11.4798 36.7478 12.1945V24.8875C36.7478 25.6022 36.3665 26.2626 35.7476 26.6199L24.7551 32.9665C24.1361 33.3238 23.3736 33.3238 22.7547 32.9665L11.7622 26.6199C11.1432 26.2626 10.762 25.6022 10.762 24.8875V12.1945C10.762 11.4798 11.1432 10.8194 11.7622 10.4621L22.7547 4.11555Z" fill="white"/>
            </g>
            <!-- 右眼 -->
            <g ref="eyeRight" class="animated-icon__eye-right idle">
                <path d="M32.506 17.9111L27.5962 16.137L32.0685 13.3243" stroke="black" stroke-width="2.0673" stroke-miterlimit="2.61313" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <!-- 左眼 -->
            <g ref="eyeLeft" class="animated-icon__eye-left idle">
                <path d="M20.761 13.3126C20.815 13.3352 20.8693 13.3572 20.9242 13.3775C20.9242 13.3989 20.9242 13.4203 20.9242 13.4424C20.978 13.4531 21.0319 13.4638 21.0874 13.4749C21.0874 13.4963 21.0874 13.5177 21.0874 13.5398C21.1099 13.5466 21.1324 13.5534 21.1555 13.5604C21.2801 13.6185 21.3657 13.6997 21.4647 13.7934C21.4831 13.8103 21.5015 13.8272 21.5204 13.8447C21.6253 13.9424 21.7182 14.0424 21.8052 14.1565C21.8308 14.1887 21.8564 14.2208 21.8828 14.2539C22.0036 14.4234 22.0817 14.6158 22.1642 14.8057C22.1751 14.8296 22.186 14.8535 22.1972 14.8781C22.3223 15.1725 22.3007 15.5143 22.3008 15.8282C22.3012 15.8623 22.3016 15.8964 22.3021 15.9315C22.3026 16.2158 22.3021 16.5137 22.1316 16.7533C22.0936 16.8282 22.0562 16.9031 22.0194 16.9785C21.7748 17.4788 21.4219 17.8198 20.9568 18.1166C20.9356 18.1336 20.9144 18.1505 20.8926 18.168C20.8046 18.2291 20.7151 18.2611 20.6142 18.2972C20.5775 18.3106 20.5408 18.3241 20.503 18.3379C20.1903 18.4356 19.8731 18.4516 19.5475 18.4493C19.5113 18.4496 19.4751 18.4499 19.4377 18.4501C19.1302 18.4494 18.8881 18.4036 18.6073 18.2789C18.5591 18.2645 18.5109 18.2503 18.4625 18.2363C18.3232 18.1917 18.2235 18.1231 18.1102 18.0323C18.0509 17.9832 18.0509 17.9832 17.971 17.9401C17.518 17.6585 17.185 17.1518 17.0165 16.6559C17.0017 16.6145 17.0017 16.6145 16.9866 16.5722C16.8846 16.2783 16.8732 16.0067 16.8758 15.6984C16.876 15.6655 16.8761 15.6326 16.8763 15.5987C16.8766 15.5183 16.8772 15.4379 16.8779 15.3575C16.8994 15.3575 16.9209 15.3575 16.9431 15.3575C16.944 15.3308 16.9448 15.3041 16.9457 15.2766C16.9721 14.7595 17.2022 14.3431 17.5594 13.97C17.6301 13.8972 17.6301 13.8972 17.6936 13.8138C17.853 13.6202 18.0508 13.5015 18.281 13.4099C18.3014 13.3871 18.3014 13.3871 18.3222 13.3638C18.4492 13.2491 18.6441 13.2183 18.8064 13.1692C18.8591 13.1531 18.9114 13.1358 18.9636 13.1182C19.5061 12.9539 20.2795 12.9938 20.761 13.3126Z" fill="#1D1D1A"/>
            </g>
            <!-- 蓝色角标 -->
            <g ref="hexCorner" class="animated-icon__hex-corner idle">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M38.6943 0.211332C39.1823 -0.0705001 39.7834 -0.0703882 40.2715 0.211332L47.2949 4.26797C47.7829 4.54984 48.0839 5.07047 48.084 5.63418V13.7475C48.0839 14.3112 47.7829 14.8318 47.2949 15.1137L42.5645 17.8461V8.78164C42.5645 8.21791 42.2643 7.69643 41.7764 7.41446L34 2.92227L38.6943 0.211332Z" fill="#4A70FF"/>
            </g>
        </svg>
    </div>
</template>

<script>
/**
 * AnimatedIcon 公共动效图标组件
 *
 * 功能：
 *   1. 内置「数字人」动效：眼睛跟随鼠标 / 随机眨眼 / 六边形分层视差
 *   2. 通用「自定义图标」动效：浮动 / 闪烁 / 摇摆 / 脉冲（适配传入的 icon 或 slot）
 *   3. 主动「动作」触发：通过 prop(action) 或 ref.playAction() 命令式播放一次性动作
 */

// 数字人动作配置
const DIGITAL_HUMAN_ACTIONS = {
    blink: { duration: 250 },
    nod: { duration: 600 },
    'shake-head': { duration: 700 },
    lookLeft: { duration: 600 },
    lookRight: { duration: 600 },
    lookUp: { duration: 600 },
    lookDown: { duration: 600 },
    happy: { duration: 800 },
    surprise: { duration: 700 }
};

// 通用图标动作配置
const CUSTOM_ICON_ACTIONS = {
    bounce: { duration: 600 },
    flash: { duration: 600 },
    wiggle: { duration: 700 },
    spin: { duration: 800 },
    pop: { duration: 500 }
};

const DIGITAL_HUMAN_CONFIG = {
    maxMove: 3,
    maxMoveDownMultiplier: 4,
    hexMaxRotate: 2.5,
    hexMaxMove: 2,
    hexMaxMoveDownMultiplier: 2.5,
    hexMaxMoveUpMultiplier: 1.5,
    maxDistance: 300,
    blinkIntervalMin: 2500,
    blinkIntervalRange: 3500,
    blinkStartDelay: 2000
};

export default {
    name: 'AnimatedIcon',
    props: {
        icon: { type: String, default: '' },
        alt: { type: String, default: 'icon' },
        animation: {
            type: String,
            default: 'digital-human',
            validator: v => ['digital-human', 'float', 'pulse', 'shake', 'none'].includes(v)
        },
        width: { type: [Number, String], default: 49 },
        height: { type: [Number, String], default: 40 },
        trackMouse: { type: Boolean, default: true },
        action: { type: String, default: '' }
    },
    data () {
        return {
            isMouseTracking: false,
            blinkTimeout: null,
            currentAction: '',
            actionTimer: null,
            throttleTimer: null,
            lastMouseMoveTime: 0,
            cachedRect: null,
            rafId: null,
            pendingMouseEvent: null
        };
    },
    watch: {
        action (val) {
            if (val) this.playAction(val);
        }
    },
    computed: {
        hasCustomIcon () {
            return !!this.icon || !!this.$slots.default;
        },
        useDigitalHuman () {
            return !this.hasCustomIcon && this.animation === 'digital-human';
        },
        wrapperStyle () {
            const toCss = v => (typeof v === 'number' ? v + 'px' : v);
            return {
                width: toCss(this.width),
                height: toCss(this.height)
            };
        }
    },
    mounted () {
        if (this.useDigitalHuman) {
            this.initDigitalHumanAnimation();
        }
        if (this.action) {
            this.$nextTick(() => this.playAction(this.action));
        }
    },
    beforeUnmount () {
        this.destroyDigitalHumanAnimation();
        if (this.actionTimer) {
            clearTimeout(this.actionTimer);
            this.actionTimer = null;
        }
    },
    methods: {
        initDigitalHumanAnimation () {
            if (this.trackMouse) {
                this.mouseMoveHandler = this.handleMouseMove.bind(this);
                this.mouseLeaveHandler = this.freezeEyePosition.bind(this);
                document.addEventListener('mousemove', this.mouseMoveHandler, { passive: true });
                document.addEventListener('mouseleave', this.mouseLeaveHandler);
                this.resizeHandler = this.clearCachedRect.bind(this);
                this.scrollHandler = this.clearCachedRect.bind(this);
                window.addEventListener('resize', this.resizeHandler);
                window.addEventListener('scroll', this.scrollHandler, true);
            }
            this.blinkTimeout = setTimeout(this.triggerBlink, DIGITAL_HUMAN_CONFIG.blinkStartDelay);
        },
        destroyDigitalHumanAnimation () {
            if (this.mouseMoveHandler) {
                document.removeEventListener('mousemove', this.mouseMoveHandler);
                this.mouseMoveHandler = null;
            }
            if (this.mouseLeaveHandler) {
                document.removeEventListener('mouseleave', this.mouseLeaveHandler);
                this.mouseLeaveHandler = null;
            }
            if (this.resizeHandler) {
                window.removeEventListener('resize', this.resizeHandler);
                this.resizeHandler = null;
            }
            if (this.scrollHandler) {
                window.removeEventListener('scroll', this.scrollHandler, true);
                this.scrollHandler = null;
            }
            if (this.blinkTimeout) {
                clearTimeout(this.blinkTimeout);
                this.blinkTimeout = null;
            }
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
                this.rafId = null;
            }
            this.cachedRect = null;
            this.pendingMouseEvent = null;
        },
        getSvgScreenRect () {
            if (this.cachedRect) return this.cachedRect;
            const wrapper = this.$refs.iconWrapper;
            if (!wrapper) return null;
            const svg = wrapper.querySelector('svg');
            if (!svg) return null;
            this.cachedRect = svg.getBoundingClientRect();
            return this.cachedRect;
        },
        clearCachedRect () {
            this.cachedRect = null;
        },
        freezeEyePosition () {
            this.isMouseTracking = false;
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
                this.rafId = null;
            }
            this.pendingMouseEvent = null;
            this.cachedRect = null;
        },
        setIdleState () {
            const { eyeLeft, eyeRight, hexOuter, hexInner, hexCorner } = this.$refs;
            [eyeLeft, eyeRight, hexOuter, hexInner, hexCorner].forEach(el => {
                if (el) {
                    el.classList.add('idle');
                    el.style.transform = '';
                }
            });
            this.isMouseTracking = false;
        },
        removeIdleState () {
            const { eyeLeft, eyeRight, hexOuter, hexInner, hexCorner } = this.$refs;
            [eyeLeft, eyeRight, hexOuter, hexInner, hexCorner].forEach(el => {
                if (el) el.classList.remove('idle');
            });
            this.isMouseTracking = true;
        },
        handleMouseMove (e) {
            if (this.rafId) return;
            this.pendingMouseEvent = e;
            this.rafId = requestAnimationFrame(() => {
                this.rafId = null;
                const ev = this.pendingMouseEvent;
                if (!ev) return;
                this.applyMouseMove(ev);
            });
        },
        applyMouseMove (e) {
            const rect = this.getSvgScreenRect();
            if (!rect) return;
            const svgCenterX = rect.left + rect.width / 2;
            const svgCenterY = rect.top + rect.height / 2;
            const dx = e.clientX - svgCenterX;
            const dy = e.clientY - svgCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 2) return;

            const ratio = Math.min(Math.pow(distance / DIGITAL_HUMAN_CONFIG.maxDistance, 0.5), 1);
            const eyeMaxMoveX = dx < 0 ? 5 : DIGITAL_HUMAN_CONFIG.maxMove;
            const moveX = (dx / distance) * eyeMaxMoveX * ratio;
            const maxMoveY = dy > 0
                ? DIGITAL_HUMAN_CONFIG.maxMove * DIGITAL_HUMAN_CONFIG.maxMoveDownMultiplier
                : DIGITAL_HUMAN_CONFIG.maxMove;
            const moveY = (dy / distance) * maxMoveY * ratio;

            const hexRotate = (dx / Math.max(distance, 1)) * DIGITAL_HUMAN_CONFIG.hexMaxRotate * ratio;
            const hexMoveX = (dx / distance) * DIGITAL_HUMAN_CONFIG.hexMaxMove * ratio;
            const hexMaxMoveY = dy > 0
                ? DIGITAL_HUMAN_CONFIG.hexMaxMove * DIGITAL_HUMAN_CONFIG.hexMaxMoveDownMultiplier
                : DIGITAL_HUMAN_CONFIG.hexMaxMove * DIGITAL_HUMAN_CONFIG.hexMaxMoveUpMultiplier;
            const hexMoveY = (dy / distance) * hexMaxMoveY * ratio;

            if (!this.isMouseTracking) this.removeIdleState();

            const { eyeLeft, eyeRight, hexOuter, hexInner, hexCorner } = this.$refs;
            if (eyeLeft) eyeLeft.style.transform = `translate(${moveX}px, ${moveY}px)`;
            if (eyeRight) eyeRight.style.transform = `translate(${moveX}px, ${moveY}px)`;
            if (hexOuter) {
                hexOuter.style.transform = `rotate(${hexRotate * 0.7}deg) translate(${hexMoveX * 0.8}px, ${hexMoveY * 0.8}px)`;
            }
            if (hexInner) {
                hexInner.style.transform = `rotate(${hexRotate * 0.9}deg) translate(${hexMoveX}px, ${hexMoveY}px)`;
            }
            if (hexCorner) {
                hexCorner.style.transform = `rotate(${hexRotate * 1.2}deg) translate(${hexMoveX * 1.2}px, ${hexMoveY * 0.9}px)`;
            }
        },
        triggerBlink () {
            this.doBlink();
            this.blinkTimeout = setTimeout(
                this.triggerBlink,
                DIGITAL_HUMAN_CONFIG.blinkIntervalMin + Math.random() * DIGITAL_HUMAN_CONFIG.blinkIntervalRange
            );
        },
        doBlink () {
            const { eyeLeft, eyeRight } = this.$refs;
            if (!eyeLeft || !eyeRight) return;
            const leftPath = eyeLeft.querySelector('path');
            const rightPath = eyeRight.querySelector('path');
            if (!leftPath || !rightPath) return;

            leftPath.style.transformOrigin = '19.6px 15.8px';
            leftPath.style.transition = 'transform 0.08s ease-in-out';
            leftPath.style.transform = 'scaleY(0.1)';
            rightPath.style.transformOrigin = '30px 15.6px';
            rightPath.style.transition = 'transform 0.08s ease-in-out';
            rightPath.style.transform = 'scaleY(0.1)';

            setTimeout(() => {
                leftPath.style.transition = 'transform 0.1s ease-out';
                leftPath.style.transform = 'scaleY(1)';
                rightPath.style.transition = 'transform 0.1s ease-out';
                rightPath.style.transform = 'scaleY(1)';
            }, 120);
        },
        playAction (name, options = {}) {
            if (!name) return Promise.resolve();
            const isDH = this.useDigitalHuman;
            const presetMap = isDH ? DIGITAL_HUMAN_ACTIONS : CUSTOM_ICON_ACTIONS;
            const preset = presetMap[name];
            if (!preset) return Promise.resolve();

            if (this.actionTimer) {
                clearTimeout(this.actionTimer);
                this.actionTimer = null;
            }
            if (isDH) this.removeIdleState();

            this.currentAction = '';
            if (isDH && name === 'blink') this.doBlink();

            this.$nextTick(() => {
                this.currentAction = name;
            });

            const duration = options.duration || preset.duration;
            return new Promise(resolve => {
                this.actionTimer = setTimeout(() => {
                    this.currentAction = '';
                    this.actionTimer = null;
                    if (isDH) this.setIdleState();
                    this.$emit('action-end', name);
                    resolve();
                }, duration);
            });
        }
    }
};
</script>

<style lang="less" scoped>
.animated-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &__svg {
        width: 100%;
        height: 100%;
        overflow: visible;
    }

    &__img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    /* 数字人动效 */
    &__eye-left,
    &__eye-right {
        transition: transform 0.06s ease-out;
    }
    &__eye-left {
        transform-origin: 19.6px 15.8px;
    }
    &__eye-right {
        transform-origin: 30px 15.6px;
    }
    &__hex-outer {
        transition: transform 0.15s ease-out;
        transform-origin: 23.75px 18.5px;
    }
    &__hex-inner {
        transition: transform 0.12s ease-out;
        transform-origin: 23.75px 18.5px;
    }
    &__hex-corner {
        transition: transform 0.18s ease-out;
        transform-origin: 41px 8px;
    }

    /* 闲置浮动动画 */
    &__eye-left.idle,
    &__eye-right.idle {
        animation: animatedIconEyeIdle 4s ease-in-out infinite;
    }
    &__hex-outer.idle {
        animation: animatedIconHexIdle 5s ease-in-out infinite;
    }
    &__hex-inner.idle {
        animation: animatedIconHexIdle 4.5s ease-in-out infinite;
        animation-delay: 0.3s;
    }
    &__hex-corner.idle {
        animation: animatedIconHexIdle 5.5s ease-in-out infinite;
        animation-delay: 0.6s;
    }

    /* 通用动效 */
    &--float.animated-icon--custom {
        .animated-icon__img,
        :deep(> *) {
            animation: animatedIconFloat 3s ease-in-out infinite;
        }
    }
    &--pulse.animated-icon--custom {
        .animated-icon__img,
        :deep(> *) {
            animation: animatedIconPulse 2s ease-in-out infinite;
        }
    }
    &--shake.animated-icon--custom {
        .animated-icon__img,
        :deep(> *) {
            animation: animatedIconShake 3s ease-in-out infinite;
        }
    }

    /* 数字人动作 */
    &--action-nod &__hex-outer,
    &--action-nod &__hex-inner,
    &--action-nod &__hex-corner,
    &--action-nod &__eye-left,
    &--action-nod &__eye-right {
        animation: animatedIconNod 0.6s ease-in-out 1 !important;
    }
    &--action-shake-head &__hex-outer,
    &--action-shake-head &__hex-inner,
    &--action-shake-head &__hex-corner,
    &--action-shake-head &__eye-left,
    &--action-shake-head &__eye-right {
        animation: animatedIconShakeHead 0.7s ease-in-out 1 !important;
    }
    &--action-lookLeft &__eye-left,
    &--action-lookLeft &__eye-right {
        animation: animatedIconLookLeft 0.6s ease-in-out 1 !important;
    }
    &--action-lookRight &__eye-left,
    &--action-lookRight &__eye-right {
        animation: animatedIconLookRight 0.6s ease-in-out 1 !important;
    }
    &--action-lookUp &__eye-left,
    &--action-lookUp &__eye-right {
        animation: animatedIconLookUp 0.6s ease-in-out 1 !important;
    }
    &--action-lookDown &__eye-left,
    &--action-lookDown &__eye-right {
        animation: animatedIconLookDown 0.6s ease-in-out 1 !important;
    }
    &--action-happy &__hex-outer,
    &--action-happy &__hex-inner,
    &--action-happy &__hex-corner {
        animation: animatedIconHappy 0.8s ease-in-out 1 !important;
    }
    &--action-surprise &__hex-outer,
    &--action-surprise &__hex-inner,
    &--action-surprise &__hex-corner {
        animation: animatedIconSurprise 0.7s ease-out 1 !important;
    }

    /* 自定义图标动作 */
    &--action-bounce.animated-icon--custom {
        .animated-icon__img,
        :deep(> *) {
            animation: animatedIconBounce 0.6s ease-in-out 1 !important;
        }
    }
    &--action-flash.animated-icon--custom {
        .animated-icon__img,
        :deep(> *) {
            animation: animatedIconFlash 0.6s ease-in-out 1 !important;
        }
    }
    &--action-wiggle.animated-icon--custom {
        .animated-icon__img,
        :deep(> *) {
            animation: animatedIconWiggle 0.7s ease-in-out 1 !important;
        }
    }
    &--action-spin.animated-icon--custom {
        .animated-icon__img,
        :deep(> *) {
            animation: animatedIconSpin 0.8s linear 1 !important;
        }
    }
    &--action-pop.animated-icon--custom {
        .animated-icon__img,
        :deep(> *) {
            animation: animatedIconPop 0.5s ease-out 1 !important;
        }
    }
}

/* 关键帧 */
@keyframes animatedIconEyeIdle {
    0%, 100% { transform: translate(0px, 0px); }
    20% { transform: translate(0.6px, -0.3px); }
    40% { transform: translate(1px, 0.2px); }
    60% { transform: translate(0.3px, 0.5px); }
    80% { transform: translate(-0.4px, 0.1px); }
}
@keyframes animatedIconHexIdle {
    0%, 100% { transform: rotate(0deg) translate(0px, 0px); }
    25% { transform: rotate(0.3deg) translate(0.2px, -0.1px); }
    50% { transform: rotate(-0.2deg) translate(-0.1px, 0.15px); }
    75% { transform: rotate(0.15deg) translate(0.1px, 0.1px); }
}
@keyframes animatedIconFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
}
@keyframes animatedIconPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
}
@keyframes animatedIconShake {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-3deg); }
    75% { transform: rotate(3deg); }
}
@keyframes animatedIconNod {
    0%, 100% { transform: translateY(0); }
    30% { transform: translateY(-2.5px); }
    65% { transform: translateY(2px); }
}
@keyframes animatedIconShakeHead {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    20% { transform: translateX(-2.5px) rotate(-2deg); }
    50% { transform: translateX(2.5px) rotate(2deg); }
    80% { transform: translateX(-1.5px) rotate(-1deg); }
}
@keyframes animatedIconLookLeft {
    0%, 100% { transform: translateX(0); }
    40%, 70% { transform: translateX(-3px); }
}
@keyframes animatedIconLookRight {
    0%, 100% { transform: translateX(0); }
    40%, 70% { transform: translateX(3px); }
}
@keyframes animatedIconLookUp {
    0%, 100% { transform: translateY(0); }
    40%, 70% { transform: translateY(-2px); }
}
@keyframes animatedIconLookDown {
    0%, 100% { transform: translateY(0); }
    40%, 70% { transform: translateY(3px); }
}
@keyframes animatedIconHappy {
    0%, 100% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(1.1) rotate(-3deg); }
    50% { transform: scale(1.06) rotate(0deg); }
    75% { transform: scale(1.1) rotate(3deg); }
}
@keyframes animatedIconSurprise {
    0% { transform: scale(1); }
    35% { transform: scale(1.18); }
    100% { transform: scale(1); }
}
@keyframes animatedIconBounce {
    0%, 100% { transform: translateY(0); }
    30% { transform: translateY(-8px); }
    60% { transform: translateY(2px); }
}
@keyframes animatedIconFlash {
    0%, 50%, 100% { opacity: 1; }
    25%, 75% { opacity: 0.3; }
}
@keyframes animatedIconWiggle {
    0%, 100% { transform: rotate(0deg); }
    20% { transform: rotate(-12deg); }
    40% { transform: rotate(10deg); }
    60% { transform: rotate(-6deg); }
    80% { transform: rotate(4deg); }
}
@keyframes animatedIconSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
@keyframes animatedIconPop {
    0% { transform: scale(1); }
    50% { transform: scale(1.25); }
    100% { transform: scale(1); }
}
</style>
