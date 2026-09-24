<!--
 * FilePath    : blog-client\src\components\layout\aside\layout-aside.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 公用侧栏列表页与文章详情页各自组合使用
-->

<!--
 * 补充说明:
 * bf-260903-01 增加登录态校准重拉与非 PC 请求闸门;
 * 侧栏数据 (推荐/热门/标签/归档) 自行拉取; 详情页目录由 TocFloating 右侧浮动承载 (post-detail 挂载), 不在本侧栏渲染
 * 标签 TopN 与月度归档为登录态感知接口 (后端叠加本人私密文章计数), SSR 注水恒为匿名口径, 水合后需按登录态校准
 * 260917-01-feedback#3 目录移出侧栏改右侧浮动, 侧栏仅余推荐/热门/标签/归档
 * bf-260924-01 专题导航独占集成 (D1): 文章详情页属专题时渲染 PostTopicNav 并隐藏 4 卡片 (v-show 保持 DOM 稳定),
 * 互斥以数据为准: 判定结果由 PostTopicNav 经 settled 事件只读上抛, 补拉与 sticky 计算在专题页跳过;
 * 第3轮反馈#2: 侧栏水合后挂载时 topic-nav 请求可能晚于本组件 onMounted (组件 async setup),
 * 判定收尾前不补拉 4 卡片数据 (此前误判非专题发出请求); 专题 → 非专题恢复显示时补拉缺失数据
-->

<template>
    <el-aside class="el-aside" v-show="isDesktop && isShowHomeAside && (hasDataHomeAside || isTopicPage)">
        <!-- 专题导航 (bf-260924-01): 文章详情页独占右侧栏, 数据组件内自取, 判定结果经 settled 上抛; 组件单实例跨文章复用 (第1轮反馈#3), 不加 :key 重挂载 -->
        <PostTopicNav v-if="route.name === RouteNames.Post" @settled="handleTopicNavSettled" />

        <!-- 卡片单元: 短则吸顶, 长则贴底 (高度基准为本单元真实高度); 专题页隐藏 -->
        <div
            v-show="!isTopicPage"
            ref="asideContentRef"
            class="el-aside-content"
            :class="{ 'is-aside-sticky': isAsideStickyEnabled }"
            :style="{ '--home-aside-sticky-top': asideStickyTop }"
        >
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
import MonthArchive from "@/components/common/month-archive"
import { useGetData } from "@/components/hooks/useHome/api"
import HotPost from "@/components/layout/aside/hot-post"
import PostTag, { usePostTagData } from "@/components/layout/aside/post-tag"
import PostTopicNav from "@/components/layout/aside/post-topic-nav"
import RecommendedRead from "@/components/layout/aside/recommended-read"
import { RouteNames } from "@/router"
import { DeviceType, useDeviceStore } from "@/stores/device"
import { useStatusStore } from "@/stores/status"
import { useUserStore } from "@/stores/user"

defineOptions({ name: "LayoutAside" })

const router = useRouter()
const route = useRoute()

const asideContentRef = useTemplateRef<HTMLElement | null>("asideContentRef")
const asideStickyTop = ref("0px")
const isAsideStickyEnabled = ref(false)
const deviceStore = useDeviceStore()
const { device } = storeToRefs(deviceStore)
const isDesktop = computed(() => device.value === DeviceType.PC)

// 根据卡片单元真实高度更新 sticky 吸附点, 短则吸顶, 长则贴底且避免内部滚动条
// (260917-01-feedback#3: 目录移出侧栏后仅剩本单元, 高度基准回归单元自身)
const updateAsideStickyTop = () => {
    if (isTopicPage.value) {
        // 专题页 4 卡片隐藏, 无需 sticky 计算 (恢复非专题时由 isTopicPage watch 主动重算)
        return
    }

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

const handleViewportResize = () => {
    deviceStore.updateDevice()
    deviceStore.updateWindowWidth()
    updateAsideStickyTop()
}

useResizeObserver(asideContentRef, updateAsideStickyTop)
useEventListener(window, "resize", handleViewportResize)

const statusStore = useStatusStore()

// ---------- 专题导航互斥 (bf-260924-01, D1) ----------
// 互斥以数据为准: PostTopicNav 组件自取数据 (固定 key 单数据槽), 判定结果经 settled 事件只读上抛,
// 本组件不重复请求; SSR 与水合首帧恒 false (双端一致防 mismatch, 侧栏本就水合后挂载);
// 离开文章路由时 computed 自动归 false, 4 卡片随路由恢复显示
const topicNavIsTopic = ref(false)
const topicNavReported = ref(false) // 文章页判定是否已收尾 (仅首次挂载的补拉等待用)

const isTopicPage = computed(() => route.name === RouteNames.Post && topicNavIsTopic.value)

const handleTopicNavSettled = (isTopic: boolean) => {
    topicNavIsTopic.value = isTopic
    topicNavReported.value = true
}

const {
    isShowHomeAside,
    isShowRecommendedRead,
    isShowHotPost,
    isShowPostTag,
    isShowMonthArchive,

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

// 侧栏由默认布局在客户端挂载, 数据仅在 PC 端加载, 避免 PAD/PHONE 请求不可见数据;
// 客户端初始 PC 由 mounted 补拉, PAD/PHONE 切回 PC 由 isDesktop 监听补拉.

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

// 拉取「显示标志为 true 且尚无数据」的侧栏模块 (幂等, 已加载的跳过); 专题页跳过 (卡片不可见不拉数据)
const loadMissingAsideData = async () => {
    if (!isDesktop.value || isTopicPage.value) {
        return
    }
    if (isShowRecommendedRead.value && !hasDataRecommendedRead.value) {
        await getRecommendedPost()
    }
    if (isShowHotPost.value && !hasDataHotPost.value) {
        await getHostPost()
    }
    await refreshLoginAwareAsideData()
}

// loadMissingAsideData 加载锁包装: 同一导航周期内并发的补拉调用只执行首个
// (第3轮反馈#2: 专题恢复与路由切换两个 watch 可能在同一导航内并发触发, 防重复请求)
let isLoadingMissingAsideData = false

const runLoadMissingAsideData = async () => {
    if (isLoadingMissingAsideData) {
        return
    }
    isLoadingMissingAsideData = true
    try {
        await loadMissingAsideData()
    } finally {
        isLoadingMissingAsideData = false
    }
}

// 登录态感知数据刷新进行中标记: 并发调用跳过 (第3轮反馈#2: 同一导航内多 watch 触发时防重复请求)
let isRefreshingLoginAwareAsideData = false

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
    if (!isDesktop.value || isTopicPage.value || isRefreshingLoginAwareAsideData) {
        return
    }

    isRefreshingLoginAwareAsideData = true
    try {
        await doRefreshLoginAwareAsideData(forceLoginRefresh)
    } finally {
        isRefreshingLoginAwareAsideData = false
    }
}

// doRefreshLoginAwareAsideData 刷新执行体 (由 refreshLoginAwareAsideData 持锁调用)
const doRefreshLoginAwareAsideData = async (forceLoginRefresh: boolean): Promise<void> => {
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
// 首次补拉「显示标志为 true 且尚无数据」的侧栏模块
// - 匿名水合场景: payload 已回填全部模块, 标签/归档不重复请求;
// - 登录水合或重挂载场景: 登录态就绪后刷新标签/归档, 覆盖匿名 SSR 口径;
// - 推荐/热门与登录态无关, 仍按本地空数据判断补拉
const loadInitialAsideData = () => {
    if (recommendedPost.length === 0) {
        void getRecommendedPost()
    }
    if (hotPost.length === 0) {
        void getHostPost()
    }

    void refreshLoginAwareAsideData(true)
}

onMounted(() => {
    // 专题 ⇄ 非专题切换时 4 卡片容器 display 翻转, 高度恢复需主动重算 (resize observer 兜底);
    // 专题 → 非专题恢复显示时补拉缺失数据 (首挂于专题页时 4 卡片从未加载, 第3轮反馈#2)
    watch(isTopicPage, (currentIsTopicPage, previousIsTopicPage) => {
        updateAsideStickyTop()
        if (previousIsTopicPage && !currentIsTopicPage) {
            void runLoadMissingAsideData()
        }
    })

    // SSR 默认设备为 PC; 水合完成后再校准断点, 既避免 VNode 不一致, 也保证请求前得到真实设备类型
    deviceStore.updateDevice()
    deviceStore.updateWindowWidth()
    if (!isDesktop.value) {
        return
    }

    // 专题页不补拉 4 卡片数据 (不可见); 判定未收尾时先等待 settled 信号再决定
    // (第3轮反馈#2: 本 onMounted 可能先于 PostTopicNav 的 async setup 请求返回, 直接判定会误发 4 卡片请求)
    if (route.name === RouteNames.Post && !topicNavReported.value) {
        const stopWaitTopicNav = watch(topicNavReported, (reported) => {
            stopWaitTopicNav()
            if (reported && !isTopicPage.value) {
                loadInitialAsideData()
            }
        })
        return
    }

    if (!isTopicPage.value) {
        loadInitialAsideData()
    }
})

// 布局常驻不重挂载 (onMounted 只执行一次): 跨页导航显示标志 false→true 翻转时补拉缺失数据
// (如 /page/vip (全部 isShow*=false) → 点击首页 (setHome 全 true) 后侧栏四项齐全)
watch([isShowRecommendedRead, isShowHotPost, isShowPostTag, isShowMonthArchive], () => {
    void runLoadMissingAsideData()
})

// 从 PAD/PHONE 切回 PC 时仅补拉缺失数据. 登录态强制校准只属于跨页面进入首页的路由语义,
// 不能由尺寸切换触发, 否则已有标签/归档数据会被无意义地重复请求.
watch(isDesktop, (currentIsDesktop, previousIsDesktop) => {
    if (currentIsDesktop && !previousIsDesktop) {
        void runLoadMissingAsideData()
    }
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
        // 260917-01: 拉伸到 container-main 全高, 为内部 sticky 卡片单元提供行程;
        // sticky 子元素行程受包含块高度限制, 自然高度下几乎无行程;
        // 背景色与 .content 同为 --jpz-bg-color-page, 全高拉伸不可见;
        // overflow 必须覆写为 visible: el-aside 基础样式自带 overflow:auto 会形成滚动容器,
        // 后代 sticky 将相对该(不滚动的)滚动容器吸附而永不生效 (旧实现 sticky 挂在 el-aside 自身故不受影响)
        align-self: stretch;
        display: flex;
        flex-direction: column;
        overflow: visible;
    }

    .el-aside-content.is-aside-sticky {
        position: sticky; // 短则吸顶, 长则按内容高度贴底 (260917-01: 由 el-aside 下移到本单元)
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
        display: none; // PAD 维持不展示侧栏 (260917-01 范围确认: 仅 PC 展示目录)
    }
}

@include respond-to("phone") {
    .el-aside {
        display: none; // PHONE 维持不展示侧栏
    }
}
</style>
