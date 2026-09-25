<!--
 * FilePath    : blog-client\src\components\common\post-detail\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文章详情 
-->

<!--
 260917-01: 详情页目录改右侧浮动;
 feedback#1 修复 hash 定位游标抖动与中文锚点解码;
 feedback#2 目录点击滚动单点驱动;
 feedback#3 导航进行中抑制观察器回写防抢占离开/更新导航;
 feedback#4 滚动跟随同步 URL hash;
 feedback#5 首次进入未滚动不写锚点;
 bugfix 260918-02: 文章 ID 未就绪时不再发出详情/密码验证请求;
 260925-03 后续: 引言区 (首个标题尚未越过视口顶) 无当前章节 — 观察器回写归一为 -1 (目录清高亮,
 折叠态回退"目录"), 滚动停稳 settle 兜底校准, 高亮与 URL 锚点"引言区无锚点"同域;
 260925-05: 程序化 hash 同步 (滚动跟随/目录点击/清锚) 改 history.replaceState 直写 — router.replace
 会触发 Nuxt page:loading:start (beforeEach 对每次导航尝试无条件触发, 含 hash-only), 密集标题文章
 滚动时顶部加载条反复闪现; 改直写后锚点存在性判断一律读 location.hash (route.hash 不再随之更新);
-->

<template>
    <section ref="webFullscreenRef" id="webFullscreenContainer">
        <!-- 新增的固定占位内容 -->
        <!-- feature02: 交互按钮在 ClientOnly 内渲染(el-tooltip SSR 输出与客户端不一致, 会产生 hydration mismatch) -->
        <div class="affix-interaction">
            <ClientOnly>
                <DetailInteraction v-if="isShowDetailInteraction" direction="vertical" :items="interactionItems" @click-item="handleClickInteraction" />
            </ClientOnly>
        </div>
        <section class="post-detail-bg">
            <div class="post-detail">
                <PostMeta
                    :meta="postMeta"
                    :is-hide-time-icon="deviceStore.device === DeviceType.PHONE"
                    @immersion-read="toggle"
                    @author-user-name="clickAuthorUserName"
                    @post-id="editPost"
                />

                <!-- 密码保护 -->
                <div v-if="isPasswordPost">
                    <PostPassword @password="submitPassword" />
                </div>

                <HtmlPreview
                    v-if="!isPasswordPost"
                    ref="previewRef"
                    :html="state.html"
                    :img-urls="state.imgUrls"
                    :is-show-el-image-viewer="state.isShowElImageViewer"
                    :is-show-preview-wechat="state.isShowPreviewWechat"
                    :is-user-scroll-preview="state.isUserScrollPreview"
                    :heading-show-current-index="headingShowCurrentIndex"
                    :create-order-loading="isPayLoading"
                    :price="postMeta.price"
                    :is-paid="postMeta.is_paid"
                    :pay-strategy="postMeta.pay_strategy"
                    :pay-roles="postMeta.pay_roles"
                    :post-id="postId"
                    :video-toc="postMeta.videoToc"
                    @show-image-viewer="showImageViewer"
                    @close-image-viewer="closeImageViewer"
                    @heading-show-current="handleHeadingShowCurrentAc"
                    @update-is-user-scroll="handleUpdateIsUserScrollPreview"
                    @commit-heading-map="updateHeadingMap"
                    @pay-single="handlePaySingle"
                    @pay-vip="handlePayVip"
                    @pay-key="handlePayKey"
                    @pay-membership="handlePayMembership"
                />
                <DetailBottomSame v-if="isShowDetailBottomSame" class="bottom-same" />
                <ClientOnly>
                    <DetailInteraction
                        v-if="isShowDetailInteraction"
                        class="interaction-bottom"
                        direction="horizontal"
                        :items="interactionItems"
                        @click-item="handleClickInteraction"
                    />
                    <DetailUpdatedAt :data="updatedAt" />
                </ClientOnly>
            </div>
        </section>
    </section>

    <DetailCategoryTag v-if="isShowDetailCategoryTag" class="category-tag-bottom" :data="categoryTag" @click-category="clickCategory" @click-tag="clickTag" />
    <DetailCopyright v-if="isShowDetailCopyright" class="copyright-bottom" :data="copyright" />
    <DetailPrevNext v-if="isShowDetailPrevNext" class="prev-next" :data="prevNext" @post-id="handlePostId" />
    <CommentList
        v-if="postMeta.is_comment_status_open"
        class="comment-list"
        :post-id="postId"
        :post-author="postMeta.author_id || ''"
        :status="commentStatus"
        :update-time="commentListUpdateTime"
        :is-admin="isAdmin"
        @reply="handleReply"
        @mentions="handleMentions"
    />
    <!-- 评论编辑器 (ClientOnly: 编辑器基于 CodeMirror, 仅客户端渲染) -->
    <ClientOnly>
        <CommentEditor
            v-if="postMeta.is_comment_status_open"
            ref="commentEditorRef"
            class="comment-editor"
            :post-id="postId"
            :mentions="mentions"
            :is-admin="isAdmin"
            :reply-to-id="replyToId"
            @comment-insert="handleInsert"
        />
    </ClientOnly>

    <ClientOnly>
        <PosterShare class="poster-share" v-if="isShowPosterShare" :data="dataPosterShare" @poster-complete="handPosterComplete" />
    </ClientOnly>
    <!-- 沉浸阅读模式下的回到顶部按钮 -->
    <!--
        沉浸阅读时 .web__fullscreen 覆盖整个视口, window 不再滚动,
        base-layout 中的 el-backtop 无法触发, 因此在此处单独放置一个 el-backtop,
        以 .web__fullscreen 容器作为滚动目标
    -->
    <ClientOnly>
        <el-backtop v-if="isWebFullscreen" :bottom="100" target="#webFullscreenContainer" class="immersive-backtop-container">
            <div class="immersive-backtop">UP</div>
        </el-backtop>
    </ClientOnly>
    <!-- 浮动目录 (260917-01-feedback#3): 详情页目录不再放侧栏 (侧栏卡片会与吸顶目录互相遮盖),
         与沉浸模式一致以右侧浮动面板承载, PC 且有目录数据即挂载 (沉浸/普通共用, immersive prop 区分落位);
         仅 PC 挂载 (PAD/PHONE 不提供目录); v-if 放在 ClientOnly 上: 条件在 SSR 与水合首帧恒为 false
         (status store 不注水, tocHtml 水合期为空), 两端一致无 mismatch;
     -->
    <ClientOnly>
        <TocFloating v-if="deviceStore.device === DeviceType.PC && hasTocData" :immersive="isWebFullscreen" />
    </ClientOnly>
</template>

<script lang="ts" setup>
import type { Completion } from "@codemirror/autocomplete"
import { storeToRefs } from "pinia"
import { computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, useTemplateRef, watch } from "vue"
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router"

import { type CommentRes } from "@/api/comment/common"
import { isValidPostId, type PostResByID } from "@/api/post/common"
import { RoleName } from "@/api/permissionRole/role"
import { type ViewPostByIDRequest } from "@/api/post/viewByID"
import { type PostCategory } from "@/api/postCategory/view"
import { type PostTag } from "@/api/postTag/view"
import PostMeta from "@/components/common/post-meta"
import PostPassword from "@/components/common/post-password"
import PosterShare from "@/components/common/poster-share"
import TocFloating from "@/components/common/toc-floating"
import type { EditorState } from "@/components/editor"
import HtmlPreview from "@/components/editor/components/preview/index.vue"
import { usePreview } from "@/components/editor/hooks/usePreview"
import { useAppLoadingIndicator } from "@/composables/useAppLoadingIndicator"
import { usePostDetail } from "@/components/hooks/usePostDetail"
import { useWebFullscreen } from "@/components/hooks/useWebFullscreen"
import { DeviceType, useDeviceStore } from "@/stores/device"
import { LocalStorageKey } from "@/stores/local"
import { useStatusStore } from "@/stores/status"
import { useUserStore } from "@/stores/user"
import { MessageUtil } from "@/utils/message"

import DetailBottomSame from "./components/bottom-same"
import DetailCategoryTag from "./components/category-tag"
import { type CommentEditorRef } from "./components/comment-editor"
import CommentEditor from "./components/comment-editor/index.vue"
import CommentList from "./components/comment-list"
import DetailCopyright from "./components/copyright"
import DetailInteraction from "./components/interaction"
import DetailPrevNext from "./components/prev-next"
import DetailUpdatedAt from "./components/updated-at"
import { useHeading, useInteraction, useOrder } from "./hooks"
import { type PostDetailProps } from "./types"

defineOptions({ name: "PostDetail" })

const {
    headingShowCurrentIndex, // 当前展示的标题的索引
    time,
    postData, // feature02: 页面 SSR 提供的文章数据(含正文), 服务端直出与水合共用
    isPasswordPost: isPasswordPostAc, // feature02: 页面 SSR 数据流给出的密码保护标记(响应码驱动)
} = defineProps<PostDetailProps>()

const emit = defineEmits<{
    (event: "state", val: EditorState): void
    (event: "commit-anchor-hash-index", val: number): void
    (event: "click-category", val: PostCategory): void
    (event: "click-tag", val: PostTag): void
}>()

const deviceStore = useDeviceStore()
const statusStore = useStatusStore()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const {
    postId,
    anchorHash,
    detailType,
    // 文章详情相关属性
    isShowDetailInteraction,
    isShowDetailBottomSame,
    isShowDetailCategoryTag,
    isShowDetailCopyright,
    isShowDetailPrevNext,
} = storeToRefs(statusStore)

const { data: userInfo } = storeToRefs(userStore)

const isAdmin = computed(() => {
    return userInfo.value.user.role === RoleName.Administrator
})

// 260917-01: 沉浸模式浮动目录挂载条件 — 目录数据就绪 (水合后经 handleState 写入 statusStore)
const hasTocData = computed(() => statusStore.tocHtml.length > 0)

const postDetailRef = useTemplateRef("webFullscreenRef")
const commentEditorRef = useTemplateRef<CommentEditorRef>("commentEditorRef")

const { isWebFullscreen, toggle } = useWebFullscreen(postDetailRef)

const postIdReq = reactive<ViewPostByIDRequest>({} as ViewPostByIDRequest)

const {
    manager,
    state,
    postMeta,
    isPasswordPost, // 是否是密码保护文章
    applyPostData, // feature02: 应用文章数据(SSR/客户端共用入口)
    setIsPasswordPost, // feature02: 设置密码保护标记(响应码驱动)
    latestViewCount, // feature02: 最近一次接口返回的浏览量(水合后回填)
    updateBreadcrumb, // feature02: 更新面包屑(客户端水合后同步)
    copyright,
    prevNext,
    updatedAt,
    categoryTag,
    commentStatus,
    clickAuthorUserName,
    editPost,
    updatePostDetail,
    updateRouterPush,
    setPostLike,
    setPostStar,
    getPrevNext, // feature02: 上一篇/下一篇(prop 驱动流程补拉)
    updatePostInteraction, // feature02: 交互状态(prop 驱动流程补拉)
    runPostDetailSideEffects, // feature02: 详情副作用统一入口
} = usePostDetail(detailType, postIdReq, anchorHash)

// 交互 hook
const {
    interactionItems, // 交互项
    isShowPosterShare, // 是否显示分享海报
    handPosterComplete, // 处理分享海报完成事件
    dataPosterShare, // 生成分享海报需要的数据
    handleClickInteraction, // 处理交互点击事件
    setAffixLeft, // 设置交互项的左侧偏移量
} = useInteraction(postMeta, postId, detailType, setPostLike, setPostStar, postDetailRef)

// 预览
const { showImageViewer, closeImageViewer, handleHeadingShowCurrent, handleUpdateIsUserScrollPreview } = usePreview(manager)

const { handlePaySingle, handlePayVip, handlePayKey, handlePayMembership, isPayLoading } = useOrder(postId)

// 更新文章详情状态
const handleHeadingShowCurrentAc = (val: number) => {
    // hash 定位窗口内丢弃观察器回写的中间态索引 (路过标题), 保证目录游标直落 hash 目标 (260917-01-feedback#1)
    if (isHashPositioning) return
    // 260917-01-feedback#3: 导航进行中丢弃观察器回写 (见 isRouteNavigationInFlight 说明)
    if (isRouteNavigationInFlight) return
    // 260925-03 后续: 观察器回写按视口位置归一 — 引言区 (首个目录标题尚未越过视口顶) 不属于任何章节,
    // 首标题可见但未过顶、或跳滚/长间隔段无交叉变化时的回写都是过期章节索引, 统一归一为 -1,
    // 目录清空高亮且折叠态回退"目录", 与清锚逻辑 (isAboveFirstHeading) 同一边界, 高亮与 URL 锚点同域
    const normalizedVal = normalizeHeadingIndexByViewport(val)
    handleHeadingShowCurrent(normalizedVal)
    emit("state", state)
    // 滚动跟随同步 URL hash (260917-01-feedback#4)
    syncHashOnScroll(normalizedVal)
}

const appLoadingIndicator = useAppLoadingIndicator()

// 260917-01-feedback#1: 带 hash 直链/刷新或目录点击的程序化定位窗口标记.
// 定位期间正文平滑滚动会路过中间标题, IntersectionObserver 回写的"路过索引"会与定位目标索引
// 互相覆盖 (游标来回抖动且终态可能错位), 因此窗口内丢弃 heading-show-current 回写, 定位目标唯一权威.
// 260917-01-feedback#2: 窗口与校正定时器改为可取消 — 快速连续点击目录时, 上一轮残留的 600/1600ms
// 校正定时器会把页面滚回过期锚点 (与新一轮目标互相拉扯, 即反馈的"来回抖动"), 新定位开始前统一清场
let isHashPositioning = false
let hashPositioningTimers: Array<ReturnType<typeof setTimeout>> = []

// 260925-05: 程序化 hash 同步不再走路由导航 (原 programmaticHashMark 标记机制随之移除, 见 syncHashProgrammatic)

// 260917-01-feedback#3: 路由导航进行中标记 — onBeforeRouteLeave / onBeforeRouteUpdate 在导航管道最前段触发,
// 此后到组件卸载 (离开) 或路由提交 (同路由更新) 之前, 观察器仍活着且会因布局/滚动变化爆发回写;
// 期间一切"由本组件驱动写 store / 写 URL"的动作必须停止:
// ① 写 URL 的 router.replace 会抢占取消尚未提交的导航 (面包屑首页点击失效 + URL 残留详情锚点的根因,
//    上一篇/下一篇的 scrollTo(0,0) 回写是同机制的竞态变体);
// ② emit("state") → 页面 handleState 会把点击方刚 setHome 清空的 tocHtml 复活写回 store.
// 离开导航不重置 (组件必然随导航卸载); 同路由更新 (/p/a → /p/b) 提交后经 fullPath watch 复位,
// 新文章的目录跟随不受影响
let isRouteNavigationInFlight = false
onBeforeRouteLeave(() => {
    isRouteNavigationInFlight = true
    // 离场即清场进行中的定位, 残留定时器会在卸载后滚向已不存在的锚点
    cancelHashPositioning()
})
onBeforeRouteUpdate((to, from) => {
    // 仅路径变化 (/p/a → /p/b 上一篇/下一篇) 才抑制; hash-only 的程序化同步已改 history.replaceState
    // 不再走路由 (260925-05), 本守卫只面对真实导航, 同路径 hash-only 真导航 (直链/后退) 不受影响
    if (to.path === from.path) return
    isRouteNavigationInFlight = true
    cancelHashPositioning()
})
// 导航提交 (fullPath 变化) 后解除抑制: 离开场景随后卸载无副作用, 更新场景恢复新文章的目录跟随
watch(
    () => route.fullPath,
    () => {
        isRouteNavigationInFlight = false
    },
)

// 定位窗口时长: 覆盖平滑滚动全程 + 直链场景图片异步加载导致的二次校正 (复刻 SPA 的多次校正体验)
const HASH_POSITIONING_MS = 1600

/**
 * cancelHashPositioning 清除进行中的 hash 定位: 取消全部校正定时器并解除回写抑制.
 * @remarks 新的定位 (目录点击 / 前进后退 / 直链) 开始前必须调用, 保证同一时刻只有一个定位目标生效.
 * @returns 无返回值.
 */
const cancelHashPositioning = (): void => {
    hashPositioningTimers.forEach((timer) => clearTimeout(timer))
    hashPositioningTimers = []
    isHashPositioning = false
}

/**
 * openHashPositioningWindow 开启定位回写抑制窗口, 到期自动解除.
 * @remarks 重复调用不叠加定时器 (调用方先 cancelHashPositioning 清场); 到期后交还用户滚动的目录跟随.
 * @returns 无返回值.
 */
const openHashPositioningWindow = (): void => {
    isHashPositioning = true
    hashPositioningTimers.push(
        setTimeout(() => {
            isHashPositioning = false
        }, HASH_POSITIONING_MS),
    )
}

/**
 * syncHashProgrammatic 程序化更新 URL hash: history.replaceState 直写地址栏.
 * @remarks 260925-05: 原实现走 router.replace — Nuxt 的 page:loading:start 在 router beforeEach
 * 对每次导航尝试无条件触发 (hash-only 也不例外), 顶部加载条随滚动跟随/目录点击的每次 hash 变化
 * 反复闪现 (密集标题文章快速来回滚动实测 76% 采样时间可见); 程序化 hash 同步本质是页面内状态,
 * 不应按路由加载计费, 改 replaceState 后不产生导航: 加载条/中间件/route watch 全部不受扰,
 * 也不再有"写入方滚动与 route.hash watch 定位互相拉扯" (原 programmaticHashMark 标记机制因此移除);
 * 直链与浏览器前进/后退仍是真实导航, 由 route.hash watch 照常定位;
 * history.state 原样保留 (vue-router 的前进/后退位置键在 state 内, 丢失会破坏历史栈).
 * @param hash - 目标 hash (含 # 前缀, 解码形态; 空串表示清除锚点).
 * @returns 无返回值.
 */
const syncHashProgrammatic = (hash: string): void => {
    if (!import.meta.client) return
    history.replaceState(history.state, "", `${location.pathname}${location.search}${hash}`)
}

/**
 * decodeRouteHashAnchor 解码路由 hash 中的锚点 id.
 * @remarks 直链中的中文锚点为百分号编码形态 (如 #idx5-3-%E6%B4%9E%E8%A7%81), DOM id 与 tocHtml
 * 均为解码后 Unicode, 不解码则 getElementById 与 findIndex 全部落空 (等价移植 p/[id].vue 的 decode);
 * 非法转义序列解码抛错时回退原样, 兼容 #100%sale 一类脏 hash.
 * @param hash - 路由 hash (含 # 前缀).
 * @returns 解码后的锚点 id.
 */
const decodeRouteHashAnchor = (hash: string): string => {
    const raw = hash.replace("#", "")
    try {
        return decodeURIComponent(raw)
    } catch {
        return raw
    }
}

/**
 * @description: 按当前路由 hash 滚动到对应标题并同步目录高亮 (复刻 SPA: 带 #锚点 访问时先渲染再定位).
 * @remarks 仅服务非程序来源的 hash 变化 (直链/刷新/浏览器前进后退); 目录点击的滚动由 anchorHash watch 驱动.
 * 入口先清场 (260917-01-feedback#2), 保证快速连续的前进/后退不会残留旧目标的校正定时器.
 * @returns 无返回值.
 */
const scrollToRouteHash = (): void => {
    const hash = route.hash
    if (!hash) return

    const anchor = decodeRouteHashAnchor(hash)
    cancelHashPositioning()
    isHashPositioning = true

    const doScroll = () => {
        const target = document.getElementById(anchor)
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" })
        }

        // 同步目录高亮
        const index = statusStore.tocHtml.findIndex((item) => item.anchor === anchor)
        if (index >= 0) {
            statusStore.tocHeadingShowCurrentIndex = index
        }
    }

    // 正文渲染完成后定位; 视频/图片异步加载会持续改变版面高度,
    // 多次校正保证最终落在目标标题 (复刻 SPA 的先渲染再定位体验);
    // 全部定时器入组登记, 新一轮定位 (点击/前进后退) 开始时统一取消 (260917-01-feedback#2)
    nextTick(() => {
        doScroll()
        hashPositioningTimers.push(setTimeout(doScroll, 600))
        hashPositioningTimers.push(
            setTimeout(() => {
                doScroll()
                // 定位收尾后解除回写抑制, 交还用户滚动的目录跟随
                isHashPositioning = false
            }, HASH_POSITIONING_MS),
        )
    })
}

/**
 * syncHashOnScroll 滚动跟随同步 URL hash (260917-01-feedback#4): 目录高亮随滚动变化时地址栏锚点同步更新;
 * 滚回顶部 (首个目录标题尚未越过视口顶, 即正文引言区) 时清除锚点.
 * @remarks 仅在定位窗口外执行 (handleHeadingShowCurrentAc 已先行拦截); 260925-05 起 hash 读写均走
 * location 而非 route — 程序化同步为 history.replaceState 直写, 路由层 (route.hash) 不再随之更新,
 * 读 route.hash 会拿到过期值导致去重失效与清锚误判.
 * 260917-01-feedback#5: 顶部一律无锚点 — 首次进入详情页视口内同时可见多个标题, 观察器初始回写
 * 不是用户滚动, 若放行会"未滚动却自动出现锚点" (首页列表点进详情即被写 #idx3-...);
 * 只有滚动位置离开顶部后才跟随写锚点, 目录高亮跟随不受影响.
 * @param index - 观察器回写的当前标题索引 (statusStore.tocHtml 下标).
 * @returns 无返回值.
 */
const syncHashOnScroll = (index: number): void => {
    // 引言区无当前章节 (260925-03 后续): 锚点同步清除, 与下方 index===0 清锚分支同一语义
    // (正常链路 index 已在 handleHeadingShowCurrentAc 归一, 此处兜住未归一的直调)
    if (index < 0) {
        if (location.hash) {
            syncHashProgrammatic("")
        }
        return
    }

    const heading = statusStore.tocHtml[index]
    if (!heading) return

    // 顶部无锚点 (引言区): 高亮停在首项且首个标题整体位于视口顶之下 (260917-01-feedback#4)
    if (index === 0 && isAboveFirstHeading(heading.anchor)) {
        if (location.hash) {
            syncHashProgrammatic("")
        }
        return
    }

    // 顶部无锚点 (滚动条在顶): 首屏同时可见多个标题时, 观察器回写的索引可以是非 0 —
    // 顶部一律不保留锚点; 该分支同时兜住"首次进入未滚动"(hash 为空时是 no-op)与"滚回顶部残留"两种情形
    // (260917-01-feedback#5)
    if (isDetailAtScrollTop()) {
        if (location.hash) {
            syncHashProgrammatic("")
        }
        return
    }

    const targetHash = `#${heading.anchor}`
    if (`#${decodeRouteHashAnchor(location.hash)}` === targetHash) return
    syncHashProgrammatic(targetHash)
}

/**
 * isDetailAtScrollTop 判断详情页滚动条是否在最顶部.
 * @remarks 普通模式 window 滚动; 沉浸模式 window 固定不动, 由 #webFullscreenContainer 容器滚动
 * (postDetailRef 即该容器元素), 两种模式取各自滚动位置判定. 顶部既不写锚点也不保留锚点
 * (260917-01-feedback#5: 首次进入未滚动不得自动出现锚点, 滚回顶部锚点清除).
 * @returns true 表示位于顶部.
 */
const isDetailAtScrollTop = (): boolean => {
    if (isWebFullscreen.value) {
        return (postDetailRef.value?.scrollTop ?? 0) === 0
    }
    return window.scrollY === 0
}

// 顶部清锚兜底 (260917-01-feedback#5): IntersectionObserver 只在交叉状态"变化"时回调,
// 滚回顶部的最后一段滚动可能不再产生任何交叉变化 (顶部标题早已全部可见), 仅靠回写清锚会残留 hash
// (实测 /page/test001 回顶残留 #idx2-...); 滚动停止后按位置兜底清除.
let clearHashAtTopTimer: ReturnType<typeof setTimeout> | null = null

/**
 * clearHashAtTopWhenSettled 滚动停止 200ms 后检查: 若处于引言区则清锚并把高亮校准为 -1; 至少在滚动条最顶时清锚.
 * @remarks 定位窗口与导航进行中不清 (滚过顶部的中间态/离开导航的 router 滚顶都会路过顶部);
 * 双模式通用 — 同时监听 window (普通) 与 #webFullscreenContainer (沉浸) 的 scroll 事件.
 * 260925-03 后续: 检查范围从"滚动条在顶"扩为"引言区" (首个标题尚未越过视口顶) — 瞬时跳滚/长内容间隔段
 * 无交叉变化时观察器不回写, 高亮与锚点会停留在过期章节; 停稳后按位置兜底校准,
 * 与 normalizeHeadingIndexByViewport / syncHashOnScroll 的引言区语义闭环.
 * @returns 无返回值.
 */
const clearHashAtTopWhenSettled = (): void => {
    if (clearHashAtTopTimer) clearTimeout(clearHashAtTopTimer)
    clearHashAtTopTimer = setTimeout(() => {
        clearHashAtTopTimer = null
        if (isRouteNavigationInFlight || isHashPositioning) return

        const firstAnchor = statusStore.tocHtml[0]?.anchor
        if (firstAnchor && isAboveFirstHeading(firstAnchor)) {
            // 引言区: 清锚 + 高亮归位 -1 (无当前章节); 已是 -1 时跳过写回, 避免无谓 store/emit
            // (260925-05: 锚点存在性读 location.hash — 程序化同步后 route.hash 不再随之更新)
            if (location.hash) {
                syncHashProgrammatic("")
            }
            if (statusStore.tocHeadingShowCurrentIndex !== -1) {
                manager.setHeadingShowCurrentIndex(-1)
                emit("state", state)
            }
            return
        }

        if (isDetailAtScrollTop() && location.hash) {
            syncHashProgrammatic("")
        }
    }, 200)
}

onMounted(() => {
    window.addEventListener("scroll", clearHashAtTopWhenSettled, { passive: true })
    postDetailRef.value?.addEventListener("scroll", clearHashAtTopWhenSettled, { passive: true })
})

onBeforeUnmount(() => {
    window.removeEventListener("scroll", clearHashAtTopWhenSettled)
    postDetailRef.value?.removeEventListener("scroll", clearHashAtTopWhenSettled)
    if (clearHashAtTopTimer) clearTimeout(clearHashAtTopTimer)
})

/**
 * isAboveFirstHeading 判断视口当前是否位于首个目录标题上方 (标题顶边尚未越过视口顶).
 * @remarks 沉浸模式 window 不滚动但标题 rect 同随容器滚动变化, 判定双模式通用.
 * @param firstAnchor - 首个目录标题的锚点 id.
 * @returns true 表示处于顶部/引言区 (无锚点); 元素不存在时返回 false (保守保留现有 hash).
 */
const isAboveFirstHeading = (firstAnchor: string): boolean => {
    const firstHeading = document.getElementById(firstAnchor)
    return !!firstHeading && firstHeading.getBoundingClientRect().top > 0
}

/**
 * normalizeHeadingIndexByViewport 将观察器回写的目录索引按视口位置归一.
 * @remarks 260925-03 后续: 引言区 (首个目录标题整体位于视口顶之下) 不属于任何章节,
 * 此时观察器的任何回写 (无可见标题时的 -1、首标题可见未过顶或跳滚残留的过期章节索引)
 * 都不代表"当前章节", 统一归一为 -1: 目录清空高亮, 折叠态回退"目录",
 * 与 URL 锚点"引言区无锚点" (syncHashOnScroll / settle 清锚) 同一边界;
 * 首个标题越过视口顶后进入正常跟随, 回写原样放行 (含长间隔段的 keep-last 语义).
 * @param index - 观察器回写的目录索引.
 * @returns 归一后的索引; 无目录数据时原样返回.
 */
const normalizeHeadingIndexByViewport = (index: number): number => {
    const firstAnchor = statusStore.tocHtml[0]?.anchor
    if (!firstAnchor || !isAboveFirstHeading(firstAnchor)) {
        return index
    }
    return -1
}

// 更新文章详情
const updatePostDetailAc = async (postId: string, password: string = "") => {
    appLoadingIndicator.beginTask()
    try {
        await updatePostDetail(postId, password)
        // 该路径仅在客户端执行(密码提交/程序化切换), 直接回填浏览量
        postMeta.value.view_count = latestViewCount.value
        manager.setHeadingShowCurrentIndex(headingShowCurrentIndex)
        emit("state", state)

        // 复刻 SPA: 带 #锚点 访问时, 正文渲染完成后自动滚动到对应标题
        scrollToRouteHash()
    } finally {
        appLoadingIndicator.endTask()
    }
}

// feature02: 页面 SSR 数据驱动流程(首屏直出 + /p/a → /p/b 路由切换共用)
// SSR 渲染与客户端水合走同一 applyPostData, 首帧一致; 水合期间不 emit state / 不更新面包屑
// (status/breadcrumb store 均不注水), 待 onMounted(水合完成)后统一补发, 避免目录与面包屑产生 hydration mismatch.
const isClientMounted = ref(false) // 客户端是否已完成水合挂载
let pendingApplyFlush = false // 水合期间是否有待补发的 state 与面包屑

// bf-260925-01: 登录态首屏 sideEffects 调度 —— 水合早期 token 未恢复 (isLogin=false), 此时按匿名
// 口径发出的 prev-next/interaction 会被登录复拉 (useDetailLoginRefresh) 后的数据重放覆盖, 浏览器
// 侧同接口请求两次且第一次纯浪费; 登录态 (login_hint=1, 与 useDetailLoginRefresh 同源信号) 首屏
// 跳过首发, 等共享 initStores 恢复登录态后按最终口径只发一次; 匿名首屏无复拉流程, 保持立即首发
const hasLoginHint = import.meta.client && typeof localStorage !== "undefined" && localStorage.getItem(LocalStorageKey.LoginHint) === "1"

// 已发过 sideEffects 的文章 id: 登录复拉会以新数据引用重放 applyPostDataAc (同一篇文章), 去重防重复请求
let sideEffectsFiredPostId = ""
// 登录态首屏延迟待发的文章 id (initStores 就绪后由 onMounted 兜底发放)
let pendingSideEffectsPostId = ""

/**
 * fireDetailSideEffects 按发放时刻的登录态口径执行详情页 sideEffects (上一篇/下一篇 + 登录态交互状态).
 * @remarks 同一篇文章只发一次 (登录复拉重放保护); isLogin 由发放时刻的 token 状态决定是否附带交互状态.
 * @param postId - 目标文章 ID.
 * @returns 无返回值.
 */
const fireDetailSideEffects = (postId: string): void => {
    if (!postId || sideEffectsFiredPostId === postId) {
        return
    }
    sideEffectsFiredPostId = postId

    const sideEffects: Array<Promise<unknown>> = [getPrevNext({ post_id: postId })]
    if (userStore.isLogin) {
        sideEffects.push(updatePostInteraction({ post_id: postId }))
    }
    runPostDetailSideEffects(sideEffects)
}

/**
 * applyPostDataAc 将页面 SSR 数据应用到详情页状态, 并在客户端补发 state 与面包屑.
 * @param data 文章详情数据.
 * @returns 无返回值.
 */
const applyPostDataAc = async (data: PostResByID) => {
    postIdReq.post_id = data.id
    // 密码保护标记由页面响应码驱动(2008 未锁定 / 2042 需密码)
    setIsPasswordPost(isPasswordPostAc ?? false)
    await applyPostData(data)
    manager.setHeadingShowCurrentIndex(headingShowCurrentIndex)

    // feature02 补: 复刻 updateByRoute 的副作用(上一篇/下一篇 + 登录态交互状态), 仅客户端异步执行
    // bf-260925-01: 登录态首屏 (token 未恢复) 跳过匿名口径首发并记录待发 (onMounted 兜底);
    // 匿名首屏或登录态已就绪 (同路由切文/登录复拉后的重放) 立即按当前口径发放
    if (typeof window !== "undefined") {
        if (!hasLoginHint || userStore.isLogin) {
            fireDetailSideEffects(data.id)
        } else {
            pendingSideEffectsPostId = data.id
        }
    }

    if (isClientMounted.value) {
        // 路由切换等客户端场景: 同步更新目录与面包屑, 并回填浏览量(水合已完成, 无 mismatch 风险)
        postMeta.value.view_count = latestViewCount.value
        emit("state", state)
        updateBreadcrumb()
    } else {
        // SSR / 水合期间: 延迟到 onMounted 后补发
        pendingApplyFlush = true
    }

    // 复刻 SPA: 带 #锚点 访问时, 正文渲染完成后自动滚动到对应标题(仅客户端)
    if (typeof window !== "undefined") {
        scrollToRouteHash()
    }
}

// bf-260925-01: 登录态首屏 sideEffects 兜底 —— 等共享 initStores 恢复登录态后按最终口径发放;
// fireDetailSideEffects 按 postId 去重, 与登录复拉完成后的 applyPostDataAc 重放竞态安全
// (先到者发放, 后到者跳过); initStores 失败 (token 未恢复) 时按匿名口径兜底, 与匿名数据展示一致
onMounted(() => {
    if (!hasLoginHint) {
        return
    }
    void (async () => {
        try {
            const { getInitStoresPromise, isInitStoresReady } = await import("@/stores/init")
            if (!isInitStoresReady()) {
                await getInitStoresPromise()
            }
        } catch {
            // initStores 异常不阻塞详情展示, 按匿名口径兜底发放
        }
        fireDetailSideEffects(pendingSideEffectsPostId || postId.value)
    })()
})

// 页面 SSR 数据变化时应用(首次水合 + /p/a → /p/b 路由切换)
watch(
    () => postData,
    async (data) => {
        if (!data?.id) return
        await applyPostDataAc(data)
    },
    { immediate: true },
)

const submitPassword = async (password: string) => {
    // bugfix 260918-02: 文章 ID 未就绪 (空串/字符串化 null 等) 时提交密码会发出非法 post_id 请求,
    // 被后端 ParseUint 拒绝且界面无反馈; 此处提前拦截并给出提示, ID 就绪 (通常刷新后) 再可提交
    if (!isValidPostId(postId.value)) {
        MessageUtil.error("文章信息未就绪, 请刷新页面后重试")
        return
    }

    postIdReq.password = password
    await updatePostDetailAc(postId.value, password)
}

// 路由 hash 单独变化: 仅真实导航来源 (直链跳转锚点/浏览器前进后退) 才执行定位;
// 260925-05: 目录点击与滚动跟随的 hash 同步已改 history.replaceState 直写 (不产生路由导航),
// 本 watch 不会被程序化写入触发, 无需再区分来源 (原 programmaticHashMark 机制移除)
watch(
    () => route.hash,
    (hash) => {
        if (!hash) return
        scrollToRouteHash()
    },
)

// 监听锚点 — 目录点击导航的唯一滚动驱动 (260917-01-feedback#2):
// useTocNavigation 点击只写 store, 由本 watch 统一执行"清场旧定位 → 同步 URL → 平滑滚动 → 开启回写抑制窗口".
// 此前点击同时触发 hook 直滚 + 本 watch 直滚 + route.hash watch 校正滚动三路滚动,
// 快速连续点击时旧定时器滚回过期锚点, 页面来回抖动
// 260917-01-feedback#3: 导航进行中不再响应 — 此时写 URL 的 router.replace 会抢占取消进行中的导航
watch(
    () => anchorHash.value,
    (newVal) => {
        if (!newVal || isRouteNavigationInFlight) return

        cancelHashPositioning()
        syncHashProgrammatic(newVal)
        openHashPositioningWindow()

        const anchor = decodeRouteHashAnchor(newVal)
        const target = document.getElementById(anchor)
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    },
)

/**
 * @description: 处理上一篇, 下一篇文章切换, 与列表点击进入详情保持一致, 在切换入口处直接回到页面顶部.
 * @param postId 目标文章 ID.
 * @return Promise<void>.
 */
const handlePostId = async (postId: string) => {
    window.scrollTo({
        top: 0,
        behavior: "auto",
    })

    await statusStore.setAnchorHash("") // 清空锚点
    await statusStore.setPostId(postId) // 设置文章 id

    // Nuxt 适配: 上一篇/下一篇同步 URL (/p/:id), 由路由驱动重新拉取详情
    router.push(`/p/${postId}`)
}

// @ 提及数据
const mentions = ref<Completion[]>([])
const handleMentions = (val: Completion[]) => {
    mentions.value = val
}

const replyToId = ref<string | undefined>(void 0) // 回复的评论 id

// 处理回复具体评论
const handleReply = (comment: CommentRes) => {
    if (!commentEditorRef.value) return
    // TODO 后续考虑是否构造用户页面

    // 设置回复的评论 id
    replyToId.value = comment.id

    // 构造 @ 提及数据
    const content = `[@${comment.user_info.user_display_name}](${window.location.origin}/user/${comment.user_info.user_name}) `

    // 插入 @ 提及数据
    commentEditorRef.value.editor.codemirror.insertContent(content)

    // 平滑滚动到评论编辑器
    commentEditorRef.value.root.scrollIntoView({ behavior: "smooth", block: "center" })
}

// 监听文章详情 (statusStore.postId 变化: 非路由驱动的程序化切换)
watch(
    () => postId.value,
    async (newVal) => {
        if (!newVal || newVal === "" || newVal === "0") return
        // 路由驱动的变更 (/p/a → /p/b) 由页面 useAsyncData 重新拉取并经 postData prop 应用, 避免双请求
        if (route.name === "post" && String(route.params.id ?? "") === newVal) return

        // 新文章清空锚点
        await statusStore.setAnchorHash("")
        await updatePostDetailAc(postId.value)
    },
)

// feature02: 路由驱动的详情更新改由页面 useAsyncData(含正文) → postData prop → applyPostDataAc 处理,
// statusStore.postId/anchorHash 由页面 immediate watch 维护, 组件不再自行拉取.

// 是否首次加载
const isFirstLoad = ref(true)

// 监听点击时间, 保证相同关键字搜索时, 重新渲染
watch(
    () => time,
    (newTime, oldTime) => {
        if (newTime === oldTime) return

        // 如果是首次加载, 且当前目录索引为 0, 则不执行
        if (isFirstLoad.value && headingShowCurrentIndex === 0) {
            isFirstLoad.value = false
            return
        }

        handleUpdateIsUserScrollPreview(false)
    },
)

const { allHeadingMap, updateHeadingFlag, updateHeadingMap } = useHeading()

// 监听如果有目录锚点, 则更新当前目录索引
watch(
    () => updateHeadingFlag.value,
    async (flag) => {
        if (!flag) return
        await nextTick(() => {
            const index = allHeadingMap.get(anchorHash.value.replace("#", ""))?.index || 0
            emit("commit-anchor-hash-index", index)
        })
    },
    { flush: "post" }, // 确保在 DOM 更新后执行
)

const clickCategory = (val: PostCategory) => {
    emit("click-category", val)
}

const clickTag = (val: PostTag) => {
    emit("click-tag", val)
}

// 评论列表更新时间
const commentListUpdateTime = ref(new Date())

const handleInsert = () => {
    replyToId.value = void 0 // 清空回复的评论 id

    commentListUpdateTime.value = new Date()
}

onMounted(() => {
    // feature02: 水合完成后补发 state 与面包屑, 并回填浏览量(SSR/水合期间延迟, 避免与水合首帧不一致)
    isClientMounted.value = true
    postMeta.value.view_count = latestViewCount.value
    if (pendingApplyFlush) {
        pendingApplyFlush = false
        emit("state", state)
        updateBreadcrumb()
    }

    // 处理默认选中第一个标题
    if (headingShowCurrentIndex === 0) {
        handleUpdateIsUserScrollPreview(true)
    }
    setAffixLeft()
})

// feature02: 首屏数据由页面 SSR 数据流(postData prop)提供; 仅当无 prop 数据(纯 CSR 兜底场景)时才客户端拉取
onBeforeMount(async () => {
    if (!postData) {
        await updatePostDetailAc(postId.value)
    }
})
</script>
<style lang="scss" scoped>
// 网页全屏
.web__fullscreen {
    @include webFullscreen();
    overflow-y: auto;
}

// 固定定位占位
// 注意: z-index 设为 90, 远低于 header(999), el-overlay(2000) 等层级,
// 避免交互按钮遮挡搜索弹窗等全屏覆盖层
.affix-interaction {
    position: fixed;
    width: 40px;
    top: 300px;
    left: var(--affix-left);
    z-index: 90;
}

.post-detail {
    background-color: var(--jpz-bg-color);
    // 居中
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.poster-share {
    // 海报生成时挂载在离屏区域, 避免用户看到闪屏.
    position: fixed;
    top: -1000px;
    left: -1000px;
}

.interaction-bottom {
    margin-top: 20px;
    margin-bottom: 20px;
}

// 沉浸阅读模式下的回到顶部按钮
// 需要 z-index 高于 .web__fullscreen(1000), 确保在沉浸阅读覆盖层之上可见
// 260925-05: 1001→1002, 同时高于浮动目录面板(1001), 展开的长目录不再遮挡沉浸层 UP 按钮
.immersive-backtop-container {
    z-index: 1002;

    .immersive-backtop {
        height: 100%;
        width: 100%;
        text-align: center;
        line-height: 40px;
        color: var(--jpz-color-primary);
    }
}

@include respond-to("pc") {
    .web__fullscreen {
        .post-detail-bg {
            width: 100%;
            min-height: 100%;
            background-color: var(--jpz-bg-color-page);
        }
        .post-detail {
            width: pc.$width-page-main;
            margin: auto;
        }
    }
}

@include respond-to("pad") {
    .affix-interaction {
        display: none;
    }
}

@include respond-to("phone") {
    .affix-interaction {
        display: none;
    }
}
</style>
