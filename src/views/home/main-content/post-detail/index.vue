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
                <DetailInteraction direction="horizontal" :items="interactionItems" @click-item="handleClickInteraction" />
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
    <PosterShare class="poster-share" v-if="isShowPosterShare" :data="dataPosterShare" @poster-complete="handPosterComplete" />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { computed, type ComputedRef, nextTick, onBeforeMount, onMounted, reactive, ref, useTemplateRef, watch } from "vue"

import { type ViewPostByIDRequest } from "@/api/post/viewByID"
import HeadTag from "@/components/common/head-tag"
import PostMeta from "@/components/common/post-meta"
import PosterShare from "@/components/common/poster-share"
import type { EditorState } from "@/components/editor"
import HtmlPreview, { type HeadingObject } from "@/components/editor/components/preview"
import { usePreview } from "@/components/editor/hooks/usePreview"
import { usePostDetail } from "@/components/hooks/usePostDetail"
import { useWebFullscreen } from "@/components/hooks/useWebFullscreen"
import { useDeviceStore } from "@/stores/device"
import { useOptionsStore } from "@/stores/options"
import { useStatusStore } from "@/stores/status"
import { useUserStore } from "@/stores/user"
import { MessageUtil } from "@/utils/message"

import DetailInteraction, { type InteractionIcon, type InteractionItemProps } from "./component/interaction"

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
const deviceStore = useDeviceStore()
const userStore = useUserStore()
const optionsStore = useOptionsStore()

const { head, app_options } = storeToRefs(optionsStore)
const { postId, anchorHash } = storeToRefs(statusStore)
const { windowWidth } = storeToRefs(deviceStore)

const postDetailRef = useTemplateRef("webFullscreenRef")

const { toggle } = useWebFullscreen(postDetailRef)

const { isLogin } = storeToRefs(userStore)

// 请求参数
const postIdReq = reactive<ViewPostByIDRequest>({} as ViewPostByIDRequest)

const { manager, state, postMeta, headMeta, clickAuthorId, editPost, updatePostDetail, updateRouterPush, setPostLike, setPostStar } = usePostDetail(
    postIdReq,
    anchorHash,
)

// 初始状态
const interactionItems: ComputedRef<InteractionItemProps[]> = computed(() => {
    return [
        {
            icon: "like",
            text: "点赞",
            isActive: postMeta.value.interactionStatus?.is_like ?? false,
            tip: postMeta.value.like_count,
        },
        {
            icon: "star",
            text: "收藏",
            isActive: postMeta.value.interactionStatus?.is_star ?? false,
            tip: postMeta.value.star_count,
        },
        {
            icon: "share",
            text: "分享",
        },
        {
            icon: "link",
            text: "复制链接",
        },
    ]
})

const isShowPosterShare = ref(false) // 是否显示分享海报

const handPosterComplete = () => {
    // isShowPosterShare.value = false // 关闭分享海报
}

const dataPosterShare = computed(() => {
    return {
        logoSrc: app_options.value.favicon.value,
        imgSrc: headMeta.value.image,
        titleText: postMeta.value.post_title,
        urlText: head.value.url,
    }
})

const handleClickInteraction = (val: InteractionIcon) => {
    if (!isLogin.value && (val === "like" || val === "star")) {
        MessageUtil.warning("【点赞】和【收藏】 需要登录")
        return
    }

    switch (val) {
        case "like":
            setPostLike({ post_id: postId.value, like: !postMeta.value.interactionStatus?.is_like })
            break
        case "star":
            setPostStar({ post_id: postId.value, star: !postMeta.value.interactionStatus?.is_star })
            break
        case "share":
            MessageUtil.success("海报正在生成中, 请稍等...")
            isShowPosterShare.value = true // 显示分享海报
            break
    }
}

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

// 设置交互项的左侧偏移量, 保障在不同屏幕下, 交互项的左侧偏移量一致
const setAffixLeft = () => {
    if (postDetailRef.value) {
        const left = postDetailRef.value.offsetLeft // 获取当前元素的 left 值
        const affix = left - 50 > 0 ? left - 50 : -100 // 如果 left 值小于0, 则设置为-100,即隐藏
        postDetailRef.value.style.setProperty("--affix-left", `${affix}px`)
    }
}

// 宽度变化时
watch(
    () => windowWidth.value,
    () => {
        setAffixLeft() // 设置左侧偏移量
    },
)

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
    z-index: 9999;
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
    // 不要显示在这页面
    // position: fixed;
    // top: -1000px;
    // left: -1000px;
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
