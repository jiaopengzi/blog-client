<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-03 12:40:25
 * @FilePath     : \blog-client\src\views\home\component\post-list\index.vue
 * @Description  : 文章列表
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="post-list">
        <PostItem
            v-for="item in paginationAC.records"
            :key="item.id"
            :post-data="item"
            @click-category="clickCategory"
            @post-id="postId"
        />
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
        <div class="loader" v-show="isShowLoading"></div>
        <div class="pagination-block" ref="paginationBlockRef">
            <el-pagination
                v-model:current-page="paginationAC.current_page"
                v-model:page-size="paginationAC.page_size"
                :page-sizes="paginationAC.page_sizes"
                :page-count="paginationAC.page_count"
                :total="paginationAC.total"
                :background="true"
                layout="total, prev, pager, next, jumper, sizes"
                size="small"
                @update:current-page="updateCurrentPage"
                @update:page-size="updatePageSize"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted, useTemplateRef, nextTick, watch } from "vue"
import { useIntersectionObserver } from "@vueuse/core"
import PostItem from "@/components/common/post-item-main"
import { type PostResPagination } from "@/api/post/common"
import { type PostCategory } from "@/api/postCategory/view"
import { type Pagination, getEmptyPagination } from "@/api/response"

defineOptions({ name: "PostList" })

const { paginationData, isShowLoading = false } = defineProps<{
    paginationData: Pagination<PostResPagination>
    isShowLoading?: boolean // 是否显示loading
}>()

// 事件
const emit = defineEmits<{
    (event: "updateCurrentPage", val: number): void
    (event: "updatePageSize", val: number): void
    (event: "clickCategory", val: PostCategory): void
    (event: "postId", val: string): void
    (event: "paginationBlockVisible", val: boolean): void
}>()

// 当前分页数据
const paginationAC = reactive(getEmptyPagination<PostResPagination>())

// 分页组件 ref
const paginationBlockRef = useTemplateRef("paginationBlockRef")

// 更新当前页
const updateCurrentPage = (val: number) => {
    emit("updateCurrentPage", val)
}

// 更新每页显示数量
const updatePageSize = (val: number) => {
    emit("updatePageSize", val)
}

// 点击分类
const clickCategory = (val: PostCategory) => {
    emit("clickCategory", val)
}

// 点击文章
const postId = (val: string) => {
    emit("postId", val)
}

let stopIntersectionObserver: () => void // 停止监听函数
const isInitialRender = ref(true) // 是否是初始渲染

onMounted(async () => {
    await nextTick()

    const { stop } = useIntersectionObserver(paginationBlockRef, ([entry], observerElement) => {
        if (isInitialRender.value) {
            // 初次加载时不emit
            isInitialRender.value = false
        } else {
            // 非初次加载时，根据intersection情况emit
            emit("paginationBlockVisible", entry?.isIntersecting || false)
        }
    })

    stopIntersectionObserver = stop
})

watch(
    () => paginationData,
    (newVal) => {
        Object.assign(paginationAC, newVal)
    },
    { deep: true },
)

onUnmounted(() => {
    stopIntersectionObserver()
})
</script>
<style lang="scss" scoped>
.post-list {
    font-size: 14px;
    margin-top: 10px;
    border-left: 1px solid var(--jpz-border-color);
    border-right: 1px solid var(--jpz-border-color);
    // 除了最后一个元素显示下边框 其他都只显示上边框

    .post-item {
        border-top: 1px solid var(--jpz-border-color);

        &:last-child {
            border-bottom: 1px solid var(--jpz-border-color);
        }
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
    margin-top: 20px;
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
