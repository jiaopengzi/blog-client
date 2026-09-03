<!--
 * FilePath    : blog-client-nuxt\src\components\layout\aside\layout-aside.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 公用侧栏 (阶段 4 终版拆分: 列表页与文章详情页各自组合使用; bf-260903-01 增加登录态校准重拉)
-->

<!--
 * 补充说明:
 * 侧栏数据 (推荐/热门/标签/归档) 自行拉取; TOC 数据来自 statusStore (文章详情页写入)
 * 标签 TopN 与月度归档为登录态感知接口 (后端叠加本人私密文章计数), SSR 注水恒为匿名口径, 水合后需按登录态校准
-->

<template>
    <el-aside
        class="el-aside"
        :class="{ 'is-aside-sticky': isAsideStickyEnabled }"
        :style="{ '--home-aside-sticky-top': asideStickyTop }"
        v-show="isShowHomeAside && hasDataHomeAside"
    >
        <div ref="asideContentRef" class="el-aside-content">
            <!-- 目录 (数据由文章详情页写入 statusStore; 与 SPA 一致仅详情页展示) -->
            <Toc
                v-if="isShowPostDetail && isShowToc && hasDataToc"
                class="el-aside-item"
                :headings="tocHtml"
                :heading-show-current-index="tocHeadingShowCurrentIndex"
                @heading-clicked="tocHeadingClicked"
            />

            <!-- 推荐阅读 -->
            <RecommendedRead
                v-if="isShowRecommendedRead && hasDataRecommendedRead"
                class="el-aside-item"
                :post-data="recommendedPost"
                @post-id="handlePostId"
            />

            <!-- 热门文章 -->
            <HotPost v-if="isShowHotPost && hasDataHotPost" class="el-aside-item" :post-data="hotPost" @post-id="handlePostId" />

            <!-- 文章标签 -->
            <PostTag v-if="isShowPostTag && hasDataPostTag" :items="postTags" class="el-aside-item" @click="clickTag" />

            <!-- 月度归档 -->
            <MonthArchive
                v-if="isShowMonthArchive && hasDataMonthArchive"
                class="el-aside-item"
                :post-list="monthArchiveProps"
                @post-by-month="clickMonthArchive"
            />
        </div>
    </el-aside>
</template>

<script setup lang="ts">
import { useEventListener, useResizeObserver } from "@vueuse/core"
import { storeToRefs } from "pinia"
import { computed, onMounted, ref, useTemplateRef, watch } from "vue"

import { type PostTag as PostTagItem } from "@/api/postTag/view"
import type { PostResCommon } from "@/api/post/common"
import MonthArchive, { type MonthArchiveData } from "@/components/common/month-archive"
import { useGetData } from "@/components/hooks/useHome/api"
import Toc from "@/components/editor/components/toc"
import HotPost from "@/components/layout/aside/hot-post"
import PostTag, { usePostTagData } from "@/components/layout/aside/post-tag"
import RecommendedRead from "@/components/layout/aside/recommended-read"
import { RouteNames } from "@/router"
import { useStatusStore } from "@/stores/status"
import { useUserStore } from "@/stores/user"

defineOptions({ name: "LayoutAside" })

// 目录组件静态导入 (与 SPA main-content 一致): toc 组件仅依赖 vue, 不引入编辑器依赖链;
// 修复异步组件与 v-if 瞬时切换竞态导致的 DOM 不一致 (insertBefore NotFoundError)

const router = useRouter()
const route = useRoute()

const asideContentRef = useTemplateRef<HTMLElement | null>("asideContentRef")
const asideStickyTop = ref("0px")
const isAsideStickyEnabled = ref(false)

// 根据侧栏真实高度更新 sticky 吸附点, 短侧栏吸顶, 长侧栏贴底且避免侧栏内部滚动条
const updateAsideStickyTop = () => {
    const asideContent = asideContentRef.value
    if (!asideContent) {
        asideStickyTop.value = "0px"
        isAsideStickyEnabled.value = false
        return
    }

    const viewportHeight = window.innerHeight
    const asideHeight = asideContent.getBoundingClientRect().height
    if (asideHeight <= viewportHeight) {
        asideStickyTop.value = "0px"
        isAsideStickyEnabled.value = true
        return
    }

    asideStickyTop.value = `${viewportHeight - asideHeight}px`
    isAsideStickyEnabled.value = true
}

useResizeObserver(asideContentRef, updateAsideStickyTop)
useEventListener(window, "resize", updateAsideStickyTop)

const statusStore = useStatusStore()

const {
    isShowPostDetail,
    isShowHomeAside,
    isShowRecommendedRead,
    isShowHotPost,
    isShowPostTag,
    isShowMonthArchive,
    isShowToc,

    tocHtml,
    tocHeadingShowCurrentIndex,

    hasDataToc,
    hasDataHomeAside,
    hasDataRecommendedRead,
    hasDataHotPost,
    hasDataPostTag,
    hasDataMonthArchive,
} = storeToRefs(statusStore)

// 侧栏数据 (推荐/热门/月度归档): 与列表筛选无关, 自行拉取
const { recommendedPost, hotPost, monthArchiveProps, getHostPost, getRecommendedPost, getPostCountByMonth } = useGetData()

// 文章标签数据
const { items: postTags, getTagTopN } = usePostTagData(false)

// 260828-1a: 自定义页(/page/*)在 SSR 阶段不拉取侧栏数据——其页面态(setCustomPage)会隐藏整个侧栏,
// 但 statusStore 不注水、SSR 按默认态渲染, 若拉取会把"推荐阅读/热门/归档/标签"列表带进 HTML
// (水合后 onMounted 才切换页面态, 造成无谓的 HTML 膨胀与侧栏闪现)。跳过拉取后 hasData* 保持
// false → SSR/水合首帧侧栏为空且一致; 客户端 SPA 导航回列表页时由 loadMissingAsideData 补拉
// 文章详情(/p/*)按 SPA 语义本就展示侧栏, 维持 SSR 直出
const skipAsideSsr = computed(() => import.meta.server && route.name === "page")

// feature01(02-plan): 侧栏数据 SSR 直出(payload 注水, 客户端水合复用);
// 客户端导航/重挂载时 SSR handler 直接返回 null, 由 onMounted 的本地空数据判断补拉, 避免双请求
const { data: asideRecommendedData } = await useAsyncData<PostResCommon[] | null>("aside-recommended", async () => {
    if (import.meta.client || skipAsideSsr.value) {
        return null
    }
    await getRecommendedPost()
    return [...recommendedPost]
})

const { data: asideHotData } = await useAsyncData<PostResCommon[] | null>("aside-hot", async () => {
    if (import.meta.client || skipAsideSsr.value) {
        return null
    }
    await getHostPost()
    return [...hotPost]
})

const { data: asideMonthData } = await useAsyncData<MonthArchiveData[] | null>("aside-month-archive", async () => {
    if (import.meta.client || skipAsideSsr.value) {
        return null
    }
    await getPostCountByMonth()
    return [...monthArchiveProps]
})

const { data: asideTagsData } = await useAsyncData<PostTagItem[] | null>("aside-tags", async () => {
    if (import.meta.client || skipAsideSsr.value) {
        return null
    }
    await getTagTopN()
    return [...postTags]
})

// 应用 SSR 侧栏数据(SSR 渲染与客户端水合共用; 同步回放 statusStore 数据标记, 与 SSR 首帧一致)
watch(
    asideRecommendedData,
    (data) => {
        if (!data) return
        Object.assign(recommendedPost, data)
        statusStore.setHasDataRecommendedRead(data.length > 0)
    },
    { immediate: true },
)

watch(
    asideHotData,
    (data) => {
        if (!data) return
        Object.assign(hotPost, data)
        statusStore.setHasDataHotPost(data.length > 0)
    },
    { immediate: true },
)

watch(
    asideMonthData,
    (data) => {
        if (!data) return
        monthArchiveProps.splice(0, monthArchiveProps.length, ...data)
        statusStore.setHasDataMonthArchive(data.length > 0)
    },
    { immediate: true },
)

watch(
    asideTagsData,
    (data) => {
        if (!data) return
        postTags.splice(0, postTags.length, ...data)
        statusStore.setHasDataPostTag(data.length > 0)
    },
    { immediate: true },
)

// 侧栏点击文章: 直接路由跳转 /p/:id
const handlePostId = async (postID: string) => {
    await router.push(`/p/${postID}`)
}

// 侧栏点击标签: 跳转 /tag/:slug (slug 为 URL 转义形态, 先解码再交由路由编码)
const clickTag = (tag: PostTagItem) => {
    router.push(`/tag/${encodeURIComponent(decodeURIComponent(tag.slug))}`)
}

// 侧栏点击月度归档: 跳转 /year/:year/month/:month
const clickMonthArchive = (row: { year: number; month: number }) => {
    router.push(`/year/${row.year}/month/${row.month}`)
}

// 目录点击: 设置锚点、同步高亮索引并直接滚动到目标标题
// (Nuxt 路由结构下不再经 Home+query/hash 中转, 见 post-detail 的锚点监听)
const tocHeadingClicked = (index: number) => {
    const headings = statusStore.tocHtml
    const heading = headings[index]
    if (!heading) {
        return
    }

    statusStore.setAnchorHash(`#${heading.anchor}`)
    statusStore.tocHeadingShowCurrentIndex = index

    // 复刻 SPA: URL 同步更新为 /p/:id#锚点
    router.replace({ hash: `#${heading.anchor}` }).catch(() => {})

    const target = document.getElementById(heading.anchor)
    if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" })
    }
}

// 拉取「显示标志为 true 且尚无数据」的侧栏模块 (幂等, 已加载的跳过)
const loadMissingAsideData = async () => {
    if (isShowRecommendedRead.value && !hasDataRecommendedRead.value) {
        await getRecommendedPost()
    }
    if (isShowHotPost.value && !hasDataHotPost.value) {
        await getHostPost()
    }
    await refreshLoginAwareAsideData()
}

/**
 * refreshLoginAwareAsideData 刷新登录态感知的侧栏数据 (bf-260903-01 第 2 轮): 登录用户以带 token 的数据覆盖匿名 SSR 注水数据.
 * 后端 view-top-n / count-by-month 会为登录用户叠加本人私密文章计数, 而 SSR 无法认证, payload 注水恒为匿名口径;
 * 初次水合或从 layout:false / 后台返回首页时, 已存在的匿名数据不会触发空数据补拉, 因此必须在登录态就绪后主动覆盖.
 * - 共享 initStores 尚未完成时, 等待其恢复登录态后再决定请求口径;
 * - 匿名用户仅补拉缺失数据, 保持 SSR 注水不重复请求;
 * - forceLoginRefresh 为 true 时, 登录用户无论数据是否已存在都重新请求, 覆盖客户端导航遗留的匿名口径;
 * - 推荐/热门为公开口径接口不随登录态变化, 不重拉; 仅文案数字变化, 无布局位移, 无需骨架屏.
 * @param forceLoginRefresh - true 表示登录用户必须重新拉取, false 时仅补拉缺失数据.
 * @returns 无返回值; initStores 或重拉失败时静默沿用现有数据 (请求层已负责错误提示).
 */
const refreshLoginAwareAsideData = async (forceLoginRefresh = false): Promise<void> => {
    try {
        const { getInitStoresPromise, isInitStoresReady } = await import("@/stores/init")
        if (!isInitStoresReady()) {
            await getInitStoresPromise()
        }
    } catch {
        // initStores 异常不阻塞侧栏展示 (与 init-stores.client 插件容错语义一致), 沿用现有数据
        return
    }

    const isLogin = useUserStore().isLogin
    const requests: Promise<unknown>[] = []

    if (isShowMonthArchive.value && (!hasDataMonthArchive.value || (forceLoginRefresh && isLogin))) {
        requests.push(getPostCountByMonth())
    }
    if (isShowPostTag.value && (!hasDataPostTag.value || (forceLoginRefresh && isLogin))) {
        requests.push(getTagTopN())
    }
    if (requests.length === 0) {
        return
    }

    try {
        await Promise.all(requests)
    } catch {
        // 重拉失败保留现有数据, 避免侧栏因网络抖动清空
    }
}

// feature01(02-plan): 挂载时仅补拉「本地数据仍为空」的侧栏模块
// - 匿名水合场景: payload 已回填全部模块, 标签/归档不重复请求;
// - 登录水合或重挂载场景: 登录态就绪后刷新标签/归档, 覆盖匿名 SSR 口径;
// - 推荐/热门与登录态无关, 仍按本地空数据判断补拉.
onMounted(() => {
    if (recommendedPost.length === 0) {
        void getRecommendedPost()
    }
    if (hotPost.length === 0) {
        void getHostPost()
    }

    void refreshLoginAwareAsideData(true)
})

// 布局常驻不重挂载 (onMounted 只执行一次): 跨页导航显示标志 false→true 翻转时补拉缺失数据
// (如 /page/vip (全部 isShow*=false) → 点击首页 (setHome 全 true) 后侧栏四项齐全)
watch([isShowRecommendedRead, isShowHotPost, isShowPostTag, isShowMonthArchive], () => {
    void loadMissingAsideData()
})

// 默认布局在详情页与首页之间常驻, 用户中心/后台返回首页时又会带回 Pinia 中旧的匿名 SSR 数据.
// 因此仅在路由进入首页时, 对已登录用户强制校准标签与归档; 首页内筛选/翻页不触发重复请求.
watch(
    () => route.name,
    (routeName, previousRouteName) => {
        if (routeName === RouteNames.Home && previousRouteName !== RouteNames.Home) {
            void refreshLoginAwareAsideData(true)
        }
    },
    { flush: "post" },
)
</script>

<style scoped lang="scss">
@include respond-to("pc") {
    .el-aside {
        width: pc.$width-aside;
        background-color: var(--jpz-bg-color-page);
    }

    .el-aside.is-aside-sticky {
        position: sticky; // 短侧栏吸顶, 长侧栏按内容高度贴底
        top: var(--home-aside-sticky-top, 0px);
    }

    .el-aside-content {
        display: flow-root;
    }

    .el-aside-item {
        margin-bottom: 10px;
    }
}

@include respond-to("pad") {
    .el-aside {
        display: none;
    }
}

@include respond-to("phone") {
    .el-aside {
        display: none;
    }
}
</style>
