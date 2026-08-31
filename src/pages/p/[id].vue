<!--
 * FilePath    : blog-client-nuxt\src\pages\p\[id].vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 文章详情页 (阶段 4 终版拆分: 头部/面包屑/内容/侧栏/页脚在本页组合; SSR 取数失败不误判 404)
-->

<!--
 * 补充说明:
 * 显示状态由本页按 SPA statusStore 语义管理 (进入即 setPostDetail);
 * feature02: PostDetail 服务端直出正文 (SEO 收录), 自定义元素 (视频播放器/付费阅读/付费下载/
 * 验证码等) 在 HtmlPreview 内统一 ClientOnly 渲染, 不进 SSR;
 * SSR 数据经 view-by-id 获取 (含正文), 页面经 post-data prop 驱动 PostDetail 渲染与水合,
 * 密码文章 (2042) 仅含元数据 (正文为空), 密码解锁流程由客户端 PostDetail 处理;
 * bug01(260829-08): SSR 取数不带 token (匿名数据), 登录态首屏 (login_hint=1) 经
 * useDetailLoginRefresh 带 token 复拉, 已购内容以登录态数据为准 (匿名用户仍 SSR 直出)
-->

<template>
    <div>
        <!-- 文章详情 (feature02): 移除全量 ClientOnly, 正文随 SSR 直出;
             自定义元素在 HtmlPreview 内按片段 ClientOnly 渲染 (SSR 仅输出正文 HTML 片段) -->
        <!-- bug03(260829-05): v-if 守卫 — 文章不存在时 setup 抛 404 中断, $setup 绑定为空,
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
import { computed, nextTick, onMounted, ref, watch } from "vue"

import type { PostResByID } from "@/api/post/common"
import { viewPostByIDAPI } from "@/api/post/viewByID"
import { useSiteOptions } from "@/composables/useSiteOptions"
import { useDetailLoginRefresh } from "@/composables/useDetailLoginRefresh"
import { usePostSeo } from "@/composables/useSeo"
import { type PostCategory } from "@/api/postCategory/view"
import { type PostTag } from "@/api/postTag/view"
import { ResponseCode } from "@/api/response"
import type { EditorState } from "@/components/editor"
import PostDetail from "@/components/common/post-detail"
import { useStatusStore } from "@/stores/status"

// 路由名与 SPA RouteNames.Post ("post") 对齐 (旧 /post/:id 语义, 301 后由本路由承接)
definePageMeta({ name: "post" })

const route = useRoute()
const router = useRouter()
const statusStore = useStatusStore()

// bug02(260826-03): 带锚点直链/刷新的"从顶部平滑滚入"
// URL fragment 不达服务端, app.vue 内联脚本在解析期启动 rAF 钉顶循环 (每帧 scrollTo(0,0) 撤销
// 浏览器原生锚点瞬时跳转, 页面稳定停在顶部); 此处挂载后停止钉顶并平滑滚入目标锚点,
// 复刻 SPA CSR 内容后渲染的定位体验; 视频/图片异步加载会改变版面高度, 600ms 后校正一次
onMounted(() => {
    const hash = route.hash
    if (!hash) {
        return
    }

    // 停止内联脚本的钉顶循环, 等一帧让循环完全退出后再触发平滑滚动
    ;(window as unknown as { jpzHashPin?: boolean }).jpzHashPin = false
    const anchor = decodeURIComponent(hash.slice(1))

    const doScroll = () => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    requestAnimationFrame(() => {
        doScroll()
        setTimeout(doScroll, 600)
    })
})

const { tocHeadingShowCurrentIndex } = storeToRefs(statusStore)

const postId = computed(() => String(route.params.id ?? ""))

// 站点配置 SSR 预填充 (页头 Logo/导航依赖, 必须在渲染前完成)
await useSiteOptions()

// feature02: 页面 SSR 数据载荷 (正文随 SSR 直出并注水, 水合首帧与 SSR 一致)
// 密码文章 (2042) 仍携带元数据 (标题/摘要), 正文为空; 正文不再剥离 (此前为"绝不进 SSR payload", 现为 SEO 收录核心)
interface PostDetailSsrPayload {
    post: PostResByID | null
    isPasswordPost: boolean
}

const {
    data: detailData,
    error: detailError,
    pending,
    refresh,
} = await useAsyncData<PostDetailSsrPayload>(
    `post-detail-${postId.value}`,
    async () => {
        const res = await viewPostByIDAPI({ post_id: postId.value })
        if (res.data.code === ResponseCode.PostViewByIDSuccess && res.data.data) {
            return { post: res.data.data, isPasswordPost: false }
        }
        if (res.data.code === ResponseCode.PostViewPasswordIsEmpty && res.data.data) {
            return { post: res.data.data, isPasswordPost: true }
        }
        return { post: null, isPasswordPost: false }
    },
    { watch: [postId] },
)

// bug01(260829-08): 登录态首屏复拉 — SSR 详情恒为匿名数据 (服务端不带 token), 已购用户的付费内容
// 会被误显为付费态; 登录态(login_hint=1)挂载后带 token 复拉覆盖 (未登录/匿名不受影响, SSR 直出保留)
useDetailLoginRefresh(refresh)

// SEO 层读取的元数据视图 (兼容 usePostSeo 既有签名)
const detailMeta = computed(() => detailData.value?.post ?? null)

// 阶段 5: 文章页 SEO (seo_title 优先回退 post_title、canonical/OG、JSON-LD Article 直出)
usePostSeo(() => detailMeta.value)

// 404 语义: 接口明确「文章不存在」才 404; 密码空 (2042) 走客户端密码流程
// bug04(260831-01): SSR 直连后端失败 (NUXT_API_BASE 不可达/为空) 时 asyncData 抛错、data 为 null,
// 此前与「文章不存在」混同判定 404 —— 线上表现为详情页刷新即 404、/_payload.json 同步 404(bug03)。
// 这里以 error 区分: 请求失败不抛 404, 渲染空详情(v-if 守卫), 客户端挂载后 refresh 走同源 /api
// 重拉恢复(对齐 SPA 纯 CSR 的请求失败行为); 服务端 warn 进容器日志便于排查部署链路
// bug03(260831-01 反馈第1轮): 水合期客户端会从 payload 还原 SSR 侧错误对象再打印一次, 浏览器控制台
// 出现携带内部直连地址(blog-server:5426)的取数失败噪音; 水合中的还原错误不打印(下方 onMounted
// 重拉仍失败时才在客户端输出), 服务端与水合后的真实客户端错误保持原样打印。
// 注意 error 分支不得落入 404 判定(嵌套结构): 取数失败 ≠ 文章不存在
const nuxtApp = useNuxtApp()
if (detailError.value) {
    if (import.meta.server || !nuxtApp.isHydrating) {
        console.warn(`[post-detail] 取数失败(post_id=${postId.value}): ${detailError.value.message}`)
    }
} else if (!pending.value && detailMeta.value === null) {
    throw createError({ statusCode: 404, message: "文章不存在或已删除" })
}

// bug04(260831-01): SSR 取数失败的客户端恢复 —— 水合后重拉(浏览器走同源 /api, 不依赖 SSR 直连链路),
// 成功后 detailError 重置为 null、detailData 更新, 页面恢复正常渲染; 仍失败时保持空详情, 不误判 404,
// 并补一条客户端侧 warn(与上方水合期降噪配合: 只有真实发生的客户端失败才在浏览器控制台输出)
onMounted(async () => {
    if (detailError.value && !detailMeta.value) {
        await refresh()
        if (detailError.value) {
            console.warn(`[post-detail] 客户端重拉仍失败(post_id=${postId.value}): ${detailError.value.message}`)
        }
    }
})

// 详情页显示状态由本页管理 (符合 SPA statusStore 显示逻辑): 进入即详情态 (同步执行, SSR 前就位)
watch(
    () => [route.name, route.params.id] as const,
    ([name, id]) => {
        if (name === "post" && typeof id === "string" && id) {
            statusStore.postId = id
            statusStore.anchorHash = ""
            statusStore.setPostDetail()
        }
    },
    { immediate: true },
)

const clickTocTime = ref(new Date())

// 更新文章详情状态 (TOC 数据写入 statusStore, 由 LayoutAside 渲染)
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

// 页头搜索: 跳转搜索页
const handleSearch = (val: string) => {
    router.push(`/s/${encodeURIComponent(val)}`)
}
</script>

<style scoped lang="scss">
.post-detail-root {
    width: 100%;
}

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
