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
                <div class="not-found">
                    <el-empty description=" ">
                        <h1>404</h1>
                        <p>抱歉，您访问的页面不存在。</p>
                        <p>
                            将在 <span class="countdown">{{ countdown }}</span> 秒后，<span class="go-home" @click="goHome">返回首页</span>。
                        </p>
                    </el-empty>
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
const countdown = ref(5) // 倒计时
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

.go-home {
    color: var(--jpz-color-primary);
    cursor: pointer;
    text-decoration: underline;
    text-decoration-color: currentColor;
    text-underline-offset: 6px;
    text-decoration-thickness: 2px;
}

@include respond-to("pc") {
    .content {
        width: pc.$width-page-main;
        height: calc(100vh - pc.$height-footer);
    }
}

@include respond-to("pad") {
    .content {
        width: 94vw;
        height: calc(100vh - pad.$height-footer);
    }
}

@include respond-to("phone") {
    .content {
        width: 94vw;
        height: calc(100vh - phone.$height-footer);
    }
}

.not-found {
    text-align: center;
    padding-top: 100px;
    font-size: 24px;
    color: var(--jpz-color-primary);

    h1 {
        font-size: 100px;
        margin: 0;
        font-weight: 700;
    }

    p {
        margin: 40px 0;

        .countdown {
            color: red;
            font-size: 24px;
            font-weight: 700;
        }
    }
}
</style>
