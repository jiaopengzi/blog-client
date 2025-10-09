<!--
 * FilePath    : blog-client\src\components\common\pay-video\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费视频
-->

<template>
    <div>
        <VideoTocTreeBase :tree-list="toc" :draggable="false" :show-btns="false" :is-edit="false" @video-select="handleSelect" />
        <VideoEpisode :is-paid="false" :episode-list="toc!" />
        <div>文章ID===>：{{ postId }}</div>
    </div>
</template>
<script lang="ts" setup>
import { computed } from "vue"

import JIcon, { IconKeys } from "@/components/common/icons"
import { EditorStateManager } from "@/components/editor"
import { fenToYuan } from "@/utils/amount"

import VideoEpisode from "../video-episode"
import VideoTocTreeBase, { type Data } from "../video-toc-tree-base"
import { type PayVideoProps } from "./types.ts"

defineOptions({ name: "PayVideo" })

// 定义 props
const { postId, toc } = defineProps<PayVideoProps>()

const handleSelect = (val: Data) => {
    console.log("选择了视频章节：", val)
}
</script>
<style scoped lang="scss"></style>
