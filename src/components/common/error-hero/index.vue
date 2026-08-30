<!--
 * FilePath    : blog-client-nuxt\src\components\common\error-hero\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 错误页视觉核心 (404/500 共用)
-->

<!--
 * 补充说明:
 * 从 error.vue 的新版错误页设计抽离, 供全屏错误页(error.vue)与站内 404 视图
 * (views/not-found) 复用; 状态码幽灵字 + 主题色氛围层 + 倒计时自动回首页.
 * 导航行为由父级处理: 组件只负责倒计时与按钮, 通过 home 事件通知父级跳首页.
-->

<template>
    <div class="error-hero" :data-variant="variant">
        <!-- 背景氛围层: 细网格 + 主色光晕, 纯 CSS, 不随内容滚动 -->
        <div class="error-hero__aura" aria-hidden="true" />

        <div class="error-hero__code" aria-hidden="true">
            <span class="error-hero__code-ghost">{{ statusCode }}</span>
            <span class="error-hero__code-solid">{{ statusCode }}</span>
        </div>

        <div class="error-hero__body">
            <p class="error-hero__tag">{{ tagText }}</p>
            <h1 class="error-hero__title">{{ titleText }}</h1>
            <p class="error-hero__desc">{{ descText }}</p>

            <div class="error-hero__actions">
                <button type="button" class="error-hero__btn error-hero__btn--primary" @click="emitHome()">
                    <template v-if="autoHome"
                        ><span class="error-hero__countdown">{{ countdown }}</span
                        >s 后自动返回首页</template
                    >
                    <template v-else>回到首页</template>
                </button>
                <button type="button" class="error-hero__btn" @click="handleBack">返回上一页</button>
                <button v-if="isServerError" type="button" class="error-hero__btn" @click="handleRetry">重试一次</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"

defineOptions({ name: "ErrorHero" })

const props = withDefaults(
    defineProps<{
        /** HTTP 状态码 */
        statusCode: number
        /** 是否开启倒计时自动返回首页 (父级监听 home 事件跳转) */
        autoHome?: boolean
        /** 倒计时秒数 */
        countdownSeconds?: number
    }>(),
    {
        autoHome: false,
        countdownSeconds: 10,
    },
)

const emit = defineEmits<{
    /** 用户点击"回到首页"或倒计时归零时触发, 由父级执行实际导航 */
    (e: "home"): void
}>()

const isServerError = computed(() => props.statusCode >= 500)

// 500 系走 danger 视觉变体, 其余 (含 404) 沿用主站主色
const variant = computed(() => (isServerError.value ? "danger" : "primary"))

const tagText = computed(() => (isServerError.value ? "Server Error" : "Page Not Found"))

const titleText = computed(() => (isServerError.value ? "服务器开小差了" : "这个页面走丢了"))

const descText = computed(() =>
    isServerError.value
        ? "服务暂时不可用，可能正在维护或瞬时过载，稍后重试通常可以恢复。"
        : "页面可能已被移动、删除，或者地址输入有误。回到首页继续浏览文章吧。",
)

// 倒计时仅在开启自动回首页时启动; 到 0 后通知父级跳首页 (500 不自动跳, 避免刷新循环)
const countdown = ref(props.countdownSeconds)
let intervalId: number | undefined

function emitHome() {
    if (intervalId) {
        clearInterval(intervalId)
        intervalId = undefined
    }
    emit("home")
}

// 无历史记录时 (如直接打开错误链接) 由父级回退到首页, 这里仍发 home 事件统一处理
function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
        window.history.back()
    } else {
        emit("home")
    }
}

// 服务端错误时原地重载当前地址
function handleRetry() {
    if (typeof window !== "undefined") {
        window.location.reload()
    }
}

onMounted(() => {
    if (!props.autoHome) {
        return
    }

    intervalId = window.setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--
        } else {
            emitHome()
        }
    }, 1000)
})

onBeforeUnmount(() => {
    if (intervalId) {
        clearInterval(intervalId)
    }
})
</script>

<style scoped lang="scss">
// 主题变量回退值与默认亮色预设(light)保持一致, 保证 SSR 首帧与主题未注入时视觉不塌
.error-hero {
    --eh-primary: var(--jpz-color-primary, #1e2858);
    --eh-secondary: var(--jpz-color-secondary, #c89828);
    --eh-bg-page: var(--jpz-bg-color-page, #f2f3f5);
    --eh-bg: var(--jpz-bg-color, #ffffff);
    --eh-text-primary: var(--jpz-text-color-primary, #303133);
    --eh-text-regular: var(--jpz-text-color-regular, #606266);
    --eh-text-secondary: var(--jpz-text-color-secondary, #909399);
    --eh-border: var(--jpz-border-color, #dcdfe6);
    --eh-danger: var(--jpz-color-danger, #f56c6c);

    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(2rem, 6vw, 6rem);
    padding: clamp(2rem, 6vh, 5rem) 1.5rem;
    color: var(--eh-text-primary);
    overflow: hidden;
    border-radius: 28px;
    background-color: var(--eh-bg-page);
}

// 背景氛围: 细网格纹理 + 两团主题色柔光, 低透明度仅作层次不抢焦点
.error-hero__aura {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
        linear-gradient(color-mix(in srgb, var(--eh-primary) 6%, transparent) 1px, transparent 1px),
        linear-gradient(90deg, color-mix(in srgb, var(--eh-primary) 6%, transparent) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 90% 70% at 50% 35%, #000 30%, transparent 75%);

    &::before,
    &::after {
        content: "";
        position: absolute;
        border-radius: 50%;
        filter: blur(90px);
    }

    &::before {
        top: -15%;
        left: 8%;
        width: 42%;
        aspect-ratio: 1;
        background: color-mix(in srgb, var(--eh-primary) 14%, transparent);
    }

    &::after {
        right: -10%;
        bottom: -20%;
        width: 36%;
        aspect-ratio: 1;
        background: color-mix(in srgb, var(--eh-secondary) 12%, transparent);
    }
}

// 状态码: 幽灵描边字与大号实心字错位, 悬停时轻微视差复位
.error-hero__code {
    position: relative;
    font-weight: 800;
    font-size: clamp(7rem, 22vw, 15rem);
    line-height: 1;
    letter-spacing: -0.04em;
    user-select: none;

    .error-hero__code-solid {
        display: block;
        color: var(--eh-primary);
        background: linear-gradient(160deg, var(--eh-primary) 30%, color-mix(in srgb, var(--eh-primary) 55%, var(--eh-secondary)));
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .error-hero__code-ghost {
        position: absolute;
        inset: 0;
        display: block;
        color: transparent;
        -webkit-text-stroke: 2px color-mix(in srgb, var(--eh-primary) 26%, transparent);
        transform: translate(0.09em, -0.09em);
        animation: ghost-drift 6s ease-in-out infinite alternate;
    }

    // 500 变体: 主色让位 danger, 保持同一构图语言
    // 注意用 background-image 而非 background 简写: 简写会把上面基础规则的
    // background-clip: text 重置回 border-box, 叠加文字透明填充后 500 数字整体不可见
    .error-hero[data-variant="danger"] & {
        .error-hero__code-solid {
            background-image: linear-gradient(160deg, var(--eh-danger) 30%, color-mix(in srgb, var(--eh-danger) 45%, var(--eh-primary)));
        }

        .error-hero__code-ghost {
            -webkit-text-stroke-color: color-mix(in srgb, var(--eh-danger) 30%, transparent);
        }
    }
}

@keyframes ghost-drift {
    from {
        transform: translate(0.09em, -0.09em);
    }

    to {
        transform: translate(0.05em, -0.05em);
    }
}

.error-hero__body {
    position: relative;
    max-width: 26rem;
    animation: body-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes body-rise {
    from {
        opacity: 0;
        transform: translateY(1.2rem);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.error-hero__tag {
    margin: 0 0 0.75rem;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--eh-secondary);
}

.error-hero[data-variant="danger"] .error-hero__tag {
    color: var(--eh-danger);
}

.error-hero__title {
    margin: 0 0 0.75rem;
    font-size: clamp(1.5rem, 4vw, 2.1rem);
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: 0.01em;
}

.error-hero__desc {
    margin: 0 0 2rem;
    font-size: 0.95rem;
    line-height: 1.8;
    color: var(--eh-text-regular);
}

.error-hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.error-hero__btn {
    padding: 0.6rem 1.4rem;
    font-size: 0.9rem;
    font-weight: 500;
    font-family: inherit;
    border-radius: 6px;
    border: 1px solid var(--eh-border);
    background: var(--eh-bg);
    color: var(--eh-text-regular);
    cursor: pointer;
    transition:
        color 0.2s ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        transform 0.15s ease;

    &:hover {
        color: var(--eh-primary);
        border-color: color-mix(in srgb, var(--eh-primary) 45%, transparent);
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
}

.error-hero__btn--primary {
    border-color: transparent;
    background: var(--eh-primary);
    color: #fff;

    &:hover {
        color: #fff;
        border-color: transparent;
        background: color-mix(in srgb, var(--eh-primary) 88%, var(--eh-secondary));
        box-shadow: 0 6px 18px color-mix(in srgb, var(--eh-primary) 30%, transparent);
    }
}

// 倒计时数字: 两位定宽 + 等宽数字, 避免 10→9 时按钮文案整体抖动
.error-hero__countdown {
    display: inline-block;
    min-width: 2ch;
    text-align: center;
    font-variant-numeric: tabular-nums;
}

// 窄屏: 状态码与文案上下排布, 缩小代码字号
@media (max-width: 720px) {
    .error-hero {
        flex-direction: column;
        text-align: center;
    }

    .error-hero__code {
        font-size: clamp(6rem, 34vw, 9rem);
    }

    .error-hero__actions {
        justify-content: center;
    }
}

// 动效弱化: 尊重系统 reduce-motion 偏好
@media (prefers-reduced-motion: reduce) {
    .error-hero__code-ghost,
    .error-hero__body {
        animation: none;
    }

    .error-hero__btn {
        transition: none;
    }
}
</style>
