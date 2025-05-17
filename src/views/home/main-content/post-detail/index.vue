<!--
 * FilePath    : blog-client\src\views\home\main-content\post-detail\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文章详情
-->

<template>
    <head-tag :head-data="head" />
    <section ref="webFullscreenRef">
        <!-- 新增的固定占位内容 -->
        <div class="affix-interaction">
            <DetailInteraction direction="vertical" :items="interactionItems" @click-item="handleClickInteraction" />
        </div>
        <section class="post-detail-bg">
            <div class="post-detail">
                <PostMeta :meta="postMeta" @immersion-read="toggle" @author-id="clickAuthorId" @post-id="editPost" />
                <HtmlPreview
                    ref="previewRef"
                    :html="state.html"
                    :img-urls="state.imgUrls"
                    :is-show-el-image-viewer="state.isShowElImageViewer"
                    :is-show-preview-wechat="state.isShowPreviewWechat"
                    :is-user-scroll-preview="state.isUserScrollPreview"
                    :heading-show-current-index="headingShowCurrentIndex"
                    @show-image-viewer="showImageViewer"
                    @close-image-viewer="closeImageViewer"
                    @heading-show-current="handleHeadingShowCurrentAc"
                    @update-is-user-scroll="handleUpdateIsUserScrollPreview"
                    @commit-heading-map="updateHeadingMap"
                />
                <DetailBottomSame class="bottom-same" />
                <DetailInteraction class="interaction-bottom" direction="horizontal" :items="interactionItems" @click-item="handleClickInteraction" />
                <DetailUpdatedAt :data="updatedAt" />
            </div>
            <DetailCategoryTag class="category-tag-bottom" :data="categoryTag" @click-category="clickCategory" @click-tag="clickTag" />
            <DetailCopyright class="copyright-bottom" :data="copyright" />
            <DetailPrevNext class="prev-next" :data="prevNext" @post-id="handlePostId" />
            <CommentList class="comment-list" :post-id="postId" :status="commentStatus" :update-time="commentListUpdateTime" />
            <CommentEditor class="comment-editor" :post-id="postId" @comment-insert="handleInsert" />
        </section>
    </section>
    <PosterShare class="poster-share" v-if="isShowPosterShare" :data="dataPosterShare" @poster-complete="handPosterComplete" />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { nextTick, onBeforeMount, onMounted, reactive, ref, useTemplateRef, watch } from "vue"

import { type ViewPostByIDRequest } from "@/api/post/viewByID"
import { type PostCategory } from "@/api/postCategory/view"
import { type PostTag } from "@/api/postTag/view"
import HeadTag from "@/components/common/head-tag"
import PostMeta from "@/components/common/post-meta"
import PosterShare from "@/components/common/poster-share"
import type { EditorState } from "@/components/editor"
import HtmlPreview from "@/components/editor/components/preview"
import { usePreview } from "@/components/editor/hooks/usePreview"
import { usePostDetail } from "@/components/hooks/usePostDetail"
import { useWebFullscreen } from "@/components/hooks/useWebFullscreen"
import { useOptionsStore } from "@/stores/options"
import { useStatusStore } from "@/stores/status"

import DetailBottomSame from "./components/bottom-same"
import DetailCategoryTag from "./components/category-tag"
import CommentEditor from "./components/comment-editor"
import CommentList from "./components/comment-list"
import DetailCopyright from "./components/copyright"
import DetailInteraction from "./components/interaction"
import DetailPrevNext from "./components/prev-next"
import DetailUpdatedAt from "./components/updated-at"
import { useHeading, useInteraction } from "./hooks"

defineOptions({ name: "PostDetail" })

// 定义 props
const {
    headingShowCurrentIndex, // 当前展示的标题的索引
    time,
} = defineProps<{
    headingShowCurrentIndex: number // 当前展示的标题的索引
    time: Date | null
}>()

// 事件
const emit = defineEmits<{
    (event: "state", val: EditorState): void
    (event: "commit-anchor-hash-index", val: number): void
    (event: "click-category", val: PostCategory): void
    (event: "click-tag", val: PostTag): void
}>()

const statusStore = useStatusStore()
const optionsStore = useOptionsStore()

const { head } = storeToRefs(optionsStore)
const { postId, anchorHash } = storeToRefs(statusStore)

const postDetailRef = useTemplateRef("webFullscreenRef")

const { toggle } = useWebFullscreen(postDetailRef)

// 请求参数
const postIdReq = reactive<ViewPostByIDRequest>({} as ViewPostByIDRequest)

const {
    manager,
    state,
    postMeta,
    copyright,
    prevNext,
    updatedAt,
    categoryTag,
    commentStatus,
    clickAuthorId,
    editPost,
    updatePostDetail,
    updateRouterPush,
    setPostLike,
    setPostStar,
} = usePostDetail(postIdReq, anchorHash)

// 交互hook
const {
    interactionItems, // 交互项
    isShowPosterShare, // 是否显示分享海报
    handPosterComplete, // 处理分享海报完成事件
    dataPosterShare, // 生成分享海报需要的数据
    handleClickInteraction, // 处理交互点击事件
    setAffixLeft, // 设置交互项的左侧偏移量
} = useInteraction(postMeta, postId, setPostLike, setPostStar, postDetailRef)

// preview
const { showImageViewer, closeImageViewer, handleHeadingShowCurrent, handleUpdateIsUserScrollPreview } = usePreview(manager)

// 更新文章详情状态
const handleHeadingShowCurrentAc = (val: number) => {
    handleHeadingShowCurrent(val)
    emit("state", state)
}

// 更新文章详情
const updatePostDetailAc = async (postId: string) => {
    await updatePostDetail(postId)
    manager.setHeadingShowCurrentIndex(headingShowCurrentIndex)
    emit("state", state)
}

// 监听锚点
watch(
    () => anchorHash.value,
    async (newVal) => {
        if (!newVal) return
        await updateRouterPush()
    },
)

// 处理文章id
const handlePostId = async (postId: string) => {
    await statusStore.setAnchorHash("") // 清空锚点
    await statusStore.setPostId(postId) // 设置文章id
}

// 监听文章详情
watch(
    () => postId.value,
    async (newVal) => {
        if (!newVal) return
        // 新文章清空锚点
        await statusStore.setAnchorHash("")
        await updatePostDetailAc(postId.value)
    },
)

// 是否首次加载
const isFirstLoad = ref(true) // 是否首次加载

// 监听点击时间, 保证相同关键字搜索时, 重新渲染
watch(
    () => time,
    (newTime, oldTime) => {
        if (newTime === oldTime) return // 如果时间没有变化, 不更新

        // 如果是首次加载, 且当前目录索引为0, 则不执行
        if (isFirstLoad.value && headingShowCurrentIndex === 0) {
            isFirstLoad.value = false // 首次加载完成
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
            const index = allHeadingMap.get(anchorHash.value.replace("#", ""))?.index || 0 // 获取当前目录索引
            emit("commit-anchor-hash-index", index) // 提交当前目录索引
        })
    },
    { flush: "post" }, // 确保在 DOM 更新后执行
)

const clickCategory = (val: PostCategory) => {
    emit("click-category", val) // 点击分类
}

const clickTag = (val: PostTag) => {
    emit("click-tag", val) // 点击标签
}

// 处理评论列表更新时间
const commentListUpdateTime = ref(new Date()) // 评论列表更新时间

const handleInsert = () => {
    commentListUpdateTime.value = new Date() // 更新评论列表时间
}

onMounted(() => {
    // 处理默认选中第一个标题
    if (headingShowCurrentIndex === 0) {
        handleUpdateIsUserScrollPreview(true)
    }
    setAffixLeft() // 设置左侧偏移量
})

onBeforeMount(async () => {
    await updatePostDetailAc(postId.value)
})
</script>
<style lang="scss" scoped>
// 网页全屏
.web--fullscreen {
    @include webFullscreen();
    overflow-y: auto;
}

// 固定定位占位
.affix-interaction {
    position: fixed;
    width: 40px;
    top: 300px;
    left: var(--affix-left);
    z-index: 999;
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
    // 不展示出来
    position: fixed;
    top: -1000px;
    left: -1000px;
}

.interaction-bottom {
    margin-top: 20px;
    margin-bottom: 20px;
}

@include respond-to("pc") {
    .web--fullscreen {
        .post-detail-bg {
            width: 100%;
            height: 100%;
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
