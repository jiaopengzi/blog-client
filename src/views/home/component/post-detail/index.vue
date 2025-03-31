<!--
 * FilePath    : blog-client\src\views\home\component\post-detail\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文章详情
-->

<template>
    <div class="post-detail">
        <HtmlPreview
            ref="previewRef"
            :preview="previewData"
            :is-show-preview-wechat="localEditorState.isShowPreviewWechat"
            :is-user-scroll-preview="localEditorState.isUserScrollPreview"
            @show-image-viewer="showImageViewer"
            @close-image-viewer="closeImageViewer"
            @is-mouse-in-element="handleMouseInElement"
            @heading-show-current="handleHeadingShowCurrent"
        />
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, useTemplateRef, watch } from "vue"

import { viewPostByIDAPI, type ViewPostByIDRequest } from "@/api/post/viewByID"
import { viewPostByIDAdminAPI } from "@/api/post/viewByIDAdmin"
import { ResponseCode } from "@/api/response"
import { type EditorState, EditorStateManager, usePreview } from "@/components/editor/core"
import HtmlPreview from "@/components/editor/preview"
import { DeviceType, useDeviceStore } from "@/stores/device"
defineOptions({ name: "PostDetail" })

const { postId } = defineProps<{
    postId: string
}>()

// 事件
const emit = defineEmits<{
    (event: "postId", val: string): void
}>()

const markdownStr = ref("") // 文章内容

const getData = async (postID: string) => {
    const req: ViewPostByIDRequest = {
        post_id: postID,
    }
    const res = await viewPostByIDAdminAPI(req)
    if (res.data.code === ResponseCode.PostViewByIDSuccess) {
        const postData = res.data.data
        if (postData) {
            // 文章数据
            markdownStr.value = postData.post_content
        }
        return res
    }
}

const localManager = new EditorStateManager()
const localEditorState = reactive<EditorState>(localManager.getState())
// preview
const { previewData, showImageViewer, closeImageViewer, handleMouseInElement, handleHeadingShowCurrent } = usePreview(localManager)

watch(
    () => postId,
    async (val) => {
        await getData(val)
        localManager.updateState(markdownStr.value)
    },
    { immediate: true },
)
const deviceStore = useDeviceStore()
const { device } = storeToRefs(deviceStore)
</script>
<style lang="scss" scoped>
@include respond-to("pc") {
}

@include respond-to("pad") {
}

@include respond-to("phone") {
}
</style>
