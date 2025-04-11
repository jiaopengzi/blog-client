<!--
 * FilePath    : blog-client\src\views\home\component\post-detail\index.vue
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
                    :is-remove-first-h1="state.isRemoveFirstH1"
                    @show-image-viewer="showImageViewer"
                    @close-image-viewer="closeImageViewer"
                    @is-mouse-in-element="handleMouseInElement"
                    @heading-show-current="handleHeadingShowCurrent"
                />
            </div>
        </section>
    </section>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { onBeforeMount, reactive, useTemplateRef } from "vue"

import { type ViewPostByIDRequest } from "@/api/post/viewByID"
import PostMeta from "@/components/common/post-meta"
import HtmlPreview from "@/components/editor/components/preview"
import { usePreview } from "@/components/editor/hooks/usePreview"
import { useHome } from "@/components/hooks/useHome"
import { useWebFullscreen } from "@/components/hooks/useWebFullscreen"
import { useStatusStore } from "@/stores/status"

defineOptions({ name: "PostDetail" })

const statusStore = useStatusStore()

const { postId } = storeToRefs(statusStore)

const postDetailRef = useTemplateRef("webFullscreenRef")
const { toggle } = useWebFullscreen(postDetailRef)

// 请求参数
const postIdReq = reactive<ViewPostByIDRequest>({} as ViewPostByIDRequest)

const { manager, state, postMeta, clickAuthorId, editPost, updateByRoute, clickPost } = useHome(postIdReq)

// preview
const { showImageViewer, closeImageViewer, handleMouseInElement, handleHeadingShowCurrent } = usePreview(manager)

onBeforeMount(async () => {
    await clickPost(postId.value) // 文章详情
    await updateByRoute()
})
</script>
<style lang="scss" scoped>
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

@include respond-to("pad") {
}

@include respond-to("phone") {
}
</style>
