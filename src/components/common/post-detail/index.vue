<!--
 * FilePath    : blog-client-nuxt\src\components\common\post-detail\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文章详情
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
</template>

<script lang="ts" setup>
import type { Completion } from "@codemirror/autocomplete"
import { storeToRefs } from "pinia"
import { computed, nextTick, onBeforeMount, onMounted, reactive, ref, useTemplateRef, watch } from "vue"

import { type CommentRes } from "@/api/comment/common"
import type { PostResByID } from "@/api/post/common"
import { RoleName } from "@/api/permissionRole/role"
import { type ViewPostByIDRequest } from "@/api/post/viewByID"
import { type PostCategory } from "@/api/postCategory/view"
import { type PostTag } from "@/api/postTag/view"
import PostMeta from "@/components/common/post-meta"
import PostPassword from "@/components/common/post-password"
import PosterShare from "@/components/common/poster-share"
import type { EditorState } from "@/components/editor"
import HtmlPreview from "@/components/editor/components/preview/index.vue"
import { usePreview } from "@/components/editor/hooks/usePreview"
import { useAppLoadingIndicator } from "@/composables/useAppLoadingIndicator"
import { usePostDetail } from "@/components/hooks/usePostDetail"
import { useWebFullscreen } from "@/components/hooks/useWebFullscreen"
import { DeviceType, useDeviceStore } from "@/stores/device"
import { useStatusStore } from "@/stores/status"
import { useUserStore } from "@/stores/user"

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
    handleHeadingShowCurrent(val)
    emit("state", state)
}

const appLoadingIndicator = useAppLoadingIndicator()

/**
 * @description: 按当前路由 hash 滚动到对应标题并同步目录高亮 (复刻 SPA: 带 #锚点 访问时先渲染再定位)
 * @returns 无返回值
 */
const scrollToRouteHash = (): void => {
    const hash = route.hash
    if (!hash) return

    const anchor = hash.replace("#", "")

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
    // 多次校正保证最终落在目标标题 (复刻 SPA 的先渲染再定位体验)
    nextTick(() => {
        doScroll()
        setTimeout(doScroll, 600)
        setTimeout(doScroll, 1600)
    })
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
    if (typeof window !== "undefined") {
        const sideEffects: Array<Promise<unknown>> = [getPrevNext({ post_id: data.id })]
        if (userStore.isLogin) {
            sideEffects.push(updatePostInteraction({ post_id: data.id }))
        }
        runPostDetailSideEffects(sideEffects)
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
    postIdReq.password = password
    await updatePostDetailAc(postId.value, password)
}

// 路由 hash 单独变化 (如浏览器前进/后退带 hash): 内容已渲染时直接定位
watch(
    () => route.hash,
    (hash) => {
        if (!hash) return
        scrollToRouteHash()
    },
)

// 监听锚点 (Nuxt 路由结构: 直接滚动到目标标题, 不再经 Home+query/hash 中转)
watch(
    () => anchorHash.value,
    (newVal) => {
        if (!newVal) return

        const anchor = newVal.replace("#", "")

        // 复刻 SPA: URL 同步更新为 /p/:id#锚点 (含正文滚动触发的目录高亮同步)
        router.replace({ hash: newVal }).catch(() => {})

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
.immersive-backtop-container {
    z-index: 1001;

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
