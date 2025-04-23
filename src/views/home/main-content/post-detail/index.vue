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
                />
            </div>
        </section>
    </section>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { onBeforeMount, reactive, useTemplateRef, watch } from "vue"

import { type ViewPostByIDRequest } from "@/api/post/viewByID"
import PostMeta from "@/components/common/post-meta"
import type { EditorState } from "@/components/editor"
import HtmlPreview from "@/components/editor/components/preview"
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
}>()

const statusStore = useStatusStore()

const { postId } = storeToRefs(statusStore)

const postDetailRef = useTemplateRef("webFullscreenRef")
const previewRef = useTemplateRef("previewRef")

const { toggle } = useWebFullscreen(postDetailRef)

// 请求参数
const postIdReq = reactive<ViewPostByIDRequest>({} as ViewPostByIDRequest)

const { manager, state, postMeta, clickAuthorId, editPost, updatePostDetail } = usePostDetail(postIdReq)

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

watch(
    () => postId.value,
    async (newVal) => {
        if (!newVal) return
        await updatePostDetailAc(postId.value)
    },
)

watch(
    () => time,
    (newTime, oldTime) => {
        if (newTime === oldTime) return // 如果时间没有变化, 不更新
        handleUpdateIsUserScrollPreview(false)
    },
)

onBeforeMount(async () => {
    await updatePostDetailAc(postId.value)
})

defineExpose({
    previewRef,
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
