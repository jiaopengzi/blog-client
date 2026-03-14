<!--
 * FilePath    : blog-client\src\views\404\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 404 页面
-->

<template>
    <div class="page">
        <LayoutHeader />
        <div class="content">
            <!-- 面包屑 -->
            <JBreadcrumb />

            <!-- 正文内容 -->
            <div class="common-layout">
                <div class="not-found-shell">
                    <section class="not-found-panel">
                        <div class="status-line">
                            <span class="status-chip">PAGE STATUS</span>
                            <span class="status-code">404</span>
                        </div>

                        <div class="hero-code">404</div>

                        <h1 class="title">页面未找到</h1>
                        <p class="description">当前链接可能已失效, 被移动, 或暂时不可访问。</p>
                        <p class="description">请返回首页或检查访问地址是否正确。</p>

                        <div class="meta-list">
                            <div class="meta-item meta-item-countdown">
                                <span class="meta-value"
                                    ><span class="countdown">{{ countdown }}</span
                                    ><span class="countdown-unit">s</span></span
                                >
                            </div>
                            <div class="meta-item meta-item-action">
                                <span class="go-home" @click="goHome">返回首页</span>
                            </div>
                        </div>

                        <div class="footnote">建议检查 URL 是否完整, 或从站点导航重新进入目标页面。</div>
                    </section>
                </div>
            </div>
        </div>
        <LayoutFooter />
    </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue"
import { useRouter } from "vue-router"

import JBreadcrumb from "@/components/common/breadcrumb"
import LayoutFooter from "@/components/layout/footer"
import LayoutHeader from "@/components/layout/header"
import { RouteNames } from "@/router"
import { useBreadcrumbStore } from "@/stores/breadcrumb"

defineOptions({ name: "NotFound404" })

const router = useRouter() // 路由
const countdown = ref(10) // 倒计时
let intervalId: number | undefined // 定时器id

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.updateItems("404", `/${RouteNames.NotFound}`)

// 返回首页
const goHome = () => {
    router.push({ name: RouteNames.Home })
}

onMounted(() => {
    // 倒计时
    intervalId = window.setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--
        } else {
            clearInterval(intervalId)
            router.push("/")
        }
    }, 1000)
})

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId)
    }
})
</script>

<style scoped lang="scss">
.content {
    display: flex;
    flex-direction: column;
}

.not-found-shell {
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 0 72px;
}

.not-found-panel {
    width: min(760px, 100%);
    padding: 40px 36px;
    border: 1px solid color-mix(in srgb, var(--jpz-color-primary) 16%, var(--el-border-color));
    border-radius: 28px;
    background:
        linear-gradient(135deg, color-mix(in srgb, var(--jpz-color-primary) 5%, transparent), transparent 48%),
        linear-gradient(180deg, color-mix(in srgb, var(--el-bg-color-overlay) 96%, transparent), var(--el-bg-color));
    box-shadow:
        0 24px 60px rgb(15 23 42 / 8%),
        inset 0 1px 0 rgb(255 255 255 / 24%);
}

.status-line {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 28px;
}

.status-chip,
.status-code {
    font-size: 12px;
    letter-spacing: 0.16em;
    color: var(--jpz-text-color-secondary);
}

.status-chip {
    padding: 6px 10px;
    border-radius: 999px;
    border: 1px solid var(--el-border-color-lighter);
    background: color-mix(in srgb, var(--el-fill-color-light) 84%, transparent);
}

.hero-code {
    font-size: clamp(72px, 12vw, 132px);
    line-height: 0.92;
    font-weight: 700;
    letter-spacing: -0.05em;
    color: var(--jpz-text-color-primary);
    margin-bottom: 20px;
}

.title {
    margin: 0 0 14px;
    font-size: clamp(28px, 4vw, 40px);
    line-height: 1.1;
    color: var(--jpz-text-color-primary);
}

.description {
    margin: 0;
    max-width: 580px;
    font-size: 16px;
    line-height: 1.8;
    color: var(--jpz-text-color-secondary);
}

.meta-list {
    display: grid;
    gap: 12px;
    margin: 32px 0 24px;
}

.meta-item {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;
    min-height: 56px;
    padding: 12px 0;
}

.meta-item-countdown {
    padding-top: 0;
}

.meta-value {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    color: var(--jpz-text-color-primary);
    font-weight: 600;
}

.countdown-unit {
    font-size: 15px;
    color: var(--jpz-text-color-secondary);
}

.go-home {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 40px;
    padding: 0 2px;
    color: var(--jpz-color-primary);
    cursor: pointer;
    transition:
        transform 0.2s ease,
        color 0.2s ease,
        opacity 0.2s ease;

    &:hover {
        transform: translateY(-1px);
        color: color-mix(in srgb, var(--jpz-color-primary) 76%, black);
        opacity: 0.88;
    }
}

.countdown {
    font-size: clamp(28px, 4vw, 38px);
    line-height: 1;
    letter-spacing: -0.04em;
    color: var(--jpz-color-primary);
    font-weight: 700;
}

.footnote {
    font-size: 14px;
    line-height: 1.7;
    color: var(--jpz-text-color-secondary);
}

@include respond-to("pc") {
    .content {
        width: pc.$width-page-main;
        min-height: calc(100vh - pc.$height-footer);
    }
}

@include respond-to("pad") {
    .content {
        width: 94vw;
        min-height: calc(100vh - pad.$height-footer);
    }
}

@include respond-to("phone") {
    .content {
        width: 94vw;
        min-height: calc(100vh - phone.$height-footer);
    }

    .not-found-shell {
        min-height: 64vh;
        padding: 24px 0 56px;
    }

    .not-found-panel {
        padding: 28px 20px;
        border-radius: 22px;
    }

    .meta-item {
        align-items: flex-start;
        justify-content: flex-start;
    }
}
</style>
