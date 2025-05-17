<!--
 * FilePath    : blog-client\src\views\home\main-content\post-detail\components\comment-list\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 评论列表
-->

<template>
    <div class="comment-list-container">
        <div class="comment-list">
            <div v-for="item in pagination.records" :key="item.id" class="comment-item">
                <CommentItem :data="item" :status="status" @pinned="handlePinned" @delete="handleDelete" />
            </div>
        </div>
        <!-- 分页 -->
        <div class="pagination-container">
            <div class="loader" v-show="isShowLoading"></div>
            <div class="pagination-block" ref="paginationBlockRef">
                <!-- 注意这里使用 v-model 双向绑定, 会造成意外的触发在 update 中手动更新 -->
                <el-pagination
                    :current-page="pagination.current_page"
                    :page-size="pagination.page_size"
                    :page-sizes="pagination.page_sizes"
                    :page-count="pagination.page_count"
                    :total="pagination.total"
                    :background="true"
                    :layout="paginationLayout"
                    size="small"
                    @update:current-page="updateCurrentPage"
                    @update:page-size="updatePageSize"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useIntersectionObserver } from "@vueuse/core"
import { storeToRefs } from "pinia"
import { computed, nextTick, onBeforeMount, onMounted, onUnmounted, ref, useTemplateRef, watch } from "vue"

import { DeviceType, useDeviceStore } from "@/stores/device"

import CommentItem from "./comment-item"
import { useCommentList } from "./hooks"
import type { CommentListProps } from "./types"

defineOptions({ name: "CommentList" })

// 定义 props
const { postId, status, updateTime } = defineProps<CommentListProps>()

const deviceStore = useDeviceStore()

const { device } = storeToRefs(deviceStore)

const {
    pagination, // 分页数据
    updateCurrentPage, // 更新当前页
    updatePageSize, // 更新每页显示条数
    updatePaginate, // 更新分页
    isShowLoading, // 是否显示加载动画
    handleDelete, // 处理删除
    handlePinned, // 处理置顶
} = useCommentList(postId)

const paginationLayout = computed(() => {
    return device.value === DeviceType.PHONE ? "total, prev, pager, next, sizes" : "total, prev, pager, next, jumper, sizes"
})

// 根据时间戳更新分页
watch(
    () => updateTime,
    async () => {
        await updatePaginate()
    },
)

// 分页组件 ref
const paginationBlockRef = useTemplateRef("paginationBlockRef")

let stopIntersectionObserver: () => void // 停止监听函数
const isInitialRender = ref(true) // 是否是初始渲染

onMounted(async () => {
    await nextTick()

    const { stop } = useIntersectionObserver(paginationBlockRef, ([entry]) => {
        if (isInitialRender.value) {
            // 初次加载时不emit
            isInitialRender.value = false
        } else {
            // 非初次加载时，根据intersection情况emit
            // emit("paginationBlockVisible", entry?.isIntersecting || false)
        }
    })

    stopIntersectionObserver = stop
})

onUnmounted(() => {
    stopIntersectionObserver()
})

onBeforeMount(async () => {
    await updatePaginate()
})
</script>
<style lang="scss" scoped>
.comment-list {
    font-size: 14px;
    margin-top: 10px;
}

@include respond-to("pc") {
}

@include respond-to("pad") {
    .comment-list-container {
        margin-left: 10px;
        margin-right: 10px;
    }
}

@include respond-to("phone") {
    .comment-list-container {
        margin-left: 10px;
        margin-right: 10px;
    }
}

.pagination-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.pagination-block {
    display: flex;
    justify-content: center;
    margin: 10px;
}

/* 参考:https://css-loaders.com/dots/ */
.loader {
    width: 60px;
    aspect-ratio: 3;
    --_g: no-repeat radial-gradient(circle closest-side, var(--jpz-color-primary) 90%, #0000);
    background:
        var(--_g) 0% 50%,
        var(--_g) 50% 50%,
        var(--_g) 100% 50%;
    background-size: calc(100% / 3) 50%;
    animation: l3 1s infinite linear;
    margin-top: 20px;
}
@keyframes l3 {
    20% {
        background-position:
            0% 0%,
            50% 50%,
            100% 50%;
    }
    40% {
        background-position:
            0% 100%,
            50% 0%,
            100% 50%;
    }
    60% {
        background-position:
            0% 50%,
            50% 100%,
            100% 0%;
    }
    80% {
        background-position:
            0% 50%,
            50% 50%,
            100% 100%;
    }
}
</style>
