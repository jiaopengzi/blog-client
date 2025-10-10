<!--
 * FilePath    : blog-client\src\components\common\video-episode\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 视频集数
-->

<template>
    <div class="episode-list">
        <div
            :class="[isPaid ? 'episode-item-paid' : 'episode-item', { 'episode-item-active': isCurrentEpisode(treeMap[i]!) }]"
            v-for="i in treeVideoOrders"
            :key="i"
            @click="handleSelect(treeMap[i]!)"
        >
            <JIcon v-if="isShowLock(isPaid, treeMap[i]?.is_free!)" :name="IconKeys.Lock" :custom-class="`icon-lock`" class="icon" />
            <JIcon v-if="!isShowLock(isPaid, treeMap[i]?.is_free!)" :name="IconKeys.Play" :custom-class="`icon-unlock`" class="icon" />
            <span class="episode-index">{{ orderDisplay(treeMap[i]?.video_order!) }}</span>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue"

import { type PostVideoTocTree } from "@/api/post/common"
import JIcon, { IconKeys } from "@/components/common/icons"

import { useVideoTocTree } from "../video-toc-tree-base"
import { type VideoEpisodeProps } from "./types.ts"

defineOptions({ name: "VideoEpisode" })

// 定义 props
const { isPaid, episodeList, currentVideoId = 1 } = defineProps<VideoEpisodeProps>()

// 事件
const emit = defineEmits<{
    (event: "video-select", val: PostVideoTocTree): void
}>()

const localTreeList = ref<PostVideoTocTree[]>(episodeList)
const localCurrentVideoId = ref<number>(currentVideoId)

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
    if (val.video_order === localCurrentVideoId.value) {
        return
    }
    localCurrentVideoId.value = val.video_order || 1
    emit("video-select", val)
}

// 是否显示锁
const isShowLock = (isPaid: boolean, isFree: boolean) => {
    // 已付费 或 免费 则不显示锁
    return !(isPaid || isFree)
}

// 判断当前视频项是否为当前选中项
const isCurrentEpisode = (item?: PostVideoTocTree) => {
    if (!item) return false
    return item.video_order === localCurrentVideoId.value
}
</script>
<style scoped lang="scss">
.episode-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 12px;
}

// 公共样式
%common-episode-item {
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid var(--jpz-border-color);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        border-color: var(--jpz-border-color-hover);
        box-shadow: var(--jpz-box-shadow-light);
    }

    .episode-index {
        font-size: 14px;
        color: var(--jpz-text-color-secondary);
    }
}

.episode-item-active {
    background-color: var(--jpz-bg-color-page); // 可根据你的主题色调整
    border-color: var(--jpz-color-primary);

    .episode-index {
        color: var(--jpz-color-primary);
        font-weight: 600;
        transition: color 0.3s ease;
    }

    // 整体容器的过渡效果
    transition: all 0.3s ease;
}

.episode-item {
    @extend %common-episode-item;
    padding: 10px 12px 0 12px;

    .icon {
        position: absolute;
        top: 3px;
        left: 2px;
    }

    .icon-lock {
        fill: #c1401f;
        font-size: 12px;
    }

    .icon-unlock {
        fill: #188838;
        font-size: 12px;
    }
}

.episode-item-paid {
    @extend %common-episode-item;
    padding: 6px 12px 4px 12px;

    .icon {
        display: none;
    }
}
</style>
