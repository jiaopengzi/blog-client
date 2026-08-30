<!--
 * FilePath    : blog-client-nuxt\src\components\views\not-found\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 统一错误视图(站内版式: header + 面包屑 + 主体 + footer, 垂直居中)
-->

<!--
 * 补充说明:
 * 三处复用, 404 展示全站一致: 全局 error.vue(未知路径/SSR 错误)、
 * pages/not-found.vue(/not-found 路由)、pages/admin.vue(admin 未知子路径兜底);
 * statusCode >= 500 时 hero 切 danger 变体且不自动回首页
 * 返回首页按上下文分流: 错误页上下文 clearError(清除错误状态后再跳转),
 * 普通页面上下文 router.push
-->

<template>
    <div class="page">
        <LayoutHeader />
        <div class="content">
            <!-- 面包屑 -->
            <JBreadcrumb />

            <!-- 正文内容: 视觉核心复用 components/common/error-hero, 视口内垂直居中 -->
            <div class="common-layout">
                <div class="not-found-shell">
                    <ErrorHero :status-code="statusCode" :auto-home="statusCode === 404" @home="goHome" />
                </div>
            </div>
        </div>
        <LayoutFooter />
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"

import JBreadcrumb from "@/components/common/breadcrumb"
import ErrorHero from "@/components/common/error-hero"
import LayoutFooter from "@/components/layout/footer"
import LayoutHeader from "@/components/layout/header"
import { RouteNames } from "@/router"
import { useBreadcrumbStore } from "@/stores/breadcrumb"

defineOptions({ name: "NotFound" })

const props = withDefaults(
    defineProps<{
        /** HTTP 状态码; 404 走主色并倒计时自动回首页, 5xx 走 danger 变体仅手动操作 */
        statusCode?: number
    }>(),
    {
        statusCode: 404,
    },
)

const router = useRouter()
const error = useError()

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.updateItems(String(props.statusCode), "/not-found")

// 返回首页(倒计时归零或用户点击均走此处): 错误页上下文须 clearError 清除错误状态,
// 否则路由跳转后仍停留在错误页; 普通页面上下文直接路由跳转
const goHome = async () => {
    if (error.value) {
        await clearError({ redirect: "/" })
        return
    }

    await router.push({ name: RouteNames.Home })
}
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
}
</style>
