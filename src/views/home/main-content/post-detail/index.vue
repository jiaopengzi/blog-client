<!--
 * FilePath    : blog-client\src\views\home\main-content\post-detail\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文章详情
-->

<template>
    <section ref="webFullscreenRef">
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
            </div>
        </section>
    </section>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { nextTick, onBeforeMount, onMounted, reactive, ref, useTemplateRef, watch } from "vue"

import { type ViewPostByIDRequest } from "@/api/post/viewByID"
import PostMeta from "@/components/common/post-meta"
import type { EditorState } from "@/components/editor"
import HtmlPreview, { type HeadingObject } from "@/components/editor/components/preview"
import { usePreview } from "@/components/editor/hooks/usePreview"
import { usePostDetail } from "@/components/hooks/usePostDetail"
import { useWebFullscreen } from "@/components/hooks/useWebFullscreen"
import { useStatusStore } from "@/stores/status"

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
}>()

const statusStore = useStatusStore()

const { postId, anchorHash } = storeToRefs(statusStore)

const postDetailRef = useTemplateRef("webFullscreenRef")

const { toggle } = useWebFullscreen(postDetailRef)

// 请求参数
const postIdReq = reactive<ViewPostByIDRequest>({} as ViewPostByIDRequest)

const { manager, state, postMeta, clickAuthorId, editPost, updatePostDetail, updateRouterPush } = usePostDetail(postIdReq, anchorHash)

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

// 监听目录点击时间, 保证相同关键字搜索时, 重新渲染
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

const updateHeadingFlag = ref(false) // 是否更新目录

const allHeadingMap: Map<string, HeadingObject> = new Map() // 所有的 h 标签 map
const updateHeadingMap = (val: Map<string, HeadingObject>) => {
    allHeadingMap.clear()
    val.forEach((item) => {
        allHeadingMap.set(item.id, item)
    })
    updateHeadingFlag.value = true // 更新目录
}

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
)

onMounted(() => {
    // 处理默认选中第一个标题
    if (headingShowCurrentIndex === 0) {
        handleUpdateIsUserScrollPreview(true)
    }
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

.post-detail {
    background-color: var(--jpz-bg-color);
    // 居中
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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

// @include respond-to("pad") {
// }

// @include respond-to("phone") {
// }
</style>
