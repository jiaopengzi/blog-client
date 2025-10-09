<!--
 * FilePath    : blog-client\src\components\common\video-episode\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 视频集数
-->

<template>
    <div class="episode-list">
        <div class="episode-item" v-for="i in treeVideoOrders" :key="i" @click="handleSelect(treeMap[i]!)">
            <span class="episode-index">{{ orderDisplay(treeMap[i]?.video_order!) }}</span>
            <div class="top-right-tip" v-if="true">🔒</div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue"

import { type PostVideoTocTree } from "@/api/post/common"

import { useVideoTocTree } from "../video-toc-tree-base/hooks"
import { type VideoEpisodeProps } from "./types.ts"

defineOptions({ name: "VideoEpisode" })

// 定义 props
const { isPaid, episodeList } = defineProps<VideoEpisodeProps>()

// 事件
const emit = defineEmits<{
    (event: "video-select", val: PostVideoTocTree): void
}>()

const localTreeList = ref<PostVideoTocTree[]>(episodeList)

const treeMap = ref<{ [key: number]: PostVideoTocTree }>({})
const treeVideoOrders = ref<number[]>([])

// hooks
const { videoTotal, covertToMap } = useVideoTocTree(localTreeList)

// 监听 episodeList 变化
watch(
    () => episodeList,
    (newVal) => {
        localTreeList.value = newVal
        const { map, videoOrders } = covertToMap(newVal)
        treeMap.value = map
        treeVideoOrders.value = videoOrders
    },
    { immediate: true },
)

const orderDisplay = (order: number) => {
    // 根据总数决定前面补0的位数
    const totalDigits = videoTotal.value ? videoTotal.value.toString().length : 1
    return order.toString().padStart(totalDigits, "0")
}

const handleSelect = (val: PostVideoTocTree) => {
    console.log("选择了视频章节：", val)
}
</script>
<style scoped lang="scss">
.episode-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 12px;
}

.episode-item {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: 6px 12px;
    border: 1px solid var(--jpz-border-color);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        border-color: var(--jpz-border-color-hover);
    }

    .episode-index {
        font-size: 14px;
        color: var(--jpz-text-color-secondary);
    }

    .top-right-tip {
        background-color: var(--jpz-color-primary);
        color: var(--jpz-color-secondary);
        height: 12px;
        line-height: 12px;
        text-align: center;
        position: absolute;
        width: 32px;
        transform-origin: bottom right; // 以右下角为旋转中心, 只需要计算 top 值, right 等于0
        transform: rotate(45deg);
        // top 等于 width 乘以 sin(45deg) 再减去 height 的高度
        top: 10px;
        right: 0px;
        font-size: 8px;
        font-weight: 500;
    }
}
</style>
