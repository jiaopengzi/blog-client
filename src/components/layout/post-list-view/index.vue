<!--
 * FilePath    : blog-client-nuxt\src\components\layout\post-list-view\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 列表页内容组合 (首页/分类/标签/归档/搜索共用)
-->

<!--
 * 补充说明:
 * 头部、面包屑、内容 (PostList)、侧栏、页脚在此组合; 显示状态由本页按 SPA statusStore 语义管理
 * (挂载即 setHome), 文章详情页 (pages/p/[id].vue) 独立管理详情态
-->

<template>
    <div>
        <!-- 轮播图(260828-2: 移到列表页头之上, /category 等聚合页 hero 位于轮播图下方) -->
        <HomeCarousel v-show="isShowHomeCarousel" />

        <!-- H4(列表页头): 分类/标签/归档/搜索四种聚合页显示当前位置标识, 首页无此头 -->
        <div class="list-page-hero" v-if="heroTitle">
            <h1 class="list-page-hero__title">{{ heroTitle }}</h1>
            <span class="list-page-hero__count">{{ pagination.total }} 篇</span>
        </div>

        <!-- 文章列表(feature01, 02-plan: SSR 直出列表正文与摘要供 SEO 收录;
             el-pagination/el-empty 在 PostList 内部 ClientOnly 渲染, 避免 useId 双端不一致) -->
        <!-- list-final-wrapper: 首帧绘制前由 list-pending.client 插件经 CSS 隐藏
             (html.app-list-pending), 列表最终态校准完成后移除该类展示, 避免登录态列表重排抖动 -->
        <div class="list-final-wrapper">
            <PostList
                v-if="isShowPostList || isShowSearchList"
                :pagination-data="pagination"
                :is-show-loading="isShowPostListLoading"
                :highlight-key="highlightKey"
                :show-post-list="isShowPostList"
                :show-search-list="isShowSearchList"
                :post-list-summary-truncate="post_list_summary_truncate"
                :is-hide-time-icon="device === DeviceType.PHONE"
                :is-set-time-margin="device === DeviceType.PHONE"
                @post-id="handlePostId"
                @update-current-page="updateCurrentPage"
                @update-page-size="updatePageSize"
                @click-category="clickCategory"
                @pagination-block-visible="paginationBlockVisibleChange"
            />
        </div>
        <!-- 骨架屏: 常驻渲染但默认 CSS 隐藏, 仅登录态首屏(data-list-pending 标记存在)经 CSS 从首帧起展示;
             匿名首屏直接展示 SSR 列表, 骨架屏保持隐藏. 结构与 post-item-main 一致(左缩略图 + 标题/摘要/元信息). -->
        <div class="post-list-skeleton" aria-hidden="true">
            <div v-for="n in 5" :key="n" class="skeleton-item">
                <div class="skeleton-thumb"></div>
                <div class="skeleton-body">
                    <div class="skeleton-line skeleton-title"></div>
                    <div class="skeleton-line skeleton-meta"></div>
                    <div class="skeleton-line skeleton-summary-1"></div>
                    <div class="skeleton-line skeleton-summary-2"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { onMounted, type Reactive, reactive, ref, watch } from "vue"

import { type ViewPostRequest } from "@/api/post/view"
import type { PostResPagination } from "@/api/post/common"
import type { Pagination } from "@/api/response"
import PostList from "@/components/common/post-list"
import { useHome } from "@/components/hooks/useHome"
import HomeCarousel from "@/components/layout/carousel"
import { type SearchData } from "@/components/layout/search"
import { inject, type Ref } from "vue"
import { DeviceType, useDeviceStore } from "@/stores/device"
import { useOptionsStore } from "@/stores/options"
import { LocalStorageKey } from "@/stores/local"
import { useStatusStore } from "@/stores/status"
import { useUserStore } from "@/stores/user"

defineOptions({ name: "ListPage" })

const route = useRoute()
const router = useRouter()

const statusStore = useStatusStore()
const deviceStore = useDeviceStore()
const optionsStore = useOptionsStore()

const { post_list_summary_truncate } = storeToRefs(optionsStore)
const { device } = storeToRefs(deviceStore)
const { isShowSearchList, isShowPostDetail, isShowPostList, isShowHomeCarousel } = storeToRefs(statusStore)

// 阶段 3 适配: /category/[slug]、/tag/[slug] 由路径段注入筛选参数 (计划 3.3, 不复用旧 query 机制)
const taxonomySlug = computed(() => {
    const slug = route.params.slug
    return Array.isArray(slug) ? String(slug[0] ?? "") : typeof slug === "string" ? slug : ""
})

const taxonomyType = computed(() => (route.name === "category" ? "category" : route.name === "tag" ? "tag" : ""))

// 阶段 3 适配: /year/[year] 与 /year/[year]/month/[month] 由路径段注入归档年月
const archiveYear = computed(() => {
    if (route.name !== "year-month" && route.name !== "year-only") {
        return undefined
    }
    const raw = Array.isArray(route.params.year) ? route.params.year[0] : route.params.year
    const value = Number(raw)
    return Number.isFinite(value) ? value : undefined
})

// 阶段 3 补充: /s/[keyword] 搜索页由路径段注入关键字 (搜索页纯 CSR, 见 routeRules)
const searchKeyword = computed(() => (route.name === "search" ? String(route.params.keyword ?? "") : ""))

const archiveMonth = computed(() => {
    if (route.name !== "year-month") {
        return undefined
    }
    const raw = Array.isArray(route.params.month) ? route.params.month[0] : route.params.month
    const value = Number(raw)
    return Number.isFinite(value) ? value : undefined
})

// H4(列表页头标题): 纯展示, 仅拼装既有路由信息, 不发起任何请求; 首页返回空串以隐藏页头
const heroTitle = computed(() => {
    if (taxonomyType.value === "category") {
        return `分类：${taxonomySlug.value}`
    }
    if (taxonomyType.value === "tag") {
        return `标签：${taxonomySlug.value}`
    }
    if (route.name === "year-month") {
        return `${archiveYear.value ?? ""} 年 ${archiveMonth.value ?? ""} 月归档`
    }
    if (route.name === "year-only") {
        return `${archiveYear.value ?? ""} 年归档`
    }
    if (route.name === "search") {
        return `搜索：${searchKeyword.value}`
    }
    return ""
})

// 搜索框数据流: 由根级布局 (layouts/default.vue) provide, 本组件 inject
const searchData = inject<Ref<SearchData>>("layoutSearchData", ref<SearchData>({ keyword: "", time: new Date() }))

// 获取列表数据
const mainReq = reactive<ViewPostRequest>({
    post_category_slug: taxonomyType.value === "category" ? taxonomySlug.value : undefined,
    post_tag_slug: taxonomyType.value === "tag" ? taxonomySlug.value : undefined,
    ...(archiveYear.value !== undefined ? { year: archiveYear.value } : {}),
    ...(archiveMonth.value !== undefined ? { month: archiveMonth.value } : {}),
    key_word: searchKeyword.value || undefined,
} as ViewPostRequest)

const {
    pagination,
    updateRouterPush,
    updateCurrentPage,
    updatePageSize,
    updateByRoute,
    clickCategory,
    clickTag,
    clickMonthArchive,
    paginationBlockVisibleChange,
    isShowPostListLoading,
    clearParamsExcept,
    highlightKey,
    getListDataForSsr, // feature01: SSR 首屏列表取数
} = useHome(mainReq)

// 点击文章: 直接路由跳转 /p/:id
const handlePostId = async (postID: string) => {
    await router.push(`/p/${postID}`)
}

// 监听搜索关键字变化, 更新路由
watch(
    searchData,
    async (val: SearchData) => {
        if (val.keyword === "" || val.keyword.trim() === "") {
            statusStore.setHome() // 文章列表状态
            return
        }

        mainReq.key_word = val.keyword.trim()
        statusStore.setSearch() // 搜索状态

        clearParamsExcept(["key_word"])
        await updateRouterPush()
    },
    { deep: true },
)

// 站内切换分类/标签/年月归档时, 同步筛选参数并刷新列表
watch([taxonomyType, taxonomySlug, archiveYear, archiveMonth], async ([type, slug, year, month]) => {
    mainReq.post_category_slug = type === "category" ? slug || undefined : undefined
    mainReq.post_tag_slug = type === "tag" ? slug || undefined : undefined
    if (year === undefined) {
        delete mainReq.year
    } else {
        mainReq.year = year
    }
    if (month === undefined) {
        delete mainReq.month
    } else {
        mainReq.month = month
    }
    await updateByRoute()
})

// 列表页显示状态由本页管理 (符合 SPA statusStore 显示逻辑): 进入即列表态——
// 同步执行保证在 finalizeInitialList 的 updateByRoute 之前就位 (修复从详情页点击 tag/归档跳转后
// status 残留导致列表不刷新的问题)
statusStore.setHome()

// /s/[keyword] 搜索页桥接: 关键字注入 mainReq 并进入搜索态 (immediate: 页面挂载即生效)
watch(
    searchKeyword,
    (keyword) => {
        if (keyword) {
            mainReq.key_word = keyword
            statusStore.setSearch()
        } else {
            delete mainReq.key_word
        }
    },
    { immediate: true },
)

// 监听路由更新文章列表
watch(
    () => route.fullPath,
    async (newVal, oldVal) => {
        // **注意是非详情页**
        if (!newVal || newVal === oldVal || isShowPostDetail.value) return
        await statusStore.setAnchorHash("") // 清空锚点
        await updateByRoute()
    },
)

// feature01(02-plan): SSR 首屏直出列表数据(payload 注水, 客户端水合复用);
// 客户端导航由既有 updateByRoute 流程拉取, SSR handler 在客户端直接返回 null 避免双请求.
const { data: listSsrData } = await useAsyncData<Pagination<PostResPagination> | null>(`list-ssr-${route.fullPath}`, async () => {
    if (import.meta.client) {
        return null
    }
    return await getListDataForSsr()
})

// 应用 SSR 列表数据(SSR 渲染/客户端水合/路由切换统一入口; 与 updatePaginate 的赋值语义一致)
watch(
    listSsrData,
    (data) => {
        if (!data) return
        if (data.total === 0) {
            pagination.total = 0
            pagination.records = []
            return
        }
        Object.assign(pagination, data)
    },
    { immediate: true },
)

// feature01(反馈第1轮): 首屏列表最终态校准——后端按登录态返回不同记录集/排序, SSR 无法认证(首屏必为匿名数据).
// - 匿名(本地无 login_hint): 内联脚本不隐藏列表, SSR 列表从首帧起直接展示, 无任何动画;
//   仅后台静默完成查询参数与面包屑校准.
// - 登录态(本地 login_hint=1): 内联脚本在首帧绘制前隐藏列表(data-list-pending), 挂载后走骨架屏 CSR;
//   initStores 恢复登录态后重拉登录态列表, 隐藏期间完成重排(用户不可见), 完成后一次性展示.
// 登录态提示标记(登录/refresh 成功时写入, 登出时清除; localStorage 同源跨标签共享)
const hasLoginHint = import.meta.client && typeof localStorage !== "undefined" && localStorage.getItem(LocalStorageKey.LoginHint) === "1"

const finalizeInitialList = async () => {
    if (!hasLoginHint) {
        // 匿名: 列表保持可见, 不做任何隐藏与动画; 后台静默完成登录态恢复与校准
        try {
            const { getInitStoresPromise } = await import("@/stores/init")
            await getInitStoresPromise()
        } catch {
            // initStores 异常不阻塞(与 init-stores.client 插件容错语义一致)
        }

        const userStore = useUserStore()
        const hasSsrData = listSsrData.value !== null && listSsrData.value !== undefined
        if (userStore.isLogin || !hasSsrData) {
            // 边缘场景(旧会话无标记但实际已登录) / 客户端导航(无 SSR 数据): 完整拉取
            await updateByRoute()
        } else {
            // 常规匿名 + 已有 SSR 数据: 直接沿用, 跳过列表请求(避免重复请求)
            await updateByRoute(true)
        }
        document.documentElement.removeAttribute("data-list-pending")
        return
    }

    // 登录态: 首帧已被内联脚本隐藏(data-list-pending), 骨架屏经 CSS 从首帧起展示;
    // 等待共享 initStores 完成(登录态经 refresh_token cookie 恢复; 已初始化则立即返回)
    try {
        const { getInitStoresPromise } = await import("@/stores/init")
        await getInitStoresPromise()
    } catch {
        // initStores 异常不阻塞列表展示(与 init-stores.client 插件容错语义一致)
    }

    const userStore = useUserStore()
    const hasSsrData = listSsrData.value !== null && listSsrData.value !== undefined

    isShowPostListLoading.value = true
    try {
        if (userStore.isLogin || !hasSsrData) {
            // 登录态(SPA 语义: 首屏即登录态列表) / 客户端导航(无 SSR 数据): 完整拉取
            await updateByRoute()
        } else {
            // 提示标记过期(refresh 失败实际为匿名): 直接沿用 SSR 数据
            await updateByRoute(true)
        }
    } finally {
        isShowPostListLoading.value = false
        // 无论成功失败都移除首屏隐藏标记, 展示列表(失败时保留 SSR/既有数据)
        document.documentElement.removeAttribute("data-list-pending")
    }
}

onMounted(() => {
    void finalizeInitialList()
})
</script>

<style scoped lang="scss">
:deep(.highlight-title) {
    color: var(--jpz-color-secondary);
    font-weight: 600;
}

// feature01(02-plan): 首帧绘制前(客户端插件挂载前给 html 加 data-list-pending)隐藏列表容器,
// 待登录态校准完成后移除标记再展示, 避免登录态列表重排抖动; SSR HTML 不含该标记, 列表对爬虫可见.
:global(html[data-list-pending] .list-final-wrapper) {
    display: none;
}

// feature01(反馈第1轮): 登录态首屏校准期间的骨架屏(结构与 post-item-main 一致; shimmer 扫光动画).
// 常驻渲染, 默认隐藏; 仅登录态首屏(html[data-list-pending])从首帧起展示, 匿名首屏不出现.
.post-list-skeleton {
    display: none;
    width: 100%;
}

:global(html[data-list-pending] .post-list-skeleton) {
    display: block;
}

.skeleton-item {
    position: relative;
    height: 150px;
    padding: 20px;
    background-color: var(--jpz-bg-color);
    overflow: hidden;
    border-left: 1px solid var(--jpz-border-color);
    border-right: 1px solid var(--jpz-border-color);
    border-top: 1px solid var(--jpz-border-color);

    &:first-child {
        border-radius: 5px 5px 0 0;
    }

    &:last-child {
        border-bottom: 1px solid var(--jpz-border-color);
        border-radius: 0 0 5px 5px;
    }
}

.skeleton-thumb {
    float: left;
    width: 200px;
    height: 100%;
    border-radius: 4px;
}

.skeleton-body {
    height: 100%;
    margin-left: 210px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.skeleton-line {
    border-radius: 3px;
}

.skeleton-title {
    height: 24px;
    width: 55%;
}

.skeleton-meta {
    height: 16px;
    width: 40%;
    margin-top: 8px;
}

.skeleton-summary-1 {
    height: 14px;
    width: 90%;
    margin-top: 12px;
}

.skeleton-summary-2 {
    height: 14px;
    width: 75%;
    margin-top: 8px;
}

// shimmer 扫光: 渐变底色 + 移动高光条, 与主流骨架屏观感一致.
// 底色取主题边框色(双主题下均可见), 高光为白色扫光; 不能用 bg-color-overlay(当前主题为纯白, 会白底隐形).
.skeleton-thumb,
.skeleton-line {
    background: linear-gradient(
        100deg,
        color-mix(in srgb, var(--jpz-border-color) 80%, transparent) 40%,
        color-mix(in srgb, #ffffff 70%, transparent) 50%,
        color-mix(in srgb, var(--jpz-border-color) 80%, transparent) 60%
    );
    background-size: 200% 100%;
    background-position: 150% 0;
    animation: skeleton-shimmer 1.4s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
    0% {
        background-position: 150% 0;
    }
    100% {
        background-position: -50% 0;
    }
}

// pad/phone 端: 缩略图占位缩小, 摘要宽度收拢
@include respond-to("pad") {
    .skeleton-item {
        margin-left: 10px;
        margin-right: 10px;
    }
    .skeleton-thumb {
        width: 140px;
    }
    .skeleton-body {
        margin-left: 150px;
    }
}

@include respond-to("phone") {
    .skeleton-item {
        height: 120px;
        margin-left: 10px;
        margin-right: 10px;
        padding: 12px;
    }
    .skeleton-thumb {
        width: 110px;
    }
    .skeleton-body {
        margin-left: 120px;
    }
}
</style>
