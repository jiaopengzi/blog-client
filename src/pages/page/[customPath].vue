<!--
 * FilePath    : blog-client-nuxt\src\pages\page\[customPath].vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 自定义页 (260828-6: SSR 直出对齐 p/[id].vue)
-->

<!--
 * 补充说明:
 * SSR 服务端解析路径 → 404 语义; 正文随 SSR 直出 (与文章详情 feature02 同机制):
 * 页面经 page-path 解析 id 后取全量文章数据, 经 post-data 驱动 PostDetail 渲染与水合,
 * 自定义元素 (视频播放器/付费阅读等) 在 HtmlPreview 内按片段 ClientOnly 渲染
 * 客户端复刻 SPA pageMiddleware (setCustomPage + setPostId) 设置详情态;
 * bug01(260829-08): SSR 取数不带 token (匿名数据), 登录态首屏 (login_hint=1) 经
 * useDetailLoginRefresh 带 token 复拉, 已购内容以登录态数据为准 (匿名用户仍 SSR 直出)
-->

<template>
    <div>
        <!-- bug03(260829-05): v-if 守卫 — 页面不存在时 setup 抛 404 中断, $setup 绑定为空,
             Vue SSR 仍会执行本模板 render, 无守卫时 PostDetail 解析为 undefined 触发
             "Invalid vnode type" 与 "missing template or render function" 两条告警;
             数据存在时 detailMeta 恒非空, 守卫不影响正常渲染 -->
        <!-- bug01(260829-08): detail-final-wrapper — 登录态首屏由内联脚本经 data-list-pending 标记
             在首帧绘制前隐藏 (SSR 详情为匿名数据, 已购内容会误显付费态), 复拉完成后移除标记展示;
             匿名首屏不加标记, SSR 详情直接展示. 骨架屏与列表页同机制 (post-list-view) -->
        <div class="detail-final-wrapper">
            <PostDetail
                v-if="detailMeta"
                :heading-show-current-index="tocHeadingShowCurrentIndex"
                :time="clickTocTime"
                :post-data="detailMeta"
                :is-password-post="detailData?.isPasswordPost ?? false"
                @state="handleState"
                @click-category="clickCategory"
                @click-tag="clickTag"
                @commit-anchor-hash-index="handleAnchorHashIndex"
            />
        </div>
        <!-- 骨架屏: 常驻渲染但默认 CSS 隐藏, 仅登录态首屏(html[data-list-pending])经 CSS 从首帧起展示;
             匿名首屏直接展示 SSR 详情, 骨架屏保持隐藏 (与列表页骨架屏同机制) -->
        <div class="detail-skeleton" aria-hidden="true">
            <div class="skeleton-title"></div>
            <div class="skeleton-meta"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line skeleton-w90"></div>
            <div class="skeleton-line skeleton-w75"></div>
            <div class="skeleton-line skeleton-w90"></div>
            <div class="skeleton-line skeleton-w60"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { nextTick, onMounted, ref, watch } from "vue"

import { pagePathToIDAPI } from "@/api/post/pagePathToID"
import { viewPostByIDAPI } from "@/api/post/viewByID"
import type { PostResByID } from "@/api/post/common"
import { type PostCategory } from "@/api/postCategory/view"
import { type PostTag } from "@/api/postTag/view"
import { ResponseCode } from "@/api/response"
import type { EditorState } from "@/components/editor"
import PostDetail from "@/components/common/post-detail"
import { useSiteOptions } from "@/composables/useSiteOptions"
import { useDetailLoginRefresh } from "@/composables/useDetailLoginRefresh"
import { usePostSeo } from "@/composables/useSeo"
import { useStatusStore } from "@/stores/status"

definePageMeta({ name: "page" })

const route = useRoute()
const router = useRouter()
const statusStore = useStatusStore()

const { tocHeadingShowCurrentIndex } = storeToRefs(statusStore)

const customPath = computed(() => String(route.params.customPath ?? ""))

// 站点配置 SSR 预填充 (页头导航/Logo/页脚双端一致, 无 hydration mismatch)
await useSiteOptions()

// 260828-6: SSR 数据载荷(与 p/[id].vue 同构)——正文随 SSR 直出并注水;
// 密码文章仅含元数据, 解锁流程由客户端 PostDetail 处理
interface PageDetailSsrPayload {
    post: PostResByID | null
    isPasswordPost: boolean
}

const {
    data: detailData,
    pending,
    refresh,
} = await useAsyncData<PageDetailSsrPayload>(
    `page-detail-${customPath.value}`,
    async () => {
        const idRes = await pagePathToIDAPI({ slug: customPath.value })
        if (idRes.data.code !== ResponseCode.PageIDSuccess || !idRes.data.data) {
            return { post: null, isPasswordPost: false }
        }

        const postRes = await viewPostByIDAPI({ post_id: idRes.data.data })
        if (postRes.data.code === ResponseCode.PostViewByIDSuccess) {
            return { post: postRes.data.data, isPasswordPost: false }
        }
        if (postRes.data.code === ResponseCode.PostViewPasswordIsEmpty && postRes.data.data) {
            return { post: postRes.data.data, isPasswordPost: true }
        }
        return { post: null, isPasswordPost: false }
    },
    { watch: [customPath] },
)

// bug01(260829-08): 登录态首屏复拉 — SSR 详情恒为匿名数据 (服务端不带 token), 已购用户的付费内容
// 会被误显为付费态; 登录态(login_hint=1)挂载后带 token 复拉覆盖 (未登录/匿名不受影响, SSR 直出保留)
useDetailLoginRefresh(refresh)

// SEO(对齐 p/[id].vue: seo_title 优先回退 post_title、canonical/OG、JSON-LD 直出)
const detailMeta = computed(() => detailData.value?.post ?? null)
usePostSeo(() => detailMeta.value)

// 解析失败或文章不存在 → 404
// 不加 fatal: true(260825-02 bug04 约定): nitropack 的 defaultHandler 以
// `error.unhandled || error.fatal` 判定 isSensitive 并 console.error 输出
// "[request error] [fatal]" 堆栈; 自定义页不存在属正常 404, 不该按敏感错误打日志.
// 去掉后状态码与错误页渲染不变(仍为 404).
if (!pending.value && detailMeta.value === null) {
    throw createError({ statusCode: 404, message: "页面不存在或已删除" })
}

// 详情页显示状态仅客户端设置 (复刻 SPA pageMiddleware 语义): SSR 正文由 post-data prop 直出,
// 不依赖 statusStore (payload 不注水 status, 服务端与客户端水合首帧均按 store 默认态渲染,
// 一致无 mismatch); 水合完成后 (onMounted) 再切换自定义页态, 侧栏/交互区响应式收起
// 顺序说明: 必须先 setCustomPage 再赋 postId——若 detailType 仍是 post, PostDetail 的 postId
// watch 会触发 updatePostDetail push home?post_id → legacy 301 → /p/:id (/page/vip 被重定向)
const applyCustomPageState = (id: string) => {
    void statusStore.setCustomPage()
    statusStore.postId = id
    statusStore.anchorHash = ""
}

onMounted(() => {
    const id = detailData.value?.post?.id
    if (route.name === "page" && typeof id === "string" && id) {
        applyCustomPageState(id)
    }
})

// 站内导航切换自定义页(/page/a → /page/b)时同步状态(此时已非水合首帧, watch 安全)
watch(
    () => [route.name, detailData.value?.post?.id] as const,
    ([name, id]) => {
        if (name === "page" && typeof id === "string" && id) {
            applyCustomPageState(id)
        }
    },
)

const clickTocTime = ref(new Date())

// 更新文章详情状态 (TOC 数据写入 statusStore, 由 LayoutAside 渲染; 与 p/[id].vue 一致)
const handleState = (val: EditorState) => {
    statusStore.tocHtml = val.tocHtml
    statusStore.tocHeadingShowCurrentIndex = val.headingShowCurrentIndex
    statusStore.setHasDataToc(statusStore.tocHtml.length > 0)
}

// 处理标题锚点 (目录索引同步到 store)
const handleAnchorHashIndex = async (index: number) => {
    await nextTick(() => {
        statusStore.tocHeadingShowCurrentIndex = index
        clickTocTime.value = new Date()
    })
}

// 文章内点击分类/标签: 直接路由跳转
const clickCategory = (category: PostCategory) => {
    router.push(`/category/${encodeURIComponent(category.slug)}`)
}

const clickTag = (tag: PostTag) => {
    router.push(`/tag/${encodeURIComponent(decodeURIComponent(tag.slug))}`)
}
</script>

<style scoped lang="scss">
// bug01(260829-08): 登录态首屏隐藏与骨架屏 (与 post-list-view 同机制):
// 内联脚本在首帧绘制前给 html 加 data-list-pending (仅 login_hint=1 时), 详情容器经 CSS 隐藏,
// 登录态复拉完成后由 useDetailLoginRefresh 移除标记再展示; SSR HTML 不含该标记, 详情对爬虫可见
:global(html[data-list-pending] .detail-final-wrapper) {
    display: none;
}

// 骨架屏: 常驻渲染, 默认隐藏; 仅登录态首屏(html[data-list-pending])从首帧起展示
.detail-skeleton {
    display: none;
    min-height: 400px;
    padding: 24px;
    background-color: var(--jpz-bg-color);
    border: 1px solid var(--jpz-border-color);
    border-radius: 5px;
}

:global(html[data-list-pending] .detail-skeleton) {
    display: block;
}

.skeleton-title {
    height: 32px;
    width: 55%;
    margin-bottom: 16px;
}

.skeleton-meta {
    height: 18px;
    width: 35%;
    margin-bottom: 24px;
}

.skeleton-line {
    height: 14px;
    width: 100%;
    margin-top: 12px;
}

.skeleton-w90 {
    width: 90%;
}

.skeleton-w75 {
    width: 75%;
}

.skeleton-w60 {
    width: 60%;
}

// shimmer 扫光: 渐变底色 + 移动高光条 (与列表页骨架屏观感一致)
// 底色取主题边框色(双主题下均可见), 高光为白色扫光; 不能用 bg-color-overlay(当前主题为纯白, 会白底隐形)
.skeleton-title,
.skeleton-meta,
.skeleton-line {
    border-radius: 3px;
    background: linear-gradient(
        100deg,
        color-mix(in srgb, var(--jpz-border-color) 80%, transparent) 40%,
        color-mix(in srgb, #ffffff 70%, transparent) 50%,
        color-mix(in srgb, var(--jpz-border-color) 80%, transparent) 60%
    );
    background-size: 200% 100%;
    background-position: 150% 0;
    animation: detail-skeleton-shimmer 1.4s ease-in-out infinite;
}

@keyframes detail-skeleton-shimmer {
    0% {
        background-position: 150% 0;
    }
    100% {
        background-position: -50% 0;
    }
}
</style>
